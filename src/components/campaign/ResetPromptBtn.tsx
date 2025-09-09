import React, { useState } from "react";
import { getServiceURL } from "../../helpers/getServiceURL";
import ErrorToast from "../shared/ErrorToast";
import { CircularProgress } from "@mui/material";

export default function ResetPromptBtn({
   version,
   token,
   target,
   switchPrompts,
}: {
   version: number;
   token: string;
   target: "content_generation" | "scrape_website";
   switchPrompts: (
      version: number,
      target: "content_generation" | "scrape_website"
   ) => void;
}) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const onPromptReset = async () => {
      setError("");
      setLoading(true);
      const endpointUrl = `${getServiceURL("content-gen")}/api/v1/app_prompts`;
      const response = await fetch(endpointUrl, {
         method: "PUT",
         headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            version,
            target,
         }),
      });

      if (!response.ok) setError("error reseting prompt");
      else switchPrompts(version, target);
      setLoading(false);
   };

   return (
      <>
         <button
            type="button"
            onClick={onPromptReset}
            className="text-[#5145CD] py-2 px-3 font-semibold border border-[#5145CD] rounded-md">
            {loading ? (
               <CircularProgress
                  sx={{ color: "#5145CD" }}
                  size={25}
                  thickness={5}
               />
            ) : (
               "Reset"
            )}
         </button>
         <ErrorToast
            open={error !== ""}
            onClose={() => setError("")}
            message={error}
         />
      </>
   );
}
