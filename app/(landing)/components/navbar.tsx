import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full h-[72px] rounded-full bg-white-50 py-5 px-3 flex items-center justify-between backdrop-blur-2xl">
      <Image src={"/logo.svg"} width={167} height={48} alt="The logo" />
      <ul className="flex gap-4 font-semibold">
        <li>
          <Link href={"#home"}>Accueil</Link>
        </li>
        <li>
          <Link href={"#about-us"}>Qui sommes-nous ?</Link>
        </li>
        <li>
          <Link href={"#solution"}>Notre solution</Link>
        </li>
        <li>
          <Link href={"#tarif"}>Tarif</Link>
        </li>
        <li>
          <Link href={"#contact"}>Contactez nous</Link>
        </li>
      </ul>
      <Button
        className="text-white font-medium rounded-full h-[48px] bg-linear-to-r from-[#FE6539] to-crimson-400"
        variant="default"
      >
        Ouvrir un compte
      </Button>
    </div>
  );
}
