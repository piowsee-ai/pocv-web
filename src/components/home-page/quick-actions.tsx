"use client";

import Link from "next/link";
import { Plus, Upload, Wand2, LayoutTemplate, ArrowUpRight } from "lucide-react";

type QuickAction = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  iconColor: string;
};

const quickActions: QuickAction[] = [
  {
    icon: Plus,
    title: "Buat CV Baru",
    description: "Mulai dari awal dengan template profesional",
    href: "/create",
    iconColor: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Wand2,
    title: "Generate dengan AI",
    description: "Biarkan AI membuat CV berdasarkan data kamu",
    href: "/create?mode=ai",
    iconColor: "bg-violet-100 text-violet-600",
  },
  {
    icon: Upload,
    title: "Import CV",
    description: "Upload CV yang sudah ada untuk di-enhance",
    href: "/import-cv",
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    icon: LayoutTemplate,
    title: "Jelajahi Template",
    description: "Pilih dari koleksi template modern kami",
    href: "/templates",
    iconColor: "bg-orange-100 text-orange-600",
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
            className="group rounded-xl bg-white border border-neutral-200 p-5 transition-colors hover:border-emerald-300"
          >
            <div className={`inline-flex p-2.5 rounded-lg mb-3 ${action.iconColor}`}>
              <action.icon className="h-5 w-5" />
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-neutral-900">
                  {action.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {action.description}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400 shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
