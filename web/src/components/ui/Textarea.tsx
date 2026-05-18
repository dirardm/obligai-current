/**
 * Textarea — resizable text area with label, helper and error states.
 *
 * @example
 * <Textarea label="Summary" rows={4} />
 */

import { forwardRef } from "react";

interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  helper?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, error, className = "", id, ...props }, ref) => {
    const areaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const cls = ["textarea", error ? "error" : "", className].filter(Boolean).join(" ");

    return (
      <div className="field">
        {label && (
          <label className="label" htmlFor={areaId}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={areaId} className={cls} {...props} />
        {(helper || error) && (
          <span className={["helper", error ? "error" : ""].filter(Boolean).join(" ")}>
            {error ?? helper}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
