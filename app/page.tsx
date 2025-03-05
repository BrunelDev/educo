import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <GalleryVerticalEnd className="size-6" />
          <span className="font-bold">Acme Inc.</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">Welcome to Acme Inc.</h1>
        <p className="mt-4 text-muted-foreground">Your workspace solution</p>
      </main>
    </div>
  );
}
