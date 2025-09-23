"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/main-page/profile";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ArrowUpRight } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import type { SessionData } from "@/types/session";

export function Header({ session }: SessionData) {
    const scrollDirection = useScroll();

    const features: { title: string; href: string; description: string }[] = [
        {
            title: "Tool 1",
            href: "/tools-1",
            description: "Tool 1 description.",
        },
        {
            title: "Tool 2",
            href: "/tools-2",
            description: "Tool 2 description.",
        },
        {
            title: "Tool 3",
            href: "/tools-3",
            description: "Tool 3 description.",
        },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full border-b bg-violet-50/70 backdrop-blur-sm transition-transform duration-300",
                scrollDirection === "down"
                    ? "-translate-y-full"
                    : "translate-y-0"
            )}
        >
            <div className="relative container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo-192.png"
                        alt="Logo"
                        width={24}
                        height={24}
                    />
                    <span className="text-lg font-bold">LandingAI</span>
                </Link>

                <NavigationMenu className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
                    <NavigationMenuList className="gap-12">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger
                                className="group inline-flex h-auto items-center justify-center bg-transparent p-0
                                font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground
                                focus:text-muted-foreground focus:bg-transparent focus:outline-none data-[state=open]:!text-foreground
                                data-[state=open]:!bg-transparent"
                            >
                                Features
                            </NavigationMenuTrigger>

                            <NavigationMenuContent className="bg-violet-50">
                                <ul className="grid w-[300px]">
                                    <li>
                                        <NavigationMenuLink
                                            asChild
                                            className="hover:bg-transparent"
                                        >
                                            <Link href={features[0].href}>
                                                <div className="font-medium">
                                                    {features[0].title}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {features[0].description}
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            asChild
                                            className="hover:bg-transparent"
                                        >
                                            <Link href={features[1].href}>
                                                <div className="font-medium">
                                                    {features[1].title}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {features[1].description}
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink
                                            asChild
                                            className="hover:bg-transparent"
                                        >
                                            <Link href={features[2].href}>
                                                <div className="font-medium">
                                                    {features[2].title}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {features[2].description}
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className="inline-flex h-auto items-center justify-center bg-transparent p-0
                                font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground
                                focus:text-muted-foreground focus:bg-transparent focus:outline-none"
                            >
                                <Link
                                    href="/#pricing"
                                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground active:bg-transparent"
                                >
                                    Pricing
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className="inline-flex h-auto items-center justify-center bg-transparent p-0
                                font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground
                                focus:text-muted-foreground focus:bg-transparent focus:outline-none"
                            >
                                <Link
                                    href="/#faq"
                                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground active:bg-transparent"
                                >
                                    FAQ
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-2">
                    {session ? (
                        <ProfileDropdown session={session} />
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">
                                    Sign up
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
