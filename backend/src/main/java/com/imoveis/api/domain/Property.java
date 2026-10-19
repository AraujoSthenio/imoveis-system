package com.imoveis.api.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.*;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Column(name = "area_m2", precision = 10, scale = 2)
    private BigDecimal areaM2;

    private Integer bedrooms;
    private Integer bathrooms;
    private Integer parkingSpaces;

    @Column(length = 150)
    private String street;

    @Column(length = 20)
    private String number;

    @Column(length = 100)
    private String neighborhood;

    @Column(length = 100)
    private String city;

    @Column(length = 2)
    private String state;

    @Column(length = 12)
    private String zipCode;

    @Column(nullable = false)
    private Boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    public enum TransactionType {
        SALE, RENT
    }

    public enum PropertyType {
        APARTMENT, HOUSE, COMMERCIAL, LAND, OTHER
    }
}
