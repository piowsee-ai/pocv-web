"use client";

import { useState } from "react";
import PrivacyHeader from "./privacy-header";
import PrivacyMulti from "./privacy-multi";

export default function PrivacyWrapper({ lastUpdated }: { lastUpdated: string }) {
    const [lang, setLang] = useState<"en" | "id">("en");

    return (
        <>
            <PrivacyHeader lang={lang} setLang={setLang} />

            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <PrivacyMulti lang={lang} />
        </>
    );
}