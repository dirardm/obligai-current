# ObligaI: Implementation Plan
## Layers 8–11 + Platform Infrastructure

This plan describes how to build Layers 8–11 (cross-cutting infrastructure) and the backend/frontend integration needed to deploy the knowledge extracted in Layers 1–7 as a working compliance platform.

**The transition:** Layers 1–7 produce knowledge artifacts (obligations, ontologies, tensions). Layers 8–11 + platform infrastructure enable those artifacts to be stored, versioned, queried, and acted upon.

---

## Layer 8: Temporal / Version Layer
### Point-in-Time Regulatory Knowledge

**What it is:** Regulatory frameworks change over time. CRR is amended by CRR II, which is amended by CRR III. Obligations become effective on different dates. Requirements change.

The temporal layer enables: "Show me the regulatory state on 2023-06-01" or "What changed in LCR between 2023 and 2024?"

**What you build:**

1. **Version tracking** for all artifacts from Layers 1–7
   - Regulations: version 1.0, 2.0, 3.0 with effective_from, effective_to dates
   - Structural nodes: which version of the regulation is this article in?
   - Obligations: which regulation version does this obligation apply to?
   - Ontology concepts: when was this definition introduced? Changed?
   - Formulas: when did this haircut change from 15% to 20%?

2. **Amendment delta processing**
   - When CRR II amends CRR I, extract: which articles changed, how?
   - Represent changes as: insert, delete, replace operations on the structural tree
   - Propagate changes to obligations: if Article X changes, which obligations are affected?

3. **Temporal query API**
   - `GET /api/obligations?regulation=lcr&date=2023-06-01` → obligations as of that date
   - `GET /api/regulations/lcr/history` → timeline of changes
   - `GET /api/obligations/{id}/versions` → all versions of this obligation
   - Support point-in-time snapshots across all 7 layers

4. **UI enhancements**
   - Date picker in scope control: "Show me obligations as of [date]"
   - Timeline view: "This obligation became effective 2023-01-01, amended 2024-06-15"
   - Change highlight: "This article changed in CRR II: [before] → [after]"
   - Audit trail: "Obligation last updated 2024-02-28 due to amendment X"

**Output (Temporal Obligations):**
- All artifacts versioned with effective_from, effective_to dates
- Amendment deltas: structured change logs
- Temporal API: queryable at any point in time
- Change history: what changed and when

**Why it matters:** Compliance is time-dependent. A control that satisfied requirements on 2023-06-01 may not satisfy them on 2024-07-01 if regulations changed. Temporal tracking enables gap analysis and compliance planning.

---

## Layer 9: Provenance / Authority Layer
### Tracking Regulatory Source Tier

**What it is:** Not all regulatory sources have equal force. A Level 1 Regulation (CRR) is binding. A Level 2 Delegated Act is binding but narrower. A Level 3 Guideline (EBA guidance) is not binding but expected. National transpositions vary.

The provenance layer tracks: where did this obligation come from, and how much weight should it carry?

**What you build:**

1. **Authority taxonomy** for regulatory sources
   - Level 1: EU Regulations and Directives (CRR, CRD, BRRD)
   - Level 2: Delegated Acts, Implementing Technical Standards (ITS), Regulatory Technical Standards (RTS)
   - Level 3: EBA Guidelines, ECB Decisions, Q&As
   - National: Transpositions, national additions, regulatory decisions
   - Opinions: EBA opinions, central bank views (informative, not binding)

2. **Auto-tagging on ingestion**
   - When a document is ingested, tag all its content and derived annotations with authority level
   - Example: "This obligation comes from CRR Art. 415a (Level 1, binding)"
   - Example: "This clarification comes from EBA Q&A 2023-04 (Level 3, guidance)"

3. **Derived annotation provenance**
   - When an obligation is extracted by ML model, record: which source articles were used?
   - Were sources Level 1, Level 2, or Level 3?
   - Confidence: "This obligation is derived from Level 1 sources (high confidence)" vs. "This obligation inferred from Level 3 guidance (lower confidence)"

4. **UI visualizations**
   - Obligation detail: show authority level badge (Level 1 | Level 2 | Level 3 | National | Opinion)
   - Filter by authority: "Show only Level 1 binding obligations"
   - Risk indicator: "This obligation has mixed provenance: Level 1 main requirement, Level 3 clarification"

**Output (Provenance Obligations):**
- All obligations tagged with authority level
- Source tier hierarchy
- Provenance chain: which sources support each obligation
- Confidence scoring based on source tier

**Why it matters:** Compliance teams need to know which obligations are binding vs. guidance. A regulation change affects Level 1 obligations immediately; a guidance change affects Level 3 obligations optionally. Provenance enables risk-weighted compliance prioritization.

---

## Layer 10: Generative / Production Layer
### Learning Obligation Grammar

**What it is:** After extracting 3,600+ obligations across LCR, NSFR, ALMM, and regional variants, patterns emerge. Most reporting obligations follow: "[Entity] shall report [measure] broken down by [dimensions]." Classification obligations follow: "[Asset type] with [property condition] is subject to [treatment]." The generative layer formalizes these patterns into production rules that can validate existing obligations and project future ones.

**What you build:**

1. **Grammar rule extraction**
   - Mine 3,600+ extracted obligations for recurrent syntactic/semantic patterns
   - Represent rules as context-free grammar (CFG) with semantic actions:
     ```
     ReportingObligation ::= 
       Entity ("shall" | "must") "report" Measure 
       ["broken down by" Dimensions]
       [TimeFrequency] [ApplicableCondition]
       -> Obligation(type: reporting, subject: Entity, action: report, 
                     object: Measure, scopes: Dimensions, frequency: TimeFrequency)
     
     ClassificationObligation ::= 
       AssetClass [with Condition] "shall be" Classification ["for purposes of" Context]
       -> Obligation(type: classification, subject: AssetClass, condition: Condition,
                     object: Classification, purpose: Context)
     
     ComputationObligation ::=
       "The" Measure "shall be calculated as" Formula ["as of" ReportingDate]
       -> Obligation(type: computation, subject: Measure, object: Formula, date: ReportingDate)
     
     ConditionalObligation ::=
       "Where" Condition "," MainObligation "otherwise" AlternativeObligation
       -> Obligation(type: conditional, condition: Condition, 
                     obligation_true: MainObligation, obligation_false: AlternativeObligation)
     ```
   - Target: extract 50–80 production rules covering 85%+ of obligation corpus
   - Represent in EBNF + semantic annotation layer (not just syntactic)

2. **Obligation compiler**
   - Parser that takes deontic structure (from Layer 3) and semantic grounding (from Layer 4)
   - Matches against production rules using:
     - Syntactic match: does sentence structure match rule?
     - Semantic match: do extracted concepts match rule preconditions?
     - Confidence scoring: how strongly does this obligation match this rule? (0–1)
   - Output: for each extracted obligation, which rules it satisfies + confidence
   - False negative detection: which rules are never satisfied? (indicates gaps or missing obligations)

3. **Completeness validation**
   - For each regulation, generate the **expected set of obligations** according to grammar
     - Example: "If regulation defines 5 asset classes and 3 regulatory treatments, and ClassificationObligation rule requires asset × treatment binding, then expect 15 classification obligations"
   - Compare expected vs. extracted:
     - Covered (>80% confidence): obligation extracted and validated
     - Partially covered (40–80% confidence): obligation extracted but low confidence
     - Missing: obligation predicted but never extracted
     - Over-extracted: obligation extracted but doesn't match any rule (possible noise)
   - Generate completeness report: "LCR has 97% rule coverage, ALMM has 78%, NSFR has 94%"

4. **Impact projection for new regulations**
   - Input: draft regulation text (as structural + deontic layers)
   - Process: apply all 50–80 production rules
   - Output: 
     - Predicted obligation count per type (reporting, classification, computation, conditional)
     - Predicted field bindings (which reporting cells will be affected)
     - Predicted concept additions (new ontology nodes required)
     - Effort estimate: "This regulation will require 120 new obligations, 45 new concepts, 200 new field bindings"
   - Validation: confidence intervals (e.g., "120 obligations ± 30, 95% confidence")

**Output (Generative Artifacts):**
- Grammar rules (50–80 production rules in EBNF + semantic layer)
- Rule registry: which rules match which obligation types, coverage statistics
- Obligation compiler: can parse and validate any obligation against rules
- Completeness matrix: per regulation, % of expected obligations captured
- Impact projections: for draft regulations, estimates of obligation/concept/field count

**Why it matters:**
- Validation: identifies 5–15% of extracted obligations as low-confidence or mismatched, triggering human review
- Completeness: detects gaps (missing obligations) with 80%+ precision
- Forward-looking: estimates impact of regulatory changes before they're finalized
- Efficiency: new regulations can be processed top-to-bottom in 2–3 weeks vs. manual extraction taking 8+ weeks

---

## Layer 11: Quality / Feedback Layer
### Continuous Improvement of Obligations

**What it is:** Not all extracted obligations are correct. Not all ML model predictions are accurate. The quality layer tracks:
- Which obligations were validated by humans?
- Which are still marked uncertain?
- What feedback loops exist for improvement?

The quality layer enables continuous refinement of the knowledge base.

**What you build:**

1. **Annotation metadata**
   - For each obligation, record:
     - `source_type`: Human | ML_Model_v1 | ML_Model_v2 | Hybrid
     - `annotator_id`: who created/validated this?
     - `timestamp`: when?
     - `confidence`: high | medium | low
     - `validation_status`: validated | needs_review | disputed | rejected
     - `notes`: any context or caveats?

2. **Inter-annotator agreement tracking**
   - When multiple annotators extract the same obligation, how much do they agree?
   - Cohen's Kappa score per obligation type
   - Identify dispute patterns: "Deontic classification has 0.72 agreement; conditional extraction has 0.58"

3. **Dispute resolution workflow**
   - Users can flag obligations as disputed: "This obligation seems wrong"
   - UI collects: what's the issue? What's the correct interpretation?
   - Domain expert adjudicates: confirmed, corrected, or rejected
   - Feedback updates ML model training data

4. **Model retraining loop**
   - Periodically: take all validated/corrected obligations from Layers 3–7
   - Retrain ML classifiers and extractors
   - Measure accuracy improvement
   - Track: "Model v1 achieved 78% F1; Model v2 achieved 82% F1"

5. **Quality dashboard**
   - Metrics: what % of obligations have been validated?
   - Agreement rates: inter-annotator agreement by obligation type
   - Model performance: accuracy on test sets
   - Dispute trends: which obligation types are most disputed?
   - User feedback volume and patterns

**Output (Quality Obligations):**
- Metadata on all obligations (source, confidence, validation status)
- Inter-annotator agreement metrics
- Dispute log with resolutions
- Model performance tracking
- Quality metrics dashboard

**Why it matters:** Without quality tracking, you don't know if your system is improving or degrading. With it, you can confidently use ML predictions, validate systematically, and improve continuously.

