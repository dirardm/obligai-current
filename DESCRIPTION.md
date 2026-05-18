# DESCRIPTION.md — Complete Feature & Architecture Overview

## ⚠️ Important: Mock/Prototype Status

**This application is a functional prototype and proof-of-concept.**

- All data displayed (obligations, scrapers, reports) is **mock data** for demonstration
- The UI/UX patterns and workflows are production-ready, but backend integration is not
- This serves as a reference implementation showing what ObligaI *could* do with real regulatory data
- Every data point—obligations, scrapers, conflicts—is hardcoded for visualization purposes

See `STATE.md` for current implementation status.

---

## Vision

ObligaI is a regulatory intelligence platform designed to help financial institutions **understand, track, and manage compliance obligations** across multiple jurisdictions and regulatory frameworks.

**Core mission:** Turn regulatory prose into machine-readable, actionable compliance tasks with full traceability from regulation to reporting field.

---

## Feature Map

### 1. Dashboard — Compliance At-a-Glance

**Purpose:** Executive overview of compliance status across all in-scope regulations and jurisdictions.

**What's shown:**
- **Stat cards** — Total obligations, completeness score, alerts, deadline count
- **Jurisdiction bar chart** — Stacked horizontal bars showing obligation breakdown by regulation per jurisdiction (CSS-driven, no D3)
- **Recent changes table** — Last 10 obligation updates with timestamp, who changed it, what changed
- **Completeness summary** — By regulation, showing % of obligations completed
- **Scope control** — Real-time jurisdiction + regulation filter

**Data sources (mocked):**
- `src/data/obligations.ts` — 131 obligations with status/completeness/deadline
- Bar chart dimensions calculated in component

**Example workflow:**
1. User lands on dashboard
2. Selects "EU, UK, US" and "LCR, NSFR"
3. Dashboard updates to show only those regulations
4. User sees which jurisdictions have incomplete obligations
5. Clicks "Register" to drill into details

---

### 2. Register — Obligation Database

**Purpose:** Complete searchable, filterable, sortable catalog of regulatory obligations.

**Screens:**

#### 2a. List View (`/register`)
- **Filter sidebar** — Status checkboxes (active, pending, conflicted), jurisdiction multi-select
- **Sortable columns** — Citation, Summary, Status, Completeness, Deadline, Assigned To
- **Multi-select UI** — Checkboxes on each row; bulk action bar appears (Delete, Assign, Export — mocked)
- **Pagination** — 10 obligations per page
- **Empty state** — Message when no results match filters
- **Error state** — Network error placeholder (not yet wired)
- **Loading skeleton** — 8-row placeholder while data loads

**Interaction example:**
1. User filters: Status = "pending", Jurisdiction = "UK"
2. Table updates to show 12 obligations
3. User sorts by "Deadline" (ascending)
4. User selects 3 rows with checkboxes
5. Bulk bar appears with "Assign to: [dropdown]"
6. User assigns to "Jane Doe" and hits "Apply"

#### 2b. Detail View (`/register/[id]`)
- **Async server component** — Resolves obligation from `[id]` route param
- **404 handling** — Returns `notFound()` for unknown IDs
- **Full obligation details:**
  - Citation, framework, summary
  - Status badge, completeness bar
  - Deadline, assigned to, last updated
  - Linked controls (other obligation IDs)
  - Conflicts (references to conflicting obligations)
  - Audit trail (mock: 3 historical entries)
- **Breadcrumbs** — "Obligations > [citation]"
- **Back button** — Returns to register with filter state preserved

**Example detail view:**
```
Art. 415a — ALMM Maturity Ladder

Framework: CRR II / Circular 42-2024
Jurisdiction: European Union
Status: Pending | 65% complete

Deadline: 2026-06-30
Assigned to: John Smith
Last updated: 2026-05-15 by Jane Doe

Linked Controls:
- Liquidity Risk Framework (internal)
- Treasury Policy v3

Conflicts:
- Art. 412 LCR (Overlapping reporting scope)
```

**Data:** All from `src/data/obligations.ts`

---

### 3. Sources — Regulatory Document Scrapers

**Purpose:** Monitor and manage automated document scrapers that ingest regulatory PDFs/HTML.

