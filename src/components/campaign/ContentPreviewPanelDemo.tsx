import React, { useState } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import ContentPreviewPanel from './ContentPreviewPanel';

const ContentPreviewPanelDemo: React.FC = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [qualityScore, setQualityScore] = useState(85);

  const sampleContent = {
    text: `🌟 Introducing our revolutionary new product! 

Transform your daily routine with cutting-edge technology that adapts to your lifestyle. Whether you're at home, work, or on the go, experience the difference that innovation makes.

✨ Key Features:
• Smart adaptive technology
• Eco-friendly materials
• 24/7 customer support
• 30-day money-back guarantee

Join thousands of satisfied customers who've already made the switch!`,
    imageUrl: [
      'https://picsum.photos/800/800?random=1',
      'https://picsum.photos/800/800?random=2',
      'https://picsum.photos/800/800?random=3',
    ],
    hashtags: ['Innovation', 'TechLife', 'Sustainable', 'NewProduct', 'Lifestyle'],
    mentions: ['@techreview', '@ecofriendly'],
    emojis: ['🌟', '✨', '🚀', '💚'],
  };

  const engagementPrediction = {
    likes: Math.floor(Math.random() * 10000) + 5000,
    shares: Math.floor(Math.random() * 1000) + 200,
    comments: Math.floor(Math.random() * 500) + 100,
  };

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
    setQualityScore(Math.floor(Math.random() * 40) + 60);
  };

  const handleEdit = () => {
    alert('Edit functionality would open content editor here');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Enhanced Content Preview Panel Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A rich, interactive preview panel that shows how content will appear across different
          social media platforms. Features split-screen editing, platform-specific previews, quality
          scoring, and engagement predictions.
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Demo Features:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Switch between Instagram, Facebook, Twitter, etc. using platform icons</li>
              <li>Toggle between Split View and Preview Only modes</li>
              <li>Switch device views (Mobile, Tablet, Desktop)</li>
              <li>See quality score and predicted engagement metrics</li>
              <li>Click refresh to simulate content regeneration</li>
              <li>Try fullscreen mode for immersive preview</li>
            </ul>
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={handleRefresh} color="primary">
            Simulate Content Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={() => setQualityScore(Math.floor(Math.random() * 100))}
          >
            Randomize Quality Score
          </Button>
        </Box>
      </Box>

      <ContentPreviewPanel
        content={sampleContent}
        platform="instagram"
        brandName="Demo Brand"
        profileImage="https://picsum.photos/200/200?random=profile"
        isLoading={false}
        onRefresh={handleRefresh}
        onEdit={handleEdit}
        qualityScore={qualityScore}
        engagementPrediction={engagementPrediction}
      />

      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Implementation Notes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This component provides immediate visual impact for demonstrating AI-powered content
          generation capabilities. It&apos;s designed to be highly interactive and visually appealing,
          perfect for stakeholder demos and user presentations. The component supports multiple
          platforms, responsive design, and real-time quality metrics.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          <strong>Refresh Count:</strong> {refreshCount} |<strong> Current Quality Score:</strong>{' '}
          {qualityScore}%
        </Typography>
      </Box>
    </Container>
  );
};

export default ContentPreviewPanelDemo;
