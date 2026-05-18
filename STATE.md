# STATE.md — Current Application State

**Date:** 2026-05-18  
**App Version:** 0.1.0  
**Build Status:** ✅ Passing  

---

## Live Deployment

- **Dev Server:** http://localhost:3000
- **Gallery:** http://localhost:3000/gallery (all components and regulations)
- **Repository:** https://github.com/dirardm/obligai-current

---

## Screens / Routes

| Route | Status | Components | Features |
|-------|--------|-----------|----------|
| `/` | ✅ Active | Dashboard | Stat cards, bar chart, changes table, completeness summary |
| `/register` | ✅ Active | Register Page | Filter sidebar, sortable columns, multi-select, pagination (10/page) |
| `/register/[id]` | ✅ Active | Obligation Detail | Async server component, 404 handling, full obligation data |
| `/sources` | ✅ Active | Sources Page | 12 scrapers table, side panel with documents, refresh controls |
| `/conflicts` | ✅ Active | Conflicts Page | SVG conflict graph (circular layout), conflict list, filters |
| `/reports` | ✅ Active | Reports Page | Generated reports table, form for new reports, modal |
| `/settings` | ✅ Active | Settings Page | 6 hash-routed tabs (Jurisdictions, Entity Types, GRC, Roles, Theme, Notifications) |
| `/gallery` | ✅ Active | Component Gallery | All UI primitives, all regulation badges, all icon/flag variants |

---

## Regulations Supported

### Total: 20 regulations across 18 jurisdictions

**EU/Multi-jurisdictional (3):**
- LCR (Liquidity Coverage Ratio) — EU
- NSFR (Net Stable Funding Ratio) — EU
- ALMM (Additional Liquidity Monitoring Metrics) — EU

**Jurisdiction-Specific:**
- IRL (Colombia — Indicador de Riesgo de Liquidez)
- UK-PRA (United Kingdom)
- US-Fed (United States)
- Canada-OSFI (Canada)
- Switzerland-FINMA (Switzerland)
- Brazil-BCB (Brazil)
- Mexico-CNBV (Mexico)
- Peru (SBS)
- Panama (SBP)
- Japan-BSR (Japan)
- Singapore-MAS (Singapore)
- Hong Kong-HKMA (Hong Kong)
- Australia-APRA (Australia)
- Indonesia-OJK (Indonesia)
- Malaysia-BNM (Malaysia)
- Vietnam-SBV (Vietnam)
- Thailand-BOT (Thailand)

---

## Core Components

### UI Primitives (`src/components/ui/`)

| Component | Props | Variants |
|-----------|-------|----------|
| Button | variant, size, disabled | primary, secondary, ghost; sm, md, lg |
| Input | type, placeholder, disabled | text, email, password, number |
| Select | options, value, onChange | native HTML select wrapper |
| Textarea | rows, cols, disabled | — |
| Checkbox | checked, onChange | — |
| Radio | name, value, onChange | — |
| Card | className, children | elevated, flat, stat, regulation-branded |
| Badge | variant, status | regulation-scoped (lcr, nsfr, irl, etc.), status (active, pending, conflicted) |
| Tag | children | domain-specific tags (circular, guideline, notice, etc.) |
| Alert | type, title, message | error, warning, success, info |
| Modal | isOpen, onClose, title | basic structure, confirmation variant |
| Tooltip | content, position | — |
| Dropdown | items, onSelect | — |
| Tabs | tabs, activeTab, onTabChange | hash-routed or controlled |
| Breadcrumbs | segments | auto-derived from pathname |
| Pagination | current, total, pageSize, onChange | default 10 per page |
| Spinner | size | sm, md, lg |
| Skeleton | width, height, count | — |
| EmptyState | title, description | — |
| Icon | name, size | 28 icon variants; sm, md, lg sizes |
| Flag | cc (country code), size | 18 jurisdiction flags; sm, md, lg sizes |
| Logo | size | 6 size variants (xs, sm, md, lg, xl, xxl) |

### Layout Components (`src/components/layout/`)

| Component | Role | Props |
|-----------|------|-------|
| AppShell | Page grid layout | children (Sidebar, TopBar, content area) |
| Sidebar | Navigation + logo | collapsible on autohide; brand mark always visible |
| SidebarNav | Nav list | active route highlighting via `usePathname` |
| TopBar | Header chrome | breadcrumbs, ScopeControl, theme toggle |
| ScopeControl | Jurisdiction/regulation picker | popover-based; affects global scope store |
| Breadcrumbs | Page location | auto-derived from pathname + labels |

### Product Components (`src/components/product/`)

