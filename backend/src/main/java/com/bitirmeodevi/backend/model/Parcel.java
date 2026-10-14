package com.bitirmeodevi.backend.model;

import java.util.Map;
import java.util.UUID;

public class Parcel {

    private final UUID id;
    private final String ownerUsername;
    private final Map<String, Object> geometry;

    public Parcel(
            UUID id,
            String ownerUsername,
            Map<String, Object> geometry) {
        this.id = id;
        this.ownerUsername = ownerUsername;
        this.geometry = geometry;
    }

    public UUID getId() {
        return id;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public Map<String, Object> getGeometry() {
        return geometry;
    }
}