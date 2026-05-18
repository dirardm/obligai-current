/**
 * Button — four variants × three sizes. Wraps .btn from the canonical stylesheet.
 *
 * @example
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="icon" aria-label="Close"><Icon name="close" /></Button>
 */

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block = false, className = "", children, ...props }, ref) => {
    const cls = [
      "btn",
      `btn-${variant}`,
      size !== "md" ? `btn--size-${size}` : "",
      block ? "btn--block" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
