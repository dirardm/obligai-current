"use client";

import { useEffect } from "react";
import { useThemeStore, initTheme } from "@/store/theme";

export default function ThemeBootstrap() {
  const setTheme = useThemeStore((s) => s.setTheme);
  useEffect(() => { setTheme(initTheme()); }, [setTheme]);
  return null;
}
