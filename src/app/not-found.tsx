import RandomNotFound from "@/components/not-found-random";

export default function NotFound() {
    const notFoundMessages = [
        "lost in the digital void",
        "page took the wrong door",
        "oops, wrong dimension",
        "the bits got scattered",
        "monsters, they come out at night",
        "nothing's here 👀",
        "you dug straight down... mistake",
        "the binary de-octal'd your hexagonal decimal",
        "map ends here, traveler",
        "the goblins stole your page",
        "stayin' alive-ive-ive (not this page tho)",
        "wake up, neo... the page is missing",
    ];

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden font-geist">
            <div className="absolute inset-0 -z-10 h-full w-full">
                <div className="absolute inset-0 bg-violet-100 bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.100))] dark:bg-neutral-900 dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,theme(colors.neutral.900))]"></div>

                <div
                    className="absolute inset-0 bg-[radial-gradient(theme(colors.neutral.300)_1px,transparent_1px)] dark:bg-[radial-gradient(theme(colors.neutral.700)_1px,transparent_1px)] bg-size-[20px_20px]"
                ></div>
            </div>

            <div className="relative z-10 flex items-center space-x-4">
                <span className="text-3xl font-bold tracking-tighter text-neutral-800 dark:text-white">
                    404
                </span>
                <div className="h-8 w-px rotate-12 bg-neutral-400 dark:bg-neutral-500"></div>
                
                <RandomNotFound messages={notFoundMessages} />
            </div>
        </main>
    );
}