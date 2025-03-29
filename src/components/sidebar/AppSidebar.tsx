"use client";

import { User } from "@/app/types/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { getCookies } from "@/lib/utils/cookies";
import Image from "next/image";
import { SidebarNavItem } from "./SidebarNavItem";
import { UserProfile } from "./UserProfile";

export function AppSidebar() {
  const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");

  return (
    <Sidebar className="w-[210px]">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex justify-center">
            <Image
              src="logo.svg"
              width={169}
              height={59.3}
              alt="The logo"
              className="py-4 border-b border-white-200"
            />
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4 px-2 w-full pb-4 border-b my-5">
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarNavItem key={item.url} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfile user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
