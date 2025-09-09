import React from 'react';

const MonthHeader = (props: { label: string }) => {
  const whichDay = () => {
    const label = props.label;

    // Array of full day names
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // Find the day that matches the first three letters of the label
    const matchedDay = daysOfWeek.find((day) => day.startsWith(label));
    return matchedDay;
  };
  return (
    <div className="w-full h-full p-5 flex justify-center items-center border-none">
      <h1>{whichDay()}</h1>
    </div>
  );
};

export default MonthHeader;
