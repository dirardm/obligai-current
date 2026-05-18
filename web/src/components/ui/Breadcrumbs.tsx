/**
 * Breadcrumbs — page trail navigation.
 *
 * @example
 * <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Register" }]} />
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav className={["breadcrumbs", className].filter(Boolean).join(" ")} aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="breadcrumbs__item">
            {i > 0 && <span className="breadcrumbs__sep" aria-hidden="true">/</span>}
            {isLast || !item.href ? (
              <span className={isLast ? "breadcrumbs__current" : ""}>{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
