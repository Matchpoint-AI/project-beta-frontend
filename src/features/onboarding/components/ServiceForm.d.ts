import React from 'react';
interface ServiceFormProps {
    handleNext?: any;
    handleBack?: any;
    review?: boolean;
    setService: React.Dispatch<React.SetStateAction<string>>;
}
declare const ServiceForm: ({ handleNext, handleBack, review, setService }: ServiceFormProps) => any;
export default ServiceForm;
