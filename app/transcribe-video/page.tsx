import { Metadata } from "next";
import Header from "components/Header";
import Tool from "components/Tool";
import FeaturePageContent from "components/FeaturePageContent";

export const metadata: Metadata = {
    title: "Transcribe Video to Text Online (Free) - VidTool",
    description:
        "Transcribe videos from YouTube, TikTok, Instagram and more into accurate text. Paste a link, choose Transcribe, and download your transcript in seconds.",
};

const steps = [
    {
        number: 1,
        title: "Paste a public video link",
        description: "Copy the video URL from any supported platform and paste it into the input field.",
    },
    {
        number: 2,
        title: 'Select "Transcribe"',
        description: "Click the Transcribe button to start converting the video's audio to text.",
    },
    {
        number: 3,
        title: "Download the generated text or subtitles",
        description: "Once processing completes, download your transcript as text or subtitle files.",
    },
];

const faqs = [
    {
        question: "Is this free?",
        answer: "Yes, the transcription tool is free to use. No account or payment required.",
    },
    {
        question: "Which platforms are supported?",
        answer: "We support YouTube, TikTok, Instagram, Twitter/X, Facebook, and Vimeo. Just paste any public video link.",
    },
    {
        question: "Does it work on long videos?",
        answer: "Yes, but longer videos take more time to process. Videos under 30 minutes work best for quick results.",
    },
    {
        question: "Is my video stored?",
        answer: "No, we do not store your videos. The content is processed temporarily and discarded after transcription is complete.",
    },
];

export default function TranscribeVideoPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />
            <Tool defaultAction="transcribe" />
            <FeaturePageContent
                title="Transcribe Video to Text Online (Free)"
                description="This tool lets you transcribe videos from popular platforms into accurate text. Paste a video link, choose 'Transcribe', and get a downloadable transcript in seconds."
                steps={steps}
                faqs={faqs}
                currentPath="/transcribe-video"
            />
        </div>
    );
}

