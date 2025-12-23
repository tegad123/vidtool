"use client";

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: "Is this free?",
        answer: "Yes, this tool is completely free to use. No account or payment required.",
    },
    {
        question: "Do I need to install anything?",
        answer: "No installation needed. This is a web-based tool that works directly in your browser.",
    },
    {
        question: "Which platforms are supported?",
        answer: "We support YouTube, TikTok, Instagram, X (Twitter), Facebook, and Vimeo.",
    },
    {
        question: "Can I download audio only?",
        answer: "Yes, use the 'Extract Audio' option to get just the audio track from any video.",
    },
    {
        question: "Can I get a transcript?",
        answer: "Yes, use 'Transcribe' to get text or 'Summarize' for a quick overview.",
    },
    {
        question: "Does it work with private/DRM-protected videos?",
        answer: "No, this tool only works with publicly accessible videos. Private or DRM-protected content is not supported.",
    },
];

const platforms = [
    "YouTube",
    "TikTok",
    "Instagram (Reels & public posts)",
    "X (Twitter)",
    "Facebook (public videos)",
    "Vimeo",
];

const useCases = [
    "Download videos from YouTube or TikTok",
    "Extract audio from social media videos",
    "Transcribe videos to text for notes",
    "Summarize long videos quickly",
    "Convert video links into usable content",
    "Save video content for offline viewing",
];

const steps = [
    {
        number: 1,
        title: "Paste a public video link",
        description: "Copy any video URL from a supported platform.",
    },
    {
        number: 2,
        title: "Choose an action",
        description: "Download, Audio, Transcribe, or Summarize.",
    },
    {
        number: 3,
        title: "Get your result",
        description: "Download your file or copy the generated text.",
    },
];

const relatedTools = [
    { id: "download-video", label: "Download Video", description: "Save videos to your device" },
    { id: "extract-audio", label: "Extract Audio", description: "Get audio from any video" },
    { id: "transcribe", label: "Transcribe", description: "Convert speech to text" },
    { id: "summarize", label: "Summarize", description: "Get quick video summaries" },
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

export default function HomePageSections() {
    const faqJsonLd = generateFaqJsonLd(faqs);

    return (
        <>
            {/* FAQ Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Top row: Supported Platforms + Common Use Cases */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Supported Platforms Card */}
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Supported Platforms
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            Works with public videos from popular platforms:
                        </p>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                            {platforms.map((platform) => (
                                <li key={platform} className="text-sm text-gray-700 dark:text-gray-200">
                                    • {platform}
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Support depends on public availability and platform changes.
                        </p>
                    </div>

                    {/* Common Use Cases Card */}
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Common Use Cases
                        </h2>
                        <ul className="space-y-1">
                            {useCases.map((useCase) => (
                                <li key={useCase} className="text-sm text-gray-600 dark:text-gray-300">
                                    • {useCase}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* How It Works Card */}
                <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        How It Works
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {steps.map((step) => (
                            <div key={step.number} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {step.number}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Tools Card */}
                <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Related Tools
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {relatedTools.map((tool) => (
                            <a
                                key={tool.id}
                                href={`#${tool.id}`}
                                className="block p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                            >
                                <span className="font-medium text-gray-900 dark:text-white text-sm block">
                                    {tool.label}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {tool.description}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* FAQs Card */}
                <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        FAQs
                    </h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                    {faq.question}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
