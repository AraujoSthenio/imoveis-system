package com.imoveis.api.web.dto;

import com.imoveis.api.domain.Property;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

public record PropertyRequest(
        @NotBlank @Size(max = 200) String title,
        String description,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotNull Property.TransactionType transactionType,
        @NotNull Property.PropertyType propertyType,
        BigDecimal areaM2,
        Integer bedrooms,
        Integer bathrooms,
        Integer parkingSpaces,
        String street,
        String number,
        String neighborhood,
        String city,
        @Size(max = 2) String state,
        String zipCode,
        UUID ownerId
) {}
