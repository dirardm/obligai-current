interface CompletenessBarProps {
  value: number;
}

export default function CompletenessBar({ value }: CompletenessBarProps) {
  const pct = `${Math.max(0, Math.min(100, value))}%`;
  return (
    <div className="completeness-bar">
      <div className="completeness-bar__fill" style={{ "--value": pct } as React.CSSProperties} />
    </div>
  );
}
