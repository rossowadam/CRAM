import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function AppSidebar() {
  
  return (
    <>
    <SidebarTrigger/>
    <Sidebar side="left" variant="floating">
        <SidebarTrigger/>
        <SidebarHeader>
        Header
        </SidebarHeader> 
        {/* Scrollable content. */}
        <SidebarContent>
            {/* Section. */}
            <SidebarGroup>
                <SidebarGroupLabel>Section Label</SidebarGroupLabel>
                <SidebarMenuButton>Click me</SidebarMenuButton>
                <SidebarMenu>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SidebarMenuItem key={index}>
                        <SidebarMenuSkeleton />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup> 
            <SidebarGroup>
                <SidebarGroupLabel>Section Label</SidebarGroupLabel>
                <SidebarMenuButton>Click me</SidebarMenuButton>
                <SidebarMenuItem>
                    <SidebarMenuButton>Button</SidebarMenuButton>
                    <SidebarMenuSub>
                        there is a submenu here
                        <SidebarMenuSubItem>
                            this is the submenu item
                            <SidebarMenuSubButton >
                                sub menu button
                            </SidebarMenuSubButton>
                            <SidebarMenuBadge>Badge</SidebarMenuBadge>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </SidebarMenuItem>
                </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            Footer 
        </SidebarFooter>
    </Sidebar>
    </>
  )
}