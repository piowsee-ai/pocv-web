import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
    {
        question: "Apa itu pocv?",
        answer:
            "pocv adalah pembuat CV modern dari piowsee.ai yang membantu kamu membuat CV profesional dengan cepat, rapi, dan siap dipakai untuk melamar kerja.",
    },
    {
        question: "Apakah pocv gratis?",
        answer: "Ya! Kamu bisa mencoba membuat CV secara gratis. Fitur premium akan tersedia untuk pembersihan dan pembuatan dengan bantuan AI.",
    },
    {
        question: "Apa itu ATS?",
        answer: "ATS (Applicant Tracking System) adalah sistem yang digunakan perusahaan untuk menyaring CV pelamar secara otomatis. CV yang tidak sesuai format sering kali gagal terbaca oleh ATS.",
    },
    {
        question: "Apakah data saya aman?",
        answer: "Tentu. Data pribadi dan dokumen CV kamu disimpan dengan aman dan hanya bisa diakses oleh kamu.",
    },
    {
        question: "Bisa nggak saya unduh CV dalam format PDF?",
        answer: "Bisa. Semua CV yang dibuat di pocv dapat diunduh dalam format PDF yang siap dikirim ke perusahaan atau recruiter.",
    },
    {
        question: "Ada masalah dalam pembuatan CV saya, gimana?",
        answer: "Kamu bisa menghubungi kami melalui email di support@piowsee.ai, atau klik tulisan 'Bantuan' di bagian bawah halaman ini.",
    },
];

export function Faq() {
    return (
        <section id="faq" className="container mx-auto max-w-6xl py-24 md:py-32">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-7">
                <div className="md:col-span-3">
                    <p className="ml-0.5 font-medium uppercase text-emerald-600">FAQ</p>
                    <h2 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="md:col-span-4">
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem value={`item-${index + 1}`} key={index} className="group border-b">
                                <AccordionTrigger className="py-6 text-left text-lg font-medium hover:no-underline hover:text-emerald-700 transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}