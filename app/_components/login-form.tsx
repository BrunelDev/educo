import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/functions";
import { getCookies, setCookie } from "@/lib/utils/cookies";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      className="flex flex-col gap-6 w-full"
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          if (password.length < 8) {
            setMessage("Le mot de passe doit contenir au moins 8 caractères");
            return;
          }
          const response = await login(email, password);
          if (response) {
            setMessage("Connexion réussie");
            
            console.log(getCookies("access_token"))
            //router.push("/dashboard");
            return;
          }
          return;
        } catch (err: unknown) {
          // Handle specific message cases
          if (err instanceof Error) {
            setMessage(err.message);
            console.log(err.message + "--");
          } else {
            setMessage("Une erreur est survenue lors de l'inscription");
          }
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
          className="w-full h-11 bg-coral-500 hover:bg-coral-700"
        >
          Se connecter
        </Button>
        {message && (
          <div className="p-2 bg-red-500 rounded-lg">
            <p className="text-white text-sm">{message}</p>
          </div>
        )}
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
