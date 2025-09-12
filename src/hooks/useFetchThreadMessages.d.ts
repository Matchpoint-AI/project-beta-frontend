export type Messages = {
    thread_id: string;
    messages: string[];
};
export default function useFetchThreadMessages(): readonly [any, any, any, (thread_id: string) => Promise<void>, (prompt: string) => void, () => void];
