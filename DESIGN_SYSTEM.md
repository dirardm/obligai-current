---

# ObligaI — Complete Design System Brief

## WHAT THIS IS

A complete branding and design system for ObligaI, a regulatory intelligence platform for multi-jurisdiction banks in Latin America. The system has been designed and delivered. This document is the authoritative implementation brief for Claude Code, React development, and all presentation work. Every decision here reflects the delivered design files — nothing should be invented or assumed.

---

## THE PRODUCT

ObligaI takes unstructured regulatory text from multiple jurisdictions and turns it into a structured, queryable obligation register. It tells compliance teams not just what to comply with but how. Used by Chief Compliance Officers, regulatory analysts, and compliance teams at banks operating across multiple jurisdictions in Latin America, with initial focus on Colombia and Panama, and European regulatory frameworks (CRR II, AMLR, LCR).

**Tone:** Precise. Authoritative. Calm. Honest. Not flashy. Not playful.

---

## CRITICAL BRAND RULES — READ FIRST

These five rules are non-negotiable. They override everything else.

1. **Wordmark is `Obliga` + italic `I` in sienna.** Never `OBLIGAI`. Never non-italic I. Never all-caps. The italic I in Georgia Italic sienna `#B85C3A` is a fixed part of the mark.

2. **Mark is the Knowledge Graph Node. Three satellite nodes connected to one filled centre. Use the canonical SVG. Never redraw.**

3. **2px radius everywhere except buttons.** Buttons are fully rectangular — 0px border radius. No exceptions.

4. **Sienna `#B85C3A` is the ONLY color that does not change between light and dark mode.** Every other color has an explicit light value and dark value. Sienna is the same in both.

5. **No bullet points in presentations.** Prose and structured layouts only.

---

## DESIGN FILES DELIVERED

The designer has delivered the following files. Reference them directly — do not reinvent:

- `colors_and_type.css` — complete token system, light and dark mode via `[data-theme]` selector
- `assets/` — logo SVGs: mark, horizontal lockup, stacked lockup, wordmark only, favicon — all in both light and dark mode variants
- `preview/` — one HTML card per token, component, and pattern — rendered for visual review
- `ui_kits/app/` — product surfaces: dashboard, obligation register, obligation detail, conflict detection, regulatory sources, settings
- `ui_kits/brand_site/` — marketing landing page
- `ui_kits/presentation/` — slide system: cover, content, stat callout, two-column, code block, dark variant
- `SKILL.md` — invocation manifest

**Implementation rule:** Always read `colors_and_type.css` first. All token values come from that file. Never hardcode hex values — always reference CSS custom properties.

---
## LOGO

**The mark:** Knowledge Graph Node —
one central obligation connected to
three regulatory sources in an
equilateral arrangement.

**Mark geometry:**
- Centre node: filled circle,
  sienna `#B85C3A`, radius 10
- Three satellite nodes: stroke-only
  circles, sienna `#B85C3A`, radius 6,
  stroke-width 3
- Three connecting lines:
  stroke-width 3, stroke-linecap round
- Satellites at 270°, 30°, 150°
  from centre at distance 27

**Canonical SVG:**

```svg
<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 160 124">
  <line x1="80" y1="46" x2="80" y2="34"
    stroke="#B85C3A" stroke-width="3"
    stroke-linecap="round"/>
  <line x1="89" y1="61" x2="99" y2="67"
    stroke="#B85C3A" stroke-width="3"
    stroke-linecap="round"/>
  <line x1="71" y1="61" x2="61" y2="67"
    stroke="#B85C3A" stroke-width="3"
    stroke-linecap="round"/>
  <circle cx="80" cy="56" r="10"
    fill="#B85C3A"/>
  <circle cx="80" cy="28" r="6"
    fill="none" stroke="#B85C3A"
    stroke-width="3"/>
  <circle cx="104" cy="70" r="6"
    fill="none" stroke="#B85C3A"
    stroke-width="3"/>
  <circle cx="56" cy="70" r="6"
    fill="none" stroke="#B85C3A"
    stroke-width="3"/>
</svg>
```

**Scale requirement:** Reads correctly
at 16px favicon and 200px hero.
Never redraw from memory.
Use the canonical SVG above.

**Wordmark:** "Obliga" in Inter 500 —
immediately followed by italic "I"
in Georgia Italic `#B85C3A`.
Kerning: `dx="-0.04em"` on the I.
One word.

**Light mode wordmark:** `#0F0F0F`
**Dark mode wordmark:** `#F8F8F8`
**Italic I both modes:** `#B85C3A`

**We always use the stacked lockup.**

**Logo variants — all in `assets/`:**

