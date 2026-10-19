# Sistema de Venda e Aluguel de Imóveis

Esqueleto inicial **monorepo** com:

- **Backend**: Spring Boot 4.1 + Java 21 + Maven + Spring Data JPA + Flyway + Spring Security
- **Frontend**: Angular 22 (standalone components + signals)
- **Banco**: PostgreSQL
- **Auditoria**: campos `created_at`, `updated_at`, `updated_by`, `version` preenchidos por **triggers** no banco
- **CI**: GitHub Actions (build + testes backend e frontend)

---

## Estrutura

```
imoveis-system/
├── backend/                 # Spring Boot API
│   ├── src/main/java/...
│   ├── src/main/resources/db/migration/
│   └── Dockerfile
├── frontend/                # Angular SPA
├── docker-compose.yml       # Postgres + API local
└── .github/workflows/ci.yml
```

---

## Pré-requisitos

- Java 21+
- Maven 3.9+ (ou use o `./mvnw`)
- Node.js 20+ / 22+
- Docker (opcional, recomendado)

---

## Subir localmente

### 1. Banco + API (Docker)

```bash
docker compose up --build
```

API: http://localhost:8080  
Postgres: `localhost:5432` (user/pass/db: `imoveis`)

### 2. Ou só o banco e rodar a API manualmente

```bash
docker compose up db -d
cd backend
./mvnw spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend: http://localhost:4200

---

## Auditoria (triggers)

Todas as entidades herdam de `AuditableEntity`:

| Campo        | Preenchimento                          |
|--------------|----------------------------------------|
| `created_at` | Trigger no INSERT                      |
| `updated_at` | Trigger no UPDATE (e INSERT)           |
| `updated_by` | Aplicação (quando houver usuário logado) |
| `version`    | Trigger incrementa no UPDATE (default 0) + `@Version` Hibernate |

A função `audit_trigger_func()` está na migration `V1__create_users_and_properties.sql`.

---

## Endpoints principais

| Método | Path                    | Descrição              |
|--------|-------------------------|------------------------|
| GET    | `/api/properties`       | Listagem / busca       |
| GET    | `/api/properties/{id}`  | Detalhe                |
| POST   | `/api/properties`       | Criar                  |
| PUT    | `/api/properties/{id}`  | Atualizar              |
| DELETE | `/api/properties/{id}`  | Soft delete (active=false) |

Query params de busca: `city`, `transactionType` (SALE|RENT), `propertyType`, `page`, `size`.

---

## Deploy gratuito (sugestão)

1. **Banco**: [Neon](https://neon.tech) ou Supabase (Postgres free)
2. **Backend**: [Render](https://render.com) (Web Service + Docker)  
   - Variáveis: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
3. **Frontend**: [Vercel](https://vercel.com) ou Netlify  
   - Ajuste `environment.prod.ts` com a URL do backend

---

## Próximos passos sugeridos

- [ ] Autenticação JWT + preenchimento de `updated_by`
- [ ] Upload de imagens (Cloudflare R2 / S3)
- [ ] Filtros avançados e paginação no frontend
- [ ] Testes de integração no backend
- [ ] Proteção de rotas de escrita

---

Gerado como esqueleto inicial para o projeto de imóveis.
