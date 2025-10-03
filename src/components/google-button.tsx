"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export function GoogleButton() {
    const handleGoogleSignIn = async () => {
        await signIn.social({
            /**
             * The social provider ID
             * @example "github", "google", "apple"
             */
            provider: "google",
            /**
             * A URL to redirect after the user authenticates with the provider
             * @default "/"
             */
            callbackURL: "/",
            /**
             * A URL to redirect if an error occurs during the sign in process
             */
            errorCallbackURL: "/error",
            /**
             * A URL to redirect if the user is newly registered
             */
            newUserCallbackURL: "/welcome",
            /**
             * disable the automatic redirect to the provider.
             * @default false
             */
            disableRedirect: false,
        });
    };

    return (
        <Button onClick={handleGoogleSignIn} variant="outline" className="bg-emerald-50 hover:bg-neutral-50">
            <Image
                src="/icons/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
            />
            Google
        </Button>
    );
}