---

## Platform Infrastructure
### Backend + Frontend Integration

**What you build:**

### Authentication & Authorisation Layer

**Purpose:** Restrict write operations and sensitive views to authorized roles

**Schema:**

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role_id TEXT REFERENCES roles(id),
  organization_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT, -- Viewer, Analyst, Validator, Admin
  permissions JSONB, -- {read_obligations: true, validate_obligations: false, ...}
  created_at TIMESTAMP
);

CREATE TABLE role_permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT REFERENCES roles(id),
  permission TEXT, -- read_obligations, validate_obligations, update_obligation_status, dispute_obligation, approve_tension, access_quality_dashboard, manage_users
  created_at TIMESTAMP
);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT, -- PUT /api/obligations/{id}, POST /api/obligations/{id}/dispute, etc.
  artifact_type TEXT,
  artifact_id TEXT,
  before_state JSONB, -- for updates
  after_state JSONB, -- for updates
  ip_address TEXT,
  timestamp TIMESTAMP
);
```

**Role definitions:**

| Role | Can Read | Can Validate | Can Dispute | Can Approve Tensions | Can Manage |
|------|----------|--------------|-------------|----------------------|------------|
| Viewer | ✓ | ✗ | ✗ | ✗ | ✗ |
| Analyst | ✓ | ✓ | ✓ | ✗ | ✗ |
| Validator | ✓ | ✓ | ✓ | ✓ | ✗ |
| Admin | ✓ | ✓ | ✓ | ✓ | ✓ |

**Authorization enforcement:**

- `PUT /api/obligations/{id}/validate` → requires Analyst+ role + annotation_metadata authorship
- `POST /api/obligations/{id}/dispute` → requires Analyst+ role; creates audit log
- `DELETE /api/tensions/{id}` → requires Validator+ role
- All write operations are audited; audit log is immutable

---

### Database Layer

**Purpose:** Persist all artifacts from Layers 1–11

**Schema (simplified):**

```sql
-- Layer 1: Structural
CREATE TABLE structural_nodes (
  id TEXT PRIMARY KEY,
  regulation_id TEXT,
  node_type TEXT, -- article, paragraph, point, table, cell
  text TEXT,
  parent_id TEXT,
  cross_refs JSONB, -- [{to_node_id, ref_type}]
  effective_from DATE,
  effective_to DATE,
  version INT
);

-- Layer 3: Deontic
CREATE TABLE obligations (
  id TEXT PRIMARY KEY,
  regulation_id TEXT,
  source_node_id TEXT REFERENCES structural_nodes(id),
  deontic_type TEXT, -- obligation, prohibition, permission, definition, condition, exception, delegation
  subject TEXT,
  action TEXT,
  object TEXT,
  condition TEXT,
  temporal TEXT,
  summary TEXT,
  status TEXT, -- active, implementing, pending, inactive, conflicted
  completeness INT, -- 0-100
  assigned_to TEXT,
  deadline DATE,
  effective_from DATE,
  effective_to DATE,
  version INT,
  confidence TEXT -- high, medium, low
);

-- Layer 4: Semantic
CREATE TABLE concepts (
  id TEXT PRIMARY KEY,
  regulation_id TEXT,
  term TEXT,
  definition TEXT,
  source_node_id TEXT REFERENCES structural_nodes(id),
  properties JSONB, -- {haircut: 0.10, concentration_limit: 0.25}
  effective_from DATE,
  effective_to DATE,
  version INT
);

CREATE TABLE concept_relationships (
  id TEXT PRIMARY KEY,
  from_concept_id TEXT REFERENCES concepts(id),
  to_concept_id TEXT REFERENCES concepts(id),
  relationship_type TEXT, -- is_a, part_of, subject_to, contradicts, equivalent_to
  weight FLOAT
);

-- Layer 5: Computational
CREATE TABLE formulas (
  id TEXT PRIMARY KEY,
  regulation_id TEXT,
  formula_name TEXT,
  ast JSONB, -- abstract syntax tree
  inputs JSONB, -- [{name, type}]
  output JSONB, -- {name, type}
  source_node_id TEXT REFERENCES structural_nodes(id),
  effective_from DATE,
  effective_to DATE,
  version INT
);

-- Layer 6: Field
CREATE TABLE fields (
  id TEXT PRIMARY KEY,
  template_id TEXT,
  cell_id TEXT,
  definition TEXT,
  obligation_id TEXT REFERENCES obligations(id),
  concept_id TEXT REFERENCES concepts(id),
  formula_id TEXT REFERENCES formulas(id),
  validation_rules JSONB,
  aggregation_parent_id TEXT REFERENCES fields(id),
  effective_from DATE,
  effective_to DATE
);

-- Layer 7: Cross-Regulation
CREATE TABLE concept_alignments (
  id TEXT PRIMARY KEY,
  concept_a_id TEXT REFERENCES concepts(id),
  concept_b_id TEXT REFERENCES concepts(id),
  alignment_type TEXT, -- same_as, close_match, narrower, broader, contradicts
  notes TEXT,
  validated_by TEXT,
  validated_at TIMESTAMP
);

CREATE TABLE tensions (
  id TEXT PRIMARY KEY,
  obligation_a_id TEXT REFERENCES obligations(id),
  obligation_b_id TEXT REFERENCES obligations(id),
  tension_type TEXT, -- reporting_conflict, definitional_conflict, temporal_conflict, computational_conflict
  severity TEXT, -- critical, high, medium, low
  description TEXT,
  inferred_obligation TEXT,
  extracted_at TIMESTAMP,
  validated BOOLEAN,
  validated_by TEXT
);

