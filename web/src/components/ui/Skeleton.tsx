/**
 * Skeleton — shimmer placeholder for loading states.
 *
 * @example
 * <Skeleton variant="title" />
 * <div className="skeleton-group"><Skeleton /><Skeleton /><Skeleton variant="block" /></div>
 */

type SkeletonVariant = "text" | "title" | "block" | "circle" | "avatar";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

export default function Skeleton({ variant = "text", className = "" }: SkeletonProps) {
  const cls = ["skeleton", `skeleton--${variant}`, className].filter(Boolean).join(" ");
  return <div className={cls} aria-hidden="true" />;
}
