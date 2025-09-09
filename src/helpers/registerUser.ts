import { getServiceURL } from './getServiceURL';
import posthog from '../helpers/posthog';

export default async function registerUser(email: string, name: string, password: string) {
  const endpointUrl = getServiceURL('data');
  const url = `${endpointUrl}/api/v1/user/register`;
  const user_profile = {
    email,
    name,
    password,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user_profile),
  });
  if (!response.ok) {
    const data = await response.json();
    throw data.detail;
  }
  const data = await response.json();
  if (posthog.__loaded) {
    posthog.capture('User Signed Up', {
      distinct_id: data.id, // Replace with actual user ID
      email: data.email, // Replace with actual user email
    });
  }
  return data;
}
