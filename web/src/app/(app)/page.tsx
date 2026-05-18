"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OBLIGATIONS } from "@/data/obligations";
import { REGULATIONS, JURISDICTIONS } from "@/data/registry";
import { useScopeStore } from "@/store/scope";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import ScopeControl from "@/components/product/ScopeControl";
import StatCard from "@/components/product/StatCard";
import StatusBadge from "@/components/product/StatusBadge";
import CompletenessBar from "@/components/product/CompletenessBar";

const REG_MAP = Object.fromEntries(REGULATIONS.map((r) => [r.id, r]));

export default function DashboardPage() {
  const router = useRouter();
  const { selectedRegulations } = useScopeStore();

  const scoped = useMemo(() => {
    if (selectedRegulations.length === 0) return OBLIGATIONS;
    return OBLIGATIONS.filter((o) => selectedRegulations.includes(o.regulationId));
  }, [selectedRegulations]);

  /* ── Stat cards ─────────────────────────────────────────────── */
  const total        = scoped.length;
  const conflicted   = scoped.filter((o) => o.status === "conflicted").length;
  const implementing = scoped.filter((o) => o.status === "implementing").length;
  const pending      = scoped.filter((o) => o.status === "pending").length;

  /* ── Jurisdiction bar chart ──────────────────────────────────── */
  const jurisRows = useMemo(() => {
    const map = new Map<string, { label: string; total: number }>();
    JURISDICTIONS.forEach((j) => map.set(j.id, { label: j.label, total: 0 }));

    scoped.forEach((o) => {
      const entry = map.get(o.jurisdictionId);
      if (!entry) return;
      entry.total++;
    });

    const rows = Array.from(map.entries())
      .filter(([, v]) => v.total > 0)
      .map(([jid, v]) => ({ jid, label: v.label, total: v.total }))
      .sort((a, b) => b.total - a.total);

    const max = Math.max(...rows.map((r) => r.total), 1);
    return { rows, max };
  }, [scoped]);

  /* ── Recent regulatory changes ───────────────────────────────── */
  const recentChanges = useMemo(
    () => [...scoped].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)),
    [scoped],
  );
  const RECENT_VISIBLE = 10;

  /* ── Coverage summary ────────────────────────────────────────── */
  const coverageData = useMemo(() => {
    const regsToShow =
      selectedRegulations.length > 0
        ? REGULATIONS.filter((r) => selectedRegulations.includes(r.id))
        : REGULATIONS;

    return regsToShow
      .map((reg) => {
        const regObls = scoped.filter((o) => o.regulationId === reg.id);
        const avg =
          regObls.length > 0
            ? Math.round(regObls.reduce((s, o) => s + o.completeness, 0) / regObls.length)
            : 0;
        return { reg, avg, count: regObls.length };
      })
      .filter((d) => d.count > 0);
  }, [scoped, selectedRegulations]);

  /* ── Upcoming deadlines (next 30 days) ───────────────────────── */
  const upcomingDeadlines = useMemo(() => {
    const nowMs = Date.now();
    const cutMs = nowMs + 30 * 24 * 60 * 60 * 1000;
    return scoped
      .filter((o) => {
        if (!o.deadline) return false;
        const ms = new Date(o.deadline).getTime();
        return ms >= nowMs && ms <= cutMs;
      })
      .sort((a, b) => a.deadline!.localeCompare(b.deadline!))
      .slice(0, 5);
  }, [scoped]);

  const daysUntilNext = useMemo(() => {
    const future = scoped
      .filter((o) => o.deadline && new Date(o.deadline).getTime() > Date.now())
      .sort((a, b) => a.deadline!.localeCompare(b.deadline!));
    if (!future.length) return null;
    return Math.ceil((new Date(future[0].deadline!).getTime() - Date.now()) / 86_400_000);
  }, [scoped]);

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/register/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      <ScopeControl />

      <form onSubmit={handleSearch} className="register-search mt-4 mb-2">
        <input
          type="search"
          className="input"
          placeholder="Search obligations by ID, summary, regulation, framework or assignee…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search obligations"
        />
        <button type="submit" className="btn btn-secondary btn--size-md">
          <Icon name="search" size="sm" />
          Search
        </button>
      </form>

      <div className="dashboard-grid mt-4">

        {/* ── Stat cards (4 × span-3) ─────────────────────── */}
        <StatCard className="span-3" value={total}        label="Total Obligations" />
        <StatCard className="span-3" value={conflicted}   label="Conflicted" />
        <StatCard className="span-3" value={implementing} label="Implementing" />
        <StatCard className="span-3" value={pending}      label="Pending" />

        {/* ── Recent regulatory changes (span-8) ──────────── */}
        <Card
          className="span-8"
          title="Recent regulatory changes"
          trailing={
            <div className="flex-start gap-4">
              <span className="t-small t-muted">Last 14 days</span>
              {recentChanges.length > RECENT_VISIBLE && (
                <a href="/register" className="btn btn-ghost btn--size-sm" role="button">View all {recentChanges.length}</a>
              )}
            </div>
          }
          collapsible
        >
          {recentChanges.length === 0 ? (
            <p className="t-secondary t-small">No recent changes in scope.</p>
          ) : (
            <div className="table-wrap">
              <table className="table table--compact" aria-label="Recent regulatory changes">
                <thead className="table-header">
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">ID</th>
                    <th scope="col">Regulation</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentChanges.slice(0, RECENT_VISIBLE).map((o) => (
                    <tr key={o.id} className="is-clickable" onClick={() => router.push(`/register/${o.id}`)}>
                      <td className="mono">{o.lastUpdated}</td>
                      <td className="mono">{o.id}</td>
                      <td>
                        <span className={`badge--regulation badge--${o.regulationId}`}>
                          {REG_MAP[o.regulationId]?.shortLabel ?? o.regulationId}
                        </span>
                      </td>
                      <td><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ── Upcoming deadlines (span-4) ──────────────────── */}
        <Card
          className="span-4"
          title="Upcoming deadlines"
          trailing={<span className="t-small t-muted">Next 30 days</span>}
          collapsible
        >
          {upcomingDeadlines.length === 0 ? (
            <div className="empty-state empty-state--compact">
              <p className="empty-state__title">All clear</p>
              <p className="empty-state__body">
                No obligations due in the next 30 days.
                {daysUntilNext !== null && ` Next deadline in ${daysUntilNext} days.`}
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table table--compact" aria-label="Upcoming deadlines">
                <tbody>
                  {upcomingDeadlines.map((o) => {
                    const days = Math.ceil(
                      (new Date(o.deadline!).getTime() - Date.now()) / 86_400_000,
                    );
                    const daysLabel = days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`;
                    return (
                      <tr key={o.id} className="is-clickable" onClick={() => router.push(`/register/${o.id}`)}>
                        <td className="mono">{o.id}</td>
                        <td>
                          <span className={`badge--regulation badge--${o.regulationId}`}>
                            {REG_MAP[o.regulationId]?.shortLabel ?? o.regulationId}
                          </span>
                        </td>
                        <td className={days <= 7 ? "t-strong" : "t-muted"}>{daysLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ── Coverage card (span-8) ──────────────────────── */}
        {coverageData.length > 0 && (
          <Card
            className="span-8"
            title="Coverage"
            trailing={<span className="t-small t-secondary">Average completeness by regulation</span>}
            collapsible
          >
            <div className="grid-coverage">
              {coverageData.map(({ reg, avg }) => (
                <div key={reg.id} className="coverage-cell">
                  <span className={`badge--regulation badge--${reg.id}`}>{reg.shortLabel}</span>
                  <div className="mt-2"><CompletenessBar value={avg} /></div>
                  <span className="mono t-muted mt-2">{avg}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Jurisdiction bar chart (span-4) ─────────────── */}
        <Card className="span-4" title="Obligations by Jurisdiction" collapsible>
          {jurisRows.rows.length === 0 ? (
            <p className="t-secondary t-small">No obligations in scope.</p>
          ) : (
            <div aria-label="Horizontal bar chart: obligations by jurisdiction" role="img">
              {jurisRows.rows.map(({ jid, label, total: rowTotal }) => (
                <div key={jid} className="hbar-row">
                  <span className="hbar-row__label">{label}</span>
                  <div className="hbar-row__bar">
                    <div className="hbar" aria-hidden="true">
                      <div
                        className="hbar-seg"
                        style={{
                          "--seg-w": `${(rowTotal / jurisRows.max) * 100}%`,
                          "--juris-color": `var(--color-juris-${jid})`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                  <span className="hbar-row__count">{rowTotal}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
