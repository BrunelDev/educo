"use cleint";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getOrganisationMembers,
  OrganizationMember,
} from "@/lib/api/organisation";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function AddMemberDialog({
  handleSubmission,
}: {
  handleSubmission: (users: number[]) => Promise<void>;
}) {

  const [users, setUsers] = useState<OrganizationMember[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getOrganisationMembers();
        setUsers(response);
      } catch (error: unknown) {
        console.error(
          "Error fetching organization members:",
          (error as Error).message
        );
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-5 px-4 w-full">
      <h6 className="text-[20px] font-bold text-white-800">
        Ajouter un membre
      </h6>
      
   
      <div>
        <h6 className="font-medium text-[10px]">Invitation en attente</h6>
        <ScrollArea className=" mt-3 flex flex-col px-3">
          {users
            ? users.map((user, index) => (
                <div key={index} className="flex justify-between mt-3">
                  <div className="flex gap-3">
                    <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                      <Image
                        src={"/user-icon.svg"}
                        width={16}
                        height={19}
                        alt="user icon"
                      />
                    </div>

                    {user.email}
                  </div>
                  <div className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        setSelectedUsers(
                          checked
                            ? [...selectedUsers, user.id]
                            : selectedUsers.filter((id) => id !== user.id)
                        );
                      }}
                    />
                  </div>
                </div>
              ))
            : <h6 className="font-medium text-[10px]">Aucun membre</h6>}
        </ScrollArea>
      </div>
      <Button
        variant="default"
        className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400"
        onClick={async () => {
          if (selectedUsers?.length >= 1) {
            try {
              await handleSubmission(selectedUsers);
            } catch (error: unknown) {
              console.error(
                "Error adding members to team:",
                (error as Error).message
              );
            }
          }
        }}
      >
        Valider
      </Button>
    </div>
  );
}
