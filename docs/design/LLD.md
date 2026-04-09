# Low Level Design (LLD)

## 1. Database Schema Design (PostgreSQL / Prisma)

The schema prioritizes referential integrity and precision. Below is an overview of the core MVP tables.

### 1.1 Core Platform

- **User:** `id`, `email`, `password_hash`, `role`, `totp_secret`, `is_active`, `created_at`, `updated_at`.
- **Organization:** `id`, `name`, `legal_name`, `gstin`, `address`, `state_code`, `created_at`, `updated_at`.
- **AuditLog:** `id`, `user_id`, `action`, `entity_type`, `entity_id`, `timestamp`.

### 1.2 Master Data

- **Contact:** `id`, `organization_id`, `type` (CUSTOMER/VENDOR), `name`, `gstin`, `address`, `state_code`, `created_at`, `deleted_at`.
- **Item:** `id`, `organization_id`, `name`, `type` (GOODS/SERVICES), `hsn_sac_code`, `tax_rate`, `unit_price` (DECIMAL(15,2)).

### 1.3 Transactions & Finance

- **Invoice:** `id`, `organization_id`, `customer_id`, `invoice_number`, `date`, `total_amount` (DECIMAL), `cgst_total` (DECIMAL), `sgst_total` (DECIMAL), `igst_total` (DECIMAL), `status` (DRAFT/PUBLISHED/VOID), `created_at`, `deleted_at`.
- **InvoiceLineItem:** `id`, `invoice_id`, `item_id`, `quantity`, `rate` (DECIMAL), `tax_rate`, `cgst_amount`, `sgst_amount`, `igst_amount`, `total` (DECIMAL).
- **Expense:** `id`, `organization_id`, `vendor_id` (nullable), `category`, `amount` (DECIMAL), `date`, `description`, `created_at`, `deleted_at`.
- **BankAccount:** `id`, `organization_id`, `account_name`, `account_number`, `current_balance` (DECIMAL).
- **Transaction:** `id`, `bank_account_id`, `type` (CREDIT/DEBIT), `amount` (DECIMAL), `reference_type` (INVOICE/EXPENSE/MANUAL), `reference_id`, `date`.

## 2. API Design Specifications

All APIs are RESTful, documented with Swagger, and prefixed with `/api/v1`. All financial amounts in JSON payloads will be represented as strings to prevent JS floating-point issues, parsed via `decimal.js` on the backend.

### Sample Endpoints:

- `POST /api/v1/auth/login`: Accepts credentials, returns JWT access token and sets HTTP-only refresh token.
- `GET /api/v1/contacts`: Returns paginated list of customers/vendors.
- `POST /api/v1/invoices`:
  - **Request:** `customerId`, `date`, `items: [{ itemId, quantity, rate }]`.
  - **Backend Logic:** Validates Customer. Calculates Place of Supply (Org State vs Customer State). Applies `decimal.js` logic for line-item tax. Inserts Invoice and LineItems within a PostgreSQL transaction.
  - **Response:** Created `Invoice` object with calculated totals.
- `POST /api/v1/sync/mobile`: Accepts batch of offline-created Invoices and Expenses with local IDs. Returns mapping of local IDs to server-generated UUIDs.

## 3. Service Architecture

The NestJS application utilizes a layered architecture:

- **Controllers:** Handle HTTP routing, payload validation (via class-validator), and DTO transformation.
- **Services:** Contain the core business logic (e.g., `TaxEngineService`).
- **Repositories / DAO:** Prisma Client wrappers to encapsulate database queries and transactions.

### 3.1 Financial Calculation Engine Rules

1.  All math uses `new Decimal(value)`.
2.  `Line Item Tax Amount = Round(Quantity * Rate * (Tax Rate / 100), 2)`.
3.  `Invoice Total Tax = Sum(Line Item Tax Amounts)`. (Do not calculate tax on the invoice subtotal to prevent rounding discrepancies across multiple items).
4.  If Place of Supply is Intra-state: `CGST = Tax Amount / 2`, `SGST = Tax Amount / 2`.
5.  If Inter-state: `IGST = Tax Amount`.

## 4. Mobile Offline Synchronization Workflow

To satisfy the offline-first requirement, the Flutter app utilizes the following sync mechanism:

1.  **Local Storage:** Data created offline is saved to local SQLite with a temporary `local_id` (e.g., negative integer or local UUID) and a `sync_status` flag of `PENDING`.
2.  **Network Listener:** When the device detects a stable connection, a background sync service initiates.
3.  **Upstream Sync:** The app posts batched `PENDING` records to the `/api/v1/sync/mobile` endpoint.
4.  **Backend Processing:** The backend validates and inserts records into PostgreSQL. It returns a mapping table.
5.  **Local Reconciliation:** The mobile app updates its local SQLite rows, replacing `local_id` with the true server `id` and changing `sync_status` to `SYNCED`.
6.  **Conflict Strategy:** MVP utilizes "Server Wins" for master data updates, but strictly focuses offline capabilities on "Create Only" actions for transactional data (Invoices/Expenses) to eliminate complex edit merge conflicts.