-- Layer 8: Temporal
-- (effective_from, effective_to, version on all tables above)

-- Layer 9: Provenance
CREATE TABLE provenance (
  id TEXT PRIMARY KEY,
  artifact_id TEXT, -- obligation_id, concept_id, formula_id, etc.
  artifact_type TEXT, -- obligation, concept, formula, field, tension
  authority_level TEXT, -- Level1, Level2, Level3, National, Opinion
  source_articles JSONB, -- [{regulation, article, paragraph}]
  confidence TEXT, -- high, medium, low
  notes TEXT
);

-- Layer 10: Generative
CREATE TABLE grammar_rules (
  id TEXT PRIMARY KEY,
  rule_type TEXT, -- reporting, classification, computation, conditional, definition, exception
  ebnf_definition TEXT, -- formal grammar rule
  semantic_template JSONB, -- {type, properties, required_fields}
  coverage_count INT, -- how many obligations match this rule
  coverage_percentage FLOAT, -- % of obligation corpus matching this rule
  confidence_threshold FLOAT, -- minimum match confidence to apply rule (0.0-1.0)
  created_at TIMESTAMP,
  validated_by TEXT,
  validated_at TIMESTAMP
);

CREATE TABLE obligation_completeness_gaps (
  id TEXT PRIMARY KEY,
  regulation_id TEXT,
  rule_id TEXT REFERENCES grammar_rules(id),
  expected_obligation_signature JSONB, -- what obligation should exist per rule
  found BOOLEAN, -- was a matching obligation found?
  closest_match_obligation_id TEXT REFERENCES obligations(id), -- if partial match
  match_confidence FLOAT, -- how close is closest match?
  gap_description TEXT, -- why is this expected but not found?
  severity TEXT, -- critical, high, medium, low
  identified_at TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE TABLE grammar_projections (
  id TEXT PRIMARY KEY,
  source_regulation_id TEXT,
  target_regulation_id TEXT, -- if null, projection for proposed regulation
  projected_obligation_count INT,
  projected_obligation_breakdown JSONB, -- {reporting: 150, classification: 80, computation: 45}
  projected_concept_additions INT,
  projected_field_count INT,
  confidence_interval_lower INT,
  confidence_interval_upper INT,
  effort_estimate_weeks INT,
  created_at TIMESTAMP,
  validated BOOLEAN
);

-- Layer 11: Quality
CREATE TABLE annotation_metadata (
  id TEXT PRIMARY KEY,
  artifact_id TEXT,
  artifact_type TEXT,
  source_type TEXT, -- Human, ML_Model_v1, Hybrid
  annotator_id TEXT,
  timestamp TIMESTAMP,
  confidence TEXT,
  validation_status TEXT, -- validated, needs_review, disputed, rejected
  notes TEXT
);

CREATE TABLE disputes (
  id TEXT PRIMARY KEY,
  artifact_id TEXT,
  artifact_type TEXT,
  issue_description TEXT,
  raised_by TEXT,
  raised_at TIMESTAMP,
  adjudication TEXT,
  adjudicated_by TEXT,
  adjudicated_at TIMESTAMP
);
```

---

### API Layer

**Purpose:** Serve all layers to the UI and external consumers

**Endpoints:**

```
GET /api/regulations
  → List all regulations with versions, effective dates

GET /api/regulations/{regulation_id}/obligations
  → List obligations for regulation, with filters:
    ?date=2023-06-01 (as of date)
    ?status=active (filter by status)
    ?assigned_to=user_id (filter by owner)
    → Returns: {id, citation, summary, status, completeness, deadline, assigned_to}

GET /api/obligations/{obligation_id}
  → Full obligation detail with lineage:
    {
      id, regulation_id, deontic_type, subject, action, object, condition, temporal,
      source_node (article, paragraph, text),
      semantic_grounding {concept_id, concept_term, concept_definition},
      computation {formula_id, formula_ast, inputs, output},
      field_binding {field_ids[], validation_rules},
      tensions {conflicting_obligation_ids[], descriptions[]},
      provenance {authority_level, confidence, source_articles},
      quality {validation_status, annotator, confidence, notes}
    }

GET /api/concepts
  → List all concepts in ontology with properties

GET /api/concepts/{concept_id}
  → Concept detail with relationships and uses:
    {
      id, term, definition, source_node,
      relationships [{type, target_concept_id}],
      used_in_obligations [{obligation_id}],
      used_in_formulas [{formula_id}],
      used_in_fields [{field_id}],
      cross_regulation_mappings [{regulation, equivalent_concept, alignment_type}]
    }

GET /api/tensions
  → List tensions in scope:
    ?regulation=lcr&regulation=nsfr (multi-regulation)
    ?severity=critical (filter by severity)
    → Returns: {id, obligation_a, obligation_b, type, severity, description}

GET /api/tensions/{tension_id}
  → Tension detail:
    {
      id, obligation_a_detail, obligation_b_detail,
      type, severity, description,
      inferred_obligation,
      root_cause (concept divergence? threshold difference? formula difference?),
      resolution_paths [{option, description, effort}]
    }

GET /api/fields
  → List reporting fields with lineage:
    ?template=COREP_C_10_00 (filter by template)
    → Returns: {id, definition, obligation_id, concept_id, formula_id}

GET /api/fields/{field_id}
  → Field detail with full lineage to regulatory source

GET /api/changes
  → List recent changes across all artifacts:
    ?regulation=lcr (filter by regulation)
    ?since=2024-01-01 (changes since date)
    → Returns: {artifact_type, artifact_id, change_type, before, after, changed_at, changed_by}

GET /api/quality/metrics
  → System quality metrics:
    {
      total_obligations: 3600,
      validated_obligations: 2800,
      validation_rate: 78%,
      inter_annotator_agreement: {obligation: 0.82, prohibition: 0.75, definition: 0.88},
      disputes: {open: 23, resolved: 180},
      model_performance: {v1_f1: 0.78, v2_f1: 0.82}
    }

POST /api/obligations/{obligation_id}/dispute
  → Flag obligation as disputed with feedback

PUT /api/obligations/{obligation_id}/validate
  → Mark obligation as validated with metadata

GET /api/graph
  → Return tension graph for visualization:
    {
      nodes: [{id, obligation_id, citation, status, degree}],
      edges: [{source, target, type, severity, description}]
    }
```

---

### Search & Query Engine

**Purpose:** Enable compliance officers to find obligations by meaning, not just structure

**Embedding infrastructure:**

**Model selection:**
- Base model: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (384-dimensional embeddings, multilingual, ~150ms latency per 512 tokens)
- Fallback: `sentence-transformers/all-MiniLM-L6-v2` if multilingual not needed (faster, 8% lower quality)
- Deployment: run as microservice (Flask + gunicorn) on GPU-backed instance; cache embeddings in PostgreSQL pgvector extension

**Embedding sync strategy:**
- When obligation created/updated: synchronously generate embedding + store in `obligations.embedding` vector column
- When concept updated: regenerate all obligation embeddings that reference that concept (async, daily batch)
- Embedding version: track which model version created each embedding; re-embed on model upgrade (one-time 30-min batch job per 3,600 obligations)

**Query types & implementation:**

```
1. Full-text search: "Find all obligations mentioning 'retail deposit'"
   SQL: SELECT * FROM obligations 
        WHERE to_tsvector('english', summary) @@ plainto_tsquery('english', 'retail deposit')
   Returns: obligations matching any form of the term
   Latency: <100ms (indexed)

2. Semantic search: "Find obligations about liquidity coverage"
   Process:
   a) Embed query: query_embedding = embed_model("liquidity coverage")
   b) Vector similarity: SELECT * FROM obligations 
                        ORDER BY embedding <-> query_embedding 
                        LIMIT 20
   c) Rank by relevance (cosine similarity score)
   Returns: LCR + NSFR + ALMM liquidity-related obligations, sorted by relevance
   Latency: <500ms (pgvector similarity search on indexed vectors)

