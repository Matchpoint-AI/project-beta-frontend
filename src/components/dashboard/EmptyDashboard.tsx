import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CampaignContext } from "../../context/CampaignContext";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useAuth } from "../../features/auth/context/AuthContext";
import handleNavigate from "../../helpers/handleNavigate";

const EmptyDashboard = () => {
   const navigate = useNavigate();
   const { profile } = useAuth();
   const { setCampaignInfo } = useContext(CampaignContext);
   const handleNewCampaign = () => {
      setCampaignInfo({});
      handleNavigate(profile?.id ?? "", "/campaign", navigate);
   };
   return (
      <div className="w-full min-h-screen flex flex-row justify-center items-center">
         <div className="w-fit h-fit flex flex-col gap-16 justify-center items-center">
            <h1 className="text-2xl font-semibold leading-9 text-gradient">
               Ready to start your new campaign?
            </h1>
            <div className="flex flex-col justify-center items-center gap-4">
               <img src="createCampaign.png" />
               <div className="flex flex-col gap-0 justify-center items-center">
                  {/* <h1 className="text-gray-900 text-2xl font-bold leading-9">
              Super easy. Let’s create your next campaign brief and your content
              will be on its way.
            </h1> */}
                  <h2 className="text-gray-900 text-xl font-normal text-center leading-8">
                     Super easy. Let’s create your next campaign brief <br />{" "}
                     and your content will be on its way.{" "}
                  </h2>
               </div>
               <button
                  className="bg-[#5145CD] text-white py-4 px-2 rounded-lg flex flex-row justify-center items-center gap-2 text-base font-medium leading-4"
                  onClick={handleNewCampaign}>
                  Start my next campaign
                  <AiOutlineArrowRight className={"w-6 h-6"} />
               </button>
            </div>
         </div>
      </div>
   );
};

export default EmptyDashboard;
