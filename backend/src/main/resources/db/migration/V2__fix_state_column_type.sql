-- Alinha a coluna state com o que o Hibernate espera (VARCHAR)
ALTER TABLE properties
    ALTER COLUMN state TYPE VARCHAR(2);