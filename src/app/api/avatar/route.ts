import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get("url");
    if (!imageUrl)
        return NextResponse.json({ error: "Missing URL" }, { status: 400 });

    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
        },
    });
}
