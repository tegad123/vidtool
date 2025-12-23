import { Metadata } from "next";
import Header from "components/Header";
import Tool from "components/Tool";
import FeaturePageContent from "components/FeaturePageContent";

export const metadata: Metadata = {
    title: "Download Video Online - VidTool",
    description:
        "Download videos from YouTube, TikTok, Instagram, Twitter, Facebook, and Vimeo. Free online video downloader with no registration required.",
};

const steps = [
    {
        number: 1,
        title: "Paste the URL",
        description: "Copy the video link from any supported platform and paste it into the input field above.",
    },
    {
        number: 2,
        title: "Click Download",
        description: "Select the Download Video button to start processing your request.",
    },
    {
        number: 3,
        title: "Save the file",
        description: "Once processing completes, click the download link to save the video to your device.",
    },
];

const faqs = [
    {
        question: "What video platforms are supported?",
        answer: "VidTool supports YouTube, TikTok, Instagram, Twitter/X, Facebook, and Vimeo. We detect the platform automatically when you paste a link.",
    },
    {
        question: "Is there a file size limit?",
        answer: "There is no strict file size limit, but very long videos may take longer to process. Most videos under 30 minutes process quickly.",
    },
    {
        question: "What video quality is available?",
        answer: "We download the highest quality version available from the source. The exact resolution depends on what the original platform provides.",
    },
    {
        question: "Do I need to create an account?",
        answer: "No account or registration is required. Simply paste a link and download.",
    },
];

export default function DownloadVideoPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Header />
            <Tool defaultAction="download" />
            <FeaturePageContent
                title="Download Video Online"
                description="Save videos from YouTube, TikTok, Instagram, Twitter, Facebook, and Vimeo directly to your device. No software installation required—just paste a link and download."
                steps={steps}
                faqs={faqs}
                currentPath="/download-video"
            />
        </div>
    );
}
