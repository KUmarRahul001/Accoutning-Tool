# Software Requirements Specification (SRS)
## Tinplate ERP Accounting System

## 1. Introduction
### 1.1 Purpose
Define functional and non‑functional requirements for the ERP system.

### 1.2 Scope
Web (React) + Mobile (Flutter) + Backend (Node.js+PostgreSQL+redis+bullmQ) with multi‑tenant support.

## 2. Functional Requirements (by Module)

### 2.1 Sales Module
| Feature | Priority | Notes |
|---------|----------|-------|
| Customers (CRUD, contacts, addresses) | Must | |
| Quotes/Estimates → Invoice flow | Must | |
| Sales Orders with stock check | Must | |
| Invoices (GST, recurring) | Must | |
| Payments received (partial/full) | Must | |
| Credit Notes | Should | |
| Delivery Challans | Could | |

### 2.2 Purchase Module
| Feature | Priority | Notes |
|---------|----------|-------|
| Vendors | Must | |
| Purchase Orders | Must | |
| Bills (payable) | Must | |
| Payments made | Must | |
| Vendor Credits | Should | |
| Recurring Bills | Could | |

### 2.3 Inventory Module
| Feature | Priority | Notes |
|---------|----------|-------|
| Items / Item Groups | Must | |
| Stock Management (in/out) | Must | |
| Inventory Adjustments | Should | |
| Warehouses | Could | |

### 2.4 Banking Module
| Feature | Priority | Notes |
|---------|----------|-------|
| Bank Accounts | Must | |
| Reconciliation | Should | |
| Bank Feeds (API) | Could | Requires third‑party |

### 2.5 Accounting Module
| Feature | Priority | Notes |
|---------|----------|-------|
| Chart of Accounts | Must | |
| Journals (manual) | Must | |
| Ledger | Must | |
| Transaction Locking | Should | |
| Currency Adjustments | Could | |

### 2.6 Reporting Module
| Feature | Priority | Notes |
|---------|----------|-------|
| Profit & Loss | Must | |
| Balance Sheet | Must | |
| Cash Flow | Must | |
| GST Reports | Must | |
| Aging Reports (AR/AP) | Must | |
| 70+ custom reports | Could | Build reusable engine |

### 2.7 GST & Taxation (India)
| Feature | Priority | Notes |
|---------|----------|-------|
| CGST/SGST/IGST calculation | Must | |
| HSN/SAC codes | Must | |
| GST filing reports | Must | |

### 2.8 Dashboard (Today‑first)
| Feature | Priority | Notes |
|---------|----------|-------|
| Today's receivables/payables | Must | Default view |
| Custom widgets (drag‑drop) | Should | |
| Date range toggle (week/month/lifetime) | Should | |

### 2.9 Business Type Engine
| Feature | Priority | Notes |
|---------|----------|-------|
| Select business type at signup | Must | |
| Dynamic module loading | Must | Metadata‑driven |
| Default workflows per type | Should | |

### 2.10 Customization Engine
| Feature | Priority | Notes |
|---------|----------|-------|
| Custom fields (without code) | Must | |
| Custom module builder | Could | Complex – Phase 2 |
| Workflow builder | Could | Complex – Phase 2 |

### 2.11 User & Security
| Feature | Priority | Notes |
|---------|----------|-------|
| Multi‑tenant (organizations) | Must | |
| Role‑based access (Admin, Manager, Staff) | Must | |
| Audit logs | Should | |


### 2.12 Mobile (Flutter) Specific
| Feature | Priority | Notes |
|---------|----------|-------|
| Real‑time sync with backend | Must | |
| Offline mode (create invoices) | Should | |
| Push notifications | Could | |

### 2.13 Automation Engine
| Feature | Priority | Notes |
|---------|----------|-------|
| Workflow rules (event-based triggers) | Must | e.g., on invoice created → send email |
| Email notifications (templates) | Must | |
| SMS notifications (third-party gateway) | Could | Twilio etc. |
| Scheduled actions (daily/weekly) | Should | e.g., recurring invoice generation |
| Workflow execution logs | Must | Audit trail |

### 2.14 Project & Time Tracking
| Feature | Priority | Notes |
|---------|----------|-------|
| Projects (linked to customer) | Should | |
| Tasks (within projects) | Should | |
| Timesheets (log hours) | Should | |
| Billable time → Invoice | Should | |
| Project expenses | Could | |

### 2.15 Document Management
| Feature | Priority | Notes |
|---------|----------|-------|
| File uploads (PDF, images) | Should | |
| Attach documents to transactions | Should | Invoices, bills, expenses |
| Bank statement upload (manual) | Must | For reconciliation |
| OCR receipt scanning | Could | Defer to Phase 2 |

### 2.16 Integrations (Phase 2+)
| Feature | Priority | Notes |
|---------|----------|-------|
| Payment gateway (cashfree) | Could | For online payments |
| Banking API (Plaid, etc.) | Could | Deferred |
| REST API for third-party | Should | Documented API |


## 3. Non‑Functional Requirements

| Requirement | Target | Priority |
|-------------|--------|----------|
| Dashboard load time | < 2 seconds | Must |
| Concurrent users | 100+ per tenant | Should |
| API response time (p95) | < 500 ms | Must |
| Uptime | 99.9% | Should |
| Data encryption | At rest & in transit | Must |
| Backup | Daily | Should |

## 4. Out of Scope for MVP (3 months)
- Full 70+ reports (will build top 15 first)
- AI receipt scanning (defer to Phase 2)
- Bank feeds automation (manual upload initially)
- Custom module builder (defer to Phase 2)
- iOS mobile (Android only for MVP, iOS later)