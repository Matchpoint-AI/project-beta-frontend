type TApp = 'instagram' | 'facebook';
type TAction = {
    type: 'AUTHORIZE';
    payload: TApp;
} | {
    type: 'FETCH_DATA';
    payload: TApp | 'integrations';
} | {
    type: 'REVOKE_AUTH';
    payload: TApp;
} | {
    type: 'AVAILABLE';
    payload?: TApp | 'integrations';
} | {
    type: 'USER';
    payload: TApp;
};
export default function useIntegrationApi(action: TAction, manual?: 'TRIGGER'): {
    triggerRequest: () => Promise<void>;
    data: any;
    loading: boolean;
    error: string | null;
};
export declare function integrationApi(action: TAction, token?: string): Promise<any>;
export declare function authenticateApp(app: TApp): TAction;
export declare function fetcheDataApp(app: TApp): TAction;
export declare function revokeAuthApp(app: TApp): TAction;
export declare function getAvailableIntegrations(): TAction;
export declare function getAppUser(app: TApp): TAction;
export {};
