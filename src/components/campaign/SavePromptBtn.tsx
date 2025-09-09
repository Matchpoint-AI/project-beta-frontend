import React, { useState } from "react";
import PurpleButton from "../shared/Buttons/PurpleButton";
import { CircularProgress } from "@mui/material";
import ErrorToast from "../shared/ErrorToast";
import { getServiceURL } from "../../helpers/getServiceURL";
import { useAuth } from "../../features/auth/context/AuthContext";

interface SavePromptBtnProps {
   prompt: string;
   setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
   target: "content_generation" | "scrape_website";
   addPrompts: (
      prompt: string,
      target: "content_generation" | "scrape_website"
   ) => void;
}

export default function SavePromptBtn({
   prompt,
   setErrorMsg,
   target,
   addPrompts,
}: SavePromptBtnProps) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);
   const { profile } = useAuth();

   const submitHandler = async () => {
      const endpointUrl = getServiceURL("content-gen");

      setError(false);
      setLoading(true);

      const response = await fetch(`${endpointUrl}/api/v1/app_prompts`, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${profile?.token}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            prompt,
            target,
         }),
      });
      if (response.status === 400) {
         const { detail } = await response.json();
         setErrorMsg(detail);
      } else if (!response.ok) setError(false);
      else addPrompts(prompt, target);

      setLoading(false);
   };

   return (
      <>
         <PurpleButton
            onClick={submitHandler}
            type="button"
            className=" px-4 py-2 w-fit">
            {loading ? (
               <CircularProgress
                  sx={{ color: "#ffffff" }}
                  size={25}
                  thickness={5}
               />
            ) : (
               "Save"
            )}
         </PurpleButton>
         <ErrorToast
            open={error}
            onClose={() => setError(false)}
            message="error saving prompt! try again later"
         />
      </>
   );
}
