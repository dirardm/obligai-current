# ObligaI Design System

The ObligaI design system is a comprehensive, production-ready stylesheet library that serves as the visual foundation for all ObligaI applications.

---

## Overview

Two canonical CSS files define every visual element across the platform:

1. **`colors_and_type.css`** — Designer-maintained tokens (read-only)
2. **`ObligaI_Extended_Stylesheet.css`** — Component library, utilities, responsive grid

All colors, spacing, typography, components, and themes flow from these stylesheets. **No hardcoded hex values. No inline styles.** Everything is className-driven.

---

## Files in This Folder

### Documentation
| File | Purpose |
|------|---------|
| **README.md** | This file — design system overview and quick start |
| **DESIGN_SYSTEM.md** | Complete design system specification from the designer |
| **STRUCTURE.md** | Stylesheet organization and section guide |
| **INTRODUCTION.md** | Long-term architectural vision for the regulatory knowledge graph |
| **PROMPT.md** | Original design briefs and prompts |
| **Stylesheet Reference.html** | Interactive live reference (open in browser) |

### Stylesheets (Canonical)
| File | Purpose |
|------|---------|
| **colors_and_type.css** | Canonical tokens (light/dark, typography, spacing) |
| **ObligaI_Extended_Stylesheet.css** | Extended components, regulation registry, responsive grid |

### Assets & References
| Folder/File | Purpose |
|--------|---------|
| **assets/** | SVG logos, icons (28), flags (18) |
| **screenshots/** | Design system reference screenshots |
| **uploads/** | Design files and source materials |
| **ObligaI Centralised Stylesheets.zip** | Archived design system package |

---

## Quick Start

### Where Are the Stylesheets?

The canonical stylesheet files are in **this folder** (`design/`):

```
design/
├── colors_and_type.css                    # Canonical tokens (never modify)
└── ObligaI_Extended_Stylesheet.css        # Extended components (add components here)
```

These are copied to the **web app** for use:

```
web/src/styles/
├── colors_and_type.css                    # Copy of design/colors_and_type.css
└── ObligaI_Extended_Stylesheet.css        # Copy of design/ObligaI_Extended_Stylesheet.css
```

When the stylesheets are updated in `design/`, they should be copied to `web/src/styles/`.

### How to Use the Design System in Your App

1. **Import fonts** (web/src/app/layout.tsx):
   ```tsx
   import "@fontsource/inter/400.css";
   import "@fontsource/inter/500.css";
   import "@fontsource/inter/700.css";
   import "@fontsource/jetbrains-mono/400.css";
   ```

2. **Import stylesheets** (in order):
   ```tsx
   import "./styles/colors_and_type.css";        // Read-only
   import "./styles/ObligaI_Extended_Stylesheet.css"; // Extended
   ```

3. **Use classNames** in your components:
   ```tsx
   <button className="btn btn--primary btn--lg">Click me</button>
   <div className="card card--elevated">
     <h1 className="t-heading">Title</h1>
   </div>
   ```

4. **Switch themes** via `data-theme` attribute:
   ```tsx
   <html data-theme="light">   <!-- default -->
   <html data-theme="dark">
   <html data-theme="regulation-lcr">
   ```

---

## Design Tokens

### Colour
- **Mode-invariant:** Sienna `#B85C3A` (accent, always the same)
- **Light mode:** Surface, text, border colours optimized for light backgrounds
- **Dark mode:** Same tokens with inverted values via `[data-theme="dark"]`
- **Regulation-scoped:** Each of 20 regulations has a primary colour + light/dark variants

### Typography
- **Primary:** Inter (400, 500, 700) — UI, body text
- **Monospace:** JetBrains Mono (400) — tables, code, terminal
- **Scale:** 12 sizes from `t-small` to `t-display`

### Spacing
- **8px scale:** All margins, padding, gaps use multiples of 8px
- **Helpers:** `m-1` through `m-6`, `p-1` through `p-6`, `gap-1` through `gap-6`

### Radius
- **Default:** 2px everywhere except buttons
- **Buttons:** 0px (rectangular, no exceptions)

### Motion
- **Micro:** 0.15s (colour transitions, small state changes)
- **Panel:** 0.3s (sidebar expand/collapse, modal open)

### Shadows
- **Elevation 1:** Used for cards, dropdowns
- **Elevation 2:** Used for modals

---

## Component Library

The extended stylesheet includes pre-built classes for:

- **Buttons** — `btn`, `btn--primary`, `btn--secondary`, `btn--ghost`, `btn--sm`, `btn--md`, `btn--lg`
- **Cards** — `card`, `card--elevated`, `card--flat`, `card--stat`, `card--regulation`
- **Badges** — `badge--{regulation}`, `badge--active`, `badge--pending`, `badge--conflicted`
- **Forms** — `input`, `select`, `textarea`, `checkbox`, `radio`, `field`
- **Tables** — `table`, `table--compact`, `table--zebra`, `table--numeric`
- **Alerts** — `alert`, `alert--error`, `alert--warning`, `alert--success`, `alert--info`
- **Typography** — `t-small`, `t-body`, `t-heading`, `t-display`, etc.
- **Layout** — `flex-center`, `flex-between`, `grid-2`, `grid-3`, `grid-4`, `gap-3`, etc.
- **Utilities** — `sr-only`, `truncate`, `opacity-50`, etc.

---

## Regulations & Jurisdictions

The stylesheet registry includes 20 regulations across 18 jurisdictions:

**EU/Multi-jurisdictional:**
- LCR, NSFR, ALMM

**Jurisdiction-Specific:**
- Colombia, Brazil, Mexico, Peru, Panama (Latin America)
- UK, US, Canada, Switzerland (Western)
- Japan, Singapore, Hong Kong, Australia (Asia-Pacific)
- Indonesia, Malaysia, Vietnam, Thailand (Southeast Asia)

Each regulation has a colour token: `--color-lcr`, `--color-nsfr`, etc.

---

## Adding a New Component

To add a new visual component to the design system:

1. **Define tokens** (if new colours needed) in `§2` of the extended stylesheet
2. **Write the component class** in the appropriate section (`§8` for cards, `§9` for buttons, etc.)
3. **Add regulation variants** if the component should be regulation-aware (e.g., `.card--lcr`)
4. **Test in `web/public/gallery`** — all components should appear there
5. **Document** in this README

**Example:**

```css
/* §8 Cards */
.card--new-type {
  border: 1px solid var(--divider);
  border-radius: 4px;
  padding: var(--space-4);
  background: var(--surface);
}

