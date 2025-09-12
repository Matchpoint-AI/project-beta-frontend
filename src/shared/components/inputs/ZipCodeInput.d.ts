import React from 'react';
interface ZipCodeInputProps {
    currentValues: string[] | undefined;
    setCurrentValues: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}
declare const ZipCodeInput: ({ currentValues, setCurrentValues }: ZipCodeInputProps) => import("react/jsx-runtime").JSX.Element;
export default ZipCodeInput;
