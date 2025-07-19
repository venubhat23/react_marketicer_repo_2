import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, 
  FormControl, Grid, Modal, Paper, Container, InputLabel, CardContent, CardMedia, 
  Card, Divider, Stack
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoLibraryIcon,
  Visibility as VisibilityIcon,
  AttachMoney as AttachMoneyIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon,
  Language as LanguageIcon,
  Category as CategoryIcon,
  Group as GroupIcon,
  Tag as TagIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Editor from "../../components/Editor";

const CreateMarketplacePost = ({ 
  onBack, 
  onPostCreated, 
  initialData = null 
}) => {
  // Constants as per specification
  const Categories = ['Technology', 'Fashion', 'Food & Beverage', 'Fitness & Health', 'Travel', 'Beauty', 'Lifestyle', 'Education'];
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];
  const Platforms = ['Instagram', 'YouTube', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok'];
  const Languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati'];
  const Locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];

  // Form states as per specification
  const [brandName, setBrandName] = useState(initialData?.brand || "Roar On Wheels Pvt. Ltd."); // Auto-filled
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || "");
  const [budget, setBudget] = useState(initialData?.budget || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [platform, setPlatform] = useState(initialData?.platform || "");
  const [languages, setLanguages] = useState(initialData?.languages || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [tags, setTags] = useState(initialData?.tags || "");
  
  // Upload states
  const [uploadedImageUrl, setUploadedImageUrl] = useState(initialData?.imageUrl || "");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(initialData?.videoUrl || "");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  
  // File input refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // File upload handlers
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current.click();
  };

  const handleFileUpload = async (file, type = 'image') => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(
        "https://kitintellect.tech/storage/public/api/upload/aaFacebook",
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.url) {
        if (type === 'image') {
          setUploadedImageUrl(data.url);
        } else {
          setUploadedVideoUrl(data.url);
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
      }
    } catch (error) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} upload failed!`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile, 'image');
    }
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile, 'video');
    }
  };

  const handlePublish = async () => {
    if (!title || !description || !category || !targetAudience || !budget || !deadline) {
      toast.error("Please fill all required fields!");
      return;
    }
    
    setPosting(true);
    const payloadData = {
      title,
      description,
      category,
      targetAudience,
      budget,
      location,
      platform,
      languages,
      deadline,
      tags,
      imageUrl: uploadedImageUrl,
      videoUrl: uploadedVideoUrl,
      status: "Published"
    };
    
    try {
      // Replace with actual API call
      console.log('Publishing marketplace post:', payloadData);
      
      // Mock success - create new post object
      const newPost = {
        id: initialData?.id || Date.now(),
        ...payloadData,
        type: "Sponsored Post", // Default type
        dateCreated: new Date().toISOString().split('T')[0],
        views: initialData?.views || 0,
        brand: brandName
      };
      
      toast.success(initialData ? "Post updated successfully!" : "Post published successfully!");
      
      // Callback to parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6edf8 0%, #e8f5e8 100%)',
      py: 3
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          bgcolor: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(136, 42, 255, 0.1)'
        }}>
          <IconButton 
            onClick={onBack}
            sx={{ 
              mr: 2, 
              bgcolor: '#882AFF',
              color: 'white',
              '&:hover': { bgcolor: '#6a1b9a' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ 
              color: '#882AFF', 
              fontWeight: 'bold',
              fontFamily: 'Poppins'
            }}>
              {brandName}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 0.5 }}>
              {initialData ? 'Edit your marketplace post' : 'Create a new marketplace post'}
            </Typography>
          </Box>
        </Box>

        {/* Main Content - Vertical Layout */}
        <Grid container spacing={4}>
          {/* Section 1: Post Creation Form */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(136, 42, 255, 0.12)',
              background: 'white',
              border: '1px solid rgba(136, 42, 255, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #882AFF 0%, #6a1b9a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    1
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ 
                    color: '#882AFF', 
                    fontWeight: 'bold',
                    fontFamily: 'Poppins'
                  }}>
                    Post Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Fill in the details for your marketplace post
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging title for your post"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        fontSize: '16px'
                      }
                    }}
                    required
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Enter a detailed description..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                    required
                  />
                </Grid>

                {/* Media Upload Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: '#882AFF',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <CloudUploadIcon sx={{ mr: 1 }} />
                    Upload Media
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        onClick={handleImageUpload}
                        sx={{
                          border: '2px dashed #882AFF',
                          borderRadius: '16px',
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: uploadedImageUrl ? 'rgba(136, 42, 255, 0.05)' : 'transparent',
                          '&:hover': { 
                            bgcolor: 'rgba(136, 42, 255, 0.05)',
                            borderColor: '#6a1b9a',
                            transform: 'translateY(-2px)'
                          },
                          minHeight: '120px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 40, color: '#882AFF', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                          Upload Image
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                          JPG, PNG up to 10MB
                        </Typography>
                        {uploadedImageUrl && (
                          <Avatar 
                            src={uploadedImageUrl} 
                            sx={{ width: 60, height: 60, mt: 2, borderRadius: '12px' }} 
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box
                        onClick={handleVideoUpload}
                        sx={{
                          border: '2px dashed #882AFF',
                          borderRadius: '16px',
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: uploadedVideoUrl ? 'rgba(136, 42, 255, 0.05)' : 'transparent',
                          '&:hover': { 
                            bgcolor: 'rgba(136, 42, 255, 0.05)',
                            borderColor: '#6a1b9a',
                            transform: 'translateY(-2px)'
                          },
                          minHeight: '120px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <VideoLibraryIcon sx={{ fontSize: 40, color: '#882AFF', mb: 1 }} />
                        <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                          Upload Video
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                          MP4, MOV up to 50MB
                        </Typography>
                        {uploadedVideoUrl && (
                          <Typography variant="body2" sx={{ 
                            color: '#4caf50', 
                            mt: 2,
                            fontWeight: 'bold'
                          }}>
                            ✓ Video uploaded
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Form Fields */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category *</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Category *"
                      sx={{
                        borderRadius: '12px'
                      }}
                    >
                      {Categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CategoryIcon sx={{ mr: 1, color: '#882AFF' }} />
                            {cat}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Target Audience *</InputLabel>
                    <Select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      label="Target Audience *"
                      sx={{
                        borderRadius: '12px'
                      }}
                    >
                      {TargetAudiences.map((audience) => (
                        <MenuItem key={audience} value={audience}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupIcon sx={{ mr: 1, color: '#882AFF' }} />
                            {audience}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Budget (₹) *"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="10,000"
                    InputProps={{
                      startAdornment: <AttachMoneyIcon sx={{ color: '#882AFF', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      label="Location"
                      sx={{
                        borderRadius: '12px'
                      }}
                    >
                      {Locations.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ mr: 1, color: '#882AFF' }} />
                            {loc}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      label="Platform"
                      sx={{
                        borderRadius: '12px'
                      }}
                    >
                      {Platforms.map((plat) => (
                        <MenuItem key={plat} value={plat}>{plat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Languages</InputLabel>
                    <Select
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      label="Languages"
                      sx={{
                        borderRadius: '12px'
                      }}
                    >
                      {Languages.map((lang) => (
                        <MenuItem key={lang} value={lang}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LanguageIcon sx={{ mr: 1, color: '#882AFF' }} />
                            {lang}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Deadline *"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <ScheduleIcon sx={{ color: '#882AFF', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="fitness, fashion, lifestyle"
                    InputProps={{
                      startAdornment: <TagIcon sx={{ color: '#882AFF', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Section 2: Preview */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(136, 42, 255, 0.12)',
              background: 'white',
              border: '1px solid rgba(136, 42, 255, 0.1)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #882AFF 0%, #6a1b9a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    2
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ 
                    color: '#882AFF', 
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <VisibilityIcon sx={{ mr: 1 }} />
                    Live Preview
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    See how your post will look to potential collaborators
                  </Typography>
                </Box>
              </Box>

              {/* Single Attractive Preview */}
              <Box sx={{ maxWidth: '500px', mx: 'auto' }}>
                <Card sx={{ 
                  borderRadius: '20px', 
                  boxShadow: '0 12px 40px rgba(136, 42, 255, 0.15)',
                  overflow: 'hidden',
                  border: '1px solid rgba(136, 42, 255, 0.1)'
                }}>
                  {uploadedImageUrl && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={uploadedImageUrl}
                      alt="Preview"
                      sx={{
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    {/* Brand Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#882AFF', 
                        width: 40, 
                        height: 40,
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {brandName.charAt(0)}
                      </Avatar>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 'bold',
                          color: '#333'
                        }}>
                          {brandName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Brand • Sponsored
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Title */}
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      color: '#333'
                    }}>
                      {title || 'Your amazing post title will appear here'}
                    </Typography>
                    
                    {/* Description */}
                    <Typography variant="body2" sx={{ 
                      color: '#666', 
                      mb: 3,
                      lineHeight: 1.6
                    }}>
                      {description || 'Your detailed post description will be displayed here. Add compelling content to attract the right influencers for your brand collaboration.'}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />
                    
                    {/* Details */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                          <Typography variant="h5" sx={{ 
                            color: '#882AFF', 
                            fontWeight: 'bold'
                          }}>
                            {budget ? `₹${parseInt(budget).toLocaleString()}` : '₹0'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            Budget
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: '12px' }}>
                          <Typography variant="body1" sx={{ 
                            color: '#333', 
                            fontWeight: 'bold'
                          }}>
                            {deadline || 'TBD'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            Deadline
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Category & Audience */}
                    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                      {category && (
                        <Chip 
                          label={category}
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(136, 42, 255, 0.1)', 
                            color: '#882AFF',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      {targetAudience && (
                        <Chip 
                          label={`Age ${targetAudience}`}
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(76, 175, 80, 0.1)', 
                            color: '#4caf50',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      {platform && (
                        <Chip 
                          label={platform}
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(255, 152, 0, 0.1)', 
                            color: '#ff9800',
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                    </Stack>
                    
                    {/* Tags */}
                    {tags && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {tags.split(',').map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={`#${tag.trim()}`} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                              borderColor: '#882AFF',
                              color: '#882AFF',
                              '&:hover': {
                                bgcolor: 'rgba(136, 42, 255, 0.05)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>

          {/* Publish Button */}
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handlePublish}
                disabled={posting || uploading}
                sx={{ 
                  py: 2,
                  px: 6,
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #882AFF 0%, #6a1b9a 100%)',
                  boxShadow: '0 8px 25px rgba(136, 42, 255, 0.4)',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(136, 42, 255, 0.5)'
                  },
                  '&:disabled': {
                    background: '#ccc'
                  }
                }}
              >
                {posting ? 'Publishing...' : (initialData ? 'Update Post' : 'Publish Post')}
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
        
        <input
          type="file"
          ref={videoInputRef}
          onChange={handleVideoChange}
          style={{ display: 'none' }}
          accept="video/*"
        />
      </Container>
    </Box>
  );
};

export default CreateMarketplacePost;