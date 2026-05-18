/**
 * @example
 * <StatusBadge status="active" />
 * <StatusBadge status="conflicted" label="2 conflicts" />
 */
import type { RegulationId } from "@/data/registry";

export type StatusValue = "active" | "conflicted" | "implementing" | "pending" | "inactive";

const LABELS: Record<StatusValue, string> = {
  active:        "Active",
  conflicted:    "Conflicted",
  implementing:  "Implementing",
  pending:       "Pending",
  inactive:      "Inactive",
};

interface StatusBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  status: StatusValue;
  label?: string;
}

export default function StatusBadge({ status, label, className = "", ...props }: StatusBadgeProps) {
  const cls = ["badge--status", `badge--status-${status}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...props}>
      {label ?? LABELS[status]}
    </span>
  );
}
