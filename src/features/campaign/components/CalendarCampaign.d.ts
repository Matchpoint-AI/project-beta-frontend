import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
declare const CalendarCampaign: React.FC<CalendarCampaignProps>;
export default CalendarCampaign;
