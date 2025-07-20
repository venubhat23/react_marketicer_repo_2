import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, 
  FormControl, Grid, Modal, Paper, Container, InputLabel, CardContent, CardMedia, 
  Card, Divider, Stack
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { PhotoCamera, Videocam, LocationOn, Schedule, LocalOffer, Category, People, Language } from "@mui/icons-material";
import { toast } from "react-toastify";
import Editor from "../../components/Editor";
import MarketplaceAPI, { handleApiError } from "../../services/marketplaceApi";

const CreateMarketplacePost = ({ 
  onBack, 
  onPostCreated, 
  initialData = null 
}) => {
  // Constants as per specification
  const Categories = ['A', 'B'];
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];

  // Form states as per specification
  const [brandName, setBrandName] = useState(initialData?.brand || "Your Brand Name"); // Auto-filled
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
      const response = await MarketplaceAPI.uploadMedia(file, type);
      
      if (response.success && response.data.url) {
        if (type === 'image') {
          setUploadedImageUrl(response.data.url);
        } else {
          setUploadedVideoUrl(response.data.url);
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(handleApiError(error));
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
      budget: budget.startsWith('₹') ? budget : `₹${budget}`,
      location,
      platform,
      languages,
      deadline,
      tags,
      image_url: uploadedImageUrl,
      video_url: uploadedVideoUrl,
      status: "published",
      type: "Sponsored Post"
    };
    
    try {
      let response;
      
      if (initialData?.id) {
        // Update existing post
        response = await MarketplaceAPI.updatePost(initialData.id, payloadData);
      } else {
        // Create new post
        response = await MarketplaceAPI.createPost(payloadData);
      }
      
      if (response.success) {
        const newPost = {
          id: initialData?.id || response.data?.id || Date.now(),
          ...payloadData,
          imageUrl: uploadedImageUrl, // Keep both formats for compatibility
          videoUrl: uploadedVideoUrl,
          dateCreated: new Date().toISOString().split('T')[0],
          views: initialData?.views || 0,
          brand: brandName,
          bids_count: initialData?.bids_count || 0
        };
        
        toast.success(initialData ? "Post updated successfully!" : "Post published successfully!");
        
        // Callback to parent component
        if (onPostCreated) {
          onPostCreated(newPost);
        }
      } else {
        throw new Error(response.error?.message || 'Failed to publish post');
      }
      
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error(handleApiError(error));
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative'
    }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: 'rgba(136, 42, 255, 0.9)', 
          color: 'white',
          borderRadius: 0,
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '16px 24px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={onBack}
              sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {initialData ? 'Edit Post' : 'Create New Post'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content - 50/50 Split */}
      <Box sx={{ padding: '24px' }}>
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 120px)' }}>
          
          {/* Left Panel - Form (50%) */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%',
              overflow: 'auto'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: '#882AFF', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Category />
                  Post Details
                </Typography>
                
                {/* Brand Name */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                    Brand Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                      }
                    }}
                  />
                </Box>
                
                {/* Title */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging post title"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#882AFF' },
                        '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                      }
                    }}
                  />
                </Box>
                
                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                    Description *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your campaign requirements in detail..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#882AFF' },
                        '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                      }
                    }}
                  />
                </Box>
                
                {/* Media Upload */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                    Media Upload
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        onClick={handleImageUpload}
                        sx={{
                          border: '2px dashed #882AFF',
                          borderRadius: 3,
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: '#f3e5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 16px rgba(136, 42, 255, 0.2)'
                          },
                          minHeight: '120px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 40, color: '#882AFF', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Upload Image</Typography>
                        {uploadedImageUrl && (
                          <Avatar src={uploadedImageUrl} sx={{ width: 50, height: 50, mt: 1 }} />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        onClick={handleVideoUpload}
                        sx={{
                          border: '2px dashed #882AFF',
                          borderRadius: 3,
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            bgcolor: '#f3e5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 16px rgba(136, 42, 255, 0.2)'
                          },
                          minHeight: '120px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Videocam sx={{ fontSize: 40, color: '#882AFF', mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Upload Video</Typography>
                        {uploadedVideoUrl && (
                          <Typography variant="caption" sx={{ color: '#4caf50', mt: 1, fontWeight: 600 }}>
                            ✓ Video uploaded
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Category and Target Audience */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Category *
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#882AFF' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#882AFF' },
                        }}
                      >
                        {Categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>Category {cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Target Audience *
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        sx={{
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#882AFF' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#882AFF' },
                        }}
                      >
                        {TargetAudiences.map((audience) => (
                          <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                {/* Budget and Location */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Budget (₹) *
                    </Typography>
                    <TextField
                      fullWidth
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="10,000"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': { borderColor: '#882AFF' },
                          '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Mumbai, India"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': { borderColor: '#882AFF' },
                          '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                {/* Platform and Languages */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Platform
                    </Typography>
                    <TextField
                      fullWidth
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="Instagram, YouTube"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': { borderColor: '#882AFF' },
                          '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Languages
                    </Typography>
                    <TextField
                      fullWidth
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="Hindi, English"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': { borderColor: '#882AFF' },
                          '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                {/* Deadline and Tags */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Deadline *
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': { borderColor: '#882AFF' },
                          '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      Tags
                    </Typography>
                    <TextField
                      fullWidth
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Fashion, Lifestyle, Tech"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': { borderColor: '#882AFF' },
                          '&.Mui-focused fieldset': { borderColor: '#882AFF' },
                        }
                      }}
                    />
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
                
                {/* Publish Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handlePublish}
                  disabled={posting || uploading}
                  sx={{ 
                    py: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #882AFF 0%, #6a1b9a 100%)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(136, 42, 255, 0.3)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(136, 42, 255, 0.4)'
                    },
                    '&:disabled': {
                      background: '#f5f5f5',
                      color: '#999',
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {posting ? 'Publishing...' : (initialData ? 'Update Post' : 'Publish Post')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right Panel - Live Preview (50%) */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              height: '100%',
              overflow: 'auto',
              background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)'
            }}>
              <CardContent sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  color: '#882AFF', 
                  fontWeight: 700,
                  textAlign: 'center',
                  fontSize: '1.5rem'
                }}>
                  Live Preview
                </Typography>
                
                {/* Preview Card */}
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  mb: 3,
                  background: 'white',
                  border: '1px solid #e1e7ff'
                }}>
                  {/* Image Preview */}
                  {uploadedImageUrl ? (
                    <CardMedia
                      component="img"
                      height="240"
                      image={uploadedImageUrl}
                      alt="Preview"
                      sx={{ borderRadius: '12px 12px 0 0' }}
                    />
                  ) : (
                    <Box sx={{ 
                      height: 240, 
                      bgcolor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '12px 12px 0 0'
                    }}>
                      <PhotoCamera sx={{ fontSize: 60, color: '#ddd' }} />
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 3 }}>
                    {/* Brand Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#882AFF', width: 32, height: 32, mr: 1 }}>
                        {brandName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                        {brandName}
                      </Typography>
                    </Box>
                    
                    {/* Title */}
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: '#333',
                      fontSize: '1.3rem',
                      lineHeight: 1.3
                    }}>
                      {title || 'Your Post Title Will Appear Here'}
                    </Typography>
                    
                    {/* Description */}
                    <Typography variant="body2" sx={{ 
                      color: '#666', 
                      mb: 3,
                      lineHeight: 1.6
                    }}>
                      {description || 'Your detailed post description will be displayed here. This gives influencers a clear understanding of your campaign requirements.'}
                    </Typography>
                    
                    {/* Budget Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalOffer sx={{ color: '#4caf50', mr: 1 }} />
                      <Typography variant="h5" sx={{ 
                        color: '#4caf50', 
                        fontWeight: 800,
                        fontSize: '1.8rem'
                      }}>
                        {budget ? `₹${budget}` : '₹0'}
                      </Typography>
                    </Box>
                    
                    {/* Details Grid */}
                    <Stack spacing={2}>
                      {deadline && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Deadline: {deadline}
                          </Typography>
                        </Box>
                      )}
                      
                      {location && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ color: '#f44336', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {location}
                          </Typography>
                        </Box>
                      )}
                      
                      {targetAudience && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <People sx={{ color: '#2196f3', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Target: {targetAudience}
                          </Typography>
                        </Box>
                      )}
                      
                      {platform && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Language sx={{ color: '#9c27b0', mr: 1, fontSize: 20 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Platform: {platform}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    
                    {/* Tags */}
                    {tags && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                          Tags:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {tags.split(',').map((tag, index) => (
                            <Chip 
                              key={index} 
                              label={tag.trim()} 
                              size="small" 
                              sx={{ 
                                bgcolor: '#e8f5e8', 
                                color: '#2e7d32',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#c8e6c9' }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                {/* Additional Preview Info */}
                <Box sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(136, 42, 255, 0.05)', 
                  borderRadius: 3,
                  border: '1px solid rgba(136, 42, 255, 0.1)'
                }}>
                  <Typography variant="body2" sx={{ 
                    color: '#882AFF', 
                    fontWeight: 600,
                    textAlign: 'center',
                    mb: 1
                  }}>
                    💡 Preview Tips
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#666', 
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    This is how your post will appear to influencers in the marketplace. 
                    Make sure all details are accurate and compelling!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateMarketplacePost;