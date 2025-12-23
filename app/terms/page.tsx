export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 prose dark:prose-invert">
            <h1>Terms of Service</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this tool, you agree to these Terms of Service. If you do not agree, strictly do not use this app.</p>

            <h2>2. Permitted Use</h2>
            <p>You agree to use this tool responsibly:</p>
            <ul>
                <li><strong>Ownership:</strong> You must own the content you process or have express permission from the copyright holder.</li>
                <li><strong>No DRM/Private Content:</strong> You strictly agree NOT to use this tool to bypass DRM (Digital Rights Management) or access private/paywalled content.</li>
                <li><strong>Personal Use:</strong> This tool is intended for personal, non-commercial use (e.g., offline viewing, accessibility, archiving own content).</li>
            </ul>

            <h2>3. Disclaimer of Warranties</h2>
            <p>
                The service is provided "AS IS" without any warranties. We do not guarantee availability, speed, or accuracy. We are not responsible for any data loss.
            </p>

            <h2>4. Restrictions</h2>
            <p>We reserve the right to block access or rate-limit IPs that abuse the service, conduct scraping, or violate these terms.</p>

            <h2>5. No Affiliation</h2>
            <p>
                This tool is an independent utility. We are NOT affiliated, endorsed, or associated with YouTube, Google, TikTok, Meta, or any other platform. All trademarks belong to their respective owners.
            </p>

            <h2>6. DMCA & Copyright</h2>
            <p>
                We respect intellectual property rights. If you believe your rights are being violated, please contact us to report abuse. We will promptly address valid takedown requests.
            </p>

            <h2>Contact</h2>
            <p>For legal inquiries: contact@example.com</p>
        </div>
    );
}
