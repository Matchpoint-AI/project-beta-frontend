import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Paper,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  TrendingUp,
  Edit,
  Add,
  Delete,
  Analytics,
  SmartToy,
  Info,
} from '@mui/icons-material';
import { getPostingScheduleArray } from '../../../helpers/calculateTiming';

// Date utility functions to replace dayjs
const parseDate = (dateStr: string): Date => {
  // Handle MM/DD/YYYY format
  if (dateStr.includes('/')) {
    const [month, day, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
};

const formatDate = (date: Date, format: string): string => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  switch (format) {
    case 'YYYY-MM-DD':
      return date.toISOString().split('T')[0];
    case 'MMM D':
      return `${months[date.getMonth()]} ${date.getDate()}`;
    case 'MM/DD/YYYY':
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    default:
      return date.toISOString();
  }
};

const addTime = (date: Date, amount: number, unit: 'week' | 'day'): Date => {
  const newDate = new Date(date);
  if (unit === 'week') {
    newDate.setDate(newDate.getDate() + amount * 7);
  } else if (unit === 'day') {
    newDate.setDate(newDate.getDate() + amount);
  }
  return newDate;
};

const subtractTime = (date: Date, amount: number, unit: 'day'): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - amount);
  return newDate;
};

const isBefore = (date1: Date, date2: Date): boolean => {
  return date1.getTime() < date2.getTime();
};

const diffInDays = (date1: Date, date2: Date): number => {
  return Math.floor((date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000));
};

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
  duration: number; // weeks
  postsPerWeek: number;
  onScheduleChange?: (events: ScheduleEvent[]) => void;
  readonly?: boolean;
}

const PLATFORM_COLORS = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  default: '#6B7280',
};

const STATUS_COLORS = {
  scheduled: '#3B82F6',
  completed: '#10B981',
  overdue: '#EF4444',
  in_progress: '#F59E0B',
};

