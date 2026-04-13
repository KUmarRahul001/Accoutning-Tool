# Feasibility Report – Tinplate ERP

## 1. Technical Feasibility

### Frontend (Web – React)
- **Status**: Feasible
- **Risk**: Low. React is mature, large ecosystem.

### Mobile (Flutter)
- **Status**: Feasible
- **Risk**: Medium. Real-time sync with offline mode requires careful state management.

### Backend (Node.js + PostgreSQL)
- **Status**: Feasible
- **Risk**: Low/Medium. Metadata-driven architecture (custom fields, dynamic modules) requires JSONB and flexible query design.

### Hosting (Supabase + Netlify)
- **Status**: Feasible
- **Risk**: Low. But needs proper row-level security for multi-tenancy.

## 2. Functional Feasibility

| Feature | Feasible? | Complexity | Notes |
|---------|-----------|------------|-------|
| GST compliance (CGST/SGST/IGST) | Yes | High | Requires accurate tax engine |
| Dynamic business type module | Yes | Very High | Custom metadata engine |
| Today-first dashboard | Yes | Medium | Efficient aggregations needed |
| 70+ reports | Yes | High | Reusable query builder |
| Bank feeds integration | Yes | High | Depends on third-party APIs (Razorpay, Plaid, etc.) |
| OCR for receipts | Yes | Medium | Use external service (Google Vision, Tesseract) |

## 3. Schedule Feasibility

- **3 months** for full Zoho Books equivalent → **NOT feasible**.
- **Recommendation**: Phased MVP.
  - **MVP (6 weeks)**: Core sales, purchases, basic inventory, GST invoicing, dashboard with today's data.
  - **Phase 2 (6 weeks)**: Reports, automation, project tracking, customization engine.
  - **Phase 3 (remaining)**: Advanced features, bank feeds, mobile offline.

## 4. Resource Feasibility

- One developer (you) → **Constraint**. Suggests outsourcing or extending timeline.

## 5. Risk Summary

- Biggest risk: **Scope creep** – client expects all Zoho features in 3 months.
- Mitigation: Freeze design after Phase 2. Any additional feature requires Change Request.

## 6. Go/No-Go Recommendation

**Proceed** but with **strict MVP definition** in the SRS.