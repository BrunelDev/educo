import { RegisterForm } from "@/app/_components/register-form";
import TempLogo from "@/app/_components/temLogo";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh md:grid-cols-2 bg-coral-500 h-screen overflow-hidden">
      <div className="relative hidden md:flex pl-20 pr-5 pt-8  md:flex-col md:gap-5">
        <div className="flex gap-1">
          <TempLogo color="bg-white-50" />{" "}
          <h6 className="text-white-50">Bonjour CSE</h6>
        </div>
        <p className=" font-extrabold text-3xl text-white-50">
          Votre CSE, plus simple, plus efficace !
        </p>
        <p className="text-white-50">
          Accédez à toutes les fonctionnalités essentielles pour gérer réunions,
          documents, formations et bien plus encore.
        </p>
        <Image
          width={1429.123515884542}
          height={870.1743657071188}
          src="/Macbook.svg"
          alt="ellipse"
        />
      </div>
      <div className="flex items-center w-full bg-white p-6 md:p-24 rounded-tl-[28px] rounded-bl-[28px] h-screen overflow-hidden">
        <div className="w-full">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
