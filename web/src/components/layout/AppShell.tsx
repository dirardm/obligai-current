import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="app-shell">
        <Sidebar />
        <TopBar />
        <main className="app-shell__content">{children}</main>
      </div>
    </>
  );
}
