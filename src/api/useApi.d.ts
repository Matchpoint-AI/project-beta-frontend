export default function useApi<T = unknown>(apiHandler: (action: {
    type: unknown;
    [key: string]: unknown;
}, token: string) => Promise<T>, action: {
    type: unknown;
    [key: string]: unknown;
}, manual?: 'TRIGGER'): any;
