import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  LocationOn as LocationOnIcon,
  Language as LanguageIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';

const MarketplaceModule = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAudience: '',
    budget: '',
    location: '',
    platform: '',
    languages: '',
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('Image uploaded:', file.name);
        // Handle image upload logic here
      }
    };
    input.click();
  };

  const handlePublish = () => {
    console.log('Publishing:', formData);
    // Add your publish logic here
  };

  const categories = ['Technology', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Beauty'];
  const audiences = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const budgets = ['$100-500', '$500-1000', '$1000-5000', '$5000+'];
  const locations = ['USA', 'Canada', 'UK', 'Australia', 'India', 'Global'];
  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Facebook', 'Twitter', 'LinkedIn'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#091a48',
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Marketplace Module
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box sx={{ 
            flexGrow: 1, 
            padding: { xs: '20px', md: '40px' }, 
            backgroundColor: '#f8f9fa', 
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: '900px',
                padding: { xs: '20px', md: '40px' },
                borderRadius: '16px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Company Header */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#2c3e50',
                  marginBottom: '40px',
                  textAlign: 'left',
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Roar On Wheels Pvt. Ltd.
              </Typography>

              <Grid container spacing={3}>
                {/* Title and Description Row */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Title"
                    variant="outlined"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        height: '56px',
                        fontSize: '14px',
                        color: '#8B5CF6',
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '16px 24px',
                        color: '#8B5CF6',
                        '&::placeholder': {
                          color: '#8B5CF6',
                          opacity: 0.8,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Enter a description..."
                    variant="outlined"
                    multiline
                    rows={2}
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        minHeight: '56px',
                        fontSize: '14px',
                        color: '#8B5CF6',
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '16px 24px',
                        color: '#8B5CF6',
                        '&::placeholder': {
                          color: '#8B5CF6',
                          opacity: 0.8,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  />
                </Grid>

                {/* Upload Button Row */}
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleImageUpload}
                    fullWidth
                    sx={{
                      height: '56px',
                      borderRadius: '30px',
                      borderColor: '#8B5CF6',
                      color: '#8B5CF6',
                      backgroundColor: 'rgba(139, 92, 246, 0.05)',
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      border: '2px solid #8B5CF6',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderColor: '#7C3AED',
                        transform: 'translateY(-1px)',
                      },
                    }}
                  >
                    Upload Image
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon sx={{ color: '#8B5CF6', mr: 1, fontSize: '20px' }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          color: '#8B5CF6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: '#8B5CF6' }}>Category</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Second Row of Dropdowns */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.targetAudience}
                      onChange={handleInputChange('targetAudience')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <PeopleIcon sx={{ color: '#8B5CF6', mr: 1, fontSize: '20px' }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          color: '#8B5CF6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: '#8B5CF6' }}>Target Audience</em>
                      </MenuItem>
                      {audiences.map((audience) => (
                        <MenuItem key={audience} value={audience}>
                          {audience}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.budget}
                      onChange={handleInputChange('budget')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: '#8B5CF6', mr: 1, fontSize: '20px' }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          color: '#8B5CF6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: '#8B5CF6' }}>Budget</em>
                      </MenuItem>
                      {budgets.map((budget) => (
                        <MenuItem key={budget} value={budget}>
                          {budget}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.location}
                      onChange={handleInputChange('location')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: '#8B5CF6', mr: 1, fontSize: '20px' }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          color: '#8B5CF6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: '#8B5CF6' }}>Location</em>
                      </MenuItem>
                      {locations.map((location) => (
                        <MenuItem key={location} value={location}>
                          {location}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Third Row of Dropdowns */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.platform}
                      onChange={handleInputChange('platform')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: '#8B5CF6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              mr: 1,
                            }}
                          >
                            P
                          </Box>
                        </InputAdornment>
                      }
                      sx={{
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          color: '#8B5CF6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: '#8B5CF6' }}>Platform</em>
                      </MenuItem>
                      {platforms.map((platform) => (
                        <MenuItem key={platform} value={platform}>
                          {platform}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.languages}
                      onChange={handleInputChange('languages')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <LanguageIcon sx={{ color: '#8B5CF6', mr: 1, fontSize: '20px' }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#fff',
                        border: '2px solid #e8ecf0',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 24px',
                          color: '#8B5CF6',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em style={{ color: '#8B5CF6' }}>Languages</em>
                      </MenuItem>
                      {languages.map((language) => (
                        <MenuItem key={language} value={language}>
                          {language}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Publish Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <Button
                      variant="contained"
                      onClick={handlePublish}
                      sx={{
                        width: '280px',
                        height: '56px',
                        borderRadius: '30px',
                        backgroundColor: '#8B5CF6',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.35)',
                        '&:hover': {
                          backgroundColor: '#7C3AED',
                          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.45)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Publish
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketplaceModule;