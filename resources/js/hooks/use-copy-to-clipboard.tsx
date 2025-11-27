import { useCallback, useState } from "react";

export const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false);
    const copy = useCallback(async (text: string) => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
                return;
            } catch (e) {
                console.warn("Clipboard API failed → fallback will run", e);
            }
        }
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();

            const success = document.execCommand("copy");
            document.body.removeChild(textarea);

            if (!success) throw new Error("execCommand failed");

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (e) {
            console.warn("Fallback copy failed", e);
            setIsCopied(false);
        }
    }, []);

    return [copy, isCopied] as const;
};
