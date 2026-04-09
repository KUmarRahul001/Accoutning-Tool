# Development Roadmap

The MVP will be delivered over a 12-week period, structured into six 2-week sprints. This timeline ensures a measured, high-quality delivery following the strict Enterprise SDLC process.

## Sprint 1: Planning, Architecture & Auth Foundation (Weeks 1-2)
* Complete Phase 1 (Planning) and Phase 2 (Feasibility).
* Define Phase 3 (SRS) and Phase 4 (HLD/LLD) for the Core Platform.
* Setup Turborepo monorepo, NestJS backend, and React frontend skeleton.
* Implement database schema for Users, Roles, and Organizations.
* Develop custom JWT and TOTP authentication mechanisms.

## Sprint 2: Core Master Data & Web Shell (Weeks 3-4)
* Develop Customer and Vendor management modules (APIs and UI).
* Implement GSTIN validation logic and master data schemas.
* Finalize the React/AntD web application shell (navigation, layout, routing, error handling).
* Implement comprehensive API documentation (Swagger) for completed modules.

## Sprint 3: Sales, Invoicing & GST Engine (Weeks 5-6)
* Develop the core GST calculation engine utilizing `decimal.js`.
* Implement Invoice creation workflows (database, APIs, UI).
* Handle Place of Supply rules for accurate CGST/SGST vs IGST calculation.
* Build support for HSN/SAC code management.
* Write rigorous unit tests for all tax calculations.

## Sprint 4: Expenses & Banking (Weeks 7-8)
* Implement Expense entry and Purchase bill management.
* Develop Bank account master data and basic transaction logging.
* Build the manual reconciliation interface.
* Ensure all related financial entries correctly update the general ledger/journal structures.

## Sprint 5: Reporting & Integration Stubs (Weeks 9-10)
* Develop financial reporting APIs (Trial Balance, P&L, Balance Sheet).
* Create endpoints for extracting GST report data (GSTR-1, GSTR-3B).
* Build the React UI for viewing and exporting these reports.
* Define architecture and stub endpoints for future integrations.

## Sprint 6: Mobile MVP, Hardening & Deployment (Weeks 11-12)
* Develop the Flutter Mobile App (Login, Dashboard).
* Implement offline-first local storage for Mobile Invoices and Expenses.
* Build synchronization logic between Mobile App and NestJS backend.
* Conduct comprehensive security, performance, and user acceptance testing.
* Finalize Docker/docker-compose deployment configurations.
* Produce final deployment runbooks and maintenance documentation.