3. Concept-based search: "Find all obligations using concept C_12345"
   SQL: SELECT DISTINCT o.* FROM obligations o
        JOIN obligation_concept_grounding ocg ON o.id = ocg.obligation_id
        WHERE ocg.concept_id = 'C_12345'
   Returns: all obligations grounded in that concept across all regulations
   Latency: <50ms (indexed join)

4. Tension search: "Find conflicts between LCR and NSFR"
   SQL: SELECT * FROM tensions 
        WHERE (obligation_a_id IN (SELECT id FROM obligations WHERE regulation_id = 'lcr')
          AND obligation_b_id IN (SELECT id FROM obligations WHERE regulation_id = 'nsfr'))
          OR (obligation_a_id IN (SELECT id FROM obligations WHERE regulation_id = 'nsfr')
          AND obligation_b_id IN (SELECT id FROM obligations WHERE regulation_id = 'lcr'))
   Returns: all tensions involving both regulations
   Latency: <200ms (indexed)

5. Time-travel: "Show me LCR obligations as of 2023-06-01"
   SQL: SELECT * FROM obligations 
        WHERE regulation_id = 'lcr' 
          AND effective_from <= '2023-06-01' 
          AND (effective_to IS NULL OR effective_to > '2023-06-01')
        ORDER BY effective_from DESC
   Returns: obligations as they existed on that date (with version info)
   Latency: <100ms (indexed on effective_from, effective_to)

6. Impact search: "If we change the haircut from 15% to 20%, which obligations are affected?"
   Process:
   a) Find parameter in formulas: SELECT f.* FROM formulas f 
                                  WHERE f.ast::text LIKE '%haircut%15%'
   b) Find obligations using formula: SELECT o.* FROM obligations o
                                      JOIN obligation_formula_binding ofb ON o.id = ofb.obligation_id
                                      WHERE ofb.formula_id IN (SELECT id FROM step_a)
   c) Find fields using those obligations: SELECT f.* FROM fields f
                                          WHERE f.obligation_id IN (SELECT id FROM step_b)
   d) Return: obligations affected + fields affected + estimation of change propagation
   Returns: map showing impact chain: formula → obligations → fields affected
   Latency: <500ms (requires AST traversal + multiple joins)
