import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="container mx-auto flex max-w-7xl flex-col items-center px-6 text-center md:py-8">
            <h1 className="mt-12 md:mt-8 text-4xl font-semibold tracking-tight sm:text-3xl md:text-[53px]">
                CV Profesional, Gak Pake Ribet! <br></br>
                Bikin CV Menarik dan Siap Dilirik HRD
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] md:text-[20px] text-muted-foreground mb-6">
                Dengan <span className="font-semibold text-foreground">pocv</span>, kamu bisa bikin
                CV keren, profesional, dan siap tembus seleksi HRD.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Button size="lg" className="group bg-emerald-600 hover:bg-emerald-700 text-white md:text-[16px] text-sm" asChild>
                    <Link href="/signup">
                        Coba sekarang — Gratis
                        <ChevronRight className="transform rotate-45 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                </Button>
            </div>
            <div className="md:mb-8 mb-4 flex flex-col items-center sm:flex-row">
                <Button size="lg" variant="link" className="text-emerald-600" asChild>
                    <Link href="/learn-more">
                        Pelajari lebih lanjut
                    </Link>
                </Button>
            </div>

            <div className="md:w-[900px] sm:w-[600px]  w-[450px] flex justify-center md:mb-0 mb-4">
                <Image 
                    src="/images/hero-img.png" 
                    alt="Hero" 
                    width ={2000}
                    height={1000}
                    className="w-full h-auto rounded-lg"
                    priority
                />
            </div>

        </section>
    );
}