const SmartSchedulingTimeline: React.FC<TimelineProps> = ({
  campaignId,
  startDate,
  duration,
  postsPerWeek,
  onScheduleChange,
  readonly = false,
}) => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    bestTimes: string[];
    engagementPrediction: number;
    optimization: string;
  } | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Generate optimal posting times using AI-like logic
  const generateOptimalSchedule = useCallback((): ScheduleEvent[] => {
    const schedule: ScheduleEvent[] = [];
    const start = parseDate(startDate);
    const postingTimes = getPostingScheduleArray(postsPerWeek);

    // AI-optimized time slots based on engagement data
    const aiOptimizedTimes = [
      { time: '9:00 AM', engagement: 0.85, day: 'Monday' },
      { time: '12:00 PM', engagement: 0.92, day: 'Wednesday' },
      { time: '5:00 PM', engagement: 0.88, day: 'Friday' },
      { time: '8:00 PM', engagement: 0.95, day: 'Sunday' },
      { time: '2:00 PM', engagement: 0.78, day: 'Tuesday' },
    ];

    for (let week = 0; week < duration; week++) {
      const weekStart = addTime(start, week, 'week');

      for (let post = 0; post < postsPerWeek; post++) {
        const dayOffset = Math.floor(post * (7 / postsPerWeek));
        const postDate = addTime(weekStart, dayOffset, 'day');
        const aiTime = aiOptimizedTimes[post % aiOptimizedTimes.length];

        // Post event
        schedule.push({
          id: `post-w${week}-p${post}`,
          title: `Campaign Post ${week * postsPerWeek + post + 1}`,
          type: 'post',
          date: formatDate(postDate, 'YYYY-MM-DD'),
          time: aiTime.time,
          status: isBefore(postDate, new Date()) ? 'completed' : 'scheduled',
          priority: post === 0 ? 'high' : 'medium',
          estimatedEngagement: Math.round(aiTime.engagement * 100),
          aiOptimized: true,
          platform: ['instagram', 'facebook', 'twitter'][post % 3] as keyof typeof PLATFORM_COLORS,
          description: `AI-optimized for ${aiTime.engagement * 100}% engagement on ${aiTime.day}`,
        });

        // Review event (2 days before post)
        const reviewDate = subtractTime(postDate, 2, 'day');
        if (!isBefore(reviewDate, new Date())) {
          schedule.push({
            id: `review-w${week}-p${post}`,
            title: `Review: Post ${week * postsPerWeek + post + 1}`,
            type: 'review',
            date: formatDate(reviewDate, 'YYYY-MM-DD'),
            time: '10:00 AM',
            status: 'scheduled',
            priority: 'medium',
            aiOptimized: false,
            description: 'Content review and approval required',
          });
        }
      }

      // Weekly delivery milestone
      const deliveryDate = addTime(weekStart, 6, 'day');
      schedule.push({
        id: `delivery-w${week}`,
        title: `Week ${week + 1} Delivery`,
        type: 'delivery',
        date: formatDate(deliveryDate, 'YYYY-MM-DD'),
        time: '5:00 PM',
        status: isBefore(deliveryDate, new Date()) ? 'completed' : 'scheduled',
        priority: 'high',
        aiOptimized: false,
        description: `Deliver ${postsPerWeek} posts for week ${week + 1}`,
      });
    }

    return schedule.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [startDate, duration, postsPerWeek]);

  // Generate AI insights
  const generateAiInsights = useCallback(() => {
    const bestTimes = ['9:00 AM Mon', '12:00 PM Wed', '5:00 PM Fri', '8:00 PM Sun'];
    const avgEngagement =
      events.reduce((acc, event) => acc + (event.estimatedEngagement || 75), 0) / events.length;

    setAiInsights({
      bestTimes,
      engagementPrediction: Math.round(avgEngagement),
      optimization:
        avgEngagement > 85
          ? 'Excellent timing optimization'
          : avgEngagement > 70
            ? 'Good timing, consider shifting some posts to peak hours'
            : 'Timeline needs optimization for better engagement',
    });
  }, [events]);

  useEffect(() => {
    if (startDate && duration && postsPerWeek) {
      setIsLoading(true);
      const schedule = generateOptimalSchedule();
      setEvents(schedule);
      onScheduleChange?.(schedule);
      setIsLoading(false);
    }
  }, [startDate, duration, postsPerWeek, generateOptimalSchedule, onScheduleChange]);

  useEffect(() => {
    if (events.length > 0) {
      generateAiInsights();
    }
  }, [events, generateAiInsights]);

  const handleEventClick = (event: ScheduleEvent) => {
    if (!readonly) {
      setSelectedEvent(event);
      setEditDialogOpen(true);
    }
  };

  const handleEventUpdate = (updatedEvent: ScheduleEvent) => {
    const updatedEvents = events.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
    onScheduleChange?.(updatedEvents);
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const getEventIcon = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'post':
        return <Schedule />;
      case 'review':
        return <Edit />;
      case 'approval':
        return <TrendingUp />;
      case 'delivery':
        return <CalendarToday />;
      default:
        return <Schedule />;
    }
  };

  const weeklyGroups = useMemo(() => {
    const groups: { [week: string]: ScheduleEvent[] } = {};
    events.forEach((event) => {
      const eventDate = new Date(event.date);
      const weekStart = parseDate(startDate);
      const weekNumber = Math.floor(diffInDays(eventDate, weekStart) / 7) + 1;
      const weekKey = `Week ${weekNumber}`;

      if (!groups[weekKey]) {
        groups[weekKey] = [];
      }
      groups[weekKey].push(event);
    });
    return groups;
  }, [events, startDate]);

  const completionRate = useMemo(() => {
    const completedEvents = events.filter((e) => e.status === 'completed').length;
    return events.length > 0 ? (completedEvents / events.length) * 100 : 0;
  }, [events]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generating Smart Schedule...
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header with AI Insights */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" display="flex" alignItems="center" gap={1}>
              <SmartToy color="primary" />
              Smart Scheduling Timeline
            </Typography>
            <Box display="flex" gap={1}>
              <Tooltip title="View AI insights">
                <IconButton onClick={() => setShowInsights(true)}>
                  <Analytics />
                </IconButton>
              </Tooltip>
              {!readonly && (
                <Tooltip title="Add custom event">
                  <IconButton
                    onClick={() => {
                      /* Add event logic */
                    }}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Box display="flex" gap={3} mb={2}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Campaign Progress
              </Typography>
              <Typography variant="h6">{Math.round(completionRate)}%</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Total Events
              </Typography>
              <Typography variant="h6">{events.length}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Avg. Predicted Engagement
              </Typography>
              <Typography variant="h6">{aiInsights?.engagementPrediction || '--'}%</Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={completionRate}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </CardContent>
      </Card>

      {/* Weekly Timeline */}
      <Grid container spacing={2}>
        {Object.entries(weeklyGroups).map(([weekName, weekEvents]) => (
          <Grid item xs={12} key={weekName}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {weekName}
              </Typography>
              <Grid container spacing={1}>
                {weekEvents.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <Card
                      sx={{
                        cursor: readonly ? 'default' : 'pointer',
                        borderLeft: `4px solid ${STATUS_COLORS[event.status]}`,
                        '&:hover': readonly
                          ? {}
                          : {
                              boxShadow: 2,
                              transform: 'translateY(-1px)',
                            },
                        transition: 'all 0.2s ease-in-out',
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={1}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            {getEventIcon(event.type)}
                            <Typography variant="subtitle2" noWrap>
                              {event.title}
                            </Typography>
                          </Box>
                          {event.aiOptimized && (
                            <Tooltip title="AI Optimized">
                              <SmartToy fontSize="small" color="primary" />
                            </Tooltip>
                          )}
                        </Box>

                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {formatDate(new Date(event.date), 'MMM D')} at {event.time}
                        </Typography>

                        <Box display="flex" gap={1} mb={1} flexWrap="wrap">
                          <Chip
                            size="small"
                            label={event.status}
                            sx={{ backgroundColor: STATUS_COLORS[event.status], color: 'white' }}
                          />
                          <Chip size="small" label={event.priority} variant="outlined" />
                          {event.platform && (
                            <Chip
                              size="small"
                              label={event.platform}
                              sx={{
                                backgroundColor:
                                  PLATFORM_COLORS[event.platform as keyof typeof PLATFORM_COLORS] ||
                                  PLATFORM_COLORS.default,
                                color: 'white',
                              }}
                            />
                          )}
                        </Box>

                        {event.estimatedEngagement && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <TrendingUp fontSize="small" />
                            <Typography variant="caption">
                              {event.estimatedEngagement}% predicted engagement
                            </Typography>
                          </Box>
                        )}

                        {event.description && (
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                            mt={1}
                          >
                            {event.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* AI Insights Dialog */}
      <Dialog open={showInsights} onClose={() => setShowInsights(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Analytics />
            AI Scheduling Insights
          </Box>
        </DialogTitle>
        <DialogContent>
          {aiInsights && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Alert severity="info" icon={<Info />}>
                  {aiInsights.optimization}
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Optimal Posting Times
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {aiInsights.bestTimes.map((time, index) => (
                    <Chip key={index} label={time} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Performance Predictions
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Average Engagement: {aiInsights.engagementPrediction}%
                </Typography>
                <Typography variant="body2">
                  Timeline Optimization Score:{' '}
                  {aiInsights.engagementPrediction > 85
                    ? 'Excellent'
                    : aiInsights.engagementPrediction > 70
                      ? 'Good'
                      : 'Needs Improvement'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInsights(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={selectedEvent.date}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={selectedEvent.time}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedEvent.status}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        status: e.target.value as ScheduleEvent['status'],
                      })
                    }
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={selectedEvent.priority}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        priority: e.target.value as ScheduleEvent['priority'],
                      })
                    }
                  >
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={selectedEvent.description || ''}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, description: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => selectedEvent && handleEventUpdate(selectedEvent)}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartSchedulingTimeline;
