"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { OBLIGATIONS, type ObligationStatus } from "@/data/obligations";
import { REGULATIONS } from "@/data/registry";
import { useScopeStore } from "@/store/scope";
import ScopeControl from "@/components/product/ScopeControl";
import StatusBadge from "@/components/product/StatusBadge";
import CompletenessBar from "@/components/product/CompletenessBar";
import Icon from "@/components/ui/Icon";

const PAGE_SIZE = 5;
const SUMMARY_CLAMP_AT = 140;

type SortCol = "id" | "regulationId" | "framework" | "status" | "completeness" | "deadline" | "assignedTo";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: ObligationStatus[] = ["active", "conflicted", "implementing", "pending", "inactive"];

const REG_MAP = Object.fromEntries(REGULATIONS.map((r) => [r.id, r]));

function SortTh({
  col, label, currentCol, currentDir, onSort,
}: {
  col: SortCol;
  label: string;
  currentCol: SortCol;
  currentDir: SortDir;
  onSort: (col: SortCol) => void;
}) {
  const active = currentCol === col;
  return (
    <th scope="col">
      <button
        type="button"
        className={["th-sort", active ? "is-active" : ""].filter(Boolean).join(" ")}
        onClick={() => onSort(col)}
      >
        {label}
        {active && <Icon name={currentDir === "asc" ? "chevron-up" : "chevron-down"} size="sm" />}
      </button>
    </th>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { selectedRegulations } = useScopeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  /* ── Filters + sort ──────────────────────────────────────────── */
  const [statusFilters, setStatusFilters] = useState<Set<ObligationStatus>>(new Set());
  const [sortCol, setSortCol] = useState<SortCol>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let rows = OBLIGATIONS;
    if (selectedRegulations.length > 0) {
      rows = rows.filter((o) => selectedRegulations.includes(o.regulationId));
    }
    if (statusFilters.size > 0) {
      rows = rows.filter((o) => statusFilters.has(o.status));
    }
    return rows;
  }, [selectedRegulations, statusFilters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortCol === "id") cmp = a.id.localeCompare(b.id);
      else if (sortCol === "regulationId") cmp = a.regulationId.localeCompare(b.regulationId);
      else if (sortCol === "framework") cmp = a.framework.localeCompare(b.framework);
      else if (sortCol === "status") cmp = a.status.localeCompare(b.status);
      else if (sortCol === "completeness") cmp = a.completeness - b.completeness;
      else if (sortCol === "deadline") cmp = (a.deadline ?? "").localeCompare(b.deadline ?? "");
      else if (sortCol === "assignedTo") cmp = (a.assignedTo ?? "").localeCompare(b.assignedTo ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortDir]);

  /* ── Pagination ─────────────────────────────────────────────── */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = useCallback(
    (col: SortCol) => {
      if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else { setSortCol(col); setSortDir("asc"); }
      setPage(1);
    },
    [sortCol],
  );

  const toggleStatus = (s: ObligationStatus) => {
    setStatusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setStatusFilters(new Set());
    setPage(1);
  };

  const allSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pageRows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const pagesArr = useMemo((): (number | "…")[] => {
    const pages: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  }, [totalPages, page]);

  const sortProps = { currentCol: sortCol, currentDir: sortDir, onSort: handleSort };

  if (isError) {
    return (
      <div>
        <ScopeControl />
        <div className="alert alert--error mt-4" role="alert">
          <strong className="alert__title">Unable to load obligations</strong>
          <p className="t-body mt-2">The obligation register could not be loaded. Please refresh the page or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScopeControl />

      <div className="flex-between mt-4 mb-3">
        <h1 className="t-h1">Obligation Register</h1>
        <span className="t-secondary t-small">{filtered.length} obligation{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="register-layout">
        {/* Filter panel */}
        <aside className="filter-panel" aria-label="Filter obligations">
          <div className="filter-panel__section">
            <span className="filter-panel__title">Status</span>
            {STATUS_OPTIONS.map((s) => (
              <label key={s} className="filter-panel__item">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={statusFilters.has(s)}
                  onChange={() => toggleStatus(s)}
                />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </label>
            ))}
          </div>

          {statusFilters.size > 0 && (
            <button type="button" className="btn btn-ghost btn--size-sm" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </aside>

        {/* Main content area */}
        <div className="register-table-area">

          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="bulk-bar" role="toolbar" aria-label="Bulk actions">
              <span className="bulk-bar__count">{selectedIds.size} selected</span>
              <button type="button" className="btn btn-secondary btn--size-sm">
                <Icon name="export" size="sm" />
                Export
              </button>
              <button type="button" className="btn btn-secondary btn--size-sm">
                <Icon name="user" size="sm" />
                Assign
              </button>
              <button type="button" className="btn btn-ghost btn--size-sm" onClick={clearSelection}>
                Clear
              </button>
            </div>
          )}

          {isLoading ? (
            /* Loading skeleton */
            <div className="table-wrap" aria-busy="true" aria-label="Loading obligations">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th></th>
                    <th scope="col">ID</th>
                    <th scope="col">Regulation</th>
                    <th scope="col">Framework</th>
                    <th scope="col">Summary</th>
                    <th scope="col">Status</th>
                    <th scope="col">Completeness</th>
                    <th scope="col">Deadline</th>
                    <th scope="col">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton skeleton--text" style={{ width: 16 }} /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                      <td><div className="skeleton skeleton--text" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : pageRows.length === 0 ? (
            /* Empty state */
            <div className="empty-state">
              <div className="empty-state__icon">
                <Icon name="filter" />
              </div>
              <p className="empty-state__title">No obligations match</p>
              <p className="empty-state__body">
                {filtered.length === 0 && selectedRegulations.length > 0
                  ? "No obligations exist for the selected regulations. Try adjusting the scope."
                  : "Try adjusting the filter criteria above."}
              </p>
              {statusFilters.size > 0 && (
                <div className="empty-state__action">
                  <button type="button" className="btn btn-secondary btn--size-sm" onClick={clearFilters}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Data table */
            <div className="table-wrap">
              <table
                className="table"
                aria-label="Obligation register"
              >
                <thead className="table-header">
                  <tr>
                    <th scope="col">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Select all obligations on this page"
                      />
                    </th>
                    <SortTh col="id" label="ID" {...sortProps} />
                    <SortTh col="regulationId" label="Regulation" {...sortProps} />
                    <SortTh col="framework" label="Framework" {...sortProps} />
                    <th scope="col">Summary</th>
                    <SortTh col="status" label="Status" {...sortProps} />
                    <SortTh col="completeness" label="Completeness" {...sortProps} />
                    <SortTh col="deadline" label="Deadline" {...sortProps} />
                    <SortTh col="assignedTo" label="Assigned" {...sortProps} />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((o) => {
                    const reg = REG_MAP[o.regulationId];
                    const isSelected = selectedIds.has(o.id);
                    return (
                      <tr
                        key={o.id}
                        className={isSelected ? "is-selected" : undefined}
                        onClick={() => router.push(`/register/${o.id}`)}
                      >
                        <td
                          className="numeric"
                          onClick={(e) => { e.stopPropagation(); toggleRow(o.id); }}
                        >
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(o.id)}
                            aria-label={`Select ${o.id}`}
                          />
                        </td>
                        <td className="mono">{o.id}</td>
                        <td>
                          <span className={`badge--regulation badge--${o.regulationId}`}>
                            {reg?.shortLabel ?? o.regulationId}
                          </span>
                        </td>
                        <td className="t-secondary">{o.framework}</td>
                        <td className="t-secondary">
                          <p
                            className={expandedId === o.id ? "" : "t-clamp-2"}
                            style={{ margin: 0 }}
                          >
                            {o.summary}
                          </p>
                          {o.summary.length > SUMMARY_CLAMP_AT && (
                            <button
                              type="button"
                              className={`row-expand ${expandedId === o.id ? "is-expanded" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setExpandedId((id) => (id === o.id ? null : o.id));
                              }}
                              aria-expanded={expandedId === o.id}
                              aria-label={
                                expandedId === o.id
                                  ? `Show less of ${o.id} summary`
                                  : `Show more of ${o.id} summary`
                              }
                            >
                              {expandedId === o.id ? "Show less" : "Read more"}
                              <span className="row-expand__chev" aria-hidden="true">▾</span>
                            </button>
                          )}
                        </td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className="numeric">
                          <CompletenessBar value={o.completeness} />
                        </td>
                        <td className="mono">{o.deadline ?? "—"}</td>
                        <td>{o.assignedTo ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && sorted.length > PAGE_SIZE && (
            <div className="flex-between mt-4">
              <span className="pagination__summary">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>
              <nav className="pagination" aria-label="Obligation register pages">
                <button
                  type="button"
                  className="pagination__btn"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <Icon name="chevron-left" size="sm" />
                </button>
                {pagesArr.map((p, i) =>
                  p === "…" ? (
                    <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={["pagination__btn", page === p ? "is-active" : ""].filter(Boolean).join(" ")}
                      onClick={() => setPage(p as number)}
                      aria-current={page === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  type="button"
                  className="pagination__btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <Icon name="chevron-right" size="sm" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
