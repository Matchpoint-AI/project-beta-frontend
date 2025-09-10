import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Collapse,
} from '@mui/material';
import { LuPlus, LuTrash2, LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { AuthContext } from '../../auth/context/AuthContext';
import { BrandContext } from '../context/BrandContext';
import FormsContainer from '../../../components/shared/FormsContainer';
import NextButton from '../../../shared/components/buttons/NextButton';
import BackButton from '../../../shared/components/buttons/BackButton';
// import ColorPicker from '../../../shared/components/ui/ColorPicker';
import { getServiceURL } from '../../../helpers/getServiceURL';

// Types matching backend brand_knowledge.py models
interface BrandPersonality {
  traits: string[];
  tone: Record<string, string>;
  voice_attributes: string[];
}

interface VisualStyle {
  color_palette: string[];
  style_tags: string[];
  photography_style: string;
  composition_preferences: string[];
}

interface ProductDetails {
  name: string;
  generic_term: string;
  category: string;
  differentiators: string[];
  usage_context: string;
  ingredients: Array<{ name: string; purpose: string }>;
}

interface BrandKnowledge {
  brand_id: string;
  brand_name: string;
  personality: BrandPersonality;
  visual_style: VisualStyle;
  products: ProductDetails[];
  approved_scenes: string[];
  avoid_list: string[];
  guardrails: Record<string, unknown>;
}

interface BrandKnowledgeFormProps {
  handleNext?: () => void;
  handleBack?: () => void;
  onSave?: (data: BrandKnowledge) => void;
  existingData?: BrandKnowledge | null;
}

const BRAND_CATEGORIES = [
  'fashion',
  'food_beverage',
  'cosmetics',
  'technology',
  'health_wellness',
  'home_decor',
  'automotive',
  'travel',
  'education',
  'entertainment',
];

const PERSONALITY_TRAITS = [
  'premium',
  'accessible',
  'playful',
  'serious',
  'innovative',
  'traditional',
  'minimalist',
  'bold',
  'friendly',
  'professional',
  'adventurous',
  'sophisticated',
  'casual',
  'formal',
  'youthful',
  'mature',
];

const STYLE_TAGS = [
  'modern',
  'vintage',
  'clean',
  'organic',
  'geometric',
  'abstract',
  'realistic',
  'illustrative',
  'photographic',
  'minimalist',
  'maximalist',
  'colorful',
  'monochrome',
];

const PHOTOGRAPHY_STYLES = [
  'lifestyle',
  'product-focused',
  'editorial',
  'documentary',
  'commercial',
  'artistic',
  'candid',
  'staged',
];

const BrandKnowledgeForm: React.FC<BrandKnowledgeFormProps> = ({
  handleNext,
  handleBack,
  onSave,
  existingData,
}) => {
  const authContext = useContext(AuthContext);
  const authState = authContext?.profile;
  const { businessInfo } = useContext(BrandContext);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personality: true,
    visual: false,
    products: false,
    scenes: false,
  });

  // Form state
  const [formData, setFormData] = useState<BrandKnowledge>({
    brand_id: existingData?.brand_id || businessInfo?.id || '',
    brand_name: existingData?.brand_name || businessInfo?.name || '',
    personality: existingData?.personality || {
      traits: [],
      tone: {
        formality: 'neutral',
        humor: 'neutral',
        technicality: 'neutral',
      },
      voice_attributes: [],
    },
    visual_style: existingData?.visual_style || {
      color_palette: businessInfo?.brandColors || [],
      style_tags: [],
      photography_style: '',
      composition_preferences: [],
    },
    products: existingData?.products || [],
    approved_scenes: existingData?.approved_scenes || [],
    avoid_list: existingData?.avoid_list || [],
    guardrails: existingData?.guardrails || {},
  });

  // Input states for adding items
  // Removed unused state variables: newTrait, setNewTrait, newStyleTag, setNewStyleTag, colorPickerVisible, setColorPickerVisible
  const [newVoiceAttribute, setNewVoiceAttribute] = useState('');
  const [newCompositionPref, setNewCompositionPref] = useState('');
  const [newApprovedScene, setNewApprovedScene] = useState('');
  const [newAvoidItem, setNewAvoidItem] = useState('');
  const [newColor, setNewColor] = useState('#000000');

  // Load existing brand knowledge on mount
  useEffect(() => {
    if (businessInfo?.id && !existingData && authState?.token) {
      loadExistingBrandKnowledge();
    }
  }, [businessInfo?.id, authState?.token]);

  const loadExistingBrandKnowledge = async () => {
    if (!authState?.token || !businessInfo?.id) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${getServiceURL('content_generation')}/api/v1/brand-knowledge/by-brand/${businessInfo.id}`,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        if (data.brand_knowledge) {
          setFormData(data.brand_knowledge);
        }
      }
    } catch (err) {
      console.error('Error loading brand knowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addPersonalityTrait = (trait: string) => {
    if (trait && !formData.personality.traits.includes(trait)) {
      setFormData((prev) => ({
        ...prev,
        personality: {
          ...prev.personality,
          traits: [...prev.personality.traits, trait],
        },
      }));
    }
  };

  const removePersonalityTrait = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      personality: {
        ...prev.personality,
        traits: prev.personality.traits.filter((t) => t !== trait),
      },
    }));
  };

  const addVoiceAttribute = () => {
    if (newVoiceAttribute && !formData.personality.voice_attributes.includes(newVoiceAttribute)) {
      setFormData((prev) => ({
        ...prev,
        personality: {
          ...prev.personality,
          voice_attributes: [...prev.personality.voice_attributes, newVoiceAttribute],
        },
      }));
      setNewVoiceAttribute('');
    }
  };

  const removeVoiceAttribute = (attr: string) => {
    setFormData((prev) => ({
      ...prev,
      personality: {
        ...prev.personality,
        voice_attributes: prev.personality.voice_attributes.filter((a) => a !== attr),
      },
    }));
  };

  const updateTone = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personality: {
        ...prev.personality,
        tone: {
          ...prev.personality.tone,
          [key]: value,
        },
      },
    }));
  };

  const addColor = (color: string) => {
    if (!formData.visual_style.color_palette.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        visual_style: {
          ...prev.visual_style,
          color_palette: [...prev.visual_style.color_palette, color],
        },
      }));
    }
  };

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      visual_style: {
        ...prev.visual_style,
        color_palette: prev.visual_style.color_palette.filter((_, i) => i !== index),
      },
    }));
  };

  const addProduct = () => {
    const newProduct: ProductDetails = {
      name: '',
      generic_term: '',
      category: '',
      differentiators: [],
      usage_context: '',
      ingredients: [],
    };

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }));
  };

  const updateProduct = (
    index: number,
    field: keyof ProductDetails,
    value: string | string[] | Array<{ name: string; purpose: string }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      ),
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const extractFromCampaigns = async () => {
    if (!businessInfo?.campaigns || businessInfo.campaigns.length === 0) {
      setError('No campaigns available to extract from');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const campaignIds = businessInfo.campaigns.map((c) => c.campaign_id);
      const response = await fetch(
        `${getServiceURL('content_generation')}/api/v1/brand-knowledge/extract-from-campaigns`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.token}`,
          },
          body: JSON.stringify({ campaign_ids: campaignIds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to extract brand knowledge');
      }

      const result = await response.json();
      if (result.success && result.brand_knowledge) {
        setFormData(result.brand_knowledge);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.message || 'Could not extract brand knowledge');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract from campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate required fields
      if (!formData.brand_name) {
        setError('Brand name is required');
        return;
      }

      if (formData.personality.traits.length === 0) {
        setError('At least one personality trait is required');
        return;
      }

      const endpoint = existingData
        ? `${getServiceURL('content_generation')}/api/v1/brand-knowledge/${existingData.brand_id}`
        : `${getServiceURL('content_generation')}/api/v1/brand-knowledge`;

      const response = await fetch(endpoint, {
        method: existingData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save brand knowledge');
      }

      await response.json(); // Consume response body
      setSuccess(true);

      if (onSave) {
        onSave(formData);
      }

      setTimeout(() => {
        setSuccess(false);
        if (handleNext) {
          handleNext();
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <FormsContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </FormsContainer>
    );
  }

  return (
    <FormsContainer>
      <Typography variant="h4" gutterBottom>
        Brand Knowledge Base
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Define your brand&apos;s personality, visual style, and product details to enhance
        AI-generated content.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Brand knowledge saved successfully!
        </Alert>
      )}

      {businessInfo?.campaigns && businessInfo.campaigns.length > 0 && (
        <Box mb={3}>
          <Button
            variant="outlined"
            onClick={extractFromCampaigns}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Extract from Existing Campaigns
          </Button>
        </Box>
      )}

      {/* Brand Personality Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Brand Personality</Typography>
          <IconButton onClick={() => toggleSection('personality')}>
            {expandedSections.personality ? <LuChevronUp /> : <LuChevronDown />}
          </IconButton>
        </Box>

        <Collapse in={expandedSections.personality}>
          <Box mt={2}>
            {/* Personality Traits */}
            <Typography variant="subtitle2" gutterBottom>
              Personality Traits
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {PERSONALITY_TRAITS.map((trait) => (
                <Chip
                  key={trait}
                  label={trait}
                  onClick={() => addPersonalityTrait(trait)}
                  variant={formData.personality.traits.includes(trait) ? 'filled' : 'outlined'}
                  color={formData.personality.traits.includes(trait) ? 'primary' : 'default'}
                />
              ))}
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {formData.personality.traits.map((trait) => (
                <Chip
                  key={trait}
                  label={trait}
                  onDelete={() => removePersonalityTrait(trait)}
                  color="primary"
                />
              ))}
            </Box>

            {/* Tone Settings */}
            <Typography variant="subtitle2" gutterBottom>
              Brand Tone
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Formality</InputLabel>
                  <Select
                    value={formData.personality.tone.formality || 'neutral'}
                    onChange={(e) => updateTone('formality', e.target.value)}
                    label="Formality"
                  >
                    <MenuItem value="very_formal">Very Formal</MenuItem>
                    <MenuItem value="formal">Formal</MenuItem>
                    <MenuItem value="neutral">Neutral</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="very_casual">Very Casual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Humor</InputLabel>
                  <Select
                    value={formData.personality.tone.humor || 'neutral'}
                    onChange={(e) => updateTone('humor', e.target.value)}
                    label="Humor"
                  >
                    <MenuItem value="serious">Serious</MenuItem>
                    <MenuItem value="neutral">Neutral</MenuItem>
                    <MenuItem value="witty">Witty</MenuItem>
                    <MenuItem value="playful">Playful</MenuItem>
                    <MenuItem value="humorous">Humorous</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Technicality</InputLabel>
                  <Select
                    value={formData.personality.tone.technicality || 'neutral'}
                    onChange={(e) => updateTone('technicality', e.target.value)}
                    label="Technicality"
                  >
                    <MenuItem value="simple">Simple</MenuItem>
                    <MenuItem value="accessible">Accessible</MenuItem>
                    <MenuItem value="neutral">Neutral</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Voice Attributes */}
            <Typography variant="subtitle2" gutterBottom>
              Voice Attributes
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                placeholder="Add voice attribute"
                value={newVoiceAttribute}
                onChange={(e) => setNewVoiceAttribute(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addVoiceAttribute()}
              />
              <Button variant="outlined" onClick={addVoiceAttribute} startIcon={<LuPlus />}>
                Add
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.personality.voice_attributes.map((attr) => (
                <Chip key={attr} label={attr} onDelete={() => removeVoiceAttribute(attr)} />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Visual Style Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Visual Style</Typography>
          <IconButton onClick={() => toggleSection('visual')}>
            {expandedSections.visual ? <LuChevronUp /> : <LuChevronDown />}
          </IconButton>
        </Box>

        <Collapse in={expandedSections.visual}>
          <Box mt={2}>
            {/* Color Palette */}
            <Typography variant="subtitle2" gutterBottom>
              Color Palette
            </Typography>
            <Box display="flex" gap={1} mb={3}>
              <TextField
                size="small"
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                sx={{ width: 100 }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (newColor && !formData.visual_style.color_palette.includes(newColor)) {
                    addColor(newColor);
                    setNewColor('#000000');
                  }
                }}
                startIcon={<LuPlus />}
              >
                Add Color
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {formData.visual_style.color_palette.map((color, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: color,
                      borderRadius: 1,
                      border: '1px solid #ccc',
                    }}
                  />
                  <Typography variant="body2">{color}</Typography>
                  <IconButton size="small" onClick={() => removeColor(index)}>
                    <LuTrash2 size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>

            {/* Style Tags */}
            <Typography variant="subtitle2" gutterBottom>
              Style Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {STYLE_TAGS.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => {
                    const tags = formData.visual_style.style_tags;
                    if (tags.includes(tag)) {
                      setFormData((prev) => ({
                        ...prev,
                        visual_style: {
                          ...prev.visual_style,
                          style_tags: tags.filter((t) => t !== tag),
                        },
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        visual_style: {
                          ...prev.visual_style,
                          style_tags: [...tags, tag],
                        },
                      }));
                    }
                  }}
                  variant={formData.visual_style.style_tags.includes(tag) ? 'filled' : 'outlined'}
                  color={formData.visual_style.style_tags.includes(tag) ? 'primary' : 'default'}
                />
              ))}
            </Box>

            {/* Photography Style */}
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Photography Style</InputLabel>
              <Select
                value={formData.visual_style.photography_style}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visual_style: {
                      ...prev.visual_style,
                      photography_style: e.target.value,
                    },
                  }))
                }
                label="Photography Style"
              >
                {PHOTOGRAPHY_STYLES.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Composition Preferences */}
            <Typography variant="subtitle2" gutterBottom>
              Composition Preferences
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                placeholder="Add composition preference"
                value={newCompositionPref}
                onChange={(e) => setNewCompositionPref(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newCompositionPref) {
                    setFormData((prev) => ({
                      ...prev,
                      visual_style: {
                        ...prev.visual_style,
                        composition_preferences: [
                          ...prev.visual_style.composition_preferences,
                          newCompositionPref,
                        ],
                      },
                    }));
                    setNewCompositionPref('');
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (newCompositionPref) {
                    setFormData((prev) => ({
                      ...prev,
                      visual_style: {
                        ...prev.visual_style,
                        composition_preferences: [
                          ...prev.visual_style.composition_preferences,
                          newCompositionPref,
                        ],
                      },
                    }));
                    setNewCompositionPref('');
                  }
                }}
                startIcon={<LuPlus />}
              >
                Add
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.visual_style.composition_preferences.map((pref, index) => (
                <Chip
                  key={index}
                  label={pref}
                  onDelete={() => {
                    setFormData((prev) => ({
                      ...prev,
                      visual_style: {
                        ...prev.visual_style,
                        composition_preferences: prev.visual_style.composition_preferences.filter(
                          (_, i) => i !== index
                        ),
                      },
                    }));
                  }}
                />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Products Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Products</Typography>
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small" onClick={addProduct} startIcon={<LuPlus />}>
              Add Product
            </Button>
            <IconButton onClick={() => toggleSection('products')}>
              {expandedSections.products ? <LuChevronUp /> : <LuChevronDown />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expandedSections.products}>
          <Box mt={2}>
            {formData.products.map((product, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Typography variant="subtitle2" gutterBottom>
                    Product {index + 1}
                  </Typography>
                  <IconButton size="small" onClick={() => removeProduct(index)}>
                    <LuTrash2 size={16} />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Product Name"
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Generic Term"
                      value={product.generic_term}
                      onChange={(e) => updateProduct(index, 'generic_term', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={product.category}
                        onChange={(e) => updateProduct(index, 'category', e.target.value)}
                        label="Category"
                      >
                        {BRAND_CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat.replace('_', ' ').charAt(0).toUpperCase() +
                              cat.slice(1).replace('_', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Usage Context"
                      value={product.usage_context}
                      onChange={(e) => updateProduct(index, 'usage_context', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Differentiators (comma-separated)"
                      value={product.differentiators.join(', ')}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          'differentiators',
                          e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      helperText="What makes this product unique?"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {formData.products.length === 0 && (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 3 }}>
                No products added yet. Click &quot;Add Product&quot; to get started.
              </Typography>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Scenes & Guardrails Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Scenes & Guardrails</Typography>
          <IconButton onClick={() => toggleSection('scenes')}>
            {expandedSections.scenes ? <LuChevronUp /> : <LuChevronDown />}
          </IconButton>
        </Box>

        <Collapse in={expandedSections.scenes}>
          <Box mt={2}>
            {/* Approved Scenes */}
            <Typography variant="subtitle2" gutterBottom>
              Approved Scenes
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                placeholder="Add approved scene type"
                value={newApprovedScene}
                onChange={(e) => setNewApprovedScene(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newApprovedScene) {
                    setFormData((prev) => ({
                      ...prev,
                      approved_scenes: [...prev.approved_scenes, newApprovedScene],
                    }));
                    setNewApprovedScene('');
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (newApprovedScene) {
                    setFormData((prev) => ({
                      ...prev,
                      approved_scenes: [...prev.approved_scenes, newApprovedScene],
                    }));
                    setNewApprovedScene('');
                  }
                }}
                startIcon={<LuPlus />}
              >
                Add
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {formData.approved_scenes.map((scene, index) => (
                <Chip
                  key={index}
                  label={scene}
                  color="success"
                  onDelete={() => {
                    setFormData((prev) => ({
                      ...prev,
                      approved_scenes: prev.approved_scenes.filter((_, i) => i !== index),
                    }));
                  }}
                />
              ))}
            </Box>

            {/* Avoid List */}
            <Typography variant="subtitle2" gutterBottom>
              Avoid List
            </Typography>
            <Box display="flex" gap={1} mb={2}>
              <TextField
                size="small"
                placeholder="Add item to avoid"
                value={newAvoidItem}
                onChange={(e) => setNewAvoidItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newAvoidItem) {
                    setFormData((prev) => ({
                      ...prev,
                      avoid_list: [...prev.avoid_list, newAvoidItem],
                    }));
                    setNewAvoidItem('');
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (newAvoidItem) {
                    setFormData((prev) => ({
                      ...prev,
                      avoid_list: [...prev.avoid_list, newAvoidItem],
                    }));
                    setNewAvoidItem('');
                  }
                }}
                startIcon={<LuPlus />}
              >
                Add
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {formData.avoid_list.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  color="error"
                  onDelete={() => {
                    setFormData((prev) => ({
                      ...prev,
                      avoid_list: prev.avoid_list.filter((_, i) => i !== index),
                    }));
                  }}
                />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        {handleBack && <BackButton onClick={handleBack} />}
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handleSave}
            disabled={saving || loading}
            startIcon={saving && <CircularProgress size={20} />}
          >
            Save Draft
          </Button>
          {handleNext && (
            <NextButton
              onClick={() => {
                handleSave();
              }}
              disabled={saving || loading}
            >
              Save & Continue
            </NextButton>
          )}
        </Box>
      </Box>
    </FormsContainer>
  );
};

export default BrandKnowledgeForm;