| File | Use |
|---|---|
| `logo_vertical.svg` | Primary — above 48px |
| `logo_vertical_compact.svg` | 24–48px |
| `logo_vertical_fallback.svg` | Below 24px |
| `logo_icon.svg` | Favicon · app icon · square |

---

## COLOR SYSTEM

**Source of truth:** `colors_and_type.css`

All colors are defined as CSS custom properties. Always use the variable, never the raw hex. The `[data-theme="light"]` and `[data-theme="dark"]` selectors in `colors_and_type.css` define every token. Read that file before writing any color value.

**Sienna ramp:**

| Stop | Hex |
|---|---|
| Sienna 100 | `#F0D4C8` |
| Sienna 200 | `#E8C4B0` |
| Sienna 300 | `#D48870` |
| Sienna 400 | `#C67255` |
| Sienna 500 | `#B85C3A` — primary, mode-invariant |
| Sienna 600 | `#AC5234` |
| Sienna 700 | `#9A4830` |
| Sienna 900 | `#7A3520` |

**Semantic tokens — light → dark:**

| Token | Light | Dark |
|---|---|---|
| `--page-bg` | `#FAF7F4` | `#080808` |
| `--surface` | `#FFFFFF` | `#111111` |
| `--surface-high` | `#F5F0EB` | `#161616` |
| `--surface-overlay` | `#EDE8E2` | `#1E1E1E` |
| `--surface-input` | `#FFFFFF` | `#161616` |
| `--accent` | `#B85C3A` | `#B85C3A` |
| `--accent-hover` | `#AC5234` | `#AC5234` |
| `--accent-active` | `#9A4830` | `#9A4830` |
| `--accent-faint` | `rgba(184,92,58,0.08)` | `rgba(184,92,58,0.12)` |
| `--accent-border` | `rgba(184,92,58,0.28)` | `rgba(184,92,58,0.35)` |
| `--text-primary` | `#0F0F0F` | `#F8F8F8` |
| `--text-secondary` | `#5A5248` | `#C8C0B8` |
| `--text-muted` | `#8A7E75` | `#8A7E75` |
| `--text-disabled` | `rgba(15,15,15,0.30)` | `rgba(248,248,248,0.28)` |
| `--text-inverse` | `#F8F8F8` | `#0F0F0F` |
| `--border` | `rgba(184,92,58,0.12)` | `rgba(248,248,248,0.08)` |
| `--border-hover` | `rgba(184,92,58,0.28)` | `rgba(248,248,248,0.24)` |
| `--border-focus` | `#B85C3A` | `#B85C3A` |
| `--border-error` | `#C83030` | `#E05050` |
| `--divider` | `rgba(184,92,58,0.10)` | `rgba(248,248,248,0.08)` |
| `--scrollbar-thumb` | `rgba(184,92,58,0.20)` | `rgba(248,248,248,0.12)` |
| `--focus-ring` | `#B85C3A` | `#B85C3A` |
| `--overlay-scrim` | `rgba(15,15,15,0.50)` | `rgba(0,0,0,0.70)` |

**Status colors — light → dark:**

| Status | Light | Dark |
|---|---|---|
| Active | `#3B6D11` | `#5A9E2F` |
| Conflicted | `#C83030` | `#E05050` |
| Implementing | `#185FA5` | `#4A8FD4` |
| Pending | `#C9A84C` | `#D4B86A` |
| Inactive | `#8A7E75` | `#6A6460` |

**Status background tints — light → dark:**

| Status | Light bg | Dark bg |
|---|---|---|
| Active | `rgba(59,109,17,0.08)` | `rgba(59,109,17,0.14)` |
| Conflicted | `rgba(200,48,48,0.08)` | `rgba(200,48,48,0.14)` |
| Implementing | `rgba(24,95,165,0.08)` | `rgba(24,95,165,0.14)` |
| Pending | `rgba(201,168,76,0.10)` | `rgba(201,168,76,0.14)` |

**Absolute prohibitions:** No teal. No mustard. No stone as a primary UI color. No amber outside `status-pending`. No gradients anywhere. No colors outside the defined palette.

---

## TYPOGRAPHY

**Source of truth:** `colors_and_type.css`

| Role | Typeface | Weights |
|---|---|---|
| All UI, headings, body | Inter | 400 · 500 · 700 |
| Wordmark accent only | Georgia | Italic — nowhere else in the system |
| Code · IDs · regulatory references | JetBrains Mono | 400 |

