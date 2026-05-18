/**
 * @example
 * <ObligationDetail obligation={o} regulation={reg} jurisdiction={juris} />
 */

import type { Obligation } from "@/data/obligations";
import type { Regulation, Jurisdiction } from "@/data/registry";
import StatusBadge from "./StatusBadge";
import CompletenessBar from "./CompletenessBar";
import ValidationScore from "./ValidationScore";
import JurisdictionTag from "./JurisdictionTag";
import ConflictBadge from "./ConflictBadge";
import Tag from "@/components/ui/Tag";
import Icon from "@/components/ui/Icon";

interface ObligationDetailProps {
  obligation: Obligation;
  regulation: Regulation;
  jurisdiction: Jurisdiction;
  validationScore?: number;
  domains?: string[];
  frameworks?: string[];
}

export default function ObligationDetail({
  obligation,
  regulation,
  jurisdiction,
  validationScore,
  domains = [],
  frameworks = [],
}: ObligationDetailProps) {
  const hasConflicts = obligation.conflicts.length > 0;

  return (
    <div className="flex-col gap-6">

      {/* Header — status, regulation badge, validation score */}
      <div className="flex-between">
        <div className="flex-col gap-2">
          <span className="t-eyebrow">{obligation.id}</span>
          <h1 className="t-h1">{obligation.citation}</h1>
          <div className="flex-start gap-2 mt-2">
            <StatusBadge status={obligation.status} />
            <span className={`badge--regulation badge--${obligation.regulationId}`}>
              {regulation.shortLabel}
            </span>
            <JurisdictionTag jurisdiction={jurisdiction} />
          </div>
        </div>

        {validationScore !== undefined && (
          <div className="flex-col gap-1 flex-end">
            <span className="t-label">Validation Score</span>
            <ValidationScore score={validationScore} />
          </div>
        )}
      </div>

      {/* Two-column body */}
      <div className="grid-2 gap-6">

        {/* Left — What · How · Deadline · Responsible */}
        <div className="flex-col gap-4">

          <div className="card flex-col gap-4">
            {/* What */}
            <div>
              <span className="t-label">What</span>
              <p className="t-body mt-2">{obligation.summary}</p>
            </div>

            <hr className="divider" />

            {/* How */}
            <div>
              <span className="t-label">How</span>
              <p className="t-body mt-2">{regulation.framework}</p>
              {(domains.length > 0 || frameworks.length > 0) && (
                <div className="flex-start gap-2 mt-3 flex-wrap">
                  {domains.map((d) => <Tag key={d} variant="domain">{d}</Tag>)}
                  {frameworks.map((f) => <Tag key={f} variant="framework">{f}</Tag>)}
                </div>
              )}
            </div>

            <hr className="divider" />

            {/* Deadline */}
            <div>
              <span className="t-label">Deadline</span>
              <p className={`t-mono mt-2${obligation.deadline ? "" : " t-muted"}`}>
                {obligation.deadline ?? "No fixed deadline"}
              </p>
            </div>

            <hr className="divider" />

            {/* Responsible */}
            <div>
              <span className="t-label">Responsible</span>
              <p className={`t-body mt-2${obligation.assignedTo ? "" : " t-muted"}`}>
                {obligation.assignedTo ?? "Unassigned"}
              </p>
            </div>
          </div>

          {/* Completeness */}
          <div className="card flex-col gap-3">
            <div className="flex-between">
              <span className="t-label">Completeness</span>
              <span className="t-label">{obligation.completeness}%</span>
            </div>
            <CompletenessBar value={obligation.completeness} />
          </div>
        </div>

        {/* Right — Linked controls · Conflicts · Audit trail */}
        <div className="flex-col gap-4">

          {/* Linked controls */}
          <div className="card flex-col gap-3">
            <span className="t-label">Linked Controls</span>
            {obligation.linkedControls.length > 0 ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Control ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obligation.linkedControls.map((ctrl) => (
                      <tr key={ctrl}>
                        <td className="mono">{ctrl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="t-body t-muted">No controls linked.</p>
            )}
          </div>

          {/* Conflict indicators */}
          <div className="card flex-col gap-3">
            <div className="flex-between">
              <span className="t-label">Conflicts</span>
              {hasConflicts && <ConflictBadge count={obligation.conflicts.length} />}
            </div>
            {hasConflicts ? (
              <div className="flex-col gap-2">
                {obligation.conflicts.map((cid) => (
                  <div key={cid} className="flex-start gap-2">
                    <Icon name="conflict" size="sm" ctx="error" />
                    <span className="t-mono">{cid}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="t-body t-muted">No conflicts detected.</p>
            )}
          </div>

          {/* Audit trail */}
          <div className="card flex-col gap-3">
            <span className="t-label">Audit Trail</span>
            <div className="flex-col gap-2">
              <div className="flex-between">
                <span className="t-mono">{obligation.lastUpdated}</span>
                <span className="t-label">Last updated</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
