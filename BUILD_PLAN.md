# ObligaI: Knowledge Engineering Build Plan
## Operational Detail & Execution Strategy

This is the operational build plan. It addresses: sequencing, ML methodology, annotation sourcing, graph schema, failure modes, costs, and critical path.

---

## Executive Overview

### Dependency Map

```
Layer 1 (Structural) ────────────────────┐
                                         │
Layer 2 (Linguistic) ◄───────────────────┤
                     │                   │
                     ├─→ Layer 3 (Deontic) ◄─────────────┐
                     │                   │               │
                     └─→ Layer 4 (Semantic) ◄────────────┤
                                         │               │
                         Layer 5 (Computational) ◄───────┤
                                         │               │
                         Layer 6 (Field) ◄──────────────────┐
                                         │                  │
                         Layer 7 (Cross-Regulation) ◄───────┘

Critical Path: 1 → 2 → 3 → 4 → 6 → 7 (sequential)
Parallel tracks: 5 (computational extraction can start after Layer 2)
Blocking dependency: Layer 7 cannot start until Layers 3, 4, 6 are complete
```

### Minimum Viable Product (MVP)

Complete **Layers 1–4 for one regulation (LCR) only**:

- Parsed structural tree (200+ addressable nodes)
- Annotated deontic corpus with inter-annotator agreement validation
- Extracted obligations with 80%+ accuracy
- Ontology of concepts specific to the regulation
- Graph schema operational and queryable
- Success metric: obligations extracted with validated accuracy, inter-annotator agreement ≥0.75

**Team requirement:** Parser engineer, ML engineer, domain expert  
**Deliverable:** Proof that the approach works; ready to scale to additional regulations

### Scale-Out: Additional Regulations (Layers 1–7)

Once MVP proven, expand to full regulatory coverage:
- Add additional EU regulations (NSFR, ALMM) via Layers 1–4 (repeat pipeline for each)
- Add Layer 5 (Computational): extract formulas across all regulations
- Add Layer 6 (Field): bind reporting fields to obligations
- Add Layer 7 (Cross-Regulation): align concepts, detect tensions across regulations
- Add regional variants as applicable

**Full system scope (at completion):**
- Multiple primary EU regulations
- 1,000+ concepts in unified ontology
- 40,000+ reporting fields mapped to obligations
- Tensions detected and validated
- Multiple regulations parsed and indexed

---

## Layer 1: Structural Layer – Detailed Plan

### What You Build

**Parser for EUR-Lex XML** (primary input format)

Input: XML from EUR-Lex containing CRR regulations
Output: Addressable tree with 200+ nodes (LCR case)

**Parser development:**
- Analyze EUR-Lex XML structure; design canonical schema
- Implement parser; test on source regulation
- Validate structural tree; resolve parsing errors

**Cross-reference extraction:**
- Scan for explicit citations ("as referred to in Article X")
- Create typed edges: cites, amends, derogates_from

**Amendment tracking:**
- Identify amendment chain (base regulation → amendments)
- Model amendment deltas as insert/delete/replace operations

### Graph Schema (Neo4j)

```
Node types:
- RegulationType (id: "CRR", name: "Capital Requirements Regulation")
- StructuralNode (id: "CRR/Part_Six/Title_IV/...", type: "article|paragraph|point", text: "...", effective_from: date, effective_to: date, version: int)

Relationships:
- HAS_CHILD (from parent node to child)
- CITES (from source node to target node)
- AMENDS (from amending regulation to amended article)
- DEROGATES_FROM (exception relationships)

Properties on StructuralNode:
- id (string, unique)
- regulation_id (string, reference to regulation)
- node_type (enum: article, paragraph, point, annex, table, cell, recital)
- text (full text of the node)
- parent_id (reference to parent node)
- effective_from (date when this node became effective)
- effective_to (date when this node expired, null if current)
- version (integer, increments on amendment)

Constraints:
- StructuralNode.id must be unique
- StructuralNode.effective_from < effective_to (if effective_to is not null)
```

### ML Methodology

**This layer is not ML.** It's deterministic parsing.

