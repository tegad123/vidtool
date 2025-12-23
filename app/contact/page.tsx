export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 prose dark:prose-invert">
            <h1>Contact Us</h1>

            <p className="lead">
                Have questions, feedback, or need to report an issue?
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 my-8">
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                <p>
                    <strong>General Inquiries:</strong><br />
                    <a href="mailto:contact@example.com" className="text-blue-600 hover:underline">contact@example.com</a>
                </p>

                <p className="mt-4">
                    <strong>Legal & DMCA:</strong><br />
                    <a href="mailto:legal@example.com" className="text-blue-600 hover:underline">legal@example.com</a>
                </p>
            </div>

            <p className="text-sm text-gray-500">
                Response time is typically 24-48 hours.
            </p>
        </div>
    );
}
