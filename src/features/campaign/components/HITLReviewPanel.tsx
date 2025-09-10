import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { FaCheck, FaTimes, FaEdit, FaRedo, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdCompare, MdHistory } from 'react-icons/md';
import { useAuth } from '../../../features/auth/context/AuthContext';
import ErrorToast from '../../../components/shared/ErrorToast';

export interface ContentItem {
  id: string;
  type: 'image' | 'caption' | 'prompt';
  content: string;
  originalContent?: string;
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  qualityScore?: number;
  feedback?: string;
  metadata?: {
    sceneType?: string;
    sceneSubtype?: string;
    brandCompliance?: number;
    diversityScore?: number;
  };
}

export interface HITLReviewPanelProps {
  items: ContentItem[];
  onApprove: (itemId: string) => Promise<void>;
  onReject: (itemId: string, feedback?: string) => Promise<void>;
  onEdit: (itemId: string, newContent: string) => Promise<void>;
  onRegenerate: (itemId: string, targetedChanges?: string[]) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  campaignId?: string;
}

const HITLReviewPanel: React.FC<HITLReviewPanelProps> = ({
  items,
  onApprove,
  onReject,
  onEdit,
  onRegenerate,
  onClose,
  isOpen,
  campaignId,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDiff, setShowDiff] = useState<{ [key: string]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const { profile } = useAuth();

  const handleApprove = useCallback(
    async (itemId: string) => {
      try {
        setLoading((prev) => ({ ...prev, [itemId]: true }));
        setError(null);
        await onApprove(itemId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to approve item');
      } finally {
        setLoading((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [onApprove]
  );

  const handleReject = useCallback(
    async (itemId: string) => {
      try {
        setLoading((prev) => ({ ...prev, [itemId]: true }));
        setError(null);
        await onReject(itemId, feedback[itemId]);
        setFeedback((prev) => ({ ...prev, [itemId]: '' }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reject item');
      } finally {
        setLoading((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [onReject, feedback]
  );

  const handleEdit = useCallback(
    async (itemId: string) => {
      if (editingItem !== itemId) {
        const item = items.find((i) => i.id === itemId);
        if (item) {
          setEditContent(item.content);
          setEditingItem(itemId);
        }
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, [itemId]: true }));
        setError(null);
        await onEdit(itemId, editContent);
        setEditingItem(null);
        setEditContent('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to edit item');
      } finally {
        setLoading((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [editingItem, editContent, onEdit, items]
  );

  const handleRegenerate = useCallback(
    async (itemId: string) => {
      try {
        setLoading((prev) => ({ ...prev, [itemId]: true }));
        setError(null);

        // Extract targeted changes from feedback
        const targetedChanges = feedback[itemId]
          ?.split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        await onRegenerate(itemId, targetedChanges);
        setFeedback((prev) => ({ ...prev, [itemId]: '' }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to regenerate item');
      } finally {
        setLoading((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [onRegenerate, feedback]
  );

  const toggleDiff = useCallback((itemId: string) => {
    setShowDiff((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'edited':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getQualityScoreColor = (score?: number) => {
    if (!score) return 'default';
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const renderContentDiff = (item: ContentItem) => {
    if (!item.originalContent || !showDiff[item.id]) {
      return (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
          {editingItem === item.id ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-32 p-2 border rounded resize-none"
              placeholder="Edit content..."
            />
          ) : (
            item.content
          )}
        </Typography>
      );
    }

    // Simple diff display - in production, use a proper diff library
    const original = item.originalContent.split(' ');
    const current = item.content.split(' ');

    return (
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Original:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            background: '#ffebee',
            p: 1,
            borderRadius: 1,
            mb: 1,
            whiteSpace: 'pre-wrap',
          }}
        >
          {item.originalContent}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Current:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            background: '#e8f5e8',
            p: 1,
            borderRadius: 1,
            whiteSpace: 'pre-wrap',
          }}
        >
          {item.content}
        </Typography>
      </Box>
    );
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            {/* Left Panel - Item List */}
            <Box sx={{ width: '30%', borderRight: 1, borderColor: 'divider', p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Content Review Queue
              </Typography>

              {items.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    mb: 1,
                    cursor: 'pointer',
                    border: selectedItem === item.id ? 2 : 1,
                    borderColor: selectedItem === item.id ? 'primary.main' : 'divider',
                  }}
                  onClick={() => setSelectedItem(item.id)}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip label={item.type} size="small" sx={{ mr: 1 }} />
                      <Chip label={item.status} size="small" color={getStatusColor(item.status)} />
                      {item.qualityScore && (
                        <Chip
                          label={`${Math.round(item.qualityScore * 100)}%`}
                          size="small"
                          color={getQualityScoreColor(item.qualityScore)}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" noWrap>
                      {item.content.substring(0, 50)}...
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Right Panel - Item Details */}
            <Box sx={{ width: '70%', p: 2 }}>
              {selectedItem ? (
                (() => {
                  const item = items.find((i) => i.id === selectedItem);
                  if (!item) return null;

                  return (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flex: 1 }}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Review
                        </Typography>

                        <Button
                          size="small"
                          startIcon={showDiff[item.id] ? <FaEyeSlash /> : <FaEye />}
                          onClick={() => toggleDiff(item.id)}
                          disabled={!item.originalContent}
                          sx={{ mr: 1 }}
                        >
                          {showDiff[item.id] ? 'Hide Diff' : 'Show Diff'}
                        </Button>
                      </Box>

                      {/* Metadata */}
                      {item.metadata && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Metadata:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {item.metadata.sceneType && (
                              <Chip label={`Scene: ${item.metadata.sceneType}`} size="small" />
                            )}
                            {item.metadata.sceneSubtype && (
                              <Chip label={`Subtype: ${item.metadata.sceneSubtype}`} size="small" />
                            )}
                            {item.metadata.brandCompliance && (
                              <Chip
                                label={`Brand: ${Math.round(item.metadata.brandCompliance * 100)}%`}
                                size="small"
                                color={item.metadata.brandCompliance > 0.8 ? 'success' : 'warning'}
                              />
                            )}
                            {item.metadata.diversityScore && (
                              <Chip
                                label={`Diversity: ${Math.round(item.metadata.diversityScore * 100)}%`}
                                size="small"
                                color={item.metadata.diversityScore > 0.7 ? 'success' : 'warning'}
                              />
                            )}
                          </Box>
                        </Box>
                      )}

                      {/* Content */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Content:
                        </Typography>
                        {renderContentDiff(item)}
                      </Box>

                      {/* Feedback Section */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Feedback / Targeted Changes:
                        </Typography>
                        <textarea
                          value={feedback[item.id] || ''}
                          onChange={(e) =>
                            setFeedback((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          className="w-full h-20 p-2 border rounded resize-none"
                          placeholder="Provide feedback or specify targeted changes (comma-separated)..."
                        />
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<FaCheck />}
                          onClick={() => handleApprove(item.id)}
                          disabled={loading[item.id] || item.status === 'approved'}
                        >
                          Approve
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<FaTimes />}
                          onClick={() => handleReject(item.id)}
                          disabled={loading[item.id] || item.status === 'rejected'}
                        >
                          Reject
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<FaEdit />}
                          onClick={() => handleEdit(item.id)}
                          disabled={loading[item.id]}
                        >
                          {editingItem === item.id ? 'Save Edit' : 'Edit'}
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<FaRedo />}
                          onClick={() => handleRegenerate(item.id)}
                          disabled={loading[item.id]}
                        >
                          Regenerate
                        </Button>

                        {editingItem === item.id && (
                          <Button
                            variant="text"
                            onClick={() => {
                              setEditingItem(null);
                              setEditContent('');
                            }}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </Box>
                    </Box>
                  );
                })()
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6">Select an item to review</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </>
  );
};

export default HITLReviewPanel;
