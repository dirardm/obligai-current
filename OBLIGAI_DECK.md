# ObligaI — Presentation Deck Outline

## Slide 1 — Cover

**Eyebrow:** REGULATORY INTELLIGENCE PLATFORM

**Body content:**
ObligaI

Transform regulatory text into structured obligations

**Visual:** 
Logo (knowledge graph node mark) centred. The wordmark "Obliga" with italic "I" in sienna. Subtitle in Georgia Italic, sienna colour. Date below.

**Speaker note:**
Good morning. Today I want to show you ObligaI, a platform that solves one of the most persistent problems in compliance: turning dense regulatory text into actionable, queryable obligations. This is a working prototype. Let me show you how it works.

---

## Slide 2 — The Problem

**Eyebrow:** COMPLIANCE TODAY

**Body content:**

Compliance teams at multi-jurisdiction banks spend weeks extracting obligations from PDFs and rulebooks—often by hand. A single regulation like the European CRR II spans hundreds of pages. When a bank operates across eight jurisdictions, it must parse twenty separate regulatory frameworks. Each translation from text into obligation is slow, inconsistent, and error-prone. There is no system of record, no conflict detection, no way to track which obligations overlap.

Today, this happens in spreadsheets and email. A compliance officer cannot easily answer: What obligations do we have in Peru? Which of our LCR controls conflict with NSFR? Are we duplicating effort across regulations?

**Visual:**
Two-column comparison mockup. Left side shows a PDF page with dense regulatory text, a highlighter pen, and a spreadsheet with handwritten notes. Right side shows "???" to indicate the gap. A single phrase in large type: "Which obligation matters?"

**Speaker note:**
Imagine you're a Chief Compliance Officer at a bank operating in eight jurisdictions. You receive a new regulation from the Central Bank of Brazil. Now you need to figure out which existing controls satisfy it, which new controls you need to build, and whether it conflicts with your existing liquidity standards. You open a PDF, you read dozens of pages, you fill in a spreadsheet, and you email your team. That is today's workflow. And it breaks down at scale.

---

## Slide 3 — Today's Workflow vs ObligaI

**Eyebrow:** THE WORKFLOW

**Body content:**

Today: Receive regulation → Read PDF manually → Extract obligations by hand → Update spreadsheet → Search for conflicts manually → Email results to stakeholders

With ObligaI: Select jurisdiction + regulation → View all obligations automatically → Identify conflicts visually → Generate compliance report → Share with team

**Visual:**
Two columns. Left side: linear flow showing the manual process (PDF icon → pen icon → spreadsheet icon → email icon, with timescales: "weeks"). Right side: circular flow showing ObligaI (funnel icon → table icon → graph icon → document icon, with timescales: "minutes"). Arrow below both: "Same information. Different speed."

**Speaker note:**
The workflow doesn't change. You still need to understand obligations, identify conflicts, and communicate with your team. What changes is the speed and the consistency. Instead of reading a PDF and transcribing, you open ObligaI, select your scope, and everything is already structured. Conflicts are already detected. You can export a report. What used to take weeks now takes minutes.

---

## Slide 4 — What is ObligaI

**Eyebrow:** PLATFORM OVERVIEW

**Body content:**

ObligaI is a regulatory intelligence platform that transforms unstructured regulatory text into a structured, searchable obligation register. It ingests regulatory documents from central banks, prudential authorities, and financial regulators across eighteen jurisdictions. It parses obligations, maps them to internal controls, detects conflicts, and surfaces everything in a single queryable system. Compliance teams can filter by jurisdiction or regulation, see obligation status and completeness, identify conflicts, and generate reports. The system is currently a working prototype with 131 mock obligations across 20 regulations.

**Visual:**
Large stat callout in the centre of the slide:
- 20 Regulations
- 18 Jurisdictions
- 131 Obligations

Small text below: "Currently: Prototype with mock data. Next: Real scrapers and extraction engine."

**Speaker note:**
ObligaI does three things. First, it brings together regulatory obligations from across the world into one place. Second, it structures them—every obligation has a citation, a summary, a status, a deadline, and a linked control. Third, it identifies conflicts so you're not building the same control twice or worse, building conflicting controls. Right now we're working with mock data—131 obligations across 20 regulations and 18 jurisdictions. But the architecture is ready to scale to real data.

---

## Slide 5 — How It Works

**Eyebrow:** THE PIPELINE

**Body content:**

ObligaI operates as a four-stage pipeline. Regulatory source scrapers monitor twelve central banks and prudential authorities, displaying scraper health and document status. The obligation extraction engine (currently with mock data) creates structured obligation records, each with a citation, summary, status, and deadline. A conflict detection system identifies when two obligations contradict or require overlapping controls. Finally, a dashboard and reporting interface let compliance teams view their obligations in real time, identify gaps, and generate reports for stakeholders.

**Visual:**
Horizontal flow diagram with four boxes connected by arrows:
1. "Regulatory Sources" (with icons of documents)
2. "Extract Obligations" (with icon of table)
3. "Detect Conflicts" (with icon of network graph)
4. "Dashboard + Reports" (with icon of analytics)

