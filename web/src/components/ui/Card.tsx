"use client";

import { useState } from "react";

type Props = {
  title?: string;
  trailing?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  children: React.ReactNode;
};

export default function Card({
  title,
  trailing,
  collapsible = false,
  defaultCollapsed = false,
  className = "",
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <section className={`card${collapsed ? " card--collapsed" : ""}${className ? ` ${className}` : ""}`}>
      {(title || collapsible) && (
        <header className="card__header">
          {title && <h3 className="t-label m-0">{title}</h3>}
          <div className="card__header__actions">
            {trailing}
            {collapsible && (
              <button
                type="button"
                className="card__collapse"
                onClick={() => setCollapsed((c) => !c)}
                aria-expanded={!collapsed}
                aria-label={collapsed ? "Expand card" : "Collapse card"}
              >
                <span className="card__collapse__chev" aria-hidden="true">▾</span>
              </button>
            )}
          </div>
        </header>
      )}
      {!collapsed && <div className="card__body">{children}</div>}
    </section>
  );
}
