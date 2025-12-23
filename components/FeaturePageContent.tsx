import Link from "next/link";

interface FAQ {
    question: string;
    answer: string;
}

interface Step {
    number: number;
    title: string;
    description: string;
}

export interface FeaturePageContentProps {
    title: string;
    description: string;
    steps: Step[];
    faqs: FAQ[];
    currentPath: string;
}

const featureLinks = [
    { href: "/download-video", label: "Download videos" },
    { href: "/extract-audio", label: "Extract audio from videos" },
    { href: "/transcribe-video", label: "Transcribe videos to text" },
    { href: "/add-subtitles", label: "Add subtitles to videos" },
    { href: "/summarize-video", label: "Summarize videos with AI" },
];

function generateFaqJsonLd(faqs: FAQ[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

export default function FeaturePageContent({
    title,
    description,
    steps,
    faqs,
    currentPath,
}: FeaturePageContentProps) {
    const faqJsonLd = generateFaqJsonLd(faqs);

    return (
        <>
            {/* FAQ Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* H1 and Intro */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">{description}</p>

                {/* How It Works */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        How It Works
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
                                    {step.number}
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Related Tools */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Related Tools
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {featureLinks
                            .filter((link) => link.href !== currentPath)
                            .map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                    </div>
                </section>
            </div>
        </>
    );
}

