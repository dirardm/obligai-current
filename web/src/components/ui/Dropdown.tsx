/**
 * Dropdown — anchored menu with items, dividers and groups.
 *
 * @example
 * <Dropdown trigger={<Button variant="secondary">Actions ▾</Button>} items={[{ label: "Edit", onClick: () => {} }]} />
 */

"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  shortcut?: string;
  selected?: boolean;
}

type DropdownEntry = DropdownItem | "divider" | { group: string; items: DropdownItem[] };

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownEntry[];
  className?: string;
}

export default function Dropdown({ trigger, items, className = "" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={["menu-wrap", open ? "is-open" : "", className].filter(Boolean).join(" ")}
    >
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <div className="menu menu--anchored" role="menu">
        {items.map((item, i) => {
          if (item === "divider") return <hr key={i} className="menu__divider" />;
          if ("group" in item) {
            return (
              <div key={i} className="menu__group">
                <span className="menu__group-label">{item.group}</span>
                {item.items.map((gi, j) => (
                  <button
                    key={j}
                    role="menuitem"
                    className={[
                      "menu__item",
                      gi.danger ? "menu__item--danger" : "",
                      gi.selected ? "is-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => { gi.onClick?.(); setOpen(false); }}
                    disabled={gi.disabled}
                  >
                    {gi.label}
                    {gi.shortcut && <span className="menu__item__shortcut">{gi.shortcut}</span>}
                  </button>
                ))}
              </div>
            );
          }
          return (
            <button
              key={i}
              role="menuitem"
              className={[
                "menu__item",
                item.danger ? "menu__item--danger" : "",
                item.selected ? "is-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              disabled={item.disabled}
            >
              {item.label}
              {item.shortcut && <span className="menu__item__shortcut">{item.shortcut}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
