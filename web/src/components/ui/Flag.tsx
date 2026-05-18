/**
 * Flag — jurisdiction flag from the SVG sprite. Uses /assets/flags.svg.
 *
 * @example
 * <Flag cc="eu" size="md" />
 * <Flag cc="us" size="lg" />
 */

type FlagSize = "sm" | "md" | "lg" | "xl";

interface FlagProps extends React.ComponentPropsWithoutRef<"span"> {
  cc: string;
  size?: FlagSize;
}

export default function Flag({ cc, size = "md", className = "", ...props }: FlagProps) {
  const cls = ["flag", `flag--${size}`, className].filter(Boolean).join(" ");

  return (
    <span className={cls} aria-label={cc.toUpperCase()} {...props}>
      <svg focusable="false" aria-hidden="true">
        <use href={`/assets/flags.svg#flag-${cc}`} />
      </svg>
    </span>
  );
}
