"use client";
import { LoginForm } from "@/app/_components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh md:grid-cols-2 bg-gradient-to-r from-[#FE6539] to-crimson-400">
      <div className="relative hidden md:flex px-20 py-8  md:flex-col md:justify-around">
        <div className="justify-self-start">
          <Image
            width={230}
            height={100}
            src="/logo.png"
            alt="impact cse"
            className="self-center"
          />
        </div>

        <p className="text-2xl font-bold text-white-50">
          Retrouvez votre espace dédié au personnel académique : réunions,
          formations, documents et assistance en un seul endroit.
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
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
