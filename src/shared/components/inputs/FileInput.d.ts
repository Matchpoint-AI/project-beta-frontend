interface FileInputProps {
    accept: string;
    required: boolean;
    error: boolean;
    onChange?: (file: File) => void;
}
declare const FileInput: ({ accept, required, error, onChange }: FileInputProps) => any;
export default FileInput;
