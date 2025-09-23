import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: 'Read our privacy policy.',
};

export default function PrivacyPage() {
    const lastUpdated = "August 27, 2025";

    return (
        <main className="container mx-auto max-w-3xl px-8 py-20 sm:py-28">
            <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground hover:bg-transparent">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to home
                </Link>
            </Button>

            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Privacy Policy
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <div className="prose prose-neutral prose-p:leading-relaxed dark:prose-invert">
                <h2>1. Information We Collect</h2>
                <p>
                    We collect information you provide directly to us, such as when you create an account or contact us for support. This may include your name, email address, and any other information you choose to provide. We also collect anonymous data through analytics to help us understand how our service is used.
                </p>

                <h2>2. How We Use Your Information</h2>
                <p>
                    We use the information we collect to provide, maintain, and improve our services. This includes using the information to:
                </p>
                <ul>
                    <li>Create and manage your account.</li>
                    <li>Communicate with you about features, products, services, updates, and support.</li>
                    <li>Monitor and analyze trends, usage, and activities.</li>
                </ul>

                <h2>3. Cookies</h2>
                <p>
                    We use cookies and similar technologies to help improve your experience. You can disable cookies in your browser settings, but some features may not work properly.
                </p>

                <h2>4. Data Sharing</h2>
                <p>
                    We do not sell, trade, or rent personal information to anyone. We may share limited information with service providers who perform services on our behalf (e.g., payment processing, data analytics) and for legal compliance if required by law, or to protect our rights, property, or the security of our users.
                </p>

                <h2>5. Your Rights</h2>
                <p>
                    You have the right to access, update, or request the deletion of your personal data. For assistance, contact us at <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                </p>

                <h2>6. Updates to the Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Updates will be posted on this page, and major changes may be notified via email.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                </p>
            </div>
        </main>
    );
}