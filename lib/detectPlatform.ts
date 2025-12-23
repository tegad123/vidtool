export type Platform = "youtube" | "tiktok" | "instagram" | "twitter" | "facebook" | "vimeo" | "unknown";

export interface InspectResult {
    platform: Platform;
    normalizedUrl: string;
    isValidUrl: boolean;
    reason: string | null;
    id: string | null;
}

const TRACKING_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "igshid"];

function removeTrackingParams(url: URL): void {
    TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));
    // Remove any utm_* params
    Array.from(url.searchParams.keys()).forEach((key) => {
        if (key.startsWith("utm_")) {
            url.searchParams.delete(key);
        }
    });
}

function normalizeHost(host: string): string {
    return host.toLowerCase().replace(/^www\./, "");
}

// YouTube patterns
function detectYouTube(url: URL): { id: string | null; normalized: string } | null {
    const host = normalizeHost(url.hostname);

    if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") {
        let videoId: string | null = null;

        if (host === "youtu.be") {
            // youtu.be/<id>
            videoId = url.pathname.slice(1).split("/")[0] || null;
        } else if (url.pathname === "/watch") {
            // youtube.com/watch?v=<id>
            videoId = url.searchParams.get("v");
        } else if (url.pathname.startsWith("/embed/")) {
            // youtube.com/embed/<id>
            videoId = url.pathname.split("/")[2] || null;
        } else if (url.pathname.startsWith("/v/")) {
            // youtube.com/v/<id>
            videoId = url.pathname.split("/")[2] || null;
        } else if (url.pathname.startsWith("/shorts/")) {
            // youtube.com/shorts/<id>
            videoId = url.pathname.split("/")[2] || null;
        }

        if (videoId) {
            return { id: videoId, normalized: `https://www.youtube.com/watch?v=${videoId}` };
        }

        // Valid YouTube URL but no video ID extracted
        removeTrackingParams(url);
        return { id: null, normalized: url.toString() };
    }
    return null;
}

// TikTok patterns
function detectTikTok(url: URL): { id: string | null; normalized: string } | null {
    const host = normalizeHost(url.hostname);

    if (host === "tiktok.com" || host === "vm.tiktok.com" || host === "m.tiktok.com") {
        // Pattern: tiktok.com/@user/video/<id>
        const videoMatch = url.pathname.match(/\/@[\w.]+\/video\/(\d+)/);
        if (videoMatch) {
            removeTrackingParams(url);
            return { id: videoMatch[1], normalized: url.toString() };
        }

        // Short URLs or other formats - keep original
        removeTrackingParams(url);
        return { id: null, normalized: url.toString() };
    }
    return null;
}

// Instagram patterns
function detectInstagram(url: URL): { id: string | null; normalized: string } | null {
    const host = normalizeHost(url.hostname);

    if (host === "instagram.com" || host === "instagr.am") {
        // Pattern: instagram.com/(p|reel|tv)/<code>/
        const match = url.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
        if (match) {
            const type = match[1];
            const code = match[2];
            return { id: code, normalized: `https://www.instagram.com/${type}/${code}/` };
        }

        removeTrackingParams(url);
        return { id: null, normalized: url.toString() };
    }
    return null;
}

// X/Twitter patterns
function detectTwitter(url: URL): { id: string | null; normalized: string } | null {
    const host = normalizeHost(url.hostname);

    if (host === "twitter.com" || host === "x.com" || host === "mobile.twitter.com") {
        // Pattern: twitter.com/<user>/status/<id>
        const match = url.pathname.match(/^\/(\w+)\/status\/(\d+)/);
        if (match) {
            const user = match[1];
            const statusId = match[2];
            return { id: statusId, normalized: `https://x.com/${user}/status/${statusId}` };
        }

        removeTrackingParams(url);
        url.hostname = "x.com";
        return { id: null, normalized: url.toString() };
    }
    return null;
}

// Facebook patterns
function detectFacebook(url: URL): { id: string | null; normalized: string } | null {
    const host = normalizeHost(url.hostname);

    if (host === "facebook.com" || host === "fb.watch" || host === "m.facebook.com" || host === "fb.com") {
        let videoId: string | null = null;

        // facebook.com/video.php?v=<id>
        if (url.pathname === "/video.php") {
            videoId = url.searchParams.get("v");
        }

        // facebook.com/<page>/videos/<id>
        const videosMatch = url.pathname.match(/\/videos\/(\d+)/);
        if (videosMatch) {
            videoId = videosMatch[1];
        }

        // facebook.com/watch?v=<id>
        if (url.pathname === "/watch" || url.pathname === "/watch/") {
            videoId = url.searchParams.get("v");
        }

        // facebook.com/reel/<id>
        const reelMatch = url.pathname.match(/\/reel\/(\d+)/);
        if (reelMatch) {
            videoId = reelMatch[1];
        }

        if (videoId) {
            return { id: videoId, normalized: `https://www.facebook.com/video.php?v=${videoId}` };
        }

        removeTrackingParams(url);
        return { id: null, normalized: url.toString() };
    }
    return null;
}

// Vimeo patterns
function detectVimeo(url: URL): { id: string | null; normalized: string } | null {
    const host = normalizeHost(url.hostname);

    if (host === "vimeo.com" || host === "player.vimeo.com") {
        let videoId: string | null = null;

        // vimeo.com/<id>
        const idMatch = url.pathname.match(/^\/(\d+)/);
        if (idMatch) {
            videoId = idMatch[1];
        }

        // player.vimeo.com/video/<id>
        const playerMatch = url.pathname.match(/^\/video\/(\d+)/);
        if (playerMatch) {
            videoId = playerMatch[1];
        }

        if (videoId) {
            return { id: videoId, normalized: `https://vimeo.com/${videoId}` };
        }

        removeTrackingParams(url);
        return { id: null, normalized: url.toString() };
    }
    return null;
}

export function detectPlatform(rawUrl: string): InspectResult {
    let urlString = rawUrl.trim();

    // Handle missing protocol
    if (!urlString.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
        urlString = "https://" + urlString;
    }

    // Parse URL
    let url: URL;
    try {
        url = new URL(urlString);
    } catch {
        return {
            platform: "unknown",
            normalizedUrl: rawUrl,
            isValidUrl: false,
            reason: "Invalid URL format",
            id: null,
        };
    }

    // Reject non-http(s) schemes
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return {
            platform: "unknown",
            normalizedUrl: rawUrl,
            isValidUrl: false,
            reason: `Invalid protocol: ${url.protocol}`,
            id: null,
        };
    }

    // Try each platform detector
    const detectors: Array<{ platform: Platform; detect: (url: URL) => { id: string | null; normalized: string } | null }> = [
        { platform: "youtube", detect: detectYouTube },
        { platform: "tiktok", detect: detectTikTok },
        { platform: "instagram", detect: detectInstagram },
        { platform: "twitter", detect: detectTwitter },
        { platform: "facebook", detect: detectFacebook },
        { platform: "vimeo", detect: detectVimeo },
    ];

    for (const { platform, detect } of detectors) {
        const result = detect(url);
        if (result) {
            return {
                platform,
                normalizedUrl: result.normalized,
                isValidUrl: true,
                reason: null,
                id: result.id,
            };
        }
    }

    // Unknown platform
    removeTrackingParams(url);
    return {
        platform: "unknown",
        normalizedUrl: url.toString(),
        isValidUrl: true,
        reason: "Platform not recognized",
        id: null,
    };
}
