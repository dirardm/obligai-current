/**
 * Spinner — animated loading indicator.
 *
 * @example
 * <Spinner />
 * <Spinner size="lg" centred />
 */

type SpinnerSize = "sm" | "default" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  centred?: boolean;
  className?: string;
  label?: string;
}

export default function Spinner({ size = "default", centred = false, className = "", label = "Loading…" }: SpinnerProps) {
  const cls = [
    "spinner",
    size === "sm" ? "spinner--sm" : size === "lg" ? "spinner--lg" : "",
    centred ? "spinner--centered" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cls} role="status" aria-label={label} />;
}
