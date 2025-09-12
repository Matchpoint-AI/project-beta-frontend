import React from 'react';
interface StepProps {
    title: string;
    icon: string;
    step: number;
    currentStep: number;
    setStep: (step: number) => void;
}
declare const StepComponent: React.FC<StepProps>;
export default StepComponent;
