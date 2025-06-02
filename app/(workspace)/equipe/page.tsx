"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
//import SearchBar from "../components/searchBar";
import AssociateCard from "./components/associateCard";
import Contact from "./components/contact";
import AddOrganisation from "./components/addOrganisation";
import TeamFormHandler from "../components/teamFormHandler";
import { getCookies } from "@/lib/utils/cookies";
import {  getOrganization, OrganizationResponse } from "@/lib/api/organisation";
import EmptyState from "@/app/_components/EmptyState";

export default function Equipe() {
  
  //const [searchValue, setSearchValue] = useState<string>("");
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
      <div className="flex relative flex-col gap-6 w-full px-4 sm:px-6">
        <h6 className="text-xl sm:text-2xl font-semibold">Equipe</h6>
        <Contact />
        
        {/* Header section with responsive layout */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          {users?.membres ? 
            <h6 className="text-lg font-medium">{users.membres?.length} associés</h6> : 
            <h6 className="text-lg font-medium">Aucune équipe liée.</h6>
          }
          
          {/* Actions container with responsive adjustments */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {users?.membres ? 
              <div className="w-full sm:w-auto">
                {/*<SearchBar
                  value={searchValue}
                  handleChange={setSearchValue}
                  placeholder={"Rechercher"}
                />*/}
              </div> : null
            }
            
            {/* Organization button - repositioned for mobile */}
            {!users?.organisation &&
            <div className="sm:absolute sm:right-6 sm:-top-11 order-first sm:order-none mb-2 sm:mb-0">
            <DialogComponent
              className={"sm:max-w-[768px]"}
              dialoTrigger={
                <Button
                  variant={"default"}
                  className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400 flex w-full sm:w-auto"
                >
                  <Plus className="mr-1" /> <span className="whitespace-nowrap">Ajouter une organisation</span>
                </Button>
              }
              dialogContent={<AddOrganisation/>}
              dialogTitle={null}
            />
          </div> }
            
            
            {/* Add member button */}
            <div className="w-full sm:w-auto">
              {users?.organisation?.id ?
                <DialogComponent
                  dialoTrigger={
                    <Button
                      variant={"default"}
                      className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400 flex w-full sm:w-auto"
                    >
                      <Plus className="mr-1" /> <span className="whitespace-nowrap">Ajouter un membre</span>
                    </Button>
                  }
                  dialogContent={<TeamFormHandler orgId={users?.organisation?.id}/>}
                  dialogTitle={null}
                /> : null
              }
            </div>
          </div>
        </div>
        
        {/* Cards grid with responsive sizing */}
        <div className="flex flex-wrap gap-4">
          {users
            ? users.membres?.map((user, index) => (
                <AssociateCard key={user.id + index} associate={user} />
              ))
            : <div className="col-span-full flex justify-center items-center py-8">
                <EmptyState 
                  title={"Vous n'appartenez à aucune organisation"} 
                  description={"Veuillez créer une organisation pour commencer."}
                />
              </div>
          }
        </div>
        {/*<div className="flex flex-wrap gap-6">
          {associates.map((associate, index) => (
            <AssociateCard key={associate.id + index} associate={associate} />
          ))}
        </div>*/}
      </div>
    );
  
}
