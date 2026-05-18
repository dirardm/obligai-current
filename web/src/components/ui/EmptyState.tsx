/**
 * EmptyState — zero-data surface with icon, title, body and optional action.
 *
 * @example
 * <EmptyState icon={<Icon name="obligation" size="2xl" />} title="No obligations" body="Add a regulation to get started." action={<Button>Add regulation</Button>} />
 */

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export default function EmptyState({ icon, title, body, action, compact = false, className = "" }: EmptyStateProps) {
  const cls = [
    "empty-state",
    compact ? "empty-state--compact" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <p className="empty-state__title">{title}</p>
      {body && <p className="empty-state__body">{body}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
