# Use Case Diagrams – Tinplate ERP

## Diagram 1: High‑Level System Use Cases

```text
                    ┌─────────────────────────────────────────┐
                    │           Tinplate ERP System           │
                    └─────────────────────────────────────────┘
                                           │
           ┌───────────────────────────────┼───────────────────────────────┐
           │                               │                               │
           ▼                               ▼                               ▼
    ┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
    │   Admin     │                 │   Manager   │                 │   Staff     │
    └─────────────┘                 └─────────────┘                 └─────────────┘
           │                               │                               │
           │                               │                               │
    ┌──────┴──────┐                  ┌──────┴──────┐                  ┌──────┴──────┐
    │ Manage Users│                  │ View Reports│                  │ Sales Entry │
    │ View Audit  │                  │ Approve PO  │                  │ Purchase    │
    │ System Config│                 │ Manage Staff│                  │ Inventory   │
    └─────────────┘                  └─────────────┘                  └─────────────┘
```

### Actor: Admin

| Use Case             | Description                                  | Precondition    | Postcondition        |
| -------------------- | -------------------------------------------- | --------------- | -------------------- |
| Manage Users         | Create, edit, deactivate users; assign roles | Admin logged in | User created/updated |
| View Audit Log       | See all system actions with timestamps       | Admin logged in | Log displayed        |
| System Configuration | Set tax rates, business type defaults        | Admin logged in | Config saved         |

### Actor: Manager

| Use Case               | Description                              | Precondition        | Postcondition             |
| ---------------------- | ---------------------------------------- | ------------------- | ------------------------- |
| View Reports           | Access P&L, Balance Sheet, Aging reports | Manager logged in   | Report generated          |
| Approve Purchase Order | Review and approve high‑value POs        | PO status = PENDING | PO status = APPROVED      |
| Manage Staff           | Assign roles, view team performance      | Manager logged in   | Staff permissions updated |

### Actor: Staff

| Use Case             | Description                           | Precondition    | Postcondition     |
| -------------------- | ------------------------------------- | --------------- | ----------------- |
| Sales Entry          | Create quotes, sales orders, invoices | Staff logged in | Transaction saved |
| Purchase Entry       | Create purchase orders, record bills  | Staff logged in | Transaction saved |
| Inventory Management | Add/update items, adjust stock        | Staff logged in | Stock updated     |

---

## Diagram 2: Sales Lifecycle Use Case

```text
    ┌──────────┐
    │  Staff   │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│ Create Quote    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Convert to      │
│ Sales Order     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Stock     │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
[Stock OK] [Low Stock]
    │         │
    │         ▼
    │    ┌─────────────────┐
    │    │ Generate PO     │
    │    │ to Vendor       │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ Receive Goods   │
    │    └────────┬────────┘
    │             │
    └──────┬──────┘
           ▼
┌─────────────────┐
│ Create Invoice  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Record Payment  │
└─────────────────┘
```

### Textual Description

#### Use Case: Create Quote

* **Actor:** Staff
* **Precondition:** Customer exists in system
* **Flow:**

  1. Staff selects Customer
  2. Adds items with quantity/price
  3. System calculates tax (CGST/SGST)
  4. Staff saves Quote as DRAFT or SENT
* **Postcondition:** Quote saved with status SENT

#### Use Case: Convert to Sales Order

* **Actor:** Staff
* **Precondition:** Quote status = ACCEPTED
* **Flow:**

  1. Staff opens ACCEPTED Quote
  2. Clicks "Convert to Sales Order"
  3. System copies items
  4. Staff confirms
* **Postcondition:** Sales Order created (status CONFIRMED)

#### Use Case: Check Stock

* **Actor:** System (automatic)
* **Precondition:** Sales Order created
* **Flow:**

  1. System checks each item's stock level
  2. If all items available → proceed to Invoice
  3. If any item low → create Purchase Order
* **Postcondition:** Either INVOICE creation or PO generated

#### Use Case: Create Invoice

* **Actor:** Staff
* **Precondition:** Sales Order confirmed, stock available
* **Flow:**

  1. Staff selects Sales Order
  2. Clicks "Generate Invoice"
  3. System creates Invoice with due date
  4. Invoice status = SENT
* **Postcondition:** Invoice created, stock reduced

#### Use Case: Record Payment

* **Actor:** Staff
* **Precondition:** Invoice status = SENT or UNPAID
* **Flow:**

  1. Staff selects Invoice
  2. Clicks "Record Payment"
  3. Enters amount (partial/full)
  4. Selects payment method
  5. Saves
* **Postcondition:** Invoice status = PARTIALLY_PAID or PAID

---

## Diagram 3: Dashboard & Reporting Use Case

```text
    ┌────────────────────────────────────────────┐
    │           Dashboard (Today‑first)          │
    └────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐   ┌────────────┐   ┌────────────┐
    │ Admin      │   │ Manager    │   │ Staff      │
    └────────────┘   └────────────┘   └────────────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
              ┌─────────────────────────┐
              │ View Today's Receivables│
              │ View Today's Payables   │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ Change Date Range       │
              │ (Week/Month/Lifetime)   │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ Click Card → Drill Down │
              │ to AR/AP Aging Report   │
              └─────────────────────────┘
```

### Textual Description

#### Use Case: View Today's Receivables

* **Actor:** Admin, Manager, Staff
* **Precondition:** User logged in, dashboard loaded
* **Flow:**

  1. Dashboard defaults to "Today" filter
  2. System sums invoices with relevant date conditions
  3. Displays total amount and breakdown
* **Postcondition:** User sees real‑time actionable data

#### Use Case: Change Date Range

* **Actor:** Any authenticated user
* **Precondition:** Dashboard visible
* **Flow:**

  1. User selects date range
  2. System refetches data
  3. Updates UI
* **Postcondition:** Dashboard reflects selected range

#### Use Case: Drill Down to Report

* **Actor:** Any authenticated user
* **Precondition:** Dashboard card displayed
* **Flow:**

  1. User clicks card
  2. Redirect to detailed report
  3. Apply filters
* **Postcondition:** Detailed report displayed

#### Use Case: View Report (General)

* **Actor:** Manager, Admin
* **Precondition:** Report center accessible
* **Flow:**

  1. Select report
  2. Apply filters
  3. Generate report
* **Postcondition:** Report displayed/exportable

---

## Diagram 4: Business Type Engine

```text
    ┌─────────────┐
    │ New User    │
    │ Signup      │
    └──────┬──────┘
           ▼
┌─────────────────────┐
│ Select Business Type│
└──────┬──────────────┘
           ▼
┌─────────────────────┐
│ Load dynamic modules│
└──────┬──────────────┘
           ▼
┌─────────────────────┐
│ Tailored dashboard  │
└─────────────────────┘
```

### Textual Description

#### Use Case: Select Business Type

* **Actor:** New user
* **Precondition:** Signup in progress
* **Flow:**

  1. Choose business type
  2. System saves selection
  3. Load configuration
* **Postcondition:** Customized system setup

#### Use Case: Dynamic Module Loading

* **Actor:** System
* **Precondition:** Business type selected
* **Flow:**

  1. Query module registry
  2. Enable relevant modules
  3. Render UI
* **Postcondition:** Context-aware interface
