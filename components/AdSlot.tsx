"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
    slotId: string;
    /** 'auto' for responsive, 'rectangle' for fixed box, 'vertical' etc */
    format?. : "auto" | "rectangle" | "vertical" | "horizontal";
minHeight ?: number;
enabled ?: boolean;
className ?: string;
}

export default function AdSlot({
    slotId,
    format = "auto",
    minHeight = 250, // Default typical ad height
    enabled = true,
    className = "",
}: AdSlotProps) {
    const isDev = process.env.NODE_ENV !== "production";
    const initializedRef = useRef(false);

    useEffect(() => {
        // Guard: Only initialize in production and if enabled
        if (isDev || !enabled) return;

        // Guard: Prevent double-push for this specific instance
        if (initializedRef.current) return;

        try {
            if (typeof window !== "undefined") {
                (window as any).adsbygoogle = (window as any).adsbygoogle || [];
                (window as any).adsbygoogle.push({});
                initializedRef.current = true;
            }
        } catch (err) {
            console.error("[AdSlot] Failed to push ad:", err);
        }
    }, [enabled, isDev]);

    // Container style to prevent CLS (Cumulative Layout Shift)
    const containerStyle = {
        minHeight: `${minHeight}px`,
        display: enabled ? "block" : "none", // Hide if disabled, but keep DOM node if needed? Or just null? 
        // User asked: "If enabled === false -> render an empty div with fixed minHeight (to preserve layout)"
        // But also said "always visible when NOT processing".
        // Let's interpret: If disabled, we still reserve space? 
        // Instructions check: "If enabled === false -> render an empty div with fixed minHeight"
    };

    if (!enabled) {
        return (
            <div
                className={`w-full bg-transparent ${className}`}
                style={{ minHeight: `${minHeight}px` }}
                aria-hidden="true"
            />
        );
    }

    if (isDev) {
        return (
            <div
                className={`w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 text-xs ${className}`}
                style={{ minHeight: `${minHeight}px` }}
            >
                <span className="font-mono font-semibold mb-1">DEV MODE: AD SLOT</span>
                <span>ID: {slotId}</span>
                <span>Format: {format}</span>
            </div>
        );
    }

    return (
        <div className={`w-full overflow-hidden ${className}`} style={{ minHeight: `${minHeight}px` }}>
            <ins
                className="adsbygoogle"
                style={{ display: "block", minHeight: `${minHeight}px` }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Placeholder, user to replace
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
}