| Component | Purpose | Data Source |
|-----------|---------|-------------|
| ObligationDetail | Full obligation view | Server-resolved from `obligations.ts` |
| ObligationRow | Table row | Obligation object + scope filtering |
| StatusBadge | Status indicator | Status enum (active, pending, conflicted) |
| CompletenessBar | Progress bar | completeness: 0–100 |
| ConflictBadge | Conflict count | conflict array length |
| ValidationScore | Audit/QA metric | 0–100 score |
| JurisdictionTag | Jurisdiction indicator | jurisdiction + flag |

---

## Data Model

### Obligation Structure
```typescript
interface Obligation {
  id: string;
  regulationId: RegulationId;
  jurisdictionId: JurisdictionId;
  framework: string;
  citation: string;         // e.g., "Art. 415a"
  summary: string;
  status: "active" | "pending" | "conflicted";
  completeness: number;     // 0–100
  deadline: string;         // ISO date
  assignedTo: string;
  linkedControls: string[]; // obligation IDs
  conflicts: string[];      // obligation IDs
  lastUpdated: string;      // ISO date
}
```

**Total:** 131 mock obligations

### Regulation Structure
```typescript
interface Regulation {
  id: RegulationId;
  label: string;
  shortLabel: string;
  framework: string;
  jurisdictionId: JurisdictionId;
}
```

**Total:** 20 regulations with colour tokens in §2 of stylesheet

### Jurisdiction Structure
```typescript
interface Jurisdiction {
  id: JurisdictionId;
  label: string;
  cc: string; // ISO 3166-1 alpha-2 country code
}
```

**Total:** 18 jurisdictions with flag sprites in `assets/flags.svg`

---

## State Management

### Zustand Stores

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `theme.ts` | light/dark theme toggle | localStorage (`obligai.theme`) |
| `scope.ts` | active jurisdiction, selected regulations | localStorage (`obligai.scope.*`) |

**Usage:**
```tsx
const { activeJurisdiction, selectedRegulations, toggleRegulation } = useScopeStore();
const { theme, toggleTheme } = useThemeStore();
```

---

## Styling Architecture

### Stylesheet Hierarchy
1. **Fonts** — `@fontsource/inter`, `@fontsource/jetbrains-mono`
2. **Canonical Tokens** — `colors_and_type.css` (read-only, designer-maintained)
3. **Extended Stylesheet** — `ObligaI_Extended_Stylesheet.css` (§1–28)

### §28 Sections
| § | Topic | What's Included |
|---|-------|-----------------|
| 1 | Tokens | Motion vars, sizing, shadows, z-scale |
| 2 | Regulation Registry | 20 regulation colour triplets (base, light, dark) |
| 3 | Jurisdictions | Per-country colour aliases |
| 4 | Logo | 6 size variants of canonical SVG |
| 5 | Layout | Container, grid, flex helpers |
| 6 | Typography | Type scale + regulation-coloured text |
| 7 | Spacing | Margin/padding/gap on 8px scale |
| 8 | Cards | Compact, elevated, flat, stat, regulation |
| 9 | Buttons | Size modifiers, block, group |
| 10 | Tables | **Compact**, zebra, numeric, sticky header |
| 11 | Badges & Status | Regulation + status modifiers |
| 12 | Forms | Input, select, textarea, checkbox, radio, field |
| 13 | Regulation Components | Label, jurisdiction section, separator |
| 14 | Charts & Graphs | Bar, line + graph node/edge (D3-compatible) |
| 15 | Completeness | Progress bar, score |
| 16 | Feedback | Alert, tooltip, modal, menu, tab, breadcrumb |
| 17 | Theme Overrides | Per-regulation `[data-theme]` |
| 18 | Accessibility | Focus ring, disabled, error, sr-only, prefers-reduced-motion |
| 19 | Responsive | 640px, 1200px, 1600px breakpoints |
| 20 | Print | Print styles |
| 21 | Interactive | Hover transitions |
| 22 | Scoping | Jurisdiction + regulation control |
| 23 | Icons | 28-icon sprite reference |
| 24 | Spinner & Skeleton | Loading states |
| 24b | Flags | 18-jurisdiction flag sprite |
| 25 | Empty State | Zero-data surface |
| 26 | Pagination | Page numbers with sienna underline |
| 27 | Sidebar, TopBar, AppShell | Layout chrome |

### Mode Switches
- **Light:** `data-theme="light"` (default)
- **Dark:** `data-theme="dark"`
- **Regulation-Scoped:** `data-theme="regulation-lcr"` (or any RegulationId)

---

## CSS Custom Properties

