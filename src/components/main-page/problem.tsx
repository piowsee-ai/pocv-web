import { FileX2, FileCheck2, Bot } from "lucide-react";

const ConceptualVisual = () => (  // TODO: ganti gambar
    <div className="relative flex h-64 w-full items-center justify-center p-4">
        <div className="absolute inset-4 rounded-3xl bg-muted/20 shadow-inner" />
        <div className="absolute inset-4 rounded-3xl border border-border z-0" />

        <svg
            className="absolute inset-0 z-10 pointer-events-none"
            viewBox="0 0 400 256"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line
                x1="80"
                y1="60"
                x2="200"
                y2="128"
                stroke="hsl(var(--destructive))"
                strokeWidth="2.5"
                strokeOpacity="0.7"
                strokeDasharray="4 4"
            />
            <line
                x1="80"
                y1="128"
                x2="200"
                y2="128"
                stroke="hsl(var(--destructive))"
                strokeWidth="2.5"
                strokeOpacity="0.7"
                strokeDasharray="4 4"
            />
            <line
                x1="80"
                y1="196"
                x2="200"
                y2="128"
                stroke="hsl(var(--destructive))"
                strokeWidth="2.5"
                strokeOpacity="0.7"
                strokeDasharray="4 4"
            />

            <line
                x1="260"
                y1="128"
                x2="360"
                y2="128"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeOpacity="0.8"
            />
        </svg>

        <div className="relative z-20 grid h-full w-full grid-cols-3 items-center">
            <div className="flex flex-col items-center justify-around h-full py-4">
                {[0, 1, 2].map((_, idx) => (
                    <div
                        key={idx}
                        className="p-2 rounded-lg bg-red-100 border border-red-300 shadow-sm"
                    >
                        <FileX2 className="w-6 h-6 text-red-600" />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center">
                <div className="p-3 rounded-full bg-primary/20 border border-primary/50 shadow-lg">
                    <Bot className="w-10 h-10 text-primary" />
                </div>
            </div>

            <div className="flex items-center justify-center">
                <div className="p-3 rounded-lg border-2 border-primary bg-primary/10 shadow-lg scale-110">
                    <FileCheck2 className="w-8 h-8 text-primary" />
                </div>
            </div>
        </div>
    </div>
);

export function Problem() {
    return (
        <section id="problem" className="py-24 md:py-32">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-9 gap-12 items-center">
                    <div className="lg:col-span-4 flex items-center justify-center">
                        <ConceptualVisual />
                    </div>

                    <div className="lg:col-span-5">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            Taukah Kamu?
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-3">
                            Lebih dari 75% CV Tidak Pernah Sampai ke HRD
                        </h2>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Hampir semua perusahaan sudah menggunakan sistem ATS & AI-screening untuk menyaring ribuan CV. Format yang salah, kata kunci yang tidak tepat, atau desain yang rumit membuat CV Anda langsung ditolak bahkan sebelum sampai ke tangan rekruter.
                        </p>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Anda mungkin kandidat yang sempurna, tapi CV Anda tidak pernah mendapatkan kesempatan.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