```

**Indexing strategy:**

- Full-text: index on `obligations.summary` (GIN index)
- Vector: pgvector index on `obligations.embedding` (IVFFlat or HNSW, depends on dataset size; tune at 5k+ obligations)
- Temporal: index on `(regulation_id, effective_from, effective_to)`
- Foreign key: indexes on `obligation_id`, `concept_id`, `formula_id` (auto-created)
- Custom: composite index on `(regulation_id, deontic_type, status)` for dashboard filtering

**Query performance targets:**

- Full-text: <100ms for any query
- Semantic: <500ms for any query (governed by embedding lookup + vector similarity search)
- Temporal: <100ms
- Impact: <1000ms (AST traversal is expensive; acceptable as async operation)
- Concurrent users: 50+ simultaneous queries without degradation

---

### ML Model Infrastructure

**Purpose:** Host, version, retrain, and serve ML models from Layers 2–4 and 10

**Models in production:**

| Model | Purpose | Base | Input | Output | Latency Target | Batch / Realtime |
|-------|---------|------|-------|--------|-----------------|------------------|
| NER | Entity extraction (Layer 2) | distilbert | sentence (512 tokens) | BIO tags per token | 50ms | batch |
| Deontic Classifier | Obligation type (Layer 3) | distilbert | sentence (512 tokens) | 8-class softmax + BIO spans | 20ms | batch |
| Concept Grounding (Layer 4) | Link obligation to concepts | sentence-transformers | obligation text (100–300 tokens) | top-5 concept candidates | 100ms | realtime or batch |
| Grammar Matcher (Layer 10) | Match obligation to rule | custom | deontic + semantic structure | rule_id + confidence_score | 10ms | batch |

**Hosting strategy:**

- **Batch models** (NER, Deontic, Grammar Matcher): Run offline as scheduled jobs
  - Input: new/updated obligations from database
  - Process: inference on 100 obligations per batch (GPU cluster, ~2 minutes per batch)
  - Output: predictions stored back in database + annotation_metadata record
  - Schedule: daily at 02:00 UTC (low-traffic window)
  - Cost: 1 GPU (4–8 GPU-hours/day) = ~$20/day ($600/month)

- **Realtime model** (Concept Grounding): Deploy as microservice (on-demand inference)
  - Host: GPU-backed container (AWS SageMaker, Replicate, or self-hosted)
  - Endpoint: POST /api/ml/ground-obligation → returns concept candidates in 100ms
  - Used by: UI when user manually creates obligation (optional grounding hint)
  - Scalability: auto-scale 2–10 replicas based on request volume
  - Cost: ~$50/day baseline + $5 per 1M inferences ($500–1000/month typical)

**Model versioning:**

```
models/
├── deontic_classifier/
│   ├── v1_20240601_f1_0.78.pt (accuracy: 78% F1, used in production until 2024-07-15)
│   ├── v2_20240715_f1_0.82.pt (accuracy: 82% F1, current production)
│   └── v3_20240815_f1_0.84.pt (staging, 95% of traffic)
├── concept_grounding/
│   └── v1_20240601_acc_0.85.pt (current)
└── ner/
    └── v2_20240715_f1_0.88.pt (current)
```

**Retraining pipeline:**

1. **Trigger:** When annotation_metadata has 500+ new validated obligations
2. **Data prep:** Extract training + validation + test sets; measure class balance; augment if needed
3. **Training:** Fine-tune base model on validated data (4 GPU-hours)
4. **Evaluation:** Measure F1 on test set; compare to previous version
5. **A/B testing:** If F1 improves >1%, stage new version (route 5% of traffic)
6. **Rollout:** If staged version performs well, promote to production (100% traffic)
7. **Fallback:** Keep previous version 2 weeks; revert if new version fails

**Model deployment (CI/CD pipeline):**

```
1. Model training (triggered by /api/ml/retrain)
   ├─ Fetch labeled data from annotation_metadata
   ├─ Train on GPU cluster
   └─ Log metrics to MLflow

2. Model evaluation
   ├─ Run on test set
   ├─ Compare to baseline
   └─ If F1 +1%: proceed to stage

3. Stage new model
   ├─ Create container image (Python + PyTorch + Flask)
   ├─ Deploy to staging environment
   └─ Route 5% of inference requests

4. Monitor staged model
   ├─ Track prediction latency, error rates
   ├─ Collect user feedback on staged predictions
   └─ If stable for 7 days: promote

5. Production rollout
   ├─ Shift 100% traffic to new model
   ├─ Keep old model as fallback (1 week)
   └─ Update version in annotation_metadata
