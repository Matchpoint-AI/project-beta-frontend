import React from 'react';
interface FormErrorState {
  count: number;
  error: boolean;
}
interface BusinessFormInputProps {
  subject: 'name' | 'website';
  title: string;
  description?: string;
  placeholder: string;
  type: 'text' | 'link';
  validateInput: (value: string) => boolean;
  runValidation: number;
  setFormError: React.Dispatch<React.SetStateAction<FormErrorState>>;
}
export default function BusinessFormInput(
  props: BusinessFormInputProps
): import('react/jsx-runtime').JSX.Element;
export {};
