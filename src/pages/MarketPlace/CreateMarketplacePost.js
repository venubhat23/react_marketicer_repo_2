import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  CardMedia,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  PhotoCamera,
  Videocam,
  LocationOn,
  Schedule,
  LocalOffer,
  Category,
  People,
  Language,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import MarketplaceAPI, { handleApiError } from "../../services/marketplaceApi";
import Sidebar from '../../components/Sidebar'

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
  const [brandName, setBrandName] = useState(initialData?.brand || " "); // Auto-filled
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
  const [error, setError] = useState('');
  
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
      } else {
        throw new Error("Upload failed");
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handlePublish = async () => {
    if (!title || !description || !category || !targetAudience || !budget || !deadline) {
      setError("Please fill all required fields!");
      return;
    }
    
    setPosting(true);
    setError('');
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
        response = await MarketplaceAPI.updateMarketplacePost(initialData.id, payloadData);
      } else {
        // Create new post
        response = await MarketplaceAPI.createMarketplacePost(payloadData);
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
        
        toast.success(response.message || (initialData ? "Post updated successfully!" : "Post published successfully!"));
        
        // Callback to parent component
        if (onPostCreated) {
          onPostCreated(newPost);
        }
      } else {
        throw new Error(response.error?.message || 'Failed to publish post');
      }
      
    } catch (err) {
      setError(`Error publishing post: ${err.message}`);
      console.error("Error publishing post:", err);
    } finally {
      setPosting(false);
    }
  };

  const renderRightPanel = () => {
    return (
      <Box>
        {/* <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
          Live Preview
        </Typography> */}
        
        {/* Preview Card */}
        <Paper
          sx={{
            p: 3,
            bgcolor: '#ffffff',
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            mb: 1,
          }}
        >
          {/* Image Preview */}
          {uploadedImageUrl ? (
            <CardMedia
              component="img"
              //height="160"
              image={uploadedImageUrl}
              alt="Preview"
              sx={{ borderRadius: 2, mb: 2 }}
            />
          ) : (
            <Box sx={{ 
              height: 160, 
              bgcolor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 2,
              mb: 1
            }}>
              <PhotoCamera sx={{ fontSize: 40, color: '#ddd' }} />
            </Box>
          )}
          
          {/* Brand Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ bgcolor: '#2196f3', width: 32, height: 32, mr: 1 }}>
              {brandName.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
              {brandName}
            </Typography>
          </Box>
          
          {/* Title */}
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            mb: 1, 
            color: '#333',
            
          }}>
            {title || 'Your Post Title Will Appear Here'}
          </Typography>
          
          {/* Description */}
          <Typography variant="body2" sx={{ 
            color: '#666', 
            mb: 1,
            
          }}>
            {description ? (description.length > 150 ? description.substring(0, 150) + '...' : description) : 'Your detailed post description will be displayed here...'}
          </Typography>
          
          {/* Budget Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocalOffer sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
            <Typography variant="h6" sx={{ 
              color: '#4caf50', 
              fontWeight: 700
            }}>
              {budget ? `₹${budget}` : '₹0'}
            </Typography>
          </Box>
          
          {/* Details */}
          <Stack spacing={1} sx={{ mb: 1 }}>
            {deadline && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ color: '#ff9800', mr: 1, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Deadline: {deadline}
                </Typography>
              </Box>
            )}
            
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ color: '#f44336', mr: 1, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {location}
                </Typography>
              </Box>
            )}
            
            {targetAudience && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ color: '#2196f3', mr: 1, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Target: {targetAudience}
                </Typography>
              </Box>
            )}
            
            {platform && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Language sx={{ color: '#9c27b0', mr: 1, fontSize: 18 }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Platform: {platform}
                </Typography>
              </Box>
            )}
          </Stack>
          
          {/* Tags */}
          {tags && (
            <Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 600 }}>
                Tags:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.split(',').slice(0, 3).map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag.trim()} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#e8f5e8', 
                      color: '#2e7d32',
                      fontWeight: 600
                    }}
                  />
                ))}
                {tags.split(',').length > 3 && (
                  <Typography variant="caption" sx={{ color: '#999', alignSelf: 'center' }}>
                    +{tags.split(',').length - 3} more
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handlePublish}
            disabled={posting || uploading}
            sx={{
              bgcolor: '#2196f3',
              textTransform: 'none',
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#1976d2',
              },
            }}
          >
            {posting ? <CircularProgress size={20} /> : (initialData ? 'Update Post' : 'Publish Post')}
          </Button>
        </Box>
      </Box>
    );
  };

  return (
      <Box>
      <Grid container>
        {/* <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid> */}
        <Grid size={{ md: 12 }}>
           {/* Header - Updated color to #091a48 */}
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Main Content */}
        <Box sx={{ padding: '24px' }}>
          <Grid container spacing={3}>
            {/* Left Panel - Post Details Form */}
            <Grid size={{ xs:12, sm:6, md: 8 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                  {/* Brand Name Field */}
                  <Box sx={{ mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                      }}
                    >
                      Brand Name
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Brand Name"
                      value={brandName}
                      size='small'
                      onChange={(e) => setBrandName(e.target.value)}
                      //disabled
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

                  {/* Title Field */}
                  <Box sx={{ mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                         
                      }}
                    >
                      Post Title *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter an engaging post title"
                      variant="outlined"
                      value={title}
                      size='small'
                      onChange={(e) => setTitle(e.target.value)}
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

                  {/* Description Field */}
                  <Box sx={{ mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 1, 
                        color: '#333', 
                         
                      }}
                    >
                      Description *
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      size='small'
                      rows={4}
                      placeholder="Describe your campaign requirements in detail..."
                      variant="outlined"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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

                  {/* Media Upload */}
                  <Box sx={{ mb: 1 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 2, 
                        color: '#333', 
                      }}
                    >
                      Media Upload
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs:12, sm:6, md: 6 }}>
                        <Box
                          onClick={handleImageUpload}
                          sx={{
                            border: '2px dashed #2196f3',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: '#f8f9fa',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              bgcolor: '#e3f2fd',
                              borderColor: '#1976d2'
                            },
                            minHeight: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <PhotoCamera sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Upload Image</Typography>
                          {uploadedImageUrl && (
                            <Avatar src={uploadedImageUrl} sx={{ width: 40, height: 40, mt: 1 }} />
                          )}
                        </Box>
                      </Grid>
                      <Grid size={{ xs:12, sm:6, md: 6 }}>
                        <Box
                          onClick={handleVideoUpload}
                          sx={{
                            border: '2px dashed #2196f3',
                            borderRadius: 2,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: '#f8f9fa',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              bgcolor: '#e3f2fd',
                              borderColor: '#1976d2'
                            },
                            minHeight: '120px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Videocam sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>Upload Video</Typography>
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
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          
                        }}
                      >
                        Category *
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={category}
                          size='small'
                         
                          onChange={(e) => setCategory(e.target.value)}
                          sx={{
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                          }}
                        >
                          {Categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>Category {cat}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                         
                        }}
                      >
                        Target Audience *
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={targetAudience}
                          size='small'
                          onChange={(e) => setTargetAudience(e.target.value)}
                          sx={{
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                          }}
                        >
                          {TargetAudiences.map((audience) => (
                            <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          
                        }}
                      >
                        Budget (₹) *
                      </Typography>
                      <TextField
                        fullWidth
                        value={budget}
                        size='small'
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="10,000"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover fieldset': { borderColor: '#2196f3' },
                            '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Budget and Location */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          
                        }}
                      >
                        Location
                      </Typography>
                      <TextField
                        fullWidth
                        value={location}
                        size='small'
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Mumbai, India"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover fieldset': { borderColor: '#2196f3' },
                            '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          
                        }}
                      >
                        Platform
                      </Typography>
                      <TextField
                        fullWidth
                        size='small'
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        placeholder="Instagram, YouTube"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover fieldset': { borderColor: '#2196f3' },
                            '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          
                        }}
                      >
                        Languages
                      </Typography>
                      <TextField
                        fullWidth
                        size='small'
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        placeholder="Hindi, English"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover fieldset': { borderColor: '#2196f3' },
                            '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Deadline and Tags */}
                  <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                         
                        }}
                      >
                        Deadline *
                      </Typography>
                      <TextField
                        fullWidth
                        type="date"
                        size='small'
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover fieldset': { borderColor: '#2196f3' },
                            '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                          }
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs:12, sm:6, md: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          
                        }}
                      >
                        Tags
                      </Typography>
                      <TextField
                        fullWidth
                        size='small'
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Fashion, Lifestyle, Tech"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover fieldset': { borderColor: '#2196f3' },
                            '&.Mui-focused fieldset': { borderColor: '#2196f3' },
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
                </CardContent>
              </Card>
            </Grid>

            {/* Right Panel - Live Preview */}
            <Grid size={{ xs:12, sm:6, md: 4 }}>
              <Card 
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  height: 'fit-content',
                  minHeight: '500px'
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  {renderRightPanel()}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        </Grid>
      </Grid>
       
      </Box>
  );
};

export default CreateMarketplacePost;