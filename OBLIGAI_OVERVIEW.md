# ObligaI — Regulatory intelligence for multi-jurisdiction banks

## The problem

Compliance teams at multi-jurisdiction financial institutions spend weeks extracting regulatory obligations from PDFs, circulars, and rulebooks—often by hand. A single regulation like the European CRR II spans hundreds of pages and hundreds of articles. When a bank operates across eight jurisdictions, it must parse twenty separate regulatory frameworks. Each translation from regulatory text into a structured obligation is slow, lossy, and inconsistent across teams. A single article may be interpreted differently depending on who reads it, leading to conflicting internal control requirements. Worse, when regulations change, teams have no systematic way to determine which obligations shift, which remain stable, and which conflict with new requirements in other jurisdictions.

Today, this work happens in spreadsheets and email threads. There is no system of record, no conflict detection, no audit trail. Compliance teams cannot easily answer: What obligations do we have in Peru under SBS liquidity rules? Which of our LCR controls conflict with NSFR requirements? Are we implementing the same control twice for overlapping regulations?

## What ObligaI does

ObligaI is a platform that takes unstructured regulatory text and transforms it into a structured, queryable obligation register. It begins with regulatory documents—PDFs from central banks, circulars from financial authorities, rulebooks from prudential regulators. A set of document scrapers monitors regulatory bodies across eighteen jurisdictions and ingests new documents as they are published. An obligation extraction engine parses regulatory text and creates structured obligation records, each with a citation to the source article, a plain-English summary, a jurisdiction and regulation identifier, a status, a completeness metric, and a deadline.

The result is a single system of record for regulatory obligations. A compliance professional can search across all 131 obligations by keyword, filter by jurisdiction or regulation, sort by status or deadline, and drill into the full obligation detail including citation, framework reference, assigned owner, linked internal controls, and known conflicts. The system automatically identifies when two obligations conflict—when they contradict one another, require overlapping controls, or impose mutually exclusive requirements—and flags these relationships visually.

The user's day changes. Instead of reading PDFs and transcribing obligations into spreadsheets, a compliance officer can open ObligaI, select their active jurisdictions and regulations, and see at a glance which obligations are active, which are still being implemented, which are pending activation, and which are conflicted. They can generate compliance reports for regulators, track completion status of each obligation, and resolve conflicts before they become audit findings.

## How it works

ObligaI operates as a four-stage pipeline, visible throughout the application.

**Regulatory Source Scrapers** monitor eight regulatory bodies across eighteen jurisdictions—central banks in Brazil, Colombia, Peru, Panama and Mexico; the European Banking Authority; the UK PRA; the US Federal Reserve; and prudential regulators across Asia and Europe. Each scraper runs on a defined schedule, fetches new documents, and logs the ingestion status. The platform displays scraper health, the number of documents ingested, and the date of last successful refresh. Users can manually trigger a refresh if they know a new circular or rulebook has been published.

**Obligation Registry** receives structured obligation records from the extraction engine. Each record includes a unique identifier, the regulation and jurisdiction it belongs to, a citation to the specific article or clause, a one-paragraph summary in plain English, a status (active, conflicted, implementing, pending, or inactive), a completeness percentage indicating how much of the obligation has been implemented, a deadline if one exists, the name of the team member responsible, a list of linked internal controls, and known conflicts with other obligations. The registry currently contains 131 mock obligations across 20 regulations and 18 jurisdictions.

**Conflict Detection** identifies overlapping or contradictory obligations. When obligation A requires a certain reporting standard and obligation B requires a different standard in the same jurisdiction, the system flags them as conflicted and surfaces them in a graph visualization. Users can see the conflict network, drill into each conflict, understand the type of conflict (reporting overlap, definitional disagreement, jurisdictional conflict), and decide how to resolve it—either by clarifying interpretation, by creating a control that satisfies both, or by escalating to legal for interpretation.

