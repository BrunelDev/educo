import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarNavItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function SidebarNavItem({ title, url, icon: Icon }: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="group/item relative hover:bg-gradient-to-r hover:from-[#FFDDE3] hover:to-[#FFDDE300] w-full py-2 px-3"
      >
        <Link href={url} className="flex items-center gap-3">
          <div className="h-6 w-1 absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 opacity-0 group-hover/item:opacity-100 group-hover/item:animate-slide-in"></div>
          <Icon />
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
} 