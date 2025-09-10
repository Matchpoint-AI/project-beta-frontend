import React from 'react';

interface ApprovePopupProps {
  onClose: () => void;
}

const ApprovePopup: React.FC<ApprovePopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center  justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col justify-center items-center gap-3 w-[500px] h-[250px]">
        <div className="flex flex-col justify-center items-center gap-0">
          <div className="flex flex-col justify-center items-center gap-4">
            <p className="text-xl leading-8 font-normal text-gray-900">
              Excited to get your content out there? We are too, but first you’ll need to approve at
              least one piece of content for download. Go for it!
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="text-gray-500 px-4 py-2 rounded underline text-sm font-normal leading-[21px] text-center decoration-solid decoration-underline [text-underline-position:from-font] [text-decoration-skip-ink:none] font-inter"
                onClick={() => onClose()}
              >
                Back to Content Library
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovePopup;