**Loading in HTML:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet"/>
```

**Loading in React/TypeScript:**
```typescript
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
```

**Type scale:**

| Level | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|
| Display | 48px | Bold | 1.15 | -0.5px |
| H1 | 34px | Bold | 1.20 | -0.3px |
| H2 | 24px | Bold | 1.30 | 0 |
| H3 | 18px | Bold | 1.40 | 0 |
| H4 | 15px | Bold | 1.40 | 0 |
| Body | 14px | Regular | 1.60 | 0 |
| Small | 12px | Regular | 1.50 | 0 |
| Caption | 11px | Regular | 1.40 | 0 |
| Label | 10px | Bold | 1.00 | 2.5px uppercase |
| Mono | 13px | Regular | 1.50 | 0 |

---

## SPACING AND LAYOUT

Base unit: 8px. All spacing is a multiple of 4px minimum.

**Scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px

**Border radius:** 2px everywhere — no exceptions except buttons which are 0px (fully rectangular).

**Layout:**
- Content max-width: 1200px
- Sidebar fixed width: 240px
- Page horizontal padding: 48px
- Section gap: 48px
- Card padding: 24px
- Minimum touch target: 40px height × 40px width

---

## COMPONENTS

Every component must implement all states in both light mode and dark mode. All color values reference CSS custom properties from `colors_and_type.css` — never hardcoded hex.

Reference `preview/` for rendered visual examples of every component before implementing.

---

### BUTTONS

**The button resting state is an outline only — transparent fill, sienna border, sienna text. You see the surface beneath. On hover the button fills solid sienna, lifts 1px, and a sienna glow appears.**

All buttons: 0px border radius (fully rectangular). Inter Bold 12px uppercase. Letter-spacing 1.5px. Padding 10px 20px. Minimum height 40px. No box shadow at rest.

**Primary button:**
- Rest: transparent bg · 1px `var(--accent)` border · `var(--accent)` text
- Hover: `var(--accent)` bg · `var(--text-inverse)` text · `translateY(-1px)` · box-shadow `0 4px 12px rgba(184,92,58,0.35)`
- Active: `var(--accent-active)` bg · `translateY(0)` · shadow removed
- Focus: 2px `var(--focus-ring)` outline · 2px offset
- Disabled light: `rgba(184,92,58,0.20)` border · `rgba(184,92,58,0.35)` text
- Disabled dark: `rgba(184,92,58,0.16)` border · `rgba(184,92,58,0.28)` text

**Secondary button:**
- Rest light: transparent bg · 1px `var(--border-hover)` border · `var(--text-secondary)` text
- Rest dark: transparent bg · 1px `rgba(248,248,248,0.20)` border · `var(--text-secondary)` text
- Hover: same as primary hover — fills sienna, lifts, glows
- Focus, active, disabled: same pattern as primary

**Ghost button:**
- Rest: transparent bg · no border · `var(--accent)` text
- Hover: 1px `var(--accent)` border appears · fills sienna · lifts 1px · sienna glow
- Focus: 2px `var(--focus-ring)` outline · 2px offset

**Destructive button:**
- Rest light: transparent bg · 1px `#C83030` border · `#C83030` text
- Rest dark: transparent bg · 1px `#E05050` border · `#E05050` text
- Hover: fills `#C83030` light / `#E05050` dark · lifts 1px · red glow

**Icon button:** 40×40px · square · same hover behavior · no label

**Transition:** all 150ms ease-out

---

### CARDS

**The card resting state is translucent — 45% opacity surface color with 2px backdrop blur. On hover the card becomes fully solid, lifts 2px, and a sienna glow appears. Designed for grid layouts where the lift reads as the card being plucked off the surface.**

Border radius: 2px. No drop shadow at rest.

**Default:**
- Light: `rgba(255,255,255,0.45)` bg · `backdrop-filter: blur(2px)` · 1px `var(--border)` border
- Dark: `rgba(17,17,17,0.45)` bg · `backdrop-filter: blur(2px)` · 1px `var(--border)` border

**Hover:**
- Light: `#FFFFFF` bg (fully solid) · 1px `var(--border-hover)` border · `translateY(-2px)` · box-shadow `0 8px 24px rgba(184,92,58,0.18)`
- Dark: `#111111` bg (fully solid) · 1px `var(--border-hover)` border · `translateY(-2px)` · box-shadow `0 8px 24px rgba(184,92,58,0.22)`

**Selected / active:**
- Light: `#FFFFFF` bg · 1.5px `var(--accent)` border · `translateY(-2px)` · sienna glow
- Dark: `#111111` bg · 1.5px `var(--accent)` border · `translateY(-2px)` · sienna glow

