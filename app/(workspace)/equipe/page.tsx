"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { getTeams, TeamApiResponse } from "@/lib/api/equipe";
import { AssociateProps } from "@/lib/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "../components/searchBar";
import AddMemberDialog from "./components/addMemberDialog";
import AssociateCard from "./components/associateCard";
import Contact from "./components/contact";
import AddOrganisation from "./components/addOrganisation";

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
  const [teams, setTeams] = useState<TeamApiResponse>();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeams();
        console.log(response);
        setTeams(response);
      } catch (error: unknown) {
        console.error("Failed to fetch teams", error);
      }
    };
    fetchTeams();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <h6>Equipe</h6>
      <Contact />
      <div className="flex justify-between">
        <h6>{associates.length} associés</h6>
        <div className="flex gap-3 items-center ">
          <SearchBar
            value={searchValue}
            handleChange={setSearchValue}
            placeholder={"Recherhcer"}
          />{" "}
          <div className="w-full">
            <DialogComponent
              className={"sm:max-w-[768px]"}
              dialoTrigger={
                <Button
                  variant={"default"}
                  className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400"
                >
                  <Plus /> Ajouter une organisation
                </Button>
              }
              dialogContent={<AddOrganisation/>}
              dialogTitle={null}
            />
            <DialogComponent
              dialoTrigger={
                <Button
                  variant={"default"}
                  className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400"
                >
                  <Plus /> Ajouter un membre
                </Button>
              }
              dialogContent={<AddMemberDialog teamId={teams?.results[0].id} />}
              dialogTitle={null}
            />
          </div>
        </div>
      </div>
      <div>
        {teams
          ? teams.results.map((team, index) => (
              <div key={index + team.id} className="flex flex-wrap gap-6">
                {team.membres.map((member, index) => (
                  <AssociateCard key={member.id + index} associate={member} />
                ))}
              </div>
            ))
          : null}
      </div>
      {/*<div className="flex flex-wrap gap-6">
        {associates.map((associate, index) => (
          <AssociateCard key={associate.id + index} associate={associate} />
        ))}
      </div>*/}
    </div>
  );
}
