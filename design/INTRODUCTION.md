## Overall Architecture Principle

- **Orthogonality**: One fact lives in exactly one layer. No duplication.
- **Joins as First-Class Citizens**: The connections between layers (e.g., a deontic obligation linking to a computational formula and a reporting field) are explicit and queryable.
- **Stack Order**: Structural → Surface → Deontic → Semantic → Computational → Field → Cross-Regulation, with Temporal, Provenance, Generative, and Quality layers woven horizontally as "cross-cutting" infrastructure.

---

## Development Plan per Stack

### 1. Structural Layer: The Skeleton

**Goal:** Build a fully navigable, version-aware parse tree of the regulation's document structure, including cross-references.

**Dependencies:** Raw regulatory text (PDF, HTML, XML).

**Tasks:**

- **Parser Development:** Implement a multi-format parser (EUR-Lex XML, national gazettes, PDF text with TOC extraction) that identifies the hierarchy: Title → Chapter → Section → Article → Paragraph → Point → Subpoint. Annexes, recitals, and tables are treated as structural siblings with their own internal hierarchy.
- **Structure Normalisation:** Map all document formats to a unified canonical schema (e.g., Akoma Ntoso or custom JSON schema). Define fixed paths like `CRR/Part Six/Title IV/Chapter 2/Art. 428k`.
- **Cross-Reference Graph (First Pass):** Scan for explicit references ("as referred to in Article 24 of Regulation (EU) 2015/61") and create typed edges (`cites`, `amends`, `derogates_from`) between structural nodes. These are first-class edges in a graph database.
- **Amendment Tracking:** For regulations like NSFR (CRR Part Six), model the base structure and then layer amendment files (CRR II, CRR III) as patches that insert, delete, or replace structural sub-trees.
- **Annex & Table Decomposition:** For LCR Annex I and COREP templates, decompose into `template → table → row × column → cell`. Each cell is an addressable structural node.

**Deliverable:** A structural graph database where any clause, annex cell, or recital can be uniquely addressed via a stable URI/path, with all cross-reference edges in place.

---

### 2. Surface / Linguistic Layer: The Text as Data

**Goal:** Process the raw text of every structural node into linguistically annotated tokens, aligned across 24 languages.

**Dependencies:** Structural layer (text content per node).

**Tasks:**

- **Tokenisation & Sentence Splitting:** Run standard NLP pipelines (spaCy, Stanza) on the text of each clause in each language. Store token, lemma, POS, and morphological features.
- **Named Entity Recognition (NER):** Fine-tune a transformer model on EU regulatory text to identify entities like "European Banking Authority", "Commission", "high quality liquid asset", "credit institution".
- **Multilingual Concept Alignment:** For each structural node (e.g., Article 10(1)), align the 24 language versions at the sentence and phrase level. Store language-specific surface forms as projections of a single, language-agnostic "concept" ID. For Peru SBS/Panama SBN, extend alignment to Spanish with EU Spanish as a bridge.
- **Surface-to-Structure Mapping:** Ensure every token/sentence is anchored to its structural path, enabling bidirectional traversal.

**Deliverable:** A multilingual corpus where every token is linguistically annotated and linked to a language-agnostic concept, all tethered to the structural skeleton.

---

### 3. Deontic / Modal Layer: The Obligation & Logic Classifier

**Goal:** Classify every sentence by its legal mood — the _kind_ of statement it is — with special attention to the distinction between `obligation (shall)`, `requirement (must)`, `prohibition (shall not)`, `permission (may)`, `definition (means)`, `condition (where, provided that)`, `exception (notwithstanding)`, and `delegation (the Commission shall adopt)`.

**Dependencies:** Surface layer (sentence-segmented text, tokens).

**Tasks:**

