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

- Parsed structural tree (200+ nodes for LCR)
- Annotated deontic corpus (10,000 LCR sentences)
- ~1,200 extracted LCR obligations
- Ontology of 200 concepts specific to LCR
- Graph schema working, queryable
- Success metric: obligations extracted with 80%+ accuracy, inter-annotator agreement ≥0.75

**Timeline:** 16 weeks  
**Team:** 3 FTE (1 parser engineer, 1 ML engineer, 1 domain expert)  
**Deliverable:** Proof that the approach works; ready to scale to multiple regulations

### Scale-Out: Additional Regulations (Layers 1–7)

Once MVP proven, expand to full regulatory coverage:
- Add NSFR (~1,500 obligations), ALMM (~900 obligations) via Layers 1–4 (repeat pipeline)
- Add Layer 5 (Computational): 50+ formulas across all regulations
- Add Layer 6 (Field): bind 40,000+ COREP reporting cells to obligations
- Add Layer 7 (Cross-Regulation): align concepts, detect tensions across regulations
- Add regional variants: Peru SBS, Panama SBN, Brazil BCB (50–150 obligations each)

**Scale-out timeline:** Additional 36 weeks  
**Total system completion:** 52 weeks to full production system

**Full system scope (at completion):**
- 3 primary EU regulations (LCR, NSFR, ALMM) = ~3,600 obligations
- Plus regional variants = 3,600–3,900 total obligations
- 1,000+ concepts in unified ontology
- 40,000+ reporting fields bound to obligations
- 50–100+ tensions detected and validated
- 4–6+ regulations parsed and indexed

---

## Layer 1: Structural Layer – Detailed Plan

### What You Build

**Parser for EUR-Lex XML** (primary input format)

Input: XML from EUR-Lex containing CRR regulations
Output: Addressable tree with 200+ nodes (LCR case)

**Parser development:**
- Weeks 1–2: Analyze EUR-Lex XML structure; design canonical schema
- Weeks 3–4: Implement parser; test on LCR XML
- Week 5: Validate structural tree; resolve parsing errors

**Cross-reference extraction:**
- Weeks 5–6: Scan for explicit citations ("as referred to in Article X")
- Create typed edges: cites, amends, derogates_from

**Amendment tracking:**
- Week 7: Identify CRR I → CRR II → CRR III amendments
- Week 8: Model amendment deltas as insert/delete/replace operations

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

Weeks 1–2: Set up spaCy + Stanza pipelines
- Install pre-trained models for English, French, German, Spanish
- Test on sample LCR sentences

