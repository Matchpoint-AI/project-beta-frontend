import React, { useState } from "react";
import { Post } from "../../pages/UserDataPage";
import { FaCheck } from "react-icons/fa";

function PostCard({ post, num }: { post: Post; num: number }) {
   const [image, setImage] = useState(0);

   return (
      <div className="max-w-[350px] aspect-[7/11] rounded-3xl overflow-hidden relative flex flex-col items-center justify-between shadow-md m-5">
         <div className="bg-gradient-to-b from-[#000000ff] to-[#00000000] p-5 z-50 w-full flex items-center justify-between">
            <span className="text-white font-medium text-sm">{`Post ${num}`}</span>
            {post.images.length > 1 && (
               <div>
                  {Array.from({ length: post.images.length }, (_, i) => i).map(
                     (i) => (
                        <button
                           key={i}
                           onClick={() => setImage(i)}
                           className={`h-3 aspect-square rounded-full ml-3 ${
                              i === image ? "bg-[#8175ff]" : "bg-white"
                           }`}
                        />
                     )
                  )}
               </div>
            )}
         </div>
         <div
            style={{
               backgroundImage: `url(${post.images[image]})`,
               backgroundPosition: "center",
               backgroundSize: "cover",
            }}
            className="w-full h-[350px] absolute top-0 left-0 z-0"
         />
         <div className="relative p-3 rounded-t-3xl bg-white h-[260px]">
            <span className="bg-[#5145CD] py-1 px-4 font-medium text-white absolute top-[-16px] left-1/2 translate-x-[-50%] rounded-full shadow-md shadow-[#5145CD80]">
               Caption
            </span>
            <p
               style={{ height: "calc(85% - 20px)" }}
               className="post-caption text-[#111928] w-full text-[13px] mt-5 overflow-y-auto">
               {post.text}
            </p>
            {post.posted && (
               <div className="mt-3 w-[100px] h-[25px] rounded-full bg-[#60e856] flex items-center shadow-md ">
                  <div className="h-[25px] aspect-square bg-[#4BB543]  rounded-full flex items-center justify-center">
                     <FaCheck size={13} color="white" />
                  </div>
                  <div className="font-semibold text-white capitalize ml-2">
                     Posted
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export default function DayContentGalery({
   num,
   content,
}: {
   num: number;
   content: Post[];
}) {
   return (
      <div className="mt-8">
         <h2 className="text-[#5145CD] font-medium text-2xl ml-5 mb-5">{`Day ${num}`}</h2>
         <div className="flex items-center justify-evenly flex-wrap">
            {content.map((p, i) => {
               return <PostCard key={i} post={p} num={i + 1} />;
            })}
         </div>
      </div>
   );
}