**Compliance Dashboard and Reports** let users view aggregate status across their active scope. A compliance officer selects their relevant jurisdictions and regulations via a scope control, and the platform filters all obligations, counts status by type (active, implementing, pending, conflicted, inactive), calculates average completeness across the set, and shows recent changes. Users can generate reports in multiple formats (PDF, PowerPoint, Word) for stakeholder updates or regulatory submissions.

## What the user sees

### Dashboard

The dashboard is the first view a user sees. It displays four stat cards showing the total obligation count, the number that are active, the number that are conflicted, and the average completeness percentage. Below, a horizontal bar chart breaks down obligations by regulation, with each bar coloured according to the regulation's brand colour. A table of recent changes shows the last five obligations modified, with their status, completeness, and assigned owner. At the bottom, a completeness summary shows the distribution of obligation status across the selected scope.

### Register

The Register is a searchable database of all obligations. A filter sidebar on the left allows the user to filter by jurisdiction, regulation, status, and deadline. The main table shows all matching obligations, with columns for citation, summary, status (colour-coded badge), completeness (progress bar), deadline, and assigned owner. Users can sort by any column, click an obligation row to see the full detail, and select multiple obligations for bulk actions like reassignment or status change.

### Obligation Detail

The full obligation record shows the complete information: the regulation and jurisdiction, the exact citation (e.g., "Article 415 CRR II"), the framework label (e.g., "CRR II / liquidity standards"), the plain-English summary, the current status and completeness percentage, the deadline and responsible party, a list of linked internal controls with links to each, a list of known conflicts with other obligations, and the date the record was last updated. From this view, a user can change the status, update completeness, reassign the obligation, or note that a conflict has been resolved.

### Conflicts

The Conflicts page shows a circular graph visualization of all conflicting obligations in the selected scope. Each obligation is a node, and each conflict is an edge connecting the two obligations. The edge is coloured and labelled by conflict type (reporting overlap, definitional conflict, jurisdictional overlap). Below the graph, a table lists all conflicts with their type, the two obligations involved, and a brief description. Users can click a conflict to drill into both obligations and understand the nature of the disagreement.

### Regulatory Sources

The Sources page displays the status of all eight regulatory document scrapers. A table shows each scraper (e.g., "European Banking Authority", "Bank of Brazil"), its health status (healthy, degraded, or down), the date of the last successful refresh, and the number of documents currently being monitored. On the right, a side panel shows recent ingestion logs—which documents were fetched, when, and whether parsing succeeded. Users can manually trigger a scraper refresh or view detailed logs if a scraper has failed.

### Reports

The Reports page allows users to generate compliance reports for internal or regulatory use. A form lets the user select a report template (obligation summary, status by regulation, conflict analysis, etc.), the output format (PDF, PowerPoint, Word), and the scope of obligations to include. A table below shows previously generated reports, their status (ready, generating, failed), the date generated, and a download link. Users can download any report, schedule a recurring report, or generate an ad-hoc report on demand.

### Settings

The Settings page has six tabs. The Jurisdictions tab allows users to configure which jurisdictions their institution operates in, which affects the scope filter. The Entity Types tab defines internal entity categories (subsidiary, branch, desk, etc.). The GRC Connections tab wires ObligaI to external systems like governance and risk platforms. The User Roles tab defines who can view, edit, or approve obligations. The Theme tab toggles between light and dark mode. The Notifications tab configures email and webhook alerts for deadline approaching, status changes, or new conflicts.

## Coverage

ObligaI currently supports 20 financial regulations across 18 jurisdictions, organised as follows:

