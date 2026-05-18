"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import StatusBadge from "@/components/product/StatusBadge";

type ReportFormat = "PDF" | "PPTX" | "DOCX";
type ReportStatus = "ready" | "generating" | "failed";

interface Report {
  id: string;
  name: string;
  template: string;
  format: ReportFormat;
  status: ReportStatus;
  generatedAt: string;
  size: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: "RPT-001",
    name: "Q4 2025 Obligation Summary",
    template: "Obligation Summary",
    format: "PDF",
    status: "ready",
    generatedAt: "2025-12-15",
    size: "2.4 MB",
  },
  {
    id: "RPT-002",
    name: "EU Conflict Analysis — December",
    template: "Conflict Analysis",
    format: "PPTX",
    status: "ready",
    generatedAt: "2025-12-12",
    size: "4.1 MB",
  },
  {
    id: "RPT-003",
    name: "APAC Jurisdiction Coverage",
    template: "Jurisdiction Coverage",
    format: "DOCX",
    status: "ready",
    generatedAt: "2025-12-10",
    size: "1.8 MB",
  },
  {
    id: "RPT-004",
    name: "Executive Briefing — November",
    template: "Executive Briefing",
    format: "PDF",
    status: "ready",
    generatedAt: "2025-11-30",
    size: "3.2 MB",
  },
  {
    id: "RPT-005",
    name: "Pending Implementation Status",
    template: "Obligation Summary",
    format: "DOCX",
    status: "generating",
    generatedAt: "—",
    size: "—",
  },
  {
    id: "RPT-006",
    name: "LATAM Compliance Status Q3",
    template: "Jurisdiction Coverage",
    format: "PDF",
    status: "failed",
    generatedAt: "2025-11-28",
    size: "—",
  },
];

const TEMPLATES = [
  {
    id: "obligation-summary",
    label: "Obligation Summary",
    description: "Complete list of obligations with status, completeness, and ownership.",
  },
  {
    id: "conflict-analysis",
    label: "Conflict Analysis",
    description: "Detailed conflict map between obligations across jurisdictions.",
  },
  {
    id: "jurisdiction-coverage",
    label: "Jurisdiction Coverage",
    description: "Coverage heatmap and completeness scores per jurisdiction.",
  },
  {
    id: "executive-briefing",
    label: "Executive Briefing",
    description: "One-page summary for board and senior leadership.",
  },
  {
    id: "audit-trail",
    label: "Audit Trail",
    description: "Full change log and obligation history for a specified period.",
  },
];

const FORMATS: ReportFormat[] = ["PDF", "PPTX", "DOCX"];

/* ── Report status badge ──────────────────────────────────── */
const REPORT_STATUS_MAP = {
  ready:      { status: "active",       label: "Ready"      },
  generating: { status: "implementing", label: "Generating" },
  failed:     { status: "conflicted",   label: "Failed"     },
} as const;

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const { status: s, label } = REPORT_STATUS_MAP[status];
  return <StatusBadge status={s} label={label} />;
}

/* ── Generate-report modal ────────────────────────────────── */
interface GenerateModalProps {
  template: string;
  format: ReportFormat;
  onClose: () => void;
}

function GenerateModal({ template, format, onClose }: GenerateModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      className="modal-scrim"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title" id="modal-title">Report queued</h2>
        <div className="modal__body">
          <p className="mb-4">
            Your <strong>{template}</strong> report ({format}) has been queued for generation.
            It will appear in the list once complete, typically within 30 seconds.
          </p>
          <div className="alert alert--info" role="status">
            <span>
              <strong className="alert__title">Scope applied.</strong>{" "}
              The report reflects your current jurisdiction and regulation scope.
            </span>
          </div>
        </div>
        <div className="modal__actions">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("PDF");
  const [modalOpen, setModalOpen] = useState(false);

  const selectedTemplateMeta = TEMPLATES.find((t) => t.id === selectedTemplate)!;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <h1 className="t-h1">Reports</h1>
        <a href="#generate" className="btn btn-primary btn--size-sm">
          <Icon name="export" size="sm" />
          Generate new report
        </a>
      </div>

      {/* ── Report list ──────────────────────────────────── */}
      <div className="table-wrap mb-6">
        <table className="table table--compact" aria-label="Generated reports">
          <thead className="table-header">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Template</th>
              <th scope="col">Format</th>
              <th scope="col">Status</th>
              <th scope="col">Generated</th>
              <th scope="col">Size</th>
              <th scope="col">Download</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REPORTS.map((report) => (
              <tr key={report.id}>
                <td className="mono">{report.id}</td>
                <td className="t-strong">{report.name}</td>
                <td className="t-secondary">{report.template}</td>
                <td>
                  <span className="tag tag-domain">{report.format}</span>
                </td>
                <td>
                  <ReportStatusBadge status={report.status} />
                </td>
                <td className="mono">{report.generatedAt}</td>
                <td className="mono t-muted">{report.size}</td>
                <td>
                  {report.status === "ready" && (
                    <a
                      href="#"
                      className="btn btn-ghost btn--size-sm btn-icon"
                      aria-label={`Download ${report.name}`}
                      onClick={(e) => e.preventDefault()}
                    >
                      <Icon name="export" size="sm" />
                    </a>
                  )}
                  {report.status === "generating" && (
                    <span
                      className="spinner spinner--sm"
                      role="status"
                      aria-label="Generating"
                    />
                  )}
                  {report.status === "failed" && (
                    <button
                      type="button"
                      className="btn btn-ghost btn--size-sm"
                      aria-label={`Retry ${report.name}`}
                    >
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="divider mb-6" />

      {/* ── Generate new report form ─────────────────────── */}
      <div className="card" id="generate">
        <h2 className="t-h3 mb-1">Generate New Report</h2>
        <p className="t-body mb-6">
          Select a template and export format. The report will reflect your current scope
          and be added to the list above once ready.
        </p>

        <form onSubmit={handleGenerate}>
          <div className="grid-2 mb-4">
            {/* Template picker */}
            <div className="field">
              <label className="label" htmlFor="report-template">Template</label>
              <select
                id="report-template"
                className="select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              {selectedTemplateMeta && (
                <span className="helper">{selectedTemplateMeta.description}</span>
              )}
            </div>

            {/* Format picker */}
            <div className="field">
              <span className="label" id="format-group-label">Format</span>
              <div
                className="btn--group"
                role="radiogroup"
                aria-labelledby="format-group-label"
              >
                {FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    role="radio"
                    aria-checked={selectedFormat === fmt}
                    className={[
                      "btn",
                      selectedFormat === fmt ? "btn-primary" : "btn-secondary",
                      "btn--size-sm",
                    ].join(" ")}
                    onClick={() => setSelectedFormat(fmt)}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
              <span className="helper">Choose the export file format.</span>
            </div>
          </div>

          <div className="alert alert--info mb-4" role="note">
            <span>
              <strong className="alert__title">Scope-aware.</strong>{" "}
              This report will include only the jurisdictions and regulations currently active
              in your scope control.
            </span>
          </div>

          <Button variant="primary" type="submit">
            <Icon name="export" size="sm" />
            Generate report
          </Button>
        </form>
      </div>

      {/* ── Modal ───────────────────────────────────────── */}
      {modalOpen && (
        <GenerateModal
          template={selectedTemplateMeta.label}
          format={selectedFormat}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
