import React from 'react';
interface ApproveButtonProps {
    double: boolean;
    handleApproveAll: () => void;
    loading: boolean;
}
declare const ApproveButton: React.FC<ApproveButtonProps>;
export default ApproveButton;
