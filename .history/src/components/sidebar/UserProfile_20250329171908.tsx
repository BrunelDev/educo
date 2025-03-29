import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/app/types/auth";

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Link
      href="/profile"
      className="flex justify-between items-center px-2 py-1 hover:pl-4 hover:bg-white-100 duration-200 rounded-[8px]"
    >
      <div className="flex items-center gap-5">
        <Image
          width={32}
          height={32}
          src={user.image || "/userProfile-img.png"}
          alt="user profile image"
        />
        <h1 className="text-white-800 font-semibold">
          {user.first_name || "John"} {user.last_name || "Doe"}
        </h1>
      </div>
      <ChevronRight />
    </Link>
  );
} 