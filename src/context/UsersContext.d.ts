import React from 'react';
type User = {
    id: string;
    name: string;
    email: string;
    business: string;
    plan: string;
    totalCampaigns: number;
    created_at: number;
};
type UsersContextType = {
    users: User[];
    total: number;
    error: string;
    handleNextPage: () => void;
};
export declare const UsersContext: React.Context<UsersContextType>;
export declare function UsersContextProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const useUsers: () => UsersContextType;
export {};
