import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/functions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            toast.error("Veuillez entrer une adresse email valide");
            return;
          }

          // Password validation
          if (password.length < 8) {
            toast.error("Le mot de passe doit contenir au moins 8 caractères");
            return;
          }

          // Password strength validation
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_!%*?&])[A-Za-z\d@$!%*?&]/;
          if (!passwordRegex.test(password)) {
            toast.error(
              "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
            );
            return;
          }

          // Confirm password validation
          if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
          }

          // Attempt registration
          const response = await register(email, password);

          if (response?.message) {
            toast.success(
              "Inscription réussie ! Un e-mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception pour activer votre compte."
            );
            router.push("/login");
            return;
          }
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else {
            toast.error("Une erreur est survenue lors de l'inscription");
          }
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div className="gap-2 w-full">
        <h1 className="text-2xl font-bold">Créez votre compte</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="w-full"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            id="password"
            type="password"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
          </div>
          <Input
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            id="confirmPassword"
            type="password"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-coral-500 hover:bg-coral-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Inscription en cours...
            </div>
          ) : (
            "S'inscrire"
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-white-800">
            Ou s’inscrire avec
          </span>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Link href={"#"}>
            <Image
              unoptimized
              src={"/icon_google.svg"}
              width={28}
              height={28}
              alt="google icon"
            />
          </Link>
          <Link href={"#"}>
            <Image
              unoptimized
              src={"/icon_apple.svg"}
              width={22}
              height={22}
              alt="apple icon"
            />
          </Link>
        </div>
      </div>
      <div className="text-center text-sm">
        Vous avez un compte ?{" "}
        <Link
          href="/login"
          className="text-coral-500 font-medium underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </div>
    </form>
  );
}
