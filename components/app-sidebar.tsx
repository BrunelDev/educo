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
import { getUser, updateProfile, User } from "@/lib/api/users";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
    title: "Consultations académiques",
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
  const [userInfo, setUserInfo] = useState<User | null>(null);
  useEffect(() => {
    const fun = async () => {
      const userInfoResponse: User = await getUser();
      console.log(
        "--------is last message read-------",
        userInfoResponse.is_last_message_read,
      );
      setUserInfo(userInfoResponse);
    };
    fun();
  }, [updateProfile]);
  const pathname = usePathname();
  console.log(pathname);
  console.log(items);
  const isActive = (path: string) => {
    return pathname.includes(path);
  };
  console.log(pathname);
  return (
    <Sidebar className="w-[210px]">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex justify-center">
            <Image
              src={"/logo.png"}
              width={169}
              height={59.3}
              alt="The logo"
              className="py-4 border-b border-white-200"
            />
          </div>
          <SidebarGroupContent className="">
            <SidebarMenu className="gap-4 px-2yy w-full pb-4 border-b my-5">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title + index} className="relative">
                  <SidebarMenuButton
                    key={item.title + index}
                    asChild
                    className={`group/item relative hover:bg-gradient-to-r ${
                      isActive(item.url) ?
                        "bg-gradient-to-r from-[#FFDDE3] to-[#FFDDE300]"
                      : ""
                    } hover:from-[#FFDDE3] hover:to-[#FFDDE300] w-full py-2 px-3`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-3"
                      onClick={async (e) => {
                        if (
                          item.title === "Messages" &&
                          userInfo &&
                          !userInfo?.is_last_message_read
                        ) {
                          e.preventDefault();
                          await updateProfile({ is_last_message_read: true });
                          setUserInfo((prev) =>
                            prev ?
                              { ...prev, is_last_message_read: true }
                            : prev,
                          );
                          window.location.href = item.url;
                        }
                      }}
                    >
                      <div
                        className={`h-6 w-1 absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 opacity-0 group-hover/item:opacity-100 group-hover/item:animate-slide-in`}
                      ></div>
                      {isActive(item.url) && (
                        <div
                          className={`h-6 w-1 absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 opacity-100`}
                          style={{ transform: "translateX(0px)" }}
                        ></div>
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.title === "Messages" &&
                    userInfo &&
                    !userInfo?.is_last_message_read && (
                      <div className="absolute h-2 w-2 right-2 top-1/2 -translate-y-1/2 bg-red-500 rounded-full text-white text-xs flex justify-center items-center"></div>
                    )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link
          href={"/profile"}
          className={`flex justify-between items-center px-2 py-1 hover:pl-4 hover:bg-white-100 ${
            isActive(pathname) ? "bg-white-100" : ""
          } duration-200 rounded-[8px]`}
        >
          <div className="flex items-center gap-5 ">
            <div className="relative h-[32px] w-[32px] rounded-full overflow-hidden bg-gray-100">
              <Image
                src={userInfo?.image ? userInfo.image : "/userProfile-img.png"}
                alt={"user profile image"}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>

            <h6
              className={`text-white-800 font-semibold text-sm ${
                userInfo?.first_name ? "" : "truncate w-[100px]"
              }`}
            >
              {userInfo?.first_name ? userInfo.first_name : userInfo?.email}{" "}
              {userInfo?.last_name ? userInfo.last_name : ""}
            </h6>
          </div>
          <ChevronRight />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