- **Deontic Taxonomy & Annotation Guide:** Define a fine-grained taxonomy of deontic categories. Distinguish `shall` (prescriptive obligation) from `must` (logical/external requirement) and `will` (future event or declarative). Create annotation guidelines with examples.
- **Rule-Based Classifier (High Precision):** Implement regex and syntactic patterns to capture clear signals: "shall not" = prohibition, "by way of derogation" = exception, "for the purposes of this Regulation" = definition intro.
- **ML Deontic Parser:** Train a sequence classification model (e.g., fine-tuned LegalBERT) on a manually annotated gold set of 5,000-10,000 regulatory sentences across multiple regulations to capture implicit moods (e.g., a sentence with "where" that embeds an obligation).
- **Deontic-to-Structural Binding:** Output deontic annotations as tags on structural sentence nodes. Crucially, tag the _scoped object_: if "shall report" is the obligation, attach the annotation to the verb, and prepare for later linking to the reporting field. The atomic unit is `(obligation, clause, reporting_field)`.

**Deliverable:** A deontic graph overlay where every sentence is tagged with its legal mood, ready for compliance rule extraction.

---

### 4. Semantic / Ontological Layer: The Concept Web

**Goal:** Model all key concepts and their typed relationships across regulations as a formal ontology.

**Dependencies:** Surface layer (entities), Deontic layer (definitions), Structural layer (scope of definitions).

**Tasks:**

- **Term Extraction & Definition Binding:** Use the deontic "definition" tags to extract defined terms ("'high quality liquid asset' means…") and link them to the defined concept node.
- **Ontology Modelling:** Design an OWL or RDF/OWL ontology. Define key classes (`Asset`, `Liability`, `Counterparty`, `MaturityBucket`) and properties (`is_a`, `has_haircut`, `subject_to_cap`, `inflows_from`, `outflows_to`).
- **Population:** For each regulation (LCR, NSFR, ALMM), populate the ontology. Instance: `NSFR_AvailableStableFunding` rdf:type `Concept`. Link weight categories: `ASF_100` `is_subclass_of` `ASF`. Explicitly model constraints like `Level1_Asset` `subject_to_cap` `LCR_40_Cap`.
- **Cross-Regulation Entity Linking:** Resolve "retail deposit" across LCR Art. 24 and NSFR Art. 428k to the same ontological entity. Use the cross-reference graph and surface NER to propose links; human curator validates.
- **Conflict Annotation:** When a definition diverges (e.g., ALMM concentration definition vs. LCR), create an explicit `has_conflict` edge with a note, referencing both source articles.

**Deliverable:** A queryable knowledge graph (RDF triple store) representing the conceptual backbone of the regulatory universe, with provenance to the defining texts.

---

### 5. Computational Layer: The Executable Rule Engine

**Goal:** Transform prose-based weights, haircuts, formulas, and conditional logic into structured, executable artifacts.

**Dependencies:** Semantic layer (concepts, properties), Deontic layer (obligations with conditions), Structural layer (text anchors).

**Tasks:**

- **Number & Rate Extractor:** Identify and extract all quantitative parameters: "25 %", "0.85", "EUR 100 000". Normalize and link to the semantic node (e.g., `Haircut_Level2A` has value `0.15`).
- **Formula AST Builder:** Parse formulaic prose into Abstract Syntax Trees (ASTs) with typed inputs and outputs. Example: "The liquidity outflow rate shall be 10 % of the outstanding amount" → `AST: OutflowAmount = Multiply(OutstandingAmount, 0.10)` with input types.
- **Conditional Logic Lifting:** Extract embedded conditionals ("where the counterparty is a financial customer, the outflow rate shall be 40 %, otherwise 20 %") into structured if-then-else branches within the AST. Use the deontic condition annotations.
- **Validation Rule DSL:** For reporting-specific validation (e.g., "field A = field B + field C"), encode as machine-readable rules with references to the field layer. These are distinct from regulatory formulas but may be derived from them.
- **Executable Wrapper:** Store all computational artifacts in a versioned rule repository that can be executed by a rule engine (Drools, custom Python engine) given input data.

**Deliverable:** A library of executable formulas, parameter sets, and decision tables, each linked back to the source legal text and the concepts involved.

---

### 6. Field Layer: The Reporting Binding

