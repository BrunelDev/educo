"use client";
import { ForgotPasswordForm } from "@/app/_components/forgot-password-form";
import TempLogo from "@/app/_components/temLogo";
import Image from "next/image";

export default function MotDePasseOubliePage() {
  return (
    <div className="grid min-h-svh md:grid-cols-2 bg-coral-500">
      <div className="relative hidden md:flex px-20 py-8 md:flex-col md:justify-around">
        <div className="flex gap-1 items-center">
          <TempLogo color="bg-white-50" />
          <h6 className="text-white-50 text-lg font-semibold">Impact CSE</h6>
        </div>
        <p className="font-extrabold text-3xl text-white-50">
          Réinitialisez votre mot de passe pour retrouver l&apos;accès à votre espace.
        </p>
        <Image
          width={366}
          height={366}
          src="/logo.svg"
          alt="impact cse"
          className="self-center"
        />
      </div>
      <div className="flex items-center w-full bg-white p-6 md:p-24 rounded-tl-[28px] rounded-bl-[28px]">
        <div className="w-full max-w-md mx-auto">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
