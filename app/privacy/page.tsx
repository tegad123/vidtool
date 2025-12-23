export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 prose dark:prose-invert">
            <h1>Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Information We Collect</h2>
            <p>
                We minimize data collection. When you use our tool, we may process:
            </p>
            <ul>
                <li><strong>Submitted URLs:</strong> To process your requests (download, extraction, transcription).</li>
                <li><strong>Generated Files:</strong> Temporary storage of your files for download. These are deleted automatically.</li>
                <li><strong>Usage Data:</strong> Basic analytics via cookies or logs (IP address, browser type) to prevent abuse and improve performance.</li>
            </ul>

            <h2>2. How We Use Data</h2>
            <p>We use this data solely to:</p>
            <ul>
                <li>Provide the requested service (processing video/audio).</li>
                <li>Prevent abuse and protect our infrastructure.</li>
                <li>Display non-personalized or personalized advertisements (if you opt-in).</li>
            </ul>

            <h2>3. Third-Party Services</h2>
            <p>We use trusted third-party providers:</p>
            <ul>
                <li><strong>Ad Networks:</strong> We may use Google AdSense or others to show ads. They may use cookies to serve ads based on your visits.</li>
                <li><strong>Analytics:</strong> Minimum analytics to track site health.</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>
                We do not permanently store your content. Processed files are kept for a short duration (typically hours) to allow you to download them, then they are permanently deleted from our servers.
            </p>

            <h2>5. Children's Privacy</h2>
            <p>
                Our service is not directed to children under 13. We do not knowingly collect personal information from children.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about this policy, please contact us at: contact@example.com</p>
        </div>
    );
}
