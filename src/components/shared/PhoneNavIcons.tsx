import React from "react";

export default function PhoneNavIcons({
   currentStep,
}: {
   currentStep: number;
}) {
   return (
      <div className="flex justify-between items-center gap-2">
         <img
            src={
               currentStep >= 1 ? `briefcase_active.svg` : `briefcase_gray.svg`
            }
            alt="briefcase"
            width={25}
            height={25}
         />
         <div
            className="h-[3px] w-1/5"
            style={{
               backgroundColor: `${currentStep >= 2 ? "#5145CD" : "#7c8092"}`,
            }}
         />
         <img
            src={currentStep >= 2 ? `palette_active.svg` : `palette_gray.svg`}
            alt="palette"
            width={25}
            height={25}
         />
         <div
            className="h-[3px] w-1/5"
            style={{
               backgroundColor: `${currentStep >= 3 ? "#5145CD" : "#7c8092"}`,
            }}
         />
         <img
            src={
               currentStep >= 3 ? `clipboard_active.svg` : `clipboard_gray.svg`
            }
            alt="clipboard"
            width={25}
            height={25}
         />
         <div
            className="h-[3px] w-1/5"
            style={{
               backgroundColor: `${currentStep >= 4 ? "#5145CD" : "#7c8092"}`,
            }}
         />
         <img
            src={currentStep >= 4 ? `calendar_active.svg` : `calendar_gray.svg`}
            alt="calendar"
            width={25}
            height={25}
         />
      </div>
   );
}
