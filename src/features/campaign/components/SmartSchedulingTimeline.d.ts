import React from 'react';
export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'post' | 'review' | 'approval' | 'delivery';
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'overdue' | 'in_progress';
  priority: 'high' | 'medium' | 'low';
  estimatedEngagement?: number;
  aiOptimized: boolean;
  platform?: string;
  description?: string;
}
export interface TimelineProps {
  campaignId?: string;
  startDate: string;
  duration: number;
  postsPerWeek: number;
  onScheduleChange?: (events: ScheduleEvent[]) => void;
  readonly?: boolean;
}
declare const SmartSchedulingTimeline: React.FC<TimelineProps>;
export default SmartSchedulingTimeline;
