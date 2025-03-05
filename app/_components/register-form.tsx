import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <div className="gap-2 w-full">
        <h1 className="text-2xl font-bold">Créez votre compte</h1>
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
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
          </div>
          <Input id="password" type="password" required />
          
        </div><div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Confirmez le mot de passe</Label>
          </div>
          <Input id="password" type="password" required />
          
        </div>
        <Button
          type="submit"
          className="w-full h-11 bg-coral-500 hover:bg-coral-700"
        >
          S’inscrire
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-white-800">
          Ou s’inscrire avec
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
