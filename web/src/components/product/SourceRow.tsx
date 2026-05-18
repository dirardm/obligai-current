/**
 * @example
 * <SourceRow source={source} onClick={(id) => openPanel(id)} />
 */
import type { RegulationId } from "@/data/registry";
import type { Jurisdiction } from "@/data/registry";
import Flag from "@/components/ui/Flag";
import Icon from "@/components/ui/Icon";

export interface Source {
  id: string;
  title: string;
  regulationId: RegulationId;
  regulationLabel: string;
  jurisdiction: Jurisdiction;
  type: "circular" | "rulebook" | "guideline" | "notice" | "regulation" | "ordinance";
  publishedDate: string;
  effectiveDate?: string;
  url?: string;
}

interface SourceRowProps {
  source: Source;
  onClick?: (id: string) => void;
}

const TYPE_LABELS: Record<Source["type"], string> = {
  circular:   "Circular",
  rulebook:   "Rulebook",
  guideline:  "Guideline",
  notice:     "Notice",
  regulation: "Regulation",
  ordinance:  "Ordinance",
};

export default function SourceRow({ source, onClick }: SourceRowProps) {
  return (
    <tr
      className={onClick ? "is-clickable" : undefined}
      onClick={() => onClick?.(source.id)}
    >
      <td>
        <div className="flex-start gap-2">
          <Flag cc={source.jurisdiction.cc} size="sm" />
          <span>{source.jurisdiction.label}</span>
        </div>
      </td>
      <td>
        <span className={`badge--regulation badge--${source.regulationId}`}>
          {source.regulationLabel}
        </span>
      </td>
      <td>{source.title}</td>
      <td>
        <span className="tag tag-domain">{TYPE_LABELS[source.type]}</span>
      </td>
      <td className="mono">{source.publishedDate}</td>
      {source.url && (
        <td>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-start gap-1"
          >
            <Icon name="external-link" size="sm" ctx="muted" />
          </a>
        </td>
      )}
    </tr>
  );
}
