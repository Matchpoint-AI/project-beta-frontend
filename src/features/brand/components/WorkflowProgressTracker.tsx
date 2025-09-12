import React from 'react';
import { LinearProgress, Box, Typography, Paper } from '@mui/material';
import { CheckCircle, AutoAwesome, Web, Analysis } from '@mui/icons-material';
import { WorkflowState } from '../context/BrandContext';

interface WorkflowProgressTrackerProps {
  workflow?: WorkflowState;
  className?: string;
}

const stepIcons = {
  crawling: <Web sx={{ color: '#5145CD' }} />,
  analyzing: <Analysis sx={{ color: '#5145CD' }} />,
  completed: <CheckCircle sx={{ color: '#4CAF50' }} />,
  failed: <AutoAwesome sx={{ color: '#F05252' }} />
};

const stepLabels = {
  crawling: 'Crawling website',
  analyzing: 'Analyzing content',
  completed: 'Analysis complete',
  failed: 'Analysis failed'
};

const WorkflowProgressTracker: React.FC<WorkflowProgressTrackerProps> = ({ 
  workflow, 
  className = '' 
}) => {
  if (!workflow?.isActive) {
    return null;
  }

  const { currentStep = 'crawling', progress = 0, progressMessage } = workflow;
  const progressPercent = Math.round(progress * 100);

  return (
    <Paper 
      elevation={2} 
      className={`p-4 bg-white rounded-lg border border-gray-200 ${className}`}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Box mr={2}>
          {stepIcons[currentStep] || stepIcons.crawling}
        </Box>
        <Box flexGrow={1}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#30175A', 
              fontWeight: 600,
              fontSize: '16px'
            }}
          >
            {stepLabels[currentStep] || 'Processing...'}
          </Typography>
          {progressMessage && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666', 
                fontSize: '14px',
                mt: 0.5
              }}
            >
              {progressMessage}
            </Typography>
          )}
        </Box>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#5145CD', 
            fontWeight: 600,
            minWidth: '40px',
            textAlign: 'right'
          }}
        >
          {progressPercent}%
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={progressPercent}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#E3F2FD',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#5145CD',
            borderRadius: 4,
          }
        }}
      />
      
      {currentStep === 'failed' && workflow.error && (
        <Box mt={2}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#F05252',
              backgroundColor: '#FEF2F2',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #FECACA'
            }}
          >
            Error: {workflow.error}
          </Typography>
        </Box>
      )}
      
      {currentStep === 'completed' && (
        <Box mt={2}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#059669',
              backgroundColor: '#ECFDF5',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #A7F3D0'
            }}
          >
            ✓ Brand analysis completed successfully
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WorkflowProgressTracker;