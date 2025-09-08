import React, { useState } from "react";

interface ChipComponentProps {
  label: string;
  selected: boolean;
  onClose: (index: number) => void;
  onSelect: (index: number) => void;
  index: number;
  single?: boolean;
  className?: string;
}

const ChipComponent: React.FC<ChipComponentProps> = ({
  index,
  label,
  selected,
  onClose,
  onSelect,
  single = false,
  className
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs font-medium leading-[18px] capitalize text-[#111928] rounded-md px-[10px] py-[2px] mr-3 hover:bg-[#F98080] ${className}`}
      style={{ backgroundColor: hover ? "#F98080" : selected ? "#84E1BC" : "#D1D5DB" }}
    >
      
      <button type="button" className="font-medium text-[#111928]" onClick={() => onSelect(index)}>{label}</button>
      <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => onClose(index)}>
        <img src="/delete_tag.svg" />
      </button>
    </div>
  );
};

export default ChipComponent;
