"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/main-page/profile";
import { ArrowUpRight } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import { useSession } from "@/lib/auth/auth-client";

export function Header() {
  const { data: session } = useSession();
  const scrollDirection = useScroll();

  const features: { title: string; href: string; description: string }[] = [
    {
      title: "AI Review",
      href: "/tools-1",
      description:
        "Biarkan AI mengecek CV kamu dan beri saran perbaikan langsung.",
    },
    {
      title: "AI Job Match",
      href: "/tools-2",
      description: "Rekomendasi pekerjaan yang cocok dari AI untuk kamu.",
    },
    {
      title: "AI CV Scoring",
      href: "/tools-3",
      description: "AI akan menilai seberapa bagus CV kamu.",
    },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b bg-white/70 backdrop-blur-sm transition-transform duration-300",
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="relative container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-beta.png"
            alt="Logo"
            width={28}
            height={28}
            priority
          />
          <span className="text-lg font-bold leading-none align-middle relative">
            pocv
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {session ? (
            <ProfileDropdown />
          ) : (
            <>
              <Button
                variant="link"
                className="no-underline font-bold text-emerald-600 hover:text-emerald-700"
                asChild
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href="/signup">
                  Daftar
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
