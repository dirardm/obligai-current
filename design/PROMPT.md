Mission
Build ObligaI — the full regulatory intelligence web application — on top of the centralised stylesheets already delivered in this repository. ObligaI takes unstructured regulatory text from multiple jurisdictions and turns it into a structured, queryable obligation register for compliance teams at multi-jurisdiction banks. The stylesheets are the source of truth for everything visual; your job is to consume them and wire up a real product against them, not to reinvent the design.

This is a prototype. The market is real. The problem is genuine. Behave accordingly: ship something convincing, not something flashy.

Read these files first, in order — and read all of them
README.md — file map, conventions, the recipe for adding a regulation, React import order.
DESIGN_SYSTEM.md — the full implementation brief, including the v1.1 amendments at the end. The Product Screens and Components sections describe every surface you are about to build.
colors_and_type.css — canonical, never modify, never duplicate. All foundation tokens.
ObligaI_Extended_Stylesheet.css — the 27-section deliverable layered above. Read the table of contents at the top of the file, then read every section comment. The §22 scoping control is the centrepiece of the product.
Stylesheet Reference.html — every component rendered. This is your visual ground truth for components. Match it pixel-for-pixel.
assets/logo_vertical.svg, assets/logo_vertical_transparent.svg — single indivisible canonical asset.
assets/icons.svg — 28-symbol outline sprite.
assets/flags.svg — 18-jurisdiction flag sprite.
Hard rules — non-negotiable
Never modify colors_and_type.css. Canonical.
Never modify ObligaI_Extended_Stylesheet.css unless the task explicitly requires it. If you genuinely need a new component class, append it to the end inside a clearly commented "§28 Product additions" block, and tell me first.
Never hardcode hex values in React, in styled-components, or in inline styles. Every colour goes through a CSS variable. The only hex literals in the codebase live inside the registry of the extended stylesheet, which you are not editing.
Never write inline styles for colour, spacing, type, radius or shadow. Use the existing classes. Inline style={{}} is only acceptable for runtime-dynamic values like --value: ${pct}% on a completeness bar, or --juris-color / --reg-color overrides set by JavaScript.
2 px radius everywhere except buttons (0 px). Never override.
Sienna #B85C3A is mode-invariant. Do not theme it.
Logo is one SVG, inlined verbatim. Never recompose mark and wordmark in JSX.
British English in all comments, UI copy, prop names and tests.
No emoji, no gradients, no shadows at rest on resting components, no rounded pill buttons.
No new tokens, no new radii, no new colour ramps, no new fonts. If a screen needs something that isn't in the system, stop and ask.
Repo context (TELL CLAUDE CODE WHICH STACK BEFORE RUNNING THIS PROMPT)
Confirm and fill these in at the top of this prompt before you run it. Without them, Claude Code will guess and may scaffold the wrong project shape — which is how things get destroyed.

Framework:          ____ (e.g. Vite + React + TypeScript, or Next.js 14 App Router)
Routing:            ____ (e.g. React Router 6, or Next.js file-based)
State management:   ____ (e.g. Zustand, TanStack Query, plain React)
Styling approach:   plain CSS classes from the stylesheets — no Tailwind, no styled-components, no CSS-in-JS
Mock-data layer:    ____ (e.g. MSW for fetch interception, or a typed JSON module in /src/mocks)
Testing:            ____ (e.g. Vitest + React Testing Library, or Playwright for end-to-end)
Package manager:    ____ (npm | pnpm | yarn)
Node version:       ____ (e.g. 20.x)
CSS files live in src/styles/. SVG sprites live in public/assets/ and are referenced as /assets/icons.svg#icon-{name} and /assets/flags.svg#flag-{cc}.

Import order in your React entry file (non-negotiable)
// 1. Fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";

// 2. Canonical tokens — never touched
import "./styles/colors_and_type.css";

// 3. Extended stylesheet — the project deliverable
import "./styles/ObligaI_Extended_Stylesheet.css";
Mock data — the registry
Build a typed registry module at src/data/registry.ts containing exactly 20 regulations across 18 jurisdictions (EU is one jurisdiction with three regulations; Internal is one pseudo-jurisdiction with IRL; every other country has one regulation). The list and identifiers match §2 of the extended stylesheet — never invent new ids, never rename existing ones.

type RegulationId =
  | 'lcr' | 'nsfr' | 'almm'
  | 'irl'
  | 'uk-fra' | 'us-fed' | 'canada-osfi' | 'switzerland-finma'
  | 'peru' | 'panama' | 'mexico-cnbv' | 'brazil-bcb'
  | 'japan-bsr' | 'singapore-mas' | 'hongkong-hkma' | 'australia-apra'
  | 'indonesia-ojk' | 'malaysia-bnm' | 'vietnam-sbv' | 'thailand-bot';

type JurisdictionId =
  | 'eu' | 'uk' | 'us' | 'ca' | 'ch' | 'pe' | 'pa' | 'mx' | 'br'
  | 'jp' | 'sg' | 'hk' | 'au' | 'id' | 'my' | 'vn' | 'th'
  | 'internal';
