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
          <Typography variant="body1" color="text.primary">
            {children}
          </Typography>
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
        <Typography variant="h6" gutterBottom>
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
                />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12} textAlign="right">
                {!personalEditMode ? (
                    <Button variant="outlined" onClick={() => setPersonalEditMode(true)}>
                    Edit
                    </Button>
                ) : (
                    <Button 
                      variant="contained" 
                      onClick={handlePersonalSave}
                      disabled={updatePersonalInfo.isPending}
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
              />
              </Grid>

              <Grid item xs={12} textAlign="right">
              {!companyEditMode ? (
                  <Button variant="outlined" onClick={() => setCompanyEditMode(true)}>
                  Edit
                  </Button>
              ) : (
                  <Button 
                    variant="contained" 
                    onClick={handleCompanySave}
                    disabled={updateCompanyDetails.isPending}
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
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="small"
                  disabled={changePassword.isPending}
                  sx={{ backgroundColor: '#7E22CE' }} // Purple color as in image
                >
                  {changePassword.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </Grid>
            </Grid>
          </form>
          </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <Typography>Payment details go here</Typography>
        </TabPanel>
        <TabPanel value={selectedTab} index={4}>
          <Typography>Social media linking options</Typography>
        </TabPanel>
        <TabPanel value={selectedTab} index={5}>
          <Typography>Enable 2FA options</Typography>
        </TabPanel>
        <TabPanel value={selectedTab} index={6}>
          <Box maxWidth="600px">
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="primary" />
              Timezone Settings
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Set your timezone to ensure accurate time display across the platform.
            </Typography>

            {timezonesLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <Typography>Loading timezones...</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 8, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Timezone</InputLabel>
                    <Select
                      value={selectedTimezone}
                      onChange={handleTimezoneChange}
                      label="Select Timezone"
                      disabled={updateTimezone.isPending}
                    >
                      {timezonesData?.data?.timezones?.map((timezone) => (
                        <MenuItem key={timezone.name} value={timezone.name}>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {timezone.display_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Offset: {timezone.offset}
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
                      p: 2, 
                      backgroundColor: 'primary.50', 
                      borderRadius: 1, 
                      border: '1px solid',
                      borderColor: 'primary.200'
                    }}>
                      <Typography variant="body2" color="primary.main">
                        <strong>Current Timezone:</strong> {selectedTimezone}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Changes are saved automatically
                      </Typography>
                    </Box>
                  )}
                </Grid>

                {updateTimezone.isPending && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Updating timezone...
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
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        disabled={deleteAccount.isPending || !deleteAccountPassword.trim()}
                        sx={{ minWidth: 120 }}
                      >
                        {deleteAccount.isPending ? (
                          <>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
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