**Goal:** Map every reportable data point (COREP cell, supervisory template cell) to its underlying regulatory mandates, definitions, computations, and aggregation structure.

**Dependencies:** Structural layer (template structure), Computational layer (formulas), Deontic layer (obligations to report), Semantic layer (concepts measured).

**Tasks:**

- **Template Ingestion:** Consume EBA DPM (Data Point Model) artifacts, EBA filing rules, and jurisdiction-specific taxonomies (SBS, SBN). Decompose into canonical `(template, row, column, axis, member)` tuples.
- **Field-to-Text Anchoring:** For each field, create explicit links to:
  - The deontic obligation that mandates its reporting (e.g., "shall report the maturity ladder" → ALMM Art. 415a).
  - The definition(s) that specify its content (e.g., "counterparty" as defined in Art. 4).
  - The computational formula(s) that determine its value (e.g., outflow rate × outstanding).
  - The validation rules that constrain its relationships.
- **Aggregation Tree Mapping:** Model "of-which", "memorandum item", and total sums as explicit hierarchical edges between fields.
- **Field Catalogue API:** Expose the complete catalogue of 40,103 fields as a service that can retrieve the full annotated "story" of any field: why it exists, what law demands it, how it's calculated, and what it aggregates.

**Deliverable:** A fully wired field registry where every regulatory cell is a node with rich edges into the Deontic, Computational, and Semantic layers, enabling one-click traceability.

---

### 7. Cross-Regulation Layer: The Coherence Network

**Goal:** Identify, link, and track concept identities and conflicts across multiple regulations and jurisdictional variants.

**Dependencies:** Semantic layer (concept nodes), Structural layer (cross-references), Field layer (field-to-concept mappings).

**Tasks:**

- **Cross-Regulation Ontology Alignment:** Use the populated ontologies from LCR, NSFR, ALMM, IRL. Perform automated ontology matching (using lexical and structural methods) to propose alignments, then manually curate exact-match (`owl:sameAs`), close-match, or broader/narrower.
- **Shared Referent Linking:** Formalize the "retail deposit" case: annotate the LCR Art.24 node and NSFR Art.428k node as referencing the _same_ core concept entity. This prevents definitional drift.
- **Conflict Registration:** When two regulations define the same concept differently (e.g., ALMM vs. LCR concentration metrics), create a `regulatory_conflict` node linking the two definitions, with a structured explanation of the divergence. These are annotations, not errors.
- **Jurisdictional Mapping:** For Peru SBS and Panama SBN, map local regulatory provisions to the EU baseline concepts using the same conflict/alignment framework, creating a global view of regulatory convergence and divergence.

**Deliverable:** A cross-regulation graph that can answer queries like "Show me every use of the term 'retail deposit' across all regulations and jurisdictions, and flag any that are inconsistent."

---

### 8. Temporal / Version Layer: The Time Machine

**Goal:** Enable point-in-time and interval queries: "What did Article X mandate on 15 June 2023?"

**Dependencies:** Structural layer (versioned nodes), Computational and Field layers (versioned parameters).

**Tasks:**

- **Versioned Graph Model:** Implement a bitemporal or valid-time model where each node (structure, formula, field binding) has `effective_start` and `effective_end` dates, plus `application_dates` for transitional provisions.
- **Amendment Diff Ingestion:** Extend the structural amendment tracking to produce dated deltas. Apply these deltas to create new versions of the affected subgraphs.
- **Parameter Versioning:** When a haircut changes from 15% to 20% via an amending act, create a new version of the computational node with the new value and effective date, without overwriting the old one.
- **Temporal Query API:** Expose a query endpoint that accepts a date and returns the complete regulatory state (all layers) as it stood at that point in time.

**Deliverable:** A time-aware regulatory knowledge base where any change is a new layer, and "latest version" is just the default view over a full history.

---

### 9. Provenance / Authority Layer: The Source Tiers

**Goal:** Attach a clear authority level to every annotation, enabling downstream users to weigh its regulatory force.

**Dependencies:** All layers (each annotation is tagged).