Below each box: brief label of the ObligaI surface that executes that step (Sources page, Register page, Conflicts page, Dashboard page).

**Speaker note:**
Let me walk through the pipeline. First, regulatory sources. We have scrapers monitoring twelve regulatory bodies across eighteen jurisdictions. When a new regulation is published, the scraper fetches it. Next, extraction. We parse that document and pull out structured obligations with citations, summaries, and deadlines. Then conflicts. We compare obligations against each other and flag when two regulations require mutually exclusive things. Finally, dashboard. Your team opens ObligaI and sees all their obligations, knows what's conflicted, knows what's due. All in one place.

---

## Slide 6 — Coverage

**Eyebrow:** 20 REGULATIONS ACROSS 18 JURISDICTIONS

**Body content:**

ObligaI covers financial regulations across four regions: the European Union, EMEA ex-EU (UK and Switzerland), North America (US and Canada), Latin America (Colombia, Brazil, Mexico, Peru, Panama), and Asia-Pacific (Japan, Singapore, Hong Kong, Australia, Indonesia, Malaysia, Vietnam, Thailand). Eight of the eighteen jurisdictions are in Asia-Pacific, reflecting the critical importance of regional liquidity regulation. All regulations are liquidity or prudential standards derived from international frameworks.

**Visual:**
Regulation grid showing all 20 regulations colour-coded by jurisdiction. Each card shows regulation short name (LCR, NSFR, UK PRA, US Fed, OSFI LAR, FINMA, IRL, BCB, CNBV, SBS Peru, SBP Panama, BSR Japan, MAS 649, HKMA LMR, APS 210, OJK LCR, BNM, SBV, BOT). Grouped by region with region labels (EU, EMEA, North America, Latin America, Asia-Pacific). Colour palette matches design system regulation colours.

**Speaker note:**
We are supporting twenty regulations across eighteen jurisdictions. These are financial regulations—liquidity coverage ratios, net stable funding requirements, prudential standards. Most are frameworks derived from international standards like Basel guidelines. The map you see shows the breadth: we have strong coverage in Europe, North America, and especially Asia-Pacific. Eight of our eighteen jurisdictions are in Asia-Pacific because liquidity regulation there is complex and critical. This is a global platform designed for global banks.

---

## Slide 7 — The Register

**Eyebrow:** SEARCHABLE OBLIGATION DATABASE

**Body content:**

The Register is where compliance teams spend most of their time. It's a searchable database of all 131 obligations. Users filter by jurisdiction, regulation, status, and deadline. The table shows citation, summary, status (colour-coded), completeness (progress bar), deadline, and assigned owner. Click any obligation to see the full detail: the exact article number, the framework, the responsible party, linked internal controls, and known conflicts. Users can sort, select multiple obligations for bulk actions, and drill into any obligation in seconds.

The Register is the single system of record for regulatory obligations. When a regulation changes, the obligation is updated. When an obligation is implemented, the status moves from "implementing" to "active". When a conflict is resolved, it's marked as such. Every change is timestamped and attributed.

**Visual:**
Large screenshot of the Register page showing: filter sidebar on the left (jurisdiction dropdown, regulation dropdown, status checkboxes, deadline slider), main table with columns (Citation, Summary, Status, Completeness, Deadline, Owner), populated with 5–10 obligation rows with realistic data. A status badge in one row highlighted with a tooltip showing "Click to drill in".

**Speaker note:**
This is the Register—the core of the platform. You come here when you need to find an obligation. You can search by keyword, filter by jurisdiction or regulation, sort by status or deadline. Every obligation has a citation to the source regulation—not just a summary, but the exact article. You can click any obligation and see the full record: what controls satisfy it, what other obligations it conflicts with, when it's due. If a new regulation comes in, a compliance officer will add a new obligation here. If an obligation is implemented, the status changes. It's your system of record.

---

## Slide 8 — Conflict Detection

**Eyebrow:** IDENTIFY REGULATORY CONFLICTS

**Body content:**

Regulatory conflicts are inevitable when you operate across multiple jurisdictions. One regulation may require a specific reporting standard while another prohibits that exact standard. One may require daily reporting while another requires monthly. The Conflicts page surfaces these visually as a circular graph. Each obligation is a node, each conflict is an edge coloured by conflict type (reporting overlap, definitional conflict, jurisdictional overlap, etc.). A table below lists all conflicts with their type, the two obligations involved, and a brief description. Users can see at a glance where their obligation network is tangled and decide how to resolve conflicts: clarify interpretation, build a single control that satisfies both, or escalate to legal.

**Visual:**
Large screenshot of the Conflicts page showing: a circular force-directed graph with 8–12 nodes (obligations) and 5–7 edges (conflicts) between them. Edges are colour-coded and labelled (e.g., "Reporting overlap", "Definitional conflict"). Below the graph is a table showing all conflicts with columns (Type, Obligation A, Obligation B, Description). One conflict is highlighted.

