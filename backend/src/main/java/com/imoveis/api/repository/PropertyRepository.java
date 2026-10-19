package com.imoveis.api.repository;

import com.imoveis.api.domain.Property;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyRepository extends JpaRepository<Property, UUID> {

    Page<Property> findByActiveTrue(Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE p.active = true
          AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', CAST(:city AS string), '%')))
          AND (:transactionType IS NULL OR p.transactionType = :transactionType)
          AND (:propertyType IS NULL OR p.propertyType = :propertyType)
        """)
    Page<Property> search(
            @Param("city") String city,
            @Param("transactionType") Property.TransactionType transactionType,
            @Param("propertyType") Property.PropertyType propertyType,
            Pageable pageable);
}
