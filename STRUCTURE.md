### Layer 1: Structural Layer

- **Description:** Parses raw regulatory documents into a canonical tree of titled sections, articles, paragraphs, and annexes (including table cell coordinates). Adds explicit cross-reference edges.
- **Purpose:** Provides the unique addressable backbone that every other layer anchors to.
- **Target:** Any regulation in EUR-Lex XML, national gazette PDF, or HTML.
- **Required input:** Source document file(s) (XML, PDF, HTML).
- **Output:** Canonical JSON with nodes (`id`, `type`, `number`, `text`, `parent`, `children`) and a cross-reference graph (`from_id`, `to_id`, `ref_type`).
- **Tech stack:** Python (`lxml`, `pdfplumber`, `camelot-py`); rule-based parsers; LLM fallback for malformed tables.

---

### Layer 2: Surface / Linguistic Layer

- **Description:** Tokenisation, sentence splitting, POS tagging, lemmatisation, NER, and multilingual alignment into language-agnostic concept IDs.
- **Purpose:** Turns raw text into linguistically annotated data, aligned across languages for concept normalisation.
- **Target:** Text of every structural node in all required languages.
- **Required input:** Canonical JSON from Layer 1.
- **Output:** Per-node token arrays with lemma, POS, NER tags; sentence list; multilingual concept cluster IDs.
- **Tech stack:** `spaCy` / `Stanza` for NLP; Hugging Face transformers for NER; `LaBSE` for alignment; Python.

---

### Layer 3: Deontic / Modal Layer

- **Description:** Classifies every sentence by legal mood: obligation, prohibition, permission, definition, condition, exception, delegation.
- **Purpose:** Isolates the prescriptive force of the text – the atomic units of compliance.
- **Target:** All sentences in the regulation.
- **Required input:** Sentences from Layer 2 (per structural node).
- **Output:** JSON array: `{sentence_id, category, scoped_object, confidence}`.
- **Tech stack:** LLM agent (GPT‑4 / Claude) with specific classification prompt; rule-based high-precision regex for obvious patterns; Python wrapper.

---

### Layer 4: Semantic / Ontological Layer

- **Description:** Builds a typed concept graph (classes, instances, relations) from definitions and terms.
- **Purpose:** Models the “meaning” of regulatory concepts and their properties, enabling reasoning across texts.
- **Target:** All defined terms, asset/liability classes, counterparty types, and their relationships.
- **Required input:** Layer 1 (structural), Layer 2 (NER), Layer 3 (definition tags).
- **Output:** RDF/JSON graph: nodes with `concept_id`, `term`, `definition`; edges with `relation` (e.g., `is_a`, `has_haircut`, `subject_to_cap`).
- **Tech stack:** LLM agent with ontology extraction prompt; `rdflib` for RDF generation; stored in GraphDB/Neo4j.

---

### Layer 5: Computational Layer

- **Description:** Extracts numeric parameters, formulas, and conditional logic, and represents them as executable ASTs.
- **Purpose:** Makes the regulation computable – a parameter change can be traced through all calculations.
- **Target:** All quantitative rules (haircuts, rates, caps, formulae).
- **Required input:** Layer 1 (text), Layer 3 (conditions), Layer 4 (concept IDs).
- **Output:** JSON AST library (`{formula_id, AST, inputs, output, concept_refs}`).
- **Tech stack:** LLM agent for extraction; custom Python AST builder; rule engine (e.g., `durable_rules` or simple interpreter).

---

### Layer 6: Field Layer (Reporting Binding)

- **Description:** Maps every reporting template cell to its legal mandate, concept, formula, and aggregation structure.
- **Purpose:** Closes the gap between legal obligation and the numbers on a supervisory report.
- **Target:** All cells of the relevant reporting templates (COREP, LCR, NSFR, etc.).
- **Required input:** Template structure (from Layer 1 tables); obligations (Layer 3); concepts (Layer 4); formulas (Layer 5); external DPM taxonomy file.
- **Output:** Field catalogue JSON: `{cell_id, legal_basis, concept_id, formula_id, aggregation_parent, validations}`.
- **Tech stack:** LLM agent with mapping prompt; Python for DPM parsing; output to graph store.

---

### Layer 7: Cross-Regulation Layer

- **Description:** Links equivalent concepts across regulations and registers definitional conflicts.
- **Purpose:** Enables holistic queries (“show me all rules on retail deposits”) and flags divergence risk.
- **Target:** All concepts from two or more populated ontologies.
- **Required input:** Two or more ontology graphs (Layer 4) and structural cross‑references.
- **Output:** Alignment pairs (`conceptA, conceptB, relation_type, conflict_flag`) and conflict register.
- **Tech stack:** LLM agent for alignment; vector similarity as pre-filter; Python to write back links to the graph.

---

### Layer 8: Temporal / Version Layer

- **Description:** Attaches effective dates, application dates, and transitional periods to every node and edge; handles amendment deltas.
- **Purpose:** Enables point‑in‑time queries: “What was the rule on date X?”
- **Target:** Entire annotated corpus.
- **Required input:** Amendment acts’ metadata (EUR-Lex), base regulation timeline.
- **Output:** All nodes/edges stamped with `valid_from`, `valid_to`; API that filters by date.
- **Tech stack:** Python for date parsing and delta application; graph DB with temporal properties; no AI needed.

---

### Layer 9: Provenance / Authority Layer

- **Description:** Tags every annotation with its source document’s authority level (Level 1–3, national, Q&A).
- **Purpose:** Lets users filter by regulatory force and understand the origin of every extracted fact.
- **Target:** All annotations from Layers 1–7.
- **Required input:** Document metadata (regulation type).
- **Output:** `authority_level` property on every annotation node.
- **Tech stack:** Config‑based auto‑tagging; no AI needed.

---

### Layer 10: Generative / Production Layer

- **Description:** Induces grammar rules from the mined pattern “legal obligation → reporting field” to auto‑generate field catalogues for new regulations.
- **Purpose:** Validates completeness and projects reporting requirements for proposed regulations.
- **Target:** The entire field catalogue of an existing regulation.
- **Required input:** Pairs of (obligation text, field signature) from Layers 3 and 6.
- **Output:** Formal production rules; a compiler that generates field signatures from text.
- **Tech stack:** LLM for pattern induction; custom Python compiler; validation against actual DPM.

---

### Layer 11: Quality Layer

- **Description:** Records annotator identity, confidence, inter‑annotator agreement, and dispute logs for every annotation.
- **Purpose:** Enables continuous trust and improvement – users know what was human‑validated vs. model‑predicted.
- **Target:** Every annotation produced by Agents 3–7 and 10.
- **Required input:** Annotation events, human corrections from validation UI.
- **Output:** Metadata fields (`annotator_type`, `confidence`, `validation_status`) on all annotations; dashboard metrics.
- **Tech stack:** Metadata schema in DB; Streamlit/Grafana dashboard; feedback logging API.
