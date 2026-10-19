package com.imoveis.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

/**
 * Classe base com campos de auditoria.
 * Os valores de created_at, updated_at e updated_by são preenchidos
 * exclusivamente por triggers do banco (PostgreSQL).
 * O campo version é controlado pelo Hibernate (optimistic locking)
 * e também tem default 0 na migration.
 */
@MappedSuperclass
@Getter
@Setter
public abstract class AuditableEntity {

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;
}
