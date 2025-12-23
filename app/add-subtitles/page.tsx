import { Metadata } from "next";
import Header from "components/Header";
import Tool from "components/Tool";
import FeaturePageContent from "components/FeaturePageContent";

export const metadata: Metadata = {
    title: "Add Subtitles to Video Online - VidTool",
    description:
        "Generate subtitles for any video automatically. Add captions to YouTube, TikTok, Instagram videos and download subtitle files.",
};

const steps = [
    {
        number: 1,
        title: "Paste the video URL",
        description: "Copy the video link from any supported platform and paste it above.",
    },
    {
        number: 2,
        title: "Click Add Subtitles",
        description: "Select the Add Subtitles button to generate captions automatically.",
    },
    {
        number: 3,
        title: "Download subtitle files",
        description: "Download the generated subtitle files in SRT or VTT format.",
    },
];

const faqs = [
    {
        question: "What subtitle formats are provided?",
        answer: "Subtitles are generated in both SRT and VTT formats, compatible with most video players and platforms.",
    },
    {
        question: "Are subtitles auto-generated?",
        answer: "Yes, subtitles are generated automatically using speech recognition. Manual editing may be needed for perfect accuracy.",
    },
    {
        question: "Can I use these subtitles on YouTube?",
        answer: "Yes, the SRT format is compatible with YouTube's subtitle upload feature.",
    },
    {
        question: "Do subtitles include timing?",
        answer: "Yes, all generated subtitles include precise timing information synchronized with the video.",
    },
    {
        question: "What languages are supported?",
        answer: "Subtitle generation works best with English. Other languages may have varying accuracy.",
    },
];

export default function AddSubtitlesPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />
            <Tool defaultAction="subtitles" />
            <FeaturePageContent
                title="Add Subtitles to Video Online"
                description="Automatically generate subtitles for any video. Create SRT and VTT caption files from YouTube, TikTok, Instagram, and other platforms."
                steps={steps}
                faqs={faqs}
                currentPath="/add-subtitles"
            />
        </div>
    );
}
