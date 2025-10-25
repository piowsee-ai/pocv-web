import { CheckCircle2, Sparkles, Wand2 } from "lucide-react";

const ConceptUI = () => (
    <div className="relative rounded-xl bg-card p-3 border shadow-md w-full max-w-xl scale-90 sm:scale-95 origin-center">
        <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-grow h-5 rounded-md bg-muted ml-4"></div>
        </div>

        <div className="flex gap-3 h-64">
            <div className="relative w-2/5 space-y-3 p-3 rounded-lg bg-muted/50">
                <div className="space-y-1">
                    <div className="w-1/3 h-2 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-full h-7 rounded-md bg-background border"></div>
                </div>

                <div className="space-y-1">
                    <div className="w-1/2 h-2 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-full h-7 rounded-md bg-background border"></div>
                </div>

                <div className="space-y-1">
                    <div className="w-1/4 h-2 rounded-full bg-muted-foreground/30"></div>
                    <div className="w-full h-20 rounded-md bg-background border"></div>
                </div>

                <div className="w-full h-7 rounded-md bg-primary/80 mt-3"></div>

                <div className="absolute bottom-2 -right-10 sm:-right-12 w-36 rounded-md bg-background border shadow-md p-2 transform transition-transform hover:scale-105">
                    <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <p className="text-[11px] font-semibold text-foreground">AI Smart Rewrite</p>
                    </div>
                    <p className="text-[9px] text-muted-foreground mb-1.5">
                        Let AI rewrite this section to be stronger.
                    </p>
                    <button className="flex items-center justify-center w-full bg-primary text-primary-foreground text-[10px] font-medium rounded px-2 py-0.5 hover:bg-primary/90">
                        <Wand2 className="w-3 h-3 mr-1" />
                        Generate
                    </button>
                </div>
            </div>

            <div className="w-3/5 p-3 rounded-lg bg-muted/50 overflow-hidden">
                <div className="w-full h-full bg-background rounded-md shadow-inner p-3 space-y-2.5">
                    <div className="w-1/2 h-4 rounded-md bg-muted-foreground/70"></div>
                    <div className="w-full h-2 rounded-full bg-muted"></div>
                    <div className="w-3/4 h-2 rounded-full bg-muted"></div>
                    <div className="w-1/4 h-3 rounded-md bg-muted-foreground/50 mt-5"></div>
                    <div className="w-full h-2 rounded-full bg-muted"></div>
                    <div className="w-full h-2 rounded-full bg-muted"></div>
                    <div className="w-5/6 h-2 rounded-full bg-muted"></div>
                </div>
            </div>
        </div>
    </div>
);


const keyBenefits = [
    {
        title: "Tampil Percaya Diri, Bukan Sekadar Formalitas",
        description: "Dengan bantuan AI drafting dan Smart Rewrite, CV Anda bukan lagi sebuah CV template yang membosankan, tetapi mencerminkan profesionalitas yang tinggi.",
    },
    {
        title: "Dapetin Wawancara Pertama Kamu!",
        description: "CV yang lolos AI-checker dan saringan ATS berarti Anda melewati gerbang robot dan memberi diri Anda kesempatan untuk benar-benar dinilai oleh perusahaan.",
    },
    {
        title: "Buka Peluang Karir ke Luar Negeri",
        description: "Fitur terjemahan oleh AI membuka pintu bagi Anda untuk melamar pekerjaan impian di perusahaan multinasional atau internasional dengan mudah.",
    }
];

export function Benefits() {
    return (
        <section id="why-us" className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-1 lg:grid-cols-9 gap-12 items-center">

                    <div className="lg:col-span-4 flex items-center justify-center">
                        <ConceptUI />
                    </div>

                    <div className="lg:col-span-5">
                        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            Mengapa pocv Berbeda?
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-3">
                            Beri CV Anda Keunggulan AI yang Sebenarnya
                        </h2>

                        <div className="mt-10 space-y-8">
                            {keyBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {benefit.title}
                                        </h3>
                                        <p className="mt-1 text-muted-foreground ">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
