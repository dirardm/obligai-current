"use client";

import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const STORAGE_KEY = "obligai-theme";

function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(STORAGE_KEY, t); } catch { /* noop */ }
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  setTheme: (theme) => { applyTheme(theme); set({ theme }); },
  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === "light" ? "dark" : "light";
      applyTheme(next);
      return { theme: next };
    }),
}));

export function initTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch { /* noop */ }
  return "light";
}
