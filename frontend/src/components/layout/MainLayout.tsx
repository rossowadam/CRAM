import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="sticky top-0 z-5">
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
}