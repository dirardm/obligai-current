"use client";

import { useState } from "react";
import type { RegulationId } from "@/data/registry";
import Flag from "@/components/ui/Flag";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/product/StatusBadge";

type ScraperHealth = "healthy" | "degraded" | "down";
type DocType = "circular" | "rulebook" | "guideline" | "notice" | "regulation" | "ordinance";

interface ScraperDoc {
  id: string;
  title: string;
  type: DocType;
  publishedDate: string;
  url?: string;
}

interface Scraper {
  id: string;
  name: string;
  regulationId: RegulationId;
  regulationLabel: string;
  jurisdictionLabel: string;
  jurisdictionCc: string;
  lastFetched: string;
  documentCount: number;
  health: ScraperHealth;
  nextFetch: string;
  documents: ScraperDoc[];
}

const DOC_TYPE_LABELS: Record<DocType, string> = {
  circular:   "Circular",
  rulebook:   "Rulebook",
  guideline:  "Guideline",
  notice:     "Notice",
  regulation: "Regulation",
  ordinance:  "Ordinance",
};

const SCRAPERS: Scraper[] = [
  {
    id: "scraper-lcr",
    name: "EBA LCR Reporting",
    regulationId: "lcr",
    regulationLabel: "LCR",
    jurisdictionLabel: "European Union",
    jurisdictionCc: "eu",
    lastFetched: "2025-12-14",
    documentCount: 14,
    health: "healthy",
    nextFetch: "2025-12-21",
    documents: [
      { id: "doc-lcr-1", title: "Commission Delegated Regulation (EU) 2015/61 — LCR", type: "regulation", publishedDate: "2015-01-10" },
      { id: "doc-lcr-2", title: "EBA Guidelines on LCR Disclosure", type: "guideline", publishedDate: "2022-03-15" },
      { id: "doc-lcr-3", title: "EBA Q&A on Article 412 CRR II", type: "notice", publishedDate: "2023-09-08" },
      { id: "doc-lcr-4", title: "Delegated Act Amendment — HQLA eligibility", type: "circular", publishedDate: "2024-06-20" },
    ],
  },
  {
    id: "scraper-nsfr",
    name: "EBA NSFR Reporting",
    regulationId: "nsfr",
    regulationLabel: "NSFR",
    jurisdictionLabel: "European Union",
    jurisdictionCc: "eu",
    lastFetched: "2025-12-14",
    documentCount: 9,
    health: "healthy",
    nextFetch: "2025-12-21",
    documents: [
      { id: "doc-nsfr-1", title: "CRR II — Articles 428a to 428ax (NSFR)", type: "regulation", publishedDate: "2019-06-07" },
      { id: "doc-nsfr-2", title: "EBA Draft RTS on NSFR Additional Items", type: "guideline", publishedDate: "2021-04-19" },
      { id: "doc-nsfr-3", title: "EBA Report on NSFR Implementation", type: "notice", publishedDate: "2022-11-30" },
    ],
  },
  {
    id: "scraper-uk-pra",
    name: "PRA Rulebook Scraper",
    regulationId: "uk-pra",
    regulationLabel: "UK PRA",
    jurisdictionLabel: "United Kingdom",
    jurisdictionCc: "uk",
    lastFetched: "2025-12-10",
    documentCount: 7,
    health: "healthy",
    nextFetch: "2025-12-17",
    documents: [
      { id: "doc-pra-1", title: "PRA Rulebook: Liquidity", type: "rulebook", publishedDate: "2024-01-01" },
      { id: "doc-pra-2", title: "SS24/15 — The PRA's approach to supervising liquidity", type: "guideline", publishedDate: "2015-11-01" },
      { id: "doc-pra-3", title: "PRA Policy Statement PS2/24 — Liquidity Update", type: "notice", publishedDate: "2024-03-14" },
    ],
  },
  {
    id: "scraper-us-fed",
    name: "Federal Reserve Regulation YY",
    regulationId: "us-fed",
    regulationLabel: "US Fed",
    jurisdictionLabel: "United States",
    jurisdictionCc: "us",
    lastFetched: "2025-12-13",
    documentCount: 11,
    health: "healthy",
    nextFetch: "2025-12-20",
    documents: [
      { id: "doc-us-1", title: "Regulation YY: Enhanced Prudential Standards", type: "regulation", publishedDate: "2019-11-01" },
      { id: "doc-us-2", title: "FR 2052a: Complex Institution Liquidity Monitoring Report", type: "circular", publishedDate: "2023-07-15" },
      { id: "doc-us-3", title: "Fed Guidance on LCR Shortfall Reporting", type: "guideline", publishedDate: "2022-08-22" },
    ],
  },
  {
    id: "scraper-osfi",
    name: "OSFI LAR Guideline Scraper",
    regulationId: "canada-osfi",
    regulationLabel: "OSFI LAR",
    jurisdictionLabel: "Canada",
    jurisdictionCc: "ca",
    lastFetched: "2025-12-12",
    documentCount: 6,
    health: "healthy",
    nextFetch: "2025-12-19",
    documents: [
      { id: "doc-osfi-1", title: "Liquidity Adequacy Requirements (LAR) Guideline", type: "guideline", publishedDate: "2024-04-01" },
      { id: "doc-osfi-2", title: "OSFI BCAR Chapter 7 — Liquidity Stress Testing", type: "guideline", publishedDate: "2023-10-31" },
      { id: "doc-osfi-3", title: "Advisory — LCR Implementation for D-SIBs", type: "notice", publishedDate: "2023-01-15" },
    ],
  },
  {
    id: "scraper-mas",
    name: "MAS Notice 649 Scraper",
    regulationId: "singapore-mas",
    regulationLabel: "MAS 649",
    jurisdictionLabel: "Singapore",
    jurisdictionCc: "sg",
    lastFetched: "2025-12-11",
    documentCount: 8,
    health: "healthy",
    nextFetch: "2025-12-18",
    documents: [
      { id: "doc-mas-1", title: "MAS Notice 649 — Minimum Liquid Assets", type: "notice", publishedDate: "2023-06-30" },
      { id: "doc-mas-2", title: "MAS Guidelines on Internal Capital Adequacy", type: "guideline", publishedDate: "2022-09-01" },
      { id: "doc-mas-3", title: "MAS Circular: LCR Reporting Templates", type: "circular", publishedDate: "2024-01-15" },
    ],
  },
  {
    id: "scraper-hkma",
    name: "HKMA LMR Scraper",
    regulationId: "hongkong-hkma",
    regulationLabel: "HKMA LMR",
    jurisdictionLabel: "Hong Kong",
    jurisdictionCc: "hk",
    lastFetched: "2025-11-28",
    documentCount: 5,
    health: "down",
    nextFetch: "2025-12-05",
    documents: [
      { id: "doc-hkma-1", title: "Banking (Liquidity) Rules — Cap. 155Q", type: "regulation", publishedDate: "2020-01-01" },
      { id: "doc-hkma-2", title: "HKMA Supervisory Policy Manual: LM-2", type: "guideline", publishedDate: "2022-07-01" },
    ],
  },
  {
    id: "scraper-apra",
    name: "APRA APS 210 Scraper",
    regulationId: "australia-apra",
    regulationLabel: "APS 210",
    jurisdictionLabel: "Australia",
    jurisdictionCc: "au",
    lastFetched: "2025-12-09",
    documentCount: 10,
    health: "healthy",
    nextFetch: "2025-12-16",
    documents: [
      { id: "doc-apra-1", title: "Prudential Standard APS 210: Liquidity", type: "regulation", publishedDate: "2024-07-01" },
      { id: "doc-apra-2", title: "Prudential Practice Guide APG 210", type: "guideline", publishedDate: "2023-11-30" },
      { id: "doc-apra-3", title: "APRA Information Paper: LCR Reporting", type: "circular", publishedDate: "2022-03-22" },
      { id: "doc-apra-4", title: "Response to Submissions — APS 210 Review", type: "notice", publishedDate: "2023-09-14" },
    ],
  },  {
    id: "scraper-irl",
    name: "SFC IRL Reporting",
    regulationId: "irl",
    regulationLabel: "IRL",
    jurisdictionLabel: "Colombia",
    jurisdictionCc: "co",
    lastFetched: "2025-12-12",
    documentCount: 5,
    health: "healthy",
    nextFetch: "2025-12-19",
    documents: [
      { id: "doc-irl-1", title: "Circular Externa 042 — SFC", type: "circular", publishedDate: "2022-08-15" },
      { id: "doc-irl-2", title: "SFC Resolution 400/2012 — IRL Framework", type: "regulation", publishedDate: "2012-05-10" },
      { id: "doc-irl-3", title: "SFC Guidelines on Liquidity Risk", type: "guideline", publishedDate: "2023-04-01" },
    ],
  },
  {
    id: "scraper-bcb",
    name: "BCB Liquidity Framework",
    regulationId: "brazil-bcb",
    regulationLabel: "BCB",
    jurisdictionLabel: "Brazil",
    jurisdictionCc: "br",
    lastFetched: "2025-12-13",
    documentCount: 9,
    health: "healthy",
    nextFetch: "2025-12-20",
    documents: [
      { id: "doc-bcb-1", title: "Resolução CMN 4.401 — Liquidity Requirements", type: "regulation", publishedDate: "2013-12-20" },
      { id: "doc-bcb-2", title: "Circular 3.835 — Implementation Guidelines", type: "circular", publishedDate: "2023-07-01" },
      { id: "doc-bcb-3", title: "BCB Prudential Framework — Liquidity Chapter", type: "guideline", publishedDate: "2024-02-15" },
    ],
  },
  {
    id: "scraper-sbs",
    name: "SBS Liquidity Requirements",
    regulationId: "peru",
    regulationLabel: "SBS Peru",
    jurisdictionLabel: "Peru",
    jurisdictionCc: "pe",
    lastFetched: "2025-12-11",
    documentCount: 6,
    health: "healthy",
    nextFetch: "2025-12-18",
    documents: [
      { id: "doc-sbs-1", title: "Resolución SBS N° 9075 — Liquidity Requirements", type: "regulation", publishedDate: "2016-12-22" },
      { id: "doc-sbs-2", title: "SBS Technical Manual on Liquidity", type: "guideline", publishedDate: "2023-06-30" },
      { id: "doc-sbs-3", title: "Circular 042-2022 — Calculation Rules Update", type: "circular", publishedDate: "2022-11-10" },
    ],
  },
  {
    id: "scraper-sbp",
    name: "SBP Liquidity Standards",
    regulationId: "panama",
    regulationLabel: "SBP Panama",
    jurisdictionLabel: "Panama",
    jurisdictionCc: "pa",
    lastFetched: "2025-12-10",
    documentCount: 4,
    health: "healthy",
    nextFetch: "2025-12-17",
    documents: [
      { id: "doc-sbp-1", title: "Acuerdo 4-2013 — Liquidity Standards", type: "regulation", publishedDate: "2013-08-15" },
      { id: "doc-sbp-2", title: "SBP Technical Handbook — Liquidity Risk", type: "guideline", publishedDate: "2024-01-20" },
      { id: "doc-sbp-3", title: "Memorándum 1234 — Implementation Guidance", type: "notice", publishedDate: "2023-09-05" },
    ],
  },
];

