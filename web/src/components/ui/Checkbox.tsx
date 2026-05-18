/**
 * Checkbox — styled checkbox with optional label.
 *
 * @example
 * <Checkbox label="Active only" />
 */

import { forwardRef } from "react";

interface CheckboxProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const checkId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="check-row" htmlFor={checkId}>
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          className={["checkbox", className].filter(Boolean).join(" ")}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
