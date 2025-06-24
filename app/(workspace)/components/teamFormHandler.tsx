import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addToOrganization, updateOrganisation } from "@/lib/api/organisation";
import { getMembersWithNoTeam, User } from "@/lib/api/users";
import { getCookies } from "@/lib/utils/cookies";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export function TeamFormHandler({
  orgId,
  handleClose,
}: {
  orgId: number;
  handleClose?: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    const fun = async () => {
      try {
        let storedData = "";
        if (typeof window !== "undefined") {
          storedData = JSON.parse(getCookies("userInfo") || "{}");
        }

        console.log("token", storedData);
        const response = await getMembersWithNoTeam();
        console.log("res", response);
        if (response) {
          setUsers(response);
        }
      } catch (error) {
        console.error("error geting users", error);
      }
    };
    fun();
  }, []);

  const handleCheckboxChange = (checked: boolean, userId: number) => {
    setSelectedMembers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMembers.length === 0) {
      toast.error("Veuillez sélectionner au moins un membre");
      return;
    }

    try {
      await addToOrganization(orgId, selectedMembers);
      toast.success("Membres ajoutés avec succès à l'organisation");
      setSelectedMembers([]); // Reset selection
      handleClose?.();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.detail);
        return;
      }
      toast.error("Erreur lors de l'ajout des membres à l'organisation");
      console.error(error);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 p-3">
      {users
        ? users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-2"
            >
              <div className="flex gap-3 items-center">
                <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                  <Image
                    src={"user-icon.svg"}
                    width={16}
                    height={19}
                    alt="user icon"
                  />
                </div>
                <label
                  htmlFor={`user-${user.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {user.email}
                </label>
              </div>
              <Checkbox
                color="black"
                id={`user-${user.id}`}
                checked={selectedMembers.includes(user.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked as boolean, user.id)
                }
              />
            </div>
          ))
        : null}
      <Button
        type="submit"
        className="mt-4 px-4 py-2 bg-gradient-to-r from-coral-400 to-crimson-400 text-white rounded"
      >
        Ajouter les membres
      </Button>
    </form>
  );
}

export function TeamFormHandlerWithMail({
  orgId,
  handleClose,
}: {
  orgId: number;
  handleClose?: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    const fun = async () => {
      try {
        let storedData = "";
        if (typeof window !== "undefined") {
          storedData = JSON.parse(getCookies("userInfo") || "{}");
        }

        console.log("token", storedData);
        const response = await getMembersWithNoTeam();
        console.log("res", response);
        if (response) {
          setUsers(response);
        }
      } catch (error) {
        console.error("error geting users", error);
      }
    };
    fun();
  }, []);

  const handleCheckboxChange = (checked: boolean, userId: number) => {
    setSelectedMembers((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const formatAndValidateEmails = (
    emailsString: string
  ): { validEmails: string[]; invalidEmails: string[] } => {
    if (!emailsString || emailsString.trim() === "") {
      return { validEmails: [], invalidEmails: [] };
    }
    const emailCandidates = emailsString.split(",");
    const validEmails: string[] = [];
    const invalidEmails: string[] = [];

    emailCandidates.forEach((candidate) => {
      const trimmedCandidate = candidate.trim();
      if (trimmedCandidate === "") return; // Skip empty strings

      if (emailRegex.test(trimmedCandidate)) {
        validEmails.push(trimmedCandidate);
      } else {
        invalidEmails.push(trimmedCandidate);
      }
    });

    return { validEmails, invalidEmails };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate selected members first
    if (selectedMembers.length === 0 && emails.trim() === "") {
      toast.error(
        "Veuillez sélectionner au moins un membre ou saisir des adresses e-mail."
      );
      return;
    }
    if (selectedMembers.length === 0 && emails.trim() !== "") {
      // If only emails are provided, ensure they are valid before proceeding
    } else if (selectedMembers.length === 0) {
      toast.error("Veuillez sélectionner au moins un membre.");
      return;
    }

    let processedValidEmails: string[] = [];
    if (emails.trim() !== "") {
      const emailValidationResult = formatAndValidateEmails(emails);
      if (emailValidationResult.invalidEmails.length > 0) {
        toast.error(
          `Certaines adresses e-mail sont invalides : ${emailValidationResult.invalidEmails.join(
            ", "
          )}. Veuillez les corriger.`
        );
        return;
      }
      processedValidEmails = emailValidationResult.validEmails;

      if (selectedMembers.length === 0 && processedValidEmails.length === 0) {
        toast.error("Veuillez saisir des adresses e-mail valides.");
        return;
      }
    }

    try {
      if (selectedMembers.length > 0) {
        await addToOrganization(orgId, selectedMembers);
      }
      if (processedValidEmails.length > 0) {
        await updateOrganisation(orgId, { invites: processedValidEmails });
      }
      toast.success(
        "Opération réussie. Les membres sélectionnés ont été ajoutés et les invitations envoyées."
      );
      setSelectedMembers([]); // Reset selection
      setEmails(""); // Reset emails
      handleClose?.();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.detail ||
            "Une erreur s'est produite côté serveur."
        );
        return;
      }
      toast.error("Erreur lors de l'opération. Veuillez réessayer.");
      console.error(error);
      return;
    }
  };
  const [emails, setEmails] = useState<string>("");

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 p-3">
      <div className="relative w-full">
        <Label
          htmlFor="membres_cse_invites"
          className="font-medium text-white-800 text-xs mb-2 block"
        >
          Invitez des gens à votre réunion (emails séparés par virgule)
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
        />
      </div>
      {users
        ? users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-2"
            >
              <div className="flex gap-3 items-center">
                <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                  <Image
                    src={"user-icon.svg"}
                    width={16}
                    height={19}
                    alt="user icon"
                  />
                </div>
                <label
                  htmlFor={`user-${user.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {user.email}
                </label>
              </div>
              <Checkbox
                color="black"
                id={`user-${user.id}`}
                checked={selectedMembers.includes(user.id)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked as boolean, user.id)
                }
              />
            </div>
          ))
        : null}
      <Button
        type="submit"
        className="mt-4 px-4 py-2 bg-gradient-to-r from-coral-400 to-crimson-400 text-white rounded"
      >
        Ajouter les membres
      </Button>
    </form>
  );
}
