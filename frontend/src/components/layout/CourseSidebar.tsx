import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import type { Section } from "@/api/sectionsApi"
import { BookA, NotebookText } from "lucide-react";

type CourseSidebarProps = {
    sections: Section[],
    courseCode: string,
}

export default function CourseSidebar({
    sections, courseCode
}: CourseSidebarProps) {

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };
  return (
    <div >
        
        <Sidebar side="left" variant="inset">
            
            <SidebarHeader className="text-secondary font-bold">
                {courseCode}
            </SidebarHeader> 
            {/* Scrollable content. */}
            <SidebarContent>
                {/* Section. */}
                <SidebarGroup>
                <SidebarGroupLabel className="text-sm font-semibold">Sections</SidebarGroupLabel>
                    {sections?.map((section) => (
                        <SidebarMenuButton 
                            key={section._id}
                            className="my-2 sm:h-auto hover:cursor-pointer hover:bg-primary-foreground hover:text-secondary rounded-none"
                            onClick={() => scrollTo(`section-${section._id}`)}
                        >
                            <NotebookText />
                            {section.title}
                        </SidebarMenuButton>
                    ))}
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Definitions</SidebarGroupLabel>
                    <SidebarMenuButton  
                        className="hover:cursor-pointer hover:bg-primary-foreground hover:text-secondary rounded-none"
                        onClick={() => scrollTo("definitions")}
                    >
                        <BookA />
                        Go To Definitions
                    </SidebarMenuButton>
                </SidebarGroup>
                    
            </SidebarContent>
            <SidebarFooter className="font-bold text-secondary">
                C.R.A.M.
            </SidebarFooter>
        </Sidebar>
    </div>
  )
}