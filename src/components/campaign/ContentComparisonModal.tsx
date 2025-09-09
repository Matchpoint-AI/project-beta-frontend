import React, { useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { FaSave, FaTimes, FaUndo, FaRedo, FaCopy } from 'react-icons/fa';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';

interface ContentVersion {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  type: 'original' | 'ai_generated' | 'human_edited' | 'ai_revised';
  metadata?: {
    prompt?: string;
    model?: string;
    feedback?: string;
    qualityScore?: number;
  };
}

interface ContentComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'image' | 'caption' | 'prompt';
  versions: ContentVersion[];
  onSave: (itemId: string, content: string, notes?: string) => Promise<void>;
  onRevert: (itemId: string, versionId: string) => Promise<void>;
  title?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
};

const ContentComparisonModal: React.FC<ContentComparisonModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemType,
  versions,
  onSave,
  onRevert,
  title = 'Content Comparison & Edit',
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [editedContent, setEditedContent] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDiffMode, setShowDiffMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<[number, number]>([0, 1]);

  const currentVersion = versions[0]; // Assume first version is current
  const latestContent = currentVersion?.content || '';

  // Initialize edited content when modal opens or versions change
  React.useEffect(() => {
    if (versions.length > 0 && !isEditing) {
      setEditedContent(latestContent);
    }
  }, [versions, latestContent, isEditing]);

  // Generate diff display
  const getDiffDisplay = useMemo(() => {
    if (!showDiffMode || selectedVersions[0] === selectedVersions[1]) {
      return null;
    }

    const version1 = versions[selectedVersions[0]]?.content || '';
    const version2 = versions[selectedVersions[1]]?.content || '';

    // Simple word-level diff (in production, use a proper diff library like react-diff-view)
    const words1 = version1.split(/(\s+)/);
    const words2 = version2.split(/(\s+)/);

    return { version1, version2, words1, words2 };
  }, [showDiffMode, selectedVersions, versions]);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
      if (newValue < versions.length && !isEditing) {
        setEditedContent(versions[newValue].content);
      }
    },
    [versions, isEditing]
  );

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditedContent(latestContent);
  }, [latestContent]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedContent(latestContent);
    setEditNotes('');
  }, [latestContent]);

  const handleSave = useCallback(async () => {
    if (!editedContent.trim()) return;

    try {
      setLoading(true);
      await onSave(itemId, editedContent, editNotes);
      setIsEditing(false);
      setEditNotes('');
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setLoading(false);
    }
  }, [itemId, editedContent, editNotes, onSave]);

  const handleRevert = useCallback(
    async (versionId: string) => {
      try {
        setLoading(true);
        await onRevert(itemId, versionId);
      } catch (error) {
        console.error('Failed to revert content:', error);
      } finally {
        setLoading(false);
      }
    },
    [itemId, onRevert]
  );

  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const getVersionTypeColor = (type: ContentVersion['type']) => {
    switch (type) {
      case 'original':
        return 'default';
      case 'ai_generated':
        return 'primary';
      case 'human_edited':
        return 'secondary';
      case 'ai_revised':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getVersionTypeLabel = (type: ContentVersion['type']) => {
    switch (type) {
      case 'original':
        return 'Original';
      case 'ai_generated':
        return 'AI Generated';
      case 'human_edited':
        return 'Human Edited';
      case 'ai_revised':
        return 'AI Revised';
      default:
        return 'Unknown';
    }
  };

  const renderDiffView = () => {
    if (!getDiffDisplay) return null;

    const { version1, version2 } = getDiffDisplay;

    return (
      <Box sx={{ display: 'flex', gap: 2, height: '400px' }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'error.main' }}>
              Version {selectedVersions[0] + 1} (Before)
            </Typography>
            <Box
              sx={{
                backgroundColor: '#ffebee',
                p: 2,
                borderRadius: 1,
                height: '300px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {version1}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'success.main' }}>
              Version {selectedVersions[1] + 1} (After)
            </Typography>
            <Box
              sx={{
                backgroundColor: '#e8f5e8',
                p: 2,
                borderRadius: 1,
                height: '300px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {version2}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderVersionView = (version: ContentVersion, index: number) => {
    const isCurrentlyShown = index === activeTab;

    return (
      <Card key={version.id} sx={{ mb: 2 }}>
        <CardContent>
          {/* Version Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Chip
                label={getVersionTypeLabel(version.type)}
                color={getVersionTypeColor(version.type)}
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="textSecondary">
                {new Date(version.timestamp).toLocaleString()} by {version.author}
              </Typography>
              {version.metadata?.qualityScore && (
                <Chip
                  label={`${Math.round(version.metadata.qualityScore * 100)}%`}
                  size="small"
                  color={version.metadata.qualityScore > 0.8 ? 'success' : 'warning'}
                  sx={{ ml: 1 }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Copy to clipboard">
                <IconButton size="small" onClick={() => copyToClipboard(version.content)}>
                  <FaCopy />
                </IconButton>
              </Tooltip>
              {index > 0 && (
                <Tooltip title="Revert to this version">
                  <IconButton
                    size="small"
                    onClick={() => handleRevert(version.id)}
                    disabled={loading}
                  >
                    <FaUndo />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          {/* Metadata */}
          {version.metadata && (
            <Box sx={{ mb: 2 }}>
              {version.metadata.prompt && (
                <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                  <strong>Prompt:</strong> {version.metadata.prompt}
                </Typography>
              )}
              {version.metadata.model && (
                <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                  <strong>Model:</strong> {version.metadata.model}
                </Typography>
              )}
              {version.metadata.feedback && (
                <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                  <strong>Feedback:</strong> {version.metadata.feedback}
                </Typography>
              )}
            </Box>
          )}

          {/* Content */}
          <Box
            sx={{
              backgroundColor: isCurrentlyShown && isEditing ? 'transparent' : '#f5f5f5',
              p: 2,
              borderRadius: 1,
              minHeight: '100px',
            }}
          >
            {isCurrentlyShown && isEditing ? (
              <TextField
                multiline
                fullWidth
                minRows={6}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder={`Edit ${itemType} content...`}
                variant="outlined"
              />
            ) : (
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {version.content}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isFullscreen}
      sx={{
        '& .MuiDialog-paper': {
          height: isFullscreen ? '100vh' : '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
          <Typography variant="h6">{title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showDiffMode}
                  onChange={(e) => setShowDiffMode(e.target.checked)}
                  size="small"
                />
              }
              label="Diff Mode"
            />
            <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
            </IconButton>
            <IconButton onClick={onClose}>
              <FaTimes />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {showDiffMode ? (
          <Box sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                select
                label="Compare From"
                size="small"
                value={selectedVersions[0]}
                onChange={(e) => setSelectedVersions([Number(e.target.value), selectedVersions[1]])}
                SelectProps={{ native: true }}
              >
                {versions.map((version, index) => (
                  <option key={version.id} value={index}>
                    Version {index + 1} ({getVersionTypeLabel(version.type)})
                  </option>
                ))}
              </TextField>
              <TextField
                select
                label="Compare To"
                size="small"
                value={selectedVersions[1]}
                onChange={(e) => setSelectedVersions([selectedVersions[0], Number(e.target.value)])}
                SelectProps={{ native: true }}
              >
                {versions.map((version, index) => (
                  <option key={version.id} value={index}>
                    Version {index + 1} ({getVersionTypeLabel(version.type)})
                  </option>
                ))}
              </TextField>
            </Box>
            {renderDiffView()}
          </Box>
        ) : (
          <Box>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              {versions.map((version, index) => (
                <Tab
                  key={version.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>Version {index + 1}</span>
                      <Chip
                        label={getVersionTypeLabel(version.type)}
                        size="small"
                        color={getVersionTypeColor(version.type)}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>

            <Box sx={{ p: 2 }}>
              {versions.map((version, index) => (
                <TabPanel key={version.id} value={activeTab} index={index}>
                  {renderVersionView(version, index)}
                </TabPanel>
              ))}
            </Box>
          </Box>
        )}

        {/* Edit Notes */}
        {isEditing && (
          <Box sx={{ px: 2, pb: 2 }}>
            <TextField
              fullWidth
              label="Edit Notes (Optional)"
              placeholder="Describe the changes you made..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              size="small"
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {isEditing ? (
          <>
            <Button onClick={handleCancelEdit} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!editedContent.trim() || loading}
              startIcon={<FaSave />}
            >
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button variant="contained" onClick={handleStartEdit} disabled={versions.length === 0}>
              Edit Current
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ContentComparisonModal;
