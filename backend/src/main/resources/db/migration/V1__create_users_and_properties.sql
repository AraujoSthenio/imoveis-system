-- ============================================================
-- V1: Tabelas base + campos de auditoria + triggers
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função genérica de auditoria (CREATE / UPDATE)
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := COALESCE(NEW.created_at, NOW());
        NEW.updated_at := COALESCE(NEW.updated_at, NOW());
        NEW.version    := COALESCE(NEW.version, 0);
        -- updated_by deve ser setado pela aplicação quando houver usuário autenticado
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        NEW.created_at := OLD.created_at;   -- nunca altera
        NEW.updated_at := NOW();
        -- version é controlado pelo Hibernate (@Version) — não incrementamos aqui
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- Tabela: users
-- ------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(120) NOT NULL UNIQUE,
    name            VARCHAR(120) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(30)  NOT NULL DEFAULT 'USER',

    -- Auditoria
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_by      VARCHAR(120),
    version         BIGINT       NOT NULL DEFAULT 0
);

CREATE TRIGGER trg_users_audit
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE audit_trigger_func();

-- ------------------------------------------------------------
-- Tabela: properties
-- ------------------------------------------------------------
CREATE TABLE properties (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(200) NOT NULL,
    description         TEXT,
    price               NUMERIC(14,2) NOT NULL,
    transaction_type    VARCHAR(20)  NOT NULL,
    property_type       VARCHAR(30)  NOT NULL,
    area_m2             NUMERIC(10,2),
    bedrooms            INTEGER,
    bathrooms           INTEGER,
    parking_spaces      INTEGER,
    street              VARCHAR(150),
    number              VARCHAR(20),
    neighborhood        VARCHAR(100),
    city                VARCHAR(100),
    state               CHAR(2),
    zip_code            VARCHAR(12),
    active              BOOLEAN      NOT NULL DEFAULT TRUE,
    owner_id            UUID REFERENCES users(id),

    -- Auditoria
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_by          VARCHAR(120),
    version             BIGINT       NOT NULL DEFAULT 0
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_transaction_type ON properties(transaction_type);
CREATE INDEX idx_properties_active ON properties(active);

CREATE TRIGGER trg_properties_audit
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE PROCEDURE audit_trigger_func();