**Disabled:**
- Light: `rgba(245,240,235,0.45)` bg · 1px `rgba(184,92,58,0.08)` border · muted content · no hover
- Dark: `rgba(10,10,10,0.45)` bg · 1px `rgba(248,248,248,0.05)` border · muted content · no hover

**Transition:** all 200ms ease-out

Card anatomy: 24px padding · Inter Bold 14px title · Inter Regular 12px body · 1px divider between sections.

---

### INPUTS AND FORM FIELDS

Height 40px. Border radius 2px. Inter Regular 14px. Padding 0 14px.

**Text input:**
- Default light: `#FFFFFF` bg · 1px `var(--border-hover)` border · `var(--text-primary)` text · `var(--text-muted)` placeholder
- Default dark: `#161616` bg · 1px `rgba(248,248,248,0.12)` border · `var(--text-primary)` text · `var(--text-muted)` placeholder
- Hover light: 1px `rgba(184,92,58,0.45)` border
- Hover dark: 1px `rgba(248,248,248,0.20)` border
- Focus: 1.5px `var(--focus-ring)` border · both modes identical
- Error: 1.5px `var(--border-error)` border · both modes use mode-appropriate error color
- Disabled light: `#F5F0EB` bg · muted border · muted text
- Disabled dark: `#0F0F0F` bg · muted border · muted text

**Label:** Inter Bold 11px uppercase letter-spacing 2px. Always above — never inside. Light: `var(--text-secondary)`. Dark: `var(--text-secondary)`.

**Helper text:** Inter Regular 11px. Default: `var(--text-muted)`. Error: `var(--border-error)`.

**Textarea:** Same as text input. Min height 120px. Resize vertical only.

**Select:** Same as text input. Chevron icon right-aligned in `var(--text-muted)`.

**Search input:** Same as text input. Search icon left in `var(--text-muted)`. Clear button appears when value present.

**Checkbox:**
- Unchecked: `var(--surface-input)` bg · 1px border · 2px radius
- Checked: `var(--accent)` bg · `#FFFFFF` checkmark · both modes
- Indeterminate: `var(--accent)` bg · `#FFFFFF` dash
- Focus: 2px `var(--focus-ring)` outline · 2px offset

**Radio:** Same color logic as checkbox. Circle indicator.

**Toggle:**
- Off light: `rgba(184,92,58,0.20)` track · `#FFFFFF` thumb
- Off dark: `rgba(248,248,248,0.16)` track · `#8A7E75` thumb
- On both modes: `var(--accent)` track · `#FFFFFF` thumb

---

### NAVIGATION SIDEBAR

Width 240px. No animation.

**Container:**
- Light: `#FFFFFF` bg · 1px right border `var(--border)`
- Dark: `#111111` bg · 1px right border `var(--border)`

**Logo area:** 64px height · 24px padding · mark + wordmark

**Section label:** Inter Bold 10px uppercase letter-spacing 3px · `var(--text-muted)` · 16px left padding · 24px top margin

**Nav item:** 40px height · 16px left padding · Inter Regular 13px · 2px left border transparent at rest

**Default:**
- Light: transparent bg · `var(--text-secondary)` text
- Dark: transparent bg · `var(--text-secondary)` text

**Hover:**
- Light: `var(--accent-faint)` bg · `var(--accent)` text · 2px left border `var(--accent-border)`
- Dark: `rgba(248,248,248,0.04)` bg · `var(--text-primary)` text · 2px left border `rgba(248,248,248,0.16)`

**Active:**
- Light: transparent bg · `var(--accent)` text · 2px left border `var(--accent)`
- Dark: transparent bg · `var(--text-primary)` text · 2px left border `var(--text-primary)`
- No background on active in either mode.

---

### TOP NAVIGATION BAR

Height 56px. Border bottom 1px `var(--divider)`.

- Light: `#FFFFFF` bg
- Dark: `#111111` bg

Contents: logo left · search center · user avatar + dark/light mode toggle right.

---

### DATA TABLES

No zebra striping. No drop shadow. 2px radius on container.

**Container:**
- Light: `#FFFFFF` bg · 1px `var(--border)` border
- Dark: `#111111` bg · 1px `var(--border)` border

**Header row:**
- Light: `#FAF7F4` bg · Inter Bold 11px uppercase letter-spacing 2px · `var(--text-muted)` · 1px bottom divider
- Dark: `#0F0F0F` bg · same type · `var(--text-muted)` · 1px bottom divider

**Body row default:**
- Light: `#FFFFFF` bg · 1px bottom `rgba(184,92,58,0.08)` · Inter Regular 13px
- Dark: `#111111` bg · 1px bottom `rgba(248,248,248,0.06)` · Inter Regular 13px

