import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: 'Read our terms of service.',
};

export default function TermsPage() {
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
                    Terms of Service
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <div className="prose prose-neutral prose-p:leading-relaxed dark:prose-invert">
                <h2>1. Introduction</h2>
                <p>
                    Welcome to LandingAI by piowsee! These Terms of Service ("Terms") govern your use of our website and the services we provide. By accessing or using our service, you agree to be bound by these Terms.
                </p>

                <h2>2. Your Account</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
                </p>

                <h2>3. User Conduct</h2>
                <p>
                    You agree not to use the service for any purpose that is illegal or prohibited by these Terms. You agree not to misuse our services, including but not limited to, attempting to gain unauthorized access to the service or its related systems.
                </p>

                <h2>4. Termination</h2>
                <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2>5. Limitation of Liability</h2>
                <p>
                    In no event shall LandingAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>

                <h2>6. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Any major changes will be notified via email.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about these Terms, please contact us at <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                </p>
            </div>
        </main>
    );
}