```

**Monitoring & failure handling:**

- **Latency SLA:** <50ms p95 for batch models, <100ms p95 for realtime
- **Accuracy drift:** Monitor F1 score daily; if drops >2%, alert team
- **Availability:** model serving SLA 99.5%; failover to CPU inference (slower but always works)
- **Input data quality:** track distribution shift; if input distribution changes >10%, retrain
- **Fallback:** if model inference fails, use rule-based baseline classifier (90% recall, 70% precision)

### Frontend Integration

**Leverage existing UI components** with real data wiring:

**Dashboard**
- Stat cards: total obligations, active, conflicted, average completeness
  - Real data source: `GET /api/quality/metrics` (aggregated across selected scope)
  - Filters: respect scope control (regulation_id, jurisdiction, date, authority_level)
- Bar chart: obligations by regulation (stacked by status)
  - Real data: group `/api/obligations` by regulation_id and status
  - Interaction: click bar to drill into regulation
- Recent changes table: query `/api/changes?since=now()-7d` (last 7 days)
- Completeness summary: box plot of completion % across obligation types

**Register**
- Table pagination: 50 obligations/page; lazy-load on scroll
  - Real data: `/api/obligations?limit=50&offset=0` + filters
  - Performance: <2s first paint (API cached, client-side sorting disabled)
- Sortable columns: citation (structural node ID), summary, status, completeness, deadline
  - Sorting: done server-side (SQL ORDER BY) not client-side
- Filter sidebar:
  - Regulation multi-select: `/api/regulations`
  - Status checkboxes: obligation, prohibition, definition, exception, condition, delegation, substitution
  - Date range picker: point-in-time by effective_from/effective_to
  - Authority level: Level 1 | Level 2 | Level 3 | National | Opinion
  - Validation status: Validated | Needs Review | Disputed | Rejected
- Click row → `/api/obligations/{id}` detail view

**Obligation Detail**
- Full lineage: clickable chain showing:
  - Source article (Layer 1) → Deontic type & spans (Layer 3) → Concept grounding (Layer 4) → Formula AST (Layer 5) → Field bindings (Layer 6) → Tensions (Layer 7)
- Metadata sidebar: status, completeness (editable), assigned_to, deadline, authority_level
- Validation history: timeline of validations with annotator + confidence
- Dispute workflow: flag as disputed (POST /api/obligations/{id}/dispute); show adjudication for resolvers

**Conflicts Graph (redesigned for real data)**
- Nodes: 3,600+ obligations
  - Size: proportional to completeness
  - Color: by regulation (LCR=blue, NSFR=green, ALMM=orange, etc.)
  - Opacity: by validation status (validated=opaque, needs_review=faded)
- Edges: 50+ tensions
  - Color: by tension_type (reporting=red, definitional=orange, temporal=yellow, computational=purple)
  - Thickness: by severity (critical=5px, high=3px, medium=2px, low=1px)
- Layout: pre-computed force-directed on backend (cached in `/api/graph`); refined on client (100ms)
- Performance: initial load <3s; pan/zoom <100ms; clustering for >5,000 nodes

**Settings**
- Jurisdictions, regulations: read from `/api/regulations`
- Authority level filter: multi-select global visibility
- Date picker: point-in-time queries (default today)
- Validation status filter: toggle which statuses to display
- Theme: light/dark mode

**Quality Dashboard** (new standalone page)
- System metrics: total obligations, validated %, avg confidence, open disputes, model F1
- Validation trends: cumulative validated over time (target 80% by week 8)
- Inter-annotator agreement: heatmap by deontic_type and field (Cohen's Kappa)
- Dispute breakdown: pie chart by artifact_type, drill-in to details
- Model performance: multi-line chart (NER F1 vs Deontic F1 vs Concept Grounding accuracy across versions)
- Embedding quality: histogram of semantic search similarity scores (target >0.75 for 90%)

---

## Go-Live Checklist

### Before shipping:

**Knowledge artifacts (Layers 1–7) complete:**
- [ ] 3,000+ structural nodes parsed for 4+ regulations
- [ ] Ontology of 1,000+ concepts extracted and validated
- [ ] 3,600+ obligations extracted with 80%+ accuracy
- [ ] 50+ tensions detected and validated
- [ ] Field bindings for 40,000+ reporting cells

**Infrastructure (Layers 8–11) complete:**
- [ ] Temporal layer: versioning working, point-in-time queries functional
- [ ] Provenance layer: authority levels tagged, confidence scoring working
- [ ] Generative layer: grammar rules defined, completeness validated
- [ ] Quality layer: 80%+ of obligations validated by humans, dispute resolution workflow tested
- [ ] Database schema finalized and populated
- [ ] API endpoints tested and documented
- [ ] Search/query engine benchmarked (sub-second responses)

**Frontend integration complete:**
- [ ] API queries wired to all existing UI pages
- [ ] Dashboard shows real data (not mock)
- [ ] Register shows real obligations with filters
- [ ] Obligation detail shows full lineage
- [ ] Conflicts graph renders real tensions
- [ ] All interactive features tested (click, filter, sort, drill-in)
- [ ] Performance acceptable (page load <2s, graph render <3s)
- [ ] Mobile responsiveness verified

**Quality assurance:**
- [ ] Compliance officer UAT: "Can I find the obligations I need?"
- [ ] Tension validation: "Are the conflicts real and accurate?"
- [ ] Report generation: "Can I export compliance status?"
- [ ] Point-in-time queries: "Does the system show the right state for any date?"
- [ ] Search accuracy: semantic search returns relevant results

**Documentation:**
- [ ] API documentation: all endpoints, parameters, examples
- [ ] Data model documentation: schema and relationships
- [ ] User guide: how to navigate, filter, interpret obligations
- [ ] Compliance impact statement: which regulations are covered, coverage %, known gaps
- [ ] Quality report: validation rates, inter-annotator agreement, model accuracy

---

## Post-Launch Operations

**Week 1 (Launch Stabilization):**
- Monitor API latency (target p95 <500ms), database query times
- Collect user feedback: UI usability, search relevance, obligation accuracy
- Identify pattern of disputes: which obligation types are disputed most? (likely: conditional, computational, field bindings)
- Fix critical bugs: missing obligations, incorrect tensions, broken lineage links
- Metrics: track API uptime, search latency, user session volume

**Week 2–4 (Validation Sprint):**
- Review disputes: expected 5–10% of obligations flagged (360–360 disputes)
  - Categorize: annotation error (model mistake), missing context, correct but low confidence
  - Adjudicate: 80% validation speed (10–15 obligations/hour/validator) = ~4 validator-weeks for all disputes
- Retrain ML models:
  - Collect all validated + corrected obligations into new training set
  - Re-run deontic classifier, concept grounding, grammar matcher fine-tuning
  - Measure F1 improvement (target: +2–3% from baseline)
  - Stage new model version; measure user feedback on staged predictions
  - Promote to production if F1 improved >1%
- Metrics: validation completion rate, model F1 improvement, dispute resolution time

**Week 5–12 (Expansion to NSFR):**
- Second regulation: Net Stable Funding Ratio (NSFR, ~1,500 obligations)
  - Justification: NSFR complements LCR; many banks track both; users requested parallel coverage
  - Timeline: Weeks 5–8 to Layers 1–4 complete; Weeks 9–12 to Layers 5–7
- Annotation effort: 6,000 new sentences (2× LCR size)
  - Recruiting: 3 annotators, 6 weeks in parallel = 3 wall-clock weeks
  - Cost: ~$250k (similar to LCR annotation)
- Ontology expansion: LCR ontology ~200 concepts; NSFR adds ~150 new concepts (funding, maturity buckets, stable funding categories)
  - Mapping process: 1 week domain expert work to align NSFR concepts to LCR where applicable
  - Expected overlaps: 40% of NSFR concepts are refinements of LCR concepts (e.g., "retail deposit" → "stable retail deposit", "retail deposits without term")
- Tension detection: identify 20–30 new tensions between LCR and NSFR (e.g., maturity bucketing differences, definition divergence)

**Week 13–24 (Expansion to ALMM + Layers 5–7):**
- Third regulation: Additional Liquidity Monitoring Metrics (ALMM, ~900 obligations)
- Add Layer 5 (Computational): extract 50+ formulas from LCR + NSFR + ALMM
  - Examples: liquidity coverage ratio calculation, stable funding calculation, concentration metrics
  - Time: 2 weeks parsing + 1 week validation
- Add Layer 6 (Field): bind 40,000 COREP cells to obligations
  - 30% automatic matching (semantic), 70% manual validation
  - Cost: ~$30k for domain expert validation
- Add Layer 7 (Cross-Regulation): full ontology alignment across LCR + NSFR + ALMM
  - Expected conflicts: 50–100 (threshold mismatches, definition divergences, reporting overlaps)
  - Validation: domain experts review each conflict; mark as "resolved" or "escalated to legal"

**Week 25–36 (Quality & Scale):**
- Model retraining cycle 2: incorporate all Layers 1–7 feedback
  - Expect F1 improvement: +3–5% from v1 baseline
- Add jurisdictional variants: Peru SBS, Panama SBN, Brazil BCB
  - Each adds 50–150 obligations (aligned to EU baseline via Layer 7 framework)
  - Cost: <$50k per jurisdiction (mostly alignment, not new extraction)
- Full quality metrics by Week 28: 85%+ validation rate, <5% dispute rate, inter-annotator agreement >0.80

**Week 37–52 (Layers 8–11 Polish):**
- Layer 8 (Temporal): operationalize point-in-time queries
  - CRR I → CRR II → CRR III amendment tracking
  - Trace impact of each amendment on obligation set (which obligations changed? added? removed?)
- Layer 9 (Provenance): finalize authority level tagging
  - Audit all obligations for source tier accuracy
- Layer 10 (Generative): validate grammar rules on expanded corpus (3,600+ obligations)
  - Completeness validation: identify any obligations that don't match grammar (likely <5%)
  - Impact projection: for proposed CRR IV, estimate obligation count (should predict 1,200 ± 10%)
- Layer 11 (Quality): operationalize continuous retraining
  - Monthly retrain cycle: fetch validated data from prior month, retrain, measure accuracy, auto-promote if improved

**Ongoing (Post Week 52):**
- **Amendment monitoring:** When CRR IV published, automatically ingest + extract obligations
  - New regulation processing: Weeks 1–3 for Layers 1–4; Weeks 4–6 for Layers 5–7
  - Projected timeline: 6 weeks per new major regulation
  - Cost: ~$100k per regulation (reuse existing models, annotation for new concepts only)
- **Continuous retraining:** Monthly cycle triggered by validation_metadata growth
  - Data: all validated obligations from prior month
  - Training: 4 GPU-hours per model
  - Rollout: A/B test, auto-promote if F1 improves >1%
- **Dashboard monitoring:**
  - Validation rate: target >85%, alert if drops below 75%
  - Dispute rate: target <5%, alert if rises above 10%
  - Model F1: target trend upward, alert if any model F1 drops >2%
  - API latency: p95 <500ms; alert if exceeds 1000ms
- **User feedback loop:**
  - Monthly stakeholder calls: review quality metrics, gather feedback on obligation accuracy, request new regulations
  - Quarterly: retrain models on user-validated corrections
- **Regulatory source monitoring:**
  - Scraper health dashboard: track EUR-Lex ingestion, detect broken APIs
  - When new version of regulation published: auto-ingest, tag as "new version available", notify users to review amendments

---

## Success Criteria

**The platform is live when:**

1. **Real obligations, not mock:**
   - Dashboard shows 3,600+ real obligations, not 131 hardcoded ones
   - Each obligation links to source article and definition

2. **Real tensions, not hardcoded:**
   - Conflicts graph shows 50+ real detected tensions
   - Each tension links to the concept divergence or threshold mismatch that causes it

3. **Fully traceable:**
   - Compliance officer clicks any field in a report
   - System shows: Article → Obligation → Concept → Formula → Field
   - Full lineage back to regulatory source

4. **Interactive and responsive:**
   - Search finds obligations by meaning (not just text matching)
   - Graph renders in <3 seconds, supports zoom/pan/drag
   - Filters update results instantly
   - Scope control (jurisdiction + regulation + date) works seamlessly

5. **Continuously improving:**
   - Validation rate >80%
   - Dispute resolution workflow in use
   - ML models being retrained on validated data
   - Quality dashboard shows improvement over time

6. **Ready for scale:**
   - System handles 10,000+ obligations without slowdown
   - Can ingest new regulations and extract obligations within days
   - Ontology extensible to new concepts
   - Field bindings cover any reporting template

When all 6 are true, the prototype becomes a product.