**Body row hover:**
- Light: `rgba(184,92,58,0.04)` bg
- Dark: `rgba(248,248,248,0.03)` bg

**Body row selected:**
- Light: `rgba(184,92,58,0.08)` bg · 2px left border `var(--accent)`
- Dark: `rgba(184,92,58,0.12)` bg · 2px left border `var(--accent)`

Cell padding: 12px 16px.

---

### STATUS BADGES

6px dot + Inter Bold 11px uppercase label. No background at minimum — pill with tint bg also available. Padding 0 for dot-only, 4px 10px for pill.

| Status | Light | Dark |
|---|---|---|
| Active | `#3B6D11` | `#5A9E2F` |
| Conflicted | `#C83030` | `#E05050` |
| Implementing | `#185FA5` | `#4A8FD4` |
| Pending | `#C9A84C` | `#D4B86A` |
| Inactive | `#8A7E75` | `#6A6460` |

---

### TAGS AND CHIPS

Border radius 2px. Inter Bold 10px uppercase letter-spacing 1.5px. Padding 4px 10px. Height 22px.

**Jurisdiction tag:**
- Light: `#F0D4C8` bg · `#9A4830` text
- Dark: `rgba(184,92,58,0.18)` bg · `#D48870` text

**Framework tag:**
- Light: `rgba(184,92,58,0.08)` bg · `var(--accent)` text · 1px `var(--accent-border)` border
- Dark: `rgba(184,92,58,0.12)` bg · `#D48870` text · 1px `rgba(184,92,58,0.35)` border

**Domain tag:**
- Light: `rgba(24,95,165,0.08)` bg · `#185FA5` text
- Dark: `rgba(24,95,165,0.14)` bg · `#4A8FD4` text

---

### ALERT BANNERS

Border radius 2px. 3px left border. Padding 14px 16px. Inter Regular 13px.

| Type | Light bg | Light text | Light border | Dark bg | Dark text | Dark border |
|---|---|---|---|---|---|---|
| Info | `rgba(184,92,58,0.08)` | `#9A4830` | `#B85C3A` | `rgba(184,92,58,0.14)` | `#D48870` | `#B85C3A` |
| Warning | `rgba(201,168,76,0.12)` | `#8A6A10` | `#C9A84C` | `rgba(201,168,76,0.14)` | `#D4B86A` | `#C9A84C` |
| Error | `rgba(200,48,48,0.08)` | `#8A2020` | `#C83030` | `rgba(200,48,48,0.12)` | `#E05050` | `#C83030` |
| Success | `rgba(59,109,17,0.08)` | `#2A5008` | `#3B6D11` | `rgba(59,109,17,0.12)` | `#5A9E2F` | `#3B6D11` |

---

### MODALS AND DIALOGS

**Scrim:**
- Light: `rgba(15,15,15,0.50)`
- Dark: `rgba(0,0,0,0.70)`

**Container:**
- Light: `#FFFFFF` bg · 1px `var(--border)` border · 2px radius · 32px padding
- Dark: `#111111` bg · 1px `var(--border)` border · 2px radius · 32px padding

Max width 560px. Centered. Closes on scrim click and Escape.

---

### TOOLTIPS

Max width 240px. 2px radius. Padding 8px 12px. Inter Regular 12px.
- Light: `#0F0F0F` bg · `#F8F8F8` text
- Dark: `#F8F8F8` bg · `#0F0F0F` text

Delay: 400ms appear · immediate disappear.

---

### DROPDOWN MENUS

2px radius. No drop shadow. Padding 4px 0. Min width 160px.

- Container light: `#FFFFFF` bg · 1px `rgba(184,92,58,0.18)` border
- Container dark: `#161616` bg · 1px `rgba(248,248,248,0.12)` border

Item 36px height · 12px 16px padding · Inter Regular 13px.
- Default: transparent bg · `var(--text-primary)`
- Hover light: `var(--accent-faint)` bg · `var(--accent)` text
- Hover dark: `rgba(248,248,248,0.06)` bg · `var(--text-primary)` text
- Selected: tint bg · `var(--accent)` text · Inter Bold

---

### TABS

Height 40px. Inter Bold 13px. 0px radius. 2px bottom border as indicator.

- Default: `var(--text-muted)` · transparent indicator
- Hover light: `var(--text-secondary)` · `var(--accent-border)` indicator
- Hover dark: `var(--text-secondary)` · `rgba(248,248,248,0.16)` indicator
- Active light: `var(--accent)` · `var(--accent)` indicator
- Active dark: `var(--text-primary)` · `var(--text-primary)` indicator

Container border bottom: 1px `var(--divider)`.

---

