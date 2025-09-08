import React, { useEffect, useState } from "react";
import Dropdown from "../shared/Dropdown";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface CampaignToolBarProps {
   label: string;
   date: Date;
   onNavigate: (action: number, date: Date) => void;
}
const CampaignToolBar = (props: CampaignToolBarProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Month options
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Year options (current year ± 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    const updatedDate = new Date(props.date);
    updatedDate.setMonth(months.indexOf(month));
    props.onNavigate('DATE', updatedDate);
    setSelectedMonth(month);
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    const updatedDate = new Date(props.date);
    updatedDate.setFullYear(year);
    props.onNavigate('DATE', updatedDate);
    setSelectedYear(year);
  };

  // Simple month navigation
  const handleForward = () => props.onNavigate('NEXT');
  const handleBackward = () => props.onNavigate('PREV');

  // Initialize selected month/year from props
  useEffect(() => {
    const [month, year] = props.label.split(" ");
    setSelectedMonth(month);
    setSelectedYear(parseInt(year));
  }, [props.label]);

  return (
    <div className="w-full h-16 flex flex-row justify-center items-center mb-6">
      <div className="w-fit h-10 flex flex-row gap-4 items-center">
        <IoIosArrowBack
          className="w-5 h-5 hover:cursor-pointer"
          onClick={handleBackward}
        />
        
        {/* Month Dropdown */}
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="p-1 border rounded"
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        
        {/* Year Dropdown */}
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="p-1 border rounded"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <IoIosArrowForward
          className="w-5 h-5 hover:cursor-pointer"
          onClick={handleForward}
        />
      </div>
    </div>
  );
};  
export default CampaignToolBar;
