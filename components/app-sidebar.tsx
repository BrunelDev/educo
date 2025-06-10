"use client";
import {
  ChevronRight,
  CircleCheck,
  FolderClosed,
  GraduationCap,
  LayoutGrid,
  MessageSquareMore,
  NotepadText,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import Image from "next/image";

import { User } from "@/app/types/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getCookies } from "@/lib/utils/cookies";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Assistance IA",
    url: "/assistance",
    icon: Sparkles,
  },
  {
    title: "Réunions",
    url: "/reunions",
    icon: Users,
  },
  {
    title: "Consultations CSE",
    url: "/consultations",
    icon: NotepadText,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquareMore,
  },
  {
    title: "Gestion des tâches",
    url: "/gestion",
    icon: CircleCheck,
  },
  {
    title: "Formations",
    url: "/formations",
    icon: GraduationCap,
  },
  {
    title: "Fichiers",
    url: "/fichiers",
    icon: FolderClosed,
  },
  {
    title: "Equipe",
    url: "/equipe",
    icon: UsersRound,
  },
];

export function AppSidebar() {
  const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
  return (
    <Sidebar className="w-[210px]">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex justify-center">
            <Image
              src={"/logo.svg"}
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
      <SidebarFooter>
        <Link
          href={"/profile"}
          className="flex justify-between items-center px-2 py-1 hover:pl-4 hover:bg-white-100 duration-200 rounded-[8px]"
        >
          <div className="flex items-center gap-5 ">
            <div className="relative h-[32px] w-[32px] rounded-full overflow-hidden bg-gray-100">
            <Image
              width={32}
              height={32}
              src={userInfo.image ? userInfo.image : "/userProfile-img.png"}
              alt={"user profile image"}
            />
            </div>
            
            <h6
              className={`text-white-800 font-semibold text-sm ${
                userInfo.first_name ? "" : "truncate w-[100px]"
              }`}
            >
              {userInfo.first_name ? userInfo.first_name : userInfo.email}{" "}
              {userInfo.last_name ? userInfo.last_name : ""}
            </h6>
          </div>
          <ChevronRight />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
