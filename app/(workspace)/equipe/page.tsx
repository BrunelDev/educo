"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SearchBar from "../components/searchBar";
import AssociateCard from "./components/associateCard";
import Contact from "./components/contact";
import AddOrganisation from "./components/addOrganisation";
import TeamFormHandler from "../components/teamFormHandler";
import { getCookies } from "@/lib/utils/cookies";
import {  getOrganization, OrganizationResponse } from "@/lib/api/organisation";
import EmptyState from "@/app/_components/EmptyState";

export default function Equipe() {
  
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<OrganizationResponse>();
       useEffect(() => {
          const fun = async () => {
            try {
              let storedData = "";
              if (typeof window !== "undefined") {
                storedData = JSON.parse(getCookies("userInfo") || "{}");
              }
      
              console.log("token", storedData);
              const response = await getOrganization();
              setUsers(response);
            } catch (error) {
              console.error(error);
            }
          };
          fun();
       }, []);

    return (
      <div className="flex relative flex-col gap-6">
        <h6>Equipe</h6>
        <Contact />
        <div className="flex justify-between">
          {users?.membres ? <h6>{users.membres?.length} associés</h6> : <h6>Aucune équipe liée.</h6>}
          <div className="flex gap-3 items-center ">
            {users?.membres ? <SearchBar
              value={searchValue}
              handleChange={setSearchValue}
              placeholder={"Recherhcer"}
            /> : null}
            <div className="absolute right-6 -top-11">
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
            </div>
            <div className="w-full">
              {users?.organisation?.id ?
              <DialogComponent
              dialoTrigger={
                <Button
                  variant={"default"}
                  className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400"
                >
                  <Plus /> Ajouter un membre
                </Button>
              }
              dialogContent={<TeamFormHandler orgId={users?.organisation?.id}/>}
              dialogTitle={null}
            /> : null}
              
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {users
            ? users.membres?.map((user, index) => (
                
                    <AssociateCard key={user.id + index} associate={user} />
              ))
            : <div className="w-full flex justify-center items-center">
            <EmptyState title={"Vous n'appartenez à aucune organisation"} description={"Veuillez créer une organisation pour commencer."}/></div>}
        </div>
        {/*<div className="flex flex-wrap gap-6">
          {associates.map((associate, index) => (
            <AssociateCard key={associate.id + index} associate={associate} />
          ))}
        </div>*/}
      </div>
    );
  
}
