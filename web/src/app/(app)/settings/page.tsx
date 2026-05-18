"use client";

import { useState, useEffect } from "react";
import { JURISDICTIONS } from "@/data/registry";
import { useThemeStore } from "@/store/theme";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

type TabId =
  | "jurisdictions"
  | "entity-types"
  | "grc-connections"
  | "user-roles"
  | "theme"
  | "notifications";

const TABS: { id: TabId; label: string }[] = [
  { id: "jurisdictions",   label: "Jurisdictions" },
  { id: "entity-types",    label: "Entity Types" },
  { id: "grc-connections", label: "GRC Connections" },
  { id: "user-roles",      label: "User Roles" },
  { id: "theme",           label: "Theme" },
  { id: "notifications",   label: "Notifications" },
];

/* ── Panel: Jurisdictions ─────────────────────────────────── */
function JurisdictionsPanel() {
  return (
    <div className="card">
      <h2 className="t-h3 mb-1">Active Jurisdictions</h2>
      <p className="t-body mb-4">
        Select which jurisdictions are active for your organisation. Obligations from inactive
        jurisdictions remain in the register but are hidden from the default scope.
      </p>
      <div className="grid-2">
        {JURISDICTIONS.map((j) => (
          <label key={j.id} className="filter-panel__item">
            <input type="checkbox" className="checkbox" defaultChecked />
            <span>{j.label}</span>
          </label>
        ))}
      </div>
      <hr className="divider mt-6 mb-4" />
      <Button variant="primary" size="sm">Save changes</Button>
    </div>
  );
}

/* ── Panel: Entity Types ──────────────────────────────────── */
const ENTITY_TYPES = [
  "Commercial Bank",
  "Credit Union",
  "Investment Bank",
  "Insurance Company",
  "Payment Institution",
  "Broker-Dealer",
  "Asset Manager",
  "Clearing House",
];

function EntityTypesPanel() {
  return (
    <div className="card">
      <h2 className="t-h3 mb-1">Entity Types</h2>
      <p className="t-body mb-4">
        Configure which entity types are in scope for this workspace. Regulation applicability
        is determined by entity type when automatic scoping is enabled.
      </p>
      <div className="grid-2">
        {ENTITY_TYPES.map((et) => (
          <label key={et} className="filter-panel__item">
            <input type="checkbox" className="checkbox" defaultChecked />
            <span>{et}</span>
          </label>
        ))}
      </div>
      <hr className="divider mt-6 mb-4" />
      <Button variant="primary" size="sm">Save changes</Button>
    </div>
  );
}

/* ── Panel: GRC Connections ───────────────────────────────── */
const GRC_SYSTEMS = [
  {
    id: "servicenow",
    label: "ServiceNow GRC",
    urlPlaceholder: "https://your-instance.service-now.com",
    keyHint: "Service account OAuth client secret.",
  },
  {
    id: "archer",
    label: "RSA Archer",
    urlPlaceholder: "https://archer.example.com/rsaarcher",
    keyHint: "Archer API token from Administration → API Keys.",
  },
  {
    id: "sap-grc",
    label: "SAP GRC Access Control",
    urlPlaceholder: "https://sap.example.com/sap/bc/webdynpro",
    keyHint: "RFC communication user credentials (base-64 encoded).",
  },
];

function GrcConnectionsPanel() {
  return (
    <div className="card">
      <h2 className="t-h3 mb-1">GRC Connections</h2>
      <p className="t-body mb-6">
        Connect ObligaI to your existing GRC platforms to synchronise controls and obligations.
        Credentials are stored encrypted and never logged.
      </p>
      {GRC_SYSTEMS.map((sys, i) => (
        <div key={sys.id}>
          <p className="t-label mb-3">{sys.label}</p>
          <div className="grid-2 mb-4">
            <div className="field">
              <label className="label" htmlFor={`${sys.id}-url`}>Instance URL</label>
              <input
                id={`${sys.id}-url`}
                type="url"
                className="input"
                placeholder={sys.urlPlaceholder}
              />
              <span className="helper">Base URL for your {sys.label} deployment.</span>
            </div>
            <div className="field">
              <label className="label" htmlFor={`${sys.id}-key`}>API Key / Secret</label>
              <input
                id={`${sys.id}-key`}
                type="password"
                className="input"
                placeholder="••••••••••••••••"
                autoComplete="off"
              />
              <span className="helper">{sys.keyHint}</span>
            </div>
          </div>
          {i < GRC_SYSTEMS.length - 1 && <hr className="divider mb-4" />}
        </div>
      ))}
      <hr className="divider mt-2 mb-4" />
      <Button variant="primary" size="sm">Save connections</Button>
    </div>
  );
}

