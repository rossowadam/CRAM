import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Course from "./pages/Course";
import MainLayout from "./components/layout/MainLayout";
import { TooltipProvider } from "./components/ui/tooltip";
import StickyNavLayout from "./components/layout/StickyNavLayout";


function App() {
  return (
    <Routes>

      {/* Landing Page with Course Search */}
      <Route element={<StickyNavLayout/>}>
        <Route path="/" element={<Home />} />
      </Route>
      
      {/* Individual Course Pages */}
      <Route element={<MainLayout />}>
        <Route
          path="/course/:courseId"
          element={
            <TooltipProvider>
              <Course />
            </TooltipProvider>
          }
        />
      </Route>

    </Routes>
  );
}

export default App;