/* ── Health badge ─────────────────────────────────────────── */
const HEALTH_STATUS_MAP = {
  healthy:  { status: "active",     label: "Healthy"  },
  degraded: { status: "pending",    label: "Degraded" },
  down:     { status: "conflicted", label: "Down"     },
} as const;

function HealthBadge({ health }: { health: ScraperHealth }) {
  const { status, label } = HEALTH_STATUS_MAP[health];
  return <StatusBadge status={status} label={label} />;
}

/* ── Page ─────────────────────────────────────────────────── */
export default function SourcesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedScraper = selectedId
    ? SCRAPERS.find((s) => s.id === selectedId) ?? null
    : null;

  const handleRowClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleRefresh = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    /* No-op in prototype — would trigger a scrape job in production. */
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 className="t-h1">Regulatory Sources</h1>
        <span className="t-secondary t-small">{SCRAPERS.length} scrapers configured</span>
      </div>

      {SCRAPERS.some((s) => s.health === "down") && (
        <div className="alert alert--error mb-4" role="alert">
          <span>
            <strong className="alert__title">Scraper down.</strong>{" "}
            One or more scrapers are not responding. Fetched documents may be out of date.
          </span>
        </div>
      )}

      <div className="sources-layout">
        {/* ── Scrapers table ──────────────────────────── */}
        <div className="sources-table-area">
          <div className="table-wrap">
            <table className="table table--compact" aria-label="Regulatory source scrapers">
              <thead className="table-header">
                <tr>
                  <th scope="col">Jurisdiction</th>
                  <th scope="col">Regulation</th>
                  <th scope="col">Scraper</th>
                  <th scope="col">Last Fetched</th>
                  <th scope="col">Documents</th>
                  <th scope="col">Health</th>
                  <th scope="col">Next Fetch</th>
                  <th scope="col">Refresh</th>
                </tr>
              </thead>
              <tbody>
                {SCRAPERS.map((scraper) => (
                  <tr
                    key={scraper.id}
                    className={selectedId === scraper.id ? "is-selected" : undefined}
                    onClick={() => handleRowClick(scraper.id)}
                  >
                    <td>
                      <div className="flex-start gap-2">
                        <Flag cc={scraper.jurisdictionCc} size="sm" />
                        <span>{scraper.jurisdictionLabel}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge--regulation badge--${scraper.regulationId}`}>
                        {scraper.regulationLabel}
                      </span>
                    </td>
                    <td className="t-strong">{scraper.name}</td>
                    <td className="mono">{scraper.lastFetched}</td>
                    <td className="numeric">{scraper.documentCount}</td>
                    <td><HealthBadge health={scraper.health} /></td>
                    <td className="mono">{scraper.nextFetch}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn--size-sm btn-icon"
                        aria-label={`Refresh ${scraper.name}`}
                        onClick={(e) => handleRefresh(e, scraper.id)}
                        disabled={scraper.health === "down"}
                      >
                        <Icon name="monitor" size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Side panel ──────────────────────────────── */}
        {selectedScraper && (
          <aside
            className="source-panel"
            aria-label={`Documents for ${selectedScraper.name}`}
          >
            <div className="source-panel__header">
              <h2 className="source-panel__title">{selectedScraper.name}</h2>
              <button
                type="button"
                className="source-panel__close"
                aria-label="Close panel"
                onClick={() => setSelectedId(null)}
              >
                <Icon name="close" size="sm" />
              </button>
            </div>

            <p className="source-panel__meta">
              {selectedScraper.documentCount} document{selectedScraper.documentCount !== 1 ? "s" : ""} ·
              Last fetched {selectedScraper.lastFetched}
            </p>

            <div className="flex-start gap-2 mb-4">
              <span className={`badge--regulation badge--${selectedScraper.regulationId}`}>
                {selectedScraper.regulationLabel}
              </span>
              <HealthBadge health={selectedScraper.health} />
            </div>

            {selectedScraper.health === "down" && (
              <div className="alert alert--error mb-4" role="alert">
                <span>This scraper is currently unreachable. Documents shown are from the last successful fetch.</span>
              </div>
            )}

            {selectedScraper.health === "degraded" && (
              <div className="alert alert--warning mb-4" role="alert">
                <span>Scraper is running with errors. Some documents may be missing.</span>
              </div>
            )}

            {/* Document list */}
            <div>
              {selectedScraper.documents.map((doc) => (
                <div key={doc.id} className="source-doc-item">
                  <div className="flex-between mb-1">
                    <span className="tag tag-domain">{DOC_TYPE_LABELS[doc.type]}</span>
                    <span className="mono t-muted">{doc.publishedDate}</span>
                  </div>
                  <p className="t-body">{doc.title}</p>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn--size-sm mt-1"
                      role="button"
                    >
                      <Icon name="external-link" size="sm" />
                      View source
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={selectedScraper.health === "down"}
                onClick={(e) => handleRefresh(e, selectedScraper.id)}
              >
                <Icon name="monitor" size="sm" />
                Refresh now
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
