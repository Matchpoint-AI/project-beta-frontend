const calculateWeekNumber = (
   startDate: Date,
   durationWeeks: number
): number => {
   const now = new Date();
   const endDate = new Date(startDate);
   endDate.setDate(startDate.getDate() + durationWeeks * 7);

   // Calculate the difference in milliseconds
   const daysBetween = Math.ceil(
      (now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
   );

   // Calculate the week number
   return Math.ceil(daysBetween / 7);
};
const formatMonthDayYear = (date: Date): string => {
   const options: Intl.DateTimeFormatOptions = {
      // month: "short",
      day: "numeric",
   };
   return date.toLocaleDateString("en-US", options);
};

const formatMonth = (date: Date): string => {
   const options: Intl.DateTimeFormatOptions = {
      month: "short",
   };
   return date.toLocaleDateString("en-US", options);
};

const formatFullDate = (date: Date): string => {
   const options: Intl.DateTimeFormatOptions = { year: "numeric" };
   return date.toLocaleDateString("en-US", options);
};

export const displayPeriod = (startDate: string, duration: string): string => {
   if (!startDate || startDate === "") return "Timing not selected";
   if (!duration || duration === "") return "Timing not selected";

   try {
      const [month, day, year] = startDate.split("/").map(Number);
      const start = new Date(year, month - 1, day);

      // Parse the duration
      const durationParts = duration.split(" ");
      if (durationParts.length < 2) {
         // If duration is just a number, assume weeks
         const durationValue = Number(duration);
         if (isNaN(durationValue)) return "Timing not selected";

         const end = new Date(start);
         end.setDate(start.getDate() + durationValue * 7);

         const now = new Date();
         const isCompleted = now >= end;
         const weekNumber = isCompleted
            ? durationValue
            : calculateWeekNumber(start, durationValue);

         const startMonth = formatMonth(start);
         const startDayMonth = formatMonthDayYear(start);
         const endDayMonth = formatMonthDayYear(end);
         const startYear = formatFullDate(start);
         const endYear = formatFullDate(end);

         let dateRange: string;
         if (startYear === endYear) {
            if (start.getMonth() === end.getMonth()) {
               dateRange = `${startMonth} ${startDayMonth} - ${endDayMonth}, ${startYear}`;
            } else {
               dateRange = `${startMonth} ${startDayMonth} - ${endDayMonth}, ${startYear}`;
            }
         } else {
            dateRange = `${startMonth} ${startDayMonth}, ${startYear} - ${endDayMonth}, ${endYear}`;
         }

         if (isCompleted || weekNumber <= 0) {
            return `${durationValue} weeks, ${dateRange}`;
         } else {
            return `Week ${weekNumber} of ${durationValue}, ${dateRange}`;
         }
      }

      const durationValue = Number(durationParts[0]);
      const durationUnit = durationParts[1]?.toLowerCase() || "weeks";

      if (isNaN(durationValue)) return "Timing not selected";

      // Calculate the end date
      let end: Date;
      if (durationUnit === "weeks" || durationUnit === "week") {
         end = new Date(start);
         end.setDate(start.getDate() + durationValue * 7);
      } else {
         throw new Error(`Unsupported duration unit: ${durationUnit}`);
      }

      const now = new Date();
      const isCompleted = now >= end;
      const weekNumber = isCompleted
         ? durationValue
         : calculateWeekNumber(start, durationValue);

      const startMonth = formatMonth(start);
      const startDayMonth = formatMonthDayYear(start);
      const endDayMonth = formatMonthDayYear(end);
      const startYear = formatFullDate(start);
      const endYear = formatFullDate(end);

      let dateRange: string;
      if (startYear === endYear) {
         if (start.getMonth() === end.getMonth()) {
            dateRange = `${startMonth} ${startDayMonth} - ${endDayMonth}, ${startYear}`;
         } else {
            dateRange = `${startMonth} ${startDayMonth} - ${endDayMonth}, ${startYear}`;
         }
      } else {
         dateRange = `${startMonth} ${startDayMonth}, ${startYear} - ${endDayMonth}, ${endYear}`;
      }

      if (isCompleted || weekNumber <= 0) {
         return `${duration}, ${dateRange}`;
      } else {
         return `Week ${weekNumber} of ${durationValue}, ${dateRange}`;
      }
   } catch (error) {
      console.error("Error calculating display period:", error);
      return "Timing not selected";
   }
};

const getOrdinalSuffix = (day: number): string => {
   if (day > 3 && day < 21) return `${day}th`; // Covers 11-20
   switch (day % 10) {
      case 1:
         return `${day}st`;
      case 2:
         return `${day}nd`;
      case 3:
         return `${day}rd`;
      default:
         return `${day}th`;
   }
};

const formatMonthDayWithSuffix = (date: Date): string => {
   const month = date.toLocaleString("en-US", { month: "long" });
   const day = getOrdinalSuffix(date.getDate());
   return `${month} ${day}`;
};

const formatYear = (date: Date): string => {
   return date.getFullYear().toString();
};

export const displayDuration = (
   startDate: string,
   duration: string | number
): string => {
   if (!startDate || !duration) return "Timing not selected";

   const [month, day, year] = startDate.split("/").map(Number);
   const start = new Date(year, month - 1, day);

   // Parse the duration
   let durationValue: number;
   let durationUnit: string;

   if (typeof duration === "number") {
      durationValue = duration;
      durationUnit = "weeks";
   } else {
      const durationParts = duration.split(" ");
      durationValue = Number(durationParts[0]);
      durationUnit = durationParts[1]?.toLowerCase() || "weeks";
   }

   // Calculate the end date
   let end: Date;
   if (durationUnit === "weeks" || durationUnit === "week") {
      end = new Date(start);
      end.setDate(start.getDate() + durationValue * 7); // Add duration in days
   } else {
      throw new Error(`Unsupported duration unit: ${durationUnit}`);
   }

   const startFormatted = formatMonthDayWithSuffix(start);
   const endFormatted = formatMonthDayWithSuffix(end);
   const startYear = formatYear(start);
   const endYear = formatYear(end);

   // If both dates are in the same year, only show the year once
   const formattedYear =
      startYear === endYear ? startYear : `${startYear} - ${endYear}`;

   return `${startFormatted} - ${endFormatted} ${formattedYear}`;
};

const getGMTOffset = (timeZone: string): string => {
   try {
      const date = new Date();
      const timeZoneFormatter = new Intl.DateTimeFormat("en-US", {
         timeZone,
         timeZoneName: "shortOffset", // Gets the GMT offset like GMT+1
      });

      const parts = timeZoneFormatter.formatToParts(date);
      const gmtPart = parts.find((part) => part.type === "timeZoneName")?.value;

      return gmtPart || "GMT"; // Fallback to GMT if undetectable
   } catch (error) {
      return "GMT"; // Fallback in case of error
   }
};

const getUserTimeZone = (): string => {
   const regionTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
   return getGMTOffset(regionTimeZone);
};

export const getPostingSchedule = (numPosts: number): string => {
   const possibleTimes = ["9 AM", "12 PM", "2 PM", "5 PM", "8 PM"];
   const userTimeZone = getUserTimeZone(); // Get user's timezone dynamically

   if (numPosts <= 0) return "No scheduled posts";
   if (numPosts === 1) return `${possibleTimes[1]} ${userTimeZone}`;
   if (numPosts === 2)
      return `${possibleTimes[0]}, ${possibleTimes[3]} ${userTimeZone}`;
   if (numPosts === 3)
      return `${possibleTimes[0]}, ${possibleTimes[2]}, ${possibleTimes[3]} ${userTimeZone}`;
   if (numPosts === 4)
      return `${possibleTimes[0]}, ${possibleTimes[1]}, ${possibleTimes[2]}, ${possibleTimes[3]} ${userTimeZone}`;

   // For 5-6 posts, include all available time slots
   return `${possibleTimes.join(", ")} ${userTimeZone}`;
};

export const getPostingScheduleArray = (numPosts: number): string[] => {
   const possibleTimes = ["9 AM", "12 PM", "2 PM", "5 PM", "8 PM"];
   const userTimeZone = getUserTimeZone(); // Get user's timezone dynamically

   if (numPosts <= 0) return [];
   if (numPosts === 1) return [`${possibleTimes[1]} ${userTimeZone}`];
   if (numPosts === 2)
      return [
         `${possibleTimes[0]} ${userTimeZone}`,
         `${possibleTimes[3]} ${userTimeZone}`,
      ];
   if (numPosts === 3)
      return [
         `${possibleTimes[0]} ${userTimeZone}`,
         `${possibleTimes[2]} ${userTimeZone}`,
         `${possibleTimes[3]} ${userTimeZone}`,
      ];
   if (numPosts === 4)
      return [
         `${possibleTimes[0]} ${userTimeZone}`,
         `${possibleTimes[1]} ${userTimeZone}`,
         `${possibleTimes[2]} ${userTimeZone}`,
         `${possibleTimes[3]} ${userTimeZone}`,
      ];

   // For 5-6 posts, include all available time slots
   return possibleTimes.map((time) => `${time} ${userTimeZone}`);
};
