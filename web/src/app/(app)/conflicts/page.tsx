"use client";

import { useState, useMemo } from "react";
import { OBLIGATIONS } from "@/data/obligations";
import { useScopeStore } from "@/store/scope";
import ScopeControl from "@/components/product/ScopeControl";
import ConflictBadge from "@/components/product/ConflictBadge";

/* ── Static conflict metadata ─────────────────────────────────────── */
const CONFLICT_TYPE: Record<string, string> = {
  "OBLIG-ALMM-001|OBLIG-LCR-002":  "Reporting overlap",
  "OBLIG-LCR-008|OBLIG-NSFR-004":  "Definitional conflict",
  "OBLIG-LCR-001|OBLIG-UKPRA-004": "Jurisdictional overlap",
};

const CONFLICT_DETECTED: Record<string, string> = {
  "OBLIG-ALMM-001|OBLIG-LCR-002":  "2025-11-20",
  "OBLIG-LCR-008|OBLIG-NSFR-004":  "2025-11-18",
  "OBLIG-LCR-001|OBLIG-UKPRA-004": "2025-11-18",
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

/* ── SVG layout constants ─────────────────────────────────────────── */
const SVG_W = 600;
const SVG_H = 520;
const CX = SVG_W / 2;
const CY = SVG_H / 2;
const LAYOUT_R = 170;
const NODE_R = 18;

/* ── Page ─────────────────────────────────────────────────────────── */
export default function ConflictsPage() {
  const { selectedRegulations } = useScopeStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [jurisFilter, setJurisFilter] = useState<string | null>(null);

  /* Obligation lookup */
  const oblMap = useMemo(
    () => Object.fromEntries(OBLIGATIONS.map((o) => [o.id, o])),
    [],
  );

  /* Unique conflict pairs (deduplicated by sorted key) */
  const allPairs = useMemo(() => {
    const seen = new Set<string>();
    const pairs: Array<{ a: string; b: string; key: string }> = [];
    OBLIGATIONS.forEach((o) => {
      o.conflicts.forEach((cid) => {
        const k = pairKey(o.id, cid);
        if (!seen.has(k)) {
          seen.add(k);
          pairs.push({ a: o.id, b: cid, key: k });
        }
      });
    });
    return pairs;
  }, []);

  /* All node IDs in a stable order for circular layout */
  const allNodeIds = useMemo(() => {
    const ids = new Set<string>();
    allPairs.forEach(({ a, b }) => { ids.add(a); ids.add(b); });
    return Array.from(ids);
  }, [allPairs]);

  /* Distinct jurisdictions across all conflict nodes */
  const jurisOptions = useMemo(() => {
    const ids = new Set<string>();
    allNodeIds.forEach((id) => {
      const o = oblMap[id];
      if (o) ids.add(o.jurisdictionId);
    });
    return Array.from(ids);
  }, [allNodeIds, oblMap]);

  /* Scope + jurisdiction filtered pairs */
  const filteredPairs = useMemo(() => {
    return allPairs.filter(({ a, b }) => {
      const oa = oblMap[a];
      const ob = oblMap[b];
      if (!oa || !ob) return false;
      const regOk =
        selectedRegulations.length === 0 ||
        selectedRegulations.includes(oa.regulationId) ||
        selectedRegulations.includes(ob.regulationId);
      const jurisOk =
        !jurisFilter ||
        oa.jurisdictionId === jurisFilter ||
        ob.jurisdictionId === jurisFilter;
      return regOk && jurisOk;
    });
  }, [allPairs, oblMap, selectedRegulations, jurisFilter]);

  /* Nodes visible in filtered scope */
  const visibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    filteredPairs.forEach(({ a, b }) => { ids.add(a); ids.add(b); });
    return ids;
  }, [filteredPairs]);

  /* Circular layout positions (stable across filter changes) */
  const nodePositions = useMemo(() => {
    const map = new Map<string, { cx: number; cy: number }>();
    const n = allNodeIds.length;
    allNodeIds.forEach((id, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      map.set(id, {
        cx: Math.round(CX + LAYOUT_R * Math.cos(angle)),
        cy: Math.round(CY + LAYOUT_R * Math.sin(angle)),
      });
    });
    return map;
  }, [allNodeIds]);

  /* Edges connected to selected node */
  const activeEdgeKeys = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();
    const keys = new Set<string>();
    filteredPairs.forEach(({ a, b, key }) => {
      if (a === selectedNodeId || b === selectedNodeId) keys.add(key);
    });
    return keys;
  }, [selectedNodeId, filteredPairs]);

  const handleNodeClick = (id: string) => {
    setSelectedNodeId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <ScopeControl />

      <div className="flex-between mt-4 mb-4">
        <h1 className="t-h1">Conflict Detection</h1>
        <ConflictBadge count={filteredPairs.length} />
      </div>

      <div className="conflict-layout">

        {/* ── Graph ──────────────────────────────────────────── */}
        <div className="conflict-graph-area">
          <div className="conflict-graph-frame">
            {visibleNodeIds.size === 0 ? (
              <div className="conflict-graph-empty">
                <p className="t-secondary t-small">No conflicts in current scope.</p>
              </div>
            ) : (
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                aria-label="Obligation conflict graph"
                role="img"
              >
                {/* Edges rendered first (behind nodes) */}
                {allPairs.map(({ a, b, key }) => {
                  const posA = nodePositions.get(a);
                  const posB = nodePositions.get(b);
                  if (!posA || !posB) return null;
                  const inScope = filteredPairs.some((p) => p.key === key);
                  const isActive = activeEdgeKeys.has(key);
                  return (
                    <line
                      key={key}
                      x1={posA.cx}
                      y1={posA.cy}
                      x2={posB.cx}
                      y2={posB.cy}
                      className={[
                        "graph-edge",
                        "graph-edge--conflict",
                        isActive ? "graph-edge--active" : "",
                      ].filter(Boolean).join(" ")}
                      opacity={inScope ? 1 : 0.2}
                    />
                  );
                })}

                {/* Nodes */}
                {allNodeIds.map((id) => {
                  const pos = nodePositions.get(id);
                  const obl = oblMap[id];
                  if (!pos || !obl) return null;
                  const inScope = visibleNodeIds.has(id);
                  const isSelected = selectedNodeId === id;
                  return (
                    <g
                      key={id}
                      onClick={() => inScope && handleNodeClick(id)}
                      className={inScope ? "is-clickable" : undefined}
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={id}
                      opacity={inScope ? 1 : 0.2}
                    >
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r={NODE_R}
                        className={[
                          "graph-node",
                          `graph-node--${obl.regulationId}`,
                          isSelected ? "graph-node--filled" : "",
                        ].filter(Boolean).join(" ")}
                      />
                      <text
                        x={pos.cx}
                        y={pos.cy + NODE_R + 14}
                        className="graph-label"
                        textAnchor="middle"
                      >
                        {id.replace("OBLIG-", "")}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
          <p className="t-secondary t-small mt-2">
            Click a node to highlight its conflict edges.
          </p>
        </div>

        {/* ── Side panel ─────────────────────────────────────── */}
        <aside className="conflict-panel card" aria-label="Conflict list">

          {/* Jurisdiction filter chips */}
          <div className="conflict-panel__filters">
            <button
              type="button"
              className={["scope-chip", !jurisFilter ? "is-active" : ""].filter(Boolean).join(" ")}
              onClick={() => setJurisFilter(null)}
            >
              All
            </button>
            {jurisOptions.map((jid) => (
              <button
                key={jid}
                type="button"
                className={[
                  "scope-chip",
                  jurisFilter === jid ? "is-active" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => setJurisFilter((prev) => (prev === jid ? null : jid))}
              >
                {jid.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Conflict list */}
          {filteredPairs.length === 0 ? (
            <p className="t-secondary t-small">No conflicts match the current scope.</p>
          ) : (
            filteredPairs.map(({ a, b, key }) => {
              const oa = oblMap[a];
              const ob = oblMap[b];
              if (!oa || !ob) return null;
              return (
                <div
                  key={key}
                  className={[
                    "conflict-item",
                    activeEdgeKeys.has(key) ? "conflict-item--active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className="conflict-item__ids">
                    <span className={`badge--regulation badge--${oa.regulationId}`}>
                      {oa.id}
                    </span>
                    <span className="t-muted">&harr;</span>
                    <span className={`badge--regulation badge--${ob.regulationId}`}>
                      {ob.id}
                    </span>
                  </div>
                  <div className="flex-between mb-1">
                    <span className="tag tag-domain">{CONFLICT_TYPE[key] ?? "Conflict"}</span>
                    <span className="conflict-item__meta">{CONFLICT_DETECTED[key] ?? "—"}</span>
                  </div>
                  <p className="t-small t-secondary">
                    {oa.citation} · {ob.citation}
                  </p>
                </div>
              );
            })
          )}
        </aside>
      </div>
    </div>
  );
}
