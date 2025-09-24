import { Metadata } from "next";
import TermsWrapper from "./components/terms-wrapper";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: 'Read our terms of service.',
};

export default function TermsPage() {
    const lastUpdated = "September 25, 2025";

    return (
            <main className="container mx-auto max-w-3xl px-8 py-20 sm:py-28">
                <TermsWrapper lastUpdated={lastUpdated} />
            </main>
        );
}