import React from "react";

export default function PurpleButton({
  type,
  className,
  onClick,
  children,
  disabled
}: {
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`hover:bg-[#6875F5] text-white px-5 py-3 rounded-lg font-bold md:w-auto w-full flex items-center justify-center ${disabled ? "cursor-not-allowed bg-[#6875F5]" : "cursor-pointer bg-[#5145CD]"} ${className}`}
    >
      {children}
    </button>
  );
}
