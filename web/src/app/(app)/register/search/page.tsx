import Link from "next/link";
import { OBLIGATIONS } from "@/data/obligations";
import { REGULATIONS } from "@/data/registry";
import ScopeControl from "@/components/product/ScopeControl";
import StatusBadge from "@/components/product/StatusBadge";
import CompletenessBar from "@/components/product/CompletenessBar";
import Icon from "@/components/ui/Icon";

const REG_MAP = Object.fromEntries(REGULATIONS.map((r) => [r.id, r]));

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.toLowerCase().trim();

  const results = query
    ? OBLIGATIONS.filter((o) => {
        const reg = REG_MAP[o.regulationId];
        return (
          o.id.toLowerCase().includes(query) ||
          o.summary.toLowerCase().includes(query) ||
          (reg?.shortLabel ?? o.regulationId).toLowerCase().includes(query) ||
          o.framework.toLowerCase().includes(query) ||
          (o.assignedTo ?? "").toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <div>
      <ScopeControl />

      <div className="flex-between mt-4 mb-3">
        <div>
          <h1 className="t-h1">Search results</h1>
          {query && (
            <p className="t-secondary t-small mt-1">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;
            </p>
          )}
        </div>
        <Link href="/register" className="btn btn-ghost btn--size-sm">
          ← Back to register
        </Link>
      </div>

      {!query ? (
        <p className="t-secondary">Enter a search term to find obligations.</p>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">
            <Icon name="search" />
          </div>
          <p className="empty-state__title">No results found</p>
          <p className="empty-state__body">
            No obligations match &ldquo;{q}&rdquo;. Try a different search term.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table" aria-label={`Search results for ${q}`}>
            <thead className="table-header">
              <tr>
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
              {results.map((o) => {
                const reg = REG_MAP[o.regulationId];
                return (
                  <tr key={o.id}>
                    <td className="mono">
                      <Link href={`/register/${o.id}`}>{o.id}</Link>
                    </td>
                    <td>
                      <span className={`badge--regulation badge--${o.regulationId}`}>
                        {reg?.shortLabel ?? o.regulationId}
                      </span>
                    </td>
                    <td className="t-secondary">{o.framework}</td>
                    <td className="t-secondary">{o.summary}</td>
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
    </div>
  );
}
