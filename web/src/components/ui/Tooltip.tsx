/**
 * Tooltip — text hint that appears on hover after 400 ms.
 * Pure CSS implementation; no JS positioning.
 *
 * @example
 * <Tooltip content="View full detail"><Button variant="ghost">Detail</Button></Tooltip>
 */

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className = "" }: TooltipProps) {
  return (
    <span
      className={["tooltip", className].filter(Boolean).join(" ")}
      data-tip={content}
    >
      {children}
    </span>
  );
}
