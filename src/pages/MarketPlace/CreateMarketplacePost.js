import React, { useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, 
  FormControl, Grid, Modal, Paper, Container, InputLabel, CardContent, CardMedia, 
  Card
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import Editor from "../../components/Editor";

const CreateMarketplacePost = ({ 
  onBack, 
  onPostCreated, 
  initialData = null 
}) => {
  // Constants
  const Categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Health & Beauty', 'Toys & Games'];
  const Genders = ['Male', 'Female', 'Unisex'];
  const Conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const Locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [postContent, setPostContent] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [type, setType] = useState(initialData?.type || "");
  const [budget, setBudget] = useState(initialData?.budget || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [requirements, setRequirements] = useState(initialData?.requirements || "");
  const [gender, setGender] = useState(initialData?.gender || "");
  const [condition, setCondition] = useState(initialData?.condition || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [price, setPrice] = useState(initialData?.price || "");
  
  // Upload states
  const [uploadedImageUrl, setUploadedImageUrl] = useState(initialData?.image_url || "");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(initialData?.video_url || "");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  
  // File input refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // File upload handlers
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleVideoBoxClick = () => {
    videoInputRef.current.click();
  };

  const handleFileUpload = async (file, type) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_preset');
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/${type}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (type === 'image') {
          setUploadedImageUrl(data.url);
        } else {
          setUploadedVideoUrl(data.url);
        }
        toast.success(`${type} uploaded successfully!`);
      }
    } catch (error) {
      toast.error(`${type} upload failed!`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setUploadedFileName(selectedFile.name);
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
    if (!title || !postContent || !category || !type || !budget || !deadline) {
      toast.error("Please fill all required fields!");
      return;
    }
    
    setPosting(true);
    const stripHtmlTags = (content) => content.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      title,
      description: stripHtmlTags(postContent),
      category,
      type,
      budget,
      deadline,
      requirements: stripHtmlTags(requirements),
      gender,
      condition,
      location,
      price: parseFloat(price) || 0,
      image_url: uploadedImageUrl,
      video_url: uploadedVideoUrl,
      status: "published"
    };
    
    try {
      // Replace with actual API call
      console.log('Publishing marketplace post:', payloadData);
      
      // Mock success - create new post object
      const newPost = {
        id: initialData?.id || Date.now(),
        ...payloadData,
        dateCreated: new Date().toISOString().split('T')[0],
        views: initialData?.views || 0,
        brand: "Your Brand"
      };
      
      toast.success("Post published successfully!");
      
      // Clear form
      setTitle("");
      setPostContent("");
      setCategory("");
      setType("");
      setBudget("");
      setDeadline("");
      setRequirements("");
      setGender("");
      setCondition("");
      setLocation("");
      setPrice("");
      setUploadedImageUrl("");
      setUploadedVideoUrl("");
      setUploadedFileName("");
      
      // Callback to parent component
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      // Navigate back to listing
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
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
          Create New Post
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#882AFF' }}>
              Post Details
            </Typography>
            
            <TextField
              fullWidth
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type *</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Type *"
                  >
                    {Types.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
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
            </Grid>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Budget *"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="₹10,000"
                />
              </Grid>
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
            </Grid>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender Target</InputLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Gender Target"
                  >
                    {Genders.map((g) => (
                      <MenuItem key={g} value={g}>{g}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    label="Location"
                  >
                    {Locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Description *
            </Typography>
            <Box sx={{ mb: 2, minHeight: 200 }}>
              <Editor value={postContent} onChange={setPostContent} />
            </Box>
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Requirements
            </Typography>
            <Box sx={{ mb: 2, minHeight: 150 }}>
              <Editor value={requirements} onChange={setRequirements} />
            </Box>
            
            {/* Upload Section */}
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Upload Media
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box
                  onClick={handleBoxClick}
                  sx={{
                    border: '2px dashed #882AFF',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3e5f5' }
                  }}
                >
                  <Typography>+ Upload Image</Typography>
                  {uploadedImageUrl && (
                    <Avatar src={uploadedImageUrl} sx={{ width: 60, height: 60, mx: 'auto', mt: 1 }} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  onClick={handleVideoBoxClick}
                  sx={{
                    border: '2px dashed #882AFF',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3e5f5' }
                  }}
                >
                  <Typography>+ Upload Video</Typography>
                  {uploadedVideoUrl && (
                    <Typography variant="caption" sx={{ color: 'green', mt: 1 }}>
                      Video uploaded successfully
                    </Typography>
                  )}
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
            
            <Button
              variant="contained"
              fullWidth
              onClick={handlePublish}
              disabled={posting || uploading}
              sx={{ 
                mt: 2,
                py: 1.5,
              }}
            >
              {posting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Paper>
        </Grid>
        
        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#882AFF' }}>
              Preview
            </Typography>
            <Card sx={{ borderRadius: 2 }}>
              {uploadedImageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={uploadedImageUrl}
                  alt="Post preview"
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {title || 'Post Title'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {postContent.replace(/<[^>]*>/g, '') || 'Post description will appear here...'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {type && <Chip label={type} size="small" />}
                  {category && <Chip label={category} size="small" />}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Budget: {budget || 'Not specified'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {deadline || 'Not specified'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateMarketplacePost;