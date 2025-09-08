/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ApproveButtonProps {
  onClick: (e?: any) => void;
  checked?: boolean;
}

const ApproveButton: React.FC<ApproveButtonProps> = ({
  onClick,
  checked = false,
}) => {
  return (
    <button
      type="button"
      className={`h-12 px-5 py-2.5 gap-2 text-sm font-medium text-[#111928] ${
        checked ? "bg-[#84E1BC]" : "bg-[#31C48D] hover:bg-[#84E1BC]"
      } focus:ring-4 focus:outline-none rounded-lg text-center capitalize`}
      onClick={onClick}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.024 3.17567C10.1364 3.28819 10.1996 3.44077 10.1996 3.59987C10.1996 3.75897 10.1364 3.91156 10.024 4.02407L5.22396 8.82407C5.11144 8.93655 4.95885 8.99974 4.79976 8.99974C4.64066 8.99974 4.48807 8.93655 4.37556 8.82407L1.97556 6.42407C1.86626 6.31091 1.80578 6.15935 1.80715 6.00203C1.80852 5.84471 1.87162 5.69423 1.98286 5.58298C2.09411 5.47174 2.2446 5.40863 2.40192 5.40727C2.55923 5.4059 2.71079 5.46638 2.82396 5.57567L4.79976 7.55147L9.17556 3.17567C9.28807 3.06319 9.44066 3 9.59976 3C9.75885 3 9.91144 3.06319 10.024 3.17567Z"
            fill="#014737"
          />
        </svg>
      )}
      Approve
    </button>
  );
};

export default ApproveButton;
