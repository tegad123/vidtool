import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { getJob, updateJob, JobResult } from "./jobStore";
import { OUTPUT_DIR, registerFile, getAbsolutePath } from "./fileRegistry";

export function processJob(jobId: string) {
    const job = getJob(jobId);
    if (!job) return;

    // Mark as running
    updateJob(jobId, { status: "running", progress: 0 });
    console.log(`[Processor] Starting job ${jobId} for URL: ${job.url}`);

    // Determine anti-bot flags based on domain
    const isTikTok = job.url.includes("tiktok.com");

    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

    // Base arguments
    let args: string[] = [
        "--no-playlist",
        "--force-ipv4",
        "--newline",
        "--js-runtimes", "node",  // Required for YouTube extraction
        "--user-agent", userAgent,
        "-P", OUTPUT_DIR,
        "-o", "%(id)s.%(ext)s",
        "--print", "after_move:filepath",
        "--progress"
    ];

    // Write cookies if provided
    let cookieFile: string | null = null;
    if (process.env.COOKIES_TXT) {
        if (!fs.existsSync(OUTPUT_DIR)) {
            try { fs.mkdirSync(OUTPUT_DIR, { recursive: true }); } catch (e) { /* ignore */ }
        }
        cookieFile = path.join(OUTPUT_DIR, `cookies-${jobId}.txt`);
        try { fs.writeFileSync(cookieFile, process.env.COOKIES_TXT); } catch (e) { /* ignore */ }
    }

    if (cookieFile) args.push("--cookies", cookieFile);

    // Add Referer only for TikTok
    if (isTikTok) {
        args.push("--referer", "https://www.tiktok.com/");
    }

    if (job.action === "audio" || job.action === "transcribe" || job.action === "summarize") {
        args.push(
            "--extract-audio",
            "--audio-format", "mp3",
            "--audio-quality", "0"
        );
    } else {
        // Video download
        args.push(
            "--merge-output-format", "mp4",
            "--format", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
        );
    }

    // Append URL last
    args.push(job.url);

    const ytDlp = spawn("yt-dlp", args);

    let progress = 0;
    let finalFilePath: string | null = null;
    let stdoutBuffer = "";

    ytDlp.stdout.on("data", (data) => {
        stdoutBuffer += data.toString();

        let newlineIndex: number;
        while ((newlineIndex = stdoutBuffer.indexOf("\n")) !== -1) {
            const line = stdoutBuffer.substring(0, newlineIndex).trim();
            stdoutBuffer = stdoutBuffer.substring(newlineIndex + 1);

            if (!line) continue;

            const progressMatch = line.match(/\[download\]\s+(\d+\.?\d*)%/);
            if (progressMatch) {
                const newProgress = Math.floor(parseFloat(progressMatch[1]));
                // For transcribe/summarize, 0-50% is download, 50-100% is transcribe/summarize
                const isCompositeJob = job.action === "transcribe" || job.action === "summarize";
                const scaledProgress = isCompositeJob ? Math.floor(newProgress / 2) : newProgress;

                if (scaledProgress > progress && scaledProgress <= 100) {
                    progress = scaledProgress;
                    updateJob(jobId, { progress });
                }
            }

            if (line.includes(OUTPUT_DIR) || ((line.endsWith(".mp4") || line.endsWith(".mp3")) && path.dirname(line).endsWith("outputs"))) {
                finalFilePath = line;
            }
        }
    });

    ytDlp.stderr.on("data", (data) => {
        const errText = data.toString().trim();
        if (errText) console.log(`[yt-dlp stderr] ${errText}`);
    });

    ytDlp.on("close", (code) => {
        console.log(`[Processor] yt-dlp exited with code ${code}`);

        // Cleanup cookies
        if (cookieFile && fs.existsSync(cookieFile)) {
            try { fs.unlinkSync(cookieFile); } catch (e) { /* ignore */ }
        }

        if (code === 0 && finalFilePath && fs.existsSync(finalFilePath)) {
            const stat = fs.statSync(finalFilePath);
            // Lower min size for audio
            const minSize = 10 * 1024; // 10KB 

            if (stat.size < minSize) {
                console.error(`[Processor] Validation failed: File too small (${stat.size} bytes). Deleting.`);
                fs.unlinkSync(finalFilePath);
                updateJob(jobId, { status: "failed", error: "Download validation failed (file too small)" });
                return;
            }

            console.log(`[Processor] Validation passed. Size: ${stat.size} bytes. Registering.`);

            const filename = path.basename(finalFilePath);
            const fileId = filename;
            const contentType = filename.endsWith(".mp3") ? "audio/mpeg" : "video/mp4";

            // If Transcribe or Summarize, run Whisper
            if (job.action === "transcribe" || job.action === "summarize") {
                runWhisper(jobId, finalFilePath, fileId, job.action === "summarize");
                return;
            }

            // Register in persistent store
            registerFile({
                fileId,
                filename,
                contentType,
                size: stat.size
            });

            const result: JobResult = {
                fileId: fileId,
                filename: filename,
                downloadUrl: `/api/download?fileId=${encodeURIComponent(fileId)}`
            };

            updateJob(jobId, {
                status: "completed",
                progress: 100,
                result
            });
        } else {
            console.error(`[Processor] Job ${jobId} failed. Code: ${code}, FilePath: ${finalFilePath}`);
            updateJob(jobId, {
                status: "failed",
                error: "Download failed or file not found."
            });
        }
    });

    ytDlp.on("error", (err) => {
        console.error(`[Processor] Spawn error for job ${jobId}:`, err);
        updateJob(jobId, {
            status: "failed",
            error: "System error: could not start downloader."
        });
    });
}

