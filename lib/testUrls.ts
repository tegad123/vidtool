/**
 * Sample URLs for testing platform detection
 * Run in dev to manually validate detection works correctly
 */
export const testUrls = [
    // YouTube
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", expected: "youtube" },
    { url: "https://youtu.be/dQw4w9WgXcQ", expected: "youtube" },
    { url: "youtube.com/watch?v=dQw4w9WgXcQ", expected: "youtube" },
    { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", expected: "youtube" },
    { url: "https://www.youtube.com/shorts/abc123", expected: "youtube" },
    { url: "https://m.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=twitter", expected: "youtube" },

    // TikTok
    { url: "https://www.tiktok.com/@user/video/7123456789012345678", expected: "tiktok" },
    { url: "https://vm.tiktok.com/ZM8abc123/", expected: "tiktok" },
    { url: "tiktok.com/@creator/video/1234567890", expected: "tiktok" },

    // Instagram
    { url: "https://www.instagram.com/p/ABC123xyz/", expected: "instagram" },
    { url: "https://www.instagram.com/reel/DEF456/", expected: "instagram" },
    { url: "https://instagram.com/tv/GHI789/?igshid=abc123", expected: "instagram" },
    { url: "instagram.com/p/XYZ", expected: "instagram" },

    // X/Twitter
    { url: "https://twitter.com/user/status/1234567890123456789", expected: "twitter" },
    { url: "https://x.com/elonmusk/status/1234567890", expected: "twitter" },
    { url: "x.com/user/status/999", expected: "twitter" },
    { url: "https://mobile.twitter.com/user/status/123", expected: "twitter" },

    // Facebook
    { url: "https://www.facebook.com/watch?v=123456789", expected: "facebook" },
    { url: "https://facebook.com/page/videos/987654321", expected: "facebook" },
    { url: "https://www.facebook.com/reel/111222333?fbclid=xyz", expected: "facebook" },
    { url: "https://fb.watch/abc123/", expected: "facebook" },

    // Vimeo
    { url: "https://vimeo.com/123456789", expected: "vimeo" },
    { url: "https://player.vimeo.com/video/123456789", expected: "vimeo" },
    { url: "vimeo.com/987654321", expected: "vimeo" },

    // Unknown
    { url: "https://example.com/video/123", expected: "unknown" },
    { url: "https://dailymotion.com/video/x8abc", expected: "unknown" },

    // Invalid
    { url: "not a url", expected: "unknown" },
    { url: "ftp://example.com/file", expected: "unknown" },
];
