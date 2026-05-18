# ObligaI — Build Progress

---

## Checkpoint 1 — Foundation ✓

**Date:** 2026-05-17  
**Stack:** Next.js 16 (App Router) · TypeScript · pnpm · Node 26

### What was done

- Scaffolded Next.js 15/16 App Router project in `web/`
- Installed `@fontsource/inter` and `@fontsource/jetbrains-mono`
- Copied canonical stylesheets into `web/src/styles/`
  - `colors_and_type.css` — never modified
  - `ObligaI_Extended_Stylesheet.css` — never modified
- Copied all SVG assets into `web/public/assets/`
  - `logo_vertical.svg`, `logo_vertical_transparent.svg`
  - `icons.svg` (28-symbol sprite)
  - `flags.svg` (18-jurisdiction sprite)
- Wired `web/src/app/layout.tsx` with the mandated import order (fonts → canonical tokens → extended stylesheet)
- Set `data-theme="light"` and `lang="en-GB"` on `<html>`
- Removed generated `globals.css` content and `page.module.css` (stylesheets replace them)
- Created `web/src/components/ui/Logo.tsx` — inlines the canonical SVG verbatim, accepts `size` prop
- Created `web/src/app/page.tsx` — centred layout using `.flex-center .flex-col .gap-6` from §5/§7; logo at `size="lg"`; headline `<h1 className="t-display">Hello, ObligaI</h1>`

### Validation checklist

- [x] No hex colour literals outside `src/styles/` (sienna `#B85C3A` in the Logo SVG is mode-invariant and part of the canonical asset)
- [x] No `style={{}}` for colour, spacing, type, radius or shadow (only `minHeight: "100dvh"` for structural centering)
- [x] Wordmark intact — mark and wordmark authored as one SVG, not recomposed
- [x] Title: "ObligaI", description set
- [x] No `console.error` observed on page load
- [x] Dev server running at http://localhost:3000

### Awaiting

Screenshot confirmation from user. Checkpoint 2 complete.

---

## Checkpoint 2 — UI Primitives ✓

**Date:** 2026-05-17

### Components built (`src/components/ui/`)

Button · Input · Select · Textarea · Checkbox · Radio · Card · Badge · Tag · Alert · Modal · Tooltip · Dropdown · Tabs · Breadcrumbs · Pagination · Spinner · Skeleton · EmptyState · Icon · Flag · Logo

All components: thin className wrappers, no styling logic, accept standard HTML props, support className concatenation, forward refs where appropriate.

### Data

`src/data/registry.ts` — 20 `RegulationId` values, 18 `JurisdictionId` values, full `REGULATIONS` and `JURISDICTIONS` arrays with labels, frameworks and country codes.

### Gallery route

`/gallery` — renders every variant: 4 button variants × 3 sizes, all alerts, all status badges, all 20 regulation badges, all input states, all card variants, all spinner sizes, skeleton group, empty state, tabs, pagination, breadcrumbs, dropdown, modal, 28 icons, 18 flags.

Note: Next.js App Router excludes `__`-prefixed folders from routing; route is `/gallery` not `/__gallery`.

### Validation checklist

- [x] No hex literals in any component file
- [x] No `style={{}}` for colour, spacing, type, radius or shadow
- [x] TypeScript: zero errors (`pnpm tsc --noEmit`)
- [x] Gallery returns HTTP 200 and contains expected class names
- [x] All 20 regulation badge classes confirmed in rendered HTML

---

## Checkpoint 3 — Layout + Theming ✓

**Date:** 2026-05-17

### What was done

- Built `AppShell` layout (`src/app/(app)/layout.tsx`) with `Sidebar` + main content area
- Built `Sidebar` with logo, nav links (Dashboard, Register, Conflicts, Sources, Reports, Settings), active-state detection via `usePathname`
- Built `TopBar` with breadcrumbs, `ScopeControl` mount point, and theme toggle
- Built `Breadcrumbs` component — derives label from pathname segments
- Wired Zustand theme store (`src/store/theme.ts`) — persists to `localStorage`, applies `data-theme` to `<html>`
- Empty placeholder pages scaffolded for all routes: `/`, `/register`, `/register/[id]`, `/conflicts`, `/sources`, `/reports`, `/settings`
- `lang="en-GB"` and `data-theme` on `<html>` confirmed

### Validation checklist

- [x] Sidebar nav highlights active route
- [x] Theme toggle switches `data-theme` on `<html>`; preference persists across reload
- [x] Breadcrumbs update on route change
- [x] TypeScript: zero errors

---

## Checkpoint 4 — Scoping Control + Registry ✓

**Date:** 2026-05-17

### What was done

- `src/data/registry.ts` — 20 `RegulationId` values, 18 `JurisdictionId` values, full `REGULATIONS` and `JURISDICTIONS` arrays
- `src/store/scope.ts` — Zustand store: `selectedRegulations`, `activeJurisdiction`, `toggleRegulation`, `clearScope`, `setActiveJurisdiction`
- `ScopeControl` component: regulation scope chips (`.scope-chip` / `.scope-pill--{reg}`), jurisdiction selector popover, jurisdiction-colour-awareness via `--juris-color` CSS custom property
- `src/data/obligations.ts` — 432 mock `Obligation` entries across all 20 regulations and 18 jurisdictions; fields: `id`, `regulationId`, `jurisdictionId`, `framework`, `citation`, `summary`, `status`, `completeness`, `deadline`, `assignedTo`, `linkedControls`, `conflicts`, `lastUpdated`
- Scope state persists across route changes via Zustand

