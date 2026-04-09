# Software Requirements Specification (SRS)

## 1. System Overview

The **Comprehensive GST-Compliant Accounting Web & Mobile Suite** is a modern, hybrid ERP solution designed specifically for Tinplate Computer Training Center and small-to-medium enterprises (SMEs) in India. The system bridges the gap between traditional robust desktop accounting software (like Tally Prime) and modern cloud-native solutions (like Zoho Books).

The platform strictly adheres to Indian GST laws and provides users with a reliable web application and an offline-first mobile application. The initial deployment (MVP) focuses heavily on core master data, sales/invoicing, expense tracking, manual banking reconciliation, and crucial GST compliance, designed to be built over a 12-week schedule.

## 2. Functional Requirements

The following requirements align with the scoped 12-week MVP.

### 2.1 Core Platform (Authentication & Administration)

- **FR-1:** The system shall authenticate users via custom JWT and support Time-Based One-Time Password (TOTP) for Multi-Factor Authentication.
- **FR-2:** The system shall allow administrators to manage a single root Organization, updating its GSTIN, address, and legal entity details.
- **FR-3:** The system shall support Role-Based Access Control (RBAC) to enforce permissions at the module and field levels.

### 2.2 Customer & Vendor Management

- **FR-4:** The system shall allow the creation, retrieval, updating, and soft-deletion of Customer and Vendor profiles (Master Data).
- **FR-5:** The system shall validate Indian GSTIN formats and prevent saving duplicate GSTINs for the same entity type.

### 2.3 Sales, Invoicing & GST Engine

- **FR-6:** The system shall allow users to generate Sales Invoices with multiple line items.
- **FR-7:** The system shall automatically calculate CGST, SGST, and IGST based on the Place of Supply rules (intra-state vs. inter-state) configured by the Organization's and Customer's GSTINs.
- **FR-8:** The system shall allow users to select or input HSN/SAC codes for every line item on an invoice.
- **FR-9:** The system shall generate professional PDF representations of saved invoices.

### 2.4 Purchases & Expenses

- **FR-10:** The system shall allow users to log internal expenses with categorized chart-of-accounts mapping.
- **FR-11:** The system shall allow users to record purchase bills from vendors.

### 2.5 Banking & Reconciliation

- **FR-12:** The system shall allow users to create and manage multiple Bank Accounts within the organization.
- **FR-13:** The system shall allow users to manually log bank transactions (deposits and withdrawals) and reconcile them against existing invoices and expenses.

### 2.6 Financial Reports

- **FR-14:** The system shall generate a real-time Trial Balance.
- **FR-15:** The system shall generate a Profit & Loss statement and Balance Sheet based on selected date ranges.
- **FR-16:** The system shall extract and format data required for GSTR-1 and GSTR-3B filings.

### 2.7 Mobile Application (Offline-First)

- **FR-17:** The mobile app shall allow users to securely log in while online and maintain session persistence for offline use.
- **FR-18:** The mobile app shall cache essential Master Data (Customers, Vendors, Item codes) for offline access.
- **FR-19:** The mobile app shall allow the creation of new Invoices and new Expenses while entirely offline.
- **FR-20:** The mobile app shall automatically synchronize locally created data to the web backend once an internet connection is restored, utilizing deterministic conflict resolution.

## 3. Non-Functional Requirements

### 3.1 Security & Access

- **NFR-1:** All network traffic shall be encrypted using HTTPS/TLS.
- **NFR-2:** User passwords must be securely hashed using bcrypt prior to database storage. No plain-text passwords shall ever be stored.
- **NFR-3:** The system must utilize short-lived access tokens and secure, HTTP-only refresh tokens.
- **NFR-4:** Every financial transaction must generate an immutable audit log entry including timestamp, user ID, and action taken.

### 3.2 Performance & Reliability

