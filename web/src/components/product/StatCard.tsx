/**
 * @example
 * <StatCard value={432} label="Total Obligations" />
 * <StatCard value="12" label="Conflicted" />
 */
interface StatCardProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string | number;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className = "", ...props }: StatCardProps) {
  const cls = ["card", "card--stat-compact", className].filter(Boolean).join(" ");
  return (
    <section className={cls} {...props}>
      <div className="stat-num">{value}</div>
      <div className="stat-label">{label}</div>
    </section>
  );
}
