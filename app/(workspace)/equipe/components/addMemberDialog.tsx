import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link, Minus } from "lucide-react";
import Image from "next/image";
export default function AddMemberDialog() {
  const invitationToken = "XYZ123ABC";
  const pendingInvitations = [
    { name: "John Doe", email: "john.doe@example.com", id: 1245 },
    { name: "Jane Doe", email: "jane.doe@example.com", id: 1245 },
    { name: "Alice Doe", email: "alice.doe@example.com", id: 1245 },
  ];
  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-10 px-20 w-full">
      <DialogTitle className="text-[20px] font-bold text-white-800">Ajouter un membre</DialogTitle>
      <div className="flex gap-2 items-center">
        <Input
          disabled
          value={"https://bonjourcse.com/invitation?token=" + invitationToken}
        />
        <Button variant={"default"} className="w-fit bg-white-100 text-white-800 hover:bg-coral-50"> <Link />Copier</Button>
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
              <div className=" mt-3 flex flex-col gap-3">
                  {pendingInvitations.map((invitation, index) => (
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

              {invitation.email}
                          </div>
                          <div className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
                          <Minus color="#464646" size={15}/>
                          </div>
            
          </div>
        ))}
              </div>
        
      </div>
    </div>
  );
}
