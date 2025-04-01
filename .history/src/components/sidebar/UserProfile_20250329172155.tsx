import { UserSchema, ValidatedUser } from "@/store/userStore";
import { logger } from "@/utils/logger";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface UserProfileProps {
  user: ValidatedUser | null;
}

export function UserProfile({ user }: UserProfileProps) {
  const validatedUser = useMemo(() => {
    if (!user) return null;

    try {
      return UserSchema.parse(user);
    } catch (error) {
      logger.error("Erreur de validation des données utilisateur", { error });
      return null;
    }
  }, [user]);

  if (!validatedUser) {
    return (
      <Link
        href="/login"
        className="flex justify-between items-center px-2 py-1 hover:pl-4 hover:bg-white-100 duration-200 rounded-[8px]"
      >
        <div className="flex items-center gap-5">
          <Image
            width={32}
            height={32}
            src="/userProfile-img.png"
            alt="default profile image"
          />
          <h1 className="text-white-800 font-semibold">Se connecter</h1>
        </div>
        <ChevronRight />
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="flex justify-between items-center px-2 py-1 hover:pl-4 hover:bg-white-100 duration-200 rounded-[8px]"
    >
      <div className="flex items-center gap-5">
        <Image
          width={32}
          height={32}
          src={validatedUser.image || "/userProfile-img.png"}
          alt="user profile image"
        />
        <h1 className="text-white-800 font-semibold">
          {validatedUser.first_name} {validatedUser.last_name}
        </h1>
      </div>
      <ChevronRight />
    </Link>
  );
}
