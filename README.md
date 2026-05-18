# ObligaI — Regulatory Intelligence Platform

A modern, interactive platform for exploring, tracking, and managing regulatory obligations across multiple jurisdictions and financial regulations. Built with Next.js, TypeScript, and the ObligaI design system.

---

## What is ObligaI?

**ObligaI** is a comprehensive regulatory compliance intelligence platform designed for financial institutions and compliance professionals to understand, track, and manage obligations across multiple jurisdictions and regulatory frameworks.

**This repository contains:**
- The web application (Next.js 16 + React 19)
- Complete design system documentation (see `design/`)
- Development guidelines and architecture notes

The application provides:

- **Obligation Registry** — a searchable, sortable database of 131 regulatory obligations across 20 regulations and 18 jurisdictions
- **Regulatory Sources** — automated scraper monitoring for regulatory document changes across 8+ regulatory bodies
- **Conflict Detection** — visual graph-based identification of conflicting regulatory requirements
- **Compliance Dashboard** — at-a-glance overview of obligation status, completeness, and deadlines
- **Multi-Jurisdiction Support** — built-in support for EU, UK, US, Canada, and Latin American (Colombia, Brazil, Peru, Panama) regulations with extensibility to more

---

## Features

### Core Screens

| Screen | Purpose |
|--------|---------|
| **Dashboard** | Overview of compliance status by jurisdiction/regulation, recent changes, completeness metrics |
| **Register** | Full obligation database with filtering, sorting, multi-select, bulk actions, and detail views |
| **Sources** | Regulatory document scraper status, document ingestion logs, and refresh controls |
| **Conflicts** | Graph-based visualization of regulatory conflicts with filtering and drill-down |
| **Reports** | Generate, download, and track compliance reports |
| **Settings** | User preferences, jurisdiction/entity configuration, theme selection |

### Interactive Components

- **ScopeControl** — jurisdiction/regulation picker with real-time filtering across all screens
- **StatusBadge** — visual status indicators (active, pending, conflicted)
- **CompletenessBar** — progress visualization for obligation completion
- **Graph Visualization** — circular layout conflict detection with edge highlighting
- **Tables** — sortable, paginated, with bulk-select and row-detail panels
- **Modal Forms** — report generation, settings updates

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router, TypeScript)
- **React 19** with hooks
- **Zustand 5** — lightweight state management (theme, scope)
- **TypeScript 5** — strict type checking across all components

### Styling
- **ObligaI Design System** (see `design/README.md`) — canonical token stylesheet + extended component library
  - `web/src/styles/colors_and_type.css` — designer-maintained, read-only
  - `web/src/styles/ObligaI_Extended_Stylesheet.css` — semantic components, regulations registry, responsive grid
- **CSS Variables** — mode-invariant sienna accent, jurisdiction-aware theming
- **Light/Dark Themes** — via `data-theme` attribute
- **Design Documentation** — See `design/` folder for complete design system reference

### Assets
- **@fontsource/inter** — primary typeface (400, 500, 700)
- **@fontsource/jetbrains-mono** — monospace for tables/code
- **SVG Sprites** — 28-icon outline set, 18-jurisdiction flags

### Runtime
- **Node.js 26** (LTS)
- **pnpm** — fast, space-efficient package manager

### Build & Deployment
- **Next.js Build** — optimized production bundles
- **Vercel** (optional) — recommended deployment platform

---

## Project Structure

```
obligai-current/
├── design/                         # Design system documentation
│   ├── README.md                   # Design system overview
│   ├── DESIGN_SYSTEM.md            # Complete specification
│   ├── STRUCTURE.md                # Stylesheet organization
│   └── Stylesheet Reference.html   # Interactive component reference
├── web/                            # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout with theme + stylesheets
│   │   │   ├── page.tsx            # Home/dashboard redirect
│   │   │   └── (app)/
│   │   │       ├── layout.tsx      # AppShell + navigation
│   │   │       ├── page.tsx        # Dashboard
│   │   │       ├── register/       # Obligation registry
│   │   │       ├── sources/        # Document scrapers
│   │   │       ├── conflicts/      # Conflict detection graph
│   │   │       ├── reports/        # Report generation
│   │   │       └── settings/       # User settings
│   │   ├── components/
│   │   │   ├── ui/                 # Primitive components (Button, Input, etc.)
│   │   │   ├── layout/             # Layout components (Sidebar, TopBar, AppShell)
│   │   │   └── product/            # Feature components (Dashboard, Register, etc.)
│   │   ├── data/
│   │   │   ├── registry.ts         # 20 regulations, 18 jurisdictions
│   │   │   └── obligations.ts      # 131 mock obligations
│   │   ├── store/
│   │   │   ├── theme.ts            # Zustand theme store
│   │   │   └── scope.ts            # Zustand scope store
│   │   └── styles/
│   │       ├── colors_and_type.css (reference: design/)
│   │       └── ObligaI_Extended_Stylesheet.css
│   ├── public/assets/              # SVG logos, icons, flags
│   └── package.json
├── README.md                        # App overview (this file)
├── DESCRIPTION.md                   # Full feature + architecture description
├── CLAUDE.md                        # AI development guidelines
├── STATE.md                         # Current state snapshot
└── progress.md                      # Build checkpoint history
```

---

## Design System

