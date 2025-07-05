import React, { useEffect, useState, useRef } from "react";

import {
  Box, Typography, Button,
  TextField,
  Avatar,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Card, FormControl,
  Tab, Tabs, Checkbox,
  Grid, Modal, Paper,
  AppBar, Toolbar, Container, InputLabel, ListItemText,
  CardContent, Autocomplete, CardActions, CardMedia, Divider, Stack,ListItemIcon,
  CircularProgress,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PriceTagIcon from '@mui/icons-material/LocalOffer';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Skeleton from "@mui/material/Skeleton";
import OutlinedInput from '@mui/material/OutlinedInput';
import Editor from "../../components/Editor";
import Sidebar from "../../components/Sidebar";

const MarketplaceModule = () => {

  const Categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Health & Beauty', 'Toys & Games']
  const Genders = ['Male', 'Female', 'Unisex']
  const Conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor']
  const Locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']

  const [postContent, setPostContent] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [posting, setPosting] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  // Marketplace specific states
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadedFileName(droppedFile.name);
      handleFileUpload(droppedFile);
    }
  };

  const handleFileUpload = async (file) => {
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
        setUploadedImageUrl(data.url);
        toast.success("File uploaded successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("File upload failed!", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadedFileName(selectedFile.name);
      handleFileUpload(selectedFile);
    }
  };

  const handlePublish = async () => {
    if (!title || !postContent || !category || !condition || !price || !location) {
      alert("Please fill all required fields!");
      return;
    }
    setPosting(true);
    
    const stripHtmlTags = (content) => content.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      title,
      description: stripHtmlTags(postContent),
      category,
      gender,
      condition,
      location,
      price: parseFloat(price),
      image_url: uploadedImageUrl,
      status: "published"
    };
    
    console.log('Marketplace item data:', payloadData);

    try {
      // Replace with your marketplace API endpoint
      const token = localStorage.getItem("token");
      // await axios.post("http://localhost:3001/api/v1/marketplace", payloadData, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   }
      // });
      
      alert("Item listed successfully!");
      // Clear form
      setTitle("");
      setPostContent("");
      setCategory("");
      setGender("");
      setCondition("");
      setLocation("");
      setPrice("");
      setUploadedImageUrl("");
      setUploadedFileName("");
      setPosting(false);
    } catch (error) {
      console.error("Error listing item:", error);
      alert("Failed to list item");
      setPosting(false);
    }
  };

  // Marketplace Preview Component
  const MarketplacePreview = () => {
    return (
      <Card sx={{ borderRadius: 2, padding: '10px', maxWidth: 400 }}>
        <CardContent sx={{ p: 0 }}>
          
          {/* Product Image */}
          {uploadedImageUrl ? (
            <Avatar 
              src={uploadedImageUrl} 
              alt="Product image" 
              sx={{ 
                width: '100%', 
                height: 250, 
                display: 'block', 
                margin: 'auto',
                borderRadius: 'inherit',
                objectFit: 'cover'
              }} 
            />
          ) : (
            <Skeleton 
              animation="wave" 
              variant="rectangular" 
              width="100%" 
              height={250} 
              sx={{ 
                display: 'block', 
                margin: 'auto', 
                borderRadius: 'inherit' 
              }} 
            />
          )}

          {/* Product Details */}
          <Box px={1} py={2}>
            {/* Price */}
            {price && (
              <Typography variant="h6" color="#882AFF" fontWeight="bold" mb={1}>
                ₹{price}
              </Typography>
            )}
            
            {/* Title */}
            {title && (
              <Typography variant="h6" fontWeight="bold" mb={1} sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {title}
              </Typography>
            )}

            {/* Description */}
            {postContent && (
              <Typography variant="body2" color="text.secondary" mb={2} sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'justify'
              }}>
                <span dangerouslySetInnerHTML={{ __html: postContent }} />
              </Typography>
            )}

            {/* Category & Condition */}
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              {category && (
                <Chip 
                  label={category} 
                  size="small" 
                  sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                />
              )}
              {condition && (
                <Chip 
                  label={condition} 
                  size="small" 
                  sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                />
              )}
              {gender && (
                <Chip 
                  label={gender} 
                  size="small" 
                  sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}
                />
              )}
            </Box>

            {/* Location */}
            {location && (
              <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {location}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box display="flex" gap={1} mt={2}>
              <Button 
                variant="outlined" 
                startIcon={<ChatBubbleOutlineIcon />}
                size="small"
                sx={{ 
                  flex: 1,
                  borderColor: '#882AFF',
                  color: '#882AFF',
                  '&:hover': {
                    borderColor: '#6a1b9a',
                    bgcolor: '#f3e5f5'
                  }
                }}
              >
                Message
              </Button>
              <Button 
                variant="contained" 
                startIcon={<ShoppingCartIcon />}
                size="small"
                sx={{ 
                  flex: 1,
                  bgcolor: '#882AFF',
                  '&:hover': {
                    bgcolor: '#6a1b9a'
                  }
                }}
              >
                Buy Now
              </Button>
            </Box>

            {/* Metadata */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Typography variant="caption" color="text.secondary">
                Posted by You
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Just Now
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100vh' }}>
      <Grid container sx={{overflow:'hidden !important'}}>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar/>
        </Grid>
        <Grid size={{ md: 11 }}> 
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#091a48',
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0
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
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                Marketplace - List Item
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

          <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, height: '100vh', overflow: 'hidden !important', padding:'20px'}}>
            <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden !important' }}>
              
              {/* Left Side - Form */}
              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)' ,height:'100%', overflowY: 'auto' }}>
                
                {/* Title Field */}
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Item Title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#7F56D9' },
                        '&:hover fieldset': { borderColor: '#7F56D9' },
                        '&.Mui-focused fieldset': { borderColor: '#7F56D9' }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#7F56D9' }
                    }}
                  />
                </Box>

                {/* Price Field */}
                <Box mb={2}>
                  <TextField
                    fullWidth
                    label="Price (₹) *"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#7F56D9' },
                        '&:hover fieldset': { borderColor: '#7F56D9' },
                        '&.Mui-focused fieldset': { borderColor: '#7F56D9' }
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#7F56D9' }
                    }}
                  />
                </Box>

                {/* Dropdowns */}
                <Grid container spacing={2} mb={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category *</InputLabel>
                      <Select
                        label="Category *"
                        size="small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{ color:'#882AFF'}}
                      >
                        {Categories.map((cat) => (
                          <MenuItem key={cat} value={cat} sx={{color:'#882AFF'}}>{cat}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Condition *</InputLabel>
                      <Select
                        label="Condition *"
                        size="small"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        sx={{ color:'#882AFF'}}
                      >
                        {Conditions.map((cond) => (
                          <MenuItem key={cond} value={cond} sx={{color:'#882AFF'}}>{cond}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2} mb={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Gender"
                        size="small"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        sx={{ color:'#882AFF'}}
                      >
                        {Genders.map((g) => (
                          <MenuItem key={g} value={g} sx={{color:'#882AFF'}}>{g}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Location *</InputLabel>
                      <Select
                        label="Location *"
                        size="small"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ color:'#882AFF'}}
                      >
                        {Locations.map((loc) => (
                          <MenuItem key={loc} value={loc} sx={{color:'#882AFF'}}>{loc}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Description Editor */}
                <Box mb={2}>
                  <Typography variant="subtitle2" mb={1} color="#882AFF">
                    Description *
                  </Typography>
                  <Editor value={postContent} onChange={setPostContent} />
                </Box>

                <Typography variant="caption" display="block" mb={2}>
                  275 characters left
                </Typography>

                {/* Uploaded Images */}
                <Box display="flex" gap={1} mb={2}>
                  {uploadedImageUrl && (
                    <Box position="relative">
                      <Avatar
                        variant="rounded"
                        src={uploadedImageUrl}
                        sx={{ width: 80, height: 80 }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'white',
                        }}
                        onClick={() => {
                          setUploadedImageUrl("");
                          setUploadedFileName("");
                          setFile(null);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Upload Media Box */}
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  sx={{
                    padding: "16px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                    cursor: "pointer",
                    my: 2,
                    margin: "10px",
                    marginLeft: "0px",
                    boxShadow: '0px 2px 1px -1px rgb(247 247 247 / 12%), 0px 1px 1px 0px rgb(247 247 247 / 12%), 0px 1px 3px 0px rgb(247 247 247 / 12%)'
                  }}
                  onClick={handleBoxClick}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Typography variant="body1" sx={{ color: "#000" }}>
                    + Upload Media
                  </Typography>

                  {uploadedFileName && (
                    <Typography variant="body2" sx={{
                      color: "#444", 
                      mt: 1, 
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis", 
                      maxWidth: "400px",
                    }}>
                      Selected File: {uploadedFileName}
                    </Typography>
                  )}

                  {uploading && <Typography variant="body2">Uploading...</Typography>}
                </Box>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />

                {/* Publish Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handlePublish}
                  disabled={posting || uploading}
                  sx={{ 
                    mt: 2, 
                    bgcolor: '#7F56D9', 
                    color: '#fff',
                    '&:disabled': {
                      bgcolor: '#9575cd',
                      color: '#fff'
                    }
                  }}
                >
                  {posting ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={20} sx={{ color: '#fff' }} />
                      Listing Item...
                    </Box>
                  ) : (
                    'List Item'
                  )}
                </Button>
              </Grid>

              {/* Right Side - Preview */}
              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', height:'100%' }}>
                <Typography variant="h6" mb={2} color="#882AFF">
                  Marketplace Preview
                </Typography>
                <Box display="flex" justifyContent="center">
                  <MarketplacePreview />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketplaceModule;