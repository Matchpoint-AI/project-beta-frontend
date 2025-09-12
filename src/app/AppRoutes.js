import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Signup from '../features/auth/pages/Signup';
import Onboard from '../pages/Onboard';
import Campaign from '../features/campaign/pages/Campaign';
import Dashboard from '../features/dashboard/pages/Dashboard';
import CampaignContent from '../features/campaign/pages/CampaignContent';
import NewCampaigns from '../features/campaign/pages/NewCampaigns';
import DisplayContent from '../pages/DisplayContent';
import PromptsSettings from '../pages/PromptSettings';
import { useAuth } from '../features/auth/context/AuthContext';
import LandingPage from '../pages/LandingPage';
import AuthActions from '../features/auth/pages/AuthActions';
import settings from '../components/shared/settings';
import ManageUsers from '../pages/ManageUsers';
import UserDataPage from '../pages/UserDataPage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import { ABTestDemo } from '../features/campaign';
export default function AppRoutes() {
    var profile = useAuth().profile;
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/signup", element: _jsx(Signup, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/landing", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/onboard", element: _jsx(Onboard, {}) }), _jsx(Route, { path: "/privacy", element: _jsx(PrivacyPolicy, {}) }), _jsx(Route, { path: "/campaign", element: _jsx(Campaign, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/auth/action", element: _jsx(AuthActions, {}) }), _jsxs(Route, { path: "/profile", element: _jsx(settings.Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(settings.Profile, {}) }), _jsx(Route, { path: "integrations", element: _jsx(settings.Integrations, {}) })] }), _jsx(Route, { path: "/campaign/content/:id", element: _jsx(CampaignContent, {}) }), _jsx(Route, { path: "/campaign/new", element: _jsx(NewCampaigns, {}) }), _jsx(Route, { path: "/content", element: _jsx(DisplayContent, {}) }), _jsx(Route, { path: "/demo/abtest", element: _jsx(ABTestDemo, {}) }), profile && profile.role === 'ADMIN' && (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/admin/prompts", element: _jsx(PromptsSettings, {}) }), _jsx(Route, { path: "/admin/users", element: _jsx(ManageUsers, {}) }), _jsx(Route, { path: "/admin/users/:id", element: _jsx(UserDataPage, {}) })] })), _jsx(Route, { path: "*", element: _jsx("h1", { children: "Not Found" }) })] }));
}
//# sourceMappingURL=AppRoutes.js.map