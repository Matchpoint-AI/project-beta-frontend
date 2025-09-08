// SkeletonSocialMediaPost.tsx

import React from "react";

const SkeletonSocialMediaPost = () => {
   return (
      <div className="animate-pulse bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 w-full">
         {/* Date banner */}
         <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
         {/* Posts row (simulate up to 3 posts for desktop) */}
         <div className="flex flex-row gap-4">
            {[1, 2, 3].map((i) => (
               <div
                  key={i}
                  className="flex-1 flex flex-col items-center bg-gray-50 rounded-lg p-3">
                  <div className="w-full aspect-square bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-gray-200 rounded mb-2" />
                  {/* Action buttons */}
                  <div className="flex flex-row gap-2 mt-2 w-full justify-between">
                     <div className="h-8 w-16 bg-gray-200 rounded" />
                     <div className="h-8 w-16 bg-gray-200 rounded" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default SkeletonSocialMediaPost;
