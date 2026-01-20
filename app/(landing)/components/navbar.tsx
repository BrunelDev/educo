import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full rounded-full bg-white/10 backdrop-blur-md border border-white/20 py-3 px-4 sm:px-6 flex items-center justify-between shadow-lg">
      <Image
        src="/logo.png"
        width={167}
        height={48}
        alt="The logo"
        className="h-8 sm:h-10 w-auto"
      />
      <ul className="hidden md:flex gap-6 font-medium text-white">
        <li>
          <Link href="#home" className="hover:text-coral-500 transition-colors">
            Accueil
          </Link>
        </li>
        <li>
          <Link
            href="#about-us"
            className="hover:text-coral-500 transition-colors"
          >
            Qui sommes-nous ?
          </Link>
        </li>
        <li>
          <Link
            href="#solution"
            className="hover:text-coral-500 transition-colors"
          >
            Notre solution
          </Link>
        </li>
        <li>
          <Link
            href="#tarif"
            className="hover:text-coral-500 transition-colors"
          >
            Tarif
          </Link>
        </li>
        <li>
          <Link
            href="#contact"
            className="hover:text-coral-500 transition-colors"
          >
            Contactez nous
          </Link>
        </li>
      </ul>
      <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 hover:from-[#E55A32] hover:to-crimson-500 text-white font-medium rounded-full h-10 sm:h-12 px-4 sm:px-6 transition-all shadow-md">
        Ouvrir un compte
      </Button>
    </nav>
  );
}
