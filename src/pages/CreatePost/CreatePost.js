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
  CircularProgress, // Add this import
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import MoreVert from "@mui/icons-material/MoreVert";
import Repeat from "@mui/icons-material/Repeat";
import ThumbUp from "@mui/icons-material/ThumbUp";
import MessageCircle from "@mui/icons-material/Star"; // Placeholder for MessageCircle
import Editor from "../../components/Editor";
import TabComponent from "../../components/TabComponent";
import InstagramPost from "../../components/InstagramPost"
import Layout from "../../components/Layout";
import axios from 'axios';
import { useMutation } from "@tanstack/react-query";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Skeleton from "@mui/material/Skeleton";
import OutlinedInput from '@mui/material/OutlinedInput';
import FacebookIcon from '../../assets/images/facebook.png';
import InstaIcon from '../../assets/images/instagram.png';
import LinkedInIcon from '../../assets/images/linkedin.png';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CreatePost = () => {

  const Brands = ['D-Mart', 'V-Mart', 'Blinkit']

  const TabPanel = ({ value, index, children }) => {
    return (
      value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )
    );
  };

  const [postContent, setPostContent] = useState("");
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  //const [openAnother, setOpenAnother] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [brandName, setBrandName] = useState("");
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [posting, setPosting] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  //const [createPostMode, setCreatePostMode] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  // const [data, setData] = useState("");
  const [createPostMode, setCreatePostMode] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedOption, setSelectedOption] = useState([])
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectUser, setSelectUser] = useState('')

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedChipId, setSelectedChipId] = useState(null);

  console.log('hereree', selectUser)

  // Function to get tab index based on page type
  const getTabIndexByPageType = (pageType) => {
    switch(pageType) {
      case 'instagram':
        return 0;
      case 'linkedin':
        return 1;
      case 'facebook':
        return 2;
      default:
        return 0;
    }
  };

  // Function to get the selected user's page type
  const getSelectedUserPageType = () => {
    const selectedUser = selectedUsers.find(user => user.social_id === selectedChipId);
    return selectedUser ? selectedUser.page_type : null;
  };

  // Function to get available tabs based on selected users
  const getAvailableTabs = () => {
    if (selectedUsers.length === 0) return ['instagram', 'linkedin', 'facebook'];
    
    const uniquePageTypes = [...new Set(selectedUsers.map(user => user.page_type))];
    return uniquePageTypes;
  };

  // Function to check if current tab content should be shown
  const shouldShowTabContent = (tabIndex) => {
    const availableTabs = getAvailableTabs();
    const tabTypes = ['instagram', 'linkedin', 'facebook'];
    const currentTabType = tabTypes[tabIndex];
    
    return availableTabs.includes(currentTabType);
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    console.log('Selected value:', value);
    setSelectedOption(typeof value === 'string' ? value.split(',') : value);
    console.log('Selected inside:', selectedOption);

  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchAccountsFromAPI = async () => {

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Fetch the accounts from the dummy API
      const response = await fetch(
        "https://api.marketincer.com/api/v1/social_pages/connected_pages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Backticks used here
          },
        }
      );

      const data = await response.json();
      setPages(data.data.accounts); // Store the fetched accounts in the state


    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsFromAPI();
  }, []);

  // Update tab when selected chip changes or when first user is selected
  useEffect(() => {
    if (selectedUsers.length > 0) {
      // Auto-switch to the first selected user's page type tab
      const firstUserPageType = selectedUsers[0].page_type;
      const newTabIndex = getTabIndexByPageType(firstUserPageType);
      setTabValue(newTabIndex);
    }
  }, [selectedUsers]);

  // Additional effect for chip selection
  useEffect(() => {
    const selectedPageType = getSelectedUserPageType();
    if (selectedPageType) {
      const newTabIndex = getTabIndexByPageType(selectedPageType);
      setTabValue(newTabIndex);
    }
  }, [selectedChipId, selectedUsers]);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const draftModelOpen = async (action) => {
    if (!uploadedImageUrl || !postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setCreatePostMode(action);
    setOpenDateTimePicker(true);

  };

  const handleBoxClick = () => {
    fileInputRef.current.click(); //  Triggers the hidden file input
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadedFileName(droppedFile.name);
      console.log('imgggg', uploadedImageUrl)

      //  Auto-upload the file after drop
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
        setUploadedImageUrl(data.url); //  Store uploaded file URL

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
      console.log('11111', file)
      setUploadedFileName(selectedFile.name);
      //  Auto-upload the file after selection
      handleFileUpload(selectedFile);
    }
  };

  const handlePublish = async () => {
    if (!postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setPosting(true);
    const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      social_page_ids: selectedPages,  // Only sending the first selected page for now
      post: {
        s3_url: uploadedImageUrl,
        comments: stripHtmlTags(postContent),
        brand_name: brandName,
        status: "publish"
      },
    };
    console.log('papapa', payloadData)

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://api.marketincer.com/api/v1/posts", payloadData, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- use backticks here
        }
      });
      alert("Post published successfully!");
      // Optionally, clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setPosting(false);
      setUploadedFileName('');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post");
    }
  };

  const draftHandler = async () => {

    if ( !uploadedImageUrl || !postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setPosting(true);
    const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      social_page_ids: selectedPages,  // Only sending the first selected page for now
      post: {
        s3_url: uploadedImageUrl,
        comments: stripHtmlTags(postContent),  // Use the postContent for comments as well
        brand_name: brandName,
        status: createPostMode,
        scheduled_at: selectedDateTime
      },
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://api.marketincer.com/api/v1/posts/schedule", payloadData, {
        headers: {
          Authorization: `Bearer ${token}`, // <-- use backticks here
        }
      });
      alert(`Post ${createPostMode} successfully!`);
      // Optionally, clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setPosting(false);
      setOpenDateTimePicker(false);
      setUploadedFileName('');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error ${createPostMode} post:`, error);
      alert(`Failed to ${createPostMode} post`);
    }
  };


  const mutation = useMutation({
    mutationFn: (payloadData) => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage (or state)

      return axios.post(
        "https://api.marketincer.com/api/v1/posts",
        payloadData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // <-- use backticks here
          },
        }
      );
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
      });
      setOpen(false);
      setPostContent("");
    },
    onError: (error) => {
      toast.error("Failed to Create Post", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Post creation failed", error);
    },
  });


  const handleAvatarClick = (pageId) => {
    console.log("Page ID clicked:", pageId, selectedPages);
    setSelectedPages((selectedPages) =>
      selectedPages.includes(pageId)
        ? selectedPages.filter((id) => id !== pageId) // Deselect if already selected
        : [...selectedPages, pageId] // Select if not selected
    );

  };


  const handleUsersChange = (event) => {
    let selectedIds = event.target.value;
    // Normalize to array of numbers
    selectedIds = Array.isArray(selectedIds)
      ? selectedIds.map(Number)
      : [Number(selectedIds)];

    const selectedUserObjects = pages.filter((user) =>
      selectedIds.includes(user.id)
    );

    const socialId = selectedUserObjects.map(user => user.social_id);

    setSelectedUsers(selectedUserObjects);
    handleAvatarClick(socialId)

  };

  // LinkedIn Preview Component
  const LinkedinPreview = () => {
    const interactionButtons = [
      { icon: <FavoriteBorderIcon />  },
      { icon: <ChatBubbleOutlineIcon /> },
      // { icon: <Repeat />, text: "Repost" },
      { icon: <SendIcon /> },
    ];

    return (
        <Card
          sx={{ borderRadius: 2, padding: '10px' }}
        >
          <CardContent sx={{ p: 0 }}>
            
            {/* Post Image */}
            {uploadedImageUrl ? (
              <Avatar 
              src={uploadedImageUrl} 
              alt="LinkedIn post image" 
              sx={{ width: 300, height: 350, display: 'block', margin: 'auto',borderRadius:'inherit' }} />
            ) : (
              <Skeleton animation="wave" variant="circular" width={300} height={350} sx={{ display: 'block', margin: 'auto', borderRadius:'inherit' }} />
            )}

            {/* Image Indicators */}
            <Box
              display="flex"
              justifyContent="center"
              gap={1}
              mt={-3}
              mb={1.5}
            >
              <Box
                width="10px"
                height="10px"
                bgcolor="#882AFF"
                borderRadius="4px"
              />
              <Box
                width="10px"
                height="10px"
                bgcolor="#E7D3FF"
                borderRadius="4px"
              />
            </Box>

            {/* Post Actions */}

            {postContent && (
              <Box px={2.5} pb={1} mt={3}>
                <Typography variant="body2" color="#882AFF" sx={{textAlign:'justify'}}>
                  <span dangerouslySetInnerHTML={{ __html: postContent }} />
                </Typography>
              </Box>
            )}

            <CardActions
              
            >
              {interactionButtons.map((button, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                >
                  <Box sx={{ "& svg": { width: 20, height: 20 } }}>
                    {button.icon}
                  </Box>
                  <Typography fontWeight="medium">{button.text}</Typography>
                </Stack>
              ))}
            </CardActions>
          </CardContent>
        </Card>
      
    );
  };

  // Render preview content based on tab and availability
  const renderPreviewContent = (tabIndex) => {
    if (!shouldShowTabContent(tabIndex)) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="200px"
          // sx={{ 
          //   backgroundColor: '#f5f5f5', 
          //   borderRadius: 2,
          //   border: '1px dashed #ccc' 
          // }}
        >
          <Typography variant="h6" color="text.secondary">
            There is no preview available
          </Typography>
        </Box>
      );
    }

    // LinkedIn Preview
    if (tabIndex === 1) {
      return <LinkedinPreview />;
    }

    // Instagram and Facebook Preview (existing logic)
    return (
      <Card sx={{ borderRadius: 2, padding: '10px' }}>
        {!uploadedImageUrl || !postContent ? (
          <Skeleton animation="wave" variant="circular" width={300} height={350} sx={{ display: 'block', margin: 'auto', borderRadius:'inherit' }} />
        ) : (
          <Avatar src={uploadedImageUrl} alt="Uploaded" sx={{ width: 300, height: 350, display: 'block', margin: 'auto',borderRadius:'inherit' }} />
        )}
        <CardContent sx={{ p: 0 }}>
          {uploadedImageUrl && postContent && (
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex" }}>
              <span dangerouslySetInnerHTML={{ __html: postContent }} />
            </Typography>
          )}

          {/* Platform-specific interaction buttons */}
          <Box display="flex" alignItems="center" mt={2} gap={3}>
            {tabIndex === 0 && ( // Instagram
              <>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <FavoriteBorderIcon fontSize="small" />
                  {/* <Typography variant="body2">37.8K</Typography> */}
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                  {/* <Typography variant="body2">248</Typography> */}
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <SendIcon fontSize="small" />
                  {/* <Typography variant="body2">234</Typography> */}
                </Box>
              </>
            )}
            {tabIndex === 2 && ( // Facebook
              <>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <FavoriteBorderIcon fontSize="small" />
                  {/* <Typography variant="body2">Like</Typography> */}
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                  {/* <Typography variant="body2">Comment</Typography> */}
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <SendIcon fontSize="small" />
                  {/* <Typography variant="body2">Share</Typography> */}
                </Box>
              </>
            )}
          </Box>
          {/* Metadata */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="body2" color="text.secondary">
              {selectUser?.name || 'Select a user'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Just Now
            </Typography>
          </Box>

          
        </CardContent>
      </Card>
    );
  };
  

  const getPlatformIcon = (postType) => {
    
    switch (postType?.toLowerCase()) {
      case 'instagram':
        return <img src={InstaIcon} alt="instagram" width='25' height='25'  />
      case 'facebook':
        return <img src={FacebookIcon} alt="facebook" width='25' height='25'  />
      case 'linkedin':
        return <img src={LinkedInIcon} alt="linkedin" width='25' height='25'  />
      default:
        return null;
    }
  };


  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100vh' }} > 
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
                  Create Post
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
      {/* Main Content - 50/50 Vertical Split */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'calc(100vh - 120px)', 
        padding: '16px',
        gap: 2
      }}>
        {/* Top Half - User Input Section */}
        <Box sx={{ 
          flex: '1 1 50%', 
          minHeight: 0,
          overflow: 'auto'
        }}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 3, 
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                Create Post
              </Typography>
              {/* Dropdowns - Compact Layout */}
              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                <FormControl sx={{ minWidth: 150, flex: 1 }}>
                  <InputLabel id="demo-simple-select-label">Brand</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Brand"
                    size="small"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    sx={{ height:'36px', color:'#882AFF'}}
                  >
                    {Brands.map((brand) => (
                      <MenuItem key={brand} value={brand} sx={{color:'#882AFF'}} >{brand}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200, flex: 2 }}>
                  <InputLabel id="multi-user-label">Social Media</InputLabel>
                  <Select
                    labelId="multi-user-label"
                    multiple
                    size="small"
                    value={selectedUsers.map((user) => user.id)}
                    onChange={handleUsersChange}
                    input={<OutlinedInput label="Select Users" />}
                    sx={{ height:'36px', color:'#882AFF'}}
                    renderValue={(selected) => 
                      selectedUsers.map(user => user.name).join(', ')
                    }
                  >
                    {pages.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                          <Avatar src={user.picture_url} alt={user.name} sx={{ width: '20px', height: '20px' }} />
                          {getPlatformIcon(user.page_type)}
                        </ListItemIcon>
                        
                        <ListItemText primary={user.name} sx={{color:'#882AFF'}} />
                        <Checkbox className="custom-checkbox"
                        sx={{bgcolor:'#cbaef7', width:'10px', height:'10px', color:'#cbaef7'}}
                          checked={selectedUsers.some((selected) => selected.id === user.id)}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* User Chips */}
              {selectedUsers.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  {selectedUsers.map((user) => (
                    <Chip
                      className="custom-chip"
                      key={user.id}
                      size="small"
                      avatar={<Avatar src={user.picture_url} sx={{ width: '20px', height: '20px' }} />}
                      label={user.name}
                      onClick={() => {
                        setSelectUser(user);
                      }}
                      onDelete={() => { 
                        setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
                        if (selectedChipId === user.social_id) {
                          setSelectedChipId(null);
                          setSelectUser('');
                        }
                      }} 
                      sx={{
                        height: '24px',
                        border: selectedChipId === user.social_id ? '2px solid #5ebfa6' : 'none',
                        backgroundColor: selectedChipId === user.social_id ? '#ddd' : 'default',
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Post Content Editor */}
              <Box sx={{ mb: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: '#333' }}>
                  Post Content
                </Typography>
                <Box sx={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2, 
                  bgcolor: '#f8f9fa',
                  flex: 1,
                  minHeight: '120px'
                }}>
                  <Editor value={postContent} onChange={setPostContent} />
                </Box>
                <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#666' }}>
                  275 characters left
                </Typography>
              </Box>

              {/* Upload Media & Actions Row */}
              <Box display="flex" gap={2} alignItems="center" justifyContent="space-between" mt="auto">
                {/* Upload Media Section */}
                <Box display="flex" alignItems="center" gap={2}>
                  {uploadedImageUrl && (
                    <Box position="relative">
                      <Avatar
                        variant="rounded"
                        src={uploadedImageUrl}
                        sx={{ width: 60, height: 60, borderRadius: 1 }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -4,
                          right: -4,
                          bgcolor: 'white',
                          boxShadow: 1,
                          width: 20,
                          height: 20,
                          '&:hover': {
                            bgcolor: '#f5f5f5'
                          }
                        }}
                        onClick={() => {
                          setUploadedImageUrl("");
                          setUploadedFileName("");
                          setFile(null);
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ImageIcon />}
                    onClick={handleBoxClick}
                    sx={{
                      textTransform: 'none',
                      borderColor: '#882AFF',
                      color: '#882AFF',
                      '&:hover': {
                        borderColor: '#7c1fa2',
                        bgcolor: '#f5f0ff'
                      }
                    }}
                  >
                    {uploadedImageUrl ? 'Change Media' : 'Add Media'}
                  </Button>
                  
                  {uploading && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={16} />
                      <Typography variant="caption">Uploading...</Typography>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box display="flex" gap={1}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      borderColor: '#882AFF',
                      color: '#882AFF',
                      '&:hover': {
                        borderColor: '#7c1fa2',
                        bgcolor: '#f5f0ff'
                      }
                    }}
                  >
                    Draft
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderColor: '#882AFF',
                      color: '#882AFF',
                      '&:hover': {
                        borderColor: '#7c1fa2',
                        bgcolor: '#f5f0ff'
                      }
                    }}
                    onClick={() => draftModelOpen("schedule")}
                  >
                    Schedule
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handlePublish}
                    disabled={posting || uploading}
                    sx={{ 
                      bgcolor: '#882AFF',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#7c1fa2'
                      },
                      '&:disabled': {
                        bgcolor: '#9575cd',
                        color: '#fff'
                      }
                    }}
                  >
                    {posting ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16} sx={{ color: '#fff' }} />
                        Publishing...
                      </Box>
                    ) : (
                      'Publish'
                    )}
                  </Button>
                </Box>
              </Box>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Bottom Half - Live Preview Section */}
        <Box sx={{ 
          flex: '1 1 50%', 
          minHeight: 0,
          overflow: 'auto'
        }}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 3, 
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                Live Preview
              </Typography>
              
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="platform preview tabs"
                sx={{
                  mb: 2,
                  minHeight: '36px',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: '36px',
                    fontSize: '0.875rem',
                    '&.Mui-selected': {
                      color: '#882AFF'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#882AFF'
                  }
                }}
              >
                <Tab label="Instagram" />
                <Tab label="LinkedIn" />
                <Tab label="Facebook" />
              </Tabs>

              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <TabPanel value={tabValue} index={0}>
                  {renderPreviewContent(0)}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  {renderPreviewContent(1)}
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  {renderPreviewContent(2)}
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
          
      </Box>
    </Layout>
  );
};

export default CreatePost;