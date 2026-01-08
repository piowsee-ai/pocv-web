import {
    ScanLine,
    CircleQuestionMark,
    Wand2,
    Zap,
    Globe,
    Download,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
    icon: React.ElementType;
    title: string;
    description: string;
    featured?: boolean;
};

const features: Feature[] = [
    {
        icon: Zap,
        title: "Buat Draf CV dibantu AI",
        description:
            "Mulai bukan dari nol. AI kami akan membantu kamu dalam membuat draf CV profesional berdasarkan datamu.",
    },
    {
        icon: Wand2,
        title: "AI Smart Rewrite",
        description:
            "Klik pada bagian mana pun di CV-mu dan biarkan AI membantu menulis ulang kalimat menjadi lebih ringkas, kuat, dan relevan.",
        featured: true,
    },
        {
        icon: CircleQuestionMark,
        title: "Curate isi CV",
        description:
            "Masukkan deskripsi pekerjaan dan AI kami akan mengubah CV-mu. Dapatkan CV terbaik untuk setiap pekerjaan.",
        featured: true,
    },
    {
        icon: ScanLine,
        title: "Optimasi Lolos ATS dan AI-screening",
        description:
            "Struktur dan format CV dirancang khusus agar mudah dibaca oleh sistem ATS dan AI-screening yang digunakan oleh perusahaan.",
    },
    {
        icon: Globe,
        title: "Dukungan Multi-Bahasa",
        description:
            "Buat CV dalam Bahasa Indonesia atau Inggris secara instan. Ubah CV dari satu bahasa ke bahasa lain tanpa kehilangan kualitas.",
    },
    {
        icon: Download,
        title: "Satu-klik Download",
        description:
            "Unduh CV-mu dalam format PDF berkualitas tinggi yang rapi, profesional, dan siap dikirim hanya dengan satu klik.",
    },
];

const ShowcaseCard = ({ icon: Icon, title, description, featured }: Feature) => (
    <div
        className={cn(
            "relative overflow-hidden rounded-lg bg-white p-6 backdrop-blur-lg shadow-sm transition-all duration-300",
            "hover:shadow-xl hover:-translate-y-0.5"
        )}
    >
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2 md:mb-3">
                <div className="pb-0">
                    <Icon className="w-6 h-6 text-emerald-800" />
                </div>
                {featured ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        Fitur Unggulan
                    </span>
                ) : (
                    <ArrowUpRight className="w-5 h-5 text-emerald-800" />
                )}
            </div>
            <div className="grow">
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    </div>
);


export function Showcase() {
    return (
        <section
            id="features"
            className="relative mx-auto overflow-hidden py-24 md:py-32 bg-emerald-100/50"
        >

            <div className="absolute inset-0 z-0">
                <div className="mx-auto max-w-7xl h-[88%] bg-line-grid translate-y-12 border-2 border-neutral-400 dark:border-neutral-700 rounded-3xl"></div>
            </div>

            <div className="relative container mx-auto max-w-6xl px-8 md:px-4 z-10">
                <div className="max-w-3xl mx-auto text-center md:mb-14 mb-8 px-4">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        CV Builder Pintar, Cepat, dan Mudah
                    </h2>
                    <p className="mt-4 text-base text-emerald-800">
                        Biarkan AI kami membuat draf CV-mu, optimasi format, dan
                        siap dikirim—semuanya dalam satu platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:gap-8 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <ShowcaseCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            featured={feature.featured}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};