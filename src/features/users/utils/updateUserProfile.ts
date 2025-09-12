import { getServiceURL } from '../../../helpers/getServiceURL';

type ProfileUpdate = {
  email: string;
  name: string;
};

export default async function updateUserProfile(
  token: string,
  name: string,
  email: string,
  password: string
) {
  const endpointUrl = `${getServiceURL('data')}/api/v1/user/update`;
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
      password: password || undefined,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail);
  }
  const data = await response.json();
  return data as ProfileUpdate;
}
