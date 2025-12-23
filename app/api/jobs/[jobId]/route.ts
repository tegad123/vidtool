import { NextRequest, NextResponse } from "next/server";
import { getJob } from "../../../../lib/jobStore";

export async function GET(
    request: NextRequest,
    { params }: { params: { jobId: string } }
) {
    const { jobId } = params;

    if (!jobId) {
        return NextResponse.json(
            { error: "Missing jobId parameter" },
            { status: 400 }
        );
    }

    const job = getJob(jobId);

    if (!job) {
        return NextResponse.json(
            { error: "Job not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({
        jobId: job.jobId,
        status: job.status,
        progress: job.progress,
        action: job.action,
        url: job.url,
        result: job.result,
        error: job.error,
    });
}
