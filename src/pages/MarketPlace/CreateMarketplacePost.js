import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, 
  FormControl, Grid, Modal, Paper, Container, InputLabel, CardContent, CardMedia, 
  Card, CircularProgress
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import Editor from "../../components/Editor";
import { marketplaceApi, uploadApi } from "../../utils/marketplaceApi";

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
      tags,
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
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={onBack}
          sx={{ mr: 2, color: '#882AFF' }}
        >
          <ArrowLeftIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
          {initialData ? 'Edit Post' : 'Create New Post'}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Panel - Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#882AFF' }}>
              Post Details
            </Typography>
            
            {/* Line 1: Brand Name (auto-filled) */}
            <TextField
              fullWidth
              label="Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              sx={{ mb: 2 }}
              disabled
            />
            
            {/* Line 2: Title and Description */}
            <TextField
              fullWidth
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter post title"
            />
            
            <TextField
              fullWidth
              label="Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              placeholder="Enter post description"
            />
            
            {/* Line 3: Media Upload Section */}
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Media Upload
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box
                  onClick={handleImageUpload}
                  sx={{
                    border: '2px dashed #882AFF',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3e5f5' },
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography>Upload Image</Typography>
                  {uploadedImageUrl && (
                    <Avatar src={uploadedImageUrl} sx={{ width: 40, height: 40, mt: 1 }} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  onClick={handleVideoUpload}
                  sx={{
                    border: '2px dashed #882AFF',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3e5f5' },
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography>Upload Video</Typography>
                  {uploadedVideoUrl && (
                    <Typography variant="caption" sx={{ color: 'green', mt: 1 }}>
                      Video uploaded
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            {/* Line 4: Category and Target Audience */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category *"
                  >
                    {Categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience *</InputLabel>
                  <Select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    label="Target Audience *"
                  >
                    {TargetAudiences.map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            {/* Line 5: Budget and Location */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Budget (₹) *"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="10,000"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Mumbai"
                />
              </Grid>
            </Grid>
            
            {/* Line 6: Platform and Languages */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="Instagram, YouTube"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Languages"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="Hindi, English"
                />
              </Grid>
            </Grid>
            
            {/* Line 7: Deadline and Tags */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Deadline *"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Fitness, Fashion"
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
                py: 1.5,
                bgcolor: '#882AFF',
                '&:hover': { bgcolor: '#6a1b9a' }
              }}
            >
              {posting ? 'Publishing...' : (initialData ? 'Update Post' : 'Publish Post')}
            </Button>
          </Paper>
        </Grid>
        
        {/* Right Panel - Live Preview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '20px' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#882AFF' }}>
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
                {/* Brand Name */}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {brandName}
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
                <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold', mb: 1 }}>
                  {budget ? `₹${budget}` : '₹0'}
                </Typography>
                
                {/* Deadline */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Deadline: {deadline || 'Not specified'}
                </Typography>
                
                {/* Tags */}
                {tags && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {tags.split(',').map((tag, index) => (
                      <Chip 
                        key={index} 
                        label={tag.trim()} 
                        size="small" 
                        sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateMarketplacePost;