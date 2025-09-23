import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="container mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center md:py-24">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl">
                Lorem ipsum dolor.
                <br />
                sit amet, consectetur adipiscing
                <br />
                elit, sed do eiusmod
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground mb-8">
                tempor incididunt ut labore et dolore magna aliqua. <span className="font-semibold text-foreground">Ut enim ad minim veniam, </span>
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Button size="lg" className="group" asChild>
                    <Link href="/signup">
                        Get Started - it&apos;s free
                        <ChevronRight className="transform rotate-45 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col mt-1 items-center sm:flex-row">
                <Button size="lg" variant="link" className="text-neutral-500" asChild>
                    <Link href="/learn-more">
                        Learn more
                    </Link>
                </Button>
            </div>


        </section>
    );
}