"use client";

import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import type { SessionData } from "@/types/session";

interface ProfileDropdownProps {
    session: SessionData["session"] | null;
}

export function ProfileDropdown({ session }: ProfileDropdownProps) {
    if (!session) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100"
                >
                    <Avatar className="h-6 w-6 border-2 cursor-pointer">
                        <Image
                            src={`/api/avatar?url=${encodeURIComponent(session.user.image ?? "")}`}
                            alt={session.user.name || "avatar"}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </Avatar>
                    <span>{session.user.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel className="flex flex-col gap-1">
                    <span className="font-medium">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                        {session.user.email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
