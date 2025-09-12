interface FormInputProps {
    saveInput: (key: 'name' | 'website', value: string) => void;
    subject: 'name' | 'website';
    initValue?: string;
    validateInput: (input: string) => boolean;
    parentError: boolean;
}
export default function FormInput({ saveInput, subject, initValue, validateInput, parentError, }: FormInputProps): any;
export {};
