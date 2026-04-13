# Project Charter – Tinplate ERP Accounting System

## 1. Project Goal
Build a web + mobile ERP accounting system (Zoho Books equivalent) with full GST compliance, dynamic business type support, and a customizable dashboard.

## 2. High-Level Scope
- Web app (React + Node.js + PostgreSQL)
- Mobile app (Flutter, Android + iOS)
- Modules: Sales (Customers, Quotes/Estimates, Sales Orders, Invoices, Recurring Invoices, Payments Received, Credit Notes, Delivery Challans), Purchases (Vendors, Purchase Orders, Bills, Recurring Bills, Payments Made, Vendor Credits, Expenses), Inventory (Items, Item Groups, Stock Management, Inventory Adjustments, Warehouses, Shipments/Packages), Banking (Bank Accounts, Bank Feeds, Reconciliation, Transaction Categorization), Accounting (Chart of Accounts, Journals, Ledger Management, Currency Adjustments, Transaction Locking, Bulk Updates), Reporting (Profit & Loss, Balance Sheet, Cash Flow, GST Reports, Custom Reports, Aging Reports, Reports Center), Automation (Workflow Rules, Event Triggers, Scheduled Actions, Email/SMS Notifications, Execution Logs), CRM (Leads, Customers, Contact Persons, Communication History, Sales Pipeline), Project/Timesheet (Projects, Tasks, Timesheets, Time Logs, Billing, Project Expenses), Document Management (File Uploads, Receipt Scanning, OCR Extraction, Bank Statement Parsing, Document Linking), Dashboard (Custom Widgets, Drag-and-Drop Layout, Daily Insights, Financial Summary), Taxation (GST) (CGST, SGST, IGST, HSN/SAC Codes, GST Filing, Tax Reports), Customization Engine (Custom Modules, Custom Fields, Layout Builder, Workflow Builder), Integrations (Payment Gateways, Banking APIs, Third-party APIs), User Management (Roles, Permissions, Multi-user Access), Business Type Engine (Industry Templates, Dynamic Modules, Default Workflows), Mobile Sync (Real-time Sync, Offline Mode, Notifications), Security & Compliance (Authentication, Authorization, Data Encryption, Audit Logs), DevOps & Monitoring (Deployment, Logging, Performance Monitoring, Error Tracking) 


## 3. Key Stakeholders
- Client: Tinplate Computer Training Center, Jamshedpur.
- End users: Small to large businesses (School, Retail, Hospital, etc.)

## 4. Timeline Constraint
3 months from today (65 working days). Aggressive – requires prioritisation.

## 5. Budget Assumptions
(Leave blank – to be filled later)

## 6. High-Level Risks (Initial)
- Timeline too short for Zoho-level features → need MVP scope definition.
- Actually, for ERP: Risk of scope creep due to "all features of Zoho Books".
- Architectural risk: Business type engine + dynamic module builder significantly increases backend complexity. May require additional design time.
- Technical risk: Real-time dashboard with "Today-first" receivables/payables may be complex.
- Third-party integrations (payment gateways, bank feeds) may delay delivery.

## 7. Success Criteria (Measurable)
- User can create an invoice from web or mobile within 5 clicks.
- Dashboard shows today's receivables and payables within 2 seconds of login.
- GST reports match government format.
- Custom module builder allows adding a new field without code changes.