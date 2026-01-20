"use client";
import { RegisterForm } from "@/app/_components/register-form";
import Image from "next/image";
import { use } from "react";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  return (
    <div className="grid min-h-svh md:grid-cols-2 bg-gradient-to-r from-[#FE6539] to-crimson-400 h-screen overflow-hidden">
      <div className="relative hidden md:flex pl-20 pr-5 pt-8  md:flex-col md:gap-5">
        <div className="justify-self-start">
          <Image
            width={230}
            height={100}
            src="/logo.png"
            alt="impact cse"
            className="self-center"
          />
        </div>
        <p className=" font-extrabold text-3xl text-white-50">
          Educo, la gestion académique simplifiée !
        </p>
        <p className="text-white-50">
          Accédez à toutes les fonctionnalités essentielles pour gérer réunions
          pédagogiques, documents, formations et bien plus encore.
        </p>
        <Image
          width={1429.123515884542}
          height={870.1743657071188}
          src="/macBook.svg"
          alt="impact cse"
        />
      </div>
      <div className="flex items-center w-full bg-white p-6 md:p-24 rounded-tl-[28px] rounded-bl-[28px] h-screen overflow-hidden">
        <div className="w-full">
          <RegisterForm token={token} />
        </div>
      </div>
    </div>
  );
}
