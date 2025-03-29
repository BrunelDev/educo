"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { User } from "@/app/types/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCookies } from "@/lib/utils/cookies";
import { Lock, Users } from "lucide-react";
import Image from "next/image";
import { PasswordForm } from "./passwordForm";
import { ProfileForm } from "./profileForm";

const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
export function FirstBox() {
  return (
    <div className="w-full bg-[#FFFFFF99] rounded-[8px] p-3 flex justify-between">
      <div className="flex gap-4 items-center">
        <Image
          src={userInfo.image ? userInfo.image : "/userProfile-img.png"}
          width={60}
          height={60}
          alt="user Profile image"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">
            {userInfo.first_name ? userInfo.first_name : "John"}{" "}
            {userInfo.last_name ? userInfo.last_name : "Doe"}
          </h1>
          <h6>{userInfo.email}</h6>
        </div>
      </div>
      <DialogComponent
        dialoTrigger={
          <div>
            <Button className="bg-white-100 hover:bg-white-300 text-white-800 cursor-pointer">
              Modifier
            </Button>
          </div>
        }
        dialogContent={<ProfileForm />}
        dialogTitle={null}
      />
    </div>
  );
}

export function SecondBox() {
  return (
    <div className="w-full bg-[#FFFFFF99] rounded-[8px] p-3 flex justify-between text-sm">
      <div className="flex flex-col gap-4 w-fit">
        <h1 className="text-white-800 text-[18px] font-bold">
          Informations Personnelles
        </h1>
        <div className="flex gap-10">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-1">
              <Label>Nom</Label>
              <h6>{userInfo.last_name ? userInfo.last_name : "Doe"}</h6>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Mail</Label>
              <h6>{userInfo.email ? userInfo.email : "Doe"}</h6>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-1">
              <Label className="self-start">Prénom</Label>
              <h6>{userInfo.first_name ? userInfo.first_name : "John"}</h6>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="self-start">Téléphone</Label>
              <h6>
                {userInfo.telephone ? userInfo.telephone : "33 012 123 123"}
              </h6>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent
        dialoTrigger={
          <Button className="bg-white-100 hover:bg-white-300 text-white-800 cursor-pointer">
            Modifier
          </Button>
        }
        dialogContent={<ProfileForm />}
        dialogTitle={null}
      />
    </div>
  );
}

export function ThirdBox() {
  return (
    <div className="relative w-full bg-[#FFFFFF99] rounded-[8px] p-3 flex flex-col gap-3">
      <h1 className="text-white-800 font-bold text-[18px]">Sécurité</h1>
      <DialogComponent
        dialoTrigger={
          <div className="bg-white flex gap-3 p-2 rounded-[8px] cursor-pointer hover:bg-white-100">
            <Lock size={18} />
            <h6>Changer de mot de passe</h6>
          </div>
        }
        dialogContent={<PasswordForm />}
        dialogTitle={null}
      />

      <div className="bg-white flex gap-3 p-2 rounded-[8px] cursor-pointer hover:bg-white-100">
        <Users size={18} /> <h6>Gérer les accès</h6>
      </div>
    </div>
  );
}
