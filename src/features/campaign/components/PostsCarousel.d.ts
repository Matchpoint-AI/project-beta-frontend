import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
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
  content: {
    posts: Post[];
  };
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
    imageUrl: string,
    prepend?: boolean
  ) => void;
  handleApprovalUpdate: (week: number, day: number, postId: string, isApproved: boolean) => void;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}
declare const PostsCarousel: ({
  content,
  postingTimes,
  index,
  setOpen,
  generatedContentId,
  week,
  updataImage,
  handleApprovalUpdate,
  selectedImages,
  setSelectedImages,
}: PostsCarouselProps) => import('react/jsx-runtime').JSX.Element;
export default PostsCarousel;
