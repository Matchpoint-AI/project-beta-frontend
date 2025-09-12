import { getServiceURL } from '../helpers/getServiceURL';
import axios from 'axios';
import useApi from './useApi';

const API_URL = getServiceURL('data');
const _axios = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

type TApp = 'instagram' | 'facebook';

type TAction =
  | { type: 'AUTHORIZE'; payload: TApp }
  | { type: 'FETCH_DATA'; payload: TApp | 'integrations' }
  | { type: 'REVOKE_AUTH'; payload: TApp }
  | { type: 'AVAILABLE'; payload?: TApp | 'integrations' }
  | { type: 'USER'; payload: TApp };

export default function useIntegrationApi(action: TAction, manual?: 'TRIGGER') {
  return useApi(integrationApi, action, manual);
}

export async function integrationApi(action: { type: unknown; [key: string]: unknown }, token?: string) {
  const { type, payload: app } = action;

  if (!token) {
    throw new Error('No authentication token available');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let response;
  switch (type) {
    case 'AUTHORIZE':
      response = await _axios.get(`/${app}`, config);
      break;
    case 'FETCH_DATA':
      response = await _axios.get(`/${app}/data`, config);
      break;
    case 'REVOKE_AUTH':
      response = await _axios.delete(`/${app}`, config);
      break;
    case 'AVAILABLE':
      response = await _axios.get(`/integrations`, config);
      break;
    case 'USER':
      response = await _axios.get(`/${app}/me`, config);
      break;
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
  return response.data;
}

export function authenticateApp(app: TApp): TAction {
  return { type: 'AUTHORIZE', payload: app };
}

export function fetcheDataApp(app: TApp): TAction {
  return { type: 'FETCH_DATA', payload: app };
}

export function revokeAuthApp(app: TApp): TAction {
  return { type: 'REVOKE_AUTH', payload: app };
}

export function getAvailableIntegrations(): TAction {
  return { type: 'AVAILABLE' };
}

export function getAppUser(app: TApp): TAction {
  return { type: 'USER', payload: app };
}
