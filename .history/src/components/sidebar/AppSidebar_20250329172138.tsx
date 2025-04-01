"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { useUserStore } from "@/store/userStore";
import { logger } from "@/utils/logger";
import Image from "next/image";
import { useEffect } from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { UserProfile } from "./UserProfile";

export function AppSidebar() {
  const { user, isAuthenticated, setUser } = useUserStore();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser && !isAuthenticated) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        logger.info("Utilisateur restauré depuis le stockage local", {
          userId: parsedUser.id,
        });
      }
    } catch (error) {
      logger.error("Erreur lors de la restauration de l'utilisateur", { error });
    }
  }, [isAuthenticated, setUser]);

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
        <UserProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
