package com.bitirmeodevi.backend.repository;

import com.bitirmeodevi.backend.model.Parcel;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class ParcelRepository {

    private final Map<UUID, Parcel> parcels =
            new ConcurrentHashMap<>();

    public Parcel save(Parcel parcel) {
        parcels.put(parcel.getId(), parcel);
        return parcel;
    }

    public Optional<Parcel> findByIdAndOwnerUsername(
            UUID id,
            String ownerUsername) {

        Parcel parcel = parcels.get(id);

        if (parcel == null
                || !parcel.getOwnerUsername().equals(ownerUsername)) {
            return Optional.empty();
        }

        return Optional.of(parcel);
    }

    public List<Parcel> findAllByOwnerUsername(String ownerUsername) {
        return parcels.values()
                .stream()
                .filter(parcel ->
                        parcel.getOwnerUsername().equals(ownerUsername))
                .toList();
    }
}