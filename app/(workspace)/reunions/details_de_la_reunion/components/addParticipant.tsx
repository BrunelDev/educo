"use client";
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
    <div className="flex flex-col gap-4 rounded-[12px] py-5 sm:px-4 w-full">
      <h6 className="text-[20px] font-bold text-white-800">
        Ajouter un membre
      </h6>
      <div>
        <h6 className="font-medium text-[10px] sm:w-full w-2/3 pl-5">
          Invitation en attente
        </h6>
        <ScrollArea className=" mt-3 flex flex-col px-3">
          {users ? (
            users.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between mt-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex-shrink-0 h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                    <Image
                      src={"/user-icon.svg"}
                      width={16}
                      height={19}
                      alt="user icon"
                    />
                  </div>
                  <span className="w-2/3 sm:w-full truncate font-medium">
                    {user.email}
                  </span>
                </div>
                <div className="flex-shrink-0 h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
                  <Checkbox
                    color="black"
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
          ) : (
            <h6 className="font-medium text-[10px]">Aucun membre</h6>
          )}
        </ScrollArea>
      </div>
      <Button
        variant="default"
        className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400 w-1/2 mx-auto sm:mx-0 px-3 sm:px-0 sm:w-full"
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
