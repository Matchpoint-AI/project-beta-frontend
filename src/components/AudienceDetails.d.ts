interface AudienceEmotionsProps {
  values: string[];
  setValues: (values: string[]) => void;
  title: string;
  description?: string;
  genre: 'emotion' | 'interests';
}
export default function AudienceDetails(
  props: AudienceEmotionsProps
): import('react/jsx-runtime').JSX.Element;
export {};
