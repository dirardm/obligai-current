/**
 * @example
 * <RegulationCard regulation={reg} jurisdiction={juris} />
 * <RegulationCard regulation={reg} selected />
 */
import type { Regulation, Jurisdiction } from "@/data/registry";
import Flag from "@/components/ui/Flag";

interface RegulationCardProps extends React.ComponentPropsWithoutRef<"div"> {
  regulation: Regulation;
  jurisdiction?: Jurisdiction;
  selected?: boolean;
}

export default function RegulationCard({
  regulation,
  jurisdiction,
  selected = false,
  className = "",
  children,
  ...props
}: RegulationCardProps) {
  const cls = [
    "card",
    "regulation-card",
    `regulation-card--${regulation.id}`,
    selected ? "selected" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} {...props}>
      <div className="regulation-card__id">{regulation.id.toUpperCase()}</div>
      <div className="regulation-card__title">{regulation.label}</div>
      {jurisdiction && (
        <div className="flex-start mt-3 gap-2">
          <Flag cc={jurisdiction.cc} size="sm" />
          <span className="t-label t-muted">{jurisdiction.label}</span>
        </div>
      )}
      {children}
    </div>
  );
}
