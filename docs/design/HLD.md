# High Level Design (HLD)

## 1. Architectural Overview

The Comprehensive GST-Compliant Accounting Suite follows a modern, scalable client-server architecture built on a Turborepo monorepo. It comprises three primary clients interfacing with a central RESTful backend.

### Key Components:

1.  **Web Client (`apps/web`):** React SPA for comprehensive accounting operations, built with Ant Design.
2.  **Mobile Client (`apps/mobile`):** Flutter application utilizing an offline-first architecture with local SQLite storage and background synchronization.
3.  **API Gateway / Backend (`apps/api`):** NestJS service exposing modular REST endpoints, handling business logic, validation, and GST calculation.
4.  **Database:** PostgreSQL providing highly reliable, ACID-compliant data storage for all financial records.

## 2. Technology Stack

- **Monorepo:** Turborepo, npm workspaces.
- **Backend:** Node.js, NestJS, Prisma ORM, `decimal.js` (financial math), Swagger/OpenAPI.
- **Frontend (Web):** React 18, TypeScript, Ant Design, Tailwind CSS.
- **Frontend (Mobile):** Flutter, Dart, sqflite, provider/bloc (state management).
- **Database:** PostgreSQL 15+.
- **Infrastructure:** Docker, Docker Compose, NGINX.

## 3. Deployment Architecture

The MVP will utilize a containerized deployment strategy for consistency and scalability.

- **Reverse Proxy:** NGINX handles incoming traffic, SSL termination (HTTPS), and routes requests.
- **API Containers:** The NestJS backend will run in stateless Docker containers, enabling horizontal scaling behind a load balancer.
- **Web Containers:** The React build output will be served statically via NGINX.
- **Database:** A managed PostgreSQL instance (or dedicated Docker container for initial staging) connected via private networking.
- **Secrets Management:** All sensitive configuration (Database URIs, JWT Secrets) injected strictly via `.env` variables.

## 4. Module Boundaries (MVP Scope)

The backend is structured into modular domains using NestJS's module system.

- `AuthModule`: Custom JWT generation, TOTP validation, user authentication.
- `UsersModule`: User profiling and Role-Based Access Control (RBAC).
- `OrganizationsModule`: Multi-tenant structural data (initially single-tenant for MVP).
- `ContactsModule`: Customer and Vendor master data, including GSTIN profiles.
- `InvoicesModule`: Sales invoice lifecycle, item management, and PDF generation.
- `ExpensesModule`: Expense logging, purchase bills, and categorization.
- `BankingModule`: Bank accounts and transaction logging.
- `TaxEngineModule`: Centralized service for Place of Supply rules, calculating CGST/SGST/IGST, and rounding logic.
- `ReportsModule`: Read-only aggregations for Trial Balance, P&L, and GSTR extracts.

## 5. Security Model

- **Authentication:** Custom implementation using signed JWTs. Access tokens have short lifespans (e.g., 15 mins). Refresh tokens are rotated and stored in HTTP-only, secure cookies to mitigate XSS attacks.
- **Authorization:** Strict RBAC enforced via NestJS Guards at every endpoint.
- **Data Protection:** Passwords hashed with bcrypt (minimum cost factor 10). Transport security strictly via HTTPS.
- **Immutability:** Financial data heavily utilizes soft-deletes via Prisma to ensure audit trails remain intact. No hard deletes are permitted on invoices or general ledger entries.
