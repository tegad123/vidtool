"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AdSlot from "./AdSlot";

type ActionType = "download" | "audio" | "transcribe" | "subtitles" | "summarize";

interface InspectResult {
    platform: string;
    normalizedUrl: string;
    isValidUrl: boolean;
    reason: string | null;
    id: string | null;
}

interface JobResult {
    downloadUrl?: string;
    text?: string;
    files?: string[];
    fileId?: string;
    filename?: string;
}


interface JobStatus {
    jobId: string;
    status: "queued" | "running" | "completed" | "failed";
    progress: number;
    action: string;
    url: string;
    result: JobResult | null;
    error: string | null;
}

export interface ToolProps {
    /** Pre-select an action button on mount */
    defaultAction?: ActionType | null;
}

const actionConfig: { action: ActionType; label: string; icon: string }[] = [
    { action: "download", label: "Download Video", icon: "⬇️" },
    { action: "audio", label: "Extract Audio", icon: "🎵" },
    { action: "transcribe", label: "Transcribe", icon: "📝" },
    { action: "summarize", label: "Summarize", icon: "📋" },
];

export default function Tool({ defaultAction = null }: ToolProps) {
    const [url, setUrl] = useState("");
    const [activeAction, setActiveAction] = useState<ActionType | null>(defaultAction);
    const [inspectResult, setInspectResult] = useState<InspectResult | null>(null);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Reset entire session - clears all state and focuses input
    const resetSession = useCallback(() => {
        setUrl("");
        setActiveAction(defaultAction);
        setInspectResult(null);
        setCurrentJobId(null);
        setJobStatus(null);
        setIsProcessing(false);
        setError(null);
        // Focus the input after reset
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [defaultAction]);

    // Reset job state immediately when URL changes
    useEffect(() => {
        // If the URL changes (and isn't just empty), clear previous job results so the user can start fresh
        if (jobStatus && jobStatus.url !== url.trim()) {
            setJobStatus(null);
            setCurrentJobId(null);
            setError(null);
            setIsProcessing(false);
        }
    }, [url, jobStatus]);

    // Auto-inspect on URL change (debounced)
    useEffect(() => {
        if (!url.trim()) {
            setInspectResult(null);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await fetch("/api/inspect", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: url.trim() }),
                });
                const result: InspectResult = await response.json();
                setInspectResult(result);
            } catch {
                setInspectResult(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [url]);

    // Poll job status
    const pollJobStatus = useCallback(async (jobId: string) => {
        try {
            const response = await fetch(`/api/jobs/${jobId}`);
            if (response.ok) {
                const data: JobStatus = await response.json();
                setJobStatus(data);
                return data.status === "completed" || data.status === "failed";
            }
            return true;
        } catch {
            return true;
        }
    }, []);

    useEffect(() => {
        if (!currentJobId || !isProcessing) return;

        const intervalId = setInterval(async () => {
            const shouldStop = await pollJobStatus(currentJobId);
            if (shouldStop) {
                setIsProcessing(false);
                clearInterval(intervalId);
            }
        }, 1000);

        pollJobStatus(currentJobId);
        return () => clearInterval(intervalId);
    }, [currentJobId, isProcessing, pollJobStatus]);

    const handleAction = async (action: ActionType) => {
        console.log("[UI] Action clicked:", action, "URL:", url);

        if (!url.trim()) {
            setError("Please enter a URL first");
            return;
        }

        // If running new action, clear previous status logic is handled by setting new job logic below
        // We do NOT want to reset session here as it wipes the user's input


        if (!url.trim()) {
            setError("Please enter a URL first");
            return;
        }

        setError(null);
        setActiveAction(action);
        setJobStatus(null);
        setIsProcessing(true);

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim(), action }),
            });

            if (response.ok) {
                const { jobId } = await response.json();
                setCurrentJobId(jobId);
            } else {
                setError("Failed to start job");
                setIsProcessing(false);
            }
        } catch {
            setError("Failed to start job");
            setIsProcessing(false);
        }
    };

    // Check if we have a valid URL for enabling buttons
    const hasValidUrl = url.trim().length > 0;
    const isJobComplete = jobStatus && (jobStatus.status === "completed" || jobStatus.status === "failed");
    const showOutput = inspectResult || jobStatus || error || isProcessing;

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* URL Input */}
            <div className="mb-4">
                <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a video link (YouTube, TikTok, Instagram, Twitter, Facebook, Vimeo)"
                    disabled={isProcessing}
                    autoFocus
                    className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-2">
                {actionConfig.map(({ action, label, icon }) => (
                    <button
                        key={action}
                        onClick={() => handleAction(action)}
                        // removed disabled prop to allow clicking and validation feedback
                        className={`flex flex-col items-center justify-center px-3 py-3 rounded-lg font-medium text-xs sm:text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${activeAction === action
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            } ${isProcessing ? "opacity-50 cursor-wait" : ""}`}
                    >
                        <span className="text-lg mb-1">{icon}</span>
                        <span className="text-center leading-tight">{label}</span>
                    </button>
                ))}
            </div>

            {/* UX Hint */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">
                Each action runs on a single link. Paste a new link to run another action.
            </p>

            {/* Output Panel */}
            {showOutput && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Platform Detection */}
                    {inspectResult && inspectResult.isValidUrl && !jobStatus && (
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                            <span className="text-xs text-gray-400 uppercase tracking-wide">Platform</span>
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                                {inspectResult.platform}
                            </span>
                            {inspectResult.id && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                                    ID: {inspectResult.id}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Initial Processing State (before job status is polled) */}
                    {isProcessing && !jobStatus && (
                        <div className="px-4 py-8 flex flex-col items-center justify-center text-gray-500">
                            <div className="w-8 h-8 mb-3 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium">Starting download...</p>
                        </div>
                    )}

                    {/* Job Progress */}
                    {jobStatus && jobStatus.status === "running" && (
                        <div className="px-4 py-4">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                                <span>Processing...</span>
                                <span className="font-mono">{jobStatus.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${jobStatus.progress}%` }}
                                />
                            </div>
                            <div className="mt-4">
                                <AdSlot slotId="tool-processing" enabled={true} minHeight={100} className="bg-gray-100 dark:bg-gray-700/50 rounded border border-dashed border-gray-300 dark:border-gray-600" />
                            </div>
                        </div>
                    )}

                    {/* Job Completed: Summarize (Custom View) */}
                    {jobStatus && jobStatus.status === "completed" && jobStatus.action === "summarize" && jobStatus.result && (
                        <div className="px-4 py-4 space-y-4">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span className="font-medium text-sm">Summary Generated!</span>
                            </div>

                            {/* Short Summary */}
                            {(jobStatus.result as any).summary?.shortSummary && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                    <h3 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1">Overview</h3>
                                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {(jobStatus.result as any).summary.shortSummary}
                                    </p>
                                </div>
                            )}

                            {/* Key Takeaways */}
                            {(jobStatus.result as any).summary?.keyTakeaways && (jobStatus.result as any).summary.keyTakeaways.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Takeaways</h3>
                                    <ul className="space-y-2">
                                        {(jobStatus.result as any).summary.keyTakeaways.map((point: string, i: number) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="text-blue-500">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Medium Summary */}
                            {(jobStatus.result as any).summary?.mediumSummary && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Detailed Summary</h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-h-40 overflow-y-auto pr-2">
                                        {(jobStatus.result as any).summary.mediumSummary}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={resetSession}
                                className="w-full mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                            >
                                Process Another
                            </button>
                        </div>
                    )}

                    {/* Job Completed: Standard (Download/Audio/Transcribe) */}
                    {jobStatus && jobStatus.status === "completed" && jobStatus.action !== "summarize" && jobStatus.result && (
                        <div className="px-4 py-4 space-y-3">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium text-sm">Done!</span>
                            </div>

                            {jobStatus.result.downloadUrl && (
                                <a
                                    href={jobStatus.result.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={jobStatus.result.filename} // Hint for browser
                                    className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    {jobStatus.result.filename ? `Download ${jobStatus.result.filename}` : "Download File"}
                                </a>
                            )}

                            {jobStatus.result.text && (
                                <div className="p-3 bg-white dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                                    {jobStatus.result.text}
                                </div>
                            )}

                            {jobStatus.result.files && jobStatus.result.files.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {jobStatus.result.files.map((file, i) => (
                                        <a
                                            key={i}
                                            href={file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            File {i + 1}
                                        </a>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={resetSession}
                                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                            >
                                Process Another
                            </button>

                            <div className="mt-2">
                                <AdSlot slotId="tool-results" enabled={true} minHeight={100} className="bg-gray-100 dark:bg-gray-700/50 rounded border border-dashed border-gray-300 dark:border-gray-600" />
                            </div>
                        </div>
                    )}

                    {/* Job Failed */}
                    {jobStatus && jobStatus.status === "failed" && (
                        <div className="px-4 py-4 space-y-3">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="font-medium text-sm">Failed</span>
                            </div>
                            {jobStatus.error && (
                                <p className="text-sm text-red-600 dark:text-red-400">{jobStatus.error}</p>
                            )}
                            <button
                                onClick={resetSession}
                                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Ad Container (Idle Slot) */}
            <div className="mt-6">
                <AdSlot
                    slotId="tool-idle"
                    format="horizontal"
                    enabled={!isProcessing}
                    minHeight={250}
                    className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
                />
            </div>
        </div>
    );
}
