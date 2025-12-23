import { Metadata } from "next";
import Header from "components/Header";
import Tool from "components/Tool";
import FeaturePageContent from "components/FeaturePageContent";

export const metadata: Metadata = {
    title: "Summarize Video Online - VidTool",
    description:
        "Get AI-powered video summaries instantly. Summarize YouTube, TikTok, and other videos to key points without watching the full content.",
};

const steps = [
    {
        number: 1,
        title: "Paste the video URL",
        description: "Copy the video link and paste it into the input field above.",
    },
    {
        number: 2,
        title: "Click Summarize",
        description: "Select the Summarize button to generate a summary of the video content.",
    },
    {
        number: 3,
        title: "Read the summary",
        description: "Review the key points and main takeaways from the video.",
    },
];

const faqs = [
    {
        question: "How long are the summaries?",
        answer: "Summaries are typically 2-4 paragraphs covering the main points, scaled to the video length.",
    },
    {
        question: "Does it work with all video types?",
        answer: "Summaries work best with spoken content like tutorials, lectures, podcasts, and news. Music videos produce minimal summaries.",
    },
    {
        question: "How accurate are the summaries?",
        answer: "Summaries capture key points but should not replace watching important content. Use them for quick overviews.",
    },
    {
        question: "Can I summarize long videos?",
        answer: "Yes, longer videos just take more processing time. The summary length scales with content complexity.",
    },
];

export default function SummarizeVideoPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />
            <Tool defaultAction="summarize" />
            <FeaturePageContent
                title="Summarize Video Online"
                description="Get a quick summary of any video without watching the full content. Extract key points from YouTube, TikTok, Instagram, and other platforms."
                steps={steps}
                faqs={faqs}
                currentPath="/summarize-video"
            />
        </div>
    );
}
