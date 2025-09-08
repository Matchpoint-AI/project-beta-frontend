import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import ReactJson from "react-json-view";

import { Post } from "../pages/UserDataPage";

interface RawDataProps {
  state: boolean;
  onClose: () => void;
  data: Post[][][];
}

interface PostData {
  [key: `post_${number}`]: Post;
}

interface DailyData {
  [key: `day_${number}`]: PostData;
}

interface WeeklyData {
  [key: `week_${number}`]: DailyData;
}

export default function RawData({ state, onClose, data }: RawDataProps) {
  const [formattedData, setFormattedData] = useState<WeeklyData | null>(null);

  useEffect(() => {
    const data_v2: WeeklyData = {};

    for (let week = 0; week < data.length; week++) {
      const weekKey = `week_${week + 1}` as `week_${number}`;

      Object.assign(data_v2, { [weekKey]: {} });
      for (let day = 0; day < 7; day++) {
        const dayKey = `day_${day + 1}` as `day_${number}`;

        Object.assign(data_v2[weekKey], { [dayKey]: {} });
        for (let post = 0; post < data[0][0].length; post++) {
          const postKey = `post_${post + 1}` as `post_${number}`;

          data_v2[weekKey][dayKey][postKey] = data[week][day][post];
        }
      }
    }
    setFormattedData(data_v2);
  }, [data]);

  return (
    <>
      {formattedData && (
        <Drawer
          anchor="left"
          open={state}
          onClose={onClose}
          sx={{ zIndex: 50, maxWidth: "900px"}}
        >
          <div className="bg-[#272822] h-full w-full relative overflow-auto">
            <ReactJson src={formattedData} theme="monokai" displayDataTypes={false} style={{width: "900px", position: "absolute top-0 left-0"}} />
          </div>
        </Drawer>
      )}
    </>
  );
}

/**
 * 
 * 
 * 
 */
