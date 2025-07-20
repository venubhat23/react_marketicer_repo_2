import React, { useState, useRef, useEffect } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, 
  FormControl, Grid, Modal, Paper, Container, InputLabel, CardContent, CardMedia, 
  Card, CircularProgress
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { useAuth } from "../../authContext/AuthContext";
import Editor from "../../components/Editor";
import { marketplaceApi, uploadApi } from "../../utils/marketplaceApi";

const CreateMarketplacePost = ({ 
  onBack, 
  onPostCreated, 
  initialData = null 
}) => {
  const { user } = useAuth();
  
  // Constants as per specification
  const Categories = ['A', 'B'];
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];

  // Form states as per specification
  const [brandName, setBrandName] = useState(initialData?.brand || ""); // Will be auto-filled from user profile
  const [userProfile, setUserProfile] = useState(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || "");
  const [budget, setBudget] = useState(initialData?.budget || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [platform, setPlatform] = useState(initialData?.platform || "");
  const [languages, setLanguages] = useState(initialData?.languages || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [tags, setTags] = useState(() => {
    if (!initialData?.tags) return "";
    // If tags is an array, join it to a string
    if (Array.isArray(initialData.tags)) {
      return initialData.tags.join(', ');
    }
    // If tags is already a string, use it as is
    return initialData.tags;
  });
  
  // Upload states
  const [uploadedImageUrl, setUploadedImageUrl] = useState(initialData?.imageUrl || "");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(initialData?.videoUrl || "");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  
  // File input refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.token) return;
      
      try {
        const response = await fetch("https://api.marketincer.com/api/v1/user/profile", {
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUserProfile(data.data);
            // Auto-fill brand name with user's name if not already set from initialData
            if (!initialData?.brand && data.data.name) {
              setBrandName(data.data.name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to a default name if profile fetch fails
        if (!initialData?.brand) {
          setBrandName("Your Brand Name");
        }
      }
    };

    fetchUserProfile();
  }, [user, initialData]);

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
      const data = await uploadApi.uploadFile(file);
      
      if (data.url) {
        if (type === 'image') {
          setUploadedImageUrl(data.url);
        } else {
          setUploadedVideoUrl(data.url);
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} upload failed!`);
      console.error("Error uploading file:", error);
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
    if (!title || !description || !category || !targetAudience || !budget || !deadline || !location || !platform || !languages) {
      toast.error("Please fill all required fields!");
      return;
    }
    
    setPosting(true);
    
    // Prepare API payload according to specification
    const payloadData = {
      title,
      description,
      category,
      target_audience: targetAudience,
      budget: parseFloat(budget.toString().replace(/[^\d.]/g, '')), // Remove currency symbols
      location,
      platform,
      languages,
      deadline,
      tags: typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : tags,
      status: "published",
      brand_name: brandName,
      media_url: uploadedImageUrl || uploadedVideoUrl,
      media_type: uploadedImageUrl ? "image" : uploadedVideoUrl ? "video" : null
    };
    
    try {
      let response;
      if (initialData?.id) {
        // Update existing post
        response = await marketplaceApi.updateMarketplacePost(initialData.id, payloadData);
      } else {
        // Create new post
        response = await marketplaceApi.createMarketplacePost(payloadData);
      }
      
      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message || (initialData ? "Post updated successfully!" : "Post published successfully!"));
        
        // Callback to parent component with API response data
        if (onPostCreated) {
          onPostCreated(response.data.data);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to publish post');
      }
      
    } catch (error) {
      console.error("Error publishing post:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to publish post";
      toast.error(errorMessage);
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header matching AIContractGenerator style */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={onBack}
              sx={{ mr: 1 }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {initialData ? 'Edit Post' : 'Create New Post'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ padding: '24px' }}>
        <Grid container spacing={3}>
          {/* Left Panel - Form */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
                  Post Details
                </Typography>
                
                {/* Brand Name (auto-filled with logged-in user's name) */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: '#333', 
                      fontWeight: 500 
                    }}
                  >
                    Brand Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Your brand name"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                    }}
                  />
                </Box>
                
                {/* Title */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: '#333', 
                      fontWeight: 500 
                    }}
                  >
                    Title *
                  </Typography>
                  <TextField
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                    }}
                  />
                </Box>
                
                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 1, 
                      color: '#333', 
                      fontWeight: 500 
                    }}
                  >
                    Description *
                  </Typography>
                  <TextField
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    placeholder="Enter post description"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: '#f8f9fa',
                        '&:hover fieldset': {
                          borderColor: '#2196f3',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                        },
                      },
                    }}
                  />
                </Box>
                
                {/* Media Upload Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      color: '#333', 
                      fontWeight: 500 
                    }}
                  >
                    Media Upload
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        onClick={handleImageUpload}
                        sx={{
                          border: '2px dashed #2196f3',
                          borderRadius: 2,
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          bgcolor: '#f8f9fa',
                          '&:hover': { 
                            bgcolor: '#e3f2fd',
                            borderColor: '#1976d2'
                          },
                          minHeight: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography sx={{ color: '#2196f3', fontWeight: 500 }}>
                          Upload Image
                        </Typography>
                        {uploadedImageUrl && (
                          <Avatar src={uploadedImageUrl} sx={{ width: 40, height: 40, mt: 1 }} />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        onClick={handleVideoUpload}
                        sx={{
                          border: '2px dashed #2196f3',
                          borderRadius: 2,
                          p: 3,
                          textAlign: 'center',
                          cursor: 'pointer',
                          bgcolor: '#f8f9fa',
                          '&:hover': { 
                            bgcolor: '#e3f2fd',
                            borderColor: '#1976d2'
                          },
                          minHeight: '100px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography sx={{ color: '#2196f3', fontWeight: 500 }}>
                          Upload Video
                        </Typography>
                        {uploadedVideoUrl && (
                          <Typography variant="caption" sx={{ color: 'green', mt: 1 }}>
                            Video uploaded
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Category and Target Audience - Fixed dropdowns */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Category *
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <Typography sx={{ color: '#999' }}>Select Category</Typography>
                        </MenuItem>
                        {Categories.map((cat) => (
                          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Target Audience *
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        displayEmpty
                        sx={{
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2196f3',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          <Typography sx={{ color: '#999' }}>Select Target Audience</Typography>
                        </MenuItem>
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
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Budget (₹) *
                    </Typography>
                    <TextField
                      fullWidth
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="10,000"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Mumbai"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                
                {/* Platform and Languages */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Platform
                    </Typography>
                    <TextField
                      fullWidth
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="Instagram, YouTube"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Languages
                    </Typography>
                    <TextField
                      fullWidth
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="Hindi, English"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                
                {/* Deadline and Tags */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Deadline *
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                        fontWeight: 500 
                      }}
                    >
                      Tags
                    </Typography>
                    <TextField
                      fullWidth
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Fitness, Fashion"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: '#f8f9fa',
                          '&:hover fieldset': {
                            borderColor: '#2196f3',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2196f3',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                
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
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handlePublish}
                  disabled={posting || uploading}
                  sx={{ 
                    py: 2,
                    bgcolor: '#2196f3',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: '#1976d2',
                    },
                    '&:disabled': {
                      bgcolor: '#f5f5f5',
                      color: '#999',
                    },
                  }}
                  startIcon={posting ? <CircularProgress size={20} /> : null}
                >
                  {posting ? 'Publishing...' : (initialData ? 'Update Post' : 'Publish Post')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right Panel - Live Preview */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'sticky', 
                top: '20px',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                  Live Preview
                </Typography>
                <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {uploadedImageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={uploadedImageUrl}
                      alt="Preview"
                    />
                  )}
                  <CardContent>
                    {/* Brand Name - Display the logged-in user's name */}
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      {brandName || 'Your Brand Name'}
                    </Typography>
                    
                    {/* Title */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {title || 'Post Title'}
                    </Typography>
                    
                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {description || 'Post description will appear here...'}
                    </Typography>
                    
                    {/* Budget */}
                    <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 'bold', mb: 1 }}>
                      {budget ? `₹${budget}` : '₹0'}
                    </Typography>
                    
                    {/* Deadline */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Deadline: {deadline || 'Not specified'}
                    </Typography>
                    
                    {/* Tags */}
                    {tags && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(typeof tags === 'string' ? tags.split(',') : tags).map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={typeof tag === 'string' ? tag.trim() : tag} 
                            size="small" 
                            sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateMarketplacePost;