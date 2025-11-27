import React, { useEffect, useState, useRef, useCallback } from "react";

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
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, PlayArrow, Pause } from '@mui/icons-material';
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
import SimpleImageEditor from '../../components/SimpleImageEditor';


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
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [previewMediaIndex, setPreviewMediaIndex] = useState(0);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [editingMediaIndex, setEditingMediaIndex] = useState(null);
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
  const [instagramPostType, setInstagramPostType] = useState('post'); // 'post', 'reel', 'story'
  const [isVideoFile, setIsVideoFile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoadingProgress, setVideoLoadingProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [popupVideoType, setPopupVideoType] = useState(''); // 'reel' or 'story'
  const videoRef = useRef(null);
  const storyVideoRef = useRef(null);
  const popupVideoRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  // Function to check if current media is video
  const isCurrentMediaVideo = () => {
    if (isVideoFile) return true;
    if (!uploadedImageUrl) return false;
    
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv'];
    return videoExtensions.some(ext => uploadedImageUrl.toLowerCase().includes(ext.toLowerCase()));
  };

  console.log('hereree', selectUser)
  console.log('isVideoFile:', isVideoFile, 'uploadedImageUrl:', uploadedImageUrl)
  console.log('isCurrentMediaVideo():', isCurrentMediaVideo())

  // Simplified video loading completion handlers
  const completeVideoLoading = useCallback(() => {
    setIsVideoLoading(false);
    setVideoLoadingProgress(100);
    // Clear timeout when video loads
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);


  // Reset video loading state when new video is uploaded
  const resetVideoLoadingState = () => {
    setVideoLoadingProgress(0);
    setIsVideoLoading(true);
    setIsPlaying(false);
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Set a timeout to prevent infinite loading (10 seconds)
    loadingTimeoutRef.current = setTimeout(() => {
      console.log('Video loading timeout reached');
      setIsVideoLoading(false);
      setVideoLoadingProgress(100);
    }, 10000);
  };

  // Handle opening video popup
  const openVideoPopup = (type) => {
    setPopupVideoType(type);
    setShowVideoPopup(true);
  };

  // Handle closing video popup
  const closeVideoPopup = () => {
    setShowVideoPopup(false);
    setPopupVideoType('');
    if (popupVideoRef.current) {
      popupVideoRef.current.pause();
    }
  };

  // Removed unused toggle functions since we're using popup modal now

  // Handle video loading when new media is uploaded
  useEffect(() => {
    if (uploadedImageUrl && isVideoFile) {
      // Reset loading state for videos directly in useEffect
      setVideoLoadingProgress(0);
      setIsVideoLoading(true);
      setIsPlaying(false);
      
      console.log('Starting video load for both reel and story');
      
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a shorter timeout to prevent infinite loading (5 seconds)
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('Video loading timeout reached - completing all loading states');
        completeVideoLoading();
      }, 5000);
    }
  }, [uploadedImageUrl, isVideoFile, completeVideoLoading]);

  // Cleanup effect for timeouts
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Function to process mentions in content
  const processMentions = (content) => {
    if (!content) return content;

    // First decode any HTML entities that might be present
    const decodedContent = content
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Replace @mentions with styled spans
    return decodedContent.replace(/@(\w+(?:\s+\w+)*)/g, (match, name) => {
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
    // Check if content is required
    if (!postContent) {
      alert("Please add some content to your post!");
      return;
    }
    
    // Check if media is required (LinkedIn allows text-only posts)
    const isLinkedIn = tabValue === 1; // LinkedIn is tab index 1
    const hasMedia = uploadedImageUrl || uploadedMedia.length > 0;
    
    if (!isLinkedIn && !hasMedia) {
      alert("Please upload media for this platform!");
      return;
    }
    
    setCreatePostMode(action);
    setOpenDateTimePicker(true);
  };

  const handleSaveAsDraft = async () => {
    // Check if content is required
    if (!postContent) {
      alert("Please add some content to your post!");
      return;
    }
    
    // Check if media is required (LinkedIn allows text-only posts)
    const isLinkedIn = tabValue === 1; // LinkedIn is tab index 1
    const hasMedia = uploadedImageUrl || uploadedMedia.length > 0;
    
    if (!isLinkedIn && !hasMedia) {
      alert("Please upload media for this platform!");
      return;
    }

    setPosting(true);

    try {
      const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();

      const postData = {
        social_page_ids: selectedPages,
        post: {
          media_urls: uploadedMedia.length > 0 ? uploadedMedia.map(media => media.url) : uploadedImageUrl ? [uploadedImageUrl] : [],
          media_types: uploadedMedia.length > 0 ? uploadedMedia.map(media => media.type) : uploadedImageUrl ? [isVideoFile ? 'video' : 'image'] : [],
          primary_media_url: uploadedMedia.length > 0 ? uploadedMedia[0].url : uploadedImageUrl || '',
          comments: postContent,
          brand_name: brandName,
          status: 'draft',
          post_type: 'post',
          platform_data: {
            instagram_type: instagramPostType
          }
        }
      };

      console.log('Saving draft:', postData);

      const response = await fetch('https://api.marketincer.com/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert('Post saved as draft successfully!');
        // Reset form
        setPostContent('');
        setUploadedImageUrl('');
        setUploadedMedia([]);
        setFile(null);
        setUploadedFileName('');
      } else {
        const errorData = await response.json();
        console.error('Error saving draft:', errorData);
        alert('Failed to save draft. Please try again.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!selectedDateTime) {
      alert("Please select a date and time for scheduling!");
      return;
    }

    // Check if content is required
    if (!postContent) {
      alert("Please add some content to your post!");
      return;
    }
    
    // Check if media is required (LinkedIn allows text-only posts)
    const isLinkedIn = tabValue === 1; // LinkedIn is tab index 1
    const hasMedia = uploadedImageUrl || uploadedMedia.length > 0;
    
    if (!isLinkedIn && !hasMedia) {
      alert("Please upload media for this platform!");
      return;
    }

    setPosting(true);
    setOpenDateTimePicker(false);

    try {
      const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();

      const postData = {
        social_page_ids: selectedPages,
        post: {
          media_urls: uploadedMedia.length > 0 ? uploadedMedia.map(media => media.url) : uploadedImageUrl ? [uploadedImageUrl] : [],
          media_types: uploadedMedia.length > 0 ? uploadedMedia.map(media => media.type) : uploadedImageUrl ? [isVideoFile ? 'video' : 'image'] : [],
          primary_media_url: uploadedMedia.length > 0 ? uploadedMedia[0].url : uploadedImageUrl || '',
          comments: postContent,
          brand_name: brandName,
          status: 'scheduled',
          scheduled_at: selectedDateTime.toISOString(),
          post_type: 'post',
          platform_data: {
            instagram_type: instagramPostType
          }
        }
      };

      console.log('Scheduling post:', postData);

      const response = await fetch('https://api.marketincer.com/api/v1/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert(`Post scheduled successfully for ${selectedDateTime.toLocaleString()}!`);
        // Reset form
        setPostContent('');
        setUploadedImageUrl('');
        setUploadedMedia([]);
        setFile(null);
        setUploadedFileName('');
        setSelectedDateTime(new Date());
      } else {
        const errorData = await response.json();
        console.error('Error scheduling post:', errorData);
        alert('Failed to schedule post. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Failed to schedule post. Please try again.');
    } finally {
      setPosting(false);
    }
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

      // Check if the file is a video
      const isVideo = droppedFile.type.startsWith('video/');
      console.log('Dropped file type:', droppedFile.type, 'Is video:', isVideo);
      setIsVideoFile(isVideo);
      
      // Reset video loading state for videos
      if (isVideo) {
        resetVideoLoadingState();
      }

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
        "https://api.marketincer.com/api/v1/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.url) {
        // Create media object
        const mediaItem = {
          id: Date.now() + Math.random(),
          url: data.url,
          file: file,
          name: file.name,
          type: file.type.startsWith('video/') ? 'video' : 'image'
        };

        // Add to uploaded media array
        setUploadedMedia(prev => [...prev, mediaItem]);
        
        // Set as primary if it's the first upload
        if (uploadedMedia.length === 0) {
          setUploadedImageUrl(data.url);
          setCurrentMediaIndex(0);
          setPreviewMediaIndex(0);
        }

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
    const selectedFiles = Array.from(e.target.files);
    
    selectedFiles.forEach(selectedFile => {
      if (selectedFile) {
        setFile(selectedFile);
        setUploadedFileName(selectedFile.name);
        
        // Check if the file is a video
        const isVideo = selectedFile.type.startsWith('video/');
        console.log('File type:', selectedFile.type, 'Is video:', isVideo);
        setIsVideoFile(isVideo);
        
        // Reset video loading state for videos
        if (isVideo) {
          resetVideoLoadingState();
        }
        
        // Auto-upload the file after selection
        handleFileUpload(selectedFile);
      }
    });
  };

  // Function to remove media from the array
  const handleRemoveMedia = (mediaId) => {
    setUploadedMedia(prev => {
      const filtered = prev.filter(media => media.id !== mediaId);
      
      // Update current media if needed
      if (filtered.length === 0) {
        setUploadedImageUrl("");
        setCurrentMediaIndex(0);
        setPreviewMediaIndex(0);
      } else if (currentMediaIndex >= filtered.length) {
        const newIndex = filtered.length - 1;
        setCurrentMediaIndex(newIndex);
        setUploadedImageUrl(filtered[newIndex].url);
        setPreviewMediaIndex(Math.min(previewMediaIndex, newIndex));
      } else if (previewMediaIndex >= filtered.length) {
        setPreviewMediaIndex(filtered.length - 1);
      }
      
      return filtered;
    });
  };

  // Function to select a media as primary
  const handleSelectMedia = (mediaIndex) => {
    if (uploadedMedia[mediaIndex]) {
      setCurrentMediaIndex(mediaIndex);
      setUploadedImageUrl(uploadedMedia[mediaIndex].url);
      setIsVideoFile(uploadedMedia[mediaIndex].type === 'video');
    }
  };

  const handleOpenImageEditor = (mediaIndex) => {
    if (uploadedMedia[mediaIndex] && uploadedMedia[mediaIndex].type === 'image') {
      setEditingMediaIndex(mediaIndex);
      setImageEditorOpen(true);
    }
  };

  const handleSaveEditedImage = (editedImageDataURL) => {
    if (editingMediaIndex !== null) {
      setUploadedMedia(prev => {
        const updated = [...prev];
        updated[editingMediaIndex] = {
          ...updated[editingMediaIndex],
          url: editedImageDataURL,
          edited: true
        };
        return updated;
      });

      // Update main image URL if this is the current media
      if (editingMediaIndex === currentMediaIndex) {
        setUploadedImageUrl(editedImageDataURL);
      }
    }
    setImageEditorOpen(false);
    setEditingMediaIndex(null);
  };

  const handlePublish = async () => {
    console.log("Publishing to selected pages:", selectedPages);
    
    // Check if content is required
    if (!postContent) {
      alert("Please add some content to your post!");
      return;
    }
    
    // Check if media is required (LinkedIn allows text-only posts)
    const isLinkedIn = tabValue === 1; // LinkedIn is tab index 1
    const hasMedia = uploadedImageUrl || uploadedMedia.length > 0;
    
    if (!isLinkedIn && !hasMedia) {
      alert("Please upload media for this platform!");
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

    const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
    
    // Determine post type and platform-specific data
    const isInstagram = selectedUsers.some(user => user.page_type === 'instagram');
    const postType = isInstagram ? instagramPostType : 'post';
    
    // Prepare media data - use multiple media if available, fallback to single image
    const mediaData = uploadedMedia.length > 0 ? {
      media_urls: uploadedMedia.map(media => media.url),
      media_types: uploadedMedia.map(media => media.type),
      primary_media_url: uploadedImageUrl || uploadedMedia[0]?.url
    } : {
      s3_url: uploadedImageUrl
    };
    
    const payloadData = {
      social_page_ids: selectedPages,
      post: {
        ...mediaData,
        comments: stripHtmlTags(postContent),
        brand_name: brandName,
        status: "publish",
        post_type: postType,
        platform_data: isInstagram ? {
          instagram_type: instagramPostType
        } : {}
      },
    };
    console.log('Publishing with multiple media:', payloadData)

    try {
      // Step 1: Preparing content
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProgress(20, 'Preparing your content...');


      // Step 2: Uploading to platforms
      updateProgress(40, 'Connecting to social platforms...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 3: Publishing
      updateProgress(60, 'Publishing your post...');
      const token = localStorage.getItem("token");

      const response = await axios.post("https://api.marketincer.com/api/v1/posts", payloadData, {
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
      
      // Clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setUploadedMedia([]);
      setCurrentMediaIndex(0);
      setPreviewMediaIndex(0);
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
    // Check if content is required
    if (!postContent) {
      alert("Please add some content to your post!");
      return;
    }
    
    // Check if media is required (LinkedIn allows text-only posts)
    const isLinkedIn = tabValue === 1; // LinkedIn is tab index 1
    const hasMedia = uploadedImageUrl || uploadedMedia.length > 0;
    
    if (!isLinkedIn && !hasMedia) {
      alert("Please upload media for this platform!");
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

    const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
    
    // Determine post type and platform-specific data
    const isInstagram = selectedUsers.some(user => user.page_type === 'instagram');
    const postType = isInstagram ? instagramPostType : 'post';
    
    // Prepare media data - use multiple media if available, fallback to single image
    const mediaData = uploadedMedia.length > 0 ? {
      media_urls: uploadedMedia.map(media => media.url),
      media_types: uploadedMedia.map(media => media.type),
      primary_media_url: uploadedImageUrl || uploadedMedia[0]?.url
    } : {
      s3_url: uploadedImageUrl
    };
    
    const payloadData = {
      social_page_ids: selectedPages,
      post: {
        ...mediaData,
        comments: stripHtmlTags(postContent),
        brand_name: brandName,
        status: createPostMode || 'published',
        scheduled_at: selectedDateTime,
        post_type: postType,
        platform_data: isInstagram ? {
          instagram_type: instagramPostType
        } : {}
      },
    };

    try {
      // Step 1: Preparing content
      await new Promise(resolve => setTimeout(resolve, 400));
      updateProgress(25, 'Validating your content...');


      // Step 2: Processing schedule
      updateProgress(50, createPostMode === 'schedule' ? 'Setting up schedule...' : 'Saving draft...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Step 3: Uploading
      updateProgress(75, `${createPostMode === 'schedule' ? 'Scheduling' : 'Saving'} your post...`);

      const token = localStorage.getItem("token");
      await axios.post("https://api.marketincer.com/api/v1/posts/schedule", payloadData, {
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
      setUploadedMedia([]);
      setCurrentMediaIndex(0);
      setPreviewMediaIndex(0);
      setPosting(false);
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
                    {post.post.platform && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Platform: {post.post.platform}
                        {post.post.account_username && ` • @${post.post.account_username}`}
                        {post.post.account_name && !post.post.account_username && ` • ${post.post.account_name}`}
                      </Typography>
                    )}
                    {!post.post.platform && post.post.account_name && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Account: {post.post.account_name}
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

    const mediaToShow = uploadedMedia.length > 0 ? uploadedMedia : (uploadedImageUrl ? [{ url: uploadedImageUrl, type: 'image' }] : []);
    const currentPreviewMedia = mediaToShow[previewMediaIndex] || mediaToShow[0];

    const handlePrevImage = () => {
      setPreviewMediaIndex(prev => prev > 0 ? prev - 1 : mediaToShow.length - 1);
    };

    const handleNextImage = () => {
      setPreviewMediaIndex(prev => prev < mediaToShow.length - 1 ? prev + 1 : 0);
    };

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

          {/* Post Image/Media or PDF Document */}
          {mediaToShow.length > 0 ? (
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
                    src={currentPreviewMedia?.url} 
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
              /* Regular Media Preview with Navigation */
              <Box 
                sx={{ 
                  width: '100%', 
                  borderRadius: 1, 
                  overflow: 'hidden',
                  mb: 2,
                  position: 'relative'
                }}
              >
                {currentPreviewMedia?.type === 'video' ? (
                  <video 
                    src={currentPreviewMedia.url} 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    controls={false}
                    muted
                  />
                ) : (
                  <img 
                    src={currentPreviewMedia?.url} 
                    alt="LinkedIn post" 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      display: 'block'
                    }} 
                  />
                )}

                {/* Multiple Media Navigation */}
                {mediaToShow.length > 1 && (
                  <>
                    {/* Navigation Arrows */}
                    {previewMediaIndex > 0 && (
                      <IconButton
                        onClick={handlePrevImage}
                        sx={{
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                        }}
                      >
                        <ArrowLeftIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    
                    {previewMediaIndex < mediaToShow.length - 1 && (
                      <IconButton
                        onClick={handleNextImage}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          width: 32,
                          height: 32,
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                        }}
                      >
                        <ArrowLeftIcon sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                      </IconButton>
                    )}

                    {/* Multiple photos indicator */}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5
                    }}>
                      <Typography variant="caption" sx={{ fontSize: 10 }}>
                        {previewMediaIndex + 1}/{mediaToShow.length}
                      </Typography>
                    </Box>
                  </>
                )}
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

          {/* Dots indicator for multiple images below content */}
          {mediaToShow.length > 1 && !isPdfMode && (
            <Box display="flex" justifyContent="center" gap={0.5} mb={2}>
              {mediaToShow.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === previewMediaIndex ? '#0a66c2' : '#c7c7c7',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewMediaIndex(index)}
                />
              ))}
            </Box>
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

  // Instagram Post Preview Component
  const InstagramPostPreview = () => {
    const mediaToShow = uploadedMedia.length > 0 ? uploadedMedia : (uploadedImageUrl ? [{ url: uploadedImageUrl, type: 'image' }] : []);
    const currentPreviewMedia = mediaToShow[previewMediaIndex] || mediaToShow[0];

    const handlePrevImage = () => {
      setPreviewMediaIndex(prev => prev > 0 ? prev - 1 : mediaToShow.length - 1);
    };

    const handleNextImage = () => {
      setPreviewMediaIndex(prev => prev < mediaToShow.length - 1 ? prev + 1 : 0);
    };

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

          {/* Post Image/Video with Navigation */}
          {mediaToShow.length > 0 ? (
            <Box sx={{ width: '100%', aspectRatio: '1/1', position: 'relative', overflow: 'hidden' }}>
              {currentPreviewMedia?.type === 'video' ? (
                <video 
                  src={currentPreviewMedia.url} 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  controls={false}
                  muted
                />
              ) : (
                <img 
                  src={currentPreviewMedia?.url} 
                  alt="Instagram post" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
              )}

              {/* Multiple Image Indicator */}
              {mediaToShow.length > 1 && (
                <>
                  {/* Navigation Arrows */}
                  {previewMediaIndex > 0 && (
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <ArrowLeftIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  
                  {previewMediaIndex < mediaToShow.length - 1 && (
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                      }}
                    >
                      <ArrowLeftIcon sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                    </IconButton>
                  )}

                  {/* Dots Indicator */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 0.5,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    borderRadius: 2,
                    p: 0.5
                  }}>
                    {mediaToShow.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: index === previewMediaIndex ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setPreviewMediaIndex(index)}
                      />
                    ))}
                  </Box>

                  {/* Multiple photos indicator */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5
                  }}>
                    <Typography variant="caption" sx={{ fontSize: 10 }}>
                      {previewMediaIndex + 1}/{mediaToShow.length}
                    </Typography>
                  </Box>
                </>
              )}
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
            
            {/* Dots indicator for multiple images */}
            {mediaToShow.length > 1 && (
              <Box display="flex" justifyContent="center" gap={0.5} mb={1}>
                {mediaToShow.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: index === previewMediaIndex ? '#0095f6' : '#c7c7c7',
                      cursor: 'pointer'
                    }}
                    onClick={() => setPreviewMediaIndex(index)}
                  />
                ))}
              </Box>
            )}
            
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

  // Instagram Reel Preview Component
  const InstagramReelPreview = () => {
    console.log('Rendering InstagramReelPreview, isVideoLoading:', isVideoLoading, 'uploadedImageUrl:', uploadedImageUrl, 'isVideoFile:', isVideoFile);
    return (
      <Card sx={{ 
        borderRadius: 2, 
        backgroundColor: '#000',
        maxWidth: 280,
        margin: '0 auto',
        aspectRatio: '9/16',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Reel Video/Image */}
        {uploadedImageUrl ? (
          isCurrentMediaVideo() ? (
            // Rendering Reel Video
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative'
            }}>
              <video
                ref={videoRef}
                src={uploadedImageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                controls={false}
                loop
                playsInline
                muted
                onError={(e) => {
                  console.log('Video error:', e.target.error);
                  completeVideoLoading();
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                  completeVideoLoading();
                }}
                onCanPlay={() => {
                  console.log('Video can play');
                  completeVideoLoading();
                }}
              />
              
              {/* Centered Play Button */}
              {!isVideoLoading && (
                <Box
                  onClick={() => openVideoPopup('reel')}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      transform: 'translate(-50%, -50%) scale(1.1)'
                    }
                  }}
                >
                  <PlayArrow sx={{ fontSize: 40, color: 'white', ml: 0.5 }} />
                </Box>
              )}
              
              {/* Video Loading Progress Overlay */}
              {isVideoLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    zIndex: 10
                  }}
                >
                  <CircularProgress 
                    variant="indeterminate"
                    size={80}
                    thickness={4}
                    sx={{ 
                      color: '#fff',
                      mb: 2
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Loading Reel...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                    Preparing video...
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            console.log('Rendering Reel Image') ||
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative',
              background: `url(${uploadedImageUrl}) center/cover`
            }}>
              {/* Play button overlay for video effect */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Box sx={{
                  width: 0,
                  height: 0,
                  borderLeft: '20px solid #000',
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  ml: '4px'
                }} />
              </Box>
            </Box>
          )
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <VideoLibraryIcon sx={{ fontSize: 48, color: '#666' }} />
          </Box>
        )}

        {/* Reel UI Overlay */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2
        }}>
          {/* Top section with username */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="white" fontWeight="600">
              Reels
            </Typography>
            <MoreVert sx={{ color: 'white', fontSize: 24 }} />
          </Box>

          {/* Bottom section */}
          <Box>
            {/* Right side actions */}
            <Box sx={{ 
              position: 'absolute', 
              right: 16, 
              bottom: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              alignItems: 'center'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <FavoriteBorderIcon sx={{ fontSize: 28, color: 'white', cursor: 'pointer' }} />
                <Typography variant="caption" color="white" display="block">487</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: 'white', cursor: 'pointer' }} />
                <Typography variant="caption" color="white" display="block">23</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <SendIcon sx={{ fontSize: 28, color: 'white', cursor: 'pointer' }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <BookmarkBorderIcon sx={{ fontSize: 28, color: 'white', cursor: 'pointer' }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <MoreVert sx={{ fontSize: 28, color: 'white', cursor: 'pointer' }} />
              </Box>
            </Box>

            {/* Bottom user info and caption */}
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar 
                src={selectUser?.picture_url || "https://via.placeholder.com/40"} 
                sx={{ width: 32, height: 32, mr: 1.5 }}
              />
              <Typography variant="body2" fontWeight="600" color="white">
                {selectUser?.name?.toLowerCase().replace(/\s+/g, '_') || 'username'}
              </Typography>
            </Box>
            
            {/* Caption */}
            {postContent && (
              <Typography variant="body2" color="white" sx={{ 
                lineHeight: 1.4,
                maxHeight: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <span dangerouslySetInnerHTML={{ __html: processMentions(postContent) }} />
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    );
  };

  // Instagram Story Preview Component
  const InstagramStoryPreview = () => {
    console.log('Rendering InstagramStoryPreview, isVideoLoading:', isVideoLoading, 'uploadedImageUrl:', uploadedImageUrl, 'isVideoFile:', isVideoFile);
    return (
      <Card sx={{ 
        borderRadius: 3, 
        backgroundColor: '#000',
        maxWidth: 280,
        margin: '0 auto',
        aspectRatio: '9/16',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Story progress bar */}
        <Box sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          gap: 0.5
        }}>
          <Box sx={{
            flex: 1,
            height: 3,
            backgroundColor: 'white',
            borderRadius: 1.5,
            opacity: 0.9
          }} />
          <Box sx={{
            flex: 1,
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 1.5
          }} />
          <Box sx={{
            flex: 1,
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 1.5
          }} />
        </Box>

        {/* Story header */}
        <Box sx={{
          position: 'absolute',
          top: 24,
          left: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 2
        }}>
          <Box display="flex" alignItems="center">
            <Avatar 
              src={selectUser?.picture_url || "https://via.placeholder.com/40"} 
              sx={{ width: 32, height: 32, mr: 1, border: '2px solid white' }}
            />
            <Typography variant="body2" fontWeight="600" color="white">
              {selectUser?.name?.toLowerCase().replace(/\s+/g, '_') || 'username'}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ ml: 1 }}>
              2h
            </Typography>
          </Box>
          <MoreVert sx={{ color: 'white', fontSize: 24 }} />
        </Box>

        {/* Story content */}
        {uploadedImageUrl ? (
          isCurrentMediaVideo() ? (
            // Rendering Story Video
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative'
            }}>
              <video
                ref={storyVideoRef}
                src={uploadedImageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                controls={false}
                loop
                playsInline
                muted
                onError={(e) => {
                  console.log('Video error:', e.target.error);
                  completeVideoLoading();
                }}
                onLoadedData={() => {
                  console.log('Video loaded successfully');
                  completeVideoLoading();
                }}
                onCanPlay={() => {
                  console.log('Video can play');
                  completeVideoLoading();
                }}
              />
              
              {/* Centered Play Button */}
              {!isVideoLoading && (
                <Box
                  onClick={() => openVideoPopup('story')}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      transform: 'translate(-50%, -50%) scale(1.1)'
                    }
                  }}
                >
                  <PlayArrow sx={{ fontSize: 35, color: 'white', ml: 0.5 }} />
                </Box>
              )}
              
              {/* Video Loading Progress Overlay */}
              {isVideoLoading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    zIndex: 10
                  }}
                >
                  <CircularProgress 
                    variant="indeterminate"
                    size={60}
                    thickness={4}
                    sx={{ 
                      color: '#fff',
                      mb: 1
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Loading Story...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.8, fontSize: '12px' }}>
                    Preparing...
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            console.log('Rendering Story Image') ||
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              background: `url(${uploadedImageUrl}) center/cover`
            }} />
          )
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ImageIcon sx={{ fontSize: 48, color: '#666' }} />
          </Box>
        )}

        {/* Story text overlay */}
        {postContent && (
          <Box sx={{
            position: 'absolute',
            bottom: 100,
            left: 12,
            right: 12,
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="white" sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              fontSize: '18px'
            }}>
              <span dangerouslySetInnerHTML={{ __html: processMentions(postContent) }} />
            </Typography>
          </Box>
        )}

        {/* Story bottom actions */}
        <Box sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Box sx={{
            flex: 1,
            height: 44,
            border: '2px solid white',
            borderRadius: 22,
            display: 'flex',
            alignItems: 'center',
            px: 2
          }}>
            <Typography variant="body2" color="white" sx={{ opacity: 0.7 }}>
              Send message
            </Typography>
          </Box>
          <Box sx={{
            width: 44,
            height: 44,
            border: '2px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FavoriteBorderIcon sx={{ fontSize: 20, color: 'white' }} />
          </Box>
          <Box sx={{
            width: 44,
            height: 44,
            border: '2px solid white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SendIcon sx={{ fontSize: 20, color: 'white' }} />
          </Box>
        </Box>
      </Card>
    );
  };

  // Main Instagram Preview Component
  const InstagramPreview = () => {
    return (
      <Box>
        {/* Render appropriate preview based on selected type */}
        {instagramPostType === 'post' && <InstagramPostPreview key="instagram-post" />}
        {instagramPostType === 'reel' && <InstagramReelPreview key="instagram-reel" />}
        {instagramPostType === 'story' && <InstagramStoryPreview key="instagram-story" />}
      </Box>
    );
  };

  // Facebook Preview Component  
  const FacebookPreview = () => {
    const mediaToShow = uploadedMedia.length > 0 ? uploadedMedia : (uploadedImageUrl ? [{ url: uploadedImageUrl, type: 'image' }] : []);
    const currentPreviewMedia = mediaToShow[previewMediaIndex] || mediaToShow[0];

    const handlePrevImage = () => {
      setPreviewMediaIndex(prev => prev > 0 ? prev - 1 : mediaToShow.length - 1);
    };

    const handleNextImage = () => {
      setPreviewMediaIndex(prev => prev < mediaToShow.length - 1 ? prev + 1 : 0);
    };

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

          {/* Post Image/Video with Navigation */}
          {mediaToShow.length > 0 ? (
            <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
              {currentPreviewMedia?.type === 'video' ? (
                <video 
                  src={currentPreviewMedia.url} 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  controls={false}
                  muted
                />
              ) : (
                <img 
                  src={currentPreviewMedia?.url} 
                  alt="Facebook post" 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
              )}

              {/* Multiple Media Navigation */}
              {mediaToShow.length > 1 && (
                <>
                  {/* Navigation Arrows */}
                  {previewMediaIndex > 0 && (
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: '#1c1e21',
                        width: 32,
                        height: 32,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      <ArrowLeftIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )}
                  
                  {previewMediaIndex < mediaToShow.length - 1 && (
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        color: '#1c1e21',
                        width: 32,
                        height: 32,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
                      }}
                    >
                      <ArrowLeftIcon sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                    </IconButton>
                  )}

                  {/* Multiple photos indicator */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: 1,
                    px: 1,
                    py: 0.5
                  }}>
                    <Typography variant="caption" sx={{ fontSize: 10 }}>
                      {previewMediaIndex + 1}/{mediaToShow.length}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Skeleton 
              animation="wave" 
              variant="rectangular" 
              width="100%" 
              height={250} 
            />
          )}

          {/* Dots indicator for multiple images below content */}
          {mediaToShow.length > 1 && (
            <Box display="flex" justifyContent="center" gap={0.5} p={1}>
              {mediaToShow.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: index === previewMediaIndex ? '#1877f2' : '#c7c7c7',
                    cursor: 'pointer'
                  }}
                  onClick={() => setPreviewMediaIndex(index)}
                />
              ))}
            </Box>
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
          <Grid size={{ xs: 12, sm: 8, md: 6 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)' ,height:'100%', overflowY: 'auto' }}>
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
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Add user to selection
                              const updatedUsers = [...selectedUsers, user];
                              setSelectedUsers(updatedUsers);
                              
                              // Sync selectedPages
                              const updatedSocialIds = updatedUsers.map(u => u.social_id);
                              setSelectedPages(updatedSocialIds);
                            } else {
                              // Remove user from selection
                              const updatedUsers = selectedUsers.filter(u => u.id !== user.id);
                              setSelectedUsers(updatedUsers);
                              
                              // Sync selectedPages
                              const updatedSocialIds = updatedUsers.map(u => u.social_id);
                              setSelectedPages(updatedSocialIds);
                              
                              // Also clear from preview if it was the selected user
                              if (selectedChipId === user.social_id) {
                                setSelectedChipId(null);
                                setSelectUser('');
                              }
                            }
                          }}
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
                      // Remove from selectedUsers
                      const updatedUsers = selectedUsers.filter(u => u.id !== user.id);
                      setSelectedUsers(updatedUsers);
                      
                      // Sync selectedPages with updated users
                      const updatedSocialIds = updatedUsers.map(u => u.social_id);
                      setSelectedPages(updatedSocialIds);
                      
                      // Clear chip selection if needed
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

              {/* Instagram Post Type Tabs - Only show when Instagram is selected */}
              {selectedUsers.some(user => user.page_type === 'instagram') && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 2,
                  width: 'fit-content'
                }}>
                  {/* Instagram Icon */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mr: 0.5
                  }}>
                    <img src={InstaIcon} alt="Instagram" width="16" height="16" />
                  </Box>
                  
                  {/* Tab Buttons */}
                  <Box sx={{ display: 'flex', gap: 0, width: 'fit-content' }}>
                    {[
                      { type: 'post', label: 'Post' },
                      { type: 'reel', label: 'Reel' },
                      { type: 'story', label: 'Story' }
                    ].map((item) => (
                      <Button
                        key={item.type}
                        onClick={() => setInstagramPostType(item.type)}
                        sx={{
                          minWidth: '20px',
                          maxWidth: '22px',
                          px: 0,
                          py: 0.25,
                          borderRadius: 0,
                          textTransform: 'none',
                          fontSize: '8px',
                          fontWeight: 'normal !important',
                          height: '22px',
                          color: instagramPostType === item.type ? '#882AFF !important' : '#999 !important',
                          backgroundColor: 'transparent !important',
                          border: 'none',
                          borderBottom: instagramPostType === item.type ? '2px solid #882AFF' : '2px solid transparent',
                          boxShadow: 'none !important',
                          '&:hover': {
                            backgroundColor: 'transparent !important',
                            color: instagramPostType === item.type ? '#882AFF !important' : '#999 !important',
                            border: 'none',
                            borderBottom: instagramPostType === item.type ? '2px solid #882AFF' : '2px solid transparent',
                            boxShadow: 'none !important'
                          },
                          '&:focus': {
                            outline: 'none',
                            backgroundColor: 'transparent !important',
                            color: instagramPostType === item.type ? '#882AFF !important' : '#999 !important',
                            boxShadow: 'none !important'
                          },
                          '&:active': {
                            backgroundColor: 'transparent !important',
                            color: instagramPostType === item.type ? '#882AFF !important' : '#999 !important',
                            boxShadow: 'none !important'
                          },
                          '&.Mui-focusVisible': {
                            backgroundColor: 'transparent !important',
                            color: instagramPostType === item.type ? '#882AFF !important' : '#999 !important',
                            boxShadow: 'none !important'
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}

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
    <Editor 
      value={postContent} 
      onChange={handleContentChange}
    />
    
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

              {/* Multiple Media Upload Grid */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Media
                </Typography>
                
                {/* Horizontal scrolling container */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  overflowX: 'auto',
                  pb: 1,
                  maxWidth: '100%',
                  '&::-webkit-scrollbar': {
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c1c1c1',
                    borderRadius: '3px',
                    '&:hover': {
                      backgroundColor: '#a1a1a1',
                    }
                  }
                }}>
                  {/* Display uploaded media */}
                  {uploadedMedia.map((media, index) => (
                    <Box 
                      key={media.id}
                      position="relative" 
                      sx={{
                        cursor: 'pointer',
                        minWidth: '120px',
                        width: '120px',
                        height: '120px',
                        border: currentMediaIndex === index ? '3px solid #882AFF' : '1px solid #e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        '&:hover': {
                          transform: 'scale(1.02)',
                          transition: 'transform 0.2s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        },
                        boxShadow: currentMediaIndex === index ? '0 0 0 1px #882AFF' : 'none'
                      }}
                      onClick={() => handleSelectMedia(index)}
                    >
                      {media.type === 'video' ? (
                        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                          <video
                            src={media.url}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <Box 
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              bgcolor: 'rgba(0,0,0,0.6)',
                              borderRadius: '50%',
                              p: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <PlayArrow sx={{ color: 'white', fontSize: 20 }} />
                          </Box>
                        </Box>
                      ) : (
                        <img
                          src={media.url}
                          alt={media.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      
                      {/* Overlay icons */}
                      <Box 
                        sx={{
                          position: 'absolute',
                          bottom: 6,
                          left: 6,
                          display: 'flex',
                          gap: 0.5
                        }}
                      >
                        <Box 
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            p: 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(136, 42, 255, 0.9)',
                              '& svg': { color: 'white' }
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenImageEditor(index);
                          }}
                          title="Edit Image"
                        >
                          <ImageIcon sx={{ fontSize: 12, color: '#666' }} />
                        </Box>
                        <Box 
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.9)',
                            borderRadius: '50%',
                            p: 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20
                          }}
                        >
                          <ChatBubbleOutlineIcon sx={{ fontSize: 12, color: '#666' }} />
                        </Box>
                      </Box>

                      {/* Remove button */}
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          width: 20,
                          height: 20,
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.9)'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMedia(media.id);
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>

                      {/* Current media indicator */}
                      {currentMediaIndex === index && (
                        <Box 
                          sx={{
                            position: 'absolute',
                            top: 2,
                            left: 2,
                            bgcolor: '#882AFF',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 600,
                            border: '1px solid white'
                          }}
                        >
                          {index + 1}
                        </Box>
                      )}
                    </Box>
                  ))}

                  {/* Add new media button - only show if less than 12 media items */}
                  {uploadedMedia.length < 12 && (
                    <Box
                      sx={{
                        minWidth: '120px',
                        width: '120px',
                        height: '120px',
                        border: '2px dashed #ccc',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#fafafa',
                        '&:hover': {
                          borderColor: '#882AFF',
                          backgroundColor: '#f5f0ff'
                        },
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                      onClick={handleBoxClick}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <Box 
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 0.5
                        }}
                      >
                        <Typography variant="h6" sx={{ color: '#666', fontWeight: 300, fontSize: 16 }}>
                          +
                        </Typography>
                      </Box>
                      {uploading ? (
                        <CircularProgress size={12} sx={{ color: '#882AFF' }} />
                      ) : (
                        <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', fontSize: 10 }}>
                          Add Media
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Media count info */}
                {uploadedMedia.length > 0 && (
                  <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
                    {uploadedMedia.length} media file{uploadedMedia.length !== 1 ? 's' : ''} uploaded
                    {uploadedMedia.length > 1 && ` • Currently showing: ${currentMediaIndex + 1}`}
                  </Typography>
                )}
              </Box>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                  />

                  {/* Buttons */}
                  {/* Primary Action - Publish Now (Top) */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handlePublish}
                    disabled={posting || uploading}
                    sx={{ 
                      mb: 3,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #7C4DFF 0%, #9C27B0 100%)',
                      boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #5E35B1 0%, #7B1FA2 100%)',
                        boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        bgcolor: '#9575cd',
                        color: '#fff'
                      },
                      transition: 'all 0.3s ease'
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

                  {/* Secondary Actions - Save Draft & Schedule (Bottom) */}
                  <Box display="flex" gap={2} sx={{ mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderColor: '#7C4DFF',
                        color: '#7C4DFF',
                        py: 1.2,
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: '#5E35B1',
                          color: '#5E35B1',
                          backgroundColor: 'rgba(124, 77, 255, 0.08)',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleSaveAsDraft()}
                      disabled={posting || uploading}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#7C4DFF',
                        color: '#fff',
                        py: 1.2,
                        fontWeight: 500,
                        '&:hover': { 
                          backgroundColor: '#5E35B1',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => draftModelOpen("schedule")}
                      disabled={posting || uploading}
                    >
                      Schedule Post
                    </Button>
                  </Box>
          </Grid>

          <Grid  size={{ xs: 12, sm: 4, md: 6 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', height:'100%', overflowY: 'auto' }}>
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

    {/* Video Popup Modal */}
    <Modal
      open={showVideoPopup}
      onClose={closeVideoPopup}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: popupVideoType === 'story' ? 350 : 500,
          height: popupVideoType === 'story' ? 600 : 700,
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={closeVideoPopup}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 20,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Popup Video */}
        {uploadedImageUrl && isCurrentMediaVideo() && (
          <video
            ref={popupVideoRef}
            src={uploadedImageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            controls={true}
            loop
            playsInline
            autoPlay
            onLoadedData={() => {
              if (popupVideoRef.current) {
                popupVideoRef.current.play();
              }
            }}
          />
        )}

        {/* Video Title Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            p: 2,
            zIndex: 10
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {popupVideoType === 'story' ? 'Instagram Story Preview' : 'Instagram Reel Preview'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {uploadedFileName}
          </Typography>
        </Box>
      </Box>
    </Modal>

    {/* Simple Image Editor Modal */}
    <SimpleImageEditor
      open={imageEditorOpen}
      onClose={() => setImageEditorOpen(false)}
      imageUrl={editingMediaIndex !== null ? uploadedMedia[editingMediaIndex]?.url : ''}
      originalFile={editingMediaIndex !== null ? uploadedMedia[editingMediaIndex]?.file : null}
      onSave={handleSaveEditedImage}
    />

    {/* Schedule Post Modal */}
    <Modal open={openDateTimePicker} onClose={() => setOpenDateTimePicker(false)}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 650,
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', height: 480 }}>
          {/* Calendar Section */}
          <Box sx={{ 
            flex: 1, 
            p: 3, 
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#fafafa'
          }}>
            {(() => {
              const today = new Date();
              const currentDate = selectedDateTime || today;
              const year = currentDate.getFullYear();
              const month = currentDate.getMonth();
              
              const firstDayOfMonth = new Date(year, month, 1);
              const lastDayOfMonth = new Date(year, month + 1, 0);
              const startDate = new Date(firstDayOfMonth);
              startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
              
              const endDate = new Date(lastDayOfMonth);
              endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));
              
              const weeks = [];
              const currentWeek = [];
              
              for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                currentWeek.push(new Date(d));
                if (currentWeek.length === 7) {
                  weeks.push([...currentWeek]);
                  currentWeek.length = 0;
                }
              }
              
              const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              
              const goToPrevMonth = () => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDateTime(newDate);
              };
              
              const goToNextMonth = () => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDateTime(newDate);
              };

              return (
                <>
                  {/* Calendar Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={goToPrevMonth} sx={{ color: '#666' }}>
                      <Typography sx={{ transform: 'rotate(180deg)' }}>→</Typography>
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                      {monthNames[month]} {year}
                    </Typography>
                    <IconButton onClick={goToNextMonth} sx={{ color: '#666' }}>
                      <Typography>→</Typography>
                    </IconButton>
                  </Box>
                  
                  {/* Day Headers */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                          {day}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Calendar Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                    {weeks.flat().map((date, index) => {
                      const isCurrentMonth = date.getMonth() === month;
                      const isToday = date.toDateString() === today.toDateString();
                      const isSelected = selectedDateTime && date.toDateString() === selectedDateTime.toDateString();
                      const isPast = date < today && !isToday;
                      
                      return (
                        <Box
                          key={index}
                          onClick={() => {
                            if (!isPast) {
                              const newDateTime = new Date(selectedDateTime || new Date());
                              newDateTime.setFullYear(date.getFullYear());
                              newDateTime.setMonth(date.getMonth());
                              newDateTime.setDate(date.getDate());
                              setSelectedDateTime(newDateTime);
                            }
                          }}
                          sx={{
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            cursor: isPast ? 'not-allowed' : 'pointer',
                            backgroundColor: isSelected ? '#4285f4' : 'transparent',
                            color: isSelected ? 'white' : 
                                   isPast ? '#ccc' :
                                   isCurrentMonth ? '#333' : '#999',
                            '&:hover': {
                              backgroundColor: !isPast && !isSelected ? '#f0f0f0' : undefined
                            },
                            border: isToday && !isSelected ? '2px solid #4285f4' : 'none',
                            fontWeight: isSelected || isToday ? 600 : 400
                          }}
                        >
                          <Typography variant="body2">
                            {date.getDate()}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </>
              );
            })()}
          </Box>
          
          {/* Time Selection Section */}
          <Box sx={{ width: 240, p: 3, backgroundColor: 'white' }}>
            {/* Custom Time Input */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                Custom Time
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
                {/* Hour Input */}
                <TextField
                  type="number"
                  inputProps={{ 
                    min: 1, 
                    max: 12,
                    style: { 
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '500',
                      padding: '8px 4px'
                    }
                  }}
                  value={(() => {
                    const currentTime = selectedDateTime || new Date();
                    let hour = currentTime.getHours();
                    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                  })()}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty input for easier editing
                    if (inputValue === '') {
                      return;
                    }
                    
                    const hour12 = Math.min(12, Math.max(1, parseInt(inputValue) || 1));
                    const currentTime = selectedDateTime || new Date();
                    const isAM = currentTime.getHours() < 12;
                    let hour24 = hour12;
                    
                    if (isAM && hour12 === 12) hour24 = 0;
                    else if (!isAM && hour12 !== 12) hour24 = hour12 + 12;
                    
                    const newDateTime = new Date(currentTime);
                    newDateTime.setHours(hour24);
                    setSelectedDateTime(newDateTime);
                  }}
                  onFocus={(e) => {
                    // Select all text on focus for easier editing
                    e.target.select();
                  }}
                  sx={{ 
                    width: 60,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      height: '40px',
                      '& input': {
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#333'
                      },
                      '&:hover fieldset': { 
                        borderColor: '#4285f4',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#4285f4',
                        borderWidth: '2px'
                      },
                      '& fieldset': {
                        borderColor: '#ddd'
                      }
                    }
                  }}
                />
                
                <Typography sx={{ 
                  color: '#333', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  mx: 0.5
                }}>:</Typography>
                
                {/* Minute Input */}
                <TextField
                  type="number"
                  inputProps={{ 
                    min: 0, 
                    max: 59,
                    step: 1,
                    style: { 
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: '500',
                      padding: '8px 4px'
                    }
                  }}
                  value={(() => {
                    const minutes = (selectedDateTime || new Date()).getMinutes();
                    return minutes === 0 ? '' : minutes;
                  })()}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty input for easier editing
                    if (inputValue === '') {
                      const newDateTime = new Date(selectedDateTime || new Date());
                      newDateTime.setMinutes(0);
                      setSelectedDateTime(newDateTime);
                      return;
                    }
                    
                    const minute = Math.min(59, Math.max(0, parseInt(inputValue) || 0));
                    const newDateTime = new Date(selectedDateTime || new Date());
                    newDateTime.setMinutes(minute);
                    setSelectedDateTime(newDateTime);
                  }}
                  onFocus={(e) => {
                    // Select all text on focus for easier editing
                    e.target.select();
                  }}
                  sx={{ 
                    width: 60,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8f9fa',
                      height: '40px',
                      '& input': {
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#333'
                      },
                      '&:hover fieldset': { 
                        borderColor: '#4285f4',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': { 
                        borderColor: '#4285f4',
                        borderWidth: '2px'
                      },
                      '& fieldset': {
                        borderColor: '#ddd'
                      }
                    }
                  }}
                />
                
                {/* AM/PM Toggle */}
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                  {['AM', 'PM'].map((period) => {
                    const currentTime = selectedDateTime || new Date();
                    const isSelected = (period === 'AM' && currentTime.getHours() < 12) || 
                                     (period === 'PM' && currentTime.getHours() >= 12);
                    
                    return (
                      <Box
                        key={period}
                        onClick={() => {
                          const newDateTime = new Date(currentTime);
                          const currentHour = currentTime.getHours();
                          
                          if (period === 'AM' && currentHour >= 12) {
                            newDateTime.setHours(currentHour - 12);
                          } else if (period === 'PM' && currentHour < 12) {
                            newDateTime.setHours(currentHour + 12);
                          }
                          
                          setSelectedDateTime(newDateTime);
                        }}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#4285f4' : '#f8f9fa',
                          color: isSelected ? 'white' : '#666',
                          textAlign: 'center',
                          fontSize: '12px',
                          fontWeight: isSelected ? 600 : 500,
                          border: '1px solid',
                          borderColor: isSelected ? '#4285f4' : '#ddd',
                          minWidth: '32px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': {
                            backgroundColor: !isSelected ? '#e8f0fe' : undefined,
                            borderColor: !isSelected ? '#4285f4' : undefined
                          },
                          mb: period === 'AM' ? 1 : 0
                        }}
                      >
                        {period}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Divider */}
            <Box sx={{ borderTop: '1px solid #e0e0e0', mb: 3 }} />

            {/* Quick Time Options */}
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: '#666', fontWeight: 500 }}>
                Quick Select
              </Typography>
              <Box sx={{ 
                maxHeight: 250, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#ccc',
                  borderRadius: '3px',
                },
              }}>
                {(() => {
                  const times = [];
                  for (let hour = 9; hour <= 23; hour++) {
                    for (let minute of [0, 30]) {
                      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
                      
                      times.push({ time24, time12, hour: hour, minute: minute });
                    }
                  }
                  
                  const currentTime = selectedDateTime || new Date();
                  const selectedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
                  
                  return times.map(({ time24, time12, hour, minute }) => {
                    const isSelected = selectedTime === time24;
                    
                    return (
                      <Box
                        key={time24}
                        onClick={() => {
                          const newDateTime = new Date(selectedDateTime || new Date());
                          newDateTime.setHours(hour);
                          newDateTime.setMinutes(minute);
                          setSelectedDateTime(newDateTime);
                        }}
                        sx={{
                          py: 1,
                          px: 2,
                          borderRadius: 1,
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#4285f4' : 'transparent',
                          color: isSelected ? 'white' : '#333',
                          '&:hover': {
                            backgroundColor: !isSelected ? '#f5f5f5' : undefined
                          },
                          mb: 0.5,
                          fontSize: '14px'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 400 }}>
                          {time12}
                        </Typography>
                      </Box>
                    );
                  });
                })()}
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2, 
          p: 3, 
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#fafafa'
        }}>
          <Button
            variant="outlined"
            onClick={() => setOpenDateTimePicker(false)}
            sx={{
              color: '#666',
              borderColor: '#ddd',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleScheduleSubmit}
            sx={{
              backgroundColor: '#4285f4',
              '&:hover': { backgroundColor: '#3367d6' },
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Done
          </Button>
        </Box>
      </Paper>
    </Modal>
    </>
  );
};

export default CreatePost;
