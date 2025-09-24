"use client";

import { useState } from "react";
import TermsHeader from "./terms-header";
import TermsMulti from "./terms-multi";

export default function TermsWrapper({ lastUpdated }: { lastUpdated: string }) {
    const [lang, setLang] = useState<"en" | "id">("en");

    return (
        <>
            <TermsHeader lang={lang} setLang={setLang} />

            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <TermsMulti lang={lang} />
        </>
    );
}