Adding a 21st regulation is a stylesheet task, not a code task. Do not modify RegulationId ad-hoc. If a stakeholder asks for one, raise it as a registry update and follow the README recipe.

Mock obligations: generate 120–180 realistic obligations distributed across the 20 regulations, with the fields below. Use realistic regulatory citation language; do not invent silly content.

type Obligation = {
  id: string;                    // e.g. 'OBLIG-LCR-0412'
  regulationId: RegulationId;
  jurisdictionId: JurisdictionId;
  framework: string;             // e.g. 'CRR II', 'Basel III', 'Resolución SBS N° 9075'
  citation: string;              // e.g. 'Article 412 CRR II'
  summary: string;               // 14-pt body, two to three sentences in plain English
  status: 'active' | 'conflicted' | 'implementing' | 'pending' | 'inactive';
  completeness: number;          // 0–100
  deadline: string | null;       // ISO date or null
  assignedTo: string | null;     // 'María Cárdenas' style names
  linkedControls: string[];      // control ids
  conflicts: string[];           // other obligation ids
  lastUpdated: string;           // ISO date
};
Application surfaces — match DESIGN_SYSTEM.md §Product Screens
Build every screen below. The chrome around them — sidebar, topbar, app shell, breadcrumbs — comes from §27 of the extended stylesheet. The combined scoping control sits in the topbar or directly above the data table on every product screen.

Dashboard — landing page. Four stat cards (Total obligations · Conflicted · Implementing · Pending) using .card--stat. A horizontal bar chart of obligations by jurisdiction using .chart-bar--{reg}. A recent regulatory changes table on the right. A scope-aware "Coverage" completeness summary.
Obligation Register — full-width data table with .table, sticky header, sortable columns, hoverable rows, selectable rows with the sienna left rail. Columns: ID (mono) · Regulation badge · Framework · Summary · Status badge · Completeness bar · Deadline · Assigned. Filter sidebar on the left with jurisdiction / domain / status / framework facets, all using .checkbox rows. Multi-select bulk actions appear in a toolbar at the top when rows are selected. Pagination at the bottom.
Obligation Detail — two-column layout. Left: What · How · Deadline · Responsible owner sections separated by .divider. Right: linked controls table · conflict indicators · audit trail (mono). Status badge prominent at the top. Edit / Assign / Mark implementing buttons in the topbar.
Conflict Detection — full-bleed force-directed graph of obligation nodes using the SVG graph utilities from §14. Conflict edges in .graph-edge--conflict. Right panel: list of conflicts with type, involved obligations, detection date and resolution status. Filters above: unresolved / by jurisdiction / by domain.
Regulatory Sources — table of sources with name · last fetched · documents · scraper health (status badge). Manual refresh button per row. Click a row to see fetched documents in a side panel.
Settings — six panels in a tab strip: Jurisdictions · Entity types · GRC connections · User roles · Theme mode toggle · Notifications. Each panel uses standard form components.
Reports — list view of generated reports (PDF / PPTX / DOCX export). Bottom section: "Generate new report" form with template picker.
For each screen, build:

The route component itself.
Any subcomponents needed (e.g. <ObligationRow>, <ConflictBadge>, <JurisdictionTag>, <StatusBadge>, <StatCard>).
Loading state using .skeleton + .spinner from §24.
Empty state using .empty-state from §25.
Error state using .alert--error.
The combined scoping control from §22 is reused as a single component (<ScopeControl>) at the top of every product screen. Its state lives in a Zustand store (or equivalent) so that switching from Dashboard to Register preserves the active jurisdiction and selected regulations.

Components contract
Build these as React + TypeScript components in src/components/. Each one exists as a thin wrapper that applies the existing classNames; no styling logic of its own.

src/components/
  ui/
    Button.tsx          // <button class="btn btn-primary btn--size-md"/>
    Input.tsx           // <input class="input"/> with label, helper, error states
    Select.tsx          // native select with .select styling
    Textarea.tsx
    Checkbox.tsx
    Radio.tsx
    Card.tsx            // .card with hover/selected/elevated/compact/flat/stat variants
    Badge.tsx           // .badge--regulation, .badge--status
    Tag.tsx             // .tag-jurisdiction / .tag-framework / .tag-domain
    Alert.tsx
    Modal.tsx
    Tooltip.tsx
    Dropdown.tsx        // .menu, .menu__item, .menu__divider
    Tabs.tsx
    Breadcrumbs.tsx
    Pagination.tsx
    Spinner.tsx
    Skeleton.tsx        // multiple variants
    EmptyState.tsx
    Icon.tsx            // <svg class="icon icon--{size} icon--{ctx}"><use href=".../icons.svg#icon-{name}"/></svg>
    Flag.tsx            // same pattern for flags.svg
    Logo.tsx            // inlines the canonical SVG verbatim, accepts a size prop
  layout/
    AppShell.tsx        // .app-shell with sidebar + topbar + content
    Sidebar.tsx
    TopBar.tsx
  product/
    ScopeControl.tsx    // §22 combined scoping control, ported from Stylesheet Reference.html
    ObligationRow.tsx
    ObligationDetail.tsx
    RegulationCard.tsx
    JurisdictionTag.tsx
    StatusBadge.tsx
    StatCard.tsx
    ConflictBadge.tsx
    SourceRow.tsx
    CompletenessBar.tsx // .completeness-bar with --value driven by props
    ValidationScore.tsx
