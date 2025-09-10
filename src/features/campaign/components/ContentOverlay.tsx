import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import PostPreview from './PostPreview';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { CircularProgress, Dialog, DialogContent } from '@mui/material';
import ErrorToast from '../../../components/shared/ErrorToast';
import moment from 'moment-timezone';

interface Post {
  id: string;
  image_prompt: string;
  text: string;
  image_url: string[];
  posted: boolean;
  approved: boolean;
}

interface ContentOverlayProps {
  day: number;
  closeOverlay: () => void;
  content: Post[];
  brandName: string;
  id: string;
  week: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  updataImage: (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    newImage: string | null,
    newText: string
  ) => void;
  approved: boolean;
  onApprovalUpdate: () => void;
}

const ContentOverlay = ({
  day,
  closeOverlay,
  content,
  brandName,
  id,
  week,
  setOpen,
  updataImage,
  approved,
  onApprovalUpdate,
}: ContentOverlayProps) => {
  const endpointUrl = getServiceURL('content-gen');
  const imageIndex = [1, 1, 1];
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false); // Loading state
  const [isApproved, setIsApproved] = useState(approved); // Track if approved
  const [errorSaving, setErrorSaving] = useState(false); // Track loading state
  const [errorText, setErrorText] = useState('');

  const validateTimezone = (timezone: string) => {
    return moment.tz.zone(timezone) !== null;
  };

  const handleApprove = async () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
    setLoading(true);
    const payload = {
      campaign_content_id: id,
      week: week,
      day: day,
      approved: true,
      timezone: validTimezone,
      posts: content.reduce(
        (acc: { [key: string]: { selected_image: string; text: string } }, item, index) => {
          const postKey = `post_${index + 1}`;
          acc[postKey] = {
            selected_image: item.image_url[imageIndex[index] - 1], // Adjust the image index accordingly
            text: item.text,
          };
          return acc;
        },
        {}
      ),
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
      setIsApproved(true); // Mark as approved
      onApprovalUpdate();
      closeOverlay();
    } catch (error: unknown) {
      console.error('Error fetching data:', error);
      setErrorText((error as Error)?.message || 'An unknown error occurred');
      setErrorSaving(true);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const handlePrevious = () => {
    setOpen(day - 1);
  };
  const handleNext = () => {
    setOpen(day + 1);
  };
  return (
    <Dialog
      fullScreen
      open={day !== 0}
      onClose={closeOverlay}
      PaperProps={{
        style: {
          backgroundColor: '#F3F3F3',
        },
      }}
      scroll="body"
    >
      <DialogContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingY: '20px',
          paddingX: '0px',
        }}
      >
        <div className="flex items-center justify-center h-[40px] w-[40px]">
          {day !== 1 && (
            <button className="" onClick={handlePrevious}>
              <IoIosArrowBack size={40} />
            </button>
          )}
        </div>
        <div className="w-full h-full flex flex-col  justify-center items-center">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#681DBA] to-[#FF43E1] bg-clip-text text-transparent">
              Day {day} content preview
            </h1>
            <button onClick={closeOverlay}>
              <IoClose color="#4b5563" size={32} />
            </button>
          </div>
          <div className="w-full flex justify-evenly items-center flex-wrap mt-5 sm:mt-10">
            {content.map((val, index) => (
              <PostPreview
                key={index}
                week={week}
                day={day}
                index={index}
                content={val}
                brandName={brandName}
                imageIndex={imageIndex}
                campaign_content_id={id}
                updataImage={updataImage}
              />
            ))}
          </div>
          {!isApproved && (
            <div className="w-full h-[52px] flex justify-center items-center mt-4">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="sm:w-[182px] w-full h-full border border-gray-200 bg-green-200 rounded-lg text-gray-900 font-medium mt-3"
              >
                {loading ? (
                  <CircularProgress sx={{ color: '#ffffff' }} size={25} thickness={5} />
                ) : (
                  'Approve Full Day'
                )}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center h-[40px] w-[40px]">
          {day !== 7 && (
            <button className="" onClick={handleNext}>
              <IoIosArrowForward size={40} />
            </button>
          )}
        </div>
      </DialogContent>
      <ErrorToast message={errorText} open={errorSaving} onClose={() => setErrorSaving(false)} />
    </Dialog>
  );
};

export default ContentOverlay;
