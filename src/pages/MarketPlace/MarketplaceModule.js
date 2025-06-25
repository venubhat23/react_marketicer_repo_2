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
  VideoLibrary as VideoLibraryIcon,
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
          <Box sx={{ flexGrow: 1, padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Paper
              elevation={0}
              sx={{
                maxWidth: 900,
                margin: '0 auto',
                padding: '40px',
                borderRadius: '12px',
                backgroundColor: '#fff',
              }}
            >
              {/* Company Header */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '40px',
                  textAlign: 'left',
                }}
              >
                Roar On Wheels Pvt. Ltd.
              </Typography>

              <Grid container spacing={3}>
                {/* Title Field - Full Width */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="Title"
                    variant="outlined"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        height: '50px',
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '14px 20px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  />
                </Grid>

                {/* Description Field - Full Width */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    placeholder="Enter a description..."
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '15px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '&:hover': {
                          borderColor: '#8B5CF6',
                        },
                        '&.Mui-focused': {
                          borderColor: '#8B5CF6',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: '14px 20px',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  />
                </Grid>

                {/* Upload Buttons Row */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, marginBottom: '20px' }}>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        flex: 1,
                        height: '50px',
                        borderRadius: '25px',
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                        backgroundColor: '#faf5ff',
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#f3e8ff',
                          borderColor: '#7C3AED',
                        },
                      }}
                    >
                      Upload Image
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<VideoLibraryIcon />}
                      sx={{
                        flex: 1,
                        height: '50px',
                        borderRadius: '25px',
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                        backgroundColor: '#faf5ff',
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#f3e8ff',
                          borderColor: '#7C3AED',
                        },
                      }}
                    >
                      Upload Video
                    </Button>
                  </Box>
                </Grid>

                {/* Dropdown Fields Row 1 */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.category}
                      onChange={handleInputChange('category')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon sx={{ color: '#8B5CF6', mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
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

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.targetAudience}
                      onChange={handleInputChange('targetAudience')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <PeopleIcon sx={{ color: '#8B5CF6', mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
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

                {/* Dropdown Fields Row 2 */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={formData.budget}
                      onChange={handleInputChange('budget')}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <AttachMoneyIcon sx={{ color: '#8B5CF6', mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
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
                          <LocationOnIcon sx={{ color: '#8B5CF6', mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
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

                {/* Dropdown Fields Row 3 */}
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
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: '#8B5CF6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              mr: 1,
                            }}
                          >
                            P
                          </Box>
                        </InputAdornment>
                      }
                      sx={{
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
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
                          <LanguageIcon sx={{ color: '#8B5CF6', mr: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#fff',
                        border: '2px solid #e0e0e0',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
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
                        height: '50px',
                        borderRadius: '25px',
                        backgroundColor: '#8B5CF6',
                        fontSize: '16px',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                        '&:hover': {
                          backgroundColor: '#7C3AED',
                          boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                        },
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