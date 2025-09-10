// SocialMediaPost.tsx

import React, { useEffect, useRef, useState } from 'react';
import PaginationImage from './PaginationImage';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { Button, CircularProgress, Dialog, DialogContent, Menu, MenuItem } from '@mui/material';
import ErrorToast from '../../../shared/components/feedback/ErrorToast';
import moment from 'moment-timezone';
import { FaCheck } from 'react-icons/fa';
import { IoMdCheckmark, IoMdRefresh } from 'react-icons/io';
import posthog from '../../../helpers/posthog';
import { MdClose, MdModeEdit, MdOutlineClose, MdOutlinePublishedWithChanges } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';
import ModifyPrompt from './ModifyPrompt';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TiArrowMaximise } from 'react-icons/ti';
import PurpleButton from '../../../shared/components/buttons/PurpleButton';
import { IoClose } from 'react-icons/io5';
import { captionApi } from '../../../api/contentGenerationApi';
import QualityScoreIndicator from './QualityScoreIndicator';

// import { trackFeatureUsage } from "../helpers/analytics";

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

interface SocialMediaPostProps {
  day: number;
  postIndex: number;
  setOpen: React.Dispatch<React.SetStateAction<number>>;
  content: Post[] | Post;
  id: string;
  week: number;
  postingTime: string;
  brandName: string;
  onApprovalUpdate: (postIndex: number, isApproved: boolean) => void;
  updataImage: (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    imageUrl: string | null,
    newText: string
  ) => void;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}
