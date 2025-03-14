"use client"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  const path = usePathname()
  
  return (
    <Sidebar className="w-[210px]">
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
          <SidebarGroupContent className="">
            <SidebarMenu className="gap-4 px-2yy w-full pb-4 border-b my-5">
              {
                items.map((item) => (
                  
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={
                    
                    `hover:bg-gradient-to-r hover:from-[#FFDDE3] hover:to-[#FFDDE300] w-full ${path.includes(item.url) ? "bg-gradient-to-r from-[#FFDDE3] to-[#FFDDE300]" : null} w-full py-2 px-3`}>
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
