import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as analytics from './analytics';
import posthog from './posthog';

// Mock the posthog module
vi.mock('./posthog', () => ({
  default: {
    capture: vi.fn(),
  },
}));

describe('Analytics Helper Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock Date.now() for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
  });

  afterEach(() => {
    // Restore real timers
    vi.useRealTimers();
  });

  describe('User Activation & Onboarding Events', () => {
    it('should track first visit', () => {
      // Arrange
      const expectedEvent = 'First Time Visit';

      // Act
      analytics.trackFirstVisit();

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith(expectedEvent);
    });

    it('should track onboarding step with time spent', () => {
      // Arrange
      const step = 'profile_setup';
      const timeSpent = 5000;

      // Act
      analytics.trackOnboardingStep(step, timeSpent);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Onboarding Step', {
        step,
        time_spent: timeSpent,
      });
    });

    it('should track onboarding completion', () => {
      // Arrange
      const totalTime = 120000;

      // Act
      analytics.trackOnboardingComplete(totalTime);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Onboarding Complete', {
        total_time: totalTime,
      });
    });
  });

  describe('Brand Profile Events', () => {
    it('should track brand profile edit with prepopulated flag', () => {
      // Arrange
      const field = 'company_name';
      const isPrePopulated = true;

      // Act
      analytics.trackBrandProfileEdit(field, isPrePopulated);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Brand Profile Edit', {
        field,
        is_prepopulated: isPrePopulated,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track brand guide upload for logo', () => {
      // Arrange
      const type = 'logo';

      // Act
      analytics.trackBrandGuideUpload(type);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Brand Guide Upload', {
        type,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track brand guide upload for guide', () => {
      // Arrange
      const type = 'guide';

      // Act
      analytics.trackBrandGuideUpload(type);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Brand Guide Upload', {
        type,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Campaign Brief Events', () => {
    it('should track campaign brief creation for awareness campaign', () => {
      // Arrange
      const campaignType = 'awareness';
      const duration = 4;
      const timeSpent = 30000;

      // Act
      analytics.trackCampaignBriefCreation(campaignType, duration, timeSpent);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Campaign Brief Created', {
        campaign_type: campaignType,
        duration_weeks: duration,
        time_spent: timeSpent,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track campaign brief creation for conversion campaign', () => {
      // Arrange
      const campaignType = 'conversion';
      const duration = 8;
      const timeSpent = 45000;

      // Act
      analytics.trackCampaignBriefCreation(campaignType, duration, timeSpent);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Campaign Brief Created', {
        campaign_type: campaignType,
        duration_weeks: duration,
        time_spent: timeSpent,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Campaign Operations Events', () => {
    it('should track image approval', () => {
      // Arrange
      const campaignId = 'camp-123';
      const approved = true;
      const isRegeneration = false;

      // Act
      analytics.trackImageApproval(campaignId, approved, isRegeneration);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Image Review', {
        campaign_id: campaignId,
        approved,
        is_regeneration: isRegeneration,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track image rejection with regeneration', () => {
      // Arrange
      const campaignId = 'camp-456';
      const approved = false;
      const isRegeneration = true;

      // Act
      analytics.trackImageApproval(campaignId, approved, isRegeneration);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Image Review', {
        campaign_id: campaignId,
        approved,
        is_regeneration: isRegeneration,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track campaign publish', () => {
      // Arrange
      const campaignId = 'camp-789';
      const weekCount = 4;
      const totalPosts = 28;

      // Act
      analytics.trackCampaignPublish(campaignId, weekCount, totalPosts);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Campaign Published', {
        campaign_id: campaignId,
        week_count: weekCount,
        total_posts: totalPosts,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Content Creation Events', () => {
    it('should track content review for image view', () => {
      // Arrange
      const campaignId = 'camp-111';
      const contentType = 'image';
      const timeSpent = 15000;
      const action = 'view';

      // Act
      analytics.trackContentReview(campaignId, contentType, timeSpent, action);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Content Review', {
        campaign_id: campaignId,
        content_type: contentType,
        time_spent: timeSpent,
        action,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track content review for caption edit', () => {
      // Arrange
      const campaignId = 'camp-222';
      const contentType = 'caption';
      const timeSpent = 20000;
      const action = 'edit';

      // Act
      analytics.trackContentReview(campaignId, contentType, timeSpent, action);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Content Review', {
        campaign_id: campaignId,
        content_type: contentType,
        time_spent: timeSpent,
        action,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Publishing Events', () => {
    it('should track successful content publish', () => {
      // Arrange
      const campaignId = 'camp-333';
      const contentId = 'content-001';
      const success = true;

      // Act
      analytics.trackContentPublish(campaignId, contentId, success);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Content Publish', {
        campaign_id: campaignId,
        content_id: contentId,
        success,
        error_message: undefined,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track failed content publish with error message', () => {
      // Arrange
      const campaignId = 'camp-444';
      const contentId = 'content-002';
      const success = false;
      const errorMessage = 'Network error: Unable to connect';

      // Act
      analytics.trackContentPublish(campaignId, contentId, success, errorMessage);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Content Publish', {
        campaign_id: campaignId,
        content_id: contentId,
        success,
        error_message: errorMessage,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Download Events', () => {
    it('should track image content download', () => {
      // Arrange
      const campaignId = 'camp-555';
      const contentId = 'content-003';
      const contentType = 'image';

      // Act
      analytics.trackContentDownload(campaignId, contentId, contentType);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Content Download', {
        campaign_id: campaignId,
        content_id: contentId,
        content_type: contentType,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track caption content download', () => {
      // Arrange
      const campaignId = 'camp-666';
      const contentId = 'content-004';
      const contentType = 'caption';

      // Act
      analytics.trackContentDownload(campaignId, contentId, contentType);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Content Download', {
        campaign_id: campaignId,
        content_id: contentId,
        content_type: contentType,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Feature Usage Events', () => {
    it('should track feature usage without time spent', () => {
      // Arrange
      const feature = 'image_editor';
      const action = 'open';

      // Act
      analytics.trackFeatureUsage(feature, action);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Feature Usage', {
        feature,
        action,
        time_spent: undefined,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track feature usage with time spent', () => {
      // Arrange
      const feature = 'campaign_builder';
      const action = 'complete';
      const timeSpent = 60000;

      // Act
      analytics.trackFeatureUsage(feature, action, timeSpent);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Feature Usage', {
        feature,
        action,
        time_spent: timeSpent,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('User Retention Events', () => {
    it('should track user return', () => {
      // Arrange
      const daysSinceLastVisit = 7;

      // Act
      analytics.trackUserReturn(daysSinceLastVisit);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('User Return', {
        days_since_last_visit: daysSinceLastVisit,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Session Tracking', () => {
    it('should track session duration', () => {
      // Arrange
      const activity = 'campaign_creation';

      // Act - Start session
      analytics.startSessionTimer();

      // Advance time by 5 seconds
      vi.advanceTimersByTime(5000);

      // End session
      analytics.endSessionTimer(activity);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Session Duration', {
        activity,
        duration_ms: 5000,
        timestamp: '2024-01-15T10:00:05.000Z',
      });
    });

    it('should not track session if timer was not started', () => {
      // Arrange
      const activity = 'browsing';

      // Act - End session without starting
      analytics.endSessionTimer(activity);

      // Assert
      expect(posthog.capture).not.toHaveBeenCalled();
    });

    it('should reset session timer after ending', () => {
      // Arrange
      const activity1 = 'first_activity';
      const activity2 = 'second_activity';

      // Act - First session
      analytics.startSessionTimer();
      vi.advanceTimersByTime(3000);
      analytics.endSessionTimer(activity1);

      // Start new session
      analytics.startSessionTimer();
      vi.advanceTimersByTime(2000);
      analytics.endSessionTimer(activity2);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(2);
      expect(posthog.capture).toHaveBeenNthCalledWith(1, 'Session Duration', {
        activity: activity1,
        duration_ms: 3000,
        timestamp: '2024-01-15T10:00:03.000Z',
      });
      expect(posthog.capture).toHaveBeenNthCalledWith(2, 'Session Duration', {
        activity: activity2,
        duration_ms: 2000,
        timestamp: '2024-01-15T10:00:05.000Z',
      });
    });
  });

  describe('Enhanced Brand Profile Session Tracking', () => {
    it('should track brand profile session with approval', () => {
      // Arrange
      const startTime = 1000000;
      const endTime = 1050000;
      const approved = true;

      // Act
      analytics.trackBrandProfileSession(startTime, endTime, approved);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Brand Profile Session', {
        duration_ms: 50000,
        approved,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track brand profile session without approval', () => {
      // Arrange
      const startTime = 2000000;
      const endTime = 2030000;
      const approved = false;

      // Act
      analytics.trackBrandProfileSession(startTime, endTime, approved);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Brand Profile Session', {
        duration_ms: 30000,
        approved,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });

  describe('Content Review Tracking', () => {
    it('should track days since last review for image', () => {
      // Arrange
      const campaignId = 'camp-777';
      const contentType = 'image';
      const daysSinceLastReview = 3;

      // Act
      analytics.trackDaysSinceLastReview(campaignId, contentType, daysSinceLastReview);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Days Since Last Review', {
        campaign_id: campaignId,
        content_type: contentType,
        days_since_last_review: daysSinceLastReview,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track days since last review for caption', () => {
      // Arrange
      const campaignId = 'camp-888';
      const contentType = 'caption';
      const daysSinceLastReview = 5;

      // Act
      analytics.trackDaysSinceLastReview(campaignId, contentType, daysSinceLastReview);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Days Since Last Review', {
        campaign_id: campaignId,
        content_type: contentType,
        days_since_last_review: daysSinceLastReview,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track days since last approval for image', () => {
      // Arrange
      const campaignId = 'camp-999';
      const contentType = 'image';
      const daysSinceLastApproval = 10;

      // Act
      analytics.trackDaysSinceLastApproval(campaignId, contentType, daysSinceLastApproval);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Days Since Last Approval', {
        campaign_id: campaignId,
        content_type: contentType,
        days_since_last_approval: daysSinceLastApproval,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });

    it('should track days since last approval for caption', () => {
      // Arrange
      const campaignId = 'camp-000';
      const contentType = 'caption';
      const daysSinceLastApproval = 14;

      // Act
      analytics.trackDaysSinceLastApproval(campaignId, contentType, daysSinceLastApproval);

      // Assert
      expect(posthog.capture).toHaveBeenCalledTimes(1);
      expect(posthog.capture).toHaveBeenCalledWith('Days Since Last Approval', {
        campaign_id: campaignId,
        content_type: contentType,
        days_since_last_approval: daysSinceLastApproval,
        timestamp: '2024-01-15T10:00:00.000Z',
      });
    });
  });
});
