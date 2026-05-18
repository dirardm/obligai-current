/**
 * Badge — regulation colour badge or status indicator.
 *
 * @example
 * <Badge type="regulation" regulation="lcr" />
 * <Badge type="status" status="active" />
 */

import type { RegulationId } from "@/data/registry";

type StatusValue = "active" | "conflicted" | "implementing" | "pending" | "inactive";

interface RegulationBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  type: "regulation";
  regulation: RegulationId;
  label?: string;
}

interface StatusBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  type: "status";
  status: StatusValue;
}

type BadgeProps = RegulationBadgeProps | StatusBadgeProps;

export default function Badge(props: BadgeProps) {
  if (props.type === "regulation") {
    const { regulation, label, className = "", type: _t, ...rest } = props;
    const cls = ["badge--regulation", `badge--${regulation}`, className].filter(Boolean).join(" ");
    return (
      <span className={cls} {...rest}>
        {label ?? regulation.toUpperCase()}
      </span>
    );
  }

  const { status, className = "", type: _t, ...rest } = props;
  const cls = ["badge--status", `badge--status-${status}`, className].filter(Boolean).join(" ");
  return <span className={cls} {...rest} />;
}
