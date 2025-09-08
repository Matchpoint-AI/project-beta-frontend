import React, { useEffect, useState } from "react";
// import { PiDownloadBold } from "react-icons/pi";
import { GoClock } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa";

type EventPost = {
   approved: boolean;
   timing: string;
   [key: string]: unknown;
};

type EventType = {
   title: string;
   status: string;
   posts: EventPost[];
   [key: string]: unknown;
};

const EventWrapper = (props: { event: EventType }) => {
   const [status, setStatus] = useState("");
   const [day, setDay] = useState("");
   const [posts, setPosts] = useState<EventPost[]>([]);

   useEffect(() => {
      const event = props?.event;
      console.log("event === ", event);
      setDay(event?.title);
      setStatus(event?.status);
      setPosts(event?.posts);
   }, []);
   return (
      <>
         {status === "approved" ? (
            <div className=" w-full h-full rounded-md mx-auto gap-1 flex flex-col justify-center items-center">
               {posts.map((post, index) => (
                  <div
                     key={index}
                     className={`flex flex-row justify-start items-center gap-3 w-[60%] h-fit rounded-md p-1 px-2 ${
                        post?.approved ? "bg-[#DEF7EC]" : "bg-[#FDF6B2]"
                     }`}>
                     {post.approved ? (
                        <FaCheckCircle className="text-[#0E9F6E]" />
                     ) : (
                        <GoClock className="text-[#8E4B10]" />
                     )}
                     <h2
                        className={`${
                           post.approved ? "text-[#1F2937]" : "text-[#8E4B10]"
                        } font-medium text-xs `}>
                        {post.timing} Post
                     </h2>
                  </div>
               ))}
            </div>
         ) : (
            <div className=" w-[80%] h-fit border-[1px] p-3 border-gray-200 rounded-md mx-auto gap-2 flex flex-col justify-center items-center">
               {status === "review" && (
                  <>
                     <h1 className="font-semibold text-xs text-gray-900">
                        {day}
                     </h1>
                     <div className="bg-yellow-100 font-medium rounded-md flex flex-row justify-center items-center gap-1 p-1 px-2">
                        <GoClock className="text-yellow-800" />
                        <h2 className="font-medium text-xs text-yellow-800">
                           Ready for Review
                        </h2>
                     </div>
                  </>
               )}
               {status === "generate" && (
                  <>
                     <h1 className="font-semibold text-xs text-gray-900">
                        {day}
                     </h1>
                     <div className="bg-red-100 rounded-md font-medium flex flex-row justify-center items-center gap-1 p-1 px-2">
                        <img className="text-[#8E4B10]" src="/ai.svg" />
                        <h2 className="font-medium text-xs text-red-800">
                           Generating...
                        </h2>
                     </div>
                  </>
               )}
            </div>
         )}
      </>
      // <div className=" w-[95%] h-[85px] border-[1px] border-gray-200 rounded-md mx-auto bg-red-600 gap-2 flex flex-col justify-center items-center">
      //   <h1 className="font-semibold text-xs text-gray-900">{day}</h1>
      //   {status === "approved" && (
      //     <>
      //       <div className="bg-green-100 rounded-md p-1 px-2">
      //         <h2 className="font-medium text-xs text-green-800">Approved</h2>
      //       </div>
      //       <div
      //         onClick={DownloadContent}
      //         className="flex flex-row gap-1 hover:cursor-pointer"
      //       >
      //         <PiDownloadBold />
      //         <h2 className="font-medium text-xs text-gray-900">Download</h2>
      //       </div>
      //     </>
      //   )}
      //   {status === "review" && (
      //     <div className="bg-yellow-100 rounded-md p-1 px-2">
      //       <h2 className="font-medium text-xs text-yellow-800">
      //         Ready for Review
      //       </h2>
      //     </div>
      //   )}
      //   {status === "generate" && (
      //     <div className="bg-red-100 rounded-md p-1 px-2">
      //       <h2 className="font-medium text-xs text-red-800">Generating...</h2>
      //     </div>
      //   )}
      // </div>
   );
};

export default EventWrapper;
