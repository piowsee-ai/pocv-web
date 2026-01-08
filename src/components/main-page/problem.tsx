import Image from "next/image";

const ConceptualVisual = () => (
    <div className="h-50 md:h-100 lg:h-96 w-140 items-center justify-center">
        <Image
            src="/images/hero-flow.png"
            alt="Flow"
            width={1500}
            height={800}
            className="w-full h-full object-contain"
        />
    </div>
);

export function Problem() {
    return (
        <section id="problem" className="py-10 md:py-20">
            <div className="container mx-auto max-w-300 md:px-0 px-12">
                <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-4 items-center md:mr-20">
                    <div className="lg:col-span-5 flex items-center justify-center">
                        <ConceptualVisual />
                    </div>

                    <div className="lg:col-span-5">
                        <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                            Taukah Kamu?
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-2">
                            Lebih dari 75% CV Tidak Pernah Sampai ke HRD
                        </h2>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Hampir semua perusahaan sudah menggunakan sistem ATS
                            & AI-screening untuk menyaring ribuan CV. Format
                            yang salah, kata kunci yang tidak tepat, atau desain
                            yang rumit membuat CV Anda langsung ditolak bahkan
                            sebelum sampai ke tangan rekruter.
                        </p>
                        <p className="mt-3 text-lg text-muted-foreground">
                            Anda mungkin kandidat yang sempurna, tapi CV Anda
                            tidak pernah mendapatkan kesempatan.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
