import React from 'react';
interface EditProfileInputProps {
    type: 'text' | 'email' | 'password';
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    validateInput: (value: string) => boolean | null;
    placeholder: string;
    subject: 'name' | 'email' | 'password';
}
export default function EditProfileInput(props: EditProfileInputProps): any;
export {};
