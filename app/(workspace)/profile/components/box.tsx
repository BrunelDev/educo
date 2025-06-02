"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { User } from "@/app/types/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getCookies } from "@/lib/utils/cookies";
import { Lock, Users } from "lucide-react";
import Image from "next/image";
import { AccessForm } from "./AccessForm";
import { PasswordForm } from "./passwordForm";
import { ProfileForm } from "./profileForm";

const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
export function FirstBox() {
  return (
    <div className="w-full bg-[#FFFFFF99] rounded-[8px] p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0">
      <div className="flex gap-3 sm:gap-4 items-center">
        <Image
          src={userInfo.image ? userInfo.image : "/userProfile-img.png"}
          width={60}
          height={60}
          alt="user Profile image"
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold truncate">
            {userInfo.first_name ? userInfo.first_name : "John"}{" "}
            {userInfo.last_name ? userInfo.last_name : "Doe"}
          </h1>
          <h6 className="text-sm text-gray-600 truncate">{userInfo.email}</h6>
        </div>
      </div>
      <DialogComponent
        dialoTrigger={
          <div className="self-start sm:self-center">
            <Button className="bg-white-100 hover:bg-white-300 text-white-800 cursor-pointer h-8 text-xs sm:text-sm w-full sm:w-auto">
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
    <div className="w-full bg-[#FFFFFF99] rounded-[8px] p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0 text-sm">
      <div className="flex flex-col gap-4">
        <h1 className="text-white-800 text-[16px] sm:text-[18px] font-bold">
          Informations Personnelles
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10">
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <Label className="text-gray-500">Nom</Label>
              <h6 className="font-medium truncate">{userInfo.last_name ? userInfo.last_name : "Doe"}</h6>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-gray-500">Mail</Label>
              <h6 className="font-medium truncate">{userInfo.email ? userInfo.email : "Doe"}</h6>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <Label className="text-gray-500">Prénom</Label>
              <h6 className="font-medium truncate">{userInfo.first_name ? userInfo.first_name : "John"}</h6>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-gray-500">Téléphone</Label>
              <h6 className="font-medium truncate">
                {userInfo.telephone ? userInfo.telephone : "33 012 123 123"}
              </h6>
            </div>
          </div>
        </div>
      </div>
      <DialogComponent
        dialoTrigger={
          <div className="self-start sm:self-center">
            <Button className="bg-white-100 hover:bg-white-300 text-white-800 cursor-pointer h-8 text-xs sm:text-sm w-full sm:w-auto">
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

export function ThirdBox() {
  return (
    <div className="relative w-full bg-[#FFFFFF99] rounded-[8px] p-3 sm:p-4 flex flex-col gap-4 sm:gap-5">
      <h1 className="text-white-800 font-bold text-[16px] sm:text-[18px]">Sécurité</h1>
      <DialogComponent
        dialoTrigger={
          <div className="bg-white flex items-center gap-2 sm:gap-3 p-3 rounded-[8px] cursor-pointer hover:bg-white-100 transition-colors">
            <Lock size={16} className="text-gray-600" />
            <h6 className="text-sm sm:text-base font-medium">Changer de mot de passe</h6>
          </div>
        }
        dialogContent={<PasswordForm />}
        dialogTitle={null}
      />

      <h1 className="text-white-800 font-bold text-[16px] sm:text-[18px] mt-2">Accès</h1>
      <DialogComponent
      className="sm:max-w-[650px]"
        dialoTrigger={
          <div className="bg-white flex items-center gap-2 sm:gap-3 p-3 rounded-[8px] cursor-pointer hover:bg-white-100 transition-colors">
            <Users size={16} className="text-gray-600" />
            <h6 className="text-sm sm:text-base font-medium">Gérer les accès</h6>
          </div>
        }
        dialogContent={<AccessForm />}
        dialogTitle={null}
      />
    </div>
  );
}
