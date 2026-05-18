"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

const PINNED_KEY = "obligai.sidebar.pinned";

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
