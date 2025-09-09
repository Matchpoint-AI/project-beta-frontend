import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { getServiceURL } from '../../../helpers/getServiceURL';

const CardStats = ({ id }: { id: string }) => {
  const { profile } = useAuth();
  const [totalContent, setTotalContent] = useState(0);
  const [approved, setApproved] = useState(0);
  const [readyForReview, setReadyForReview] = useState(0);
  const [generating, setGenerating] = useState(0);
  const endpointUrl = getServiceURL('data');
  useEffect(() => {
    if (profile?.token === '' || id === undefined) return;
    const params = new URLSearchParams({
      query_kind: 'generated_content',
      id: id as string,
    });
    const fetchSingleWeek = async () => {
      try {
        const response = await fetch(
          endpointUrl + `/api/v1/data/get/complex?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${profile?.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        if (data.length === 0) {
          return;
        }

        const { total_content, approved: approv, ready_for_review, generating } = data[0];
        setTotalContent(total_content);
        setApproved(approv);
        setReadyForReview(ready_for_review);
        setGenerating(generating);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSingleWeek();
  }, [profile, id]);

  return (
    <div className="flex sm:flex-row flex-col items-start gap-1 w-full">
      <div className="flex flex-row gap-1 lg:gap-1">
        {totalContent !== 0 && (
          <div className="text-center flex justify-center gap-3">
            <p className="text-[#6B7280] font-semibold text-xs">Total Content</p>
            <p className="text-xs font-bold bg-[#E1EFFE] text-[#1E429F] w-10 h-5 rounded-md flex items-center justify-center">
              {totalContent}
            </p>
          </div>
        )}
        {approved !== 0 && (
          <div className="text-center flex justify-center gap-3">
            <p className="text-[#6B7280] font-semibold text-xs">Approved</p>
            <p className="text-xs font-bold bg-[#DEF7EC] text-[#03543F] w-10 h-5 rounded-md flex items-center justify-center">
              {approved}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row gap-1 lg:gap-1">
        {readyForReview !== 0 && (
          <div className="text-center flex justify-center gap-3">
            <p className="text-[#6B7280] font-semibold text-xs">Ready For Review</p>
            <p className="text-xs font-bold bg-[#FDF6B2] text-[#8E4B10] w-10 h-5 rounded-md flex items-center justify-center">
              {readyForReview}
            </p>
          </div>
        )}
        {generating !== 0 && (
          <div className="text-center flex justify-center gap-3">
            <p className="text-[#6B7280] font-semibold text-xs">Generating</p>
            <p className="text-xs font-bold bg-[#FBD5D5] text-[#8E4B10] w-10 h-5 rounded-md flex items-center justify-center">
              {generating}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardStats;
