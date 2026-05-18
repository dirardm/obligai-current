"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Radio from "@/components/ui/Radio";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Tag from "@/components/ui/Tag";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Icon from "@/components/ui/Icon";
import Flag from "@/components/ui/Flag";
import Tabs from "@/components/ui/Tabs";
import Pagination from "@/components/ui/Pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Modal from "@/components/ui/Modal";
import Dropdown from "@/components/ui/Dropdown";
import { REGULATION_IDS } from "@/data/registry";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="t-h3 mb-4">{title}</h2>
      <hr className="divider mb-4" />
      <div className="flex-row flex-wrap gap-3">{children}</div>
    </section>
  );
}

function Col({ children }: { children: React.ReactNode }) {
  return <div className="flex-col gap-3 gallery-col">{children}</div>;
}

const ICONS = ["search", "filter", "export", "upload", "user", "settings", "close", "check", "alert", "info", "calendar", "lock", "link", "copy", "external-link", "sun", "moon", "regulation", "obligation", "conflict", "jurisdiction", "control", "audit-trail", "monitor", "chevron-up", "chevron-down", "chevron-left", "chevron-right"];

const JURIS_CCS = ["eu", "uk", "us", "ca", "ch", "pe", "pa", "mx", "br", "jp", "sg", "hk", "au", "id", "my", "vn", "th", "internal", "co"];

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const [page, setPage] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="container py-8">
      <h1 className="t-h1 mb-2">Component Gallery</h1>
      <p className="t-body mb-8">Every UI primitive at every variant. Compare against <code>Stylesheet Reference.html</code>.</p>

      {/* Buttons */}
      <Section title="Buttons — 4 variants × 3 sizes">
        {(["primary", "secondary", "ghost", "destructive"] as const).map((v) => (
          <Col key={v}>
            <span className="eyebrow">{v}</span>
            <Button variant={v} size="sm">Small</Button>
            <Button variant={v} size="md">Medium</Button>
            <Button variant={v} size="lg">Large</Button>
            <Button variant={v} disabled>Disabled</Button>
          </Col>
        ))}
        <Col>
          <span className="eyebrow">icon</span>
          <Button variant="icon" aria-label="Search"><Icon name="search" size="md" /></Button>
          <Button variant="icon" aria-label="Settings"><Icon name="settings" size="md" /></Button>
        </Col>
        <Col>
          <span className="eyebrow">block</span>
          <Button variant="primary" block>Block button</Button>
          <Button variant="secondary" block>Block secondary</Button>
        </Col>
      </Section>

      {/* Alerts */}
      <Section title="Alerts">
        <div className="flex-col gap-3 gallery-full">
          <Alert variant="info" title="Information">This regulation was updated on 14 May 2026.</Alert>
          <Alert variant="warning" title="Deadline approaching">LCR Article 412 deadline is in 7 days.</Alert>
          <Alert variant="error" title="Conflict detected">OBLIG-LCR-0412 conflicts with OBLIG-NSFR-0089.</Alert>
          <Alert variant="success" title="Obligation resolved">Conflict between obligations has been resolved.</Alert>
        </div>
      </Section>

      {/* Status Badges */}
      <Section title="Status badges">
        {(["active", "conflicted", "implementing", "pending", "inactive"] as const).map((s) => (
          <Badge key={s} type="status" status={s} />
        ))}
      </Section>

      {/* Regulation Badges */}
      <Section title="Regulation badges — all 20">
        {REGULATION_IDS.map((id) => (
          <Badge key={id} type="regulation" regulation={id} />
        ))}
      </Section>

      {/* Tags */}
      <Section title="Tags">
        <Tag variant="jurisdiction">European Union</Tag>
        <Tag variant="jurisdiction">United States</Tag>
        <Tag variant="framework">CRR II</Tag>
        <Tag variant="framework">Basel III</Tag>
        <Tag variant="domain">Liquidity</Tag>
        <Tag variant="domain">Reporting</Tag>
      </Section>

      {/* Forms */}
      <Section title="Inputs">
        <Col>
          <Input label="Regulation ID" placeholder="OBLIG-LCR-0001" />
          <Input label="With helper" placeholder="Enter value" helper="Must match citation format" />
          <Input label="Error state" defaultValue="bad value" error="Invalid format" />
          <Input label="Disabled" value="Read-only value" disabled />
        </Col>
        <Col>
          <Select
            label="Status"
            options={[
              { value: "active", label: "Active" },
              { value: "conflicted", label: "Conflicted" },
              { value: "implementing", label: "Implementing" },
              { value: "pending", label: "Pending" },
              { value: "inactive", label: "Inactive" },
            ]}
            placeholder="Select status…"
          />
          <Textarea label="Summary" placeholder="Plain-English summary of the obligation…" rows={4} />
        </Col>
        <Col>
          <span className="eyebrow">Checkboxes</span>
          <Checkbox label="Active obligations" defaultChecked />
          <Checkbox label="Conflicted" />
          <Checkbox label="Disabled" disabled />
          <span className="eyebrow mt-4">Radio</span>
          <Radio name="scope" value="all" label="All jurisdictions" defaultChecked />
          <Radio name="scope" value="eu" label="European Union only" />
          <Radio name="scope" value="latam" label="LatAm only" />
        </Col>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <Card className="gallery-card">Default card</Card>
        <Card className="card--compact gallery-card">Compact</Card>
        <Card className="card--elevated gallery-card">Elevated</Card>
        <Card className="card--flat gallery-card">Flat</Card>
        <Card className="card--stat gallery-card">
          <div className="stat-num">432</div>
          <div className="stat-label">Total obligations</div>
        </Card>
        <Card className="card--stat selected gallery-card">
          <div className="stat-num">18</div>
          <div className="stat-label">Conflicted</div>
        </Card>
        <Card className="card--interactive gallery-card">Interactive (hover me)</Card>
      </Section>

      {/* Spinners */}
      <Section title="Spinners">
        <div className="flex-row gap-6 gallery-center">
          <div><span className="eyebrow">Small</span><br /><Spinner size="sm" /></div>
          <div><span className="eyebrow">Default</span><br /><Spinner /></div>
          <div><span className="eyebrow">Large</span><br /><Spinner size="lg" /></div>
        </div>
      </Section>

      {/* Skeletons */}
      <Section title="Skeletons">
        <div className="skeleton-group gallery-skel">
          <Skeleton variant="title" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="block" />
        </div>
        <div className="flex-row gap-3 gallery-center">
          <Skeleton variant="avatar" />
          <Skeleton variant="circle" />
        </div>
      </Section>

      {/* Empty state */}
      <Section title="Empty state">
        <EmptyState
          icon={<Icon name="obligation" size="2xl" />}
          title="No obligations found"
          body="Adjust your scope or filters to see obligations."
          action={<Button variant="primary">Add regulation</Button>}
        />
      </Section>

      {/* Tabs */}
      <Section title="Tabs">
        <div className="gallery-full">
          <Tabs
            tabs={[
              { label: "Overview", value: "overview" },
              { label: "Obligations", value: "obligations" },
              { label: "Conflicts", value: "conflicts" },
              { label: "Audit trail", value: "audit" },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
          <div className="t-body pt-3">Active tab: <strong>{activeTab}</strong></div>
        </div>
      </Section>

      {/* Breadcrumbs */}
      <Section title="Breadcrumbs">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Obligation Register", href: "/register" },
            { label: "OBLIG-LCR-0412" },
          ]}
        />
      </Section>

      {/* Pagination */}
      <Section title="Pagination">
        <Pagination page={page} totalPages={20} total={432} onPageChange={setPage} />
      </Section>

      {/* Icons */}
      <Section title={`Icons — ${ICONS.length} symbols`}>
        {ICONS.map((name) => (
          <div key={name} className="flex-col gap-1 gallery-icon">
            <Icon name={name} size="lg" />
            <span className="t-caption gallery-label">{name}</span>
          </div>
        ))}
      </Section>

      {/* Icon contexts */}
      <Section title="Icon contexts">
        {(["muted", "primary", "accent", "error", "success"] as const).map((ctx) => (
          <div key={ctx} className="flex-col gap-1 gallery-center">
            <Icon name="alert" size="xl" ctx={ctx} />
            <span className="t-caption">{ctx}</span>
          </div>
        ))}
      </Section>

      {/* Flags */}
      <Section title={`Flags — ${JURIS_CCS.length} jurisdictions`}>
        {JURIS_CCS.map((cc) => (
          <div key={cc} className="flex-col gap-1 gallery-center">
            <Flag cc={cc} size="lg" />
            <span className="t-caption gallery-label">{cc}</span>
          </div>
        ))}
      </Section>

      {/* Dropdown */}
      <Section title="Dropdown">
        <Dropdown
          trigger={<Button variant="secondary">Actions ▾</Button>}
          items={[
            { label: "Edit obligation", onClick: () => {} },
            { label: "Assign to…", onClick: () => {} },
            "divider",
            { label: "Mark as conflicted", onClick: () => {} },
            "divider",
            { label: "Delete", onClick: () => {}, danger: true },
          ]}
        />
      </Section>

      {/* Modal */}
      <Section title="Modal">
        <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Assign obligation"
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>Save</Button>
            </>
          }
        >
          <p>Select a responsible owner for this obligation. The owner will be notified by email.</p>
          <Input label="Owner" placeholder="María Cárdenas" />
        </Modal>
      </Section>
    </div>
  );
}
