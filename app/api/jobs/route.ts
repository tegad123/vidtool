import { NextRequest, NextResponse } from "next/server";
import { createJob, startFakeProcessor } from "../../../lib/jobStore";
import { processJob } from "../../../lib/processor";

export async function POST(request: NextRequest) {
    try {
        const { url, action } = await request.json();
        console.log("[API/jobs] create request received", { action, url });

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const job = createJob(url, action);
        console.log("[API/jobs] Job created:", job.jobId);

        // Start processing in background (simulated or real)
        // Note: In serverless, this might be killed, but for the assignment we assume it runs.
        // Note: In serverless, this might be killed, but for the assignment we assume it runs.
        if (action === "download" || action === "audio" || action === "transcribe" || action === "summarize") {
            processJob(job.jobId);
        } else {
            startFakeProcessor(job.jobId);
        }

        return NextResponse.json({ jobId: job.jobId });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json(
            { error: "Failed to create job" },
            { status: 500 }
        );
    }
}
