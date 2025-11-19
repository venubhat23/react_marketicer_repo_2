import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  AutoMode as AutoModeIcon,
  Settings as SettingsIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const CreateAutomation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're in edit mode
  const isEditMode = location.state?.editMode || false;
  const automationData = location.state?.automationData || null;
  
  const [formData, setFormData] = useState({
    name: automationData?.name || '',
    description: automationData?.description || '',
    date: automationData?.date || '',
    time: '09:00',
    platforms: automationData?.platforms || [],
    media: [],
    isEnabled: automationData?.isEnabled !== undefined ? automationData.isEnabled : true
  });

  const [connectedPages, setConnectedPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  
  const steps = ['Basic Info', 'Schedule', 'Content', 'Review'];

  const handleBack = () => {
    navigate('/automations');
  };

  // Fetch connected social media accounts
  const fetchConnectedPages = async () => {
    setLoadingPages(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://api.marketincer.com/api/v1/social_pages/connected_pages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setConnectedPages(data.data.accounts || []);
    } catch (error) {
      console.error("Error fetching connected pages:", error);
    } finally {
      setLoadingPages(false);
    }
  };

  useEffect(() => {
    fetchConnectedPages();
  }, []);

  const handlePageSelection = (pageId) => {
    setSelectedPages(prev => 
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handlePlatformChange = (platform) => {
    const updatedPlatforms = formData.platforms.includes(platform)
      ? formData.platforms.filter(p => p !== platform)
      : [...formData.platforms, platform];
    
    setFormData({
      ...formData,
      platforms: updatedPlatforms
    });
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSave = () => {
    // Save automation logic here
    console.log('Saving automation:', formData);
    navigate('/automations');
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Automation Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="e.g., Daily Social Media Posts"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#882AFF' },
                      '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#882AFF' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                  placeholder="Describe what this automation will do..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#882AFF' },
                      '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#882AFF' },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Schedule Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Schedule Date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#882AFF' },
                      '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#882AFF' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={formData.time}
                  onChange={handleChange('time')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': { borderColor: '#882AFF' },
                      '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#882AFF' },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  Select Connected Social Media Accounts:
                </Typography>
                {loadingPages ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={30} sx={{ color: '#882AFF' }} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {connectedPages.map((page) => (
                      <Box
                        key={page.social_id}
                        onClick={() => handlePageSelection(page.social_id)}
                        sx={{
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: 2,
                          p: 1.5,
                          border: '2px solid',
                          borderColor: selectedPages.includes(page.social_id) ? '#882AFF' : '#e0e0e0',
                          bgcolor: selectedPages.includes(page.social_id) ? 'rgba(136,42,255,0.1)' : 'white',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#882AFF',
                            bgcolor: 'rgba(136,42,255,0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={page.picture || page.avatar}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {page.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666', textTransform: 'capitalize' }}>
                              {page.page_type}
                            </Typography>
                          </Box>
                        </Box>
                        {selectedPages.includes(page.social_id) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: '#882AFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography sx={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                              ✓
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                    {connectedPages.length === 0 && (
                      <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                        No social media accounts connected. Please connect your accounts first.
                      </Typography>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Content & Media Upload
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Box sx={{
                  p: 3,
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  border: '2px dashed #882AFF',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#f3e5f5'
                  }
                }}
                onClick={() => document.getElementById('media-upload').click()}
                >
                  <Typography variant="h6" sx={{ color: '#882AFF', mb: 1 }}>
                    Upload Media
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    Click to upload images or videos for your post
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Supported formats: JPG, PNG, MP4, GIF
                  </Typography>
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFormData({ ...formData, media: [...formData.media, ...files] });
                    }}
                  />
                </Box>
                
                {/* Display uploaded media */}
                {formData.media.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      Uploaded Media ({formData.media.length} files):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.media.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 1,
                            bgcolor: '#e3f2fd',
                            borderRadius: 1,
                            fontSize: '12px',
                            color: '#1976d2'
                          }}
                        >
                          {file.name}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Box sx={{
                  p: 2,
                  bgcolor: '#fff3cd',
                  borderRadius: 2,
                  border: '1px solid #ffeaa7',
                  mt: 2
                }}>
                  <Typography variant="body2" sx={{ color: '#856404', mb: 1 }}>
                    💡 Pro Tip: Use variables like {'{date}'}, {'{time}'}, {'{trending_topic}'} for dynamic content
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review & Confirm
            </Typography>
            <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Name: {formData.name || 'Untitled Automation'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Description: {formData.description || 'No description'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Schedule: {formData.date} at {formData.time}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Selected Accounts: {selectedPages.length > 0 ? 
                      connectedPages
                        .filter(page => selectedPages.includes(page.social_id))
                        .map(page => `${page.name} (${page.page_type})`)
                        .join(', ') 
                      : 'None selected'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Media Files: {formData.media.length} uploaded
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: '#091a48',
              borderRadius: 0,
              color: 'white'
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  onClick={handleBack}
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowBackIcon />
                </IconButton>
{isEditMode ? 'Edit Automation' : 'Create Automation'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton size="large" sx={{ color: 'white' }}>
                  <NotificationsIcon />
                </IconButton>
                <Link to="/SettingPage">
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box sx={{ p: 3 }}>
            {/* Stepper */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label.Mui-active': {
                          color: '#882AFF',
                          fontWeight: 600
                        },
                        '& .MuiStepLabel-label.Mui-completed': {
                          color: '#4caf50',
                          fontWeight: 600
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Step Content */}
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handlePrevious}
                  disabled={activeStep === 0}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: '#882AFF',
                    color: '#882AFF'
                  }}
                >
                  Previous
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: '#666',
                      color: '#666'
                    }}
                  >
                    Cancel
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      startIcon={<SaveIcon />}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        bgcolor: '#882AFF',
                        '&:hover': { bgcolor: '#7625e6' }
                      }}
                    >
{isEditMode ? 'Update Automation' : 'Save Automation'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        bgcolor: '#882AFF',
                        '&:hover': { bgcolor: '#7625e6' }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateAutomation;