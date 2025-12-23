import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "../../../lib/detectPlatform";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                {
                    platform: "unknown",
                    normalizedUrl: "",
                    isValidUrl: false,
                    reason: "Missing or invalid 'url' field",
                    id: null,
                },
                { status: 400 }
            );
        }

        const result = detectPlatform(url);
        return NextResponse.json(result);
    } catch {
        return NextResponse.json(
            {
                platform: "unknown",
                normalizedUrl: "",
                isValidUrl: false,
                reason: "Invalid request body",
                id: null,
            },
            { status: 400 }
        );
    }
}
