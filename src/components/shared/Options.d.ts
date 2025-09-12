import React from 'react';
interface OptionsProps {
    edit: boolean | string;
    setEdit: React.Dispatch<React.SetStateAction<boolean | string>>;
    regenerateImage: () => Promise<void>;
}
declare const Options: ({ edit, setEdit, regenerateImage }: OptionsProps) => import("react/jsx-runtime").JSX.Element;
export default Options;
