export type Messages = {
    thread_id: string;
    messages: string[];
};
export default function useFetchThreadMessages(): readonly [Messages | null, boolean, import("react").Dispatch<import("react").SetStateAction<boolean>>, (thread_id: string) => Promise<void>, (prompt: string) => void, () => void];
