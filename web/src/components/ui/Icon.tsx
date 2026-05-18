/**
 * Icon — SVG sprite reference. Uses /assets/icons.svg.
 *
 * @example
 * <Icon name="search" size="md" />
 * <Icon name="alert" size="lg" ctx="error" />
 */

type IconSize = "sm" | "md" | "lg" | "xl" | "2xl";
type IconCtx = "muted" | "primary" | "accent" | "error" | "success" | "inverse";

interface IconProps extends React.ComponentPropsWithoutRef<"span"> {
  name: string;
  size?: IconSize;
  ctx?: IconCtx;
}

export default function Icon({ name, size = "md", ctx, className = "", ...props }: IconProps) {
  const cls = [
    "icon",
    `icon--${size}`,
    ctx ? `icon--${ctx}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls} aria-hidden="true" {...props}>
      <svg focusable="false">
        <use href={`/assets/icons.svg#icon-${name}`} />
      </svg>
    </span>
  );
}
