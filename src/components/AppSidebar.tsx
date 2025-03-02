
import { User, BookOpenText, Wand2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Rasputin",
    path: "/rasputin",
    icon: User,
  },
  {
    title: "Alexa",
    path: "/alexa",
    icon: BookOpenText,
  },
  {
    title: "Tarot",
    path: "/tarot",
    icon: Wand2,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()

  return (
    <Sidebar>
      <SidebarHeader className="text-center py-4">
        <h1 className="text-xl font-bold">Starfield</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center">
        <span className="text-xs text-muted-foreground">© 2025 Starfield</span>
      </SidebarFooter>
    </Sidebar>
  )
}
