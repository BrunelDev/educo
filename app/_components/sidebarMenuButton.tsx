"use client";
import { SidebarMenuButton as Button } from "@/components/ui/sidebar";
import { LucideProps } from "lucide-react";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default function SidebarMenuButton({
  item,
}: {
  item: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  };
}) {
  const pathname = usePathname();
  return (
    <Button
      asChild
      className={`hover:bg-gradient-to-r hover:from-[#FFDDE3] hover:to-[#FFDDE300] w-full ${
        pathname.includes(item.url)
          ? "bg-gradient-to-r from-[#FFDDE3] to-[#FFDDE300]"
          : null
      }`}
    >
      <a href={item.url}>
        <item.icon />
        <span>{item.title}</span>
      </a>
    </Button>
  );
}
