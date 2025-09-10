import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { IoAlertCircle } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
interface ErrorToastProps {
  open: boolean;
  onClose: () => void;
  message: string | React.JSX.Element;
  success?: boolean;
  title?: string;
  buttonText?: string | null;
  onButtonClick?: () => void;
}

export default function ErrorToast({
  open,
  onClose,
  message,
  success = false,
  title = success ? 'Success' : 'Error',
  buttonText = success ? 'Continue' : null,
  onButtonClick,
}: ErrorToastProps) {
  if (!open) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
    }
  };

  const bgColor = success ? 'bg-green-600' : 'bg-purple-600';
  const hoverColor = success ? 'hover:bg-green-700' : 'hover:bg-purple-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-lg">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <MdClose size={20} />
        </button>

        <div className="px-6 pt-6 pb-4 flex justify-center">
          {success ? (
            <FaCheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <IoAlertCircle className="h-12 w-12 text-purple-600" />
          )}
        </div>
        <div className="px-6 pb-6">
          <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-center text-gray-700">{message}</p>
        </div>
        {buttonText ? (
          <div className="px-6 pb-6">
            <button
              className={`w-full rounded-md py-2 px-4 text-white ${bgColor} ${hoverColor} transition-colors`}
              onClick={handleButtonClick}
            >
              {buttonText}
            </button>
          </div>
        ) : null}
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
