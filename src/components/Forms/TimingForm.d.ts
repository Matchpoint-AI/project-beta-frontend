import React from 'react';
interface TimingFormProps {
    handleNext?: any;
    handleBack?: any;
    setTiming?: React.Dispatch<React.SetStateAction<string>>;
    review?: boolean;
}
declare const TimingForm: ({ handleNext, handleBack, setTiming, review }: TimingFormProps) => any;
export default TimingForm;
