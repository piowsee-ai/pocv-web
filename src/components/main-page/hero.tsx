import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="container mx-auto max-w-7xl px-6 md:py-8">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mt-20">
                <div className="flex-1 text-left">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl md:text-[53px]">
                        Cepat, mudah, dan gak ribet! <br></br>
                        Buat CV Profesional dalam Hitungan Menit
                    </h1>
                    <p className="mt-2 text-[15px] md:text-[20px] text-muted-foreground mb-8">
                        Dengan <span className="font-semibold text-foreground">pocv</span>, kamu bisa bikin CV keren, profesional, dan lolos screening.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Button size="lg" className="group bg-emerald-600 hover:bg-emerald-700 text-white md:text-[16px] text-sm" asChild>
                            <Link href="/signup">
                                Coba sekarang — Gratis
                                <ChevronRight className="transform rotate-45 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 w-3 h-3 sm:w-4 sm:h-4" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="link"
                            className="text-emerald-600"
                            asChild>
                            <Link href="/learn-more">Pelajari lebih lanjut</Link>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <Image
                        src="/images/hero-img.png"
                        alt="Hero"
                        width={2000}
                        height={1000}
                        className="w-full h-auto rounded-lg"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}