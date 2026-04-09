# High Level Project Scope

The project will be executed using an MVP-first, phased rollout strategy. The system is designed to eventually encompass 16 enterprise modules, but the initial focus is strictly on delivering a stable, functional MVP.

## 1. MVP Scope (Phase 1 to Phase 7 Delivery)

The MVP will deliver the essential features required for daily accounting and GST compliance.

### Priority 1: Core Platform
* Custom Authentication (JWT + TOTP MFA).
* Organization Management (single-tenant context for MVP, multi-tenant capable architecture).
* Roles & Permissions (RBAC implementation).
* Basic Audit Logging.

### Priority 2: Customer & Vendor Management
* Master data management for Clients and Vendors.
* GSTIN validation capabilities.

### Priority 3: Sales, Invoicing & GST Engine
* Invoice creation (Web and Mobile).
* Calculation of CGST, SGST, IGST based on Place of Supply rules.
* Support for HSN/SAC codes.

### Priority 4: Purchases & Expenses
* Expense logging (Web and Mobile).
* Purchase bill management.

### Priority 5: Banking & Reconciliation
* Bank account management.
* Basic transaction logging and reconciliation interface.

### Priority 6: Financial Reports
* Basic financial statements (Trial Balance, P&L, Balance Sheet).
* Core GST Reports (GSTR-1, GSTR-3B data extracts).

### Priority 7: Mobile MVP
* Offline-first Flutter application.
* Features: Secure Login, Dashboard, Invoice Creation (offline), Expense Entry (offline), and background synchronization.

## 2. Out of Scope for MVP (Future Phases)

The following modules will be architected for future inclusion but are **not** part of the initial MVP build:

* Inventory Management (Stock tracking, warehousing).
* Projects & Time Tracking.
* Fixed Assets Management.
* Automation & Workflow Engine.
* Client/Vendor Portals.
* Advanced Integrations (e.g., Payment Gateways, live banking feeds).
* System Administration (Advanced global controls beyond basic organization setup).
* Direct Data Migration from existing legacy systems (e.g., live Tally imports).

## 3. Technical Boundaries
* **Backend:** NestJS, Prisma, PostgreSQL.
* **Frontend:** React, TypeScript, Ant Design, Tailwind CSS.
* **Mobile:** Flutter (excluded from Turborepo build management).
* **Calculations:** Strict use of `decimal.js` / `big.js` for all financial math; storage in `DECIMAL(15,2)`.
* **Deployment:** Dockerized environment.
