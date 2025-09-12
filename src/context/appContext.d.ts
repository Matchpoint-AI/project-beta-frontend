import React from 'react';
type TAppContext = {
    integrations: {
        data: unknown;
        loading: boolean;
        error: string | null;
        triggerRequest: () => void;
    };
};
export declare const CAppContext: React.Context<TAppContext>;
export declare function AppProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export default function useAppContext(): TAppContext;
export {};
