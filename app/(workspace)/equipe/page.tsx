"use client";
import { Button } from "@/components/ui/button";
import { AssociateProps } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import SearchBar from "../components/searchBar";
import AssociateCard from "./components/associateCard";
import Contact from "./components/contact";
import { DialogComponent } from "@/app/_components/dialogComponent";
import AddMemberDialog from "./components/addMemberDialog";

export default function Equipe() {
  const associates: AssociateProps[] = [
    {
      profileImageUrl: "/userProfile-img.png",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      id: "541",
    },
    {
      profileImageUrl: "/userProfile-img.png",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      id: "541",
    },
    {
      profileImageUrl: "/userProfile-img.png",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      id: "541",
    },
    {
      profileImageUrl: "/userProfile-img.png",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      id: "541",
    },
    {
      profileImageUrl: "/userProfile-img.png",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      id: "541",
    },
  ];
  const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div className="flex flex-col gap-6">
      <h6>Equipe</h6>
      <Contact />
      <div className="flex justify-between">
        <h6>{associates.length} associés</h6>
        <div className="flex gap-3 items-center">
          <SearchBar
            value={searchValue}
            handleChange={setSearchValue}
            placeholder={"Recherhcer"}
          />{" "}
          <div className="w-full">
          <DialogComponent
              dialoTrigger={<Button variant={"default"} className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400">
                <Plus /> Ajouter un membre
              </Button>}
              dialogContent={<AddMemberDialog />} dialogTitle={null}        />
          </div>
        
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        {associates.map((associate, index) => (
          <AssociateCard key={associate.id + index} associate={associate} />
        ))}
      </div>
    </div>
  );
}
