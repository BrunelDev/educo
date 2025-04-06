"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/functions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email) {
      toast.error("L'adresse e-mail est requise");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("L'adresse e-mail n'est pas valide");
      return false;
    }

    if (!password) {
      toast.error("Le mot de passe est requis");
      return false;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }

    return true;
  };

  return (
    <form
      className="flex flex-col gap-6 w-full"
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
          const response = await login(email, password);
          if (response) {
            toast.success("Connexion réussie");
            router.refresh();
            router.push("/dashboard");
            return;
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error("Mot de passe ou email incorrect");
            console.log(err.message);
          } else {
            toast.error("Une erreur est survenue lors de la connexion");
          }
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div className="gap-2 w-full">
        <h1 className="text-2xl font-bold">Connectez vous</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a
            href="#"
            className="ml-auto text-sm text-coral-500 font-medium underline-offset-4 hover:underline"
          >
            Mot de passe oublié ?
          </a>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-coral-500 hover:bg-coral-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Connexion en cours...
            </div>
          ) : (
            "Se connecter"
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-white-800">
            Ou se connecter avec
          </span>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Link href={"#"}>
            <Image
              src={"/icon_google.svg"}
              width={28}
              height={28}
              alt="google icon"
            />
          </Link>
          <Link href={"#"}>
            <Image
              src={"/icon_apple.svg"}
              width={22}
              height={22}
              alt="apple icon"
            />
          </Link>
        </div>
      </div>
      <div className="text-center text-sm">
        Vous n’avez pas de compte ?{" "}
        <Link
          href="/register"
          className="text-coral-500 font-medium underline-offset-4 hover:underline"
        >
          S’inscrire
        </Link>
      </div>
    </form>
  );
}
