import React, { useState } from 'react';
import ChipComponent from '../ChipComponent';

interface AgeDropdownProps {
  options: string[];
  currentValues?: string[];
  onUpdateContext: (option: string[]) => void; // Callback function to update context
}

const AgeDropdown: React.FC<AgeDropdownProps> = ({
  options,
  currentValues,
  onUpdateContext,
}: AgeDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string[]>(currentValues ?? [options[0]]);

  const handleOptionClick = (option: string) => {
    const found = selectedOption.includes(option);
    if (found === true) return;
    console.log('selectedOption === ', selectedOption);
    const found2 = selectedOption.includes('All Ages');
    if (found2 === true) return;
    if (selectedOption.length === 2) return;
    if (option === 'All Ages') {
      const selected = [option];
      setSelectedOption(selected);
      setIsOpen(false);
      onUpdateContext(selected);
      return;
    }
    const selected = [...selectedOption, option];
    setSelectedOption(selected);
    setIsOpen(false);
    onUpdateContext(selected);
  };

  const handleDelete = (index: number) => {
    const newSelectedOption = [...selectedOption]; // Create a copy of the array
    newSelectedOption.splice(index, 1); // Remove the element at the specified index
    setSelectedOption(newSelectedOption); // Update the state with the new array
    onUpdateContext(newSelectedOption);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <div className="flex justify-between">
        <div
          // type="button"
          className="hover:cursor-pointer inline-flex w-full items-center justify-between rounded-md px-4 py-2 bg-white text-sm font-medium border text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
          style={{ height: '40px' }} // Set a fixed height here
        >
          <div className="w-full h-full flex overflow-hidden gap-2" style={{ height: '100%' }}>
            {selectedOption.map((option, index) => (
              <ChipComponent
                key={index}
                index={index}
                label={option}
                selected={true}
                onSelect={() => {}}
                onClose={handleDelete}
              />
            ))}
          </div>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
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
        </div>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute w-full right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[999]">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={`block px-4 py-2 text-sm text-gray-700 ${
                  selectedOption.includes(option) === true ? 'bg-gray-100' : ''
                } hover:bg-gray-100`}
                role="menuitem"
                onClick={() => {
                  handleOptionClick(option);
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

export default AgeDropdown;
