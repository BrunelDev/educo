"use client";
import { Users , LayoutGrid , Sparkles , NotepadText , CircleCheck,GraduationCap,MessageSquareMore, FolderClosed, UsersRound    } from "lucide-react";

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

// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: LayoutGrid ,
  },
  {
    title: "Assistance IA",
    url: "/assistance",
    icon: Sparkles ,
  },
  {
    title: "Réunions",
    url: "/reunions",
    icon: Users ,
  },
  {
    title: "Consultations CSE",
    url: "/consultations",
    icon: NotepadText ,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquareMore  ,
  },
  {
    title: "Gestion des tâches",
    url: "/gestion",
    icon: CircleCheck ,
  },
  {
    title: "Formations",
    url: "/formations",
    icon: GraduationCap ,
  },
  {
    title: "Fichiers",
    url: "/fichiers",
    icon: FolderClosed ,
  },
  {
    title: "Equipe",
    url: "/equipe",
    icon: UsersRound ,
  },
];

export function AppSidebar() {
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
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title + index}>
                  <SidebarMenuButton
                    key={item.title + index}
                    asChild
                    className="group/item relative hover:bg-gradient-to-r hover:from-[#FFDDE3] hover:to-[#FFDDE300] w-full py-2 px-3"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <div className="h-6 w-1 absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 opacity-0 group-hover/item:opacity-100 group-hover/item:animate-slide-in"></div>
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
