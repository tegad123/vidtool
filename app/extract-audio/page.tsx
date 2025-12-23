import { Metadata } from "next";
import Header from "components/Header";
import Tool from "components/Tool";
import FeaturePageContent from "components/FeaturePageContent";

export const metadata: Metadata = {
    title: "Extract Audio from Video Online - VidTool",
    description:
        "Extract audio from YouTube, TikTok, Instagram, and other videos. Convert video to MP3 online without software installation.",
};

const steps = [
    {
        number: 1,
        title: "Paste the video URL",
        description: "Copy the video link from any supported platform and paste it into the input field.",
    },
    {
        number: 2,
        title: "Click Extract Audio",
        description: "Select the Extract Audio button to begin extracting the audio track.",
    },
    {
        number: 3,
        title: "Download the audio",
        description: "Once complete, download the extracted audio file to your device.",
    },
];

const faqs = [
    {
        question: "What audio format is extracted?",
        answer: "Audio is extracted in MP3 format for maximum compatibility across devices and players.",
    },
    {
        question: "Is the audio quality preserved?",
        answer: "We extract audio at the highest quality available from the source video. Quality depends on the original upload.",
    },
    {
        question: "Can I extract audio from long videos?",
        answer: "Yes, but longer videos take more time to process. Videos over an hour may require patience.",
    },
    {
        question: "Does this work with music videos?",
        answer: "Yes, you can extract audio from any video including music videos, podcasts, interviews, and more.",
    },
];

export default function ExtractAudioPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />
            <Tool defaultAction="audio" />
            <FeaturePageContent
                title="Extract Audio from Video Online"
                description="Convert any video to audio. Extract the audio track from YouTube, TikTok, Instagram, and other platforms without installing software."
                steps={steps}
                faqs={faqs}
                currentPath="/extract-audio"
            />
        </div>
    );
}
