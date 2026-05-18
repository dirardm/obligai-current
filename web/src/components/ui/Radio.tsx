/**
 * Radio — styled radio button with optional label.
 *
 * @example
 * <Radio name="status" value="active" label="Active" />
 */

import { forwardRef } from "react";

interface RadioProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const radioId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="check-row" htmlFor={radioId}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={["radio", className].filter(Boolean).join(" ")}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";
export default Radio;
