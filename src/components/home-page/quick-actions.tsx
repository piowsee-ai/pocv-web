"use client";

import Link from "next/link";
import {
  Plus,
  Upload,
  Wand2,
  LayoutTemplate,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuickAction = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  gradient: string;
  hoverGradient: string;
  featured?: boolean;
};

const quickActions: QuickAction[] = [
  {
    icon: Plus,
    title: "Buat CV Baru",
    description: "Mulai dari awal dengan template profesional",
    href: "/create-cv",
    gradient: "from-emerald-500 to-teal-600",
    hoverGradient: "group-hover:from-emerald-600 group-hover:to-teal-700",
    featured: true,
  },
  {
    icon: Wand2,
    title: "Generate dengan AI",
    description: "Biarkan AI membuat CV berdasarkan data kamu",
    href: "/create-cv?mode=ai",
    gradient: "from-violet-500 to-purple-600",
    hoverGradient: "group-hover:from-violet-600 group-hover:to-purple-700",
  },
  {
    icon: Upload,
    title: "Import CV",
    description: "Upload CV yang sudah ada untuk di-enhance",
    href: "/import-cv",
    gradient: "from-blue-500 to-cyan-600",
    hoverGradient: "group-hover:from-blue-600 group-hover:to-cyan-700",
  },
  {
    icon: LayoutTemplate,
    title: "Jelajahi Template",
    description: "Pilih dari koleksi template modern kami",
    href: "/templates",
    gradient: "from-orange-500 to-amber-600",
    hoverGradient: "group-hover:from-orange-600 group-hover:to-amber-700",
  },
];

export function QuickActions() {
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Mulai Sekarang</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={cn(
              "group relative overflow-hidden rounded-xl p-5 transition-all duration-300",
              "bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800",
              "hover:shadow-xl hover:-translate-y-1 hover:border-transparent",
              action.featured && "sm:col-span-2 lg:col-span-1",
            )}
          >
            <div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                `bg-gradient-to-br ${action.gradient}`,
              )}
            />

            <div className="relative z-10">
              <div
                className={cn(
                  "inline-flex p-2.5 rounded-lg mb-3 transition-all duration-300",
                  `bg-gradient-to-br ${action.gradient}`,
                  "group-hover:bg-white/20 group-hover:backdrop-blur-sm",
                )}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-white transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300 mt-1">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
