interface ColorProps {
    index: number;
    color: string;
    removeColor: (index: number) => void;
}
export default function ColorSpan({ index, color, removeColor }: ColorProps): any;
export {};
