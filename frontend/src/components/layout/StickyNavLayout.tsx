import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function StickyNavLayout() {
  return (
    <div className="h-dvh flex flex-col bg-background text-foreground">
      <div className="shrink-0 sticky top-0 z-5">
        <Navbar />
      </div>

      {/* only have THIS scroll */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}