**What's shown:**
- **Scrapers table** — 12 mock scrapers (8 active, 1 degraded, 1 down)
  - Columns: Jurisdiction flag, Regulation badge, Scraper name, Last fetched, Document count, Health status, Next fetch, Refresh button
  - Row click selects scraper and opens side panel
  
- **Scraper data (mock):**
  ```
  EBA LCR Reporting (EU)
  Last fetched: 2025-12-14 | Documents: 14 | Health: Healthy | Next fetch: 2025-12-21
  
  Documents:
  - Commission Delegated Regulation (EU) 2015/61 (Regulation, 2015-01-10)
  - EBA Guidelines on LCR Disclosure (Guideline, 2022-03-15)
  - EBA Q&A on Article 412 CRR II (Notice, 2023-09-08)
  - Delegated Act Amendment — HQLA eligibility (Circular, 2024-06-20)
  ```

- **Side panel** — Sticky, shows documents for selected scraper
  - Document type tag (Regulation, Guideline, Circular, Notice)
  - Publication date
  - "View source" button (mock, doesn't navigate)
  - "Refresh now" button (mock, doesn't trigger)

- **Alert bar** — Red alert if any scraper is "down"

**Example workflow:**
1. User opens Sources
2. Notices Hong Kong HKMA scraper is "Down"
3. Clicks the row to view recent documents
4. Sees last fetch was 2025-11-28 (stale)
5. Hits "Refresh now" button (mocked — no-op in prototype)

**Data:** `src/app/(app)/sources/page.tsx` — 12 hardcoded SCRAPERS array with mock document lists

---

### 4. Conflicts — Regulatory Conflict Detection

**Purpose:** Visualize and track conflicts between regulations (overlapping requirements, definitional divergences, jurisdictional overlaps).

**Layout:**

#### 4a. Conflict Graph (SVG)
- **Circular layout** — 6 nodes positioned on circle, trigonometric positioning
- **Node styling** — Coloured by regulation (`graph-node--{reg}`), sized equally
- **Edge styling** — Red dashed lines for conflicts (`graph-edge--conflict`)
- **Interactivity** — Click a node to highlight connected edges/conflicts
- **Out-of-scope dimming** — Nodes/edges outside selected scope fade to 30% opacity
- **Empty state** — "No conflicts in selected scope" message

#### 4b. Conflict List (Right Panel)
- **Filterable** — Jurisdiction filter chips (multi-select)
- **Conflict items** — Each shows:
  - Conflict type tag (Reporting, Definitional, Jurisdictional)
  - Regulation pair badge (e.g., "LCR ↔ NSFR")
  - Citation pair (e.g., "Art. 415a vs. Art. 428k(1)")
  - Description
  - Detection date
- **Row-click** — Highlights conflict in graph (if graph visible)
- **Sortable** — By date, type, severity (mocked)

**Mock conflict data (3 pairs):**
```
Conflict 1: Reporting Overlap
- LCR Art. 415a (Maturity Ladder) vs. NSFR Art. 428k (Funding Sources)
- Both require maturity breakdowns; definitions differ slightly
- Detected: 2026-04-15

Conflict 2: Definitional Divergence
- ALMM Art. 7 vs. LCR Art. 24 (Retail Deposits)
- "Retail deposit" defined differently across EU regulations
- Detected: 2026-03-22

Conflict 3: Jurisdictional Overlap
- Peru SBS vs. Colombia IRL (Liquidity Risk Framework)
- Both require similar reporting; scope boundaries unclear
- Detected: 2026-02-10
```

**Example workflow:**
1. User opens Conflicts
2. Sees 3 conflicts highlighted in graph
3. Filters by "EU" jurisdiction
4. Graph updates; 2 conflicts remain
5. Clicks "Definitional Divergence" row
6. Graph highlights LCR ↔ NSFR edge in red
7. Clicks the edge to drill into full conflict details

**Data:** `src/app/(app)/conflicts/page.tsx` — hardcoded conflict pairs, derived from obligation `.conflicts` arrays

---

### 5. Reports — Compliance Report Generation

**Purpose:** Generate, track, and manage compliance reports for regulatory submission.

**Layout:**

#### 5a. Generated Reports Table
- **Columns:** Report name, template, status, generated date, actions
- **Status badges:** 
  - Green "Complete" — ready for download
  - Yellow "Processing" — spinner animating
  - Red "Failed" — error message, retry button
  - Gray "Pending" — queued
- **Actions per row:**
  - Download button (Green Complete only)
  - Retry button (Failed only)
  - Spinner (Processing only)
- **Mock reports:** 5 sample reports in various states

#### 5b. Generate New Report
- **Form:**
  - Template select: "LCR Quarterly", "NSFR Annual", "ALMM Monthly", etc.
  - Format select: "PDF", "Excel", "JSON"
  - Jurisdiction/Regulation scope (pulled from current scope)
  - Submit button
- **Modal on submit:** "Generating report for [template] in [format]. You'll be notified when ready."
- **Closes after** — Simulates submission

**Example workflow:**
1. User navigates to Reports
2. Sees 5 previous reports (1 ready, 1 processing, 1 failed, 2 pending)
3. Clicks "Generate New Report"
4. Selects "LCR Quarterly" + "PDF"
5. Submits
6. Modal confirms: "Report queued. You'll receive email when ready."
7. New report appears in table with "Pending" status

**Data:** `src/app/(app)/reports/page.tsx` — hardcoded REPORTS array with status variants

---

### 6. Settings — User Configuration & Preferences

**Purpose:** Configure system-wide preferences, entity types, jurisdiction access, user roles, theme, notifications.

**6 Hash-Routed Tabs:**

#### 6a. Jurisdictions
- List of enabled jurisdictions (checkboxes)
- Add custom jurisdiction (button → form)
- Mock data: All 18 jurisdictions, checkboxes for selective enable/disable

#### 6b. Entity Types
- Dropdown/multi-select for entity classifications
- "Credit Institution", "Investment Firm", "Insurance Company", etc.
- Mock: 6 entity types, 3 selected

#### 6c. GRC Connections
- API credentials for external GRC platforms
- Form fields for endpoint, API key, auth type
- Mock data: Placeholder credential manager (not functional)

#### 6d. User Roles
- User management table (Name, Email, Role, Actions)
- Roles: Admin, Compliance Officer, Auditor, Analyst
- Mock: 5 users with various roles
- Add user button → form

#### 6e. Theme
- Light/Dark toggle (real, wired to Zustand store)
- Theme preview boxes
- Dropdown for per-regulation theme override (e.g., "Always use LCR theme")

#### 6f. Notifications
- Email notifications on (toggle)
- When to notify: Deadline approaching, Obligation updated, Report ready, Status changed
- Frequency: Real-time, Daily digest, Weekly digest, Off

**Example workflow:**
1. User opens Settings
2. Clicks "Theme" tab
3. Toggles "Dark mode"
4. Page switches to dark theme immediately
5. localStorage updated, persists across reload
6. Clicks "Notifications" tab
7. Unchecks "Deadline approaching"
8. Changes frequency to "Weekly digest"

**Data:** `src/app/(app)/settings/page.tsx` — all mock forms and toggles

---

### 7. Gallery — Component Reference

**Purpose:** Visual regression test + design system reference. Shows all components in all states.

**What's on the page:**
- **Buttons** — 4 variants × 3 sizes = 12 states
- **Alerts** — error, warning, success, info
- **Status badges** — active, pending, conflicted
- **Regulation badges** — all 20 regulations, each with colour variant
- **Input states** — default, focused, disabled, error
- **Cards** — elevated, flat, stat, regulation-branded
- **Spinners** — sm, md, lg
- **Skeleton loader** — 8-row table skeleton
- **Empty state** — full example
- **Tabs** — interactive example
- **Pagination** — example with 5 pages
- **Breadcrumbs** — example navigation path
- **Dropdown** — interactive menu
- **Modal** — example dialog
- **Icons** — all 28 in sprite, sm/md/lg sizes
- **Flags** — all 18 jurisdictions, sm/md/lg sizes
- **Logo** — all 6 sizes (xs–xxl)

**URL:** http://localhost:3000/gallery

---

## UI/UX Patterns

### Pattern 1: Scope-Aware Filtering
Every screen subscribes to the global scope store (`selectedRegulations`, `activeJurisdiction`). When user selects "EU + UK" and "LCR + NSFR" via ScopeControl:
- Dashboard updates instantly (stat cards, bar chart)
- Register table filters to matching obligations
- Conflicts graph dims out-of-scope nodes
- Reports pre-filter template suggestions

### Pattern 2: Status Badging
All obligation-related entities use consistent status badges:
- Green "active" → work in progress, on track
- Yellow "pending" → awaiting action or upstream decision
- Red "conflicted" → requires escalation or resolution

### Pattern 3: Jurisdiction Awareness
Every entity that touches a jurisdiction displays its flag sprite and colour:
```tsx
<Flag cc="uk" size="sm" /> United Kingdom
```
The flag is pulled from `assets/flags.svg` via CSS `.flag--uk` class.

### Pattern 4: Regulation Colour Inheritance
Badges, charts, text, and borders automatically inherit the regulation's colour from CSS custom properties:
```css
--color-lcr: #0066CC;
--color-lcr-light: rgba(...);

.badge--lcr { --reg-color: var(--color-lcr); }
.chart-bar--lcr { fill: var(--color-lcr); }
```

---

## Data Model (Mocked)

All data is hardcoded in `src/data/`. In a production system, this would come from a backend API.

### Obligations (131 entries)

```typescript
interface Obligation {
  id: string;                    // "obl-lcr-eu-001"
  regulationId: RegulationId;    // "lcr"
  jurisdictionId: JurisdictionId; // "eu"
  framework: string;              // "CRR II / Basel III"
  citation: string;               // "Art. 415a"
  summary: string;                // "Liquidity risk monitoring via maturity ladder"
  status: "active" | "pending" | "conflicted"; // Current status
  completeness: number;           // 0–100: % of task complete
  deadline: string;               // ISO date: "2026-06-30"
  assignedTo: string;             // "Jane Doe"
  linkedControls: string[];       // ["obl-nsfr-eu-042", ...]
  conflicts: string[];            // ["obl-almm-eu-008", ...]
  lastUpdated: string;            // ISO datetime
}
```

**Mocked:** 131 total obligations distributed across 20 regulations and 18 jurisdictions

### Regulations (20 entries)

```typescript
interface Regulation {
  id: RegulationId;
  label: string;              // "Liquidity Coverage Ratio"
  shortLabel: string;         // "LCR"
  framework: string;          // "CRR II / Basel III"
  jurisdictionId: JurisdictionId;
}
```

**Supported:** EU, UK, US, Canada, Switzerland, Brazil, Colombia, Mexico, Panama, Peru, Japan, Singapore, Hong Kong, Australia, Indonesia, Malaysia, Vietnam, Thailand

### Jurisdictions (18 entries)

```typescript
interface Jurisdiction {
  id: JurisdictionId;
  label: string;              // "United Kingdom"
  cc: string;                 // "uk" (ISO 3166-1 alpha-2)
}
```

### Scrapers (12 entries, Sources page only)

```typescript
interface Scraper {
  id: string;
  name: string;               // "EBA LCR Reporting"
  regulationId: RegulationId;
  lastFetched: string;        // ISO datetime
  documentCount: number;
  health: "healthy" | "degraded" | "down";
  nextFetch: string;          // ISO datetime
  documents: ScraperDoc[];    // Array of fetched documents
}
```

---

## Architectural Patterns

### 1. Registry-Driven Components
Every regulation/jurisdiction ID is validated against `REGULATIONS` and `JURISDICTIONS` arrays:
```tsx
const reg = REGULATIONS.find(r => r.id === regulationId);
if (!reg) throw new Error(`Unknown regulation: ${regulationId}`);
```

### 2. CSS-Only Styling
No JavaScript styling logic. All colours, spacing, theme transitions are in CSS:
```tsx
// ❌ Don't do this:
<div style={{ backgroundColor: colors[regId] }} />

// ✅ Do this:
<div className={`badge--${regulationId}`} />
// CSS handles: .badge--lcr { --reg-color: var(--color-lcr); }
```

### 3. Zustand for UI State Only
Theme and scope are UI state, not business logic:
```tsx
const { activeJurisdiction, toggleRegulation } = useScopeStore();
```
Components pull from store, update it via actions, re-render on change.

### 4. Semantic HTML + ARIA
```tsx
<svg aria-label="Conflict graph showing 3 conflicts across LCR and NSFR">
  {/* ... */}
</svg>
```
Every interactive element has a label.

### 5. Async Server Components for Detail Pages
```tsx
export default async function ObligationDetail({ params }) {
  const obligation = OBLIGATIONS.find(o => o.id === params.id);
  if (!obligation) notFound();
  return <DetailView obligation={obligation} />;
}
```

---

## Workflow Examples

### Example 1: "I need to see all pending obligations in the UK"

1. User opens Dashboard
2. Clicks ScopeControl, selects only "UK" jurisdiction
3. Deselects all but one regulation (e.g., "LCR")
4. Dashboard updates: shows only UK + LCR obligations
5. Clicks "Register"
6. Register table shows filtered results
7. Filters by Status = "Pending"
8. Sees 3 pending UK/LCR obligations
9. Sorts by "Deadline"
10. Clicks one to view details

### Example 2: "Which regulations have conflicting definitions?"

1. User opens Conflicts
2. Sees graph with 3 conflict edges
3. Looks at list: "Definitional Divergence" is one type
4. Clicks that conflict to expand details
5. Reads the conflict description: "ALMM vs. LCR retail deposit definition"
6. Clicks "View in Register" → taken to both articles
7. Can now compare prose side-by-side

### Example 3: "Generate a quarterly compliance report"

1. User opens Reports
2. Clicks "Generate New Report"
3. Selects "LCR Quarterly" template
4. Confirms jurisdiction scope is "EU, UK, US"
5. Selects format: "PDF"
6. Submits
7. Report queued with "Pending" status
8. Email notification sent (simulated)
9. After ~30 seconds (in real system), status → "Complete"
10. User downloads PDF

---

## Performance Characteristics

### Frontend
- **Bundle size:** ~150KB (Next.js 16 optimized)
- **Initial load:** ~2s on 4G (simulated)
- **Time to Interactive:** <3s
- **Paginated lists:** 10 items/page to keep DOM small
- **Skeleton loaders:** Prevent layout shift

### Mock Data
- **Obligations:** Loaded once on app start (131 entries, <20KB JSON)
- **Store updates:** Instant (in-memory)
- **Route changes:** Instant (no network)

### Real System (Post-Integration)
- **API latency:** ~200–500ms per request
- **Websocket updates:** Real-time obligation changes
- **Database queries:** Indexed on jurisdiction_id, regulation_id for fast filtering

---

## Accessibility (WCAG 2.1 AA)

- ✅ All buttons, links, inputs have semantic HTML
- ✅ SVG charts have `aria-label` attributes
- ✅ Modal dialogs trap focus
- ✅ Theme toggle respects `prefers-color-scheme`
- ✅ All text has sufficient contrast (WCAG AAA in most cases)
- ✅ Keyboard navigation works on all interactive elements
- ✅ Focus ring visible on all focusable elements

---

## Responsive Design

**3 breakpoints:**
- **Mobile (0–640px):** Single-column layout, sidebar collapses, tables scroll horizontally
- **Tablet (640–1200px):** 2-column grid, sidebar narrows, table pagination
- **Desktop (1200px+):** Full 3-column or multi-panel layouts, all features visible

**Example:** Dashboard on mobile shows stat cards stacked; on desktop, 2×2 grid.

---

## Security Considerations (Not Implemented)

When integrating a real backend:
- [ ] Authentication (JWT, OAuth, Clerk)
- [ ] Authorization (role-based access control)
- [ ] Input validation (XSS prevention)
- [ ] CORS policy
- [ ] Rate limiting on scrapers
- [ ] Data encryption in transit (HTTPS)
- [ ] Audit logging for all mutations

---

## Future Roadmap

### Phase 1 (3 months)
- Real backend API (REST + GraphQL)
- Database (PostgreSQL + graph DB for conflict network)
- User authentication
- PDF parser for regulatory documents

### Phase 2 (6 months)
- ML-powered conflict detection
- Full-text search across regulations
- Audit trail + versioning
- Export/download reports

### Phase 3 (9 months)
- Multi-language UI
- Real-time WebSocket updates
- Integration with external GRC systems
- Mobile app

---

## Summary

ObligaI is a **proof-of-concept regulatory compliance platform** that demonstrates:
- How modern React + Next.js can model complex regulatory data
- Visual patterns for conflict detection and obligation tracking
- Scope-aware filtering across multiple dimensions
- Registry-driven design for extensibility

**All data is mock for demonstration.** The architecture is designed to scale to real regulatory data with minimal refactoring (mostly backend wiring).

For detailed implementation notes, see `CLAUDE.md`. For current status, see `STATE.md`. For development history, see `progress.md`.
