import posthog from './posthog';
// User Activation & Onboarding Events
export var trackFirstVisit = function () {
    posthog.capture('First Time Visit');
};
export var trackOnboardingStep = function (step, timeSpent) {
    posthog.capture('Onboarding Step', {
        step: step,
        time_spent: timeSpent,
    });
};
export var trackOnboardingComplete = function (totalTime) {
    posthog.capture('Onboarding Complete', {
        total_time: totalTime,
    });
};
// Brand Profile Events
export var trackBrandProfileEdit = function (field, isPrePopulated) {
    posthog.capture('Brand Profile Edit', {
        field: field,
        is_prepopulated: isPrePopulated,
        timestamp: new Date().toISOString(),
    });
};
export var trackBrandGuideUpload = function (type) {
    posthog.capture('Brand Guide Upload', {
        type: type,
        timestamp: new Date().toISOString(),
    });
};
// Campaign Brief Events
export var trackCampaignBriefCreation = function (campaignType, duration, timeSpent) {
    posthog.capture('Campaign Brief Created', {
        campaign_type: campaignType,
        duration_weeks: duration,
        time_spent: timeSpent,
        timestamp: new Date().toISOString(),
    });
};
// Campaign Operations Events
export var trackImageApproval = function (campaignId, approved, isRegeneration) {
    posthog.capture('Image Review', {
        campaign_id: campaignId,
        approved: approved,
        is_regeneration: isRegeneration,
        timestamp: new Date().toISOString(),
    });
};
export var trackCampaignPublish = function (campaignId, weekCount, totalPosts) {
    posthog.capture('Campaign Published', {
        campaign_id: campaignId,
        week_count: weekCount,
        total_posts: totalPosts,
        timestamp: new Date().toISOString(),
    });
};
// Content Creation Events
export var trackContentReview = function (campaignId, contentType, timeSpent, action) {
    posthog.capture('Content Review', {
        campaign_id: campaignId,
        content_type: contentType,
        time_spent: timeSpent,
        action: action,
        timestamp: new Date().toISOString(),
    });
};
// Publishing Events
export var trackContentPublish = function (campaignId, contentId, success, errorMessage) {
    posthog.capture('Content Publish', {
        campaign_id: campaignId,
        content_id: contentId,
        success: success,
        error_message: errorMessage,
        timestamp: new Date().toISOString(),
    });
};
// Download Events
export var trackContentDownload = function (campaignId, contentId, contentType) {
    posthog.capture('Content Download', {
        campaign_id: campaignId,
        content_id: contentId,
        content_type: contentType,
        timestamp: new Date().toISOString(),
    });
};
// Feature Usage Events
export var trackFeatureUsage = function (feature, action, timeSpent) {
    posthog.capture('Feature Usage', {
        feature: feature,
        action: action,
        time_spent: timeSpent,
        timestamp: new Date().toISOString(),
    });
};
// User Retention Events
export var trackUserReturn = function (daysSinceLastVisit) {
    posthog.capture('User Return', {
        days_since_last_visit: daysSinceLastVisit,
        timestamp: new Date().toISOString(),
    });
};
// Session tracking
var sessionStartTime = null;
export var startSessionTimer = function () {
    sessionStartTime = Date.now();
};
export var endSessionTimer = function (activity) {
    if (sessionStartTime) {
        var duration = Date.now() - sessionStartTime;
        posthog.capture('Session Duration', {
            activity: activity,
            duration_ms: duration,
            timestamp: new Date().toISOString(),
        });
        sessionStartTime = null;
    }
};
// Enhanced Brand Profile Session Tracking
export var trackBrandProfileSession = function (startTime, endTime, approved) {
    var duration = endTime - startTime;
    posthog.capture('Brand Profile Session', {
        duration_ms: duration,
        approved: approved,
        timestamp: new Date().toISOString(),
    });
};
// Content Review Tracking
export var trackDaysSinceLastReview = function (campaignId, contentType, daysSinceLastReview) {
    posthog.capture('Days Since Last Review', {
        campaign_id: campaignId,
        content_type: contentType,
        days_since_last_review: daysSinceLastReview,
        timestamp: new Date().toISOString(),
    });
};
export var trackDaysSinceLastApproval = function (campaignId, contentType, daysSinceLastApproval) {
    posthog.capture('Days Since Last Approval', {
        campaign_id: campaignId,
        content_type: contentType,
        days_since_last_approval: daysSinceLastApproval,
        timestamp: new Date().toISOString(),
    });
};
//# sourceMappingURL=analytics.js.map