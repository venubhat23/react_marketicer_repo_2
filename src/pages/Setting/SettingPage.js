import React, { useEffect, useState, useRef } from "react";

import {
  Box, Typography, Button,
  TextField,
  Avatar,
  Chip,
  MenuItem,
  IconButton,
  Card, FormControl,
  Tab, Tabs, Checkbox,
  Grid, Modal, Paper,
  AppBar, Toolbar, Container, InputLabel, ListItemText,
  CardContent, Autocomplete, CardActions, CardMedia, Divider, Stack,ListItemIcon,
  CircularProgress,
  Select
} from "@mui/material";
import {
    AccountCircle,
    Business,
    Lock,
    Payment,
    Share,
    Security,
    AccessTime,
    Delete,
    Edit as EditIcon,
    Close as CloseIcon,
    Check as CheckIcon,
  } from '@mui/icons-material';

import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
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
import { 
  useGetSettings, 
  useUpdatePersonalInformation, 
  useUpdateCompanyDetails, 
  useChangePassword,
  useGetTimezones,
  useUpdateTimezone,
  useDeleteAccount
} from '../../hooks/useSettings';
import Sidebar from '../../components/Sidebar'




const tabData = [
    { label: 'Personal Information' },
    { label: 'Company Details' },
    { label: 'Change Password' },
    { label: 'Subscription & Payment' },
    { label: 'Social Media Accounts' },
    { label: 'Two-step Verification' },
    { label: 'Timezone' },
    { label: 'Delete Account'},
  ];
  
  const countryCodes = [
    { code: 'US', dial: '+1' },
    { code: 'IN', dial: '+91' },
    { code: 'UK', dial: '+44' },
    // Add more as needed
  ];

  const TabPanel = ({ children, value, index }) => {
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        sx={{ flexGrow: 1, p: 3, minHeight: '300px', }}
      >
        {value === index && (
          <Box sx={{ fontSize: '14px', lineHeight: 1.6, color: '#374151' }}>
            {children}
          </Box>
        )}
      </Box>
    );
  };

const SettingPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [personalEditMode, setPersonalEditMode] = useState(false);
    const [companyEditMode, setCompanyEditMode] = useState(false);
    const fileInputRef = useRef(null);
    
    // API hooks
    const { data: settingsData, isLoading: settingsLoading, error: settingsError } = useGetSettings();
    const updatePersonalInfo = useUpdatePersonalInformation();
    const updateCompanyDetails = useUpdateCompanyDetails();
    const changePassword = useChangePassword();
    const { data: timezonesData, isLoading: timezonesLoading } = useGetTimezones();
    const updateTimezone = useUpdateTimezone();
    const deleteAccount = useDeleteAccount();
    
    // Personal Information Form State
    const [personalFormData, setPersonalFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        bio: '',
        avatar_url: '',
      });

    // Company Details Form State  
    const [companyFormData, setCompanyFormData] = useState({
        company_name: '',
        gst_name: '',
        gst_number: '',
        company_phone: '',
        company_address: '',
        company_website: '',
      });
    
    // Password Form State
    const [passwordFormData, setPasswordFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });

    // Timezone State
    const [selectedTimezone, setSelectedTimezone] = useState('');
    
    // Delete Account State
    const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    
    // Social Media Accounts State
    const [socialAccounts, setSocialAccounts] = useState([]);
    const [socialAccountsLoading, setSocialAccountsLoading] = useState(false);
    
    // Social Media Icons Mapping
    const socialIcons = {
      "linkedin": {
        "name": "LinkedIn",
        "icon": "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar.png",
      },
      "instagram": {
        "name": "Instagram", 
        "icon": "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-1.png",
      },
      "facebook": {
        "name": "Facebook",
        "icon": "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-2.png",
      },
      "twitter": {
        "name": "Twitter",
        "icon": "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-3.png",
      }
    };

    // Load data from API when available
    useEffect(() => {
      if (settingsData?.data) {
        const { personal_information, company_details, timezone } = settingsData.data;
        
        if (personal_information) {
          setPersonalFormData({
            first_name: personal_information.first_name || '',
            last_name: personal_information.last_name || '',
            email: personal_information.email || '',
            phone_number: personal_information.phone_number || '',
            bio: personal_information.bio || '',
            avatar_url: personal_information.avatar_url || '',
          });
        }

        if (company_details) {
          setCompanyFormData({
            company_name: company_details.name || '',
            gst_name: company_details.gst_name || '',
            gst_number: company_details.gst_number || '',
            company_phone: company_details.phone_number || '',
            company_address: company_details.address || '',
            company_website: company_details.website || '',
          });
        }

        // Set current timezone
        if (timezone) {
          setSelectedTimezone(timezone);
        }
      }
    }, [settingsData]);

    // Fetch social accounts on component mount
    useEffect(() => {
      fetchSocialAccounts();
    }, []);
    
    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setPersonalFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handlePersonalSave = async () => {
        try {
          await updatePersonalInfo.mutateAsync(personalFormData);
          setPersonalEditMode(false);
          toast.success('Personal information updated successfully');
        } catch (error) {
          // Error is handled by the hook
          console.error('Failed to update personal information:', error);
        }
      };

      const handleCompanySave = async () => {
        try {
          await updateCompanyDetails.mutateAsync({
            company_name: companyFormData.company_name,
            gst_name: companyFormData.gst_name,
            gst_number: companyFormData.gst_number,
            company_phone: companyFormData.company_phone,
            company_address: companyFormData.company_address,
            company_website: companyFormData.company_website,
          });
          setCompanyEditMode(false);
          toast.success('Company details updated successfully');
        } catch (error) {
          // Error is handled by the hook
          console.error('Failed to update company details:', error);
        }
      };
    
      const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordFormData.new_password !== passwordFormData.confirm_password) {
          toast.error("Password confirmation doesn't match");
          return;
        }

        try {
          await changePassword.mutateAsync(passwordFormData);
          setPasswordFormData({
            current_password: '',
            new_password: '',
            confirm_password: '',
          });
          // Success message is handled by the hook
        } catch (error) {
          // Error is handled by the hook
          console.error('Failed to change password:', error);
        }
      };

      const handleTimezoneChange = async (event) => {
        const newTimezone = event.target.value;
        setSelectedTimezone(newTimezone);
        
        try {
          await updateTimezone.mutateAsync(newTimezone);
        } catch (error) {
          // Revert the selection on error
          setSelectedTimezone(settingsData?.data?.timezone || '');
          console.error('Failed to update timezone:', error);
        }
      };

      const handleDeleteAccountSubmit = async (e) => {
        e.preventDefault();
        
        if (!deleteAccountPassword.trim()) {
          toast.error('Password is required to delete account');
          return;
        }

        try {
          await deleteAccount.mutateAsync(deleteAccountPassword);
          setShowDeleteConfirmation(false);
          setDeleteAccountPassword('');
        } catch (error) {
          // Error is handled by the hook
          console.error('Failed to delete account:', error);
        }
      };

      const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          // Check file type
          if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
          }
          
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
          }

          // Create file reader to preview image
          const reader = new FileReader();
          reader.onload = (e) => {
            setPersonalFormData(prev => ({
              ...prev,
              avatar_url: e.target.result
            }));
            toast.success('Photo selected successfully');
          };
          reader.readAsDataURL(file);
        }
      };

      const handleChangePhotoClick = () => {
        fileInputRef.current?.click();
      };

      // Fetch connected social media accounts
      const fetchSocialAccounts = async () => {
        try {
          setSocialAccountsLoading(true);
          const response = await axios.get("https://api.marketincer.com/api/v1/social_pages/connected_pages", {
            headers: {
              'Authorization': localStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          });
          
          let accounts = response?.data?.data?.accounts;
          if (accounts) {
            accounts = accounts.map((account) => {
              const new_account = {
                id: account.id,
                platform: socialIcons[account.page_type]?.name || account.page_type,
                icon: socialIcons[account.page_type]?.icon,
                page_type: account.page_type,
                users: [{
                  id: account.id,
                  social_account_id: account.social_account_id,
                  name: account.name,
                  username: account.username,
                  avatar: account.picture_url,
                  status: "Active",
                }]
              };
              return new_account;
            });
            setSocialAccounts(accounts);
          }
        } catch (error) {
          console.error("Failed to fetch social accounts:", error);
          toast.error("Failed to load social media accounts");
        } finally {
          setSocialAccountsLoading(false);
        }
      };


  // Show loading state
  if (settingsLoading) {
    return (
      <Layout>
        <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    
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
                 Setting Page
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
      <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, height: 'calc(100vh - 64px)', overflow: 'hidden !important'}}>
        <Grid container sx={{ height: '100%', overflow: 'hidden !important' }}>
          <Grid size={{ xs: 6, sm: 12, md:12 }}  sx={{ bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', height: '100%'}}>
            
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Horizontal Navigation Tabs */}
              <Box sx={{ 
                borderBottom: '1px solid #e5e7eb', 
                backgroundColor: '#f8f9fa',
                px: 2,
                py: 1
              }}>
                <Tabs
                  orientation="horizontal"
                  value={selectedTab}
                  onChange={(e, newValue) => setSelectedTab(newValue)}
                  aria-label="Settings Tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      gap: { xs: '4px', sm: '8px', md: '12px' }, // Gap between tabs
                    },
                    '.MuiTab-root': {
                      textTransform: 'none',
                      color: '#6b7280', // Medium gray text for inactive tabs
                      backgroundColor: 'transparent',
                      padding: { xs: '8px 12px', sm: '10px 16px', md: '12px 20px' }, // Responsive padding
                      margin: '4px 2px',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease-in-out',
                      fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Responsive font size
                      minHeight: { xs: '36px', sm: '40px', md: '44px' }, // Responsive min height
                      minWidth: { xs: '80px', sm: '100px', md: '120px' }, // Responsive min width
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                      }
                    },
                    '.Mui-selected': {
                      backgroundColor: 'transparent !important', // Remove background
                      color: '#882AFF !important', // Purple text for selected tab
                      fontWeight: 600,
                      fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Responsive font size for selected
                      boxShadow: 'none',
                    },
                    '.MuiTabs-indicator': {
                      display: 'block', // Show the underline indicator
                      backgroundColor: '#882AFF',
                      height: '3px',
                      borderRadius: '2px',
                    },
                    '.MuiTabs-scrollButtons': {
                      color: '#000000',
                      fontWeight: 'bold',
                      backgroundColor: 'transparent',
                      borderRadius: '6px',
                      margin: '0 4px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        color: '#000000',
                        transform: 'scale(1.1)',
                      },
                      '&.Mui-disabled': {
                        opacity: 0.3,
                      },
                    },
                  }}
                >
                  {tabData.map((tab, index) => (
                    <Tab
                      key={index}
                      label={tab.label}
                    />
                  ))}
                </Tabs>
              </Box>

              {/* Main Content Panel */}
              <Box flexGrow={1} sx={{ p: 2, pt: 1, overflow: 'auto' }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            fontSize: '22px', 
            color: '#1a1a1a',
            letterSpacing: '-0.025em',
            mb: 1
          }}
        >
          {tabData[selectedTab].label}
        </Typography>

        <TabPanel value={selectedTab} index={0}>
          <Box maxWidth="700px">
            {/* Profile Card */}
            <Card sx={{ 
              p: 2.5, 
              mb: 2.5, 
              borderRadius: 2.5, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              {/* Edit Profile Button at Top */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                {!personalEditMode ? (
                  <IconButton 
                    onClick={() => setPersonalEditMode(true)}
                    size="small"
                    sx={{
                      backgroundColor: '#882AFF',
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: '#7C3AED'
                      }
                    }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                ) : (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      onClick={() => setPersonalEditMode(false)}
                      size="small"
                      sx={{
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          backgroundColor: '#e5e7eb',
                          color: '#374151'
                        }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton 
                      onClick={handlePersonalSave}
                      disabled={updatePersonalInfo.isPending}
                      size="small"
                      sx={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          backgroundColor: '#059669'
                        },
                        '&:disabled': {
                          backgroundColor: '#d1d5db',
                          color: '#9ca3af'
                        }
                      }}
                    >
                      {updatePersonalInfo.isPending ? (
                        <CircularProgress size={14} sx={{ color: 'white' }} />
                      ) : (
                        <CheckIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2} alignItems="flex-start">
                {/* Avatar Section */}
                <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 2 }}>
                    <Avatar
                      alt="Profile"
                      src={personalFormData.avatar_url || "https://randomuser.me/api/portraits/women/65.jpg"}
                      sx={{ 
                        width: 96, 
                        height: 96,
                        border: '2px solid #f3f4f6'
                      }}
                    />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: '#374151' }}>
                        Profile Picture
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 1.5, fontSize: '13px' }}>
                        Choose a profile picture that represents you
                      </Typography>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        disabled={!personalEditMode}
                        onClick={handleChangePhotoClick}
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: 2,
                          fontSize: '12px',
                          px: 2,
                          py: 0.75,
                          borderColor: personalEditMode ? '#882AFF' : '#d1d5db',
                          color: personalEditMode ? '#882AFF' : '#9ca3af',
                          '&:hover': {
                            borderColor: personalEditMode ? '#7C3AED' : '#d1d5db',
                            backgroundColor: personalEditMode ? 'rgba(136, 42, 255, 0.05)' : 'transparent'
                          }
                        }}
                      >
                        Change Photo
                      </Button>
                    </Box>
                  </Box>
                </Grid>

                {/* Form Fields */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="First Name"
                    name="first_name"
                    value={personalFormData.first_name}
                    onChange={handlePersonalChange}
                    fullWidth
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Last Name"
                    name="last_name"
                    value={personalFormData.last_name}
                    onChange={handlePersonalChange}
                    fullWidth
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={personalFormData.email}
                    onChange={handlePersonalChange}
                    fullWidth
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Phone Number"
                    name="phone_number"
                    value={personalFormData.phone_number}
                    onChange={handlePersonalChange}
                    fullWidth
                    disabled={!personalEditMode}
                    placeholder="+1 (555) 000-0000"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Bio"
                    name="bio"
                    value={personalFormData.bio}
                    onChange={handlePersonalChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!personalEditMode}
                    placeholder="Tell us about yourself..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Box maxWidth="700px">
            {/* Company Info Card */}
            <Card sx={{ 
              p: 2.5, 
              mb: 2.5, 
              borderRadius: 2.5, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Company Name"
                    name="company_name"
                    value={companyFormData.company_name}
                    onChange={handleCompanyChange}
                    fullWidth
                    disabled={!companyEditMode}
                    placeholder="Enter company name"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Company Phone"
                    name="company_phone"
                    value={companyFormData.company_phone}
                    onChange={handleCompanyChange}
                    fullWidth
                    disabled={!companyEditMode}
                    placeholder="+1 (555) 000-0000"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="GST Name"
                    name="gst_name"
                    value={companyFormData.gst_name}
                    onChange={handleCompanyChange}
                    fullWidth
                    disabled={!companyEditMode}
                    placeholder="GST registered name"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="GST Number"
                    name="gst_number"
                    value={companyFormData.gst_number}
                    onChange={handleCompanyChange}
                    fullWidth
                    disabled={!companyEditMode}
                    placeholder="22AAAAA0000A1Z5"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Website URL"
                    name="company_website"
                    value={companyFormData.company_website}
                    onChange={handleCompanyChange}
                    fullWidth
                    disabled={!companyEditMode}
                    placeholder="https://www.example.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Company Address"
                    name="company_address"
                    value={companyFormData.company_address}
                    onChange={handleCompanyChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={!companyEditMode}
                    placeholder="Enter your complete business address..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                    {!companyEditMode ? (
                      <Button 
                        variant="contained" 
                        onClick={() => setCompanyEditMode(true)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: 3,
                          px: 3,
                          backgroundColor: '#882AFF',
                          '&:hover': {
                            backgroundColor: '#7C3AED'
                          }
                        }}
                      >
                        Edit Company Details
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outlined"
                          onClick={() => setCompanyEditMode(false)}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 3,
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            '&:hover': {
                              borderColor: '#9ca3af',
                              backgroundColor: '#f9fafb'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={handleCompanySave}
                          disabled={updateCompanyDetails.isPending}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 3,
                            px: 3,
                            backgroundColor: '#882AFF',
                            '&:hover': {
                              backgroundColor: '#7C3AED'
                            }
                          }}
                        >
                          {updateCompanyDetails.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <Box maxWidth="700px">
            {/* Password Card */}
            <Card sx={{ 
              p: 2.5, 
              mb: 2.5, 
              borderRadius: 2.5, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <form onSubmit={handlePasswordSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Current Password"
                      type="password"
                      name="current_password"
                      value={passwordFormData.current_password}
                      onChange={handlePasswordChange}
                      fullWidth
                      placeholder="Enter your current password"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: '#882AFF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#882AFF',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#882AFF',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <TextField
                      label="New Password"
                      type="password"
                      name="new_password"
                      value={passwordFormData.new_password}
                      onChange={handlePasswordChange}
                      fullWidth
                      placeholder="Enter new password"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: '#882AFF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#882AFF',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#882AFF',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      name="confirm_password"
                      value={passwordFormData.confirm_password}
                      onChange={handlePasswordChange}
                      fullWidth
                      placeholder="Confirm new password"
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: '#882AFF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#882AFF',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#882AFF',
                        },
                      }}
                    />
                  </Grid>

                  {/* Password Requirements */}
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: '#f8fafc', 
                      borderRadius: 2, 
                      border: '1px solid #e2e8f0' 
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
                        Password Requirements:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2, color: '#6b7280' }}>
                        <li><Typography variant="caption">At least 8 characters long</Typography></li>
                        <li><Typography variant="caption">Include uppercase and lowercase letters</Typography></li>
                        <li><Typography variant="caption">Include at least one number</Typography></li>
                        <li><Typography variant="caption">Include at least one special character</Typography></li>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Action Button */}
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={changePassword.isPending}
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          backgroundColor: '#882AFF',
                          '&:hover': {
                            backgroundColor: '#7C3AED'
                          }
                        }}
                      >
                        {changePassword.isPending ? 'Updating Password...' : 'Update Password'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <Box maxWidth="700px">
            {/* Current Plan Card */}
            <Card sx={{ 
              p: 2.5, 
              mb: 2.5, 
              borderRadius: 2.5, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Payment sx={{ color: '#882AFF', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Current Plan
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Box sx={{ 
                    p: 3, 
                    backgroundColor: '#fafafa', 
                    borderRadius: 2, 
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#882AFF', mb: 1 }}>
                      Free Plan
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                      Basic features included
                    </Typography>
                    <Button 
                      variant="contained" 
                      sx={{ 
                        backgroundColor: '#882AFF',
                        textTransform: 'none',
                        borderRadius: 3,
                        '&:hover': { backgroundColor: '#7C3AED' }
                      }}
                    >
                      Upgrade Plan
                    </Button>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <Box sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                      Plan Features:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2, color: '#6b7280' }}>
                      <li><Typography variant="body2">5 social media accounts</Typography></li>
                      <li><Typography variant="body2">Basic analytics</Typography></li>
                      <li><Typography variant="body2">10 posts per month</Typography></li>
                      <li><Typography variant="body2">Email support</Typography></li>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Card>

            {/* Payment Methods Card */}
            <Card sx={{ 
              p: 2.5, 
              mb: 2.5, 
              borderRadius: 2.5, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Payment Methods
              </Typography>
              
              <Box sx={{ 
                p: 4, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2, 
                border: '2px dashed #e5e7eb',
                textAlign: 'center'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  No payment methods added yet
                </Typography>
                <Button 
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: '#882AFF',
                    color: '#882AFF',
                    '&:hover': {
                      borderColor: '#7C3AED',
                      backgroundColor: 'rgba(136, 42, 255, 0.05)'
                    }
                  }}
                >
                  Add Payment Method
                </Button>
              </Box>
            </Card>

            {/* Billing History */}
            <Card sx={{ 
              p: 3, 
              borderRadius: 3, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Billing History
              </Typography>
              
              <Box sx={{ 
                p: 4, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2, 
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  No billing history available
                </Typography>
              </Box>
            </Card>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <Box maxWidth="700px">
            {socialAccountsLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={24} sx={{ color: '#882AFF' }} />
                <Typography sx={{ mt: 2, color: '#6b7280' }}>
                  Loading social media accounts...
                </Typography>
              </Box>
            ) : (
              <>
                {socialAccounts.length > 0 && (
                  <Card sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f3f4f6',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Connected Accounts
                    </Typography>
                    
                    <Stack spacing={2}>
                      {socialAccounts.map((account) => (
                        account.users.map((user, index) => (
                          <Box
                            key={`${account.id}-${index}`}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              p: 2,
                              backgroundColor: '#f8f9fa',
                              borderRadius: 2,
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <Avatar
                              src={account.icon}
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Avatar
                              src={user.avatar}
                              sx={{ width: 34, height: 34, mr: 2 }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                {account.platform} • {user.username}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={user.status}
                              sx={{
                                color: "#21d548",
                                bgcolor: "white",
                                border: "1px solid #21d548",
                                mr: 2
                              }}
                              icon={<Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  bgcolor: "#21d548",
                                  borderRadius: "50%",
                                }}
                              />}
                            />
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                borderColor: '#882AFF',
                                color: '#882AFF',
                                '&:hover': {
                                  borderColor: '#7625e6',
                                  backgroundColor: 'rgba(136,42,255,0.05)'
                                }
                              }}
                            >
                              Manage
                            </Button>
                          </Box>
                        ))
                      ))}
                    </Stack>
                  </Card>
                )}
                
                <Card sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Connect New Account
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {['Instagram', 'Twitter', 'LinkedIn', 'Facebook'].map((platform) => (
                      <Grid size={{ xs: 12, sm: 6, md: 6 }} key={platform}>
                        <Box sx={{ 
                          p: 3, 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: 2, 
                          border: '2px dashed #e5e7eb',
                          textAlign: 'center',
                          minHeight: 120,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            {platform}
                          </Typography>
                          <Button 
                            variant="outlined"
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: 3,
                              borderColor: '#882AFF',
                              color: '#882AFF',
                              '&:hover': {
                                borderColor: '#7625e6',
                                backgroundColor: 'rgba(136,42,255,0.05)'
                              }
                            }}
                          >
                            Connect Account
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={5}>
          <Box maxWidth="700px">
            <Card sx={{ 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Security sx={{ color: '#882AFF' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Two-Factor Authentication
                </Typography>
              </Box>
              
              <Box sx={{ 
                p: 3, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2, 
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                  Enhance your account security
                </Typography>
                <Button 
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    borderColor: '#882AFF',
                    color: '#882AFF'
                  }}
                >
                  Enable 2FA
                </Button>
              </Box>
            </Card>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={6}>
          <Box maxWidth="700px">
            <Card sx={{ 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}>
              {timezonesLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#882AFF' }} />
                  <Typography sx={{ mt: 2, color: '#6b7280' }}>
                    Loading timezones...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth>
                      <InputLabel>Select Timezone</InputLabel>
                      <Select
                        value={selectedTimezone}
                        onChange={handleTimezoneChange}
                        label="Select Timezone"
                        disabled={updateTimezone.isPending}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&:hover fieldset': {
                              borderColor: '#882AFF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#882AFF',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#882AFF',
                          },
                        }}
                      >
                        {timezonesData?.data?.timezones?.map((timezone) => (
                          <MenuItem key={timezone.name} value={timezone.name}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {timezone.display_name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                UTC {timezone.offset}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {selectedTimezone && (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ 
                        p: 2, 
                        backgroundColor: '#f0f9ff', 
                        borderRadius: 3, 
                        border: '1px solid #bae6fd'
                      }}>
                        <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 500 }}>
                          Current: {selectedTimezone}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </Card>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={7}>
          <Box maxWidth="700px">
            <Card sx={{ 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #fecaca'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Delete sx={{ color: '#dc2626' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#dc2626' }}>
                  Delete Account
                </Typography>
              </Box>
              
              <Box sx={{ 
                p: 3, 
                mb: 3,
                backgroundColor: '#fef2f2', 
                borderRadius: 2, 
                border: '1px solid #fecaca'
              }}>
                <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600, mb: 1 }}>
                  ⚠️ This action cannot be undone
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
                  All your data will be permanently deleted including profile, posts, and analytics.
                </Typography>
              </Box>

              {!showDeleteConfirmation ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setShowDeleteConfirmation(true)}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2
                  }}
                >
                  Delete My Account
                </Button>
              ) : (
                <form onSubmit={handleDeleteAccountSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Enter Password to Confirm"
                        type="password"
                        value={deleteAccountPassword}
                        onChange={(e) => setDeleteAccountPassword(e.target.value)}
                        fullWidth
                        placeholder="Your password"
                        required
                        error={deleteAccount.isError}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '&:hover fieldset': {
                              borderColor: '#dc2626',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#dc2626',
                            },
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#dc2626',
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setShowDeleteConfirmation(false);
                            setDeleteAccountPassword('');
                          }}
                          disabled={deleteAccount.isPending}
                          sx={{
                            textTransform: 'none',
                            borderRadius: 3,
                            borderColor: '#d1d5db',
                            color: '#6b7280'
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="error"
                          disabled={deleteAccount.isPending || !deleteAccountPassword.trim()}
                          sx={{ 
                            textTransform: 'none',
                            borderRadius: 3,
                            backgroundColor: '#dc2626',
                            '&:hover': {
                              backgroundColor: '#b91c1c'
                            }
                          }}
                        >
                          {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Card>
          </Box>
        </TabPanel>
              </Box>
            </Box>
  </Grid>
  </Grid>      
</Box>
          </Grid>
      </Grid>
       
          
      </Box>
    
  );
};

export default SettingPage;