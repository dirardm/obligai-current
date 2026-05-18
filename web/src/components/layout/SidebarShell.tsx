"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

const PINNED_KEY = "obligai.sidebar.pinned";

const MARK_PATHS = (
  <>
    <line x1="80" y1="46" x2="80" y2="34" stroke="#B85C3A" strokeWidth="3" strokeLinecap="round"/>
    <line x1="88" y1="61" x2="109" y2="75" stroke="#B85C3A" strokeWidth="3" strokeLinecap="round"/>
    <line x1="72" y1="62" x2="55" y2="74" stroke="#B85C3A" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="80" cy="56" r="10" fill="#B85C3A"/>
    <circle cx="80" cy="28" r="6" fill="none" stroke="#B85C3A" strokeWidth="3"/>
    <circle cx="114" cy="78" r="6" fill="none" stroke="#B85C3A" strokeWidth="3"/>
    <circle cx="50" cy="78" r="6" fill="none" stroke="#B85C3A" strokeWidth="3"/>
  </>
);

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(PINNED_KEY) === "true";
  });
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;

  useEffect(() => {
    try { localStorage.setItem(PINNED_KEY, String(pinned)); } catch { /* ignore */ }
  }, [pinned]);

  return (
    <aside
      className={`sidebar ${expanded ? "sidebar--expanded" : "sidebar--collapsed"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="sidebar__brand">
        {expanded ? (
          <span className="logo logo--sm" aria-label="ObligaI">
            <svg viewBox="0 0 160 124" xmlns="http://www.w3.org/2000/svg">
              {MARK_PATHS}
              <text
                x="80" y="108" textAnchor="middle"
                fontFamily="Inter, -apple-system, Helvetica, Arial, sans-serif"
                fontWeight="500" fontSize="24" fill="currentColor" letterSpacing="-0.3"
              >
                Obliga
                <tspan
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontStyle="italic" fill="#B85C3A" dx="-0.04em"
                >I</tspan>
              </text>
            </svg>
          </span>
        ) : (
          <span className="logo" style={{ width: "32px" }} aria-label="ObligaI mark">
            <svg viewBox="40 14 80 80" xmlns="http://www.w3.org/2000/svg">
              {MARK_PATHS}
            </svg>
          </span>
        )}
      </div>

      {children}

      <button
        type="button"
        className="sidebar__pin"
        onClick={() => setPinned((p) => !p)}
        aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
        aria-pressed={pinned}
      >
        <Icon name="lock" size="sm" />
      </button>
    </aside>
  );
}