/* ── Panel: User Roles ────────────────────────────────────── */
const ROLES = [
  {
    name: "Administrator",
    description: "Full access to all settings, data, and user management.",
    level: "Full",
  },
  {
    name: "Analyst",
    description: "Can view and edit obligations, controls, and reports.",
    level: "Edit",
  },
  {
    name: "Auditor",
    description: "Read-only access to all data, reports, and audit trails.",
    level: "Read",
  },
  {
    name: "Viewer",
    description: "Read-only access to the dashboard and obligation register.",
    level: "Read",
  },
];

function UserRolesPanel() {
  return (
    <div className="card">
      <div className="flex-between mb-4">
        <div>
          <h2 className="t-h3 mb-1">User Roles</h2>
          <p className="t-body">Manage role definitions and access levels for your workspace.</p>
        </div>
        <Button variant="secondary" size="sm">
          <Icon name="user" size="sm" />
          Add role
        </Button>
      </div>
      <div className="table-wrap">
        <table className="table" aria-label="User roles">
          <thead className="table-header">
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Description</th>
              <th scope="col">Access level</th>
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role) => (
              <tr key={role.name}>
                <td className="t-strong">{role.name}</td>
                <td className="t-secondary">{role.description}</td>
                <td>
                  <span className="tag tag-domain">{role.level}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Panel: Theme ─────────────────────────────────────────── */
function ThemePanel() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="card">
      <h2 className="t-h3 mb-1">Theme</h2>
      <p className="t-body mb-6">
        Choose the colour scheme for your ObligaI workspace. Your preference is persisted across
        sessions via <span className="mono">localStorage</span>.
      </p>
      <div className="field">
        <span className="label">Display mode</span>
        <div className="btn--group" role="group" aria-label="Display mode">
          <Button
            variant={theme === "light" ? "primary" : "secondary"}
            size="md"
            onClick={() => setTheme("light")}
            aria-pressed={theme === "light"}
          >
            <Icon name="sun" size="sm" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "primary" : "secondary"}
            size="md"
            onClick={() => setTheme("dark")}
            aria-pressed={theme === "dark"}
          >
            <Icon name="moon" size="sm" />
            Dark
          </Button>
        </div>
        <span className="helper">
          Sienna brand colour is invariant — it remains the same in both modes.
        </span>
      </div>
    </div>
  );
}

/* ── Panel: Notifications ─────────────────────────────────── */
const NOTIF_GROUPS = [
  {
    group: "Obligations",
    items: [
      { id: "notif-new-oblig",    label: "New obligation added",            on: true },
      { id: "notif-status",       label: "Obligation status changed",       on: true },
      { id: "notif-deadline",     label: "Deadline approaching (7 days)",   on: true },
      { id: "notif-overdue",      label: "Obligation overdue",              on: true },
    ],
  },
  {
    group: "Conflicts",
    items: [
      { id: "notif-conflict-new", label: "Conflict detected",               on: true },
      { id: "notif-conflict-res", label: "Conflict resolved",               on: false },
    ],
  },
  {
    group: "Regulatory Sources",
    items: [
      { id: "notif-scrape-fail",  label: "Scraper failure",                 on: true },
      { id: "notif-new-doc",      label: "New regulatory document fetched", on: false },
    ],
  },
];

function NotificationsPanel() {
  return (
    <div className="card">
      <h2 className="t-h3 mb-1">Notifications</h2>
      <p className="t-body mb-6">
        Control which events trigger in-app and email notifications for your account.
      </p>
      {NOTIF_GROUPS.map((group, i) => (
        <div key={group.group}>
          <p className="t-label mb-3">{group.group}</p>
          {group.items.map((item) => (
            <label key={item.id} className="filter-panel__item">
              <input
                type="checkbox"
                id={item.id}
                className="checkbox"
                defaultChecked={item.on}
              />
              <span>{item.label}</span>
            </label>
          ))}
          {i < NOTIF_GROUPS.length - 1 && <hr className="divider mt-4 mb-4" />}
        </div>
      ))}
      <hr className="divider mt-6 mb-4" />
      <Button variant="primary" size="sm">Save preferences</Button>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("jurisdictions");

  useEffect(() => {
    const hash = window.location.hash.slice(1) as TabId;
    if (TABS.some((t) => t.id === hash)) setActiveTab(hash);
  }, []);

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div>
      <h1 className="t-h1 mb-4">Settings</h1>

      <div className="tabs" role="tablist" aria-label="Settings panels">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className={["tab", activeTab === tab.id ? "is-active" : ""].filter(Boolean).join(" ")}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-4"
      >
        {activeTab === "jurisdictions"   && <JurisdictionsPanel />}
        {activeTab === "entity-types"    && <EntityTypesPanel />}
        {activeTab === "grc-connections" && <GrcConnectionsPanel />}
        {activeTab === "user-roles"      && <UserRolesPanel />}
        {activeTab === "theme"           && <ThemePanel />}
        {activeTab === "notifications"   && <NotificationsPanel />}
      </div>
    </div>
  );
}
