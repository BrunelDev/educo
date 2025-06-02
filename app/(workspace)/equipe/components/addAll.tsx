"use cleint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllusers, User } from "@/lib/api/users";
import { DialogTitle } from "@radix-ui/react-dialog";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addMembersToTeam } from "@/lib/api/equipe";
export default function AddMemberDialog({ teamId }: { teamId?: number }) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllusers();
        setUsers(response.results);
      } catch (error: unknown) {
        console.error("Error fetching users:", (error as Error).message);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-10 px-20 w-full">
      <DialogTitle className="text-[20px] font-bold text-white-800">
        Ajouter un membre
      </DialogTitle>

      {<div className=" flex gap-2 items-center">
        <Input
          type="email"
          placeholder="Invitez des gens par nom ou par email"
        />
        <Button
          variant="default"
          className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400"
          onClick={async () => {
            if (selectedUsers?.length >= 1) {
              try {
                const response = await addMembersToTeam(selectedUsers, teamId);
                console.log("succes", response);
              } catch (error: unknown) {
                console.error(
                  "Error adding members to team:",
                  (error as Error).message
                );
              }
            }
          }}
        >
          Inviter
        </Button>
      </div>}
      <div>
        <h6 className="font-medium text-[10px]">Invitation en attente</h6>
        <ScrollArea className=" mt-3 flex flex-col gap-3">
          {users
            ? users.map((user, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                      <Image
                        src={"user-icon.svg"}
                        width={16}
                        height={19}
                        alt="user icon"
                      />
                    </div>

                    {user.email}
                  </div>
                  <div className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
                    <Input
                      type="checkbox"
                      value={user.id}
                      checked={selectedUsers?.includes(user.id)}
                      onChange={() => {
                        setSelectedUsers(
                          selectedUsers.includes(user.id)
                            ? selectedUsers.filter((id) => id !== user.id)
                            : [...selectedUsers, user.id]
                        );
                      }}
                    />
                  </div>
                </div>
              ))
            : null}
        </ScrollArea>
      </div>
    </div>
  );
}
