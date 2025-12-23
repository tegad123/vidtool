/**
 * In-memory job store
 * TODO: Replace with Redis for production persistence
 */

export type JobAction = "download" | "audio" | "transcribe" | "subtitles" | "summarize";
export type JobStatus = "queued" | "running" | "completed" | "failed";

export interface JobResult {
    downloadUrl?: string; // Direct URL if external
    text?: string;
    files?: string[];
    fileId?: string;      // For local server files
    filename?: string;    // Display filename
}


export interface Job {
    jobId: string;
    status: JobStatus;
    progress: number;
    action: JobAction;
    url: string;
    result: JobResult | null;
    error: string | null;
    createdAt: number;
}

// In-memory store - persists within the running process (and across HMR in dev)
const globalForJobStore = global as unknown as { jobStore: Map<string, Job> };
const jobStore = globalForJobStore.jobStore || new Map<string, Job>();

if (process.env.NODE_ENV !== "production") {
    globalForJobStore.jobStore = jobStore;
}

export function generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createJob(url: string, action: JobAction): Job {
    const jobId = generateJobId();
    const job: Job = {
        jobId,
        status: "queued",
        progress: 0,
        action,
        url,
        result: null,
        error: null,
        createdAt: Date.now(),
    };
    jobStore.set(jobId, job);
    return job;
}

export function getJob(jobId: string): Job | undefined {
    return jobStore.get(jobId);
}

export function updateJob(jobId: string, updates: Partial<Job>): Job | undefined {
    const job = jobStore.get(jobId);
    if (job) {
        const updated = { ...job, ...updates };
        jobStore.set(jobId, updated);
        return updated;
    }
    return undefined;
}

// Placeholder results by action type
function getPlaceholderResult(action: JobAction): JobResult {
    switch (action) {
        case "download":
            return { downloadUrl: "https://example.com/downloads/video_placeholder.mp4" };
        case "audio":
            return { downloadUrl: "https://example.com/downloads/audio_placeholder.mp3" };
        case "transcribe":
            return { text: "This is a placeholder transcription. In a real implementation, this would contain the full transcript of the video content with timestamps and speaker identification where applicable." };
        case "subtitles":
            return {
                files: [
                    "https://example.com/downloads/subtitles_en.srt",
                    "https://example.com/downloads/subtitles_en.vtt"
                ]
            };
        case "summarize":
            return { text: "This is a placeholder summary. The video discusses key topics and presents main arguments with supporting evidence. Key takeaways include important points that viewers should remember." };
        default:
            return {};
    }
}

/**
 * Fake processor that simulates job execution
 * Runs async and updates job progress over 8-15 seconds
 */
export function startFakeProcessor(jobId: string): void {
    const job = getJob(jobId);
    if (!job) return;

    // Mark as running
    updateJob(jobId, { status: "running", progress: 0 });

    // Random duration between 8-15 seconds
    const totalDuration = 8000 + Math.random() * 7000;
    const updateInterval = 500; // Update every 500ms
    const totalSteps = Math.floor(totalDuration / updateInterval);
    let currentStep = 0;

    const intervalId = setInterval(() => {
        currentStep++;
        const progress = Math.min(Math.floor((currentStep / totalSteps) * 100), 99);

        updateJob(jobId, { progress });

        if (currentStep >= totalSteps) {
            clearInterval(intervalId);

            // Complete the job with placeholder result
            const result = getPlaceholderResult(job.action);
            updateJob(jobId, {
                status: "completed",
                progress: 100,
                result,
            });
        }
    }, updateInterval);
}
