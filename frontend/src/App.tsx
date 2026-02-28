import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Navbar from './components/layout/Navbar';
import Course from './pages/Course';
import { SidebarProvider } from './components/ui/sidebar';
import { TooltipProvider } from './components/ui/tooltip';
import CourseSidebar from './components/layout/CourseSidebar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route path='/course/:courseId' element={
          <TooltipProvider>
            <SidebarProvider
              defaultOpen={true}
              style={
                {
                  "--sidebar-width": "20rem",
                  "--sidebar-width-mobile": "20rem",
                } as React.CSSProperties
              }
            >
              <CourseSidebar />
              <Course />

            </SidebarProvider>
          </TooltipProvider>
        } />
      </Routes>
    </>
  );
}

export default App