**Speaker note:**
This is the Conflicts page. One of the hardest parts of multi-jurisdiction compliance is knowing where you have conflicts. Two regulations might both apply to you, and they might contradict. We visualise that as a graph. Each obligation is a bubble. Each conflict is a line between two obligations, coloured by the type of conflict. You can see at a glance where your obligation network is tangled. Click a conflict and we show you both obligations side-by-side so you can decide how to resolve it.

---

## Slide 9 — Dashboard

**Eyebrow:** AT-A-GLANCE COMPLIANCE STATUS

**Body content:**

The Dashboard is the first screen users see. It displays four statistics: total obligations in scope, number that are active, number that are conflicted, and average completeness. A horizontal bar chart breaks down obligations by regulation, so you can see at a glance which regulations have the most work ahead. A table of recent changes shows the last five obligations modified, with their status and owner. A completeness summary shows the distribution of status across all obligations in scope. It answers the question: Where are we in our compliance work?

The scope control at the top lets users filter the entire dashboard in real time. Select "EU, US, Canada" and "LCR, NSFR" and the dashboard updates instantly to show only those obligations.

**Visual:**
Screenshot of the Dashboard page showing: four stat cards at the top (Total Obligations: 42, Active: 28, Conflicted: 3, Avg Completeness: 78%), a horizontal bar chart (obligations by regulation, with regulation labels and counts), a table of recent changes (5 rows with citation, status badge, completeness bar, owner name), and a completeness status summary (stacked bar showing active/implementing/pending/conflicted/inactive).

**Speaker note:**
The Dashboard is your control centre. You open ObligaI and you immediately see your compliance status. Forty-two obligations in your scope. Twenty-eight are active. Three are conflicted—those need attention. Average completeness is 78 per cent. You can see the bar chart and know which regulations are heaviest. You can see recent changes and know what's been worked on. If a new regulation comes in, the numbers update. It's your real-time compliance pulse.

---

## Slide 10 — Roadmap

**Eyebrow:** PRODUCT PHASES

**Body content:**

Phase 1: Connect scrapers to real regulatory APIs and fetch live documents from central banks and regulators. Phase 2: Build the obligation extraction engine to parse regulatory PDFs and create structured obligations automatically. Phase 3: Migrate mock data to production obligations extracted from real documents. Phase 4: Deploy to 2–3 early-access financial institutions and collect feedback. Phase 5: Expand to additional regulations (capital adequacy, operational resilience, AML) and integrate with external compliance tools.

**Visual:**
Table with three columns:
- Phase
- Scope
- Target Month

Rows:
1. Phase 1: Real Regulatory Scrapers | Connect live APIs, daily fetch, document versioning | June 2026
2. Phase 2: Obligation Extraction Engine | PDF parsing, NLP-based classification, validation | August 2026
3. Phase 3: Production Data Migration | Extract all documents, deduplicate, validate coverage | October 2026
4. Phase 4: Early-Access Partners | Deploy to 2–3 banks, collect feedback | December 2026
5. Phase 5: General Availability | Expand regulations, build integrations | Q1 2027

**Speaker note:**
Here is our roadmap. Right now we are at the prototype stage. The user interface is complete and working. What is missing is the data pipeline. Phases 1 and 2 connect the scraper to real regulatory sources and build the extraction engine that parses PDFs. Phase 3 uses that engine to generate a production dataset. Phases 4 and 5 expand the product based on customer feedback. The entire roadmap extends to early 2027. Each phase is 4 to 6 weeks. We're confident in the architecture and ready to scale.

---

## Slide 11 — Why Now

**Eyebrow:** MARKET FORCES

**Body content:**

Financial regulation has doubled in complexity over the last decade. Every major economy has introduced new standards—CRR II in Europe, OSFI LAR in Canada, a new PRA rulebook in the UK. Latin American regulators are modernizing liquidity frameworks. Asia-Pacific is expanding prudential requirements. At the same time, compliance budgets are flat and teams are smaller. Banks need a way to manage regulatory obligations at scale. They need a system of record, not spreadsheets. They need conflict detection, not post-mortems. Regulators are beginning to require evidence of systematic compliance monitoring—not just a list of obligations, but proof that a bank understands its regulatory landscape and can identify gaps and conflicts. ObligaI fills that gap.

**Visual:**
None (prose-only slide). White background, dark text.

**Speaker note:**
Why build this now? Because regulation has exploded. A global bank now faces twenty or thirty significant regulations depending on where it operates. Compliance teams have not scaled to match. They are still using spreadsheets and PDFs. At the same time, regulators are getting smarter. They want to see evidence that you actually understand your regulatory obligations and that you have a system to detect conflicts and gaps. ObligaI is that system. It gives you the tools to manage compliance at scale.

---

## Slide 12 — Questions

**Eyebrow:** — 

**Body content:**
Questions?

**Visual:**
Large text, 96pt Inter Bold, centre of slide. Sienna colour for the question mark. Vast white space around it. The mark (knowledge graph node) optional in a corner.

**Speaker note:**
That is the platform. I have fifteen minutes for your questions. What would you like to know?
