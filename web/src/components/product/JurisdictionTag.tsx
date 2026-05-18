/**
 * @example
 * <JurisdictionTag jurisdiction={jurisdiction} />
 * <JurisdictionTag jurisdiction={jurisdiction} showFlag={false} />
 */
import Flag from "@/components/ui/Flag";
import type { JurisdictionId, Jurisdiction } from "@/data/registry";

interface JurisdictionTagProps extends React.ComponentPropsWithoutRef<"span"> {
  jurisdiction: Jurisdiction;
  showFlag?: boolean;
}

export default function JurisdictionTag({
  jurisdiction,
  showFlag = true,
  className = "",
  ...props
}: JurisdictionTagProps) {
  const cls = ["tag", "tag-jurisdiction", className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...props}>
      {showFlag && <Flag cc={jurisdiction.cc} size="sm" />}
      {jurisdiction.label}
    </span>
  );
}
