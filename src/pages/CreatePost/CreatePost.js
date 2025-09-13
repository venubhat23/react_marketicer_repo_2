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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
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
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Sidebar from '../../components/Sidebar';
import MarketincerIcon from '../../assets/images/marketincerlogo.png';
import { Link } from "react-router-dom";

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
  const [generatingContent, setGeneratingContent] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [publishingResults, setPublishingResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showPublishingLoader, setShowPublishingLoader] = useState(false);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [publishingStep, setPublishingStep] = useState('');

  console.log('hereree', selectUser)

  // Function to process mentions in content
  const processMentions = (content) => {
    if (!content) return content;
    
    // Replace @mentions with styled spans
    return content.replace(/@(\w+(?:\s+\w+)*)/g, (match, name) => {
      return `<span style="color: #0a66c2; font-weight: 600;">${match}</span>`;
    });
  };

  // Mention handling functions
  const handleMention = (user) => {
    const beforeMention = postContent.slice(0, mentionPosition - mentionQuery.length - 1);
    const afterMention = postContent.slice(mentionPosition);
    const mentionText = `@${user.name}`;
    const newContent = beforeMention + mentionText + afterMention;
    setPostContent(newContent);
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleContentChange = (content) => {
    setPostContent(content);
    
    // Check for @ mention trigger
    const lastAtIndex = content.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = content.slice(lastAtIndex + 1);
      const spaceIndex = textAfterAt.indexOf(' ');
      const currentQuery = spaceIndex === -1 ? textAfterAt : textAfterAt.slice(0, spaceIndex);
      
      if (spaceIndex === -1 && currentQuery.length <= 20) {
        setMentionQuery(currentQuery);
        setMentionPosition(lastAtIndex + 1 + currentQuery.length);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  // Filter users for mentions based on query
  const getMentionSuggestions = () => {
    if (!mentionQuery) return selectedUsers.slice(0, 5);
    return selectedUsers.filter(user => 
      user.name.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);
  };

  // Generate with AI function
  const handleGenerateWithAI = async () => {
    setGeneratingContent(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.marketincer.com/api/v1/generate-content", // Replace with your actual endpoint
        {
          description: "generate note on social media"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      // Insert the generated content into the editor
      const generatedContent = response.data.content || response.data.message || response.data;
      setPostContent(generatedContent);
      
      toast.success("Content generated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error generating content:", error);
      
      // For demo purposes, use the sample response you provided
      const sampleResponse = `Here's a well-structured note on social media:
---
### Note on Social Media
Definition:
Social media refers to digital platforms and applications that enable users to create, share, and interact with content, ideas, and information in virtual communities and networks.
---
Popular Platforms:
* Facebook: For social networking and community building.
* Instagram: For photo and video sharing.
* Twitter (X): For microblogging and real-time updates.
* LinkedIn: For professional networking.
* YouTube: For video sharing and streaming.
* WhatsApp & Telegram: For messaging and group communication.
---
Importance of Social Media:
1. Communication: Provides instant and global connectivity.
2. Information Sharing: Acts as a major source of news and knowledge.
3. Marketing & Branding: Businesses use social media for advertising and customer engagement.
4. Education & Awareness: Helps spread awareness about social, political, and environmental issues.
5. Entertainment: Offers a wide variety of content such as memes, videos, music, and more.
---
Positive Impacts:
* Strengthens relationships and communities.
* Promotes small businesses and entrepreneurship.
* Provides a platform for self-expression and creativity.
* Encourages social and cultural exchange.
---
Negative Impacts:
* Cyberbullying and online harassment.
* Spread of misinformation and fake news.
* Addiction leading to reduced productivity.
* Privacy concerns and data breaches.
---
Conclusion:
Social media is a powerful tool that can connect, educate, and entertain. However, responsible usage is essential to avoid its negative effects and ensure a safe online environment.
---
Would you like me to create this as a short handwritten-style note (suitable for study/revision) or as a detailed infographic-style note?`;
      
      setPostContent(sampleResponse);
      
      toast.info("Using sample content for demo", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setGeneratingContent(false);
    }
  };

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
        "https://crisp-jay-humorous.ngrok-free.app/api/upload",
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

    // Show enhanced loader and start progress
    setShowPublishingLoader(true);
    setPublishingProgress(0);
    setPublishingStep('Validating your content...');
    setPosting(true);

    // Simulate progress steps
    const updateProgress = (progress, step) => {
      setPublishingProgress(progress);
      setPublishingStep(step);
    };

    try {
      // Step 1: Preparing content
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProgress(20, 'Preparing your content...');

      const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
      const payloadData = {
        social_page_ids: selectedPages,
        post: {
          s3_url: uploadedImageUrl,
          comments: stripHtmlTags(postContent),
          brand_name: brandName,
          status: "publish"
        },
      };

      // Step 2: Uploading to platforms
      updateProgress(40, 'Connecting to social platforms...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 3: Publishing
      updateProgress(60, 'Publishing your post...');
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:3002/api/v1/posts", payloadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Step 4: Processing response
      updateProgress(80, 'Processing results...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 5: Complete
      updateProgress(100, 'Publishing complete!');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Handle the response data and show results modal
      const responseData = response.data;
      setPublishingResults(responseData);
      setShowResultsModal(true);

      // Hide loader and reset states
      setShowPublishingLoader(false);
      setPosting(false);
      setPublishingProgress(0);
      setPublishingStep('');

    } catch (error) {
      console.error("Error publishing post:", error);

      // Hide loader and reset states on error
      setShowPublishingLoader(false);
      setPosting(false);
      setPublishingProgress(0);
      setPublishingStep('');

      // Check if the error response contains specific error information
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        // Set the error response for display in modal
        setPublishingResults(responseData);
        setShowResultsModal(true);

        // Legacy alert handling (can be removed if modal is preferred)
        // Handle the Instagram business account error specifically
        if (responseData.errors && responseData.errors.length > 0) {
          const firstError = responseData.errors[0];
          if (firstError.error_message) {
            return;
          } else if (firstError.error) {
            return;
          }
        }

        // Fallback to general message if available
        if (responseData.message) {
          return;
        }
      } else {
        // Handle network errors or other issues
        setPublishingResults({
          status: "error",
          message: "Failed to publish post. Please check your connection and try again.",
          errors: []
        });
        setShowResultsModal(true);
      }
    }
  };

  const draftHandler = async () => {
    if (!uploadedImageUrl || !postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }

    // Show enhanced loader and start progress
    setShowPublishingLoader(true);
    setPublishingProgress(0);
    setPublishingStep(`Preparing to ${createPostMode} your post...`);
    setPosting(true);

    // Simulate progress steps
    const updateProgress = (progress, step) => {
      setPublishingProgress(progress);
      setPublishingStep(step);
    };

    try {
      // Step 1: Preparing content
      await new Promise(resolve => setTimeout(resolve, 400));
      updateProgress(25, 'Validating your content...');

      const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
      const payloadData = {
        social_page_ids: selectedPages,
        post: {
          s3_url: uploadedImageUrl,
          comments: stripHtmlTags(postContent),
          brand_name: brandName,
          status: createPostMode,
          scheduled_at: selectedDateTime
        },
      };

      // Step 2: Processing schedule
      updateProgress(50, createPostMode === 'schedule' ? 'Setting up schedule...' : 'Saving draft...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 3: Uploading
      updateProgress(75, `${createPostMode === 'schedule' ? 'Scheduling' : 'Saving'} your post...`);

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3002/api/v1/posts/schedule", payloadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Step 4: Complete
      updateProgress(100, `Post ${createPostMode} successfully!`);
      await new Promise(resolve => setTimeout(resolve, 500));

      alert(`Post ${createPostMode} successfully!`);

      // Clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setOpenDateTimePicker(false);
      setUploadedFileName('');
      setOpen(false);

      // Hide loader and reset states
      setShowPublishingLoader(false);
      setPosting(false);
      setPublishingProgress(0);
      setPublishingStep('');

      window.location.reload();
    } catch (error) {
      console.error(`Error ${createPostMode} post:`, error);

      // Hide loader and reset states on error
      setShowPublishingLoader(false);
      setPosting(false);
      setPublishingProgress(0);
      setPublishingStep('');

      // Check if the error response contains specific error information
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        // Handle the Instagram business account error specifically
        if (responseData.errors && responseData.errors.length > 0) {
          const firstError = responseData.errors[0];
          if (firstError.error_message) {
            alert(firstError.error_message);
            return;
          } else if (firstError.error) {
            alert(firstError.error);
            return;
          }
        }

        // Fallback to general message if available
        if (responseData.message) {
          alert(responseData.message);
          return;
        }
      }

      // Default fallback message
      alert(`Failed to ${createPostMode} post`);
    }
  };


  const mutation = useMutation({
    mutationFn: (payloadData) => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage (or state)

      return axios.post(
        "http://localhost:3002/api/v1/posts",
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
      let errorMessage = "Failed to Create Post";

      // Check if the error response contains specific error information
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        // Handle the Instagram business account error specifically
        if (responseData.errors && responseData.errors.length > 0) {
          const firstError = responseData.errors[0];
          if (firstError.error_message) {
            errorMessage = firstError.error_message;
          } else if (firstError.error) {
            errorMessage = firstError.error;
          }
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      }

      toast.error(errorMessage, {
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

  // Handle closing the results modal and clearing form if successful
  const handleCloseResultsModal = () => {
    setShowResultsModal(false);

    // If the posting was successful (either full success or partial success), clear the form
    if (publishingResults && (publishingResults.status === "success" || publishingResults.status === "partial_success")) {
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setUploadedFileName('');
      setBrandName("");
      setSelectedUsers([]);
      setSelectUser('');
      setFile(null);
    }

    setPublishingResults(null);
  };

  // Publishing Results Modal Component
  const PublishingResultsModal = () => {
    if (!publishingResults) return null;

    const isSuccess = publishingResults.status === "success";
    const isPartialSuccess = publishingResults.status === "partial_success";
    const hasSuccessfulPosts = publishingResults.posts && publishingResults.posts.length > 0;
    const hasErrors = publishingResults.errors && publishingResults.errors.length > 0;

    return (
      <Modal
        open={showResultsModal}
        onClose={handleCloseResultsModal}
        aria-labelledby="publishing-results-title"
        aria-describedby="publishing-results-description"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            maxHeight: '80vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            border: 'none',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Modal Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography id="publishing-results-title" variant="h6" component="h2">
              Publishing Results
            </Typography>
            <IconButton onClick={handleCloseResultsModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Success Section */}
          {hasSuccessfulPosts && (
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                  Successfully Published ({publishingResults.posts.length})
                </Typography>
              </Box>

              {publishingResults.posts.map((post, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid #4caf50', borderLeft: '4px solid #4caf50' }}>
                  <CardContent>
                    <Box display="flex" align="center" mb={1}>
                      <CheckCircleIcon sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Post Published Successfully
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status: <span style={{ color: '#4caf50', fontWeight: 600 }}>{post.post.status}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Created: {new Date(post.post.created_at).toLocaleString()}
                    </Typography>
                    {post.post.brand_name && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Brand: {post.post.brand_name}
                      </Typography>
                    )}
                    {post.publish_log && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
                          {post.publish_log}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Errors Section */}
          {hasErrors && (
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <ErrorIcon sx={{ color: '#f44336', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                  Failed to Publish ({publishingResults.errors.length})
                </Typography>
              </Box>

              {publishingResults.errors.map((error, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid #f44336', borderLeft: '4px solid #f44336' }}>
                  <CardContent>
                    <Box display="flex" align="center" mb={1}>
                      <ErrorIcon sx={{ color: '#f44336', mr: 1, fontSize: 20 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#f44336' }}>
                        Publishing Failed
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Social Page ID: {error.social_page_id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: '#f44336' }}>
                      Error: {error.error || error.error_message || 'Unknown error'}
                    </Typography>
                    {error.post && (
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Status: <span style={{ color: '#f44336', fontWeight: 600 }}>{error.post.status}</span>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Created: {new Date(error.post.created_at).toLocaleString()}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Overall Status Message */}
          <Box sx={{ mt: 3, p: 2, bgcolor: isSuccess ? '#e8f5e8' : isPartialSuccess ? '#fff3e0' : '#ffebee', borderRadius: 1 }}>
            <Typography variant="body2" sx={{
              color: isSuccess ? '#2e7d32' : isPartialSuccess ? '#f57c00' : '#c62828',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              {isSuccess && "All posts were published successfully!"}
              {isPartialSuccess && "Some posts were published successfully, others failed."}
              {!isSuccess && !isPartialSuccess && "Publishing failed. Please try again."}
            </Typography>
          </Box>

          {/* Action Button */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              onClick={handleCloseResultsModal}
              sx={{
                bgcolor: isSuccess ? '#4caf50' : isPartialSuccess ? '#ff9800' : '#f44336',
                '&:hover': {
                  bgcolor: isSuccess ? '#45a049' : isPartialSuccess ? '#e68900' : '#d32f2f'
                }
              }}
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Modal>
    );
  };

  // Enhanced Publishing Loader Component
  const PublishingLoader = () => {
    return (
      <Modal
        open={showPublishingLoader}
        aria-labelledby="publishing-loader-title"
        aria-describedby="publishing-loader-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <Paper
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            p: 4,
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Animated Background Gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(136, 42, 255, 0.03), rgba(94, 191, 166, 0.03))',
              animation: 'gradient-shift 3s ease-in-out infinite',
              '@keyframes gradient-shift': {
                '0%, 100%': {
                  background: 'linear-gradient(45deg, rgba(136, 42, 255, 0.03), rgba(94, 191, 166, 0.03))'
                },
                '50%': {
                  background: 'linear-gradient(45deg, rgba(94, 191, 166, 0.03), rgba(136, 42, 255, 0.03))'
                }
              }
            }}
          />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Animated Logo/Icon */}
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #882AFF, #5ebfa6)',
                mb: 3,
                animation: 'pulse-glow 2s ease-in-out infinite',
                '@keyframes pulse-glow': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(136, 42, 255, 0.7)'
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 0 15px rgba(136, 42, 255, 0)'
                  }
                }
              }}
            >
              <Box
                sx={{
                  animation: 'spin 2s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              >
                <img
                  src={MarketincerIcon}
                  alt="Marketincer"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    padding: '2px'
                  }}
                />
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#2c2c2c',
                fontSize: '1.25rem'
              }}
            >
              Publishing Your Post
            </Typography>

            {/* Current Step */}
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: '#666',
                minHeight: 24,
                fontSize: '0.95rem'
              }}
            >
              {publishingStep || 'Preparing your content...'}
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ width: '100%', mb: 3 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 6,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    width: `${publishingProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #882AFF, #5ebfa6)',
                    borderRadius: 3,
                    transition: 'width 0.5s ease-in-out',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 1.5s infinite',
                      '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' }
                      }
                    }
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: '#888',
                  fontSize: '0.8rem'
                }}
              >
                {Math.round(publishingProgress)}% Complete
              </Typography>
            </Box>

            {/* Floating Dots Animation */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 0.5,
                '& > div': {
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#882AFF',
                  animation: 'bounce 1.4s infinite ease-in-out both'
                },
                '& > div:nth-of-type(1)': {
                  animationDelay: '-0.32s'
                },
                '& > div:nth-of-type(2)': {
                  animationDelay: '-0.16s'
                },
                '@keyframes bounce': {
                  '0%, 80%, 100%': {
                    transform: 'scale(0)',
                    opacity: 0.5
                  },
                  '40%': {
                    transform: 'scale(1)',
                    opacity: 1
                  }
                }
              }}
            >
              <div></div>
              <div></div>
              <div></div>
            </Box>
          </Box>
        </Paper>
      </Modal>
    );
  };

  // LinkedIn Preview Component
  const LinkedinPreview = () => {
    const linkedinInteractionButtons = [
      { icon: <ThumbUp />, text: "Like", color: "#0a66c2" },
      { icon: <ChatBubbleOutlineIcon />, text: "Comment", color: "#666" },
      { icon: <Repeat />, text: "Repost", color: "#666" },
      { icon: <SendIcon />, text: "Send", color: "#666" },
    ];

    return (
      <Card sx={{ 
        borderRadius: 2, 
        padding: '16px', 
        backgroundColor: '#fff',
        border: '1px solid #e0e0e0',
        maxWidth: 350,
        margin: '0 auto'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* LinkedIn Post Header */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              src={selectUser?.picture_url || "https://via.placeholder.com/40"} 
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography variant="body1" fontWeight="600" color="#000">
                {selectUser?.name || 'User Name'}
              </Typography>
              <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                Professional Title • 1st
              </Typography>
              <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                2h • 🌍
              </Typography>
            </Box>
          </Box>

          {/* Post Content */}
          {postContent && (
            <Box mb={2}>
              <Typography variant="body2" color="#000" sx={{ lineHeight: 1.5 }}>
                <span dangerouslySetInnerHTML={{ __html: processMentions(postContent) }} />
              </Typography>
            </Box>
          )}

          {/* Post Image or PDF Document */}
          {uploadedImageUrl ? (
            isPdfMode ? (
              /* PDF Document Preview */
              <Box sx={{ mb: 2 }}>
                {/* PDF Document Header */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px 4px 0 0', 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 50,
                      backgroundColor: '#d73527',
                      borderRadius: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '10px'
                    }}
                  >
                    PDF
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="600" color="#000">
                      {documentName || 'Untitled Document'}
                    </Typography>
                    <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                      PDF Document • Click to view
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: '#666' }}>
                    <MoreVert />
                  </IconButton>
                </Box>
                
                {/* PDF Document Content Preview */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    border: '1px solid #e0e0e0',
                    borderTop: 'none',
                    borderRadius: '0 0 4px 4px',
                    overflow: 'hidden',
                    backgroundColor: '#fff'
                  }}
                >
                  <img 
                    src={uploadedImageUrl} 
                    alt="PDF document preview" 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      display: 'block',
                      backgroundColor: '#f5f5f5'
                    }} 
                  />
                </Box>
              </Box>
            ) : (
              /* Regular Image Preview */
              <Box 
                sx={{ 
                  width: '100%', 
                  borderRadius: 1, 
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                <img 
                  src={uploadedImageUrl} 
                  alt="LinkedIn post" 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxHeight: '300px',
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
              </Box>
            )
          ) : (
            <Skeleton 
              animation="wave" 
              variant="rectangular" 
              width="100%" 
              height={200} 
              sx={{ borderRadius: 1, mb: 2 }} 
            />
          )}

          {/* Engagement Stats */}
          <Box display="flex" justifyContent="space-between" alignItems="center" py={1} mb={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <Box display="flex" alignItems="center">
              <Box sx={{ width: 16, height: 16, backgroundColor: '#0a66c2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 0.5 }}>
                <ThumbUp sx={{ fontSize: 10, color: '#fff' }} />
              </Box>
              <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                24
              </Typography>
            </Box>
            <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
              3 comments
            </Typography>
          </Box>

          {/* LinkedIn Actions */}
          <Box display="flex" justifyContent="space-around" pt={1}>
            {linkedinInteractionButtons.map((button, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ 
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#f3f3f3' },
                  flex: 1
                }}
              >
                <Box sx={{ "& svg": { width: 20, height: 20, color: button.color } }}>
                  {button.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  fontWeight="600" 
                  color={button.color}
                  sx={{ fontSize: '12px', mt: 0.5 }}
                >
                  {button.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Instagram Preview Component
  const InstagramPreview = () => {
    return (
      <Card sx={{ 
        borderRadius: 2, 
        backgroundColor: '#fff',
        border: '1px solid #dbdbdb',
        maxWidth: 350,
        margin: '0 auto'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Instagram Post Header */}
          <Box display="flex" alignItems="center" p={2} pb={1}>
            <Avatar 
              src={selectUser?.picture_url || "https://via.placeholder.com/40"} 
              sx={{ width: 32, height: 32, mr: 1.5 }}
            />
            <Box>
              <Typography variant="body2" fontWeight="600" color="#000">
                {selectUser?.name?.toLowerCase().replace(/\s+/g, '_') || 'username'}
              </Typography>
              <Typography variant="body2" color="#8e8e8e" sx={{ fontSize: '12px' }}>
                Location
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <MoreVert sx={{ fontSize: 20, color: '#8e8e8e' }} />
            </Box>
          </Box>

          {/* Post Image */}
          {uploadedImageUrl ? (
            <Box sx={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
              <img 
                src={uploadedImageUrl} 
                alt="Instagram post" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </Box>
          ) : (
            <Skeleton 
              animation="wave" 
              variant="rectangular" 
              width="100%" 
              height={350} 
            />
          )}

          {/* Instagram Actions */}
          <Box p={2} pb={1}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Box display="flex" gap={2}>
                <FavoriteBorderIcon sx={{ fontSize: 24, color: '#262626', cursor: 'pointer' }} />
                <ChatBubbleOutlineIcon sx={{ fontSize: 24, color: '#262626', cursor: 'pointer' }} />
                <SendIcon sx={{ fontSize: 24, color: '#262626', cursor: 'pointer' }} />
              </Box>
              <BookmarkBorderIcon sx={{ fontSize: 24, color: '#262626', cursor: 'pointer' }} />
            </Box>
            
            <Typography variant="body2" fontWeight="600" color="#000" mb={0.5}>
              127 likes
            </Typography>
            
            {/* Post Caption */}
            {postContent && (
              <Typography variant="body2" color="#000" sx={{ lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600, marginRight: '4px' }}>
                  {selectUser?.name?.toLowerCase().replace(/\s+/g, '_') || 'username'}
                </span>
                <span dangerouslySetInnerHTML={{ __html: processMentions(postContent) }} />
              </Typography>
            )}
            
            <Typography variant="body2" color="#8e8e8e" sx={{ fontSize: '12px', mt: 1 }}>
              View all 15 comments
            </Typography>
            <Typography variant="body2" color="#8e8e8e" sx={{ fontSize: '10px', mt: 0.5 }}>
              2 HOURS AGO
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Facebook Preview Component  
  const FacebookPreview = () => {
    return (
      <Card sx={{ 
        borderRadius: 2, 
        backgroundColor: '#fff',
        border: '1px solid #dddfe2',
        maxWidth: 350,
        margin: '0 auto'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Facebook Post Header */}
          <Box display="flex" alignItems="center" p={2} pb={1}>
            <Avatar 
              src={selectUser?.picture_url || "https://via.placeholder.com/40"} 
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" fontWeight="600" color="#1c1e21">
                {selectUser?.name || 'User Name'}
              </Typography>
              <Typography variant="body2" color="#65676b" sx={{ fontSize: '13px' }}>
                2h • 🌍
              </Typography>
            </Box>
            <Box>
              <MoreVert sx={{ fontSize: 20, color: '#65676b' }} />
            </Box>
          </Box>

          {/* Post Content */}
          {postContent && (
            <Box px={2} pb={1}>
              <Typography variant="body1" color="#1c1e21" sx={{ lineHeight: 1.5 }}>
                <span dangerouslySetInnerHTML={{ __html: processMentions(postContent) }} />
              </Typography>
            </Box>
          )}

          {/* Post Image */}
          {uploadedImageUrl ? (
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <img 
                src={uploadedImageUrl} 
                alt="Facebook post" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </Box>
          ) : (
            <Skeleton 
              animation="wave" 
              variant="rectangular" 
              width="100%" 
              height={250} 
            />
          )}

          {/* Engagement Stats */}
          <Box px={2} py={1} sx={{ borderBottom: '1px solid #ced0d4' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <Box display="flex" mr={1}>
                  <Box sx={{ width: 18, height: 18, backgroundColor: '#1877f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: -0.5, zIndex: 2 }}>
                    <ThumbUp sx={{ fontSize: 10, color: '#fff' }} />
                  </Box>
                  <Box sx={{ width: 18, height: 18, backgroundColor: '#f33e58', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FavoriteBorderIcon sx={{ fontSize: 10, color: '#fff' }} />
                  </Box>
                </Box>
                <Typography variant="body2" color="#65676b" sx={{ fontSize: '13px' }}>
                  You and 42 others
                </Typography>
              </Box>
              <Typography variant="body2" color="#65676b" sx={{ fontSize: '13px' }}>
                8 comments • 2 shares
              </Typography>
            </Box>
          </Box>

          {/* Facebook Actions */}
          <Box display="flex" justifyContent="space-around" py={1}>
            {[
              { icon: <ThumbUp />, text: "Like", color: "#65676b" },
              { icon: <ChatBubbleOutlineIcon />, text: "Comment", color: "#65676b" },
              { icon: <SendIcon />, text: "Share", color: "#65676b" }
            ].map((button, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ 
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: '#f2f3f5' },
                  flex: 1
                }}
              >
                <Box sx={{ "& svg": { width: 18, height: 18, color: button.color, mr: 0.5 } }}>
                  {button.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  fontWeight="600" 
                  color={button.color}
                  sx={{ fontSize: '13px' }}
                >
                  {button.text}
                </Typography>
              </Box>
            ))}
          </Box>
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

    // Instagram Preview
    if (tabIndex === 0) {
      return <InstagramPreview />;
    }

    // LinkedIn Preview
    if (tabIndex === 1) {
      return <LinkedinPreview />;
    }

    // Facebook Preview
    if (tabIndex === 2) {
      return <FacebookPreview />;
    }

    // Fallback preview
    return (
      <Card sx={{ borderRadius: 2, padding: '10px' }}>
        <Skeleton animation="wave" variant="rectangular" width={300} height={350} sx={{ display: 'block', margin: 'auto', borderRadius:'inherit' }} />
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
    <>
      <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100vh' }} > 
      <Grid container>
      <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid>
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
                  Create Post
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <NotificationsIcon />
                  </IconButton>
                  
                  <Link to="/SettingPage"> 
                    <IconButton size="large" sx={{ color: '#fff' }}>
                      <AccountCircleIcon /> 
                    </IconButton>
                  </Link>

                  
                </Box>
              </Box>
        </Paper>
        <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, height: '100vh', overflow: 'hidden !important', padding:'20px'}}>
        <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden !important' }}>
          <Grid size={{ xs: 12, sm: 8, md: 6 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)' ,height:'100%' }}>
              {/* Dropdowns */}
              <Box display="flex" gap={2} mb={2} >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" sx={{ fontSize: '14px', color: '#666' }}>Brand</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Brand"
                    size="small"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    sx={{ 
                      height:'40px',
                      mt:'6px', 
                      bgcolor: '#fff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                        borderWidth: '1px'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#882AFF',
                        borderWidth: '1px'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#882AFF',
                        borderWidth: '2px',
                        boxShadow: `0 0 0 3px rgba(136, 42, 255, 0.08)`
                      },
                      '& .MuiSelect-select': {
                        padding: '8px 12px',
                        color: '#333',
                        fontSize: '14px',
                        '&:focus': {
                          backgroundColor: 'transparent'
                        }
                      },
                      '& .MuiSelect-icon': {
                        color: '#666'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e0e0',
                          mt: 1,
                          '& .MuiMenuItem-root': {
                            fontSize: '14px',
                            color: '#333',
                            padding: '10px 16px',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(136, 42, 255, 0.08)',
                              color: '#882AFF',
                              '&:hover': {
                                backgroundColor: 'rgba(136, 42, 255, 0.12)'
                              }
                            }
                          }
                        }
                      }
                    }}
                  >
                    {Brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="multi-user-label" sx={{ fontSize: '14px', color: '#666' }}>Social Media</InputLabel>
                  <Select
                    labelId="multi-user-label"
                    multiple
                    size="small"
                    value={selectedUsers.map((user) => user.id)}
                    onChange={handleUsersChange}
                    input={<OutlinedInput label="Select Users" />}
                    sx={{ 
                      height:'40px',
                      mt:'6px', 
                      bgcolor: '#fff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                        borderWidth: '1px'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#882AFF',
                        borderWidth: '1px'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#882AFF',
                        borderWidth: '2px',
                        boxShadow: `0 0 0 3px rgba(136, 42, 255, 0.08)`
                      },
                      '& .MuiSelect-select': {
                        padding: '8px 12px',
                        color: '#333',
                        fontSize: '14px',
                        '&:focus': {
                          backgroundColor: 'transparent'
                        }
                      },
                      '& .MuiSelect-icon': {
                        color: '#666'
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e0e0',
                          mt: 1,
                          maxHeight: '200px',
                          '& .MuiMenuItem-root': {
                            fontSize: '14px',
                            color: '#333',
                            padding: '10px 16px',
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(136, 42, 255, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(136, 42, 255, 0.12)'
                              }
                            }
                          }
                        }
                      }
                    }}
                    renderValue={(selected) => 
                      selectedUsers.map(user => user.name).join(', ')
                    }
                  >
                    {pages.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        <ListItemIcon sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                          {/* {(user.name)} */}
                          <Avatar src={user.picture_url} alt={user.name} sx={{ width: '22px', height: '22px' }} />
                          {getPlatformIcon(user.page_type)}
                        </ListItemIcon>
                        
                        <ListItemText primary={user.name} sx={{color:'#333'}} />
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

              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>

                {selectedUsers.map((user) => (
                  <Chip
                    className="custom-chip"
                    key={user.id}
                    avatar={<>  {getPlatformIcon(user.page_type)}  <Avatar src={user.picture_url} sx={{ width: '22px', height: '22px' }} />  </>}
                    label={user.name}
                    onClick={() => {
                      //handleAvatarClick(user.social_id);
                      //setSelectedChipId(user.social_id);
                      setSelectUser(user); // Set the selected user for preview
                    }}
                    onDelete={() => { 
                      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
                      if (selectedChipId === user.social_id) {
                        setSelectedChipId(null);
                        setSelectUser('');
                      }
                    }} 
                    sx={{
                      border: selectedChipId === user.social_id ? '2px solid #5ebfa6' : 'none',
                      backgroundColor: selectedChipId === user.social_id ? '#ddd' : 'default',
                      boxShadow: selectedChipId === user.social_id ? '0 0 5px rgba(127,86,217,0.6)' : 'none'
                    }}
                    />
                    
                ))}

                {selectedPages.includes(pages.social_id) && (
                  <Box
                    sx={{
                      background: "white",
                      width: 20,
                      height: 20,
                      alignItems: "center",
                    }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{
                        color: "#5ebfa6",
                        fontSize: 20,
                        width: 20,
                        height: 20
                      }}
                    />
                  </Box>
                )}

              </Box>

              {/* Text Field with Generate AI Button */}
<Box sx={{ 
  position: 'relative', 
  mb: 2,

}}>
  {/* Generate with AI Button */}
  <Button
    className="genAI"
    variant="outlined"
    onClick={handleGenerateWithAI}
    disabled={generatingContent}
    sx={{
      position:'absolute',
      top: '7px',
      left: '20%',
      zIndex: 10,
      backgroundColor: '#E6D7FF !important',
      color: '#882AFF !important',
      border: '1px solid #882AFF !important',
      '&:hover': {
        backgroundColor: '#D4C5F9 !important'
      }
    }}
    startIcon={
      generatingContent ? (
        <CircularProgress size={16} sx={{ color: '#882AFF' }} />
      ) : (
        <img src={MarketincerIcon} alt="Marketincer" width='30' height='30' sx={{ borderRadius:'15px', bgcolor:'#fff' }} />
       
      )
    }
  >
    {generatingContent ? 'Generating...' : 'Generate with AI'}
  </Button>

  {/* PDF Document Toggle for LinkedIn Only */}
  {tabValue === 1 && (
    <Box sx={{ 
      position: 'absolute',
      top: '7px',
      right: '10px',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      bgcolor: '#fff',
      px: 1,
      borderRadius: 1,
      border: '1px solid #e0e0e0'
    }}>
      <Checkbox
        checked={isPdfMode}
        onChange={(e) => setIsPdfMode(e.target.checked)}
        size="small"
        sx={{ p: 0.5 }}
      />
      <Typography variant="body2" sx={{ fontSize: '12px', color: '#666' }}>
        Post as PDF Document
      </Typography>
    </Box>
  )}
  
  <Box sx={{ position: 'relative' }}>
    <Editor value={postContent} onChange={handleContentChange} />
    
    {/* Mention Suggestions Dropdown */}
    {showMentions && getMentionSuggestions().length > 0 && (
      <Box
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxHeight: '200px',
          overflow: 'auto'
        }}
      >
        {getMentionSuggestions().map((user) => (
          <Box
            key={user.id}
            onClick={() => handleMention(user)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              },
              borderBottom: '1px solid #f0f0f0',
              '&:last-child': {
                borderBottom: 'none'
              }
            }}
          >
            <Avatar 
              src={user.picture_url} 
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="body2" fontWeight="600">
                {user.name}
              </Typography>
              <Typography variant="body2" color="#666" sx={{ fontSize: '12px' }}>
                @{user.name.toLowerCase().replace(/\s+/g, '_')}
              </Typography>
            </Box>
            {getPlatformIcon(user.page_type)}
          </Box>
        ))}
      </Box>
    )}
  </Box>
</Box>

{/* Document Name Input for PDF Mode */}
{isPdfMode && tabValue === 1 && (
  <Box sx={{ mb: 2 }}>
    <TextField
      fullWidth
      size="small"
      label="Document Name"
      value={documentName}
      onChange={(e) => setDocumentName(e.target.value)}
      placeholder="Enter document name (e.g., Marketing Strategy 2024)"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#882AFF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#882AFF',
            boxShadow: `0 0 0 3px rgba(136, 42, 255, 0.08)`
          }
        }
      }}
    />
  </Box>
)}

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="#666" sx={{ fontSize: '12px' }}>
                  Type @ to mention someone
                </Typography>
                <Typography variant="caption" display="block">
                  275 characters left
                </Typography>
              </Box>

              {/* Uploaded Images */}
              <Box display="flex" gap={1} mb={1}>
                {uploadedImageUrl && (
                  <Box position="relative">
                    <Avatar
                      variant="rounded"
                      src={uploadedImageUrl}
                      sx={{ width: 120, height: 120 }}
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

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{
                  //width: "100%",
                  padding: "12px",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  textAlign: "center",
                  cursor: "pointer",
                  my: 1,
                  //margin: "10px",
                  marginLeft: "0px",
                  boxShadow: '0px 2px 1px -1px rgb(247 247 247 / 12%), 0px 1px 1px 0px rgb(247 247 247 / 12%), 0px 1px 3px 0px rgb(247 247 247 / 12%)'
                }}
                onClick={handleBoxClick}
                onDrop={handleDrop} // ✅ Handles dropped files
                onDragOver={(e) => e.preventDefault()} // ✅ Prevents default drag behavior
              >


                <Typography variant="body2" sx={{ color: "#000", padding:'0px'}}>
                  +  Upload Media
                </Typography>

                {uploadedFileName && (
                  <Typography variant="body2" sx={{
                    color: "#444", mt: 1, whiteSpace: "nowrap", // ✅ Ensures text does not wrap
                    overflow: "hidden", // ✅ Hides overflow text
                    textOverflow: "ellipsis", maxWidth: "400px",
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
                  />

                  {/* Buttons */}
                  <Box display="flex" gap={2}>
                                    <Button variant="outlined" sx={{ display: 'none' }} >Save as Draft</Button>
                {/* <Button variant="contained">Schedule Post</Button> */}
                    <Button
                      variant="contained"
                      sx={{
                        margin: "0.09375rem 1px",
                        display: 'none',
                      }}
                      onClick={() => draftModelOpen("schedule")}
                    >
                      Schedule Post
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handlePublish}
                    disabled={posting || uploading} // Disable when posting or uploading
                    sx={{ 
                      mt: 2, 
                      '&:disabled': {
                        bgcolor: '#9575cd', // Lighter purple when disabled
                        color: '#fff'
                      }
                    }}
                  >
                    {posting ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={20} sx={{ color: '#fff' }} />
                        Publishing...
                      </Box>
                    ) : (
                      'Publish Now'
                    )}
                  </Button>
          </Grid>

          <Grid  size={{ xs: 12, sm: 4, md: 6 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', height:'100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                  <Tab label="Instagram" />
                  <Tab label="Linkedin" />
                  <Tab label="Facebook" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Grid item xs={12} md={12} lg={12}>
                    {renderPreviewContent(0)}
                  </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <Grid item xs={12} md={12} lg={12}>
                    {renderPreviewContent(1)}
                  </Grid>
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <Grid item xs={12} md={12} lg={12}>
                    {renderPreviewContent(2)}
                  </Grid>
                </TabPanel>
          </Grid>
        </Grid>

      </Box>
      </Grid>
    </Grid>
    </Box>

    {/* Publishing Results Modal */}
    <PublishingResultsModal />

    {/* Enhanced Publishing Loader */}
    <PublishingLoader />
    </>
  );
};

export default CreatePost;
