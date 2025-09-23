"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Subscription failed");
            }

            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="newsletter" className="container mx-auto flex max-w-7xl flex-col md:py-16">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Get updates straight to your inbox
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Be the first to know when we launch new features, resources, and
                    product updates.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="relative mt-8 w-full max-w-md mx-auto"
                >
                    <div className="flex flex-col gap-1">
                        <Input
                            name="name"
                            type="text"
                            placeholder="Your name"
                            className="w-full max-w-xs rounded-lg bg-background px-4 py-3 text-sm"
                            required
                        />

                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full max-w-xs rounded-lg bg-background px-4 py-3 text-sm"
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        />
                        <Button type="submit" className="rounded-lg absolute top-1/2 -translate-y-1/2 right-2 px-6" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"}
                        </Button>

                    </div>
                </form>

                {success && (
                    <div className="mt-4 flex justify-center">
                        <div className="relative flex items-center gap-2 text-sm font-medium text-green-600">
                            <span className="absolute inset-y-1/2 left-0 right-0 h-[10px] -translate-y-1/2 bg-green-200 rounded"></span>

                            <CheckCircle2 className="h-4 w-4 relative z-10" />
                            <span className="relative z-10">
                                Subscribed! You&apos;ll start getting updates soon 🎉
                            </span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 flex justify-center">
                        <div className="relative flex items-center gap-2 text-sm font-medium text-red-600">
                            <span className="absolute inset-y-1/2 left-0 right-0 h-[10px] -translate-y-1/2 bg-red-200 rounded"></span>

                            <XCircle className="h-4 w-4 relative z-10" />
                            <span className="relative z-10">{error}</span>
                        </div>
                    </div>
                )}



                <p className="mt-4 text-xs text-muted-foreground">
                    No spam. Unsubscribe anytime.
                </p>
            </div>

        </section >
    );
}