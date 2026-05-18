/**
 * Input — text field with label, helper, error, and optional leading icon.
 *
 * @example
 * <Input label="Regulation ID" placeholder="OBLIG-LCR-0001" />
 * <Input label="Search" error="Required" />
 */

import { forwardRef } from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helper, error, icon, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const inputCls = ["input", error ? "error" : "", className].filter(Boolean).join(" ");

    return (
      <div className="field">
        {label && (
          <label className="label" htmlFor={inputId}>
            {label}
          </label>
        )}
        {icon ? (
          <div className="input-group">
            <span className="input-group__icon">{icon}</span>
            <input ref={ref} id={inputId} className={inputCls} {...props} />
          </div>
        ) : (
          <input ref={ref} id={inputId} className={inputCls} {...props} />
        )}
        {(helper || error) && (
          <span className={["helper", error ? "error" : ""].filter(Boolean).join(" ")}>
            {error ?? helper}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
