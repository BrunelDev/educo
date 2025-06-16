"use client";
import { getCookies } from "@/lib/utils/cookies";
import Actuality from "./components/actuality";
import Formations from "./components/formations";
import Reunions from "./components/reunions";
import Suggestions from "./components/suggestions";
import { User } from "@/lib/api/users";

export default function DashboardPage() {
  const user: User = JSON.parse(getCookies("userInfo") || "{}");
  console.log(user);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <h6 className="text-sm">
        Bienvenu,{" "}
        <span className="font-bold text-[16px] text-coral-500">
          {user.first_name ? `${user.first_name} ${user.last_name}` : user.email}
        </span>
      </h6>
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        <div className="w-full md:w-[60%] flex flex-col gap-6">
          <Suggestions />
          <Formations />
          <Reunions />
        </div>
    <div className="w-full lg:w-[38%]">
          <h3 className="font-semibold text-[14px] mb-1">Actualités</h3>

          <Actuality />
        </div>
      </div>
    </div>
  );
}