### BREADCRUMBS

Inter Regular 13px. Separator "/" in `var(--text-muted)`.
- Default: `var(--text-secondary)`
- Current: `var(--text-primary)` · not a link
- Link hover: `var(--accent)` · both modes

---

### PROGRESS AND LOADING

**Progress bar:**
- Track light: `rgba(184,92,58,0.12)` · dark: `rgba(248,248,248,0.08)`
- Fill both modes: `var(--accent)`
- Height 4px · 2px radius

**Spinner:** 20px default · 40px large · `var(--accent)` · 1.5px stroke · 270° arc · 700ms linear infinite

**Skeleton:**
- Light: `rgba(184,92,58,0.08)` base · `rgba(184,92,58,0.14)` shimmer
- Dark: `rgba(248,248,248,0.06)` base · `rgba(248,248,248,0.10)` shimmer

---

### CODE BLOCKS

JetBrains Mono 13px. 2px radius. Padding 16px.
- Light: `#F5F0EB` bg · `#0F0F0F` text · 1px `rgba(184,92,58,0.15)` border
- Dark: `#0F0F0F` bg · `#F8F8F8` text · 1px `rgba(248,248,248,0.08)` border

Inline code: same bg · 4px 6px padding.

---

### SCROLLBARS

Width 4px. Rounded. Transparent track.
- Light: `rgba(184,92,58,0.20)` thumb · hover `rgba(184,92,58,0.38)`
- Dark: `rgba(248,248,248,0.12)` thumb · hover `rgba(248,248,248,0.24)`

---

### DIVIDERS

1px horizontal rule.
- Light: `rgba(184,92,58,0.10)`
- Dark: `rgba(248,248,248,0.08)`

---

### FOCUS RINGS

All interactive elements: 2px solid `var(--focus-ring)` · 2px offset · `#B85C3A` both modes. Never remove.

---

### PAGINATION

Inter Regular 12px. 0px radius on page number buttons.
- Default: `var(--text-secondary)`
- Hover: `var(--accent)` both modes
- Active: `var(--accent)` · Inter Bold · 2px bottom border `var(--accent)`

---

### EMPTY STATES

Centered. Icon 48px `var(--text-muted)`. Inter Bold 16px title. Inter Regular 13px body muted. Primary button below.
- Background follows page background per mode.

---

## ICONOGRAPHY

**Style:** Outline only. 1.5px stroke. Rounded linecaps and linejoins. No fill. Pixel-aligned. 16×16 and 24×24 grid. 2px padding inside.

**Color by context:**

| Context | Light | Dark |
|---|---|---|
| Default UI | `var(--text-secondary)` | `var(--text-secondary)` |
| Muted | `var(--text-muted)` | `var(--text-muted)` |
| Active / accent | `var(--accent)` | `var(--accent)` |
| Error | `#C83030` | `#E05050` |
| Success | `#3B6D11` | `#5A9E2F` |

**Required icons for ObligaI:** regulation · obligation · conflict · jurisdiction · control · audit-trail · monitor · search · filter · export · upload · user · settings · chevron-up · chevron-down · chevron-left · chevron-right · close · check · alert · info · calendar · lock · link · copy · external-link · sun (light mode) · moon (dark mode)

---

## PRODUCT SCREENS

Reference `ui_kits/app/` for all rendered screen designs. Implement in light and dark mode.

**Screen 1 — Dashboard**
- Sidebar 240px left · top bar 56px
- Four stat cards: total obligations · conflicted · implementing · pending
- Recent regulatory changes table
- Jurisdiction filter tabs

**Screen 2 — Obligation Register**
- Full-width table: ID · jurisdiction · framework · obligation summary · status · deadline · assigned
- Row expansion for full detail
- Filter sidebar: jurisdiction · domain · status · framework

**Screen 3 — Obligation Detail**
- Left: what · how · deadline · responsible
- Right: linked controls · conflict indicators · audit trail
- Status badge prominent · edit / assign / implementing buttons

**Screen 4 — Conflict Detection**
- Graph view: obligation nodes · conflict edges
- Conflict panel right: type · involved obligations · detected · resolution status
- Filter: unresolved · by jurisdiction · by domain

**Screen 5 — Regulatory Sources**
- Table: source name · last fetched · documents · scraper health
- Manual refresh per source

**Screen 6 — Settings**
- Jurisdictions · entity types · GRC connections · user roles · mode toggle

---

## PRESENTATION SYSTEM

Reference `ui_kits/presentation/` for all rendered slide designs.

All presentations default to light mode `#FAF7F4` background unless dark variant explicitly requested.

