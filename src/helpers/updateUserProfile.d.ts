type ProfileUpdate = {
  email: string;
  name: string;
};
export default function updateUserProfile(
  token: string,
  name: string,
  email: string,
  password: string
): Promise<ProfileUpdate>;
export {};
