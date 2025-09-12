import React from 'react';
interface Stats {
    approved: number;
    ready_for_review: number;
}
interface Campaign {
    campaign_data: {
        campaign_variables: {
            durationNum: number;
            start_date: string;
        };
        biz_variables: {
            brand_name: string;
        };
    };
}
declare const ContentLibrary: ({ campaign, setStats, }: {
    campaign: Campaign | null;
    setStats: React.Dispatch<React.SetStateAction<Stats>>;
}) => any;
export default ContentLibrary;