- Rule-based XML parser (lxml library)
- Regex for cross-reference extraction
- Manual review for amendment deltas

**Evaluation:**
- Compare parsed tree to hand-annotated reference tree
- Target: 100% accuracy on structural boundaries (every article, paragraph correctly identified)
- Acceptable: <5% missing nodes (due to malformed XML)

### Failure Modes & Escalation

| Failure | Impact | Mitigation | Escalation |
|---------|--------|-----------|-----------|
| Malformed XML | Parser crashes | Try-catch; log errors | Domain expert reviews PDF source |
| Missing articles | Incomplete tree | Manual inspection of XML | Re-download from EUR-Lex |
| Ambiguous cross-refs | Wrong edges | Regex over-matches | Domain expert adjudicates |

---

## Layer 2: Surface / Linguistic Layer – Detailed Plan

### What You Build

**Tokenizer & Annotator Pipeline**

Input: Text from Layer 1 structural nodes  
Output: Token stream per sentence with POS, NER, lemma tags + multilingual alignments

**Process:**

Setup: Set up spaCy + Stanza pipelines
- Install pre-trained models for required languages
- Test on sample sentences from the regulation

NER fine-tuning:
- Collect regulatory entities from the regulation
- Annotate sample sentences with entities
- Fine-tune transformer-based NER model
- Evaluate precision, recall, F1 on test set

Multilingual alignment:
- For each sentence in source language, find equivalents in target languages
- Align at phrase level using embeddings
- Create concept ID mappings across languages

### Graph Schema (Neo4j)

```
Node types:
- Token (id: "sent_001_token_003", sentence_id: "sent_001", token_text: "shall", lemma: "shall", pos: "AUX", ner_tag: "O")
- Sentence (id: "sent_001", source_node_id: "CRR/Art_415a/Para_1", text: "An institution shall report its liquidity coverage ratio.", language: "en")
- Concept (id: "concept_001", term: "retail_deposit", embeddings: [0.2, -0.1, ...])

Relationships:
- HAS_TOKEN (Sentence → Token, ordered by position)
- ALIGNED_WITH (Sentence in language A → Sentence in language B)
- REFERS_TO_CONCEPT (Token → Concept, when NER identifies entity)
- SURFACE_FORM_OF (Token → Concept, via embeddings)

Properties:
- Token.token_text (string)
- Token.lemma (string)
- Token.pos (enum: NOUN, VERB, ADJ, AUX, etc.)
- Token.ner_tag (enum: O, B-ENTITY, I-ENTITY)
- Token.embedding (vector[768], from transformer)
- Sentence.embeddings (vector[768], sentence-level)
- Concept.definition (string, populated later by Layer 4)
- Concept.embedding (vector[768], aggregated from tokens)
```

### Early Validation: Token Storage at Scale

**Risk:** Neo4j graph stores individual Token nodes (500,000+ tokens × ~50 per sentence × 10,000 sentences = 5M+ nodes at scale, plus embeddings).

**Early validation (Week 2):** Test token-level graph storage on a sample (1,000 sentences, 50,000 tokens + embeddings). Measure:
- Memory footprint per token node
- Query latency for token traversals
- Total storage size

**If storage is inefficient:** Store token streams as JSONB arrays on Sentence nodes instead. Keep only concept-level nodes in graph. This trades graph queryability for storage efficiency.

**Decision gate:** If token memory >10GB for 1,000 sentences, switch to JSONB token arrays before scaling to 10,000 sentences.

**Multilingual alignment:**
- Use multilingual embeddings for semantic alignment
- Find closest matches in target languages using similarity scoring
- Manual validation: domain expert reviews sample alignments to verify accuracy
- Target: High alignment accuracy across all language pairs

### Failure Modes & Escalation

| Failure | Impact | Mitigation | Escalation |
|---------|--------|-----------|-----------|
| NER F1 <80% | Entity confusion | Retrain with more data or larger model | Upgrade to xlm-roberta; add manual annotation |
| Alignment fails | Multilingual concept map incomplete | Lower similarity threshold to 0.80 | Manual alignment by bilingual expert |
| Embedding space diverges across languages | Cross-lingual searches fail | Use mBERT instead of language-specific models | Retrain on regulatory parallel corpus |