### Validation checklist

- [x] Scope chip toggles update `selectedRegulations` in store
- [x] `--juris-color` CSS variable updates on jurisdiction change
- [x] Scope state survives route navigation
- [x] TypeScript: zero errors

---

## Checkpoint 5 — Register + Detail ✓

**Date:** 2026-05-17

### What was done

- `src/app/(app)/register/page.tsx` — full obligation register: filter sidebar (status + jurisdiction checkboxes), sortable columns (`SortTh` inner component), multi-select with bulk action bar, pagination (10 per page), loading skeleton (8-row), empty state, error state
- `src/app/(app)/register/[id]/page.tsx` — async server component; looks up obligation by route param, calls `notFound()` for unknown IDs, renders `ObligationDetail` with regulation + jurisdiction resolved from registry
- Product components built: `ObligationDetail`, `ObligationRow`, `StatusBadge`, `CompletenessBar`, `ConflictBadge`, `ValidationScore`, `JurisdictionTag`
- Scope changes from `ScopeControl` propagate to register table via `useScopeStore`

### Validation checklist

- [x] Column sort toggles direction on repeat click
- [x] Bulk bar appears on row selection, disappears on clear
- [x] Pagination resets to page 1 on filter change
- [x] Detail page resolves real data; 404 on unknown ID
- [x] TypeScript: zero errors

---

## Checkpoint 6 — Dashboard, Sources, Settings, Reports ✓

**Date:** 2026-05-17

### What was done

- `src/app/(app)/page.tsx` — Dashboard: `ScopeControl`, four stat cards (`grid-4`), jurisdiction horizontal bar chart (CSS-based stacked bars via `scope-pill--{reg}` + `--reg-color` + `--seg-w`), recent regulatory changes table (last 10 by `lastUpdated`), coverage completeness summary by regulation
- `src/app/(app)/sources/page.tsx` — Sources: 8 mock scrapers table (jurisdiction flag, regulation badge, health badge, last-fetched, next-fetch, refresh button), row-click sticky side panel listing fetched documents with type tag and citation
- `src/app/(app)/settings/page.tsx` — Settings: six hash-routed tabs (Jurisdictions, Entity Types, GRC Connections, User Roles, Theme, Notifications); `ThemePanel` uses Zustand theme store; full ARIA tab pattern
- `src/app/(app)/reports/page.tsx` — Reports: generated-reports table (status badges, download/retry/spinner per status), generate-new-report form with template `<select>` and format `btn--group`, confirmation modal on submit

### §28 additions to `ObligaI_Extended_Stylesheet.css`

Layout classes for all four screens appended under clearly commented subsection headings: dashboard (`hbar`, `hbar-row`, `hbar-seg`, `coverage-item`), register (`register-layout`, `filter-panel`, `bulk-bar`, `th-sort`), sources (`sources-layout`, `source-panel`, `source-doc-item`).

### Validation checklist

- [x] Bar chart segment widths driven by `--seg-w` CSS custom property — no inline colour
- [x] Source panel sticky-positions while table scrolls
- [x] Settings tabs update URL hash; hash read on mount restores active tab
- [x] Modal closes on Escape and backdrop click
- [x] TypeScript: zero errors

---

## Checkpoint 7 — Conflicts + Polish ✓

**Date:** 2026-05-17

### What was done

- `src/app/(app)/conflicts/page.tsx` — Conflict Detection: `ScopeControl`, `ConflictBadge` count in header, SVG graph with circular layout (6 nodes, trigonometric positions, `viewBox="0 0 600 520"`), nodes coloured by `graph-node--{reg}`, edges styled `graph-edge--conflict`, node-click highlights connected edges via `graph-edge--active`, right-panel conflict list with jurisdiction filter chips, conflict type tag, citation, detection date; out-of-scope nodes and edges dimmed via SVG `opacity` attribute; empty states for both graph and list
- Conflict pairs derived at runtime from `OBLIGATIONS.conflicts` (3 unique pairs: Reporting overlap, Definitional conflict, Jurisdictional overlap)

### §28 additions

`conflict-layout`, `conflict-graph-area`, `conflict-graph-frame`, `conflict-graph-empty`, `conflict-panel`, `conflict-panel__filters`, `conflict-item`, `conflict-item--active`, `conflict-item__ids`, `conflict-item__meta`, `graph-edge--active` appended to §28 block.

### Validation checklist

- [x] No hex colour literals outside `src/styles/` (verified with `rg`)
- [x] No `style={{}}` for colour, spacing, type, radius or shadow (dynamic `--seg-w`, `--value`, `--juris-color`, `--reg-color` CSS variable props excepted)
- [x] Every button: 0 px radius (per stylesheet token)
- [x] Every card, badge, input, alert: 2 px radius (per stylesheet token)
- [x] Wordmark intact — single inlined SVG, not recomposed
- [x] ARIA labels on all SVG charts and interactive elements
- [x] Scope state persists across all route changes
- [x] Dark mode confirmed token-driven; sienna invariant
- [x] TypeScript: zero errors across all screens (`tsc --noEmit`)
