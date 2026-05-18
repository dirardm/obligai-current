/**
 * Tabs — horizontal tab strip with active underline indicator.
 *
 * @example
 * <Tabs tabs={[{ label: "Overview", value: "overview" }]} active="overview" onChange={setTab} />
 */

"use client";

interface Tab {
  label: string;
  value: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div className={["tabs", className].filter(Boolean).join(" ")} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={t.value === active}
          className={["tab", t.value === active ? "is-active" : ""].filter(Boolean).join(" ")}
          onClick={() => !t.disabled && onChange(t.value)}
          disabled={t.disabled}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