| Jurisdiction | Regulation | Framework | Category |
|---|---|---|---|
| **European Union** | Liquidity Coverage Ratio | LCR | Liquidity |
| European Union | Net Stable Funding Ratio | NSFR | Liquidity |
| European Union | Additional Liquidity Monitoring Metrics | ALMM | Monitoring |
| **United Kingdom** | PRA Fundamental Rules | UK PRA | Prudential |
| **United States** | Federal Reserve Liquidity Standards | US Fed | Liquidity |
| **Canada** | OSFI Liquidity Adequacy Requirements | OSFI LAR | Liquidity |
| **Switzerland** | FINMA Liquidity Ordinance | FINMA LiqO | Liquidity |
| **Colombia** | Indicador de Riesgo de Liquidez | IRL | Liquidity |
| **Brazil** | BCB Liquidity Framework | BCB | Liquidity |
| **Mexico** | CNBV Liquidity Coefficient | CNBV | Liquidity |
| **Peru** | SBS Liquidity Requirements | SBS Peru | Liquidity |
| **Panama** | SBP Liquidity Standards | SBP Panama | Liquidity |
| **Japan** | BSR Liquidity Coverage Standards | BSR Japan | Liquidity |
| **Singapore** | MAS Notice 649 Liquidity | MAS 649 | Liquidity |
| **Hong Kong** | HKMA Liquidity Maintenance Ratio | HKMA LMR | Liquidity |
| **Australia** | APRA Prudential Standard APS 210 | APS 210 | Prudential |
| **Indonesia** | OJK Liquidity Coverage Ratio | OJK LCR | Liquidity |
| **Malaysia** | BNM Liquidity Coverage Requirement | BNM | Liquidity |
| **Vietnam** | SBV Liquidity Standards | SBV | Liquidity |
| **Thailand** | BOT Liquidity Standards | BOT | Liquidity |

The registry is divided into four regional groups: European Union and EMEA ex-EU (UK, Switzerland); North America (US, Canada); Latin America (Colombia, Brazil, Mexico, Peru, Panama); and Asia-Pacific (Japan, Singapore, Hong Kong, Australia, Indonesia, Malaysia, Vietnam, Thailand). Eight of the eighteen jurisdictions are in Asia-Pacific, reflecting the critical importance of regional liquidity regulation in that region.

## Where we are

ObligaI is a functioning prototype with complete user interface and mock data. All screens are built and functional: users can browse, search, filter, and drill into 131 mock obligations. The scope control allows real-time switching between jurisdictions and regulations. Conflict detection works on a static conflict map. The dashboard, reports, and settings pages all render correctly. The design system is complete and the application is production-ready in structure.

What is not yet built: the document scrapers do not connect to real regulatory APIs; the obligation extraction engine does not parse real regulatory PDFs; and the mock obligation data is hardcoded in the application rather than loaded from a database. The next phase is to wire the scrapers to real regulatory sources, build the extraction pipeline, and replace mock data with real obligations from those sources.

## What's next

The immediate roadmap has five phases.

**Phase 1: Real Regulatory Scrapers** — Connect the scraper interface to live APIs from the European Banking Authority, Bank of England, Federal Reserve, and equivalent bodies in each jurisdiction. Fetch real regulatory documents (PDFs, circulars, rulebooks) on a daily schedule. Implement document versioning and change detection so the system knows when a regulation has been modified.

**Phase 2: Obligation Extraction Engine** — Build a pipeline that parses regulatory documents (using PDF extraction and natural language processing) and extracts structured obligations. Train a classifier to identify obligation statements, extract citations, and map regulations to jurisdictions. Validate extracted obligations against known schema. Begin with a subset of regulations (LCR, NSFR) and iterate.

**Phase 3: Production Data Migration** — Once the extraction engine is calibrated, use it to process all documents in the scraper library and generate a production dataset of real obligations. Validate coverage, deduplicate, and tag obligations with internal control mappings based on compliance team input.

**Phase 4: Early-Access Partners** — Deploy the system to 2–3 early-access financial institutions and collect feedback on usability, obligation coverage, and conflict detection accuracy. Iterate on the UI and data model based on their feedback.

**Phase 5: General Availability** — Expand coverage to additional regulations (capital adequacy, operational resilience, anti-money laundering) and jurisdictions. Build integrations with compliance tools (ServiceNow, AuditBoard, etc.) to embed obligation tracking into existing workflows.

Each phase is expected to take 4–6 weeks, with the full roadmap extending to early 2027. The product is designed from the start to scale from prototype to production, with mock data replaced by real data and real backend APIs substituted for hardcoded records.
