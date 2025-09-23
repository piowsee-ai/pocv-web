"use client";

import { signOut } from "@/lib/auth-client";
// import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
    };

    return (
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            Logout
        </DropdownMenuItem>
    );
}
