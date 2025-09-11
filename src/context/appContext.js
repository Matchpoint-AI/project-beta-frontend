import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import useIntegrationApi, { getAvailableIntegrations } from '../api/api-integrations';
export var CAppContext = createContext({
    integrations: {
        data: null,
        error: null,
        loading: false,
        triggerRequest: function () { },
    },
});
export function AppProvider(_a) {
    var children = _a.children;
    var integrations = useIntegrationApi(getAvailableIntegrations());
    return _jsx(CAppContext.Provider, { value: { integrations: integrations }, children: children });
}
export default function useAppContext() {
    var context = useContext(CAppContext);
    if (!context) {
        throw new Error('useAppProvider must be used wtithin a Provider');
    }
    return context;
}
//# sourceMappingURL=appContext.js.map