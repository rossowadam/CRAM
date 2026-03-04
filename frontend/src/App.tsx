import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import Course from "./pages/Course";
import { SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import CourseSidebar from "./components/layout/CourseSidebar";

function App() {
  return (
    <div className="h-dvh flex flex-col bg-background text-foreground">
      <Navbar />
      {/* Viewport for pages */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/course/:courseId"
            element={
              <TooltipProvider>
                <SidebarProvider
                  defaultOpen={true}
                  style={
                    {
                      "--sidebar-width": "20rem",
                      "--sidebar-width-mobile": "20rem",
                      height: "100%", // To help the sidebar layout fill main.
                    } as React.CSSProperties
                  }
                >
                  <CourseSidebar />
                  <Course />
                </SidebarProvider>
              </TooltipProvider>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;