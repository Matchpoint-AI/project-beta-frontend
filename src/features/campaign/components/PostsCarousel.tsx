import React from 'react';
// import "@splidejs/react-splide/css"; // Import default Splide CSS
// import { Splide, SplideSlide } from "@splidejs/react-splide";
import SocialMediaPost from './SocialMediaPost';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

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
}: PostsCarouselProps) => (
  <Swiper
    slidesPerView={3} // Show 3 posts at a time
    spaceBetween={10} // Space between slides
    navigation={true} // Enables arrows
    modules={[Navigation]}
    className="w-full"
  >
    {content.posts.map((post, postIndex) => (
      <SwiperSlide key={postIndex}>
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
      </SwiperSlide>
    ))}
  </Swiper>
);

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
