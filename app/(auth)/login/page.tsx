"use client"
import { LoginForm } from "@/app/_components/login-form";
import TempLogo from "@/app/_components/temLogo";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh md:grid-cols-2 bg-coral-500">
      <div className="relative hidden md:flex px-20 py-8  md:flex-col md:justify-around">
        <div className="flex gap-1">
          <TempLogo color="bg-white-50" /> <h6 className="text-white-50">Bonjour CSE</h6>
        </div>
        <p className=" font-extrabold text-3xl text-white-50">
          Retrouvez votre espace dédié aux élus : réunions, formations,
          documents et assistance en un seul endroit.
        </p>
        <Image width={366} height={366} src="./ellipse 16.svg" alt="ellipse" className="self-center" unoptimized/>
      </div>
      <div className="flex items-center w-full bg-white p-6 md:p-24 rounded-tl-[28px] rounded-bl-[28px]">
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
