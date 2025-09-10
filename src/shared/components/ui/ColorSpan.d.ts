interface ColorProps {
  index: number;
  color: string;
  removeColor: (index: number) => void;
}
export default function ColorSpan({
  index,
  color,
  removeColor,
}: ColorProps): import('react/jsx-runtime').JSX.Element;
export {};
