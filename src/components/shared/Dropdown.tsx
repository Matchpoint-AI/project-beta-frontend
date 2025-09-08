import React, { useEffect, useRef, useState } from "react";

interface DropdownProps {
  className?: string;
  options: string[];
  currentValue?: string;
  onUpdateContext: (option: string, index: number) => void; // Callback function to update context
  // type?: "purpose" | "options";
  dynamic?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  currentValue,
  onUpdateContext,
  className,
  dynamic = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // logic for width to adapt to longest option
  // useEffect(() => {
  //   // Calculate the width of the largest string
  //   if (containerRef.current) {
  //     const tempSpan = document.createElement("span");
  //     tempSpan.style.font = window.getComputedStyle(containerRef.current).font;
  //     tempSpan.style.visibility = "hidden";
  //     tempSpan.style.whiteSpace = "nowrap";
  //     document.body.appendChild(tempSpan);

  //     let maxWidth = 0;
  //     options.forEach((option) => {
  //       tempSpan.textContent = option;
  //       maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
  //     });

  //     setDropdownWidth(maxWidth + 60); // Add some padding
  //     document.body.removeChild(tempSpan);
  //   }
  // }, [options]);

  // logic for width to adapt to chosen option
  // useEffect(() => {
  //   // Calculate the width of the current selected option
  //   if (containerRef.current && currentValue) {
  //     const tempSpan = document.createElement("span");
  //     tempSpan.style.font = window.getComputedStyle(containerRef.current).font;
  //     tempSpan.style.visibility = "hidden";
  //     tempSpan.style.whiteSpace = "nowrap";
  //     document.body.appendChild(tempSpan);

  //     tempSpan.textContent = currentValue;
  //     if (currentValue === "All") {
  //       const calculatedWidth = tempSpan.offsetWidth + 70; // Add padding
  //       setDropdownWidth(calculatedWidth);
  //     } else {
  //       const calculatedWidth = tempSpan.offsetWidth + 60; // Add padding
  //       setDropdownWidth(calculatedWidth);
  //     }

  //     document.body.removeChild(tempSpan);
  //   }
  // }, [currentValue]);

  useEffect(() => {
    if (dynamic) {
      if (containerRef.current) {
        const tempSpan = document.createElement("span");
        tempSpan.style.font = window.getComputedStyle(
          containerRef.current
        ).font;
        tempSpan.style.visibility = "hidden";
        tempSpan.style.whiteSpace = "nowrap";
        document.body.appendChild(tempSpan);

        if (!currentValue) return;

        // Calculate width for the currently selected option
        tempSpan.textContent = currentValue;
        if (currentValue === "All") {
          const calculatedWidth = tempSpan.offsetWidth + 70; // Add padding
          setDropdownWidth(calculatedWidth);
        } else {
          const calculatedWidth = tempSpan.offsetWidth + 60; // Add padding
          setDropdownWidth(calculatedWidth);
        }
        // const calculatedWidth = tempSpan.offsetWidth + 60; // Add padding
        // setDropdownWidth(calculatedWidth);

        document.body.removeChild(tempSpan);
      }
    } else {
      // Calculate the width of the largest option when not dynamic
      if (containerRef.current) {
        const tempSpan = document.createElement("span");
        tempSpan.style.font = window.getComputedStyle(
          containerRef.current
        ).font;
        tempSpan.style.visibility = "hidden";
        tempSpan.style.whiteSpace = "nowrap";
        document.body.appendChild(tempSpan);

        let maxWidth = 0;
        options.forEach((option) => {
          tempSpan.textContent = option;
          maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
        });

        setDropdownWidth(maxWidth + 60); // Add padding
        document.body.removeChild(tempSpan);
      }
    }
  }, [options, currentValue, dynamic]);

  const handleOptionClick = (option: string, index: number) => {
    setIsOpen(false);
    onUpdateContext(option, index);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className ?? ""}`}
      // style={{ width: `${dropdownWidth}px` }}
      style={dynamic ? { width: `${dropdownWidth}px` } : {}}
    >
      <div className="flex justify-between">
        <button
          type="button"
          className="inline-flex w-full justify-between items-center rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="capitalize">{currentValue}</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L5.293 8.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          // style={{ width: `${dropdownWidth}px` }}
          style={dynamic ? { width: `${dropdownWidth}px` } : {}}
          className="origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999]"
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option, index) => (
              <div
                key={index}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
                role="menuitem"
                onClick={() => {
                  handleOptionClick(option, index);
                  setIsOpen(false);
                }}
              >
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
