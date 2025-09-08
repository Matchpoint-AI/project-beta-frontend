import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import SocialMediaPost from './SocialMediaPost';
import { getServiceURL } from '../../helpers/getServiceURL';
import moment from 'moment-timezone';
import { getPostingScheduleArray } from '../../helpers/calculateTiming';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// const MAX_VISIBLE_POSTS = 1; // Maximum posts displayed at once

interface DayBannerProps {
  index: number;
  startDate: string;
  currentPage: number;
  content: {
    approved: boolean;
    posts: Array<{
      text: string;
      image_url: string[];
      approved: boolean;
      posted: boolean;
      [key: string]: any;
    }>;
    dayIndex: number;
  };
  generatedContentId: string;
  handleApprovalUpdate: (
    weekIndex: number,
    dayIndex: number,
    postIndex: number | null,
    isApproved: boolean,
  ) => void;
  setOpen: (index: number) => void;
  brandName: string;
  updataImage: (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    newImage: string,
    text: string,
  ) => void;
}

const DayBanner = ({
  index,
  startDate,
  currentPage,
  content,
  generatedContentId,
  handleApprovalUpdate,
  setOpen,
  brandName,
  updataImage,
}: DayBannerProps) => {
  // Remove debugging logs

  const postingTimes = getPostingScheduleArray(content.posts.length);
  const [fullLoading, setFullLoading] = useState(false);
  const { profile } = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const scrollContainerRef = useRef<any>(null);
  const [selectedImages, setSelectedImages] = useState(
    content.posts.map((post) =>
      post.text_versions ? post.text_versions.findIndex((text) => text === post.text) + 1 : 1,
    ),
  );

  const [maxVisiblePosts, setMaxVisiblePosts] = useState(1);
  const showNavigation = content.posts.length > maxVisiblePosts;
  const canScrollLeft = startIndex > 0;
  const canScrollRight = startIndex + maxVisiblePosts < content.posts.length;

  // 2) On mount and on resize, recalculate maxVisiblePosts
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 768) {
        // sm breakpoint
        setMaxVisiblePosts(1);
      } else if (width < 1024) {
        // md breakpoint
        setMaxVisiblePosts(2);
      } else {
        // lg and above
        setMaxVisiblePosts(3);
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Move to the next post set
  const handleNext = () => {
    if (startIndex + maxVisiblePosts < content.posts.length) {
      setStartIndex(startIndex + 1);
    }
  };

  // Move to the previous post set
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const formatDate = (startDate: string, daysToAdd: number): string => {
    if (startDate === '') return '';
    const [month, day, year] = startDate.split('/').map(Number);
    const date = new Date(year, month - 1, day + daysToAdd);

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Scroll to the current visible posts when startIndex changes
  useEffect(() => {
    if (scrollContainerRef?.current) {
      const postWidth = scrollContainerRef.current.scrollWidth / content.posts.length;
      scrollContainerRef.current?.scrollTo({
        left: startIndex * postWidth,
        behavior: 'smooth',
      });
    }
  }, [startIndex, content.posts.length]);

  const validateTimezone = (timezone: string) => {
    return moment.tz.zone(timezone) !== null;
  };

  const handleApprove = async (week: number, day: number, content: any) => {
    const endpointUrl = getServiceURL('content-gen');
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
    setFullLoading(true);
    const payload = {
      campaign_content_id: generatedContentId,
      week: week,
      day: day + 1,
      approved: true,
      timezone: validTimezone,
      posts: content.posts.reduce((acc: any, item: any, index: number) => {
        const postKey = `post_${index + 1}`;
        const selectedIndex = (selectedImages[index] || 1) - 1;
        acc[postKey] = {
          selected_image: item.image_url[selectedIndex],
          text: item.text,
        };
        return acc;
      }, {}),
    };
    try {
      const response = await fetch(endpointUrl + `/api/v1/contentgen/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data');
      }
      // setIsApproved(true); // Mark as approved
      // onApprovalUpdate();
      handleApprovalUpdate(currentPage - 1, day, null, true);

      // closeOverlay();
    } catch (error) {
      console.error('Error fetching data:', error);
      // setErrorText(error.message);
      // setErrorSaving(true);
    } finally {
      setFullLoading(false); // Stop loading spinner
    }
  };

  return (
    <div
      // key={index}
      className="bg-[#FFFFFF] border border-[#E5E7EB] flex flex-col gap-3 shadow-md p-6 w-full rounded-md mt-0 "
    >
      <div className="flex flex-row justify-between items-center">
        <p className="text-[#1F2937] font-semibold text-lg">
          Day {index + 1} |{' '}
          <span className="text-[#1F2937] font-medium text-lg">{formatDate(startDate, index)}</span>
        </p>
        {content.approved === true ? (
          <button
            // onClick={() => handleApprove(currentPage, index, content)}
            disabled={true}
            className=" text-[#356751] font-semibold text-base text-center border-[1px] border-[#046C4E] bg-[#DEF7EC] px-2 py-2 rounded-md"
          >
            Approved
          </button>
        ) : (
          <button
            onClick={() => handleApprove(currentPage, index, content)}
            // disabled={true}
            className="text-[#8E4B10] font-semibold text-base text-center border-[1px]  border-[#8E4B10] bg-[#FDF6B2] hover:bg-[#fdf49f]  md:px-2 md:py-2 rounded-md"
          >
            {fullLoading ? (
              <CircularProgress sx={{ color: '#6C2BD9' }} size={25} thickness={5} />
            ) : (
              'Approve Full Day'
            )}
          </button>
        )}
      </div>
      {/* <PostsCarousel
        content={content}
        postingTimes={postingTimes}
        index={index}
        setOpen={setOpen}
        brandName={brandName}
        generatedContentId={generatedContentId}
        week={currentPage}
        updataImage={updataImage}
        handleApprovalUpdate={handleApprovalUpdate}
      /> */}
      <div className="relative">
        {/* Left navigation arrow */}
        {showNavigation && (
          <button
            onClick={handlePrev}
            disabled={!canScrollLeft}
            className={`left-0 top-1/2 -translate-y-1/2 z-10 bg-white absolute rounded-full shadow-md p-2 ${
              canScrollLeft
                ? 'text-[#6C2BD9] hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            style={{ transform: 'translate(-50%, -50%)' }}
          >
            <FaArrowLeft size="20px" />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto hide-scrollbar mx-auto w-[310px] md:w-[580px] lg:w-[860px] xl:w-[1100px] 2xl:w-[1710px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="w-full h-full flex flex-row gap-0 md:gap-4 lg:gap-2 xl:gap-4 ">
            {content.posts.map((post, postIndex) => {
              const postTime = postingTimes[postIndex] || 'Unscheduled';
              return (
                <div
                  key={postIndex}
                  className="w-full md:w-[calc(33.333%-1rem)] min-w-[280px] mx-auto flex-shrink-0"
                >
                  <SocialMediaPost
                    key={postIndex}
                    day={index}
                    postIndex={postIndex + 1}
                    setOpen={setOpen}
                    content={post}
                    brandName={brandName}
                    id={generatedContentId}
                    week={currentPage}
                    postingTime={postTime}
                    updataImage={updataImage}
                    selectedImages={selectedImages}
                    setSelectedImages={setSelectedImages}
                    onApprovalUpdate={(postIndexx, isApproved) =>
                      handleApprovalUpdate(currentPage - 1, index, postIndex, isApproved)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* Right navigation arrow */}
        {showNavigation && (
          <button
            onClick={handleNext}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 ${
              canScrollRight
                ? 'text-[#6C2BD9] hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            style={{ transform: 'translate(50%, -50%)' }}
          >
            <FaArrowRight size="20px" />
          </button>
        )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default DayBanner;
