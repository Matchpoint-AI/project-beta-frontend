import posthog from "./posthog";

// User Activation & Onboarding Events
export const trackFirstVisit = () => {
   posthog.capture("First Time Visit");
};

export const trackOnboardingStep = (step: string, timeSpent: number) => {
   posthog.capture("Onboarding Step", {
      step,
      time_spent: timeSpent,
   });
};

export const trackOnboardingComplete = (totalTime: number) => {
   posthog.capture("Onboarding Complete", {
      total_time: totalTime,
   });
};

// Brand Profile Events
export const trackBrandProfileEdit = (
   field: string,
   isPrePopulated: boolean
) => {
   posthog.capture("Brand Profile Edit", {
      field,
      is_prepopulated: isPrePopulated,
      timestamp: new Date().toISOString(),
   });
};

export const trackBrandGuideUpload = (type: "logo" | "guide") => {
   posthog.capture("Brand Guide Upload", {
      type,
      timestamp: new Date().toISOString(),
   });
};

// Campaign Brief Events
export const trackCampaignBriefCreation = (
   campaignType: "awareness" | "conversion",
   duration: number,
   timeSpent: number
) => {
   posthog.capture("Campaign Brief Created", {
      campaign_type: campaignType,
      duration_weeks: duration,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
   });
};

// Campaign Operations Events
export const trackImageApproval = (
   campaignId: string,
   approved: boolean,
   isRegeneration: boolean
) => {
   posthog.capture("Image Review", {
      campaign_id: campaignId,
      approved,
      is_regeneration: isRegeneration,
      timestamp: new Date().toISOString(),
   });
};

export const trackCampaignPublish = (
   campaignId: string,
   weekCount: number,
   totalPosts: number
) => {
   posthog.capture("Campaign Published", {
      campaign_id: campaignId,
      week_count: weekCount,
      total_posts: totalPosts,
      timestamp: new Date().toISOString(),
   });
};

// Content Creation Events
export const trackContentReview = (
   campaignId: string,
   contentType: "image" | "caption",
   timeSpent: number,
   action: "view" | "approve" | "regenerate" | "edit"
) => {
   posthog.capture("Content Review", {
      campaign_id: campaignId,
      content_type: contentType,
      time_spent: timeSpent,
      action,
      timestamp: new Date().toISOString(),
   });
};

// Publishing Events
export const trackContentPublish = (
   campaignId: string,
   contentId: string,
   success: boolean,
   errorMessage?: string
) => {
   posthog.capture("Content Publish", {
      campaign_id: campaignId,
      content_id: contentId,
      success,
      error_message: errorMessage,
      timestamp: new Date().toISOString(),
   });
};

// Download Events
export const trackContentDownload = (
   campaignId: string,
   contentId: string,
   contentType: "image" | "caption"
) => {
   posthog.capture("Content Download", {
      campaign_id: campaignId,
      content_id: contentId,
      content_type: contentType,
      timestamp: new Date().toISOString(),
   });
};

// Feature Usage Events
export const trackFeatureUsage = (
   feature: string,
   action: string,
   timeSpent?: number
) => {
   posthog.capture("Feature Usage", {
      feature,
      action,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
   });
};

// User Retention Events
export const trackUserReturn = (daysSinceLastVisit: number) => {
   posthog.capture("User Return", {
      days_since_last_visit: daysSinceLastVisit,
      timestamp: new Date().toISOString(),
   });
};

// Session tracking
let sessionStartTime: number | null = null;

export const startSessionTimer = () => {
   sessionStartTime = Date.now();
};

export const endSessionTimer = (activity: string) => {
   if (sessionStartTime) {
      const duration = Date.now() - sessionStartTime;
      posthog.capture("Session Duration", {
         activity,
         duration_ms: duration,
         timestamp: new Date().toISOString(),
      });
      sessionStartTime = null;
   }
};

// Enhanced Brand Profile Session Tracking
export const trackBrandProfileSession = (
   startTime: number,
   endTime: number,
   approved: boolean
) => {
   const duration = endTime - startTime;
   posthog.capture("Brand Profile Session", {
      duration_ms: duration,
      approved,
      timestamp: new Date().toISOString(),
   });
};

// Content Review Tracking
export const trackDaysSinceLastReview = (
   campaignId: string,
   contentType: "image" | "caption",
   daysSinceLastReview: number
) => {
   posthog.capture("Days Since Last Review", {
      campaign_id: campaignId,
      content_type: contentType,
      days_since_last_review: daysSinceLastReview,
      timestamp: new Date().toISOString(),
   });
};

export const trackDaysSinceLastApproval = (
   campaignId: string,
   contentType: "image" | "caption",
   daysSinceLastApproval: number
) => {
   posthog.capture("Days Since Last Approval", {
      campaign_id: campaignId,
      content_type: contentType,
      days_since_last_approval: daysSinceLastApproval,
      timestamp: new Date().toISOString(),
   });
};
