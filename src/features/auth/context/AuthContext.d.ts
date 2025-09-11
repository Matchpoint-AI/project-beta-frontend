import React from 'react';
interface Profile {
    id: string;
    email: string;
    name: string;
    role: string;
    token?: string;
    plan?: string;
    is_admin?: boolean;
    hasBrand?: boolean;
}
interface AuthContextType {
    profile: Profile;
    setProfile: (profile: Profile | null) => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    login: (token: string, email: string, remember: boolean, id: string, name: string, plan?: string, role?: string, is_admin?: boolean, hasBrand?: boolean) => void;
}
export declare const AuthContext: React.Context<AuthContextType | undefined>;
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
