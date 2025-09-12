import { Prompt } from '../../../pages/PromptSettings';
interface PromptEditorProps {
    promptsArr: Prompt[];
    placeholders: string[];
    target: 'content_generation' | 'scrape_website';
    switchPrompts: (version: number, target: 'content_generation' | 'scrape_website') => void;
    addPrompts: (prompt: string, target: 'content_generation' | 'scrape_website') => void;
}
export default function PromptEditor({ promptsArr, placeholders, target, switchPrompts, addPrompts, }: PromptEditorProps): any;
export {};
