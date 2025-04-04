"use cleint"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllusers, User } from "@/lib/api/users";
import { Link } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
export default function AddMemberDialog({handleSubmission}: {handleSubmission: (users: number[]) => Promise<void>}) {
  const invitationToken = "XYZ123ABC";
 
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
    }
    fetchUsers()
  }, [])
  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-5 px-4 w-full">
      <h6 className="text-[20px] font-bold text-white-800">
        Ajouter un membre
      </h6>
      <div className="flex gap-2 items-center">
        <Input
          disabled
          value={"https://bonjourcse.com/invitation?token=" + invitationToken}
        />
        <Button
          variant={"default"}
          className="w-fit bg-white-100 text-white-800 hover:bg-coral-50"
        >
          {" "}
          <Link />
          Copier
        </Button>
      </div>
      <div className=" flex gap-2 items-center">
        <Input
          type="email"
          placeholder="Invitez des gens par nom ou par email"
        />
        <Button
          variant="default"
          className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400"
          
        >
          Inviter
        </Button>
      </div>
      <div>
        <h6 className="font-medium text-[10px]">Invitation en attente</h6>
        <ScrollArea  className=" mt-3 flex flex-col px-3">
          {users ? users.map((user, index) => (
            <div key={index} className="flex justify-between mt-3">
              <div className="flex gap-3">
                <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                  <Image
                    unoptimized
                    src={"/user-icon.svg"}
                    width={16}
                    height={19}
                    alt="user icon"
                  />
                </div>

                {user.email}
              </div>
              <div className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
                <Checkbox  value={user.id}
                  checked={selectedUsers?.includes(user.id)}
                  onChange={() => {
                    setSelectedUsers(
                      selectedUsers.includes(user.id) ?
                        selectedUsers.filter((id) => id !== user.id) :
                        [...selectedUsers, user.id]
                    );
                  }
                  }
                
                />
              </div>
            </div>
          )) : null}
        </ScrollArea>
          </div>
          <Button
              variant="default"
          className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400"
          onClick={async() => {
            if (selectedUsers?.length >= 1) {
              try {
                await handleSubmission(selectedUsers)

                
              } catch (error: unknown) {
                console.error("Error adding members to team:", (error as Error).message);
                
              }
            }
          }}>
              Valider
          </Button>
    </div>
  );
}
