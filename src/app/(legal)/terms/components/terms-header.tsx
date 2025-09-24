"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function TermsHeader({
    lang,
    setLang,
}: {
    lang: "en" | "id";
    setLang: (val: "en" | "id") => void;
}) {
    return (
        <div className="flex items-center justify-between w-full mb-8">
            <Link
                href="/"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
            </Link>

            <div className="relative flex rounded-lg border bg-muted p-1">
                {["id", "en"].map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setLang(opt as "en" | "id")}
                        className={`relative z-10 w-10 px-2 py-0.5 text-sm font-medium capitalize transition-colors ${lang === opt
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {opt.toUpperCase()}
                    </button>
                ))}

                <motion.div
                    layout
                    className="absolute top-1 bottom-1 w-10 rounded-md bg-background shadow-sm"
                    animate={{
                        x: lang === "id" ? 0 : 40,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            </div>
        </div>
    );
}
