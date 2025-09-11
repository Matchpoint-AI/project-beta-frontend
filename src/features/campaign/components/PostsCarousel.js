import { jsx as _jsx } from "react/jsx-runtime";
// import "@splidejs/react-splide/css"; // Import default Splide CSS
// import { Splide, SplideSlide } from "@splidejs/react-splide";
import SocialMediaPost from './SocialMediaPost';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
var PostsCarousel = function (_a) {
    var content = _a.content, postingTimes = _a.postingTimes, index = _a.index, setOpen = _a.setOpen, 
    //  brandName,
    generatedContentId = _a.generatedContentId, week = _a.week, updataImage = _a.updataImage, handleApprovalUpdate = _a.handleApprovalUpdate, selectedImages = _a.selectedImages, setSelectedImages = _a.setSelectedImages;
    return (_jsx(Swiper, { slidesPerView: 3, spaceBetween: 10, navigation: true, modules: [Navigation], className: "w-full", children: content.posts.map(function (post, postIndex) { return (_jsx(SwiperSlide, { children: _jsx(SocialMediaPost, { day: index, postIndex: postIndex + 1, postingTime: postingTimes[postIndex] || 'Unscheduled', setOpen: setOpen, 
                //  brandName={brandName}
                id: generatedContentId, week: week, content: post, updataImage: updataImage, onApprovalUpdate: function (postId, isApproved) {
                    return handleApprovalUpdate(week - 1, index, postId, isApproved);
                }, selectedImages: selectedImages, setSelectedImages: setSelectedImages }) }, postIndex)); }) }));
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
//# sourceMappingURL=PostsCarousel.js.map