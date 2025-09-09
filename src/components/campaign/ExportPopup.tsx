import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { CampaignContext } from "../../context/CampaignContext";
import handleNavigate from "../../helpers/handleNavigate";
import { useAuth } from "../../features/auth/context/AuthContext";

const ExportPopup = ({
   campaignName,
   onClose,
}: {
   campaignName: string;
   onClose: () => void;
}) => {
   const navigate = useNavigate();
   const { profile } = useAuth();
   const { setCampaignInfo } = useContext(CampaignContext);

   const redirectToSurvey = () => {
      window.open(
         "https://docs.google.com/forms/d/e/1FAIpQLSeZWjG3pXklI-Znl1yV69q4yVlPNfdqyy-SeLcquAB9czbYRA/viewform?usp=sf_link",
         "_blank"
      ); // Opens the survey in a new tab
      onClose();
   };

   const handleNewCampaign = () => {
      setCampaignInfo({});
      handleNavigate(profile?.id || "", "/campaign", navigate);
   };

   return (
      <div className="fixed inset-0 flex items-center  justify-center z-50 bg-black bg-opacity-50">
         <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col justify-center items-center gap-3 w-[750px] h-[580px]">
            <div className="w-[400px] h-[220px] flex justify-center items-center ">
               <img src="/popup.png" alt="Congrats" className="object-fill" />
            </div>
            <div className="flex flex-col justify-center items-center gap-0">
               <div className="flex flex-col justify-center items-center gap-4">
                  <h2 className="text-4xl font-bold text-gray-900">
                     Congrats!
                  </h2>
                  <p className="text-xl leading-8 font-normal text-gray-900">
                     You just exported your first set of Matchpoint AI-generated
                     social media content for your {campaignName} campaign.
                     Let’s keep it up!
                  </p>
                  <div className="flex justify-center gap-4">
                     <button
                        className="bg-indigo-600 text-white flex flex-row justify-between items-center gap-2 py-3 px-4 rounded-lg hover:bg-indigo-700"
                        onClick={handleNewCampaign}>
                        Start New Campaign
                        <FaArrowRightLong />
                     </button>
                     <button
                        className="border border-gray-200 text-gray-800 flex flex-row justify-between items-center gap-2 py-3 px-4 rounded-lg font-medium text-lg leading-6 hover:bg-gray-100"
                        onClick={redirectToSurvey}>
                        Give Product Feedback
                     </button>
                  </div>
               </div>
               <button
                  className="text-gray-500 px-4 py-2 rounded underline text-sm font-normal leading-[21px] text-center decoration-solid decoration-underline [text-underline-position:from-font] [text-decoration-skip-ink:none] font-inter"
                  onClick={() =>
                     handleNavigate(profile?.id || "", "/dashboard", navigate)
                  }>
                  Go to my dashboard
               </button>
            </div>
         </div>
      </div>
   );
};

export default ExportPopup;