Weeks 3–4: NER fine-tuning
- Collect regulatory entities: "credit institution", "maturity bucket", "haircut", "Level 2A asset"
- Annotate 500 sentences with entities
- Fine-tune transformer-based NER model (e.g., spaCy's transformer extension)
- Evaluate: precision, recall, F1 on test set

Weeks 5–6: Multilingual alignment
- For each English sentence, find equivalent sentences in French, German, Spanish (from EUR-Lex parallel texts)
- Align at phrase level using embeddings (multilingual BERT, LaBSE)
- Create concept ID mappings: English "retail deposit" → concept_001 ← French "dépôt de détail" ← German "Retaileinlage"

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

### ML Methodology

**NER Fine-Tuning Strategy:**

Base model: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (multilingual, fast, reasonable quality)

Alternatives considered:
- `xlm-roberta-base`: larger, more accurate, slower inference
- `mBERT`: older, less accurate
- Decision: MiniLM for MVP; upgrade to xlm-roberta if accuracy insufficient

**Training data:** 500 annotated LCR sentences (see Layer 3 annotation effort)

**Fine-tuning process:**
- Use spaCy's transformer extension (`spacy-transformers`)
- Train on 500 sentences: 400 train, 50 validation, 50 test
- Evaluate: precision, recall, F1 per entity type
- Target: 85%+ F1 on test set

**Multilingual alignment:**
- Use LaBSE embeddings (multilingual sentence embeddings)
- For each English sentence, find closest matches in French/German/Spanish using cosine similarity
- Threshold: >0.85 similarity
- Manual validation: domain expert reviews 100 alignments to check accuracy
- Target: 90%+ alignment accuracy

**Inference cost:**
- Tokenization: ~10ms per sentence
- NER: ~50ms per sentence  
- Embedding: ~20ms per sentence
- Total: ~80ms per sentence; 10,000 sentences = ~13 minutes

### Failure Modes & Escalation

| Failure | Impact | Mitigation | Escalation |
|---------|--------|-----------|-----------|
| NER F1 <80% | Entity confusion | Retrain with more data or larger model | Upgrade to xlm-roberta; add manual annotation |
| Alignment fails | Multilingual concept map incomplete | Lower similarity threshold to 0.80 | Manual alignment by bilingual expert |
| Embedding space diverges across languages | Cross-lingual searches fail | Use mBERT instead of language-specific models | Retrain on regulatory parallel corpus |

---

## Layer 3: Deontic / Modal Layer – Detailed Plan

### Annotation Sourcing & Costs

**Task:** Hand-label 10,000 LCR sentences with deontic type + structure

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
- Ability to commit 4 weeks (part-time)

**Recruitment:**
- LinkedIn: search "financial compliance + lawyer"
- Compliance recruiting firms
- University law schools (offer stipend to post-grads)
- Estimated cost: $80–100/hour

**Annotator pool:**
- 3 full-time equivalents × 10,000 sentences ÷ 250 sentences/annotator/week = 40 annotator-weeks
- Split across 3 annotators: each does 3,333 sentences
- 3 × 3,333 ÷ 250 per week = 40 weeks of annotator effort
- Run in parallel: 3 annotators × 4 weeks = 4 wall-clock weeks

**Cost:**
- 3 annotators × 40 weeks × $90/hour × 40 hours/week = $432,000
- Plus Prodigy license ($5,000 for 4 weeks)
- **Total annotation cost: ~$437,000**

**Inter-annotator agreement (Cohen's Kappa):**
- Extract 500 random sentences for dual-annotation (all 3 annotators)
- Measure agreement:
  - Deontic type: target 0.75+ Kappa
  - Subject/action/object spans: target 0.70+ Kappa (more subjective)
  - Temporal extraction: target 0.80+ Kappa (more objective)
- If agreement <0.70, refine guidelines and re-annotate

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

**Base model:** Fine-tuned `distilbert-base-uncased` (fast, reasonable accuracy)

Alternative: `legal-bert` or regulatory-domain-specific BERT if available

**Architecture:**
```
Input: [CLS] sentence tokens [SEP]
├─ BERT encoder
├─ Task 1: Deontic classification head (8-class softmax)
└─ Task 2: Span extraction head (sequence labeling, BIO tagging)

Output:
- Deontic type: probability over 8 classes
- Token-level BIO tags: B-SUBJECT, I-SUBJECT, B-ACTION, I-ACTION, etc.
```

**Training data:**
- 400 sentences train (from 500 dual-annotated)
- 50 sentences validation
- 50 sentences test
- Data augmentation: paraphrase each sentence using T5 (generate 2 paraphrases per sentence)
- Augmented train set: 1,200 sentences

**Training:**
- Optimizer: AdamW, learning rate 2e-5
- Batch size: 16
- Epochs: 3
- Loss: weighted multi-task loss (0.5 × classification loss + 0.5 × span loss)

**Evaluation metrics:**
- Classification: accuracy, precision, recall, F1 per class
- Span extraction: token-level F1, span-level F1
- Target: 80%+ F1 on test set for both tasks

**Inference cost:**
- Per sentence: ~20ms
- 10,000 sentences: ~3.3 minutes

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

## Critical Path & Critical Decisions

### Critical Path (Layers 1–4 MVP)

```
Week 1:    Layer 1 design + Layer 2 setup (parallel)
Weeks 2–5: Layer 1 parsing complete
Weeks 1–6: Layer 2 NER fine-tuning (parallel)
Weeks 1–4: Annotation schema design + Prodigy setup (parallel)
Weeks 5–8: Layer 3 annotation (10,000 sentences, 3 annotators in parallel)
Week 8:    Layer 3 agreement measurement
Weeks 9–12: Layer 3 ML model training + Layer 4 ontology design (parallel)
Weeks 13–16: Layer 4 ontology population + validation

Gate at Week 8: Is inter-annotator agreement ≥0.75? If no, refine schema & re-annotate 1,000 sentences (add 2 weeks).

Gate at Week 12: Does Layer 3 model achieve 80%+ F1? If no, retrain with larger model or more data (add 2 weeks).

Gate at Week 16: Does ontology capture LCR semantics? If no, iterate (add 1 week).

Earliest MVP delivery: Week 16 (if all gates pass)
Worst case (gates fail): Week 21
```

### Critical Decisions (Make by Week 1)

1. **Base models:** Which BERT variant for deontic classification and NER?
   - Decision: distilbert (fast, reasonable) vs. roberta (slower, better) vs. legal-bert (if available)
   - Timeline impact: switching models mid-training costs 1 week

2. **Annotation platform:** Prodigy vs. Label Studio vs. custom UI?
   - Decision: Prodigy (cost $5k, mature, reliable)
   - Timeline impact: setup is 1 week

3. **Graph database:** Neo4j vs. ArangoDB vs. PostgreSQL with JSON?
   - Decision: Neo4j (mature, Cypher query language, good for ontology)
   - Timeline impact: schema design, driver setup (1 week)

4. **Annotation sourcing:** Hire externally vs. use internal staff vs. crowdsource?
   - Decision: Hire 3 external regulatory experts (fastest for MVP, higher cost)
   - Timeline impact: recruitment 1 week, onboarding 1 week

---

## Costs & Resources

### MVP (Layers 1–4, one regulation, 16 weeks)

| Category | Cost | Notes |
|----------|------|-------|
| Parser Engineer (1 FTE, 16 weeks) | $80,000 | Structural parsing, XML, cross-reference extraction |
| ML Engineer (1 FTE, 16 weeks) | $100,000 | NER fine-tuning, deontic classifier, grounding |
| Domain Expert (1 FTE, 16 weeks) | $60,000 | Annotation oversight, ontology validation |
| Annotators (3 FTE, 4 weeks) | $437,000 | Deontic annotation (10,000 sentences) |
| Prodigy License | $5,000 | 4-week license |
| GPU compute (training) | $5,000 | ~200 GPU hours for fine-tuning |
| **Total** | **$687,000** | |

### Scale-Out (Layers 1–7, 3 regulations, additional 24 weeks)

| Category | Cost | Notes |
|----------|------|-------|
| Parser Engineer (additional parsers for NSFR, ALMM) | $60,000 | ~2 weeks per regulation |
| ML Engineer (continue) | $75,000 | Scale extraction, add Layer 5–7 |
| Domain Experts (2 FTE) | $90,000 | Ontology alignment, conflict validation |
| Annotators (NSFR: 3 FTE, 4 weeks; ALMM: 2 FTE, 3 weeks) | $250,000 | |
| EBA DPM ingestion (semi-automatic) | $30,000 | Layer 6 field wiring |
| Infrastructure (Neo4j, cloud, GPU) | $20,000 | Scale databases |
| **Total** | **$525,000** | |

### Full Lifecycle (Layers 1–11 + platform) 

| Phase | Cost | Timeline |
|-------|------|----------|
| MVP (1 regulation) | $687,000 | 16 weeks |
| Scale-out (3 regulations) | $525,000 | 24 weeks |
| Layers 8–11 + Platform | $300,000 | 12 weeks |
| **Total** | **$1,512,000** | 52 weeks (12 months) |

---

## Failure Mode Reference

### Across All Layers

| Layer | Failure | P(fail) | Recovery | Impact |
|-------|---------|---------|----------|--------|
| 1 | Parser crashes on malformed XML | 10% | Fall back to PDF; manual extraction | +1 week per regulation |
| 2 | NER F1 <80% | 20% | Larger base model; more training data | +2 weeks |
| 3 | Annotator agreement <0.75 | 30% | Refine schema; re-annotate subset | +2 weeks |
| 3 | Model F1 <75% | 20% | Larger model; data augmentation; rule-based hybrid | +2 weeks |
| 4 | Concept extraction incomplete | 15% | Manual ontology curation | +1 week |
| 5 | Formula parsing fails on complex rules | 25% | Hybrid rule-based + manual | +1 week |
| 6 | Field-obligation linking <85% | 40% | Manual review; retrain; lower confidence threshold | +2 weeks |
| 7 | Concept alignment disagreement | 35% | Multiple domain experts; voting; escalation | +1 week |
| 7 | Conflict detection false positives | 50% | Stricter heuristics; manual review; lower threshold | +1 week |

**Mitigation strategy:** Build 3-week buffer into timeline

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

## Post-MVP: Operational Plan (Weeks 17–40)

**Weeks 17–24:** Add NSFR + ALMM

**Weeks 25–32:** Add Layer 5 (computational) + Layer 6 (field)

**Weeks 33–40:** Add Layer 7 (cross-regulation) + basic API + dashboard integration

**Weeks 41–52 (separate effort):** Layers 8–11 + full platform

---

## Checkpoints & Go/No-Go Gates

| Checkpoint | Criterion | Go | No-Go Action |
|------------|-----------|----|----|
| Week 4 | Layer 1 parser tested on sample | <5% parse errors | Fix parser, retest |
| Week 8 | Layer 3 annotation agreement | κ ≥ 0.75 | Refine schema, re-annotate |
| Week 12 | Layer 3 model performance | F1 ≥ 0.80 | Retrain, try larger model |
| Week 16 | Layer 4 ontology complete | Queries work, 85%+ accuracy | Curation iteration |
| Week 20 (Scale) | NSFR/ALMM parsing complete | <10% parse errors across regulations | Fix parsing issues |
| Week 28 (Scale) | Field-obligation linking | Confidence ≥0.80 for 85%+ of fields | Manual review pass 2 |
| Week 36 (Scale) | Tension detection | P ≥0.80, R ≥0.75 on conflict detection | Retrain heuristics |

---

## Summary

This is an operational plan. It specifies:

✅ Sequencing (dependencies, critical path, critical decisions)  
✅ ML methodology (base models, fine-tuning, evaluation metrics, costs)  
✅ Annotation sourcing (how many annotators, cost, timeline, tools)  
✅ Graph schema (Neo4j node/relationship types, properties, queries)  
✅ Failure modes (what can go wrong, impact, mitigation, escalation)  
✅ Costs & resources (per phase, total)  
✅ Success metrics (go/no-go gates)  

**MVP delivery: Week 16 (or Week 21 if gates fail)**  
**Full system: Week 52 (or later if scaling gates fail)**

The plan is executable. Pick a start date, assemble the team, and execute against the gates.
