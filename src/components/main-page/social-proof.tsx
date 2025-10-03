import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";

export function SocialProof() {
    return (
        <section className="container mx-auto max-w-7xl flex flex-col items-center px-4">
            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
                <div className="flex -space-x-4">
                    <Image src="/images/user1.png" alt="1" width={40} height={40} className="rounded-full border-2 border-background" />
                    <Image src="/images/user2.png" alt="2" width={40} height={40} className="rounded-full border-2 border-background" />
                    <Image src="/images/user3.png" alt="3" width={40} height={40} className="rounded-full border-2 border-background" />

                    <Link
                        href="/signup"
                        className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-foreground text-background transition-all duration-500 ease-in-out hover:w-32"
                    >
                        <span className="transition-opacity duration-250 group-hover:opacity-0">
                            <Plus className="h-4 w-4" />
                        </span>

                        <span className="absolute whitespace-nowrap text-xs font-semibold opacity-0 transition-opacity duration-250 group-hover:opacity-100 group-hover:delay-200">
                            ini bisa kamu!
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-0.5 sm:ml-4">
                    <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                    <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
                </div>

                <p className="text-sm text-muted-foreground sm:ml-2">
                    <span className="font-semibold text-foreground">100+ orang</span> telah membuat CV
                </p>
            </div> */}

            <div className="justify-center flex items-center gap-2 mt-8 mb-10">
                <p className="text-sm text-neutral-600">
                    Built with love by <span className="font-semibold text-foreground">piowsee.ai</span>
                </p>
                <Image src="/images/logo-piowsee.png" alt="Piowsee Logo" width={20} height={20} className="h-5 w-5" />
            </div>
        </section>
    );
}