---

## Layer 3: Deontic / Modal Layer – Detailed Plan

### Annotation Sourcing

**Task:** Hand-label sentences with deontic type and structure

**Annotation schema:**

Each sentence labeled with:
1. Deontic type: obligation | prohibition | permission | definition | condition | exception | delegation | substitution
2. Subject: who is obligated? (text span)
3. Action: what must they do? (text span)
4. Object: target of action (text span)
5. Condition: when does it apply? (text span or null)
6. Temporal: deadline or frequency (text span or null)
7. Confidence: high | medium | low

**Sourcing annotators:**

Required qualifications: 
- Legal background (law degree, bar admission, or equivalent)
- Financial regulation experience (banking, compliance, or similar)
- Fluent English

**Recruitment:**
- LinkedIn, compliance recruiting firms, law schools
- Multiple annotators (3 recommended for inter-annotator agreement validation)

**Inter-annotator agreement (Cohen's Kappa):**
- Extract random subset for dual-annotation across all annotators
- Measure agreement by annotation type:
  - Deontic type: target high agreement (>0.75)
  - Subject/action/object spans: target acceptable agreement (>0.70)
  - Temporal extraction: target high agreement (>0.80)
- If agreement low, refine guidelines and re-annotate

### Annotation Tooling

**Platform:** Prodigy (label-studio alternative: open-source but slower)

**Interface:**
- Display sentence in context (full article)
- Dropdown for deontic type
- Span selection for subject, action, object, condition, temporal
- Confidence rating (radio buttons)
- Notes field (for edge cases)

**Workflow:**
- Week 1: 500 sentences (dual-annotated, all 3 annotators) → measure agreement
- Weeks 2–4: 9,500 sentences (single annotator per sentence) with spot checks
- Domain expert adjudicates disagreements (<2% of sentences)

### ML Model: Deontic Classification

**Strategy:** Multi-task learning

Task 1: Classify deontic type (8-class classification)
Task 2: Extract spans (subject, action, object, condition, temporal) using sequence labeling

**Base model:** Transformer-based model (BERT-family or regulatory-domain-specific variant)

**Training:**
- Train/validation/test split on annotated data
- Data augmentation to increase training set size
- Multi-task loss combining classification and span extraction
- Optimization via standard deep learning practices

**Evaluation metrics:**
- Classification: accuracy, precision, recall, F1 per deontic type
- Span extraction: token-level F1, span-level F1
- Target: High F1 on test set for both tasks (>80%)

### Failure Modes & Escalation

| Failure | Impact | Mitigation | Escalation |
|---------|--------|-----------|-----------|
| Inter-annotator agreement <0.70 | Ambiguous guidelines, poor training data | Refine annotation guidelines; provide more examples | Hire experienced regulatory annotator as reference annotator |
| Model F1 <75% | Poor obligation extraction | Larger base model (distilbert → roberta); more training data | Hybrid approach: rule-based classifier + ML |
| Span extraction fails (spans don't align to tokens) | Unparseable obligations | Post-processing: align spans to token boundaries | Manual annotation of span boundaries |
| Low confidence predictions (avg <0.65) | Uncertain obligations | Mark for human review; lower prediction threshold; retrain | Domain expert manual extraction |

---

## Layer 4: Semantic / Ontological Layer – Detailed Plan

### Concept Extraction & Ontology Design

**Process:**

Weeks 1–2: Extract concepts from Layer 3 "definition" deontic tags
- Every sentence tagged as "definition" in Layer 3 contains a concept
- Extract: term, definition text, source article
- Expected: 150–200 concepts from LCR

Weeks 3–4: Define ontology schema
- Root classes: Asset, Liability, Counterparty, Status, Threshold, Ratio, Control, Timeline
- Properties: is_a, part_of, has_property, subject_to, triggers, contradicts
- Constraints: logical rules (e.g., Default status implies capital requirements)

Weeks 5–6: Populate ontology
- Instantiate 200+ LCR concepts
- For each concept: definition, source article, properties, relationships
- Example: Level1Asset (is_a Asset, haircut 0%, liquidity_weight 100%)

Weeks 7–8: Test ontology
- Query: "What concepts trigger default status?"
- Query: "What are all haircut values?"
- Validate: ontology captures LCR semantics

### Graph Schema (Neo4j)

```
Node types:
- Concept (id: "concept_001", term: "retail_deposit", definition: "...", regulation_id: "CRR", source_article: "Art_24_Para_1", version: 1)
- PropertyValue (id: "propval_001", property_name: "haircut", value: "0.10", concept_id: "concept_001", unit: "percentage")

Relationship types:
- IS_A (Concept A → Concept B, "is a subtype of")
- PART_OF (Concept A → Concept B, "is a component of")
- HAS_PROPERTY (Concept → PropertyValue)
- SUBJECT_TO (Concept A → Concept B, "is constrained by")
- TRIGGERS (Concept A → Concept B, "causes status change to")
- CONTRADICTS (Concept A → Concept B, "conflicts with")

Properties on Concept:
- id (string, unique)
- term (string, human-readable name)
- definition (text)
- regulation_id (string)
- source_article (string, reference to Layer 1 node)
- effective_from (date)
- effective_to (date or null)
- version (integer)
- embedding (vector[768], from sentence transformer)

Properties on PropertyValue:
- id (string)
- property_name (enum: haircut, concentration_limit, outflow_rate, etc.)
- value (string or number)
- unit (string: percentage, currency, days, etc.)
- effective_from (date)
- effective_to (date or null)

Query examples:
MATCH (c:Concept {term: "retail_deposit"}) 
-[:IS_A]-> (parent:Concept) 
RETURN parent.term
→ Returns: "Deposit"

MATCH (c:Concept) -[:HAS_PROPERTY] -> (p:PropertyValue {property_name: "haircut"})
RETURN c.term, p.value
→ Returns all concepts and their haircuts

MATCH (c:Concept) -[:SUBJECT_TO] -> (constraint:Concept)
RETURN c.term, constraint.term
→ Returns concept constraints
```

### ML Methodology: Ontology Grounding

**Task:** Given an extracted obligation, link its subject/object/condition to ontology concept IDs

**Process:**

1. **Candidate generation:** For each entity in the obligation (subject, object, condition), find candidate concepts in ontology
   - Lexical match: entity name matches concept.term (fuzzy match using Levenshtein distance)
   - Semantic match: entity embedding closest to concept.embedding
   - Return top 5 candidates per entity

2. **Ranking:** Score each candidate based on:
   - Lexical similarity (0.0–1.0)
   - Semantic similarity (cosine of embeddings)
   - Context: do other entities in this obligation connect to this concept?
   - Weighted score: 0.4 × lexical + 0.4 × semantic + 0.2 × context

3. **Linking:** Assign highest-scoring candidate (if score >0.7); otherwise mark as "uncertain"

**Evaluation:**
- Manual validation: domain expert reviews 200 linked obligations
- Target: 85%+ correct linking
- Track: what % of obligations have high-confidence links (>0.8)?

**Failure mode:** Low linking confidence (<0.7)
- Escalation: Domain expert manually assigns concept; feedback loop retrains ranker

---

## Layer 5: Computational Layer – Detailed Plan

**Can run in parallel with Layers 1–4 after Layer 2 completes (text is tokenized)**

### Formula Extraction

**Process:**

Week 1: Identify quantitative requirements
- Scan all sentences for numbers, percentages, formulas
- Extract: parameter name, value, unit, applicability

Week 2: Parse formulas into ASTs
- Regex patterns for common formulas:
  - "X = Y + Z"
  - "X = Y × Z"
  - "X = Y / Z"
  - "If [condition], then X = Y%, else Z%"
- Custom parser for complex formulas

Week 3: Validate ASTs
- Domain expert reviews 50 parsed formulas
- Ensure inputs/outputs are correctly typed

### ML Methodology: Formula Recognition

**Task:** Identify sentences that contain formulas; extract formula AST

**Approach:** Rule-based + pattern matching (not ML)

- Rule 1: If sentence contains "=" and numeric operands → likely a formula
- Rule 2: If sentence contains percentage sign (%) → likely a rate/haircut/cap
- Rule 3: If sentence contains "if/then/else" → likely conditional logic

**Evaluation:**
- Compare extracted formulas to manual annotations (20 formulas)
- Target: 90%+ precision (few false positives)

### Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|-----------|
| Complex formula not parsed | Missing constraint | Escalate to domain expert for manual AST |
| Parameter name ambiguous | Wrong semantics | Link to ontology concept; disambiguate |
| Conditional logic malformed | Unparseable AST | Domain expert manual review |

---

## Layer 6: Field Layer – Detailed Plan

**Depends on:** Layers 1, 3, 4, 5 complete

### EBA DPM Ingestion

**Challenge:** 40,000+ fields is massive

**Approach:** Semi-automatic ingestion

**Process:**

Weeks 1–2: Parse DPM XML
- Ingest EBA DPM taxonomy (published format)
- Extract: field ID, definition, applicable regulations, validation rules
- Result: 40,000 field records in database

Weeks 3–4: Automatic field-to-obligation matching
- For each field, use semantic search to find related obligations
- Query: "Find obligations mentioning this field's definition"
- Rank candidates by similarity
- Assign top match if similarity >0.8

Weeks 5–6: Manual validation
- Domain expert reviews 500 field-obligation links (sample)
- Target: 90%+ correct
- For remaining 39,500: use confidence scores from automatic matching

### Field Linking Quality

**Confidence levels:**

- High (0.85–1.0): Automatic match validated on sample
- Medium (0.70–0.85): Automatic match, not yet validated
- Low (<0.70): Uncertain; mark for manual review

**Validation workflow:**
- Week 6: Domain expert reviews all "low confidence" links (~5,000)
- Adjudicate: confirm or reject each link
- Retrain matcher if pattern of errors emerges

---

## Layer 7: Cross-Regulation Layer – Detailed Plan

**Depends on:** Layers 1–6 complete for multiple regulations (NSFR, ALMM)

### Ontology Alignment

**Input:** LCR ontology (200 concepts), NSFR ontology (200 concepts), ALMM ontology (150 concepts)

**Process:**

Weeks 1–2: Automatic alignment proposal
- For each LCR concept, find candidates in NSFR/ALMM using:
  - Lexical match (term similarity)
  - Semantic match (embedding cosine similarity)
  - Definition overlap (BLEU score of definitions)
- Return top 3 candidates per concept

Weeks 3–4: Manual validation
- Domain experts review and score each alignment:
  - sameAs: identical concept, same definition
  - closeMatch: same concept, minor definition differences
  - narrower: one is subset of other
  - broader: one is superset of other
  - contradicts: conflicting definitions
- Result: 200+ curated alignments

**Confidence tiers:**
- High: expert-validated sameAs
- Medium: expert-validated closeMatch or narrower/broader
- Low: unvalidated automatic proposal

### Conflict Detection

**Input:** Aligned concepts + extracted obligations

**Process:**

For each pair of obligations from different regulations:

1. **Concept overlap:** Do they reference same or related concepts?
2. **Contradiction check:**
   - Same subject, opposite modality? (shall X vs. shall not X)
   - Different thresholds for same concept? (25% cap vs. 10% cap)
   - Different reporting frequencies? (daily vs. monthly)
   - Different definitions? (e.g., "retail deposit <100k" vs. "<95k")
3. **Severity scoring:**
   - Critical: direct contradiction, operational impact
   - High: threshold mismatch, definition divergence
   - Medium: minor conceptual difference
   - Low: informational conflict (e.g., different guidance)

**ML Methodology: Tension Inference**

**Task:** Given two obligations + their concepts, detect contradictions

**Approach:** Rule-based heuristics (not neural)

Rules:
```
IF obligation_A.modality = "shall"
   AND obligation_B.modality = "shall not"
   AND ontology.sameAs(obligation_A.object, obligation_B.object)
THEN conflict_type = "direct_contradiction", severity = "critical"

IF obligation_A.threshold = 25%
   AND obligation_B.threshold = 10%
   AND ontology.sameAs(obligation_A.measure, obligation_B.measure)
THEN conflict_type = "threshold_conflict", severity = "high"

IF obligation_A.frequency = "daily"
   AND obligation_B.frequency = "monthly"
   AND ontology.closeMatch(obligation_A.measure, obligation_B.measure)
THEN conflict_type = "temporal_conflict", severity = "medium"
```

**Evaluation:**
- Manually annotate 100 obligation pairs as conflict/no conflict
- Run heuristics on 100 pairs
- Target: 85%+ precision, 75%+ recall

**Failure mode: Low precision (<80%)**
- Impact: false positive conflicts confuse users
- Mitigation: Domain expert review all high-severity detections; lower confidence threshold

---

## Critical Path & Decision Points

### Execution Order (Layers 1–4 MVP)

Sequential path:
1. Layer 1 (Structural) — Parse regulation and extract cross-references
2. Layer 2 (Linguistic) — Tokenize and align text across languages
3. Layer 3 (Deontic) — Annotate and classify obligation types
4. Layer 4 (Semantic) — Extract concepts and build ontology

Parallel tracks:
- Layer 1 and Layer 2 setup can run in parallel
- Layer 3 annotation and Layer 4 ontology design can overlap

### Critical Checkpoints

1. **Base models for NER and deontic classification**
   - Decision: Select transformer variant based on accuracy vs. speed tradeoffs
   - Trade-off: Model complexity affects training time and inference speed

2. **Annotation platform**
   - Decision: Choose annotation tool (Prodigy, Label Studio, or custom)
   - Consideration: Must support span-level annotation and inter-annotator agreement tracking

3. **Graph database technology**
   - Decision: Choose graph store for ontology (Neo4j, ArangoDB, or hybrid)
   - Consideration: Must support rich relationship types and complex queries

4. **Annotation team sourcing**
   - Decision: Internal vs. external annotators vs. hybrid
   - Consideration: External hiring requires domain expertise in financial regulation

---

## Resources Required

**MVP (Layers 1–4 for one regulation):**
- Parser engineer (structural extraction, XML, cross-references)
- ML engineer (NER fine-tuning, deontic classifier, concept grounding)
- Domain expert (annotation oversight, ontology validation)
- Annotation team (multiple annotators for inter-annotator agreement)
- Annotation platform (Prodigy or equivalent)
- GPU compute for model training

**Scale-Out (Layers 1–7 for multiple regulations):**
- Additional parsing effort for each new regulation
- ML engineering to scale extraction pipeline
- Domain experts for ontology alignment and tension validation
- Annotation teams for each new regulation
- Infrastructure scaling (Neo4j, databases, compute)

---

## Failure Modes & Mitigation

### Potential Issues Across All Layers

| Layer | Failure Mode | Recovery Strategy |
|-------|---------|----------|
| 1 | Parser crashes on malformed source documents | Fall back to manual extraction from PDF |
| 2 | NER model underperforms on regulatory text | Larger base model or more training data |
| 3 | Annotator agreement too low | Refine schema; provide more examples; re-annotate |
| 3 | ML model F1 insufficient | Larger model, more training data, hybrid rule-based approach |
| 4 | Concept extraction incomplete | Manual ontology curation by domain experts |
| 5 | Complex formulas unparseable | Hybrid rule-based + manual review |
| 6 | Field-obligation linking accuracy too low | Manual review sample; retrain ranker |
| 7 | Concept alignment disagreement | Multiple domain experts review; escalate to legal |
| 7 | Conflict detection has false positives | Stricter heuristics; manual validation |

**Mitigation approach:** Design pipeline with checkpoints to detect issues early; plan for iteration and refinement at each stage

---

## Success Metrics

**MVP (Week 16 — Layers 1–4 for LCR):**

At Week 16, you have succeeded if:

1. **Structural tree:** 200+ nodes for LCR, 100% accuracy on article boundaries
2. **Annotated corpus:** 10,000 sentences labeled, inter-annotator agreement ≥0.75
3. **Deontic model:** 80%+ F1 on held-out test set
4. **Ontology:** 150–200 LCR concepts extracted, validated by domain expert
5. **Graph queries:** Basic queries work ("find all haircuts", "find default-triggered obligations")
6. **Obligation extraction:** ~1,200 obligations extracted with 80%+ accuracy

If all 6 are true, scale to NSFR + ALMM + Layers 5–7.  
If any fail significantly, debug and iterate before scaling.

**Full System (Week 52 — Layers 1–7 for 3+ regulations):**

At Week 52, the system is production-ready if:

1. **Coverage:** 3,600+ obligations extracted with 80%+ accuracy across LCR, NSFR, ALMM
2. **Ontology:** 1,000+ concepts with validated relationships across regulations
3. **Tensions:** 50–100 real conflicts detected and validated between regulations
4. **Field bindings:** 40,000+ COREP cells mapped to obligations with 85%+ confidence
5. **Validation:** 85%+ of all obligations validated by humans
6. **Quality:** Inter-annotator agreement >0.80, model F1 >0.85, dispute rate <5%
7. **Infrastructure:** Temporal versioning, provenance tagging, grammar validation, quality dashboard all operational
8. **API:** All 30+ endpoints functional, <500ms p95 latency, 99.5% uptime

---

## Post-MVP: Scale-Out Plan

After MVP validation (Layers 1–4 for one regulation):

**Phase 1:** Add additional regulations
- Repeat Layers 1–4 pipeline for each new regulation
- Annotation and extraction effort scales linearly

**Phase 2:** Add computational and field binding (Layers 5–6)
- Extract formulas and parameters from all regulations
- Map reporting fields to obligations

**Phase 3:** Cross-regulation reasoning (Layer 7)
- Align concepts across regulations
- Detect and validate tensions

**Phase 4 (separate effort):** Infrastructure layers (Layers 8–11) and platform
- Temporal versioning and amendment tracking
- Provenance and authority level tagging
- Generative grammar and completeness validation
- Quality tracking and continuous improvement

---

## Checkpoints & Go/No-Go Gates

| Phase | Criterion | Go | No-Go Action | Recovery Budget |
|-------|-----------|----|----|---|
| Layer 1 | Parser tested on sample | Low parse error rate | Fix parser, retest | 1 week |
| Layer 3 | Annotation agreement | κ ≥ 0.75 | Refine schema, re-annotate | 2 weeks |
| Layer 3 | ML model performance | F1 ≥ 0.80 | Retrain, try larger model | 2 weeks |
| Layer 4 | Ontology complete | Queries work, high accuracy | Curation iteration | 1 week |
| Scale: Multiple regulations | Parsing across regulations | Acceptable error rate | Fix parsing issues | 1 week |
| Layer 6 | Field-obligation linking | High confidence matching | Manual review | 2 weeks |
| Layer 7 | Tension detection | High precision and recall | Refine heuristics, manual validation | 3 weeks |

Note: Layer 7 gate is highest risk (conflict detection estimated at 50% false positive rate). If gate fails, recovery involves heuristic refinement (2 weeks) + re-evaluation on full obligation set (1 week).

---

## Summary

This is an architecture and approach plan. It specifies:

✅ Sequencing (dependencies, critical path, decision points)  
✅ ML methodology (approach, evaluation metrics, base models to consider)  
✅ Annotation sourcing (qualifications needed, team structure, inter-annotator agreement)  
✅ Graph schema (Neo4j node/relationship types, properties, queries)  
✅ Failure modes (what can go wrong, mitigation strategies)  
✅ Success metrics (go/no-go criteria for advancing to next phase)  

The plan describes:
- What needs to be built at each layer
- How to validate that it works
- What can fail and how to recover
- When to advance to the next phase

**What is NOT in this plan:**
- Specific timelines (those depend on team experience, data quality, tool maturity)
- Cost estimates (those depend on labor market, chosen vendors, infrastructure)
- Detailed resource allocation (that's a separate planning exercise with actual budget)

The next step is to validate the approach with one regulation, measure actual execution time and effort, then use that data to plan the full rollout.
