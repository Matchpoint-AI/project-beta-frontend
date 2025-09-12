import React, { FC } from 'react';
interface CustomDialogProps {
  setIsOpen: React.Dispatch<React.SetStateAction<number>>;
  isOpen: number;
  onClose: () => void;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setTiming: React.Dispatch<React.SetStateAction<string>>;
  setService: React.Dispatch<React.SetStateAction<string>>;
}
declare const CustomDialog: FC<CustomDialogProps>;
export default CustomDialog;
