import { CircleUserRound, Search, Settings, BriefcaseBusiness, ChartNoAxesCombined } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Profile",
    url: "/profile",
    icon: CircleUserRound,
  },
  {
    title: "Portfolios",
    url: "/portfolio",
    icon: BriefcaseBusiness,
  },
  {
    title: "Buy stocks",
    url: "stocks",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Search",
    url: "quotes",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <>

    <Sidebar className="">

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => console.log(item.url)} asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    </>

  )
}