**Tasks:**

- **Authority Taxonomy:** Define the hierarchy: Level 1 (Regulation/Directive), Level 2 (Delegated Acts, ITS, RTS), Level 3 (EBA Guidelines, Q&As), National Transpositions, EBA Opinions.
- **Auto-Tagging on Ingestion:** When ingesting a document, tag its content and all derived annotations with the document's authority level.
- **Derived Annotation Provenance:** For human or model-generated annotations (e.g., an ontology link between two articles), record not only the annotator identity (see Quality layer) but also the source tier of the evidence used. A connection inferred from two Level 2 texts carries different weight than one from a Level 1 text.
- **Visual Weighting:** In any UI displaying the regulatory graph, visually distinguish or filter by authority tier.

**Deliverable:** A provenance metadata framework where every fact carries a tier label, making authoritativeness transparent.

---

### 10. Generative / Production Layer: The Field Grammar

**Goal:** Encode the production rules that generate the reporting field catalogue from the regulatory text, proving that the catalogue is not a flat list but a derivable structure.

**Dependencies:** All previous layers, especially Deontic, Computational, and Field.

**Tasks:**

- **Grammar Mining:** Analyze recurrent patterns across regulations: "For each [entity], [reporting_entity] shall report [measure] broken down by [dimensions]". Formalize these as a generative grammar with rules like `ReportingObligation → Entity Mandate DeonticMarker Measure Dimensionality`.
- **Rule-to-Field Compiler:** Implement a compiler that takes a parsed structural/deontic/computational subtree and attempts to generate the corresponding field signature (template, table, axes) according to the grammar.
- **Validation:** Check the generated fields against the actual EBA DPM field catalogue (the Field layer). Discrepancies indicate either a gap in the grammar, an error in the catalogue, or an implied rule that needs to be made explicit.
- **New Regulation Projection:** Use the grammar to project the likely field catalogue for an upcoming or proposed regulation, providing an early operational impact assessment.

**Deliverable:** A formal grammar and compiler that can reproduce the existing field catalogue from regulatory inputs, demonstrating semantic completeness.

---

### 11. Quality Layer: The Annotation Truthiness

**Goal:** Record the creation metadata for every annotation across all layers to enable trust and iterative improvement.

**Dependencies:** All layers (this is a cross-cutting log, implemented as a set of metadata fields on every annotation node).

**Tasks:**

- **Annotator Identity Schema:** Define a schema for annotator info: `source_type` (Human, Model_v1, Hybrid), `annotator_id`, `timestamp`.
- **Confidence & Agreement:** For ML predictions, store confidence score. For human annotations, track inter-annotator agreement metrics (Cohen's Kappa) for randomly sampled dual-annotated items.
- **Dispute & Resolution Workflow:** Build a light workflow where annotations can be flagged as "disputed" with a linked discussion thread, and resolved as "confirmed" or "corrected".
- **Model Lineage:** When a model contributes, store the exact model version, training dataset version, and prompt (if LLM).
- **Dashboard:** Expose a quality dashboard showing agreement rates, model confidence distributions, and a sampling of disputes for continuous review.

**Deliverable:** Every edge, node, or tag in the entire regulatory graph carries a complete and transparent quality record, enabling a feedback loop for humans and models alike.

---

## The Integration: Keeping Layers Orthogonal

The final discipline is the API and query layer that keeps all these stacks distinct but seamlessly joinable. A "flat" schema would collapse deontic, computational, and field into one row. Instead, we build a hypergraph where:

- A **structural node** (Article 415a) points to a **deontic node** (an obligation).
- That **deontic node** points to a **field node** (reporting cell).
- That **field node** points to a **computational node** (AST formula) and a **semantic node** (the concept it measures).
- All are linked to **temporal** versions and carry **provenance** stamps.

By developing each layer as an independent but connected module, you can answer "Why does this cell exist?", "What would change if a haircut moves by 10bps?", and "Where do two regulations disagree?" — all by navigating the explicit joins, never by reverse-engineering a flat monolith.
