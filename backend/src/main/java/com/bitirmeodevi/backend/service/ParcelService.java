package com.bitirmeodevi.backend.service;

import com.bitirmeodevi.backend.model.Parcel;
import com.bitirmeodevi.backend.repository.ParcelRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ParcelService {

    private final ParcelRepository parcelRepository;

    public ParcelService(ParcelRepository parcelRepository) {
        this.parcelRepository = parcelRepository;
    }

    public Map<String, String> createParcel(
            Map<String, Object> geoJson,
            String ownerUsername) {

        Map<String, Object> geometry = extractGeometry(geoJson);

        Parcel parcel = new Parcel(
                UUID.randomUUID(),
                ownerUsername,
                geometry
        );

        parcelRepository.save(parcel);

        return Map.of(
                "status", "created",
                "id", parcel.getId().toString()
        );
    }

    public Map<String, Object> getParcel(
            UUID id,
            String ownerUsername) {

        Parcel parcel = parcelRepository
                .findByIdAndOwnerUsername(id, ownerUsername)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Parsel bulunamadi"
                ));

        return toFeature(parcel);
    }

    public Map<String, Object> getParcels(String ownerUsername) {

        List<Map<String, Object>> features = parcelRepository
                .findAllByOwnerUsername(ownerUsername)
                .stream()
                .map(this::toFeature)
                .toList();

        return Map.of(
                "type", "FeatureCollection",
                "features", features
        );
    }

    private Map<String, Object> toFeature(Parcel parcel) {
        return Map.of(
                "type", "Feature",
                "id", parcel.getId().toString(),
                "properties", Map.of(),
                "geometry", parcel.getGeometry()
        );
    }

    private Map<String, Object> extractGeometry(
            Map<String, Object> geoJson) {

        Map<?, ?> geometry = geoJson;

        if ("Feature".equals(geoJson.get("type"))) {
            Object value = geoJson.get("geometry");

            if (!(value instanceof Map<?, ?>)) {
                throw invalidGeoJson();
            }

            geometry = (Map<?, ?>) value;
        }

        Object type = geometry.get("type");
        Object coordinates = geometry.get("coordinates");

        if (!"Polygon".equals(type) && !"MultiPolygon".equals(type)) {
            throw invalidGeoJson();
        }

        if (!(coordinates instanceof List<?> coordinateList)
                || coordinateList.isEmpty()) {
            throw invalidGeoJson();
        }

        return Map.of(
                "type", type,
                "coordinates", coordinates
        );
    }

    private ResponseStatusException invalidGeoJson() {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Polygon veya MultiPolygon geometrisi gondermelisiniz"
        );
    }
}