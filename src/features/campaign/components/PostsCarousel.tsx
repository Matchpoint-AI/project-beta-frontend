import React, { useState } from 'react';
import SocialMediaPost from './SocialMediaPost';

interface Post {
  approved: boolean;
  id: string;
  image_prompt?: string;
  text: string;
  image_url: string[];
  image_index?: number;
  posted: boolean;
  [key: string]: unknown;
}

interface PostsCarouselProps {
  content: { posts: Post[] };
  postingTimes: string[];
  index: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  brandName: string;
  generatedContentId: string;
  week: number;
  updataImage: (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    imageUrl: string | null,
    newText: string
  ) => void;
  handleApprovalUpdate: (week: number, day: number, postId: string, isApproved: boolean) => void;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}

const PostsCarousel = ({
  content,
  postingTimes,
  index,
  setOpen,
  brandName,
  generatedContentId,
  week,
  updataImage,
  handleApprovalUpdate,
  selectedImages,
  setSelectedImages,
}: PostsCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const postsPerView = 3;
  const totalSlides = Math.ceil(content.posts.length / postsPerView);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="w-full relative">
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            aria-label="Previous posts"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            aria-label="Next posts"
          >
            →
          </button>
        </>
      )}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-2"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {content.posts.map((post, postIndex) => (
            <div key={postIndex} className="flex-none w-1/3">
              <SocialMediaPost
                day={index}
                postIndex={postIndex + 1}
                postingTime={postingTimes[postIndex] || 'Unscheduled'}
                setOpen={setOpen}
                brandName={brandName}
                id={generatedContentId}
                week={week}
                content={post}
                updataImage={updataImage}
                onApprovalUpdate={(postId, isApproved) =>
                  handleApprovalUpdate(week - 1, index, String(postId), isApproved)
                }
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// const PostsCarousel = ({
//   content,
//   postingTimes,
//   index,
//   setOpen,
//   brandName,
//   generatedContentId,
//   week,
//   updataImage,
//   handleApprovalUpdate,
// }) => {
//   return (
//     <Splide
//       options={{
//         type: "loop",
//         perPage: 3, // Show 3 posts at a time
//         perMove: 1,
//         pagination: false,
//         arrows: true,
//         gap: "1rem",
//       }}
//       className="w-full"
//     >
//       {content.posts.map((post, postIndex) => (
//         <SplideSlide key={postIndex}>
//           <SocialMediaPost
//             day={index}
//             postIndex={postIndex + 1}
//             postingTime={postingTimes[postIndex] || "Unscheduled"}
//             setOpen={setOpen}
//             brandName={brandName}
//             id={generatedContentId}
//             week={week}
//             content={post}
//             updataImage={updataImage}
//             onApprovalUpdate={(postIndexx, isApproved) =>
//               handleApprovalUpdate(week - 1, index, postIndex, isApproved)
//             }
//           />
//         </SplideSlide>
//       ))}
//     </Splide>
//   );
// };

export default PostsCarousel;
