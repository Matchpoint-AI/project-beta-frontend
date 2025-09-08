import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { getServiceURL } from '../../helpers/getServiceURL';
import LoadingModal from '../ExportLoading';
import {
  createImageThumbnailsPDF,
  createWordDocument,
  fetchAndCreatePDF,
  organizeAndSavePosts,
} from '../../helpers/exportUtils';
import WeekSelector from './WeekSelector';
import ExportButton from './ExportButton';
import ErrorDisplay from '../ErrorDisplay';
import ApproveButton from '../ApproveButton';
import ErrorToast from '../shared/ErrorToast';
import ExportPopup from './ExportPopup';
import { capitalizeFirstLetterOfEachWord, structureData } from '../../helpers/formatters';
import posthog from '../../helpers/posthog';
import { CampaignInfoType } from '../../context/CampaignContext';
// import ApprovePopup from "./ApprovePopup";
// import { CircularProgress } from "@mui/material";

type Step = {
  label: string;
  loading: boolean;
  complete: boolean;
};

const ExportComponent = ({ campaign }: { campaign: CampaignInfoType }) => {
  const [currentValues, setCurrentValues] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  // const [weeksData, setWeeksData] = useState([]);
  const [error, setError] = useState('');
  const [double, setDouble] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorSaving, setErrorSaving] = useState(false);
  const [errorText, setErrorText] = useState('');
  // const [contentId, setContentId] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup
  const [steps, setSteps] = useState<Step[]>([
    {
      label: 'Campaign Brief/Brand Profile PDF',
      loading: true,
      complete: false,
    },
    { label: 'Image Thumbnail PDF', loading: false, complete: false },
    { label: 'Copy Word Document', loading: false, complete: false },
    { label: 'Content Folder', loading: false, complete: false },
  ]);

  const { profile } = useAuth();
  const { id } = useParams();
  const endpointUrl = getServiceURL('content-gen');

  useEffect(() => {
    if (!campaign) return;

    const calculateWeeks = () => {
      const numberOfWeeks = campaign?.campaign_data?.campaign_variables.durationNum;
      const startDate = new Date(campaign?.campaign_data?.campaign_variables.start_date || ''); // Assuming start_date is in a valid date format
      const today = new Date();
      const daysSinceStart = Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ); // Convert time difference to days

      let options = [];

      if (daysSinceStart < 0) {
        // If the current date is earlier than the start date, show only Week 1
        options = ['Week 1'];
      } else {
        const currentWeek = Math.floor(daysSinceStart / 7) + 1;

        options = Array.from({ length: numberOfWeeks ?? 0 }, (_, i) => {
          const weekNumber = i + 1;

          // Include only past weeks and the next upcoming week with one day left
          if (
            weekNumber <= currentWeek ||
            (weekNumber === currentWeek + 1 && daysSinceStart % 7 >= 6)
          ) {
            return `Week ${weekNumber}`;
          }

          return null;
        }).filter((option): option is string => option !== null); // Remove null values
      }

      setOptions(options);
    };

    calculateWeeks();
  }, [campaign]);

  const updateStep = (index: number, status: Partial<Step>) => {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, ...status } : step)));
  };

  const emptyLoading = () => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => ({ ...step, loading: false, complete: false })),
    );
  };
  const fetchWeeksData = async () => {
    try {
      console.log('id === ', id);
      const params = new URLSearchParams({
        campaign_id: id as string,
      });
      const response = await fetch(`${endpointUrl}/api/v1/get-content?${params.toString()}`, {
        method: 'GET',
        headers: { 
          Authorization: `Bearer ${profile?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      if (data.length === 0 || data.arr[0].length === 0) return;
      console.log('data from fetch === ', data);
      // setContentId(data.id);
      const data2 = structureData(data.arr);
      console.log('data after structure === ', data2);
      return { weeks: data2, contentId: data.id };
      // setWeeksData(data2);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateZip = async () => {
    const zip = new JSZip();
    const bigFolder = zip.folder(`Campaign_data`);

    try {
      const fetchedData = await fetchWeeksData();
      if (!fetchedData) {
        throw new Error('No data fetched');
      }

      const { weeks: weeksData, contentId } = fetchedData;
      // const { weeks: weeksData, id } = await fetchWeeksData();
      console.log('weeks === ', weeksData);
      console.log('id === ', id);
      // return;
      const data = weeksData
        .filter((_, weekIndex) => currentValues.includes(`Week ${weekIndex + 1}`))
        .map((week) => {
          // Map through each day in the week
          return week
            .map((day) => {
              // Filter posts within the day that are approved
              const approvedPosts = day.posts.filter((post) => post.approved === true);

              // Only include the day if it has approved posts
              if (approvedPosts.length > 0) {
                return {
                  ...day,
                  posts: approvedPosts, // Replace posts with only the approved ones
                };
              }
              return null; // Mark day for exclusion if no posts are approved
            })
            .filter((day) => day !== null); // Remove days with no approved posts
        })
        .filter((week) => week.length > 0); // Remove weeks with no approved days
      if (data.length === 0) throw new Error('Failed to fetch data');

      updateStep(0, { loading: true });
      const brandProfilePDF = await fetchAndCreatePDF(
        id as string,
        getServiceURL('data'),
        profile?.token || '',
      );
      if (brandProfilePDF) bigFolder?.file('BrandProfile_CampaignBrief.pdf', brandProfilePDF);
      updateStep(0, { loading: false, complete: true });

      updateStep(1, { loading: true });
      const imageThumbnailsPDF = await createImageThumbnailsPDF(data, currentValues);
      bigFolder?.file('ImageThumbnails.pdf', imageThumbnailsPDF);
      updateStep(1, { loading: false, complete: true });

      updateStep(2, { loading: true });
      const wordDoc = await createWordDocument(data, currentValues);
      bigFolder?.file('CopyContent.docx', wordDoc);
      updateStep(2, { loading: false, complete: true });

      updateStep(3, { loading: true });
      await organizeAndSavePosts(data, bigFolder, currentValues);
      updateStep(3, { loading: false, complete: true });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'exported_content.zip');
      emptyLoading();

      try {
        const endpointUrl = getServiceURL('content-gen');
        const response = await fetch(`${endpointUrl}/api/v1/contentgen/track-export`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${profile?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaign_id: id as string,
          }),
        });

        if (!response.ok) {
          console.error('Failed to track exported posts');
        }
      } catch (error) {
        console.error('Error tracking exported posts:', error);
      }
      if (posthog.__loaded) {
        posthog.capture('Content Exported', {
          distinct_id: profile?.id || '',
          content_id: contentId,
        });
      }

      setShowPopup(true); // Show the popup after successful export
    } catch (error) {
      console.error('Error during export:', error);
      setError('An error occurred during export.');
    }
  };

  const handleExport = async () => {
    setError('');
    if (currentValues.length === 0) {
      setError('Specify Week Content To Be Exported');
      return;
    }
    // const result = await checkApproved();
    // if (result === true) return;
    setDouble(true);
    setLoadingModalOpen(true);
    await generateZip();
    setDouble(false);
    setLoadingModalOpen(false);
  };

  const handleApproveAll = async () => {
    setError('');
    if (currentValues.length === 0) {
      setError('Specify Week Content To Be Approved');
      return;
    }
    console.log('currentValues === ', currentValues);
    const transformedWeeks = currentValues.map((week) => week.toLowerCase().replace(' ', '_'));
    setLoading(true);
    const endpointUrl = getServiceURL('data');
    try {
      const response = await fetch(`${endpointUrl}/api/v1/approve-all`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${profile?.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: id as string,
          weeks: transformedWeeks, // Send weeks to approve
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve all posts.');
      }

      const data = await response.json();
      console.log('Approval Success:', data);
      setSuccess(true);
      setErrorText('You Can Export The Specified Week');
      setErrorSaving(true); // Display error toast
    } catch (error) {
      console.error('Error:', error);
      setSuccess(false);
      setErrorSaving(true); // Display error toast
      setErrorText('An Error Occurred, Try Again Later!!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full items-center my-32 gap-6">
      <>
        <div className="flex justify-center">
          <div className="w-[393px] p-[30px] bg-white rounded-lg shadow border border-gray-200 flex-col justify-center items-center gap-5 inline-flex">
            <h1 className="self-stretch text-center text-gray-900 text-xl font-semibold">
              Export Content
            </h1>
            <WeekSelector
              options={options}
              currentValues={currentValues}
              setCurrentValues={setCurrentValues}
            />
            <div className="w-full flex flex-row justify-evenly items-center">
              <ExportButton double={double} handleExport={handleExport} />
              {/*  <ApproveButton
                double={double}
                handleApproveAll={handleApproveAll}
                loading={loading}
              />   */}
            </div>
            <ErrorDisplay error={error} />
          </div>
        </div>
        <LoadingModal steps={steps} isOpen={loadingModalOpen} />
        <ErrorToast
          message={errorText}
          open={errorSaving}
          success={success}
          onClose={() => setErrorSaving(false)}
        />
        {showPopup && (
          <ExportPopup
            campaignName={capitalizeFirstLetterOfEachWord(
              campaign?.campaign_data?.campaign_variables?.name || '',
            )}
            onClose={() => setShowPopup(false)}
          />
        )}
      </>
    </div>
  );
};

export default ExportComponent;
