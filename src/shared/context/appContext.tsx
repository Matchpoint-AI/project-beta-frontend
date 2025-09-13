import React, { createContext, useContext } from 'react';
import useIntegrationApi, { getAvailableIntegrations } from '../../api/api-integrations';

type TAppContext = {
  integrations: {
    data: unknown;
    loading: boolean;
    error: string | null;
    triggerRequest: () => void;
  };
};

export const CAppContext = createContext<TAppContext>({
  integrations: {
    data: null,
    error: null,
    loading: false,
    triggerRequest: () => {},
  },
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const integrations = useIntegrationApi(getAvailableIntegrations());

  return <CAppContext.Provider value={{ integrations }}>{children}</CAppContext.Provider>;
}

export default function useAppContext() {
  const context = useContext(CAppContext);
  if (!context) {
    throw new Error('useAppProvider must be used wtithin a Provider');
  }
  return context;
}