function runWhisper(jobId: string, audioPath: string, baseId: string, alsoSummarize: boolean = false) {
    console.log(`[Transcribe Job] Starting Whisper for ${audioPath}`);
    updateJob(jobId, { progress: 50 }); // Start at 50%

    // Check for whisper executable: 
    // 1. In PATH (ideal)
    // 2. In ~/.local/bin/whisper (pipx default)

    // Command: whisper <audioPath> --model tiny --output_format txt,srt,json --output_dir outputs/
    // Using 'tiny' model for better performance on limited resources

    const pipxPath = path.join(process.env.HOME || "", ".local/bin/whisper");
    const command = fs.existsSync(pipxPath) ? pipxPath : "whisper";

    // Use 'tiny' model for faster processing and lower memory usage on cloud
    const args = [
        audioPath,
        "--model", "tiny",
        "--output_format", "all",
        "--output_dir", OUTPUT_DIR,
        "--verbose", "True"  // Enable verbose for better debugging
    ];

    console.log(`[Whisper] Running: ${command} ${args.join(" ")}`);

    const whisper = spawn(command, args);

    // Set a timeout of 5 minutes for transcription
    const WHISPER_TIMEOUT_MS = 5 * 60 * 1000;
    let killed = false;
    const timeoutHandle = setTimeout(() => {
        console.error(`[Whisper] Timeout after ${WHISPER_TIMEOUT_MS / 1000}s - killing process`);
        killed = true;
        whisper.kill("SIGKILL");
    }, WHISPER_TIMEOUT_MS);

    whisper.stdout.on("data", (data) => console.log(`[Whisper stdout] ${data.toString().trim()}`));
    whisper.stderr.on("data", (data) => console.log(`[Whisper stderr] ${data.toString().trim()}`));

    whisper.on("error", (err) => {
        clearTimeout(timeoutHandle);
        console.error("[Transcribe Job] Whisper not found or failed to spawn", err);
        updateJob(jobId, { status: "failed", error: "Transcription unavailable. Whisper command not found." });
    });

    whisper.on("close", (code) => {
        clearTimeout(timeoutHandle);

        if (killed) {
            updateJob(jobId, { status: "failed", error: "Transcription timed out. The audio may be too long." });
            return;
        }

        if (code !== 0) {
            console.error(`[Whisper] Exited with code ${code}`);
            updateJob(jobId, { status: "failed", error: `Transcription process failed (exit code ${code}).` });
            return;
        }

        console.log("[Transcribe Job] Whisper finished.");

        const baseName = path.parse(audioPath).name;

        const outputTypes = [
            { ext: ".txt", mime: "text/plain", label: "Transcript (TXT)" },
            { ext: ".srt", mime: "application/x-subrip", label: "Subtitles (SRT)" },
            { ext: ".json", mime: "application/json", label: "Segments (JSON)" }
        ];

        const files = [];
        let previewText = "";

        for (const type of outputTypes) {
            const outFilename = `${baseName}${type.ext}`;
            const outPath = path.join(OUTPUT_DIR, outFilename);

            if (fs.existsSync(outPath)) {
                if (type.ext === ".txt") {
                    previewText = fs.readFileSync(outPath, "utf-8");
                }

                const stat = fs.statSync(outPath);
                registerFile({
                    fileId: outFilename,
                    filename: outFilename,
                    contentType: type.mime,
                    size: stat.size
                });

                files.push({
                    label: type.label,
                    fileId: outFilename,
                    filename: outFilename,
                    downloadUrl: `/api/download?fileId=${encodeURIComponent(outFilename)}`
                });
            }
        }

        if (files.length === 0) {
            updateJob(jobId, { status: "failed", error: "Transcription outputs missing." });
            return;
        }

        // Register original audio too
        const audioStat = fs.statSync(audioPath);
        registerFile({
            fileId: baseId,
            filename: baseId,
            contentType: "audio/mpeg",
            size: audioStat.size
        });

        files.unshift({
            label: "Original Audio",
            fileId: baseId,
            filename: baseId,
            downloadUrl: `/api/download?fileId=${encodeURIComponent(baseId)}`
        });

        // Construct final result
        const result: JobResult = {
            text: previewText.substring(0, 2000), // Standard preview
            files: files.map(f => f.downloadUrl)
        };

        if (alsoSummarize && previewText) {
            // Generate heuristic summary
            const sentences = previewText.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");

            // Short summary: First 3 sentences
            const shortSummary = sentences.slice(0, 3).join(" ");

            // Key Takeaways: Next 5 sentences (naively)
            // Or pick sentences with keywords like "important", "key", "summary", or just next chunk
            const keyTakeaways = sentences.slice(3, 8).map(s => s.trim()).filter(s => s.length > 20);

            // Medium Summary: First 1500 chars
            const mediumSummary = previewText.substring(0, 1500) + (previewText.length > 1500 ? "..." : "");

            // Attach to result (we need to update JobResult interface first? No, it's flexible or we extend result object)
            // The frontend expects `result` to be generic or we cast it.
            // Updating `JobResult` interface in `jobStore.ts` might be needed if strictly typed.
            // For now, let's just add it to the result object as extra properties.
            (result as any).summary = {
                shortSummary,
                keyTakeaways,
                mediumSummary
            };
        }

        updateJob(jobId, {
            status: "completed",
            progress: 100,
            result
        });
    });
}
