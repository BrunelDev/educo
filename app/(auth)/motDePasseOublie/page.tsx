"use client";
import { ForgotPasswordForm } from "@/app/_components/forgot-password-form";
import Image from "next/image";

export default function MotDePasseOubliePage() {
  return (
    <div className="grid min-h-svh md:grid-cols-2 bg-gradient-to-r from-[#FE6539] to-crimson-400">
      <div className="relative hidden md:flex px-20 py-8 md:flex-col md:justify-around">
        <div className="flex gap-1 items-center">
          <Image
            width={160}
            height={100}
            src="/logo.png"
            alt="educo"
            className="self-center"
          />
        </div>
        <p className="font-bold text-2xl text-white-50">
          Réinitialisez votre mot de passe pour retrouver l&apos;accès à votre
          espace.
        </p>
        <Image
          width={230}
          height={230}
          src="/ellipse16.svg"
          alt="elllipse"
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
