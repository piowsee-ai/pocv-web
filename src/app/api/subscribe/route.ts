import { NextResponse } from "next/server";
import { Resend } from "resend";
import validator from "validator";
import disposableDomains from "disposable-email-domains";
import { Email } from '../../../components/main-page/email';

const resend = new Resend(process.env.RESEND_API_KEY);

type SubscribeBody = {
    name?: string;
    email?: string;
};

export async function POST(req: Request) {
    try {
        const { name, email }: SubscribeBody = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        if (!validator.isEmail(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        const domain = email.split("@")[1].toLowerCase();
        if (disposableDomains.includes(domain)) {
            return NextResponse.json(
                { error: "Disposable email not allowed" },
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Thanks for subscribing to our product!",
            react: Email({ firstName: name || "User" }),
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }
}
