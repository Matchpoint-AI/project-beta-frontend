import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../features/auth/context/AuthContext';
import ContentOverlay from './ContentOverlay';
import Pagination from './Pagination';
// import SocialMediaPost from "./SocialMediaPost";
import { getServiceURL } from '../../../helpers/getServiceURL';
import SkeletonSocialMediaPost from './SkeletonSocialMediaPost';
// import { CampaignContext } from "../../../context/CampaignContext";
import { structureData } from '../../../helpers/formatters';
// import { getPostingScheduleArray } from "../../../helpers/calculateTiming";
// import moment from "moment-timezone";
// import { CircularProgress } from "@mui/material";
import DayBanner from './DayBanner';

const ContentLibrary = ({
  campaign,
  setStats,
}: {
  campaign: any;
  setStats: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = React.useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [brandName, setBrandName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [weeksContent, setWeeksContent] = useState<any>([]);
  const [text, setText] = useState('');
  const [generatedContentId, setGeneratedContentId] = useState('');
  const [loading, setLoading] = useState(true); // Add a loading state

  const { profile } = useAuth();
  const { id } = useParams();
  const endpointUrl = getServiceURL('content-gen');

  useEffect(() => {
    if (campaign === undefined) return;
    setTotalPages(campaign.campaign_data.campaign_variables.durationNum);
    setBrandName(campaign.campaign_data.biz_variables.brand_name);
    setStartDate(campaign.campaign_data.campaign_variables.start_date);
  }, [campaign]);

  const updataImage = (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    newImage: string | null,
    newText: string
  ) => {
    if (!newImage && newText) {
      setWeeksContent((old) => {
        const arr = Array.from(old) as any;
        arr[week][day].posts[post].text = newText;
        return arr;
      });
    } else {
      setWeeksContent((old) => {
        const arr = Array.from(old) as any;
        arr[week][day]['posts'][post]['image_url']?.push(newImage);
        arr[week][day].posts[post].selected_image = newImage;
        arr[week][day].posts[post].text = newText;
        return arr;
      });
    }
  };

  useEffect(() => {
    if (profile?.token === '' || id === undefined) return;

    const params = new URLSearchParams({
      campaign_id: id as string,
    });

    let pollingInterval: NodeJS.Timeout | null = null;
    const fetchSingleWeek = async () => {
      try {
        // if (weeksContent.length === 0) {
        //   setLoading(true);
        // }
        // Always include auth headers for content-gen service calls
        const response = await fetch(endpointUrl + `/api/v1/get-content?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${profile?.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch data');
          return;
        }

        const data = await response.json();

        if (data.length === 0 || data.arr[0].length === 0) {
          setText('Content Is Being Generated');
          if (pollingInterval) clearInterval(pollingInterval);
          setLoading(false);
          return;
        }

        const newData = structureData(data?.arr);

        setGeneratedContentId(data?.id);
        setWeeksContent((prevContent) => {
          if (!prevContent.length) return newData; // Initial fetch, set directly

          // Merge new data with existing content
          const updatedContent = prevContent.map((week: any, weekIndex: number) =>
            week.map((day, dayIndex) => ({
              ...day,
              posts: day?.posts.map((post, postIndex) =>
                post.image_url // Keep existing post if it has image_url
                  ? post
                  : newData[weekIndex]?.[dayIndex]?.posts[postIndex] || post
              ),
            }))
          );

          return updatedContent;
        });

        // Check if all data is fully generated
        const isFullyGenerated = newData.every((week) =>
          week.every((day) => day.posts.every((post) => post.image_url))
        );

        if (isFullyGenerated) {
          if (pollingInterval) clearInterval(pollingInterval);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchSingleWeek();

    // Start polling every 10 seconds
    pollingInterval = setInterval(fetchSingleWeek, 10000);

    // Cleanup interval on unmount
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [profile?.token, id]);

  const handleApprovalUpdate = (
    weekIndex: number,
    dayIndex: number,
    postIndex: number | null,
    isApproved: boolean
  ) => {
    setTimeout(() => {
      setWeeksContent((prevContent) => {
        const updatedContent = [...prevContent];

        if (postIndex === null) {
          // Approve all posts in the specified day

          const dayPosts = updatedContent[weekIndex][dayIndex]?.posts;

          // Count how many are currently unapproved
          const unapprovedCount = dayPosts.filter((p) => !p.approved).length;
          updatedContent[weekIndex][dayIndex].posts = updatedContent[weekIndex][dayIndex].posts.map(
            (post: any) => ({
              ...post,
              approved: isApproved,
            })
          );
          updatedContent[weekIndex][dayIndex].approved = isApproved;
          setStats((prevStats: any) => ({
            ...prevStats,
            approved: prevStats.approved + unapprovedCount,
            ready_for_review: prevStats.ready_for_review - unapprovedCount,
          }));
        } else {
          // Approve only the specified post
          if (isApproved === false) {
            updatedContent[weekIndex][dayIndex].approved = isApproved;
          }
          updatedContent[weekIndex][dayIndex].posts[postIndex].approved = isApproved;
          if (isApproved === true) {
            setStats((prevStats: any) => ({
              ...prevStats, // Spread the previous state to keep all other values
              approved: prevStats.approved + 1, // Increment only the approved field
              ready_for_review: prevStats.ready_for_review - 1,
            }));
          } else {
            setStats((prevStats: any) => ({
              ...prevStats, // Spread the previous state to keep all other values
              approved: prevStats.approved - 1, // Increment only the approved field
              ready_for_review: prevStats.ready_for_review + 1,
            }));
          }
        }

        return updatedContent;
      });
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4 mb-16">
      {open !== 0 && (
        <ContentOverlay
          day={open}
          closeOverlay={() => setOpen(0)}
          content={weeksContent[currentPage - 1][open - 1].posts}
          brandName={brandName}
          id={generatedContentId}
          week={currentPage}
          approved={weeksContent[currentPage - 1][open - 1].approved}
          setOpen={setOpen}
          updataImage={updataImage}
          onApprovalUpdate={() => handleApprovalUpdate(currentPage - 1, open - 1, null, true)}
        />
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(val) => {
          setCurrentPage(val);
        }}
        prefixText="Week "
      />

      <div className="flex flex-col items-center gap-4">
        {loading
          ? // Render 4 skeletons as placeholders
            Array.from({ length: 7 }).map((_, index) => <SkeletonSocialMediaPost key={index} />)
          : weeksContent.length > 0 &&
            weeksContent[currentPage - 1] &&
            weeksContent[currentPage - 1]?.map((val: any, index: number) => (
              <DayBanner
                brandName={brandName}
                content={val}
                currentPage={currentPage}
                generatedContentId={generatedContentId}
                handleApprovalUpdate={handleApprovalUpdate}
                index={index}
                key={index}
                setOpen={setOpen}
                startDate={startDate}
                updataImage={updataImage}
              />
            ))}
        {weeksContent.length === 0 && !loading && <p className="">{text}</p>}
      </div>
    </div>
  );
};

export default ContentLibrary;
