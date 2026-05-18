"use client";

import { create } from "zustand";
import type { RegulationId, JurisdictionId } from "@/data/registry";

interface ScopeStore {
  selectedRegulations: RegulationId[];
  activeJurisdiction: JurisdictionId | null;
  setSelectedRegulations: (regs: RegulationId[]) => void;
  setActiveJurisdiction: (jid: JurisdictionId | null) => void;
  toggleRegulation: (rid: RegulationId) => void;
  removeRegulation: (rid: RegulationId) => void;
  clearScope: () => void;
}

export const useScopeStore = create<ScopeStore>((set) => ({
  selectedRegulations: [],
  activeJurisdiction: null,

  setSelectedRegulations: (regs) => set({ selectedRegulations: regs }),

  setActiveJurisdiction: (jid) => set({ activeJurisdiction: jid }),

  toggleRegulation: (rid) =>
    set((s) => ({
      selectedRegulations: s.selectedRegulations.includes(rid)
        ? s.selectedRegulations.filter((x) => x !== rid)
        : [...s.selectedRegulations, rid],
    })),

  removeRegulation: (rid) =>
    set((s) => ({
      selectedRegulations: s.selectedRegulations.filter((x) => x !== rid),
    })),

  clearScope: () => set({ selectedRegulations: [], activeJurisdiction: null }),
}));