**Cover slide:**
- Logo mark top-left · wordmark beside · tagline below
- Title: Inter Bold 34px left-aligned · `var(--text-primary)`
- Subtitle: Georgia Italic · `var(--accent)`
- Date and document type bottom-left · `var(--text-muted)`

**Content slides:**
- Logo mark top-left 32px height
- Section tag above title: Inter Bold 10px uppercase letter-spacing 4px · `var(--accent)`
- Title: Inter Bold 24px · `var(--text-primary)`
- Body: Inter Regular 13px · `var(--text-secondary)` · line-height 1.6
- No bullet points — prose and structured layouts only
- Footer: ObligaI wordmark · document type · Confidential · Month Year · 1px sienna rule above

**Stat callout:**
- Number: Inter Bold 48px · `var(--accent)`
- Label: Inter Bold 10px uppercase · `var(--text-muted)`

**Two-column:** text left · table or data right

**Code block:** JetBrains Mono 11px · `#F5F0EB` bg light / `#0F0F0F` dark · 1px sienna border

**Dark variant:**
- Background `#080808` · title `#F8F8F8` · body `#C8C0B8` · accent `#B85C3A` · logo sienna mark · white wordmark

**Six standard decks:** Business Case · Problem Statement · Functional Walkthrough · Technical Architecture · Q&A · Engineering Roadmap

---

## MARKETING SITE

Reference `ui_kits/brand_site/` for rendered design. Light mode primary. Dark mode toggle available.

Hero: full-width · node mark large · Display 48px headline · body 16px · primary button CTA.
Navigation: Inter Bold 13px · ghost nav links · primary button right.
Sections follow card and layout system.

---

## MOTION AND TRANSITIONS

- Micro-interactions (hover, focus, toggle): 150ms ease-out
- Card lift: 200ms ease-out
- Panel open/close: 250ms ease-out
- Page transitions: 400ms ease-out
- Spinners: linear infinite
- No animation on data tables, status changes, obligation updates — instantaneous

---

## DEVELOPER DELIVERABLES

**Implementation order for Claude Code:**

1. Read `colors_and_type.css` — do not recreate tokens, import the file directly
2. Read `SKILL.md` — follow the invocation manifest
3. Set up ThemeProvider with `[data-theme]` switching, localStorage persistence, `prefers-color-scheme` on first load
4. Implement components in this order: Button · Input · Card · Badge · Tag · Alert · Sidebar · TopBar · Table · Modal · Tooltip · Dropdown · Tabs · CodeBlock · Spinner · Skeleton · EmptyState

**Never hardcode hex values.** Every color references a CSS custom property.

**Component folder structure:**
```
/components
  /ui
    Button.tsx
    Input.tsx
    Textarea.tsx
    Select.tsx
    Checkbox.tsx
    Radio.tsx
    Toggle.tsx
    Card.tsx
    Badge.tsx
    Tag.tsx
    Alert.tsx
    Modal.tsx
    Tooltip.tsx
    Dropdown.tsx
    Table.tsx
    Tabs.tsx
    Sidebar.tsx
    TopBar.tsx
    Breadcrumbs.tsx
    Pagination.tsx
    Progress.tsx
    Spinner.tsx
    Skeleton.tsx
    CodeBlock.tsx
    Divider.tsx
    EmptyState.tsx
    Icon.tsx
  /layout
    PageLayout.tsx
    SidebarLayout.tsx
  /product
    ObligationRow.tsx
    ObligationDetail.tsx
    ConflictBadge.tsx
    JurisdictionTag.tsx
    StatusBadge.tsx
    StatCard.tsx
    SourceRow.tsx
/theme
  ThemeProvider.tsx
  tokens.ts
```

**Tailwind config:** extend with all semantic tokens from `colors_and_type.css`. Use CSS variable references in Tailwind so they switch automatically with `[data-theme]`.

---

## ABSOLUTE PROHIBITIONS

No teal. No mustard. No amber outside `status-pending`. No stone as primary UI color. No gradients. No drop shadows at rest on any component. No rounded pill buttons. No border radius above 2px. No border radius on buttons at all. No playful illustrations. No stock photography. No generic icon packs. No hardcoded hex values in components. No bullet points in presentations. No decorative full-width bars or header ribbons. No colors outside the defined palette. No pretension.

---

## TONE AND VOICE

Precise. No filler. No exclamation marks. No "innovative," "cutting-edge," "revolutionary." Sentences are short. Claims are specific. Numbers are real and sourced. Uncertainty is named honestly. The product is a prototype. The market is real. The problem is genuine. Say all three plainly.

---

