/**
 * @example
 * <ValidationScore score={84} />
 * <ValidationScore score={42} total={100} level="low" />
 */
type ScoreLevel = "high" | "medium" | "low";

interface ValidationScoreProps {
  score: number;
  total?: number;
  level?: ScoreLevel;
  className?: string;
}

function deriveLevel(score: number, total: number): ScoreLevel {
  const pct = score / total;
  if (pct >= 0.8) return "high";
  if (pct >= 0.5) return "medium";
  return "low";
}

export default function ValidationScore({ score, total = 100, level, className = "" }: ValidationScoreProps) {
  const resolvedLevel = level ?? deriveLevel(score, total);
  const cls = ["validation-score", `validation-score--${resolvedLevel}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls}>
      {score}
      <small>/ {total}</small>
    </span>
  );
}