The complete design system documentation lives in the `design/` folder:
- **`design/README.md`** — Overview and quick start
- **`design/DESIGN_SYSTEM.md`** — Complete token and component specifications
- **`design/Stylesheet Reference.html`** — Interactive component gallery (open in browser)

The actual stylesheets are in `web/src/styles/` and are never modified directly—only extended.

---

## Getting Started

### Prerequisites
- Node.js 26+ (or Volta pinning)
- pnpm 9+

### Installation

```bash
cd obligai-current/web
pnpm install
```

### Development

```bash
pnpm dev
```

Opens http://localhost:3000 with hot reload.

### Production Build

```bash
pnpm build
pnpm start
```

---

## Key Design Decisions

### 1. ClassNameOnly Components
All components are thin className wrappers—no styling logic. All visual behavior comes from the ObligaI stylesheet. Example:

```tsx
export function Button({ children, className, ...props }) {
  return <button className={["btn", className].filter(Boolean).join(" ")} {...props}>{children}</button>;
}
```

### 2. Registry-Driven Regulation Awareness
The `REGULATIONS` and `JURISDICTIONS` arrays in `registry.ts` are the single source of truth. Every component that references a regulation or jurisdiction pulls from this array, ensuring consistency.

### 3. Scope Store Pattern
Zustand stores (`theme.ts`, `scope.ts`) hold mutable app state. Components subscribe via `useScopeStore()` and `useThemeStore()` hooks. State is persisted to localStorage.

### 4. CSS Custom Properties for Dynamic Values
Instead of inline styles for colour, spacing, or shadows, components set CSS custom properties:

```tsx
<div style={{ "--seg-w": "45%", "--reg-color": colorForRegulation }} className="hbar-seg" />
```

### 5. Responsive Design
Three breakpoints: 640px, 1200px, 1600px. All layouts use CSS Grid and Flexbox. No media-query brittleness—components are layout-agnostic.

---

## Regulations Supported

**Financial Regulations (EU/Basel III):**
- LCR (Liquidity Coverage Ratio)
- NSFR (Net Stable Funding Ratio)
- ALMM (Additional Liquidity Monitoring Metrics)
- IRL (Indicador de Riesgo de Liquidez) — Colombia

**Jurisdiction-Specific:**
- UK PRA (Prudential Regulation Authority)
- US Fed (Federal Reserve Liquidity Standards)
- OSFI LAR (Canada)
- FINMA (Switzerland)
- Peru SBS, Panama SBP
- Mexico CNBV
- Brazil BCB
- Japan BSR, Singapore MAS, Hong Kong HKMA
- Australia APRA, Indonesia OJK, Malaysia BNM
- Vietnam SBV, Thailand BOT

---

## Development Workflow

### Adding a New Screen
1. Create `src/app/(app)/[screen]/page.tsx`
2. Import layout components: `Sidebar`, `TopBar`, `ScopeControl`
3. Use semantic class names from `§28` of the stylesheet
4. Pull data from `registry.ts` and `obligations.ts`
5. Subscribe to scope store if filtering is needed

### Adding a New Regulation
1. Add to `REGULATIONS` array in `src/data/registry.ts`
2. Add corresponding `JurisdictionId` to `JURISDICTIONS` array
3. Append CSS colour tokens to `§2` of `ObligaI_Extended_Stylesheet.css`
4. Add component modifiers (badge, text, chart) to relevant sections
5. Test in `/gallery` to preview all variants

### Styling
- **Never** hardcode hex values outside `src/styles/`
- **Always** use CSS custom properties (e.g., `var(--accent)`, `var(--surface)`)
- **Theme toggle** applies `data-theme` to `<html>`—CSS variable fallbacks handle light/dark

---

## Testing & Validation

### TypeScript
```bash
pnpm tsc --noEmit
```

### Visual Validation
Visit `/gallery` to see all components, variants, and regulations in one place.

### Accessibility
- All interactive elements have ARIA labels
- Semantic HTML (`<button>`, `<select>`, `<input>`)
- Focus management in modals and dropdowns
- `prefers-reduced-motion` respected via stylesheet

---

## Performance Considerations

- **Next.js Image Optimization** — SVG assets loaded inline (no overhead)
- **CSS-Only Styling** — no runtime style injection
- **Zustand Store Granularity** — separate stores for independent state trees
- **Pagination** — 10 obligations per page by default
- **Lazy Loading** — routes use App Router code-splitting

---

## Troubleshooting

### Dev server won't start
```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Styles not updating
Check that both stylesheets are imported in `app/layout.tsx` in the correct order:
1. Fonts
2. `colors_and_type.css`
3. `ObligaI_Extended_Stylesheet.css`

### Theme not persisting
Check browser localStorage in DevTools; Zustand store must initialize after hydration.

---

## Contributing

See `CLAUDE.md` for AI development guidelines. Human contributors should follow the same patterns: thin components, classNameOnly style, registry-driven regulation awareness.

---

## License

Internal project. Copyright © 2026.

---

## Next Steps

- **Real Backend Integration** — replace mock obligations with API calls
- **Document Ingestion Pipeline** — wire scrapers to parse real regulatory PDFs
- **ML-Powered Conflict Detection** — move beyond static conflict pairs
- **Audit Trail & Versioning** — timestamp and track obligation changes
- **Export & Reporting** — generate downloadable compliance reports
- **Multi-Language Support** — extend UI to Spanish, French, German
