/**
 * @example
 * <ObligationRow obligation={o} selected={false} onClick={(id) => router.push(`/register/${id}`)} />
 * <ObligationRow obligation={o} selected onSelect={(id) => toggle(id)} />
 */
import type { RegulationId } from "@/data/registry";
import StatusBadge, { type StatusValue } from "./StatusBadge";
import CompletenessBar from "./CompletenessBar";

export interface Obligation {
  id: string;
  ref: string;
  title: string;
  regulationId: RegulationId;
  regulationLabel: string;
  status: StatusValue;
  completeness: number;
  dueDate?: string;
  owner?: string;
}

interface ObligationRowProps {
  obligation: Obligation;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function ObligationRow({ obligation, selected = false, onSelect, onClick }: ObligationRowProps) {
  const { id, ref, title, regulationId, regulationLabel, status, completeness, dueDate, owner } = obligation;

  return (
    <tr
      className={[selected && "is-selected", onClick && "is-clickable"].filter(Boolean).join(" ") || undefined}
      onClick={() => onClick?.(id)}
    >
      {onSelect && (
        <td className="numeric" onClick={(e) => { e.stopPropagation(); onSelect(id); }}>
          <input type="checkbox" checked={selected} onChange={() => onSelect(id)} aria-label={`Select ${ref}`} />
        </td>
      )}
      <td className="mono">{ref}</td>
      <td>{title}</td>
      <td>
        <span className={`badge--regulation badge--${regulationId}`}>{regulationLabel}</span>
      </td>
      <td>
        <StatusBadge status={status} />
      </td>
      <td className="numeric">
        <CompletenessBar value={completeness} />
      </td>
      {dueDate && <td className="mono">{dueDate}</td>}
      {owner !== undefined && <td>{owner}</td>}
    </tr>
  );
}
