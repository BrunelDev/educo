import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Assistance IA",
    url: "#/assistance",
    icon: Inbox,
  },
  {
    title: "Réunions",
    url: "/reunions",
    icon: Calendar,
  },
  {
    title: "Consultations CSE",
    url: "/consultations",
    icon: Search,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: Settings,
  },
  {
    title: "Gestion des tâches",
    url: "/gestion",
    icon: Settings,
  },
  {
    title: "Formations",
    url: "/formations",
    icon: Settings,
  },
  {
    title: "Fichiers",
    url: "/fichiers",
    icon: Settings,
  },
  {
    title: "Equipe",
    url: "/equipe",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
            <div className="flex justify-center">
              <Image
                src={"logo.svg"}
                width={169}
                height={59.3}
                alt="The logo"
                className="py-4 border-b border-white-200"
              />
            </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4 mx-2 w-[169px] pb-4 border-b">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
  );
}
