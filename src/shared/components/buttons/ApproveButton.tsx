// ApproveButton.tsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface ApproveButtonProps {
  double: boolean;
  handleApproveAll: () => void;
  loading: boolean;
}

const ApproveButton: React.FC<ApproveButtonProps> = ({ double, handleApproveAll, loading }) => (
  <button
    disabled={double || loading}
    onClick={handleApproveAll}
    className={`p-[10px] w-28 rounded-lg justify-center items-center gap-2 inline-flex ${
      loading ? 'bg-gray-500' : 'bg-indigo-700'
    } hover:cursor-pointer`}
  >
    {loading ? (
      <CircularProgress size={20} sx={{ color: '#ffffff' }} />
    ) : (
      <span className="text-white text-sm font-medium">Approve All</span>
    )}
  </button>
);

export default ApproveButton;
