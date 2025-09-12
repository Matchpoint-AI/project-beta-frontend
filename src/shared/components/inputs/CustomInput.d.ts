import React, { Dispatch } from 'react';
interface CustomInputProps {
    options: string[];
    setOptions: Dispatch<React.SetStateAction<string[]>>;
    limit: number;
}
declare const CustomInput: ({ options, setOptions, limit }: CustomInputProps) => any;
export default CustomInput;