- **NFR-5:** Web API requests (excluding complex reporting and PDF generation) should respond within 300 milliseconds at the 95th percentile.
- **NFR-6:** PDF generation must be handled asynchronously or utilizing worker threads to prevent blocking the main API event loop.
- **NFR-7:** All financial calculations within the backend codebase must use precise decimal mathematics (`decimal.js`) to completely eliminate floating-point rounding errors.

### 3.3 Architecture & Deployment

- **NFR-8:** The backend and frontend must reside in a Turborepo monorepo, utilizing NestJS and React respectively. The mobile application must reside in `apps/mobile` but strictly opt out of Turborepo build steps.
- **NFR-9:** The platform must be containerized using Docker to ensure environment parity across staging and production.

## 4. User Roles and Permissions

| Role                          | Description                  | Core Permissions                                                                                                                |
| :---------------------------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **Super Admin**               | Full system control.         | All read/write access. Can manage organization settings, user accounts, and assign roles.                                       |
| **Accountant**                | Financial management focus.  | Read/write access to Invoices, Expenses, Banking, and Reports. Can view audit logs. Cannot modify global organization settings. |
| **Field Staff / Sales**       | Mobile-focused data entry.   | Create-only access for Invoices and Expenses. Read-only access to Customer master data. Cannot view global financial reports.   |
| **Auditor (Future/Optional)** | Read-only compliance review. | Read-only access to all financial records and audit logs.                                                                       |

## 5. Use Cases and User Stories

### Use Case 1: Creating an Invoice (Web)

**User Story:** As an Accountant, I want to create a sales invoice for a customer so that I can bill them and automatically calculate the correct GST amounts.

- **Trigger:** User clicks "New Invoice".
- **Flow:** User selects a Customer -> System fetches Customer GSTIN -> User adds items with quantities, rates, and HSN codes -> System calculates CGST/SGST (if local) or IGST (if inter-state) -> User saves -> System generates PDF.

### Use Case 2: Logging an Expense (Offline Mobile)

**User Story:** As a Field Staff member without internet, I want to log a travel expense on my mobile device so that I don't forget to claim it later.

- **Trigger:** User opens app offline, clicks "New Expense".
- **Flow:** User enters amount, category, and date -> User saves -> Data is saved to local SQLite storage on device -> App indicates "Pending Sync" -> When online, background sync pushes data to backend.

### Use Case 3: Reviewing Trial Balance

**User Story:** As a Business Owner, I want to view the Trial Balance to ensure total debits equal total credits at any given moment.

- **Trigger:** User navigates to Reports -> Trial Balance.
- **Flow:** System aggregates all validated journal entries -> System displays a balanced ledger -> User exports as CSV.

## 6. Data Requirements

- **Database Engine:** PostgreSQL.
- **Currency Storage:** All monetary values must be stored in standard database columns as `DECIMAL(15,2)`. Integer/Paise storage is strictly prohibited to align with chosen architectural paradigms.
- **Immutability Strategy:** Financial records (like published Invoices) cannot be hard-deleted. They must utilize Soft Delete mechanisms (`deleted_at` timestamp) or be voided via a status change to preserve the audit trail.
- **Foreign Keys:** Strict relational integrity must be maintained using Foreign Keys (e.g., An Invoice must link to a valid Customer ID).

## 7. GST Compliance Requirements

The system must satisfy these rigorous Indian GST rules:

- **Place of Supply:** The system must dynamically determine the tax type based on the Organization's Registered State vs the Customer's Registered State. Same state = CGST + SGST (split equally). Different states = IGST (full percentage).
- **HSN / SAC Tracking:** Every line item on an invoice must accept a valid Harmonized System of Nomenclature (HSN) or Service Accounting Code (SAC).
- **GSTR Extracts:** The system must be capable of extracting line-level sales data mapped exactly to the required fields for the Government GSTR-1 return portal.
- **Rounding Rules:** Tax amounts must be calculated at the line-item level, rounded to two decimal places, before being summed for the invoice total.
