"use client";

import { useSession } from "./auth-client";
import { useRouter } from "next/navigation";

// NOTE: This can be used for client-side components that need to ensure the user is logged in.
export function useRequireUser() {
  const session = useSession();
  const router = useRouter();

  if (!session.data) {
    router.replace("/login");
    return { session: null, loading: false };
  }
  
  return session;
}
