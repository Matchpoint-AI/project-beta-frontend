import React from 'react';
interface LoadingStep {
  label: string;
  loading: boolean;
  complete: boolean;
}
interface LoadingModalProps {
  steps: LoadingStep[];
  isOpen: boolean;
}
declare const LoadingModal: React.FC<LoadingModalProps>;
export default LoadingModal;
