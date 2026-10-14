package com.bitirmeodevi.backend.controller;

import com.bitirmeodevi.backend.service.ParcelService;
import java.security.Principal;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/parcels")
public class ParcelController {

    private final ParcelService parcelService;

    public ParcelController(ParcelService parcelService) {
        this.parcelService = parcelService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> createParcel(
            @RequestBody Map<String, Object> geoJson,
            Principal principal) {

        return parcelService.createParcel(
                geoJson,
                currentUsername(principal)
        );
    }

    @GetMapping(
            value = "/{id}",
            produces = "application/geo+json"
    )
    public Map<String, Object> getParcel(
            @PathVariable("id") UUID id,
            Principal principal) {

        return parcelService.getParcel(
                id,
                currentUsername(principal)
        );
    }

    @GetMapping(produces = "application/geo+json")
    public Map<String, Object> getParcels(Principal principal) {
        return parcelService.getParcels(
                currentUsername(principal)
        );
    }

    private String currentUsername(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Giris yapmalisiniz"
            );
        }

        return principal.getName();
    }
}