import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Tooltip,
  Zoom,
  Fade,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  MdFullscreen,
  MdFullscreenExit,
  MdViewCompact,
  MdViewComfy,
  MdPhoneIphone,
  MdLaptop,
  MdTablet,
} from 'react-icons/md';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaPinterestP,
} from 'react-icons/fa';
import { IoMdCheckmark } from 'react-icons/io';
import { BiRefresh } from 'react-icons/bi';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

interface ContentPreviewPanelProps {
  content: {
    text: string;
    imageUrl?: string | string[];
    hashtags?: string[];
    mentions?: string[];
    emojis?: string[];
  };
  platform?: 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'linkedin' | 'pinterest';
  brandName?: string;
  profileImage?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  onEdit?: () => void;
  qualityScore?: number;
  engagementPrediction?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

const platformStyles = {
  instagram: {
    icon: FaInstagram,
    color: '#E4405F',
    maxChars: 2200,
    name: 'Instagram',
  },
  facebook: {
    icon: FaFacebookF,
    color: '#1877F2',
    maxChars: 63206,
    name: 'Facebook',
  },
  twitter: {
    icon: FaTwitter,
    color: '#1DA1F2',
    maxChars: 280,
    name: 'Twitter',
  },
  tiktok: {
    icon: FaTiktok,
    color: '#000000',
    maxChars: 2200,
    name: 'TikTok',
  },
  linkedin: {
    icon: FaLinkedinIn,
    color: '#0A66C2',
    maxChars: 3000,
    name: 'LinkedIn',
  },
  pinterest: {
    icon: FaPinterestP,
    color: '#E60023',
    maxChars: 500,
    name: 'Pinterest',
  },
};

const deviceSizes = {
  mobile: { width: 375, height: 667, label: 'Mobile' },
  tablet: { width: 768, height: 1024, label: 'Tablet' },
  desktop: { width: 1440, height: 900, label: 'Desktop' },
};

const ContentPreviewPanel: React.FC<ContentPreviewPanelProps> = ({
  content,
  platform = 'instagram',
  brandName = 'Your Brand',
  profileImage,
  isLoading = false,
  onRefresh,
  onEdit,
  qualityScore = 0,
  engagementPrediction,
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'split' | 'preview'>('split');
  const [selectedPlatform, setSelectedPlatform] = useState(platform);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PlatformIcon = platformStyles[selectedPlatform].icon;
  const platformColor = platformStyles[selectedPlatform].color;
  const maxChars = platformStyles[selectedPlatform].maxChars;

  const imageUrls = Array.isArray(content.imageUrl)
    ? content.imageUrl
    : content.imageUrl
      ? [content.imageUrl]
      : [];
  const currentImage = imageUrls[selectedImageIndex] || '';

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getQualityColor = (score: number): string => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderEditPanel = () => (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeOutlinedIcon sx={{ color: platformColor }} />
        Content Editor
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Caption ({content.text.length}/{maxChars})
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            minHeight: 120,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            cursor: onEdit ? 'pointer' : 'default',
            '&:hover': onEdit ? { bgcolor: alpha(theme.palette.primary.main, 0.05) } : {},
          }}
          onClick={onEdit}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {content.text}
          </Typography>
        </Paper>
      </Box>

      {content.hashtags && content.hashtags.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Hashtags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {content.hashtags.map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="small"
                sx={{ bgcolor: alpha(platformColor, 0.1), color: platformColor }}
              />
            ))}
          </Box>
        </Box>
      )}

      {qualityScore > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Quality Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, position: 'relative' }}>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.divider, 0.2),
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${qualityScore}%`,
                    bgcolor: getQualityColor(qualityScore),
                    transition: 'width 0.5s ease-in-out',
                  }}
                />
              </Box>
            </Box>
            <Typography
              variant="h6"
              sx={{ color: getQualityColor(qualityScore), fontWeight: 'bold' }}
            >
              {qualityScore}%
            </Typography>
          </Box>
        </Box>
      )}

      {engagementPrediction && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Predicted Engagement
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Likes
                </Typography>
                <Typography variant="h6">{formatNumber(engagementPrediction.likes)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Shares
                </Typography>
                <Typography variant="h6">{formatNumber(engagementPrediction.shares)}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Comments
                </Typography>
                <Typography variant="h6">{formatNumber(engagementPrediction.comments)}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
        {onEdit && (
          <Button
            fullWidth
            variant="contained"
            onClick={onEdit}
            sx={{ bgcolor: platformColor, '&:hover': { bgcolor: alpha(platformColor, 0.8) } }}
          >
            Edit Content
          </Button>
        )}
        {onRefresh && (
          <IconButton onClick={onRefresh} sx={{ color: platformColor }}>
            <BiRefresh />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  const renderPreview = () => {
    const device = deviceSizes[deviceView];
    const scale = deviceView === 'mobile' ? 0.7 : deviceView === 'tablet' ? 0.5 : 0.4;

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              {Object.entries(platformStyles).map(([key, style]) => {
                const Icon = style.icon;
                return (
                  <IconButton
                    key={key}
                    size="small"
                    onClick={() => setSelectedPlatform(key as typeof selectedPlatform)}
                    sx={{
                      color: selectedPlatform === key ? style.color : 'text.secondary',
                      bgcolor: selectedPlatform === key ? alpha(style.color, 0.1) : 'transparent',
                    }}
                  >
                    <Icon />
                  </IconButton>
                );
              })}
            </Box>
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setDeviceView('mobile')}
                startIcon={<MdPhoneIphone />}
                variant={deviceView === 'mobile' ? 'contained' : 'outlined'}
              >
                Mobile
              </Button>
              <Button
                onClick={() => setDeviceView('tablet')}
                startIcon={<MdTablet />}
                variant={deviceView === 'tablet' ? 'contained' : 'outlined'}
              >
                Tablet
              </Button>
              <Button
                onClick={() => setDeviceView('desktop')}
                startIcon={<MdLaptop />}
                variant={deviceView === 'desktop' ? 'contained' : 'outlined'}
              >
                Desktop
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            overflow: 'auto',
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Zoom in={true}>
              <Paper
                elevation={8}
                sx={{
                  width: device.width * scale,
                  height: device.height * scale,
                  overflow: 'hidden',
                  borderRadius: deviceView === 'mobile' ? 4 : 2,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ height: '100%', overflowY: 'auto' }}>
                  {/* Platform Header */}
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: platformColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={brandName}
                          style={{ width: '100%', borderRadius: '50%' }}
                        />
                      ) : (
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {brandName[0]}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {brandName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 hours ago
                      </Typography>
                    </Box>
                  </Box>

                  {/* Image */}
                  {currentImage && (
                    <Box sx={{ position: 'relative', bgcolor: 'black' }}>
                      <img
                        src={currentImage}
                        alt="Content preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: device.height * scale * 0.6,
                          objectFit: 'contain',
                        }}
                      />
                      {imageUrls.length > 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 0.5,
                          }}
                        >
                          {imageUrls.map((_, idx) => (
                            <Box
                              key={idx}
                              onClick={() => setSelectedImageIndex(idx)}
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: idx === selectedImageIndex ? 'white' : alpha('#fff', 0.5),
                                cursor: 'pointer',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Content */}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                      {content.text}
                    </Typography>
                    {content.hashtags && (
                      <Typography variant="body2" sx={{ color: platformColor }}>
                        {content.hashtags.map((tag) => `#${tag}`).join(' ')}
                      </Typography>
                    )}
                  </Box>

                  {/* Engagement Bar */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Like
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comment
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Share
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Card
      ref={containerRef}
      sx={{ height: isFullscreen ? '100vh' : 600, display: 'flex', flexDirection: 'column' }}
    >
      <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeOutlinedIcon />
            Enhanced Content Preview
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setViewMode('split')}
                startIcon={<MdViewComfy />}
                variant={viewMode === 'split' ? 'contained' : 'outlined'}
              >
                Split View
              </Button>
              <Button
                onClick={() => setViewMode('preview')}
                startIcon={<MdViewCompact />}
                variant={viewMode === 'preview' ? 'contained' : 'outlined'}
              >
                Preview Only
              </Button>
            </ButtonGroup>
            <IconButton size="small" onClick={handleFullscreen}>
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {viewMode === 'split' ? (
            <>
              <Box sx={{ width: '40%', borderRight: 1, borderColor: 'divider' }}>
                {renderEditPanel()}
              </Box>
              <Box sx={{ flex: 1 }}>{renderPreview()}</Box>
            </>
          ) : (
            renderPreview()
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContentPreviewPanel;
