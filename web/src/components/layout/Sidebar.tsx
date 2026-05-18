import Logo from "@/components/ui/Logo";
import SidebarNav from "./SidebarNav";
import SidebarShell from "./SidebarShell";

export default function Sidebar() {
  return (
    <SidebarShell>
      <div className="sidebar__brand">
        <Logo size="sm" />
      </div>
      <SidebarNav />
    </SidebarShell>
  );
}
