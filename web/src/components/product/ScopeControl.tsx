/**
 * @example
 * <ScopeControl />
 * // State is managed globally via useScopeStore — no props required.
 * // Renders as a single slim row of active regulation pills plus an
 * // "+ Add scope" trigger. Clicking the trigger opens a popover with
 * // jurisdiction chips; selecting a jurisdiction reveals its regulations.
 */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { JURISDICTIONS, REGULATIONS, type JurisdictionId } from "@/data/registry";
import { useScopeStore } from "@/store/scope";
import Flag from "@/components/ui/Flag";

const JURIS_COLORS: Record<string, { color: string; light: string }> = {
  eu: { color: "var(--color-lcr)",               light: "var(--color-lcr-light)" },
  uk: { color: "var(--color-uk-fra)",            light: "var(--color-uk-fra-light)" },
  us: { color: "var(--color-us-fed)",            light: "var(--color-us-fed-light)" },
  ca: { color: "var(--color-canada-osfi)",       light: "var(--color-canada-osfi-light)" },
  ch: { color: "var(--color-switzerland-finma)", light: "var(--color-switzerland-finma-light)" },
  jp: { color: "var(--color-japan-bsr)",         light: "var(--color-japan-bsr-light)" },
  sg: { color: "var(--color-singapore-mas)",     light: "var(--color-singapore-mas-light)" },
  hk: { color: "var(--color-hongkong-hkma)",     light: "var(--color-hongkong-hkma-light)" },
  au: { color: "var(--color-australia-apra)",    light: "var(--color-australia-apra-light)" },
  id: { color: "var(--color-indonesia-ojk)",     light: "var(--color-indonesia-ojk-light)" },
  my: { color: "var(--color-malaysia-bnm)",      light: "var(--color-malaysia-bnm-light)" },
  vn: { color: "var(--color-vietnam-sbv)",       light: "var(--color-vietnam-sbv-light)" },
  th: { color: "var(--color-thailand-bot)",      light: "var(--color-thailand-bot-light)" },
  co: { color: "var(--color-irl)",               light: "var(--color-irl-light)" },
  pe: { color: "var(--color-peru)",              light: "var(--color-peru-light)" },
  pa: { color: "var(--color-panama)",            light: "var(--color-panama-light)" },
  mx: { color: "var(--color-mexico-cnbv)",       light: "var(--color-mexico-cnbv-light)" },
  br: { color: "var(--color-brazil-bcb)",        light: "var(--color-brazil-bcb-light)" },
};

export default function ScopeControl() {
  const {
    selectedRegulations,
    activeJurisdiction,
    setActiveJurisdiction,
    toggleRegulation,
    removeRegulation,
    clearScope,
  } = useScopeStore();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const regsForJuris = useCallback(
    (jid: JurisdictionId) => REGULATIONS.filter((r) => r.jurisdictionId === jid),
    [],
  );

  const jurisColor = activeJurisdiction ? JURIS_COLORS[activeJurisdiction] : null;

  return (
    <div className="scope-control" ref={containerRef}>
      {/* Single row: active pills + Add trigger */}
      <div className="scope-control__row">
        {selectedRegulations.length === 0 && (
          <span className="t-small t-muted">All regulations in scope</span>
        )}
        {selectedRegulations.map((rid) => {
          const reg = REGULATIONS.find((r) => r.id === rid);
          if (!reg) return null;
          return (
            <span key={rid} className={`scope-pill scope-pill--${rid}`}>
              {reg.shortLabel}
              <button
                type="button"
                className="scope-pill__close"
                onClick={() => removeRegulation(rid)}
                aria-label={`Remove ${reg.shortLabel} from scope`}
              >
                ×
              </button>
            </span>
          );
        })}
        {selectedRegulations.length > 0 && (
          <button type="button" className="scope-pill__clear" onClick={clearScope}>
            Clear all
          </button>
        )}
        <button
          type="button"
          className={`scope-pill__add${open ? " is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="true"
        >
          + Add scope
        </button>
      </div>

      {/* Popover — jurisdiction chips then regulation chips for active jurisdiction */}
      {open && (
        <div
          className="scope-control__popover"
          style={
            jurisColor
              ? ({ "--juris-color": jurisColor.color, "--juris-light": jurisColor.light } as React.CSSProperties)
              : undefined
          }
        >
          <div className="scope-bar__row">
            <span className="scope-bar__label">Jurisdiction</span>
            {JURISDICTIONS.map((j) => {
              const isActive = activeJurisdiction === j.id;
              return (
                <button
                  key={j.id}
                  type="button"
                  className={["scope-chip", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
                  onClick={() => setActiveJurisdiction(isActive ? null : j.id)}
                  aria-pressed={isActive}
                >
                  <Flag cc={j.cc} size="sm" />
                  {j.label}
                </button>
              );
            })}
          </div>

          {activeJurisdiction && (
            <div className="scope-bar__row">
              <span className="scope-bar__label">Regulation</span>
              {regsForJuris(activeJurisdiction).map((reg) => {
                const isSelected = selectedRegulations.includes(reg.id);
                return (
                  <button
                    key={reg.id}
                    type="button"
                    className={["scope-chip", isSelected ? "is-active" : ""].filter(Boolean).join(" ")}
                    onClick={() => toggleRegulation(reg.id)}
                    aria-pressed={isSelected}
                  >
                    {reg.shortLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
