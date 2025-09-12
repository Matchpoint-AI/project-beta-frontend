import React from 'react';
interface Props {
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    open: boolean;
    onClose?: () => void;
}
declare const CampaignSetupCompleteDialog: React.FC<Props>;
export default CampaignSetupCompleteDialog;
