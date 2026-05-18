"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

export default function TopBar() {
  const { theme, toggle } = useThemeStore();
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/register/search?q=${encodeURIComponent(q.trim())}`);
      setQ("");
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__left" />

      <div className="topbar__search">
        <form onSubmit={handleSearch}>
          <div className="input-group">
            <span className="input-group__icon">
              <Icon name="search" size="md" ctx="muted" />
            </span>
            <input
              type="search"
              className="input"
              placeholder="Search obligations, regulations, controls…"
              aria-label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </form>
      </div>

      <div className="topbar__right">
        <div className="btn--group" role="group" aria-label="Theme">
          <Button
            variant={theme === "light" ? "primary" : "secondary"}
            size="sm"
            onClick={() => theme !== "light" && toggle()}
            aria-pressed={theme === "light"}
            title="Light mode"
          >
            <Icon name="sun" size="sm" />
          </Button>
          <Button
            variant={theme === "dark" ? "primary" : "secondary"}
            size="sm"
            onClick={() => theme !== "dark" && toggle()}
            aria-pressed={theme === "dark"}
            title="Dark mode"
          >
            <Icon name="moon" size="sm" />
          </Button>
        </div>

        <button className="btn btn-secondary btn--size-sm btn-icon" aria-label="User account">
          <Icon name="user" size="md" />
        </button>
      </div>
    </header>
  );
}
