import React, { useContext, useEffect, useRef, useState } from 'react';
import PaginationImage from './PaginationImage';
import { BsThreeDots } from 'react-icons/bs';
import InstagramIcons from '../InstagramIcons';
import Options from '../../../components/shared/Options';
import { BrandContext } from '../../brand/context/BrandContext';
import ModifyPromptForm from './ModifyPromptForm';
import { TiArrowMaximise } from 'react-icons/ti';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';
import { CircularProgress, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin, FaTiktok } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

interface Post {
  id: string;
  image_prompt: string;
  text: string;
  image_url: string[];
  posted: boolean;
  approved: boolean;
}

type Platform = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';
type DeviceType = 'mobile' | 'desktop';

interface PostPreviewProps {
  index: number;
  day: number;
  week: number;
  content: Post;
  brandName: string;
  imageIndex: number[];
  campaign_content_id: string;
  updataImage: (
    week: number,
    day: number,
    post: number,
    imageIndex: number,
    newImage: string | null,
    nexText: string
  ) => void;
}

const PostPreview = ({
  week,
  day,
  index,
  content,
  brandName,
  imageIndex,
  campaign_content_id,
  updataImage,
}: PostPreviewProps) => {
  const { businessInfo } = useContext(BrandContext);
  const [currentImage, setCurrentImage] = useState(1);
  const [edit, setEdit] = useState<boolean | string>(false);
  const textareaRef = useRef(null);
  const [text, setText] = useState(content.text);
  const [dimensions, setDimensions] = useState({ width: 192, height: 119 });
  const [openPrompt, setOpenPrompt] = useState(false);
  const [expandImage, setExpandImage] = useState(false);
  const { profile } = useAuth();

  // DEMO-3 Enhanced Preview Features
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');

  const pRef = useRef(null);

  const handleImageChange = (val: number) => {
    imageIndex[index] = val;
    setCurrentImage(val);
  };

  const formatText = (text: string, containerWidth: number, containerHeight: number) => {
    let truncatedText = text;

    const ellipsis = '...';
    const testElement = document.createElement('p');
    testElement.style.visibility = 'hidden';
    testElement.style.position = 'absolute';
    testElement.style.width = `${containerWidth}px`;
    testElement.style.height = `${containerHeight}px`;
    testElement.style.fontSize = '0.75rem'; // Match your Tailwind font-size
    testElement.style.lineHeight = '1rem'; // Adjust based on your text size
    testElement.style.whiteSpace = 'pre-wrap'; // Preserve new lines and white space
    testElement.style.wordBreak = 'break-word'; // Ensure long words break properly
    testElement.innerText = truncatedText;
    let count = 0;
    document.body.appendChild(testElement);

    while (testElement.scrollHeight > containerHeight && truncatedText.length > 0) {
      count++;
      truncatedText = truncatedText.slice(0, -1);
      testElement.innerText = truncatedText + ellipsis;
    }

    document.body.removeChild(testElement);
    if (count === 0) return truncatedText;
    return truncatedText + ellipsis;
  };

  const regenerateImage = async () => {
    try {
      const endpointUrl = getServiceURL('content-gen');
      const response = await fetch(`${endpointUrl}/api/v1/contentgen/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${profile?.token}`,
        },
        body: JSON.stringify({
          content_id: campaign_content_id,
          week_num: week,
          day_num: day,
          post_num: index + 1,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail);
      }
      const { url, newText } = await response.json();
      updataImage(week - 1, day - 1, index, imageIndex[index], url, newText);
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  useEffect(() => {
    if (pRef.current) {
      const { offsetWidth, offsetHeight } = pRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [content]);

  useEffect(() => {
    setText(content.text);
  }, [content]);

  useEffect(() => {
    if (edit === 'save') {
      console.log('edit === ', edit);
      content.text = text;
      setEdit(false);
    } else if (edit === false) {
      setText(content.text);
    }
  }, [edit]);

  const DisplayOptions = () => {
    if (content.image_url === undefined) return false;
    if (content.image_url.length === 1) return false;
    return true;
  };

  // Platform configurations for DEMO-3
  const platformConfigs = {
    instagram: {
      icon: FaInstagram,
      color: '#E4405F',
      aspectRatio: 'aspect-square',
      name: 'Instagram',
    },
    twitter: {
      icon: FaTwitter,
      color: '#1DA1F2',
      aspectRatio: 'aspect-[16/9]',
      name: 'Twitter',
    },
    facebook: {
      icon: FaFacebook,
      color: '#1877F2',
      aspectRatio: 'aspect-[16/9]',
      name: 'Facebook',
    },
    linkedin: {
      icon: FaLinkedin,
      color: '#0A66C2',
      aspectRatio: 'aspect-[16/9]',
      name: 'LinkedIn',
    },
    tiktok: {
      icon: FaTiktok,
      color: '#000000',
      aspectRatio: 'aspect-[9/16]',
      name: 'TikTok',
    },
  };

  const currentPlatform = platformConfigs[selectedPlatform];
  const PlatformIcon = currentPlatform.icon;

  console.log(content);
  return (
    <div className="flex flex-col gap-2 my-6 sm:my-0">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-sm text-gray-900">Post {index + 1}</h1>
        <div className="flex items-center gap-2">
          <Chip
            icon={<PlatformIcon />}
            label={currentPlatform.name}
            size="small"
            sx={{
              backgroundColor: currentPlatform.color,
              color: 'white',
              '& .MuiChip-icon': { color: 'white' },
            }}
          />
        </div>
      </div>

      {/* DEMO-3 Enhanced Controls */}
      <div className="flex gap-2 mb-2">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={selectedPlatform}
            label="Platform"
            onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
          >
            {Object.entries(platformConfigs).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <MenuItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Icon size={16} color={config.color} />
                    {config.name}
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Device</InputLabel>
          <Select
            value={deviceType}
            label="Device"
            onChange={(e) => setDeviceType(e.target.value as DeviceType)}
          >
            <MenuItem value="mobile">Mobile</MenuItem>
            <MenuItem value="desktop">Desktop</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div
        className={`flex flex-col bg-white rounded-lg border ${deviceType === 'mobile' ? 'w-full sm:w-[320px]' : 'w-full max-w-[500px]'} ${deviceType === 'mobile' ? 'aspect-[64/129]' : 'aspect-[3/2]'}`}
      >
        {/* Platform-specific header */}
        {selectedPlatform === 'instagram' && (
          <div className="flex flex-row justify-between items-center px-2 w-full h-[60px]">
            <div className="flex flex-row gap-2">
              {businessInfo.logo !== '' && (
                <div
                  style={{
                    backgroundImage: `url('https://storage.googleapis.com/matchpoint-brands-logos/${businessInfo.logo}')`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                  className="w-[32px] h-[32px] rounded-full"
                />
              )}

              <div className="flex flex-col gap-[1px] text-black">
                <h1 className="font-[556] text-xs capitalize">{brandName}</h1>
                <p className="font-[457] text-[10px] capitalize">{brandName}</p>
              </div>
            </div>
            <BsThreeDots color="#4F4F4F" size="20px" />
          </div>
        )}

        {/* Platform-specific content area */}
        {content?.image_url === undefined ? (
          <div className={`flex items-center w-full justify-center ${currentPlatform.aspectRatio}`}>
            <CircularProgress />
          </div>
        ) : (
          <div
            style={{
              backgroundImage: `url('${content?.image_url[currentImage - 1]}')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            className={`w-full ${currentPlatform.aspectRatio} relative`}
          >
            <div className="w-full h-full hover:bg-[#00000099] flex items-center justify-center group gap-4 ">
              {profile?.is_admin && (
                <button className="group-hover:block hidden" onClick={() => setOpenPrompt(true)}>
                  <AutoAwesomeOutlinedIcon sx={{ color: 'white', fontSize: '30px' }} />
                </button>
              )}
              <button className="group-hover:block hidden" onClick={() => setExpandImage(true)}>
                <TiArrowMaximise color="white" size="30px" />
              </button>
            </div>
          </div>
        )}
        {/* Platform-specific text area */}
        <div className="px-2 flex flex-col gap-[6px] flex-grow">
          {selectedPlatform === 'instagram' && (
            <>
              <InstagramIcons />
              <p className="font-[457] text-xs">2,563 likes</p>
            </>
          )}

          {selectedPlatform === 'twitter' && (
            <div className="flex items-center gap-2 py-2">
              <div className="flex flex-col gap-[1px] text-black">
                <h1 className="font-[556] text-sm">
                  @{brandName.toLowerCase().replace(/\s+/g, '')}
                </h1>
              </div>
            </div>
          )}

          {selectedPlatform === 'facebook' && (
            <div className="flex items-center gap-2 py-2 border-b">
              <div className="flex flex-col gap-[1px] text-black">
                <h1 className="font-[556] text-sm">{brandName}</h1>
                <p className="font-[400] text-xs text-gray-500">Sponsored</p>
              </div>
            </div>
          )}

          {selectedPlatform === 'linkedin' && (
            <div className="flex items-center gap-2 py-2 border-b">
              <div className="flex flex-col gap-[1px] text-black">
                <h1 className="font-[556] text-sm">{brandName}</h1>
                <p className="font-[400] text-xs text-gray-500">Company • Promoted</p>
              </div>
            </div>
          )}

          {edit === true ? (
            <textarea
              ref={textareaRef}
              className="flex-grow font-[350] resize-none focus:outline-none text-xs border-[0.5px] border-[#AAAAAA] text-black"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <p
              ref={pRef}
              className="flex-grow font-[350] text-xs text-black overflow-y-auto text-ellipsis whitespace-normal break-words"
            >
              {selectedPlatform === 'instagram' && (
                <span className="font-[556] text-xs capitalize">{`${brandName} `}</span>
              )}
              {formatText(text, dimensions.width, dimensions.height)}
            </p>
          )}
          {content.approved !== true && content.posted !== true && (
            <Options edit={edit} setEdit={setEdit} regenerateImage={regenerateImage} />
          )}
          {content.posted === true && (
            <button
              className="bg-green-500 mb-[13px] self-end font-medium p-1 text-white w-24 rounded-lg flex flex-row justify-center items-center text-sm gap-2"
              disabled={true}
            >
              <FaCheck size={16} />
              Posted
            </button>
          )}
        </div>
      </div>
      {DisplayOptions() && (
        <div className="w-full flex flex-row gap-2 items-center">
          <h1 className="font-medium text-sm text-black">Image Options:</h1>
          <PaginationImage
            totalPages={content?.image_url !== undefined ? content?.image_url.length : 0}
            approved={content?.approved}
            currentPage={currentImage}
            onPageChange={handleImageChange}
          />
        </div>
      )}
      <ModifyPromptForm
        open={openPrompt}
        setOpen={setOpenPrompt}
        week={week}
        day={day}
        post={index}
        content_id={campaign_content_id}
      />
      {expandImage && (
        <div
          className="fixed top-0 left-0 h-screen w-screen bg-[#00000080] px-3 flex items-center justify-center backdrop:blur-lg"
          onClick={() => setExpandImage(false)}
        >
          <div
            style={{
              backgroundImage: `url('${content.image_url[currentImage - 1]}')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            className="w-full max-w-[600px] aspect-square"
          />
        </div>
      )}
      {/* <ErrorToast
        message={errorText}
        open={errorSaving}
        onClose={() => setErrorSaving(false)}
      /> */}
    </div>
  );
};

export default PostPreview;
