import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import ContentPreviewPanel from './ContentPreviewPanel';
var ContentPreviewPanelDemo = function () {
  var _a = useState(0),
    refreshCount = _a[0],
    setRefreshCount = _a[1];
  var _b = useState(85),
    qualityScore = _b[0],
    setQualityScore = _b[1];
  var sampleContent = {
    text: "\uD83C\uDF1F Introducing our revolutionary new product! \n\nTransform your daily routine with cutting-edge technology that adapts to your lifestyle. Whether you're at home, work, or on the go, experience the difference that innovation makes.\n\n\u2728 Key Features:\n\u2022 Smart adaptive technology\n\u2022 Eco-friendly materials\n\u2022 24/7 customer support\n\u2022 30-day money-back guarantee\n\nJoin thousands of satisfied customers who've already made the switch!",
    imageUrl: [
      'https://picsum.photos/800/800?random=1',
      'https://picsum.photos/800/800?random=2',
      'https://picsum.photos/800/800?random=3',
    ],
    hashtags: ['Innovation', 'TechLife', 'Sustainable', 'NewProduct', 'Lifestyle'],
    mentions: ['@techreview', '@ecofriendly'],
    emojis: ['🌟', '✨', '🚀', '💚'],
  };
  var engagementPrediction = {
    likes: Math.floor(Math.random() * 10000) + 5000,
    shares: Math.floor(Math.random() * 1000) + 200,
    comments: Math.floor(Math.random() * 500) + 100,
  };
  var handleRefresh = function () {
    setRefreshCount(function (prev) {
      return prev + 1;
    });
    setQualityScore(Math.floor(Math.random() * 40) + 60);
  };
  var handleEdit = function () {
    alert('Edit functionality would open content editor here');
  };
  return _jsxs(Container, {
    maxWidth: 'xl',
    sx: { py: 4 },
    children: [
      _jsxs(Box, {
        sx: { mb: 4 },
        children: [
          _jsx(Typography, {
            variant: 'h3',
            gutterBottom: true,
            children: 'Enhanced Content Preview Panel Demo',
          }),
          _jsx(Typography, {
            variant: 'body1',
            color: 'text.secondary',
            paragraph: true,
            children:
              'A rich, interactive preview panel that shows how content will appear across different social media platforms. Features split-screen editing, platform-specific previews, quality scoring, and engagement predictions.',
          }),
          _jsx(Alert, {
            severity: 'info',
            sx: { mb: 3 },
            children: _jsxs(Typography, {
              variant: 'body2',
              children: [
                _jsx('strong', { children: 'Demo Features:' }),
                _jsxs('ul', {
                  style: { margin: '8px 0', paddingLeft: '20px' },
                  children: [
                    _jsx('li', {
                      children:
                        'Switch between Instagram, Facebook, Twitter, etc. using platform icons',
                    }),
                    _jsx('li', { children: 'Toggle between Split View and Preview Only modes' }),
                    _jsx('li', { children: 'Switch device views (Mobile, Tablet, Desktop)' }),
                    _jsx('li', { children: 'See quality score and predicted engagement metrics' }),
                    _jsx('li', { children: 'Click refresh to simulate content regeneration' }),
                    _jsx('li', { children: 'Try fullscreen mode for immersive preview' }),
                  ],
                }),
              ],
            }),
          }),
          _jsxs(Box, {
            sx: { display: 'flex', gap: 2, mb: 3 },
            children: [
              _jsx(Button, {
                variant: 'contained',
                onClick: handleRefresh,
                color: 'primary',
                children: 'Simulate Content Refresh',
              }),
              _jsx(Button, {
                variant: 'outlined',
                onClick: function () {
                  return setQualityScore(Math.floor(Math.random() * 100));
                },
                children: 'Randomize Quality Score',
              }),
            ],
          }),
        ],
      }),
      _jsx(ContentPreviewPanel, {
        content: sampleContent,
        platform: 'instagram',
        brandName: 'Demo Brand',
        profileImage: 'https://picsum.photos/200/200?random=profile',
        isLoading: false,
        onRefresh: handleRefresh,
        onEdit: handleEdit,
        qualityScore: qualityScore,
        engagementPrediction: engagementPrediction,
      }),
      _jsxs(Box, {
        sx: { mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 },
        children: [
          _jsx(Typography, { variant: 'h6', gutterBottom: true, children: 'Implementation Notes' }),
          _jsx(Typography, {
            variant: 'body2',
            color: 'text.secondary',
            children:
              "This component provides immediate visual impact for demonstrating AI-powered content generation capabilities. It's designed to be highly interactive and visually appealing, perfect for stakeholder demos and user presentations. The component supports multiple platforms, responsive design, and real-time quality metrics.",
          }),
          _jsxs(Typography, {
            variant: 'body2',
            color: 'text.secondary',
            sx: { mt: 2 },
            children: [
              _jsx('strong', { children: 'Refresh Count:' }),
              ' ',
              refreshCount,
              ' |',
              _jsx('strong', { children: ' Current Quality Score:' }),
              ' ',
              qualityScore,
              '%',
            ],
          }),
        ],
      }),
    ],
  });
};
export default ContentPreviewPanelDemo;
//# sourceMappingURL=ContentPreviewPanelDemo.js.map
