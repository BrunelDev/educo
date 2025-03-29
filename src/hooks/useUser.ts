import { User } from "@/app/types/auth";
import { getCookies } from "@/lib/utils/cookies";
import { useMemo } from "react";

export function useUser() {
  const userInfo = useMemo(() => {
    try {
      return JSON.parse(getCookies("userInfo") || "{}") as User;
    } catch (error) {
      console.error("Error parsing user info:", error);
      return {} as User;
    }
  }, []);

  const isAuthenticated = useMemo(() => {
    return Boolean(userInfo?.id);
  }, [userInfo]);

  return {
    user: userInfo,
    isAuthenticated,
  };
}
