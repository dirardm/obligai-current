# ObligaI · Centralised Stylesheets

The single source of truth for ObligaI styling. Two files, loaded in
order, give every product surface its colour, typography, components,
themes and registry of regulations.

```html
<link rel="stylesheet" href="colors_and_type.css"/>
<link rel="stylesheet" href="ObligaI_Extended_Stylesheet.css"/>
```

`colors_and_type.css` is **canonical** — it is delivered by the
designer and must not be modified. The extended stylesheet layers on
top of it and adds the component library, the regulation registry,
responsive design, themes and utilities.

---

## File map

| File | Role |
|---|---|
| `colors_and_type.css` | Canonical tokens · light / dark via `[data-theme]` · base button, input, card, badge classes. Never modify. |
| `ObligaI_Extended_Stylesheet.css` | This project's deliverable. Extends the canonical file with components, registry, themes, utilities. |
| `assets/logo_vertical.svg` | Canonical vertical lockup, light background. |
| `assets/logo_vertical_transparent.svg` | Canonical vertical lockup, transparent. |
| `assets/icons.svg` | 28-icon outline sprite, 1.5 px stroke, 24×24 grid. |
| `assets/flags.svg` | 18-flag sprite, simplified geometric, 24×16 grid. |
| `Stylesheet Reference.html` | Live, themeable visual reference for every token and component. |
| `DESIGN_SYSTEM.md` | Full implementation brief from the designer. |

---

## What's in the extended stylesheet

The file is organised in 27 numbered sections. Skim the table of
contents at the top — each section has a comment block describing its
intent.

| Section | What it covers |
|---|---|
| 1. Tokens | Motion, sizing, logo widths, shadows, z-scale |
| 2. Regulation registry | 16 regulations, each with primary/light/dark |
| 3. Jurisdictions | Regional groupings + per-country aliases |
| 4. Logo | Single canonical vertical lockup at six sizes |
| 5. Layout | Container, grid 1–6, flex helpers |
| 6. Typography | t-* type scale + regulation-coloured text |
| 7. Spacing | m-/p-/gap-/mt-/mb-… on the 8 px scale |
| 8. Cards | Compact, elevated, flat, stat, regulation |
| 9. Buttons | Size modifiers, block, group |
| 10. Tables | Compact, zebra, numeric, sticky header |
| 11. Badges & status | Regulation + status modifiers |
| 12. Forms | Input, select, textarea, checkbox, radio, field |
| 13. Regulation components | Label, jurisdiction section, separator |
| 14. Charts & graphs | D3 axes/bars/lines + Reagraph nodes/edges |
| 15. Completeness | Data-bound progress bar, score |
| 16. Alerts, tooltips, modals, menus, tabs, breadcrumbs | Feedback surfaces |
| 17. Theme overrides | Per-regulation `[data-theme]` overrides |
| 18. Accessibility | Focus, disabled, error, reduced motion, sr-only |
| 19. Responsive | 640 / 1200 / 1600 breakpoints |
| 20. Print | Print stylesheet |
| 21. Interactive polish | Hover transitions across the system |
| 22. Scoping | Combined jurisdiction-and-regulation control |
| 23. Icons | 28-icon outline sprite reference + size + context modifiers |
| 24. Spinner & skeleton | Loading states |
| 24b. Flags | 18-jurisdiction flag sprite wrapper |
| 25. Empty state | Zero-data surface |
| 26. Pagination | Page numbers with sienna underline indicator |
| 27. Sidebar, top bar, app shell | Layout chrome |

---

## Conventions

**Sienna `#B85C3A` is the only mode-invariant colour.** Every other
token has explicit light and dark values via `[data-theme]`.

**The registry is the canonical source.** Adding a new regulation is
a 5-minute append exercise documented below. The 20 currently-shipped
regulations cover EU, UK, US, Canada, Switzerland, Peru, Panama,
Mexico, Brazil, Japan, Singapore, Hong Kong, Australia, Indonesia,
Malaysia, Vietnam, Thailand and Internal (IRL).

**2 px radius everywhere except buttons.** Buttons are rectangular
(0 px) — no exceptions.

**Never hardcode hex values.** Every colour goes through a CSS custom
property. The only hex literals in the file live inside the registry
declarations themselves.

**British English** in all comments and copy.

---

## Adding a new regulation

A new regulation appends one block of tokens to the registry and one
modifier rule to each component class set. No CSS logic changes.

