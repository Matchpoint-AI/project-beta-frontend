export default function ResetPromptBtn({ version, token, target, switchPrompts, }: {
    version: number;
    token: string;
    target: 'content_generation' | 'scrape_website';
    switchPrompts: (version: number, target: 'content_generation' | 'scrape_website') => void;
}): any;
