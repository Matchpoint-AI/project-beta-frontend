interface FileInputProps {
    accept: string;
    required: boolean;
    error: boolean;
    onChange?: (file: File) => void;
}
declare const FileInput: ({ accept, required, error, onChange }: FileInputProps) => import("react/jsx-runtime").JSX.Element;
export default FileInput;
