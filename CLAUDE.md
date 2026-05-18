# CLAUDE.md — AI Development Guidelines

Guidelines for Claude (and other AI assistants) working on the ObligaI codebase.

---

## Core Principles

### 1. ClassNameOnly: No Styling Logic in React
- Every component is a **thin className wrapper**
- All visual behavior lives in `ObligaI_Extended_Stylesheet.css`
- Never add inline styles for colour, spacing, radius, shadow, or theme
- Exceptions:
  - Layout centering via `minHeight`, `display: flex` (structural, not visual)
  - Dynamic values as CSS custom properties: `{ "--seg-w": "45%" }`

**Example (Good):**
```tsx
export function Button({ children, className, variant = "primary", ...props }) {
  return <button className={["btn", `btn--${variant}`].filter(Boolean).join(" ")} {...props}>{children}</button>;
}
```

**Example (Bad):**
```tsx
export function Button({ children, variant = "primary" }) {
  const colors = { primary: "#B85C3A", secondary: "#666" };
  return <button style={{ backgroundColor: colors[variant] }}>{children}</button>;
}
```

### 2. Registry-Driven Regulation Awareness
- `src/data/registry.ts` is the **single source of truth**
- Never hardcode regulation IDs, labels, or jurisdiction mappings
- When you need a regulation: `REGULATIONS.find(r => r.id === "lcr")`
- When you need a jurisdiction: `JURISDICTIONS.find(j => j.id === "uk")`
- Always validate against the registry arrays in tests

**Example (Good):**
```tsx
import { REGULATIONS } from "@/data/registry";

export function RegulationBadge({ regulationId }) {
  const reg = REGULATIONS.find(r => r.id === regulationId);
  return <span className={`badge--${regulationId}`}>{reg?.shortLabel}</span>;
}
```

**Example (Bad):**
```tsx
const regLabels = {
  "lcr": "LCR",
  "nsfr": "NSFR",
  // ... hardcoded duplication
};
```

### 3. CSS Custom Properties, Never Hex Literals
- All colour, spacing, shadow, motion, and sizing use `--var-name` patterns
- The only hex literals allowed are in the `§2` registry section of the stylesheet
- Sienna `#B85C3A` is mode-invariant and lives in the SVG assets (logo, icons)

**Example (Good):**
```tsx
<div className="card">
  <h1 className="t-heading" style={{ color: "var(--accent)" }}>Title</h1>
</div>
```

**Example (Bad):**
```tsx
<h1 style={{ color: "#B85C3A" }}>Title</h1>
```

### 4. Zustand Stores: Minimal, Orthogonal
- State is split into **two focused stores:**
  - `theme.ts` — light/dark theme, persists to localStorage
  - `scope.ts` — active jurisdiction, selected regulations
- Each store is a thin wrapper around `zustand` with clear selectors
- Never put business logic in stores; they hold derived UI state only

**Example (Good):**
```tsx
// src/store/scope.ts
export const useScopeStore = create((set) => ({
  selectedRegulations: [],
  toggleRegulation: (id) => set((state) => ({
    selectedRegulations: state.selectedRegulations.includes(id)
      ? state.selectedRegulations.filter(r => r !== id)
      : [...state.selectedRegulations, id],
  })),
}));
```

### 5. Component Organization
```
src/components/
├── ui/                  # Primitives (Button, Input, Card, Badge, Alert, etc.)
├── layout/              # Page-level layout (Sidebar, TopBar, AppShell, BreadCrumbs)
└── product/             # Feature-specific (ObligationDetail, StatusBadge, CompletenessBar, etc.)
```

- **ui/** — zero business logic, pure className wrappers, highly reusable
- **layout/** — chrome, navigation, theme toggle
- **product/** — screens, filters, domain logic

### 6. Naming Conventions
- **Components:** PascalCase (`ObligationDetail`, `StatusBadge`)
- **Hooks:** camelCase with `use` prefix (`useScopeStore`, `useTheme`)
- **CSS classes:** kebab-case (`.btn`, `.btn--primary`, `.card--elevated`)
- **Data:** PascalCase types (`RegulationId`, `Obligation`), SCREAMING_SNAKE_CASE constants (`REGULATIONS`, `JURISDICTIONS`)

### 7. TypeScript Strictness
- All files: `strict: true` in `tsconfig.json`
- No `any` types without explicit comment explaining why
- Props interfaces should be exported and documented
- Data types live in `src/data/registry.ts` and co-located with logic

**Example (Good):**
```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", ...props }: ButtonProps) {
  // ...
}
```

---

## Adding Features

### New Screen / Page
1. Create `src/app/(app)/[route]/page.tsx`
2. Import `Sidebar`, `TopBar`, `ScopeControl` from layout components
3. Use semantic className patterns from `§28` of the stylesheet
4. Import data from `src/data/registry.ts` and `src/data/obligations.ts`
5. If filtering is needed, subscribe to scope store: `const scope = useScopeStore()`
6. No hardcoded mock data—pull from registry and obligations

### New UI Component
1. Create `src/components/ui/ComponentName.tsx`
2. Accept `className` prop and forward other props
3. Export TypeScript interface for props
4. No styling logic—just className concatenation
5. Add to `/gallery` page for visual regression testing

### New Regulation / Jurisdiction
1. **Update Registry:**
   ```ts
   // src/data/registry.ts
   export type RegulationId = "lcr" | "nsfr" | "my-new-reg";
   export type JurisdictionId = "eu" | "uk" | "my-new-country";
   
   export const JURISDICTIONS: Jurisdiction[] = [
     // ... existing
     { id: "my-new-country", label: "My Country", cc: "xx" },
   ];
   
   export const REGULATIONS: Regulation[] = [
     // ... existing
     {
       id: "my-new-reg",
       label: "My New Regulation",
       shortLabel: "MNR",
       framework: "Framework Name",
       jurisdictionId: "my-new-country",
     },
   ];
   ```

2. **Update Stylesheet (§2):**
   ```css
   :root {
     --color-my-new-reg: #1A2B3C;
     --color-my-new-reg-light: rgba(26, 43, 60, 0.10);
     --color-my-new-reg-dark: #4D6B85;
   }
   [data-theme="dark"] {
     --color-my-new-reg-light: rgba(77, 107, 133, 0.14);
   }
   ```

3. **Add Component Modifiers (§11, §14, etc.):**
   ```css
   .badge--my-new-reg { --reg-color: var(--color-my-new-reg); --reg-light: var(--color-my-new-reg-light); }
   .chart-bar--my-new-reg { fill: var(--color-my-new-reg); }
   /* ... for every component that needs it */
   ```

4. **Add Mock Obligations:**
   ```ts
   // src/data/obligations.ts
   {
     id: "obl-xyz",
     regulationId: "my-new-reg",
     jurisdictionId: "my-new-country",
     // ... other fields
   },
   ```

---

## Common Patterns

### Pattern: Subscription to Scope Store
```tsx
import { useScopeStore } from "@/store/scope";

