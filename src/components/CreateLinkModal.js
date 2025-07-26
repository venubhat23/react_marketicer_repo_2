import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Alert,
  Chip,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  QrCode as QrCodeIcon,
  Analytics as AnalyticsIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

const CreateLinkModal = ({ open, onClose, onCreateLink }) => {
  const [formData, setFormData] = useState({
    destination: '',
    title: '',
    description: '',
    customBackHalf: '',
    domain: 'bit.ly',
    enableQR: false,
    enableBitlyPage: false,
    // UTM Parameters
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    // Advanced options
    password: '',
    expirationDate: '',
    enableTracking: true
  });

  const [errors, setErrors] = useState({});
  const [utmExpanded, setUtmExpanded] = useState(false);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination URL is required';
    } else if (!isValidUrl(formData.destination)) {
      newErrors.destination = 'Please enter a valid URL';
    }

    if (formData.customBackHalf && formData.customBackHalf.length < 3) {
      newErrors.customBackHalf = 'Custom back-half must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateLink(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      destination: '',
      title: '',
      description: '',
      customBackHalf: '',
      domain: 'bit.ly',
      enableQR: false,
      enableBitlyPage: false,
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      password: '',
      expirationDate: '',
      enableTracking: true
    });
    setErrors({});
    setUtmExpanded(false);
    setAdvancedExpanded(false);
    onClose();
  };

  const utmPresets = [
    { label: 'Facebook Campaign', source: 'facebook', medium: 'social', campaign: 'summer-sale' },
    { label: 'Email Newsletter', source: 'email', medium: 'newsletter', campaign: 'weekly-update' },
    { label: 'Google Ads', source: 'google', medium: 'cpc', campaign: 'product-launch' },
    { label: 'Instagram Story', source: 'instagram', medium: 'social', campaign: 'story-promo' }
  ];

  const applyUtmPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      utmSource: preset.source,
      utmMedium: preset.medium,
      utmCampaign: preset.campaign
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px', maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Create a new link
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        {/* Destination URL */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Destination
          </Typography>
          <TextField
            fullWidth
            placeholder="https://example.com/my-long-url"
            value={formData.destination}
            onChange={handleInputChange('destination')}
            error={!!errors.destination}
            helperText={errors.destination}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon color="action" />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Title (optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter a title for your link"
            value={formData.title}
            onChange={handleInputChange('title')}
          />
        </Box>

        {/* Description */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Description (optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Add a description for your link"
            value={formData.description}
            onChange={handleInputChange('description')}
          />
        </Box>

        {/* Short link customization */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Short link
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={formData.domain}
                onChange={handleInputChange('domain')}
                size="small"
              >
                <MenuItem value="bit.ly">bit.ly</MenuItem>
                <MenuItem value="custom.ly">custom.ly</MenuItem>
              </Select>
            </FormControl>
            <Typography sx={{ py: 1 }}>/</Typography>
            <TextField
              placeholder="custom-back-half (optional)"
              value={formData.customBackHalf}
              onChange={handleInputChange('customBackHalf')}
              error={!!errors.customBackHalf}
              helperText={errors.customBackHalf}
              size="small"
              sx={{ flex: 1 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You can create 2 more custom back-halves this month. 
            <Button size="small" sx={{ ml: 1 }}>Upgrade for more</Button>
          </Typography>
        </Box>

        {/* UTM Parameters */}
        <Accordion 
          expanded={utmExpanded} 
          onChange={() => setUtmExpanded(!utmExpanded)}
          sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px !important' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnalyticsIcon color="primary" />
              <Typography fontWeight="bold">UTM Parameters</Typography>
              <Chip label="Premium" size="small" color="primary" />
              <Tooltip title="UTM parameters help track campaign performance in analytics tools">
                <InfoIcon fontSize="small" color="action" />
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="info" sx={{ mb: 2 }}>
              UTM parameters are tags added to URLs to track marketing campaigns in Google Analytics and other tools.
            </Alert>
            
            {/* UTM Presets */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Quick presets:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {utmPresets.map((preset, index) => (
                  <Chip
                    key={index}
                    label={preset.label}
                    onClick={() => applyUtmPreset(preset)}
                    variant="outlined"
                    size="small"
                    clickable
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UTM Source"
                  placeholder="facebook, google, email"
                  value={formData.utmSource}
                  onChange={handleInputChange('utmSource')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UTM Medium"
                  placeholder="social, cpc, email"
                  value={formData.utmMedium}
                  onChange={handleInputChange('utmMedium')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="UTM Campaign"
                  placeholder="summer-sale, product-launch"
                  value={formData.utmCampaign}
                  onChange={handleInputChange('utmCampaign')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UTM Term (optional)"
                  placeholder="keyword, search-term"
                  value={formData.utmTerm}
                  onChange={handleInputChange('utmTerm')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UTM Content (optional)"
                  placeholder="banner-ad, text-link"
                  value={formData.utmContent}
                  onChange={handleInputChange('utmContent')}
                  size="small"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Options */}
        <Accordion 
          expanded={advancedExpanded} 
          onChange={() => setAdvancedExpanded(!advancedExpanded)}
          sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px !important' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Advanced Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Password Protection (optional)"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiration Date (optional)"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleInputChange('expirationDate')}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.enableTracking}
                      onChange={handleInputChange('enableTracking')}
                    />
                  }
                  label="Enable click tracking and analytics"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Ways to share */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            Ways to share
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableQR}
                    onChange={handleInputChange('enableQR')}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCodeIcon />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">QR Code</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Generate a QR Code to share anywhere people can see it
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
                1 left this month
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enableBitlyPage}
                    onChange={handleInputChange('enableBitlyPage')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Bitly Page</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add this link to your page for people to easily find
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ px: 4 }}
        >
          Create your link
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLinkModal;