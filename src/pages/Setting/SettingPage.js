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
  Select,
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
  useChangePassword 
} from '../../hooks/useSettings';


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
        sx={{ flexGrow: 1, p: 3, minHeight: '300px' }}
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

    // Load data from API when available
    useEffect(() => {
      if (settingsData?.data) {
        const { personal_information, company_details } = settingsData.data;
        
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
        } catch (error) {
          // Error is handled by the hook
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
        } catch (error) {
          // Error is handled by the hook
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
        } catch (error) {
          // Error is handled by the hook
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
      <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, height: '100vh', overflow: 'hidden !important', padding:'10px'}}>
        <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden !important' }}>
          <Grid size={{ xs: 6, sm: 12, md:12 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)' ,height:'100%' }}>
            
            <Box display="flex" sx={{ minHeight: '100vh' }}>
      {/* Sidebar Tabs */}
      <Paper elevation={3} >
        <Tabs
          orientation="vertical"
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          aria-label="Settings Tabs"
          variant="scrollable"
          sx={{
            //height: '100%',
            '.MuiTab-root': {
              justifyContent: 'flex-start',
              alignItems: 'center',
              px: 3,
              py: 2,
              textTransform: 'none',
              fontWeight: 500,
              color: '#fff',
              width:'250px',
              backgroundColor:'#1B357C'
            },
            '.Mui-selected': {
              backgroundColor: '#f5f5f5',
              color: 'primary.main',
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
      </Paper>

      {/* Right Panel */}
      <Box flexGrow={1} p={3}>
        <Typography variant="h6" gutterBottom>
          {tabData[selectedTab].label}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <TabPanel value={selectedTab} index={0}>
          <Box p={3} >

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
        <Box p={3} maxWidth="800px" mx="auto">
    

        <Grid container spacing={2}>
            <Grid size={{ xs: 2, sm: 6, md: 6 }}>
            <TextField
                label="Company Name"
                name="company_name"
                value={companyFormData.company_name}
                onChange={handleCompanyChange}
                fullWidth
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
          <Box p={3} maxWidth="600px" mx="auto">
          <form onSubmit={handlePasswordSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Current Password"
              type="password"
              name="current_password"
              value={passwordFormData.current_password}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Enter current password"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="New Password"
              type="password"
              name="new_password"
              value={passwordFormData.new_password}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Enter new password"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Confirm New Password"
              type="password"
              name="confirm_password"
              value={passwordFormData.confirm_password}
              onChange={handlePasswordChange}
              fullWidth
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
          <Typography>Timezone selection dropdown</Typography>
        </TabPanel>
        <TabPanel value={selectedTab} index={7}>
          <Typography>Delete account confirmation</Typography>
        </TabPanel>
      </Box>
    </Box>

              {/* User Chips */}

              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>

                

              </Box>

              

        

                
          </Grid>
        </Grid>
          
      </Box>
          
      </Box>
    </Layout>
  );
};

export default SettingPage;