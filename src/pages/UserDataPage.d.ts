export type Post = {
  text: string;
  image_prompt: string;
  images: string[];
  posted: boolean;
};
export type Messages = {
  thread_id: string;
  messages: string[];
};
export default function UserDataPage(): import('react/jsx-runtime').JSX.Element;
