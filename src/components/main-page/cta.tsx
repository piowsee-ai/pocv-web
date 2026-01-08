import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ChevronRight } from "lucide-react";

export function Cta() {
    return (
        <section className="py-16 md:py-16 md: mb-28">
            <div className="container mx-auto max-w-4xl px-4 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                    Siap buat CV profesional pertama kamu?
                </h2>

                <p className="mt-4 text-lg text-muted-foreground">
                    Bergabung dengan ratusan pencari kerja yang sudah membuat CV
                    impian mereka
                </p>

                <div className="mt-8">
                    <Button
                        size="lg"
                        className="group bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6"
                        asChild>
                        <Link href="/signup">
                            Mulai Sekarang — Gratis
                            <ChevronRight className="ml-2 transform rotate-45 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
