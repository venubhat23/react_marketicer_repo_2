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
  } from '@mui/icons-material';

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
          toast.success('Password updated successfully');
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
            
            <Box display="flex" sx={{ height: '100%' }}>
              {/* Sidebar Tabs */}
      
              <Tabs
                orientation="vertical"
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                aria-label="Settings Tabs"
                variant="scrollable"
                scrollButtons={false} 
                sx={{
                    width: '250px',
                    height: '100%',
                    backgroundColor: '#1B357C', // Updated main background color
                  '.MuiTab-root': {
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    textTransform: 'none',
                    color: '#B8C5E8', // Light blue-gray text for inactive tabs
                    backgroundColor: 'transparent',
                    padding: '12px 16px',
                    margin: '2px 4px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#E8EEFF',
                    }
                  },
                  '.Mui-selected': {
                    backgroundColor: '#2D3F7A !important', // Darker blue for selected tab
                    color: '#FFFFFF !important', // White text for selected tab
                    fontWeight: 600,
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                  },
                  '.MuiTabs-indicator': {
                    display: 'none', // Hide the default indicator
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

      

      {/* Right Panel */}
      <Box flexGrow={1} p={3} sx={{ height: '100%', overflow: 'auto' }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            fontSize: '22px', 
            color: '#1a1a1a',
            letterSpacing: '-0.025em',
            mb: 3
          }}
        >
          {tabData[selectedTab].label}
        </Typography>

        <TabPanel value={selectedTab} index={0}>
          <Box maxWidth="600px">

            <Grid container spacing={2} alignItems="center">
                {/* Avatar */}
                <Grid size={{ xs: 2, sm: 4, md: 4 }} >
                <Avatar
                    alt="Profile"
                    src={personalFormData.avatar_url || "https://randomuser.me/api/portraits/women/65.jpg"}
                    sx={{ width: 80, height: 80 }}
                />
                </Grid>

                {/* First Name */}
                <Grid size={{ xs: 2, sm: 4, md: 4 }} >
                <TextField
                    label="First Name"
                    name="first_name"
                    value={personalFormData.first_name}
                    onChange={handlePersonalChange}
                    fullWidth
                    size="small"
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '14px'
                      }
                    }}
                />
                </Grid>

                {/* Last Name */}
                <Grid size={{ xs: 2, sm: 4, md: 4 }} >
                <TextField
                    label="Last Name"
                    name="last_name"
                    value={personalFormData.last_name}
                    onChange={handlePersonalChange}
                    fullWidth
                    size="small"
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '14px'
                      }
                    }}
                />
                </Grid>

                {/* Email */}
                <Grid size={{ xs: 2, sm: 4, md: 4 }} >
                <TextField
                    label="Email"
                    name="email"
                    value={personalFormData.email}
                    onChange={handlePersonalChange}
                    fullWidth
                    size="small"
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '14px'
                      }
                    }}
                />
                </Grid>

                {/* Phone */}
                <Grid size={{ xs: 2, sm: 4, md: 4 }} >
                <TextField
                    label="Phone Number"
                    name="phone_number"
                    value={personalFormData.phone_number}
                    onChange={handlePersonalChange}
                    fullWidth
                    size="small"
                    disabled={!personalEditMode}
                    placeholder="+1 (555) 000-0000"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '14px'
                      }
                    }}
                />
                </Grid>

                {/* Avatar URL */}
                <Grid size={{ xs: 2, sm: 4, md: 4 }} >
                <TextField
                    label="Avatar URL"
                    name="avatar_url"
                    value={personalFormData.avatar_url}
                    onChange={handlePersonalChange}
                    fullWidth
                    size="small"
                    disabled={!personalEditMode}
                    placeholder="https://example.com/avatar.jpg"
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '14px'
                      }
                    }}
                />
                </Grid>

                {/* Bio */}
                <Grid size={{ xs: 2, sm: 12, md: 12 }} >
                <TextField
                    label="Bio"
                    name="bio"
                    value={personalFormData.bio}
                    onChange={handlePersonalChange}
                    fullWidth
                    size="small"
                    multiline
                    minRows={4}
                    disabled={!personalEditMode}
                    sx={{
                      '& .MuiInputLabel-root': {
                        fontSize: '14px',
                        fontWeight: 500
                      },
                      '& .MuiInputBase-input': {
                        fontSize: '14px'
                      }
                    }}
                />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12} textAlign="right">
                {!personalEditMode ? (
                    <Button 
                      variant="outlined" 
                      onClick={() => setPersonalEditMode(true)}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderColor: '#8B5CF6',
                        color: '#8B5CF6',
                        '&:hover': {
                          borderColor: '#7C3AED',
                          backgroundColor: '#f3f4f6'
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                ) : (
                    <Button 
                      variant="contained" 
                      onClick={handlePersonalSave}
                      disabled={updatePersonalInfo.isPending}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        backgroundColor: '#8B5CF6',
                        '&:hover': {
                          backgroundColor: '#7C3AED'
                        }
                      }}
                    >
                      {updatePersonalInfo.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                )}
                </Grid>
            </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Box maxWidth="600px" >
      

          <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 6, md: 6 }}>
              <TextField
                  label="Company Name"
                  name="company_name"
                  value={companyFormData.company_name}
                  onChange={handleCompanyChange}
                  fullWidth
                  size="small"
                  disabled={!companyEditMode}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
              />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 6 }} >
              <TextField
                  label="GST Name"
                  name="gst_name"
                  value={companyFormData.gst_name}
                  onChange={handleCompanyChange}
                  fullWidth
                  size="small"
                  disabled={!companyEditMode}
                  placeholder="Enter your GST Name"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
              />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 6 }} >
              <TextField
                  label="GST Number"
                  name="gst_number"
                  value={companyFormData.gst_number}
                  onChange={handleCompanyChange}
                  fullWidth
                  size="small"
                  disabled={!companyEditMode}
                  placeholder="XXX XXXX XXXX"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
              />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 6 }} >
              <TextField
                  label="Company Phone"
                  name="company_phone"
                  value={companyFormData.company_phone}
                  onChange={handleCompanyChange}
                  fullWidth
                  size="small"
                  disabled={!companyEditMode}
                  placeholder="+1 (555) 000-0000"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
              />
              </Grid>

              <Grid size={{ xs: 2, sm: 12, md: 12 }} >
              <TextField
                  label="Company Address"
                  name="company_address"
                  value={companyFormData.company_address}
                  onChange={handleCompanyChange}
                  fullWidth
                  size="small"
                  disabled={!companyEditMode}
                  placeholder="Enter your Address"
                  multiline
                  minRows={3}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
              />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 6 }} >
              <TextField
                  label="Website"
                  name="company_website"
                  value={companyFormData.company_website}
                  onChange={handleCompanyChange}
                  fullWidth
                  size="small"
                  disabled={!companyEditMode}
                  placeholder="https://www.example.com"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
              />
              </Grid>

              <Grid item xs={12} textAlign="right">
              {!companyEditMode ? (
                  <Button 
                    variant="outlined" 
                    onClick={() => setCompanyEditMode(true)}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      borderColor: '#8B5CF6',
                      color: '#8B5CF6',
                      '&:hover': {
                        borderColor: '#7C3AED',
                        backgroundColor: '#f3f4f6'
                      }
                    }}
                  >
                    Edit Company Details
                  </Button>
              ) : (
                  <Button 
                    variant="contained" 
                    onClick={handleCompanySave}
                    disabled={updateCompanyDetails.isPending}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      textTransform: 'none',
                      backgroundColor: '#8B5CF6',
                      '&:hover': {
                        backgroundColor: '#7C3AED'
                      }
                    }}
                  >
                    {updateCompanyDetails.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
              )}
              </Grid>
        </Grid>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <Box maxWidth="600px">
          <form onSubmit={handlePasswordSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 6, md: 6 }} >
                <TextField
                  label="Current Password"
                  type="password"
                  name="current_password"
                  value={passwordFormData.current_password}
                  onChange={handlePasswordChange}
                  fullWidth
                  size="small"
                  placeholder="Enter current password"
                  required
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 6 }}>
                <TextField
                  label="New Password"
                  type="password"
                  name="new_password"
                  value={passwordFormData.new_password}
                  onChange={handlePasswordChange}
                  fullWidth
                  size="small"
                  placeholder="Enter new password"
                  required
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 6 }}>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  name="confirm_password"
                  value={passwordFormData.confirm_password}
                  onChange={handlePasswordChange}
                  fullWidth
                  size="small"
                  placeholder="Confirm new password"
                  required
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      fontWeight: 500
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="medium"
                  disabled={changePassword.isPending}
                  sx={{ 
                    backgroundColor: '#8B5CF6',
                    fontSize: '14px',
                    fontWeight: 500,
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#7C3AED'
                    }
                  }}
                >
                  {changePassword.isPending ? 'Updating Password...' : 'Update Password'}
                </Button>
              </Grid>
            </Grid>
          </form>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <Box maxWidth="700px">
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 1
                }}
              >
                <Payment sx={{ color: '#8B5CF6', fontSize: '20px' }} />
                Subscription & Payment
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 3 
                }}
              >
                Manage your subscription plan and payment methods.
              </Typography>
            </Box>
            
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
                Payment and subscription management features coming soon.
              </Typography>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <Box maxWidth="700px">
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 1
                }}
              >
                <Share sx={{ color: '#8B5CF6', fontSize: '20px' }} />
                Social Media Accounts
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 3 
                }}
              >
                Connect and manage your social media accounts for seamless posting.
              </Typography>
            </Box>
            
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
                Social media account management features coming soon.
              </Typography>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={5}>
          <Box maxWidth="700px">
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 1
                }}
              >
                <Security sx={{ color: '#8B5CF6', fontSize: '20px' }} />
                Two-step Verification
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 3 
                }}
              >
                Add an extra layer of security to your account with two-factor authentication.
              </Typography>
            </Box>
            
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
                Two-factor authentication setup coming soon.
              </Typography>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={6}>
          <Box maxWidth="700px">
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 1
                }}
              >
                <AccessTime sx={{ color: '#8B5CF6', fontSize: '20px' }} />
                Timezone Settings
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  lineHeight: 1.5,
                  mb: 3 
                }}
              >
                Configure your timezone to ensure accurate scheduling and time display across all features.
              </Typography>
            </Box>

            {timezonesLoading ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 3,
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e5e7eb'
              }}>
                <CircularProgress size={20} sx={{ color: '#8B5CF6' }} />
                <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                  Loading available timezones...
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 10, md: 8 }}>
                  <FormControl fullWidth>
                    <InputLabel 
                      sx={{ 
                        fontSize: '14px',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: '#8B5CF6'
                        }
                      }}
                    >
                      Select Timezone
                    </InputLabel>
                    <Select
                      value={selectedTimezone}
                      onChange={handleTimezoneChange}
                      label="Select Timezone"
                      disabled={updateTimezone.isPending}
                      sx={{
                        fontSize: '14px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8B5CF6'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#8B5CF6',
                          borderWidth: '2px'
                        }
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            borderRadius: 2,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb',
                            mt: 1
                          }
                        }
                      }}
                    >
                      {timezonesData?.data?.timezones?.map((timezone) => (
                        <MenuItem 
                          key={timezone.name} 
                          value={timezone.name}
                          sx={{
                            py: 1.5,
                            px: 2,
                            '&:hover': {
                              backgroundColor: '#f3f4f6'
                            },
                            '&.Mui-selected': {
                              backgroundColor: '#ede9fe',
                              '&:hover': {
                                backgroundColor: '#ddd6fe'
                              }
                            }
                          }}
                        >
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '14px',
                                color: '#1f2937',
                                mb: 0.5
                              }}
                            >
                              {timezone.display_name}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#6b7280',
                                fontSize: '12px'
                              }}
                            >
                              UTC {timezone.offset}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  {selectedTimezone && (
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: '#f0f9ff', 
                      borderRadius: 2, 
                      border: '1px solid #bae6fd'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#0369a1',
                          fontSize: '14px',
                          fontWeight: 500,
                          mb: 0.5
                        }}
                      >
                        Current Timezone: {selectedTimezone}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#0284c7',
                          fontSize: '12px'
                        }}
                      >
                        All scheduling and time displays will use this timezone
                      </Typography>
                    </Box>
                  )}
                </Grid>

                {updateTimezone.isPending && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      backgroundColor: '#fef3c7',
                      borderRadius: 2,
                      border: '1px solid #fcd34d'
                    }}>
                      <CircularProgress size={16} sx={{ color: '#d97706' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#92400e',
                          fontSize: '14px',
                          fontWeight: 500
                        }}
                      >
                        Updating timezone preferences...
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={7}>
          <Box maxWidth="600px">
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
              <Delete color="error" />
              Delete Account
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>

            {/* Warning Box */}
            <Box sx={{ 
              p: 2, 
              mb: 3,
              backgroundColor: 'error.50', 
              borderRadius: 1, 
              border: '1px solid',
              borderColor: 'error.200'
            }}>
              <Typography variant="body2" color="error.main" fontWeight="medium" gutterBottom>
                ⚠️ Warning: This action is irreversible
              </Typography>
              <Typography variant="body2" color="error.dark">
                Deleting your account will permanently remove:
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                <li><Typography variant="body2" color="error.dark">User profile and personal information</Typography></li>
                <li><Typography variant="body2" color="error.dark">All marketplace posts and bids</Typography></li>
                <li><Typography variant="body2" color="error.dark">All short URLs and analytics</Typography></li>
                <li><Typography variant="body2" color="error.dark">All associated data</Typography></li>
              </Box>
            </Box>

            {!showDeleteConfirmation ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setShowDeleteConfirmation(true)}
                sx={{ mb: 2 }}
              >
                I want to delete my account
              </Button>
            ) : (
              <form onSubmit={handleDeleteAccountSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Please enter your password to confirm account deletion:
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 8, md: 6 }}>
                    <TextField
                      label="Password"
                      type="password"
                      value={deleteAccountPassword}
                      onChange={(e) => setDeleteAccountPassword(e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="Enter your password"
                      required
                      error={deleteAccount.isError}
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '14px',
                          fontWeight: 500
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '14px'
                        }
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowDeleteConfirmation(false);
                          setDeleteAccountPassword('');
                        }}
                        disabled={deleteAccount.isPending}
                        sx={{
                          fontSize: '14px',
                          fontWeight: 500,
                          textTransform: 'none',
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
                        type="submit"
                        variant="contained"
                        color="error"
                        disabled={deleteAccount.isPending || !deleteAccountPassword.trim()}
                        sx={{ 
                          minWidth: 120,
                          fontSize: '14px',
                          fontWeight: 500,
                          textTransform: 'none',
                          backgroundColor: '#dc2626',
                          '&:hover': {
                            backgroundColor: '#b91c1c'
                          }
                        }}
                      >
                        {deleteAccount.isPending ? (
                          <>
                            <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                            Deleting...
                          </>
                        ) : (
                          'Delete Account'
                        )}
                      </Button>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      This action cannot be undone. Your account will be permanently deleted.
                    </Typography>
                  </Grid>
                </Grid>
              </form>
            )}
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