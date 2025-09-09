import { BsTrash2 } from "react-icons/bs";
import { PiInstagramLogo, PiPlug } from "react-icons/pi";
import useIntegrationApi, {
   authenticateApp,
   getAppUser,
   revokeAuthApp,
} from "../../../api/api-integrations";
import React, { useEffect, useState } from "react";
import useAppContext from "../../../context/appContext";
import { getServiceURL } from "../../../helpers/getServiceURL";
import { useAuth } from "../../../features/auth/context/AuthContext";

const PLATFORMS = ["INSTAGRAM"];

export default function Integrations() {
   const {
      integrations: { data },
   } = useAppContext();
   const { profile } = useAuth();
   const [isConnected, setIsConnected] = useState(false);

   useEffect(() => {
      if (profile?.token === "") return;
      const endpointUrl = getServiceURL("data");
      const redirectURI = `${endpointUrl}/api/v1/instagram/callback`;
      const baseurl =
         window.location.hostname === "www.matchpointai.com"
            ? "matchpointai.com"
            : window.location.hostname;

      fetch(`${endpointUrl}/api/v1/integrations/save_redirect_uri`, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${profile?.token}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            url: redirectURI,
            base_url: baseurl,
         }),
      })
         .then((response) => response.json())
         .then((data: { response: string }) => {
         })
         .catch((error: unknown) => console.error("Error:", error));
   }, [profile]);

   useEffect(() => {
      if (data && data.length) {
         setIsConnected(true);
      }
   }, [data]);

   return (
      <div className="flex-1 pt-4">
         <h2 className="pl-4 text-sm text-gray-700">
            Select and connect platforms to integrate with your workflow
         </h2>
         <div className="p-8">
            <ul
               role="list"
               className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {/* this is till need to be redone */}
               {isConnected || (data && data.length) ? (
                  <Connected onRevoke={() => setIsConnected(false)} />
               ) : (
                  PLATFORMS.map((platform) => (
                     <Unconnected
                        key={platform}
                        onConnect={() => setIsConnected(true)}
                     />
                  ))
               )}
            </ul>
         </div>
      </div>
   );
}

const openAuthPopup = (url: string, windowName: string = "auth-popup") => {
   return new Promise((resolve, reject) => {
      const popup = window.open(
         url,
         windowName,
         "width=600,height=700,left=200,top=200"
      );

      if (!popup) {
         reject(new Error("Failed to open authentication popup"));
         return;
      }

      const timer = setInterval(() => {
         try {
            if (!popup || popup.closed) {
               clearInterval(timer);
               reject(new Error("Authentication popup closed by user"));
            }

            // Check if the popup redirected to the expected callback
            if (popup.location.href.includes("/profile/integrations")) {
               clearInterval(timer);
               // const params = new URLSearchParams(popup.location.search);
               // const token = params.get("token");
               popup.close();
               resolve("hello");
            }
         } catch (err) {
            // Ignore cross-origin errors
         }
      }, 1000);
   });
};

function Unconnected({ onConnect }: { onConnect: () => void }) {
   const { data, triggerRequest: requestURL } = useIntegrationApi(
      authenticateApp("instagram"),
      "TRIGGER"
   );


   useEffect(() => {
      if (data && data.auth_url) {
         handleAuthPopup(data.auth_url);
      }
   }, [data]);

   const handleAuthPopup = async (authUrl: string) => {
      try {
         const token = await openAuthPopup(authUrl);
         if (token) {
            onConnect();
            // Save token or trigger next steps
         }
      } catch (err: unknown) {
         console.error("Authentication failed:", (err as Error).message);
      }
   };

   return (
      <li className="col-span-1 divide-y divide-gray-200 rounded-md bg-white border drop-shadow-sm">
         <div className="flex flex-col items-center gap-3 p-6 ">
            <PiInstagramLogo size={40} />
            <h3 className="text-sm font-semibold text-gray-600 ">Instagram</h3>
         </div>
         <div
            className="
          flex items-center justify-center gap-4 
          py-4 divide-gray-200 text-green-700
          hover:cursor-pointer
          "
            onClick={requestURL}>
            <PiPlug size={15} />
            <button className="text-sm font-semibold">Connect</button>
         </div>
         {/* <button className="text-sm font-semibold" onClick={getUrl}>
        get url
      </button> */}
      </li>
   );
}

function Connected({ onRevoke }: { onRevoke: () => void }) {
   const {
      integrations: { triggerRequest: refetch, loading: refetchLoading },
   } = useAppContext();
   const { triggerRequest: requestRevoke, loading: revokeLoading } =
      useIntegrationApi(revokeAuthApp("instagram"), "TRIGGER");

   const handleRevoke = () => {
      requestRevoke().then(() => {
         refetch();
         onRevoke();
      });
   };

   const { data } = useIntegrationApi(getAppUser("instagram"));

   // FIX: refactor the loading state
   return (
      <li className="flex flex-col justify-between col-span-1 divide-y bg-white divide-gray-200 rounded-md  border drop-shadow-sm">
         <div className="flex w-full h-full items-center justify-between p-6">
            {!data ? (
               <>
                  <div className="flex-1 truncate animate-pulse">
                     <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 animate-pulse"></div>
               </>
            ) : (
               <>
                  <div className="flex-1 truncate">
                     <h3 className="truncate text-sm font-bold text-gray-900">
                        {data.username}
                     </h3>
                  </div>
                  <img
                     className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                     src={`https://ui-avatars.com/api/?name=${data.username}`}
                  />
               </>
            )}
         </div>

         <div
            className="
          flex items-center justify-center gap-4 
          py-4 divide-gray-200 text-red-500 
          hover:cursor-pointer"
            onClick={handleRevoke}>
            <BsTrash2 size={15} />
            <button
               className="text-sm font-semibold disabled:cursor-not-allowed"
               disabled={revokeLoading || refetchLoading}>
               Remove
            </button>
         </div>
      </li>
   );
}
