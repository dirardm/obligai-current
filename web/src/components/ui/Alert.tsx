/**
 * Alert — info / warning / error / success banner with optional title.
 *
 * @example
 * <Alert variant="error" title="Conflict detected">Two obligations conflict on this rule.</Alert>
 */

import { forwardRef } from "react";

type AlertVariant = "info" | "warning" | "error" | "success";

interface AlertProps extends React.ComponentPropsWithoutRef<"div"> {
  variant: AlertVariant;
  title?: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant, title, className = "", children, ...props }, ref) => {
    const cls = ["alert", `alert--${variant}`, className].filter(Boolean).join(" ");
    return (
      <div ref={ref} className={cls} role="alert" {...props}>
        {title && <p className="alert__title">{title}</p>}
        {children}
      </div>
    );
  }
);

Alert.displayName = "Alert";
export default Alert;
