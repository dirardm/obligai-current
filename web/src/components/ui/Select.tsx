/**
 * Select — native select with label, helper and error states.
 *
 * @example
 * <Select label="Status" options={[{ value: "active", label: "Active" }]} />
 */

import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  label?: string;
  helper?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helper, error, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const cls = ["select", error ? "error" : "", className].filter(Boolean).join(" ");

    return (
      <div className="field">
        {label && (
          <label className="label" htmlFor={selectId}>
            {label}
          </label>
        )}
        <select ref={ref} id={selectId} className={cls} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {(helper || error) && (
          <span className={["helper", error ? "error" : ""].filter(Boolean).join(" ")}>
            {error ?? helper}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
