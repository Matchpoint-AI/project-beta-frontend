import React, { useEffect, useState } from "react";
import { Day, Week } from "../../types/ContentLibrary";
// import { useAuth } from "../../context/AuthContext";
// import { getServiceURL } from "../../helpers/getServiceURL";
// import { useParams } from "react-router-dom";
// import { CampaignContext } from "../../context/CampaignContext";
// import Dropdown from "../shared/Dropdown";

interface CampaignStatsProps {
   weeksData: Week[];
}

const CampaignStats = ({ weeksData }: CampaignStatsProps) => {
   // const { profile } = useAuth();
   const [totalContent, setTotalContent] = useState(0);
   const [approved, setApproved] = useState(0);
   const [readyForReview, setReadyForReview] = useState(0);
   // const [generating, setGenerating] = useState(0);
   // const { id } = useParams();
   // const endpointUrl = getServiceURL("data");
   // const { campaignInfo }: any = useContext(CampaignContext);
   const [weekIndex, setWeekIndex] = useState(0); // Track the current week
   // const [weeksData, setWeeksData] = useState([]);
   // const [hidden, setHidden] = useState(false);

   const calculateWeekStats = (weekData: Week) => {
      let totalPosts = 0;
      let approvedPosts = 0;

      weekData[weekIndex].posts.forEach((post) => {
         totalPosts++;
         if (post.approved) approvedPosts++;
      });

      const readyForReviewPosts = totalPosts - approvedPosts;
      setTotalContent(totalPosts);
      setApproved(approvedPosts);
      setReadyForReview(readyForReviewPosts);
   };

   useEffect(() => {
      if (weeksData !== undefined && weeksData.length > 0) {
         calculateWeekStats(weeksData[weekIndex]);
      }
   }, [weekIndex]);
   return (
      <div className="flex self-start flex-col gap-1 mt-2">
         <div className="flex items-center gap-2">
            {/* <Dropdown
            currentValue={`Week ${weekIndex + 1}`}
            options={weeksData.map((_, index) => `Week ${index + 1}`)}
            onUpdateContext={(value: string, index: number) => {
              setWeekIndex(index); // Update the selected week index
            }}
            className="w-[48%]"
          /> */}
            <select
               id="week-selector"
               className="border rounded px-2 py-1 text-base font-medium bg-white text-gray-700"
               value={weekIndex}
               onChange={(e) => setWeekIndex(parseInt(e.target.value))}>
               {weeksData.map((_, index) => (
                  <option key={index} value={index}>
                     Week {index + 1}
                  </option>
               ))}
            </select>
            Content Status
         </div>
         <ul className="list-disc list-inside text-gray-700">
            <li>
               Ready for Review: {readyForReview} out of {totalContent}
            </li>
            <li>
               Approved: {approved} out of {totalContent}
            </li>
         </ul>
      </div>
   );
};

export default CampaignStats;