export function MyComponent() {
  const scope = useScopeStore((state) => ({
    selectedRegs: state.selectedRegulations,
    activeJuris: state.activeJurisdiction,
  }));
  
  const filtered = obligations.filter(o =>
    scope.selectedRegs.includes(o.regulationId) &&
    o.jurisdictionId === scope.activeJuris
  );
  
  return <div>{/* render filtered data */}</div>;
}
```

### Pattern: Conditional CSS Variables
```tsx
<div
  style={{
    "--seg-w": `${(value / max) * 100}%`,
    "--reg-color": getColorForRegulation(regulationId),
  }}
  className="hbar-seg"
/>
```

### Pattern: ClassName Merging
```tsx
export function Card({ className, children, ...props }) {
  return (
    <div
      className={["card", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Pattern: ARIA Labels on SVG
```tsx
<svg aria-label="Conflict graph showing 3 conflicts across LCR and NSFR">
  {/* ... nodes, edges */}
</svg>
```

---

## Testing & Validation

### Before Committing
1. **TypeScript:** `pnpm tsc --noEmit` — zero errors
2. **Visual:** Visit `/gallery` to preview new components
3. **Scope:** Check that scope state persists across navigation
4. **Theme:** Toggle dark mode and verify colours update
5. **Accessibility:** Tab through interactive elements; check ARIA labels

### Regression Testing
- Always add new regulation/jurisdiction variants to `/gallery`
- If you modify a component, revisit `/gallery` to ensure all variants still render

---

## Anti-Patterns: Don't Do These

❌ **Hardcoded colour values** — use CSS variables  
❌ **Business logic in Zustand stores** — stores are UI state only  
❌ **New regulation without updating registry** — update registry first  
❌ **Inline styles for theme-aware properties** — use classNames  
❌ **Direct DOM manipulation** — use React state and re-render  
❌ **Magic numbers for breakpoints** — use `640px`, `1200px`, `1600px`  
❌ **Mixing layout logic with styling** — separate concerns  
❌ **Tests without registry validation** — always validate against single source of truth  

---

## Commit Message Guidelines

**Format:** `[area]: [imperative action] [details]`

**Examples:**
```
register: add Colombia, Brazil, Peru, Panama; close scope control on select
sidebar: fix mark viewBox to show all nodes in collapsed state
sources: compact table density
topbar: wire search input to /register/search
```

**Rules:**
- Imperative mood ("fix", "add", "update", not "fixed", "added")
- Reference specific regulations/jurisdictions if relevant
- Keep subject line under 70 characters
- Include reason in body if non-obvious

---

## Git Workflow

1. **Branch naming:** `feature/xyz`, `fix/xyz`, `docs/xyz`
2. **Commit early and often** — small commits are easier to review
3. **Rebase before merge** — keep history linear
4. **No force push to main** — review changes with `git diff`

---

## File Change Checklist

Before opening a PR, confirm:

- [ ] Registry updated if adding regulations/jurisdictions
- [ ] Stylesheet updated if adding components or regulations
- [ ] TypeScript strict mode passes
- [ ] No hex literals outside `src/styles/`
- [ ] No `style={{}}` for colour/spacing/theme properties
- [ ] All components use classNames, not inline styles
- [ ] New regulation appears in `/gallery`
- [ ] Scope store used if filtering needed
- [ ] ARIA labels added to interactive elements
- [ ] Commit message follows guidelines

---

## Resources

- **Design System:** See `README.md` for the design system philosophy
- **Progress History:** See `progress.md` for build milestones
- **Current State:** See `STATE.md` for latest feature snapshot
- **Full Description:** See `DESCRIPTION.md` for complete feature + architecture spec

---

## Questions or Clarifications?

If you're unsure about a pattern, check:
1. An existing component that solves a similar problem
2. `progress.md` to see the pattern used in that checkpoint
3. `/gallery` to see component variants

This codebase prioritizes consistency over cleverness. When in doubt, look at what's already there and follow the pattern.
