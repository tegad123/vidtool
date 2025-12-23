export async function GET() {
    // Placeholder content. Replace with real lines from AdSense when approved.
    // Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
    const content = `# ads.txt
# Update with real publisher ID after approval
# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
