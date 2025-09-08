import React from "react";

interface DropdownProps {
   open: boolean;
   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
   className?: string;
   options: string[];
   currentValue?: string;
   onUpdateContext: (option: string, index: number) => void; // Callback function to update context
   // type?: "purpose" | "options";
}

const Dropdown: React.FC<DropdownProps> = ({
   open,
   setOpen,
   options,
   currentValue,
   onUpdateContext,
   className,
}: DropdownProps) => {

   // useEffect(() => {
   //   onUpdateContext(options[0]);
   // }, []);
   const handleOptionClick = (option: string, index: number) => {
      // setSelectedOption(option);
      setOpen(false);
      // purpose? setCampaignInfo({ ...campaignInfo, purpose: "Awareness / Excitement about " + option }) : setCampaignInfo({ ...campaignInfo, product: option });
      onUpdateContext(option, index);
   };

   // useEffect(() => {
   //   if (type === "options") {
   //     // setSelectedOption(options[0]);
   //   }
   // }, [options]);

   return (
      <div className={`relative inline-block text-left ${className ?? ""}`}>
         <div className="flex justify-between">
            <button
               type="button"
               className="inline-flex w-full justify-between items-center rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
               id="options-menu"
               aria-haspopup="true"
               aria-expanded="true"
               onClick={() => setOpen(!open)}>
               <span className="capitalize">{currentValue}</span>
               <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true">
                  <path
                     fillRule="evenodd"
                     d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L5.293 8.707a1 1 0 010-1.414z"
                     clipRule="evenodd"
                  />
               </svg>
            </button>
         </div>

         {open && (
            <div className="origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999]">
               <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu">
                  {options.map((option, index) => (
                     <div
                        key={index}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                        role="menuitem"
                        onClick={() => {
                           handleOptionClick(option, index);
                           setOpen(false);
                        }}>
                        {option}
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default Dropdown;
