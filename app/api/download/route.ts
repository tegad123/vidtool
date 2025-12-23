import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getFile, getAbsolutePath } from "../../../lib/fileRegistry";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get("fileId");

    console.log("DOWNLOAD ROUTE HIT", { fileId });

    if (!fileId) {
        return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }

    const fileMeta = getFile(fileId);

    if (!fileMeta) {
        console.log(`[API/Download] File not found in registry: ${fileId}`);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { filename, contentType, size } = fileMeta;
    const absolutePath = getAbsolutePath(filename);

    if (!fs.existsSync(absolutePath)) {
        console.log(`[API/Download] File physically missing: ${absolutePath}`);
        return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
    }

    console.log(`[API/Download] Serving file: ${filename} (${size} bytes)`);

    const fileStream = fs.createReadStream(absolutePath);

    // Cast to any to satisfy Next.js ReadableStream type mismatch with Node stream
    return new NextResponse(fileStream as any, {
        headers: {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": contentType || "application/octet-stream",
            "Content-Length": size.toString(),
            "Cache-Control": "no-store",
        },
    });
}