That is the complete implementation brief. Every detail reflects the designer's README and delivered files. A developer working from this document and the delivered files should be able to implement the entire ObligaI system — product, presentations, marketing site — without a single clarifying question.

---

## AMENDMENTS — v1.1 (May 2026)

The sections below capture deltas since the original brief above. They do not replace the canonical content above — they extend it. Anything not addressed here remains as written.

### Registry — 20 regulations, 18 country jurisdictions

The platform now models 20 regulations across 18 country-level jurisdictions. Each regulation provides three tokens in the registry — `--color-{reg}`, `--color-{reg}-light`, `--color-{reg}-dark` — and per-country aliases under `--color-juris-{cc}` let any chip, label or chart inherit a national colour without coupling to a regulation. EU is treated as a single jurisdiction containing LCR, NSFR and ALMM; every other country contributes one regulation.

The 20 regulations: LCR, NSFR, ALMM (EU); IRL (Internal); Peru SBS, Panama SBP, Mexico CNBV, Brazil BCB (LatAm); UK PRA Fundamental Rules; US Federal Reserve; Canada OSFI; Switzerland FINMA; Japan BSR; Singapore MAS; Hong Kong HKMA; Australia APRA; Indonesia OJK; Malaysia BNM; Vietnam SBV; Thailand BOT.

Adding a 21st regulation is a five-block append in `ObligaI_Extended_Stylesheet.css` (registry + `t-`, `badge--`, `regulation-card--`, `chart-bar--`, `graph-node--`, `scope-pill--`, theme override). The README has the recipe.

### Combined scoping control

Selecting which regulations a screen is scoped to uses one component, not three. The top row carries jurisdiction chips (EU treated as one); the bottom row carries active regulation pills in their registry colours plus a `+ Add regulation` slot that opens a searchable popover filtered to the active jurisdiction. The bar reads jurisdiction state into `--juris-color` and `--juris-light`, so the active chip, the popover focus ring and the dashed Add trigger all reflect the jurisdiction without further configuration.

The control replaces three earlier patterns (pill strip, two-tier strip, free combobox) — all three are subsumed by this single layout.

### Iconography — shipped sprite

The required icon set named earlier in this brief is now delivered as `assets/icons.svg` — a single sprite with 28 symbols at `#icon-{name}`. Authored on a 24 × 24 grid, 1.5 px stroke, rounded caps and joins; the `.icon` wrapper class controls size and colour context.

### Flags — new addition

A simplified geometric flag sprite ships at `assets/flags.svg`, with a `#flag-{cc}` symbol for every country jurisdiction (and an Internal marker for the IRL pseudo-country). The flags are intentionally not photographic — they are recognisable identity markers sized to sit inline with chips and regulation labels. The `.flag` wrapper class provides `.flag--sm/md/lg/xl` sizing.

### Component additions

The component library has filled in the small but recurring surfaces that every screen needs:

* `.spinner` — 270° sienna arc, 700 ms linear infinite, three sizes.
* `.skeleton` — shimmer keyframes, text / title / block / circle / avatar variants.
* `.empty-state` — icon + title + body + action, centred.
* `.pagination` — page numbers with 2 px sienna underline indicator, ellipsis, summary text.
* `.sidebar`, `.topbar`, `.app-shell` — layout chrome with a 240 × 56 px shell.

All of these read from the existing token system. None introduce new colours or radii outside the sanctioned scale.

### Logo lockup — clarification

The vertical lockup ships as a single, indivisible SVG asset. The mark and wordmark are authored together inside one 160 × 124 viewBox; stylesheets never recompose them. The bottom satellite nodes sit over the visual centres of the leading `O` and the italic `I` of the wordmark, with the connector legs at a ≈ 111° opening at the centre node. Horizontal lockups, wordmark-only renderings and split-mark compositions are forbidden — legacy classes degrade silently to the canonical vertical form.

### File map

```
README.md
DESIGN_SYSTEM.md                       (this file)
colors_and_type.css                    canonical, never modified
ObligaI_Extended_Stylesheet.css        v1.1 deliverable
Stylesheet Reference.html              live visual reference
assets/
  logo_vertical.svg
  logo_vertical_transparent.svg
  icons.svg                            28-icon outline sprite
  flags.svg                            18-jurisdiction flag sprite
```

### `colors_and_type.css` — explicitly not modified

The canonical token file is unchanged from the designer's delivery. Every addition above lives in `ObligaI_Extended_Stylesheet.css`, layered above. If a future change requires altering a canonical token (a sienna stop, a status colour, a type-scale step), the designer should reissue `colors_and_type.css` rather than the developer patching it locally — that boundary is what lets the registry and component library evolve without dragging the foundations with them.
