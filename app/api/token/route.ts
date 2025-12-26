import { StreamClient } from "@stream-io/node-sdk";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;

export async function POST(request: Request) {
    if (!apiKey || !secret) {
        return NextResponse.json(
            { error: "Stream keys are missing" },
            { status: 500 }
        );
    }

    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    const client = new StreamClient(apiKey, secret);

    // Initialize the user
    await client.upsertUsers([
        {
            id: userId,
            role: "admin",
            name: userId,
        },
    ]);

    const validity = 24 * 60 * 60; // 24 hours

    // Set iat to 60 seconds in the past
    const iat = Math.floor(Date.now() / 1000) - 60;
    const exp = Math.floor(Date.now() / 1000) + validity;

    const token = client.createToken(userId, exp, iat);

    return NextResponse.json({ token });
}
