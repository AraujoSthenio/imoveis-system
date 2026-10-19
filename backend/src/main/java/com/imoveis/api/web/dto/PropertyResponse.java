package com.imoveis.api.web.dto;

import com.imoveis.api.domain.Property;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record PropertyResponse(
        UUID id,
        String title,
        String description,
        BigDecimal price,
        Property.TransactionType transactionType,
        Property.PropertyType propertyType,
        BigDecimal areaM2,
        Integer bedrooms,
        Integer bathrooms,
        Integer parkingSpaces,
        String street,
        String number,
        String neighborhood,
        String city,
        String state,
        String zipCode,
        Boolean active,
        UUID ownerId,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        String updatedBy,
        Long version
) {
    public static PropertyResponse from(Property p) {
        return new PropertyResponse(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getPrice(),
                p.getTransactionType(),
                p.getPropertyType(),
                p.getAreaM2(),
                p.getBedrooms(),
                p.getBathrooms(),
                p.getParkingSpaces(),
                p.getStreet(),
                p.getNumber(),
                p.getNeighborhood(),
                p.getCity(),
                p.getState(),
                p.getZipCode(),
                p.getActive(),
                p.getOwner() != null ? p.getOwner().getId() : null,
                p.getCreatedAt(),
                p.getUpdatedAt(),
                p.getUpdatedBy(),
                p.getVersion()
        );
    }
}
