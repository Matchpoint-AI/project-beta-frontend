// Calendar.tsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, momentLocalizer, ToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CampaignToolBar from './CampaignToolBar';
import MonthHeader from './MonthHeader';
import EventWrapper from './EventWrapper';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useParams } from 'react-router-dom';
import { getServiceURL } from '../../helpers/getServiceURL';

interface Campaign {
  campaign_id: string;
  thread_id?: string;
  status: string;
  timestamp: string;
  campaign_data: {
    campaign_variables: {
      name: string;
      product_service: string;
      start_date: string;
      duration: string;
      audience_ethnicity: string[];
      emotion: string[];
      audience_interests: string[];
      product_service_description: string;
      purpose_topic: string;
      scene: string[];
      currentStep: number;
      key_feature: string[];
      purpose: string;
      audience_gender: string[];
      audience_age: string[];
      postingFrequency: number;
      deliveryDay: string;
      summary: string;
      frequency: number;
      durationNum: number;
    };
    biz_variables: {
      brand_name: string;
      [key: string]: unknown;
    };
  };
}

interface CalendarCampaignProps {
  campaign: Campaign;
}

interface DateCellProps {
  label: string;
}

const DateCell = (props: DateCellProps) => {
  const parseData = () => {
    const val = parseInt(props.label, 10).toString();
    return val;
  };
  return (
    <div className="font-medium text-base border-1 w-fit h-fit border-gray-200 float-end">
      {parseData()}
    </div>
  );
};

interface PostData {
  approved: boolean;
  text: string;
  selected_image: string;
  timing: string;
  [key: string]: unknown;
}

interface WeekData {
  [key: string]: {
    approved: boolean;
    posts_to_generate: number;
    [key: string]: unknown;
  };
}

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  status: string;
  posts: PostData[];
  [key: string]: unknown;
}

const CalendarCampaign: React.FC<CalendarCampaignProps> = ({ campaign }) => {
  const localizer = useMemo(() => momentLocalizer(moment), []);
  const calendarRef = useRef(null);
  const { profile } = useAuth();
  const { id } = useParams();
  const [events, setEvents] = useState<MyEvent[]>([]);
  const components = useMemo(() => {
    return {
      eventWrapper: EventWrapper, // wrapper for the event component
      toolbar: CampaignToolBar,
      month: {
        header: MonthHeader,
        dateHeader: DateCell,
        // event: EventWrapper,
      },
    };
  }, []);

  const endpointUrl = getServiceURL('data');
  useEffect(() => {
    if (profile?.token === '') return;
    const params = new URLSearchParams({
      query_kind: 'generated_content',
      id: id as string,
      week: '1',
    });
    const createEvents = (weekDataArray: WeekData[]) => {
      const dateString = campaign.campaign_data.campaign_variables.start_date;
      const [month, day, year] = dateString.split('/');
      const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      // Define time slots mapping based on number of posts
      const timeSlotsMapping: { [key: number]: string[] } = {
        1: ['9 AM'],
        2: ['9 AM', '12 PM'],
        3: ['9 AM', '2 PM', '5 PM'],
        4: ['9 AM', '12 PM', '2 PM', '5 PM'],
      };

      // Initialize an empty array to store all events
      const allEvents: MyEvent[] = [];

      // Loop through each weekData in the array
      weekDataArray.forEach((weekData) => {
        const eventsForWeek = Array.from({ length: 7 }, (_, index) => {
          const currentDay = new Date(startDate);
          currentDay.setDate(startDate.getDate() + index);

          const dayKey = `day_${index + 1}`;
          const dayData = weekData[dayKey];
          console.log('dayData === ', dayData);

          let status = '';
          if (dayData.approved) status = 'approved';
          else if (!dayData.approved && dayData.posts_to_generate === 0) status = 'review';
          else if (!dayData.approved && dayData.posts_to_generate > 0) status = 'generate';

          // Get all keys that start with "post_"
          const postKeys = Object.keys(dayData).filter((key) => key.startsWith('post_'));
          // Sort keys numerically (e.g., "post_1", "post_2", ...)
          postKeys.sort((a, b) => {
            const numA = parseInt(a.split('_')[1], 10);
            const numB = parseInt(b.split('_')[1], 10);
            return numA - numB;
          });
          const numberOfPosts = postKeys.length;

          let timeSlots = timeSlotsMapping[numberOfPosts];
          if (!timeSlots) {
            timeSlots = timeSlotsMapping[4] || ['9 AM', '12 PM', '2 PM', '5 PM'];
          }

          // Build the posts array for this day
          const postsForDay = postKeys.map((key, i) => ({
            ...(dayData[key] as PostData),
            timing: timeSlots[i] || timeSlots[timeSlots.length - 1],
          }));

          return {
            title: `Day ${index + 1}`,
            start: currentDay,
            end: currentDay,
            status,
            posts: postsForDay,
          };
        });

        // Combine events for the current week with the overall array
        allEvents.push(...eventsForWeek);
      });

      // Return all events combined
      return allEvents;
    };
    const fetchContentGenerated = async () => {
      try {
        const response = await fetch(
          endpointUrl + `/api/v1/data/get/complex?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${profile?.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log('data:', data);
        if (data.length === 0 || data.arr[0].length === 0) {
          // navigate("/dashboard");
          return;
        }
        console.log('newData1 === ', data.arr[0]);
        const eventsArr = createEvents(data.arr[0]);
        setEvents(eventsArr);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchContentGenerated();
  }, [profile]);

  return (
    <div className="h-screen mt-5 mb-5 py-0 text-gray-900">
      <Calendar
        className="border-none"
        ref={calendarRef}
        culture="en-US"
        localizer={localizer}
        events={events}
        components={components}
        views={['month']}
        defaultView="month"
      />
    </div>
  );
};

export default CalendarCampaign;
