"use client"
import { useSession } from "./auth-client";

export async function requireUser() {
    const session = useSession();
    if (!session.data) {
        throw new Error("User is not logged in");
    }
    return session;
}