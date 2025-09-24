import { Metadata } from "next";
import PrivacyWrapper from "./components/privacy-wrapper";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Read our privacy policy.",
};

export default function PrivacyPage() {
    const lastUpdated = "September 25, 2025";

    return (
        <main className="container mx-auto max-w-3xl px-8 py-20 sm:py-28">
            <PrivacyWrapper lastUpdated={lastUpdated} />
        </main>
    );
}
