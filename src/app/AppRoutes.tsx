import React from 'react';
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
  const { profile } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/onboard" element={<Onboard />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/campaign" element={<Campaign />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/auth/action" element={<AuthActions />} />
      <Route path="/profile" element={<settings.Layout />}>
        <Route index element={<settings.Profile />} />
        <Route path="integrations" element={<settings.Integrations />} />
      </Route>
      <Route path="/campaign/content/:id" element={<CampaignContent />} />
      <Route path="/campaign/new" element={<NewCampaigns />} />
      <Route path="/content" element={<DisplayContent />} />
      <Route path="/demo/abtest" element={<ABTestDemo />} />
      {profile && profile.role === 'ADMIN' && (
        <>
          <Route path="/admin/prompts" element={<PromptsSettings />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/users/:id" element={<UserDataPage />} />
        </>
      )}
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}