.card--new-type.card--lcr {
  border-color: var(--color-lcr);
}

[data-theme="dark"] .card--new-type.card--lcr {
  border-color: var(--color-lcr-dark);
}
```

---

## Responsive Design

Three breakpoints are defined via CSS custom properties:

| Breakpoint | Width | Use |
|-----------|-------|-----|
| Mobile | 0–640px | Single column, sidebar collapses |
| Tablet | 640–1200px | 2-column layout, narrow sidebar |
| Desktop | 1200px+ | Multi-panel, full features |

**Usage:**

```css
.my-component {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .my-component {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1200px) {
  .my-component {
    grid-template-columns: 1fr 2fr 1fr;
  }
}
```

---

## Theme Switching

Switching themes is as simple as changing the `data-theme` attribute:

```tsx
// Light mode (default)
<html data-theme="light">

// Dark mode
<html data-theme="dark">

// Regulation-scoped (e.g., always show LCR colours)
<html data-theme="regulation-lcr">
```

All CSS variables automatically update. No JavaScript needed (except to persist the choice).

---

## Accessibility

The design system includes:

- ✅ **Sufficient contrast** — WCAG AAA in most cases
- ✅ **Focus rings** — Visible on all interactive elements
- ✅ **Semantic HTML** — Buttons, links, forms use correct tags
- ✅ **Motion respect** — `prefers-reduced-motion` is respected
- ✅ **Disabled states** — Clearly distinguished
- ✅ **Error handling** — Red text + icon for form errors

---

## Browser Support

Modern evergreen browsers (2023+):

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

Uses CSS features like `color-mix()` and CSS custom properties. No IE support.

---

## Development Workflow

### Modify a Component

1. Edit `web/src/styles/ObligaI_Extended_Stylesheet.css`
2. Find the appropriate section (`§9` for buttons, etc.)
3. Update the CSS
4. Hot reload will refresh the app
5. Test in `web/public/gallery`

### Add a New Regulation

1. Add colour tokens to `§2` of the stylesheet:
   ```css
   :root {
     --color-my-reg: #1A2B3C;
     --color-my-reg-light: rgba(...);
     --color-my-reg-dark: #4D6B85;
   }
   ```

2. Add component modifiers:
   ```css
   .badge--my-reg { --reg-color: var(--color-my-reg); }
   .chart-bar--my-reg { fill: var(--color-my-reg); }
   /* ... for all components */
   ```

3. Update `src/data/registry.ts` in the web app

4. Test in gallery

---

## Conventions

### Naming

- **Classes:** kebab-case (`.btn`, `.card--elevated`)
- **Custom properties:** kebab-case (`.--color-primary`, `--space-4`)
- **Modifiers:** Double dash (`.btn--primary`, `.card--flat`)
- **Sizes:** Predefined scale (sm, md, lg)

### Colours

- **Never hardcode hex values** — use CSS custom properties
- **Sienna is mode-invariant** — it's the only hex literal allowed in components
- **All other colours** — use `var(--color-name)`

### Spacing

- **Always use the 8px scale** — no arbitrary pixel values
- **Use variables** — `var(--space-1)` through `var(--space-6)`

### Typography

- **Use the type scale** — `t-small`, `t-body`, `t-heading`, `t-display`
- **Never set arbitrary font sizes** — consistency matters

---

## Resources

- **Live Reference:** Open `design/Stylesheet Reference.html` in your browser for interactive component preview
- **Full Spec:** See `design/DESIGN_SYSTEM.md` for detailed token definitions
- **Section Guide:** See `design/STRUCTURE.md` for stylesheet organization
- **Web App:** `web/src/styles/` contains the actual stylesheet files

---

## Support

For design system questions:
- Check `DESIGN_SYSTEM.md` for token definitions
- Browse `Stylesheet Reference.html` for component examples
- Review the web app's `/gallery` route for all components in context
- See `web/README.md` for integration patterns

For implementation questions, see `CLAUDE.md` in the root directory.