Every UI component:

Accepts the standard HTML props for its element via React.ComponentPropsWithoutRef<...>.
Supports className concatenation (don't clobber consumer classes).
Forwards refs where appropriate.
Has a small Storybook-style usage doc at the top of the file as a JSDoc block.
Routing
Set up these routes:

/                    → Dashboard
/register            → Obligation Register
/register/:id        → Obligation Detail
/conflicts           → Conflict Detection
/sources             → Regulatory Sources
/reports             → Reports
/settings            → Settings (with hash routing for the six panels)
Sidebar nav uses .nav-item from §21 with is-active driven by the current route.

Theme switching
Persist to localStorage under obligai-theme. Apply to document.documentElement on mount and on toggle. Default to light. The toggle lives in the topbar's right cluster as a two-button segmented control.

Process — STAGED DELIVERY (CRITICAL)
Do not build the whole app in one pass. Deliver in seven checkpoints and stop after each one for me to verify. If you blast through them, I will revert and start over.

Checkpoint 1 — Foundation. Scaffold the project, copy CSS and SVG assets into the right folders, set up the import order, get the canonical fonts loading, and render a single page that shows the vertical lockup and a Hello, ObligaI headline using .t-display. Confirm the wordmark looks right. Stop.

Checkpoint 2 — UI primitives. Build every component in src/components/ui/. Build a <ComponentGallery> route at /__gallery that renders every variant of every primitive — Button × four variants × three sizes, all alert types, all status badges, all 20 regulation badges, all input states. Confirm it matches Stylesheet Reference.html side-by-side. Stop.

Checkpoint 3 — Layout + theming. Build AppShell, Sidebar, TopBar, the theme toggle. Wire up routing with empty placeholder pages for each route. Confirm sidebar nav, breadcrumbs, theme persistence and the topbar search input all work. Stop.

Checkpoint 4 — Scoping control + registry. Build src/data/registry.ts with the 20 regulations and 18 jurisdictions. Build <ScopeControl> as a fully-working React port of the §22 component, with jurisdiction-colour-awareness via --juris-color. Mount it in the topbar. Wire up its state in Zustand (or equivalent). Build the mock obligation dataset of 120–180 entries. Stop.

Checkpoint 5 — Register + Detail. Build the Obligation Register table with sorting, filtering, multi-select, pagination, and empty/loading/error states. Build the Obligation Detail page wired to a route param. Confirm scope changes propagate from topbar to table. Stop.

Checkpoint 6 — Dashboard, Sources, Settings, Reports. Build the remaining four screens. Stop.

Checkpoint 7 — Conflicts + polish. Build the Conflict Detection graph view. Final pass on a11y (every interactive element has a focus ring, every chart has an aria-label, every form field has a label). Run the validation checklist below. Stop.

At each checkpoint, write a brief progress note to progress.md and show me a screenshot before continuing.

Validation checklist before each checkpoint hand-off
Run through these. If any fail, fix before moving on.

 No file outside the src/styles/ and public/assets/ folders contains a hex colour literal.
 No component file has style={{}} for colour, spacing, type, radius or shadow (dynamic CSS variable values are fine).
 Every button has 0 px radius.
 Every card, badge, input, alert has 2 px radius.
 The wordmark is intact and unmodified everywhere it appears.
 No console.error in the browser on any page.
 Dark mode produces a usable, on-brand result on every screen.
 Tabbing through every screen reaches every interactive element in a sensible order.
 The combined scope control state persists across route changes.
 The 28-icon sprite and 18-flag sprite are both reachable from React.
What success looks like
Open the app, set the scope to "European Union" — the chip highlights navy #0D3B66, the popover focus ring and Add trigger pick up the same colour, the register filters to LCR / NSFR / ALMM only. Toggle dark mode — every surface flips except the sienna brand. Click an obligation — its detail page opens with conflicts, controls and audit trail. Navigate to the conflict graph — nodes and edges are coloured by their registry, conflict edges crimson. Generate a report — a modal lets you pick a template and download.

The whole product should feel like one designer built every pixel. Because they did. Your job is to consume that, not redo it.

Final reminder
If at any point you find yourself thinking "I'll just add a small custom colour here" or "this needs a slightly different radius" or "let me use Tailwind for this one bit" — stop and ask first. The stylesheet has answered every visual question you might have. If it hasn't, that is a real design question, not a developer workaround.

Begin by reading the eight files above, confirming the repo context block at the top, and showing me your plan for Checkpoint 1.
