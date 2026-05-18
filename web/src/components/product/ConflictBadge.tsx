/**
 * @example
 * <ConflictBadge count={3} />
 * <ConflictBadge label="Unresolved" />
 */

interface ConflictBadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  count?: number;
  label?: string;
}

import StatusBadge from "./StatusBadge";

export default function ConflictBadge({ count, label, className = "", ...props }: ConflictBadgeProps) {
  const text = label ?? (count !== undefined ? `${count} conflict${count !== 1 ? "s" : ""}` : "Conflict");
  return <StatusBadge status="conflicted" label={text} className={className} {...props} />;
}