const SocialMediaPost: React.FC<SocialMediaPostProps> = (props) => {
  const {
    day,
    setOpen: _setOpen,
    content,
    id,
    week,
    postIndex,
    brandName,
    onApprovalUpdate,
    selectedImages,
    setSelectedImages,
    postingTime,
    updataImage,
  } = props;

  const [loading, setLoading] = useState(false); // Loading state
  const [loadingRegen, setLoadingRegen] = useState(false); // Loading state
  const pRef = useRef(null);
  const { profile } = useAuth();
  const endpointUrl = getServiceURL('content-gen');
  const [imageLoading, setImageLoading] = useState(true); // Track loading state
  const [errorSaving, setErrorSaving] = useState(false); // Track loading state
  const [errorText, setErrorText] = useState(''); // Track loading state
  const [edit, setEdit] = useState<boolean>(false);
  const textareaRef = useRef(null);
  const [text, setText] = useState(content?.[postIndex - 1]?.text || '');
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [openModifyPrompt, setOpenModifyPrompt] = useState(false);
  const [expandImage, setExpandImage] = useState(false);

  const [remainingGenerations, setRemainingGenerations] = useState(2);
  const [totalAllowed, setTotalAllowed] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [captionMenuAnchor, setCaptionMenuAnchor] = useState<null | HTMLElement>(null);
  const captionMenuOpen = Boolean(captionMenuAnchor);
  const [currentQualityScore, setCurrentQualityScore] = useState<number>(0);
  const [showQualityScore, setShowQualityScore] = useState(false);

  const showCancelUI = hovering || loading;

  const validateTimezone = (timezone: string) => {
    return moment.tz.zone(timezone) !== null;
  };

  const handleApprove = async (state: boolean) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const validTimezone = validateTimezone(userTimezone) ? userTimezone : 'UTC';
    setLoading(true);
    setErrorSaving(false);

    const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;

    if (!currentPost) {
      setErrorText('Post data not found');
      setErrorSaving(true);
      setLoading(false);
      return;
    }

    const payload = {
      campaign_content_id: id,
      week: week,
      day: day + 1,
      approved: state,
      timezone: validTimezone,
      posts: {
        [`post_${postIndex}`]: {
          selected_image: currentPost.image_url?.[selectedImages[postIndex - 1] - 1] || '',
          text: currentPost.text || '',
        },
      },
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
      onApprovalUpdate(day, state);
      if (posthog.__loaded) {
        posthog.capture('Content Approved', {
          distinct_id: profile?.id,
          content_id: payload?.campaign_content_id,
        });
      }
    } catch (error: unknown) {
      console.error('Error fetching data:', JSON.stringify(error));
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      setErrorText(errorMessage);
      setErrorSaving(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const DisplayOptions = () => {
    const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
    if (!currentPost || currentPost?.image_url === undefined) return false;
    if (currentPost?.image_url?.length === 1) return false;
    return true;
  };

  const fetchRemainingGenerations = async () => {
    try {
      const endpointUrl = getServiceURL('content-gen');
      const params = new URLSearchParams();

      params.append('week_num', week.toString());
      params.append('day_num', (day + 1).toString());
      params.append('post_num', postIndex.toString());
      params.append('content_id', id);

      const response = await fetch(
        `${endpointUrl}/api/v1/contentgen/remaining_generations?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${profile?.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRemainingGenerations(data.remaining);
        setTotalAllowed(data.total_allowed);
      }
    } catch (error) {
      console.error('Error fetching remaining generations:', error);
    }
  };

  useEffect(() => {
    fetchRemainingGenerations();
  }, []);

  // Change regenerateImage to accept a prompt argument
  const regenerateImage = async (promptOverride?: string) => {
    const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
    if (!currentPost) {
      console.error('Cannot regenerate image: Post data not found');
      return;
    }

    try {
      setLoadingRegen(true);
      const endpointUrl = getServiceURL('content-gen');
      // Use promptOverride if provided, otherwise use currentPost.image_prompt
      const promptToUse = promptOverride ?? currentPost.image_prompt;
      const response = await fetch(`${endpointUrl}/api/v1/contentgen/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${profile?.token}`,
        },
        body: JSON.stringify({
          content_id: id,
          week_num: week,
          day_num: day + 1,
          post_num: postIndex,
          prompt: promptToUse,
        }),
      });

      const { url, newText } = await response.json();

      if (!response.ok) {
        throw new Error('Failed to regenerate image');
      }

      updataImage(week - 1, day, postIndex - 1, 0, url, newText);

      const newSelectedImages = [...selectedImages];
      newSelectedImages[postIndex - 1]++;
      setSelectedImages(newSelectedImages);
    } catch (e) {
      console.error('Error regenerating image:', (e as Error).message);
    } finally {
      setLoadingRegen(false);
    }
  };

  // Handler for the refresh button to always use the latest prompt from the backend
  const handleRegenerateClick = async () => {
    const endpointUrl = getServiceURL('content-gen');
    const params = new URLSearchParams();
    params.append('week_num', week.toString());
    params.append('day_num', (day + 1).toString());
    params.append('post_num', postIndex.toString());
    params.append('content_id', id);
    try {
      const response = await fetch(`${endpointUrl}/api/v1/image_prompt?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${profile?.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch prompt');
      const { prompt } = await response.json();
      await regenerateImage(prompt);
    } catch (e) {
      console.error('Error fetching prompt for regeneration:', e);
    }
  };

  const handleEdit = async () => {
    const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
    if (!currentPost) {
      console.error('Cannot edit text: Post data not found');
      return;
    }

    if (edit) {
      try {
        setIsLoadingText(true);
        const endpointUrl = getServiceURL('content-gen');
        const selectedImageIndex = selectedImages[postIndex - 1] - 1;

        // Create updated text versions array
        const updatedTextVersions = [...(currentPost.text_versions || [])];
        updatedTextVersions[selectedImageIndex] = text;

        const response = await fetch(`${endpointUrl}/api/v1/contentgen/update-text-versions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${profile?.token}`,
          },
          body: JSON.stringify({
            content_id: id,
            week_num: week,
            day_num: day + 1,
            post_num: postIndex,
            text: text,
            text_versions: updatedTextVersions,
            selected_image_index: selectedImageIndex,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update text versions');
        }

        // Update local state after successful backend update
        currentPost.text = text;
        currentPost.text_versions = updatedTextVersions;
        setEdit(false);
      } catch (error) {
        console.error('Error updating text versions:', error);
        setErrorText('Failed to update text versions');
        setErrorSaving(true);
      } finally {
        setIsLoadingText(false);
      }
    } else {
      // When starting to edit
      setText(currentPost.text || '');
      setEdit(true);
    }
  };

  const handleReselectText = async (index) => {
    try {
      setIsLoadingText(true);
      const endpointUrl = getServiceURL('content-gen');
      const response = await fetch(`${endpointUrl}/api/v1/contentgen/reselect-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${profile?.token}`,
        },
        body: JSON.stringify({
          content_id: id,
          week_num: week,
          day_num: day + 1,
          post_num: postIndex,
          index,
        }),
      });

      const { selectedText } = await response.json();

      if (!response.ok) {
        throw new Error('Failed to selext text');
      }

      updataImage(week - 1, day, postIndex - 1, 0, null, selectedText);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingText(false);
    }
  };

  function truncateText(text: string, limit: number = 300): string {
    const newText = text.length > limit ? text.slice(0, limit) + '...' : text;
    return newText;
  }

  // New function to generate captions using Caption Generator API
  const generateCaptionWithAI = async () => {
    const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
    if (!currentPost || !profile?.token) return;

    try {
      setIsLoadingText(true);

      // Determine scene type from image or content metadata
      const sceneType = currentPost.scene_type || 'lifestyle';

      const captionData = await captionApi.generateCaptions(
        id, // content ID
        {
          image_description: currentPost.image_prompt || '',
          scene_type: sceneType as any,
          brand_voice: brandName,
          target_audience: currentPost.target_audience,
          hashtags: currentPost.hashtags || [],
          max_length: 2200, // Instagram max
          include_cta: true,
          tone: currentPost.tone || 'casual',
        },
        profile.token
      );

      // Update the text with the best caption variant
      if (captionData.captions && captionData.captions.length > 0) {
        const bestCaption = captionData.captions[0]; // Usually sorted by score

        // Update text and save to backend
        setText(bestCaption.text);

        // Save the new caption to backend
        const endpointUrl = getServiceURL('content-gen');
        const selectedImageIndex = selectedImages[postIndex - 1] - 1;

        const updatedTextVersions = [...(currentPost.text_versions || [])];
        updatedTextVersions[selectedImageIndex] = bestCaption.text;

        await fetch(`${endpointUrl}/api/v1/contentgen/update-text-versions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${profile.token}`,
          },
          body: JSON.stringify({
            content_id: id,
            week_num: week,
            day_num: day + 1,
            post_num: postIndex,
            text: bestCaption.text,
            text_versions: updatedTextVersions,
            selected_image_index: selectedImageIndex,
          }),
        });

        // Update local state
        currentPost.text = bestCaption.text;
        currentPost.text_versions = updatedTextVersions;
        currentPost.caption_id = captionData.caption_id; // Store for regeneration
      }
    } catch (error) {
      console.error('Error generating caption:', error);
      setErrorText('Failed to generate caption');
      setErrorSaving(true);
    } finally {
      setIsLoadingText(false);
    }
  };

  // Function to regenerate caption with modifications
  const regenerateCaptionWithStyle = async (
    style: 'similar' | 'different' | 'shorter' | 'longer'
  ) => {
    const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;
    if (!currentPost || !profile?.token) return;

    try {
      setIsLoadingText(true);

      // Get current caption ID if stored, otherwise generate new
      const captionId = currentPost.caption_id || 'temp-' + Date.now();

      const captionData = await captionApi.regenerateCaption(
        id,
        captionId,
        {
          style,
          preserve_hashtags: true,
          custom_instruction: openModifyPrompt ? 'User requested modifications' : undefined,
        },
        profile.token
      );

      // Update text with regenerated caption
      if (captionData.caption) {
        setText(captionData.caption.text);
        handleEdit(); // Apply the regenerated caption
      }
    } catch (error) {
      console.error('Error regenerating caption:', error);
      setErrorText('Failed to regenerate caption');
      setErrorSaving(true);
    } finally {
      setIsLoadingText(false);
    }
  };

  const currentPost = Array.isArray(content) ? content[postIndex - 1] : content;

  return (
    <div className="border-[1px] border-[#E5E7EB] bg-white rounded-lg p-4 flex flex-col gap-2   h-full">
      <div className="flex items-center">
        <p className="text-[#6B7280] font-bold text-sm flex flex-row gap-3">
          Post {postIndex} <span className="font-normal text-sm text-[#6B7280]">{postingTime}</span>
        </p>
      </div>
      <div className="bg-white p-0 rounded-m flex flex-col items-start gap-2 lg:gap-8 xl:gap-9">
        <div className="border-[1px] border-[#E5E7EB] rounded-md w-full h-full lg:min-h-[220px] lg:min-w-[220px] xl:min-h-[300px] xl:min-w-[300px] 2xl:min-h-[524px] 2xl:min-w-[524px]">
          {(!currentPost || currentPost?.image_url === undefined || imageLoading) && (
            <div className="flex items-center w-full aspect-square justify-center">
              <CircularProgress />
            </div>
          )}
          {currentPost && currentPost?.image_url !== undefined && (
            <div className="w-full relative">
              <img
                src={currentPost?.image_url?.[selectedImages?.[postIndex - 1] - 1]}
                alt={`Post ${postIndex}`}
                className={`w-full object-cover rounded-md aspect-square  ${
                  imageLoading ? 'hidden' : 'block'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {currentPost?.approved !== true && (
                <div
                  className="absolute bottom-2 right-2 py-2 px-2 gap-4 
                      hover:cursor-pointer bg-white flex justify-center items-center rounded-sm"
                >
                  {loadingRegen ? (
                    <CircularProgress sx={{ color: '#6C2BD9' }} size={24} thickness={5} />
                  ) : (
                    <>
                      <button className="" onClick={() => setExpandImage(true)}>
                        <TiArrowMaximise color="#6C2BD9" size="30px" />
                      </button>
                      <button
                        onClick={() =>
                          remainingGenerations ? setOpenModifyPrompt(true) : setLimitReached(true)
                        }
                      >
                        <AutoAwesomeOutlinedIcon
                          sx={{
                            color: '#6C2BD9',
                            fontSize: '30px',
                          }}
                        />
                      </button>
                      <button
                        onClick={() =>
                          remainingGenerations ? handleRegenerateClick() : setLimitReached(true)
                        }
                      >
                        <IoMdRefresh color="#6C2BD9" size={24} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="relative border-[1px] border-[#E4E4E4] rounded-md p-2 w-full min-h-36 h-full ">
          {edit === true ? (
            <>
              <textarea
                ref={textareaRef}
                className="w-full font-[350] resize-none h-[100px]  2xl:h-[100px] focus:outline-none text-xs border-[0.5px] border-[#AAAAAA] text-black"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setShowQualityScore(true);
                }}
                onFocus={() => setShowQualityScore(true)}
              />
            </>
          ) : (
            <>
              {isLoadingText || loadingRegen ? (
                <div role="status" className="animate-pulse pt-2">
                  <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
                  <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
                  <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
                  <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
                  <div className="h-2 bg-gray-300 rounded-full max-w-[70%] mb-2.5"></div>
                </div>
              ) : (
                <p
                  ref={pRef}
                  className="text-xs font-normal text-black overflow-hidden text-ellipsis whitespace-normal break-words"
                >
                  {currentPost?.text || ''}
                </p>
              )}
            </>
          )}
          <div className="absolute bottom-2 right-2 flex flex-row gap-2 items-center justify-center">
            {currentPost?.approved !== true && (
              <>
                {/* AI Caption Generation Button */}
                {!edit && (
                  <>
                    <div
                      onClick={(e) => {
                        if (isLoadingText) return; // Prevent clicks while loading
                        if (currentPost?.caption_id) {
                          // If we have a caption, show dropdown for variations
                          setCaptionMenuAnchor(e.currentTarget);
                        } else {
                          // First time, generate new caption
                          generateCaptionWithAI();
                        }
                      }}
                      className={`border-[1px] border-[#E4E4E4] py-2 px-2 hover:cursor-pointer bg-white flex justify-center items-center rounded-sm transition-colors ${
                        isLoadingText ? 'opacity-50 cursor-wait' : 'hover:bg-purple-50'
                      }`}
                      title={
                        isLoadingText
                          ? 'Generating...'
                          : currentPost?.caption_id
                            ? 'Caption Variations'
                            : 'Generate AI Caption'
                      }
                    >
                      {isLoadingText ? (
                        <CircularProgress size={20} sx={{ color: '#6C2BD9' }} />
                      ) : (
                        <>
                          <AutoAwesomeOutlinedIcon sx={{ color: '#6C2BD9', fontSize: 24 }} />
                          {currentPost?.caption_id && (
                            <ArrowDropDownIcon
                              sx={{ color: '#6C2BD9', fontSize: 18, marginLeft: -0.5 }}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Caption Variations Menu */}
                    <Menu
                      anchorEl={captionMenuAnchor}
                      open={captionMenuOpen}
                      onClose={() => setCaptionMenuAnchor(null)}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <MenuItem
                        disabled={isLoadingText}
                        onClick={() => {
                          setCaptionMenuAnchor(null);
                          generateCaptionWithAI();
                        }}
                      >
                        Generate New
                      </MenuItem>
                      <MenuItem
                        disabled={isLoadingText}
                        onClick={() => {
                          setCaptionMenuAnchor(null);
                          regenerateCaptionWithStyle('similar');
                        }}
                      >
                        Similar Style
                      </MenuItem>
                      <MenuItem
                        disabled={isLoadingText}
                        onClick={() => {
                          setCaptionMenuAnchor(null);
                          regenerateCaptionWithStyle('different');
                        }}
                      >
                        Different Style
                      </MenuItem>
                      <MenuItem
                        disabled={isLoadingText}
                        onClick={() => {
                          setCaptionMenuAnchor(null);
                          regenerateCaptionWithStyle('shorter');
                        }}
                      >
                        Make Shorter
                      </MenuItem>
                      <MenuItem
                        disabled={isLoadingText}
                        onClick={() => {
                          setCaptionMenuAnchor(null);
                          regenerateCaptionWithStyle('longer');
                        }}
                      >
                        Make Longer
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {/* Manual Edit Button */}
                <div
                  onClick={handleEdit}
                  className={`${
                    edit === true ? 'opacity-15 hover:opacity-100' : ''
                  } border-[1px] border-[#E4E4E4] py-2 px-2 hover:cursor-pointer bg-white flex justify-center items-center rounded-sm`}
                >
                  {edit === true ? (
                    <FaCheck color="#6C2BD9" size={24} />
                  ) : (
                    <MdModeEdit color="#6C2BD9" size={24} />
                  )}
                </div>
              </>
            )}
            {edit === true && (
              <div
                onClick={() => setEdit(false)}
                className="border-[1px] border-[#E4E4E4] py-2 px-2 hover:cursor-pointer bg-white flex justify-center items-center rounded-sm opacity-15 hover:opacity-100"
              >
                <MdCancel color="#6C2BD9" size={24} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-col-reverse flex mt-0 gap-2 justify-end h-full `}>
        {DisplayOptions() && currentPost && (
          <div className="self-center">
            <PaginationImage
              images={currentPost.image_url}
              currentPage={selectedImages[postIndex - 1]}
              approved={currentPost.approved}
              onPageChange={(currentStep) => {
                const newSelectedImages = [...selectedImages];
                newSelectedImages[postIndex - 1] = currentStep;
                setSelectedImages(newSelectedImages);
                handleReselectText(currentStep - 1);
              }}
            />
          </div>
        )}
        <div className="self-end">
          {currentPost?.posted ? (
            <button
              className="bg-green-500 font-medium text-white w-24 rounded-md flex flex-row justify-center items-center text-base gap-2 px-2 py-2"
              disabled={true}
            >
              <FaCheck size="12px" />
              Posted
            </button>
          ) : !currentPost?.approved ? (
            <button
              onClick={() => handleApprove(true)}
              className="bg-[#FDF6B2] border-[1px] border-[#8E4B10] font-semibold text-[#8E4B10] rounded-md px-2 py-2 text-base flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress sx={{ color: '#000000' }} size={25} thickness={5} />
              ) : (
                <span className="flex items-center gap-2">
                  <IoMdCheckmark />
                  <span>Approve Post</span>
                </span>
              )}
            </button>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {showCancelUI ? (
                <button
                  onClick={() => handleApprove(false)}
                  disabled={loading}
                  className={`w-fit border-[1px] border-red-600 font-semibold text-red-800 rounded-md px-2 py-2 text-base flex justify-center items-center gap-2 ${
                    loading ? 'cursor-not-allowed bg-red-200' : 'bg-red-100 hover:bg-red-200'
                  }`}
                >
                  {loading ? (
                    <CircularProgress sx={{ color: '#000000' }} size={25} thickness={5} />
                  ) : (
                    <span className="flex gap-2 items-center">
                      <IoClose />

                      <span>Cancel approved</span>
                    </span>
                  )}
                </button>
              ) : (
                <div className="bg-[#DEF7EC] border-[1px] border-[#046C4E] font-semibold text-[#356751] rounded-md px-2 py-2 text-base flex justify-center items-center gap-2">
                  <MdOutlinePublishedWithChanges />
                  Ready to Publish
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ErrorToast message={errorText} open={errorSaving} onClose={() => setErrorSaving(false)} />
      <ModifyPrompt
        open={openModifyPrompt}
        setOpen={setOpenModifyPrompt}
        image={currentPost?.image_url?.[selectedImages?.[postIndex - 1] - 1]}
        week={week}
        day={day + 1}
        post={postIndex - 1}
        content_id={id}
        regenerate={regenerateImage}
        totalAllowed={totalAllowed}
      />
      {expandImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-h-full max-w-full">
            <button
              className=" flex justify-center items-center absolute right-0 text-white w-8 h-8 hover:bg-white/20 rounded-tr-lg"
              onClick={() => setExpandImage(false)}
            >
              <MdOutlineClose size={20} />
            </button>

            <img
              src={currentPost.image_url?.[selectedImages[postIndex - 1] - 1] || '/placeholder.svg'}
              className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setExpandImage(false)} />
        </div>
      )}

      <Dialog open={limitReached} onClose={() => setLimitReached(false)} maxWidth="sm" fullWidth>
        <DialogContent className="relative">
          <button
            className="absolute z-50 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setLimitReached(false)}
            aria-label="Close"
          >
            <MdClose size={20} />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-purple-600 mb-4">Regeneration Limit Reached</h2>
            <p className="text-gray-700 mb-6">
              You've hit your regeneration limit for this content. We'll keep you posted when
              Matchpoint Unlimited—with more regenerations—is ready for you.
            </p>

            <div className="flex flex-col gap-3">
              <PurpleButton
                onClick={() => {
                  setLimitReached(false);
                }}
              >
                Keep Current Image
              </PurpleButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Real-time Quality Score Display */}
      {edit && showQualityScore && text && (
        <div className="mt-4">
          <QualityScoreIndicator
            content={text}
            contentType="caption"
            brandContext={{
              brandId: brandName,
              campaignId: id,
            }}
            onScoreChange={(score) => {
              setCurrentQualityScore(score);
            }}
            showDetails={true}
            position="inline"
          />
        </div>
      )}
    </div>
  );
};

export default SocialMediaPost;
