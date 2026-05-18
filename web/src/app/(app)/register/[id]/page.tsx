import { notFound } from "next/navigation";
import Link from "next/link";
import { OBLIGATIONS } from "@/data/obligations";
import { REGULATIONS, JURISDICTIONS } from "@/data/registry";
import ObligationDetail from "@/components/product/ObligationDetail";
import Icon from "@/components/ui/Icon";

export default async function ObligationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const obligation = OBLIGATIONS.find((o) => o.id === id);
  if (!obligation) notFound();

  const regulation = REGULATIONS.find((r) => r.id === obligation.regulationId)!;
  const jurisdiction = JURISDICTIONS.find((j) => j.id === obligation.jurisdictionId)!;

  return (
    <div>
      <div className="flex-start gap-2 mb-4">
        <Link
          href="/register"
          className="btn btn-ghost btn--size-sm flex-start gap-1"
          aria-label="Back to obligation register"
        >
          <Icon name="chevron-left" size="sm" />
          Register
        </Link>
      </div>

      <ObligationDetail
        obligation={obligation}
        regulation={regulation}
        jurisdiction={jurisdiction}
        validationScore={obligation.completeness}
        frameworks={[obligation.framework]}
      />
    </div>
  );
}
