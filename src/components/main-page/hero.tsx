import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="container mx-auto flex max-w-7xl flex-col items-center px-4 py-12 text-center md:py-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-[40px]">
                Cepat, mudah, dan gak ribet! <br></br>
                Buat CV Profesional dalam Hitungan Menit
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground mb-6">
                Dengan <span className="font-semibold text-foreground">pocv</span>, kalian bisa buat
                CV modern, rapi, dan siap dilirik recruiter.
            </p>

            <div className="w-[820px] max-w-4xl mx-auto flex justify-center">
                <Image 
                    src="/images/hero img.png" 
                    alt="Hero" 
                    width ={4000}
                    height={3000}
                    className="w-full h-auto rounded-lg"
                    priority
                />
            </div>

            <br></br>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Button size="lg" className="group bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                    <Link href="/signup">
                        Coba sekarang — Gratis
                        <ChevronRight className="transform rotate-45 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col mt-1 items-center sm:flex-row">
                <Button size="lg" variant="link" className="text-emerald-600" asChild>
                    <Link href="/learn-more">
                        Pelajari lebih lanjut
                    </Link>
                </Button>
            </div>

        </section>
    );
}