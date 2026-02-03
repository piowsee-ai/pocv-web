"use client";

import Link from "next/link";
import { ScanLine, Target, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AITool = {
    icon: React.ElementType;
    title: string;
    description: string;
    href: string;
    gradient: string;
    borderColor: string;
    status: "available" | "coming_soon";
};

const aiTools: AITool[] = [
    {
        icon: ScanLine,
        title: "AI Review",
        description: "Biarkan AI mengecek CV kamu dan beri saran perbaikan langsung untuk meningkatkan kualitas.",
        href: "/tools/ai-review",
        gradient: "from-emerald-500/10 to-teal-500/10",
        borderColor: "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400",
        status: "coming_soon",
    },
    {
        icon: Target,
        title: "AI Job Match",
        description: "Rekomendasi pekerjaan yang cocok dari AI berdasarkan skill dan pengalaman di CV kamu.",
        href: "/tools/job-match",
        gradient: "from-blue-500/10 to-cyan-500/10",
        borderColor: "border-blue-200 dark:border-blue-800 hover:border-blue-400",
        status: "coming_soon",
    },
    {
        icon: BarChart3,
        title: "AI CV Scoring",
        description: "AI akan menilai seberapa bagus CV kamu dan memberikan skor yang detail untuk setiap bagian.",
        href: "/tools/cv-scoring",
        gradient: "from-violet-500/10 to-purple-500/10",
        borderColor: "border-violet-200 dark:border-violet-800 hover:border-violet-400",
        status: "coming_soon",
    },
];

export function AITools() {
    return (
        <section className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">AI Tools</h2>
                </div>
                <Link 
                    href="/tools" 
                    className="text-sm text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-1"
                >
                    Lihat semua
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiTools.map((tool, index) => (
                    <div
                        key={index}
                        className={cn(
                            "group relative overflow-hidden rounded-xl p-5 transition-all duration-300",
                            "bg-gradient-to-br",
                            tool.gradient,
                            "border",
                            tool.borderColor,
                            tool.status === "available" && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                        )}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 shadow-sm border border-gray-100 dark:border-neutral-800">
                                <tool.icon className="h-5 w-5 text-foreground" />
                            </div>
                            {tool.status === "coming_soon" && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                        
                        <h3 className="font-semibold text-foreground mb-2">
                            {tool.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {tool.description}
                        </p>

                        {tool.status === "available" && (
                            <Link 
                                href={tool.href}
                                className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Coba sekarang
                                <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
