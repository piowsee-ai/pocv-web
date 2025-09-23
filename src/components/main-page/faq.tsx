import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
    {
        question: "What do we provide?",
        answer:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        question: "Can I get a refund?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        question: "Do you accept PayPal?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
];

export function Faq() {
    return (
        <section id="faq" className="container mx-auto max-w-6xl py-24 md:py-32">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-7">
                <div className="md:col-span-3">
                    <p className="ml-0.5 font-medium uppercase text-muted-foreground">FAQ</p>
                    <h2 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="md:col-span-4">
                    <Accordion type="single" collapsible className="w-full">
                        {faqData.map((faq, index) => (
                            <AccordionItem value={`item-${index + 1}`} key={index} className="group border-b">
                                <AccordionTrigger className="py-6 text-left text-lg font-medium hover:no-underline">
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