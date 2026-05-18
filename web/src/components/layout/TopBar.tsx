"use client";

import { useThemeStore } from "@/store/theme";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

export default function TopBar() {
  const { theme, toggle } = useThemeStore();

  return (
    <header className="topbar">
      <div className="topbar__left" />

      <div className="topbar__search">
        <div className="input-group">
          <span className="input-group__icon">
            <Icon name="search" size="md" ctx="muted" />
          </span>
          <input
            type="search"
            className="input"
            placeholder="Search obligations, regulations, controls…"
            aria-label="Search"
          />
        </div>
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
