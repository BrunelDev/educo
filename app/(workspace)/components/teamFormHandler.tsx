import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addToOrganization } from "@/lib/api/organisation";
import { getAllusers, User } from "@/lib/api/users";
import { getCookies } from "@/lib/utils/cookies";
import { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TeamFormHandler({ orgId }: { orgId: number }) {
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
        const response = await getAllusers();
        console.log("res", response);
        setUsers(response.results);
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
      window.location.reload();
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
