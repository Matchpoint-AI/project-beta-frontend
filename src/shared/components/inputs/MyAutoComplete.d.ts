declare const MyAutoComplete: ({ options, currentValues, setCurrentValues, style, }: {
    options: string[];
    currentValues: string[];
    setCurrentValues: (newValue: string[]) => void;
    style?: boolean;
}) => any;
export default MyAutoComplete;
