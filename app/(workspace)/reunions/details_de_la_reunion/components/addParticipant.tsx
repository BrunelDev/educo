"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getOrganisationMembers,
  OrganizationMember,
} from "@/lib/api/organisation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function AddMemberDialog({
  handleSubmission,
  existingParticipants,
  label,
  handleEmailSubmission,
}: {
  handleSubmission: (users: number[]) => Promise<void>;
  existingParticipants?: number[];
  label?: string;
  handleEmailSubmission?: (emails: string[]) => Promise<void>;
}) {
  const [users, setUsers] = useState<OrganizationMember[] | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  console.log("existingParticipants", existingParticipants);
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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [emails, setEmails] = useState<string>("");
  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-5 sm:px-4 w-full">
      {label && (
        <>
          <Label
            htmlFor="membres_cse_invites"
            className="font-medium text-white-800 text-xs mb-2 block"
          >
            Invitez des gens à votre organisation (emails séparés par virgule)
          </Label>
          <Input
            value={emails}
            onChange={(e) => {
              setEmails(e.target.value);
            }}
            id="membres_cse_invites"
            name="membres_cse_invites"
            placeholder="invite1@gmail.com, invite2@gmail.com"
            className="w-full"
          />{" "}
        </>
      )}
      <div>
        <ScrollArea className=" mt-3 flex flex-col px-3">
          {users ? (
            users.map((user, index) =>
              existingParticipants?.includes(user.id) ? null : (
                <div
                  key={index}
                  className="flex items-center justify-between mt-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full overflow-hidden">
                      {user.image ? (
                        <Image
                          src={user.image}
                          width={28}
                          height={28}
                          alt="user icon"
                        />
                      ) : (
                        <Image
                          src={"/user-icon.svg"}
                          width={16}
                          height={19}
                          alt="user icon"
                        />
                      )}
                    </div>
                    <span className="w-2/3 sm:w-full truncate font-medium">
                      {user.first_name
                        ? user.first_name + " " + user.last_name
                        : user.email}
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
              )
            )
          ) : (
            <h6 className="font-medium text-[10px]">Aucun membre</h6>
          )}
        </ScrollArea>
      </div>
      <Button
        variant="default"
        className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400 w-1/2 mx-auto sm:mx-0 px-3 sm:px-0 sm:w-full"
        disabled={
          status === "loading" ||
          (selectedUsers?.length === 0 && !emails.trim())
        }
        onClick={async () => {
          if (selectedUsers?.length >= 1 || emails.trim()) {
            try {
              toast.loading("Ajout en cours...");
              setStatus("loading");
              if (handleEmailSubmission) {
                console.log(emails.split(",").map((email) => email.trim()));
                await handleEmailSubmission(
                  emails.split(",").map((email) => email.trim())
                );
              }
              console.log("selectedUsers", selectedUsers);
              await handleSubmission(selectedUsers);
              toast.dismiss();
              setStatus("success");
            } catch (error: unknown) {
              console.error(
                "Error adding members to team:",
                (error as Error).message
              );
              toast.error("Une erreur est survenue lors de l'ajout.");
              setStatus("error");
            }
          }
        }}
      >
        Valider
      </Button>
    </div>
  );
}