```css
/* 1. Add to the registry (section 2) */
:root {
  --color-uae-cbuae:        #1A8F4F;
  --color-uae-cbuae-light:  rgba(26, 143, 79, 0.10);
  --color-uae-cbuae-dark:   #4FB87B;
}
[data-theme="dark"] {
  --color-uae-cbuae-light:  rgba(79, 184, 123, 0.14);
}

/* 2. Add to each component that needs the modifier */
.t-uae-cbuae               { color: var(--color-uae-cbuae); }
.badge--uae-cbuae          { --reg-color: var(--color-uae-cbuae);
                             --reg-light: var(--color-uae-cbuae-light); }
.regulation-label--uae-cbuae { --reg-color: var(--color-uae-cbuae);
                               --reg-light: var(--color-uae-cbuae-light); }
.regulation-card--uae-cbuae  { --reg-color: var(--color-uae-cbuae); }
.chart-bar--uae-cbuae      { fill: var(--color-uae-cbuae); }
.graph-node--uae-cbuae     { stroke: var(--color-uae-cbuae); }
.scope-pill--uae-cbuae     { --reg-color: var(--color-uae-cbuae);
                             --reg-light: var(--color-uae-cbuae-light); }
[data-theme="dark"] .t-uae-cbuae               { color: var(--color-uae-cbuae-dark); }
[data-theme="dark"] .badge--uae-cbuae          { --reg-color: var(--color-uae-cbuae-dark); }
[data-theme="dark"] .chart-bar--uae-cbuae      { fill: var(--color-uae-cbuae-dark); }
[data-theme="dark"] .graph-node--uae-cbuae     { stroke: var(--color-uae-cbuae-dark); }

/* 3. (Optional) Regulation theme override */
[data-theme="regulation-uae-cbuae"] {
  --accent: var(--color-uae-cbuae); --accent-hover: var(--color-uae-cbuae);
  --accent-active: var(--color-uae-cbuae); --focus-ring: var(--color-uae-cbuae);
  --border-focus: var(--color-uae-cbuae); --accent-faint: var(--color-uae-cbuae-light);
}
```

If the new regulation belongs to a new country, also add a
jurisdiction alias in section 3:

```css
--color-juris-ae: var(--color-uae-cbuae);
```

That's it. Every screen that already uses badges, labels, cards or
charts immediately knows about the new regulation.

---

## Switching themes

```html
<html data-theme="light">   <!-- default -->
<html data-theme="dark">
<html data-theme="regulation-lcr">   <!-- scope a screen to one regulation -->
```

The combined scoping control reads the active jurisdiction and sets
`--juris-color` / `--juris-light` custom properties on the
`.scope-bar`, so the active chip, the popover focus ring, and the
"+ Add" trigger all reflect the jurisdiction without any extra CSS.

---

## Browser support

Modern evergreen browsers. Uses `color-mix(in oklab, …)` for a few
hover tints — safe for any browser released after early 2023. Fall
back to `var(--accent-border)` style tokens for IE / legacy.

---

## Working with React

Every visual is a className — no inline styles required. Recommended
import order in your root entry:

```ts
// 1. Fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";

// 2. Canonical tokens (never modify)
import "./styles/colors_and_type.css";

// 3. Extended stylesheet (this project)
import "./styles/ObligaI_Extended_Stylesheet.css";
```

Then in your `<ThemeProvider>`, persist `data-theme` on
`document.documentElement` and read it back on mount. The stylesheet
handles `prefers-reduced-motion` automatically.

---

## What this stylesheet does NOT contain

- React component code · build them in your app and use these
  classNames.
- Icons · the system mandates outline 1.5 px stroke; use any icon
  library that respects `stroke="currentColor"`, then wrap with
  `<span class="icon icon--lg">`.
- Fonts · loaded via Google Fonts (`Inter`, `JetBrains Mono`); see
  `DESIGN_SYSTEM.md` for the link tag.
- Application logic · search filters, multi-select state, etc.

---

## Versioning

`v1.1` — added Indonesia (OJK), Malaysia (BNM), Vietnam (SBV) and
Thailand (BOT). 28-icon sprite and 18-flag sprite shipped under
`assets/`. Total: **20 regulations** across **18 country
jurisdictions**.

`v1.0` — initial release. 16 regulations, 14 jurisdictions, combined
scoping control, full light/dark themes, full component library.
