type TApp = 'instagram' | 'facebook';
type TAction =
  | {
      type: 'AUTHORIZE';
      payload: TApp;
    }
  | {
      type: 'FETCH_DATA';
      payload: TApp | 'integrations';
    }
  | {
      type: 'REVOKE_AUTH';
      payload: TApp;
    }
  | {
      type: 'AVAILABLE';
      payload?: TApp | 'integrations';
    }
  | {
      type: 'USER';
      payload: TApp;
    };

export interface IntegrationData {
  id: string;
  app: TApp;
  status: 'connected' | 'disconnected';
  user?: {
    id: string;
    name: string;
    email?: string;
  };
  data?: Record<string, unknown>;
}

export interface IntegrationResponse {
  success: boolean;
  data?: IntegrationData | IntegrationData[];
  error?: string;
}

export default function useIntegrationApi(
  action: TAction,
  manual?: 'TRIGGER'
): {
  triggerRequest: () => Promise<void>;
  data: IntegrationData | IntegrationData[] | null;
  loading: boolean;
  error: string | null;
};
export declare function integrationApi(
  action: TAction,
  token?: string
): Promise<IntegrationResponse>;
export declare function authenticateApp(app: TApp): TAction;
export declare function fetcheDataApp(app: TApp): TAction;
export declare function revokeAuthApp(app: TApp): TAction;
export declare function getAvailableIntegrations(): TAction;
export declare function getAppUser(app: TApp): TAction;
export {};
