"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

const NAV = [
  { label: "Dashboard",          href: "/",          icon: "regulation" },
  { label: "Obligation Register", href: "/register",  icon: "obligation" },
  { label: "Conflict Detection",  href: "/conflicts", icon: "conflict" },
  { label: "Regulatory Sources",  href: "/sources",   icon: "monitor" },
  { label: "Reports",             href: "/reports",   icon: "export" },
];

const SYSTEM = [
  { label: "Settings", href: "/settings", icon: "settings" },
];

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active: boolean;
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={["nav-item", active ? "is-active" : ""].filter(Boolean).join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={icon} size="md" />
      <span className="nav-item__label">{label}</span>
    </Link>
  );
}

export default function SidebarNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="sidebar__nav" aria-label="Main navigation">
        <div className="sidebar__group">Regulatory Platform</div>
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}
        <div className="sidebar__group">System</div>
        {SYSTEM.map((item) => (
          <NavItem key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      <div className="sidebar__footer">
        Obliga<span className="t-italic">I</span> v0.1
      </div>
    </>
  );
}