### Base Tokens
```css
--color-primary: hsl(...)     /* depends on data-theme */
--color-surface: hsl(...)
--color-surface-hover: hsl(...)
--color-text: hsl(...)
--color-text-muted: hsl(...)
--accent: #B85C3A            /* sienna — mode-invariant */
--transition-micro: 0.15s ease
--transition-panel: 0.3s ease
/* ... 40+ more */
```

### Regulation-Specific
```css
--color-lcr: #0066CC
--color-lcr-light: rgba(0, 102, 204, 0.10)
--color-lcr-dark: #4D99E6
/* ... for all 20 regulations */
```

### Dynamic (Set by Components)
```css
--seg-w: "45%"          /* bar chart segment width */
--reg-color: var(--color-lcr)
--juris-color: var(--color-uk)
--value: "75"           /* for progress bar, etc. */
```

---

## Current Feature Inventory

### Implemented
- ✅ 7 main screens (Dashboard, Register, Sources, Conflicts, Reports, Settings, Gallery)
- ✅ 20 regulations with colour tokens
- ✅ 18 jurisdictions with flags
- ✅ 131 mock obligations
- ✅ Scope store (jurisdiction + regulation filtering)
- ✅ Theme store (light/dark toggle)
- ✅ Sidebar with autohide mark visibility fix
- ✅ Compact table density for Sources and Reports
- ✅ 8 regulatory document scrapers with health status
- ✅ Conflict graph visualization (circular layout, interactive)
- ✅ Multi-select bulk actions
- ✅ Pagination (10 items/page)
- ✅ Filter sidebar with checkboxes
- ✅ Sortable table columns
- ✅ Modal forms and confirmations
- ✅ ARIA labels on interactive elements
- ✅ Responsive design (3 breakpoints)
- ✅ Light/dark mode with persisted preference
- ✅ 28-icon outline sprite (all integrated)
- ✅ 18-jurisdiction flag sprite (all integrated)

### Not Yet Implemented
- ❌ Real backend API (currently all mock data)
- ❌ User authentication / session management
- ❌ Real PDF parsing for regulatory documents
- ❌ ML-powered conflict detection
- ❌ Audit trail and change versioning
- ❌ Export/download functionality
- ❌ Multi-language support (UI is English only)
- ❌ WebSocket/real-time updates
- ❌ Database persistence

---

## Build & Runtime

### Dev Server
```bash
pnpm dev
# http://localhost:3000 with HMR
```

### Production Build
```bash
pnpm build
pnpm start
# Optimized bundle, static export ready for Vercel
```

### Type Checking
```bash
pnpm tsc --noEmit
# Zero errors expected
```

### Dependencies
```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "zustand": "5.0.13",
  "@fontsource/inter": "5.2.8",
  "@fontsource/jetbrains-mono": "5.2.8"
}
```

**Dev Dependencies:**
- TypeScript 5
- @types/react 19
- @types/node 20

---

## Known Issues / Limitations

1. **Mock Data Only** — All obligations, scrapers, and reports are hardcoded
2. **No Persistence** — Data resets on page reload (Zustand stores only)
3. **No Backend** — No API integration yet
4. **Sidebar Mark Clipping** — Fixed in Checkpoint 8 (viewBox expanded)
5. **Single Language** — UI is English only (en-GB)
6. **No User Auth** — All screens accessible without login

---

## Next Steps

### Immediate (1–2 sprints)
- [ ] Integrate real backend API for obligations
- [ ] Wire document scraper to parse actual regulatory PDFs
- [ ] Add user authentication (Clerk or similar)
- [ ] Implement obligation CRUD operations

### Medium-term (2–4 sprints)
- [ ] Add regulation version history / temporal queries
- [ ] Implement ML-based conflict detection
- [ ] Build audit trail for obligation changes
- [ ] Add export/download functionality

### Long-term (4+ sprints)
- [ ] Multi-language support (Spanish, French, German)
- [ ] Real-time WebSocket updates
- [ ] Advanced search with full-text indexing
- [ ] Integration with external compliance systems

---

## Development Environment

**Local Setup:**
- macOS (Sonoma 25.5.0)
- Node.js 26 (LTS)
- pnpm 9.x
- VS Code + Prettier + ESLint

**Recommended Plugins:**
- Next.js (vercel.next-js)
- Prettier - Code Formatter
- ES7+ React/Redux/React-Native snippets

**Browser DevTools:**
- React Developer Tools
- Redux DevTools (Zustand-compatible)

---

## Release History

| Version | Date | Highlights |
|---------|------|-----------|
| 0.1.0 | 2026-05-18 | Foundation complete: 7 screens, 20 regulations, 18 jurisdictions, design system integrated |

---

## Support & Contacts

See `CLAUDE.md` for AI development guidelines.  
See `README.md` for user-facing documentation.  
See `INTRODUCTION.md` for long-term architectural vision.
