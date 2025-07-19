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
  CircularProgress, // Add this import
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
    const [editMode, setEditMode] = useState(true);
    const [personalFormData, setPersonalFormData] = useState({
        firstName: 'Olivia',
        lastName: 'Rhye',
        email: 'olivia@untitledu.com',
        phoneCode: 'US',
        phoneNumber: '',
        bio: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonalFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleSave = () => {
        console.log('Saved data:', personalFormData);
        setEditMode(false);
      };

      const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    
      const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Password Updated:', formData);
        // Add validation or API call here
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
                src="https://randomuser.me/api/portraits/women/65.jpg"
                sx={{ width: 80, height: 80 }}
            />
            </Grid>

            {/* First Name */}
            <Grid size={{ xs: 2, sm: 4, md: 4 }} >
            <TextField
                label="First Name"
                name="firstName"
                value={personalFormData.firstName}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
            />
            </Grid>

            {/* Last Name */}
            <Grid size={{ xs: 2, sm: 4, md: 4 }} >
            <TextField
                label="Last Name"
                name="lastName"
                value={personalFormData.lastName}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
            />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 2, sm: 4, md: 4 }} >
            <TextField
                label="Email"
                name="email"
                value={personalFormData.email}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
            />
            </Grid>

            {/* Phone */}
            <Grid size={{ xs: 2, sm: 4, md: 4 }} >
            <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                name="phoneCode"
                value={personalFormData.phoneCode}
                label="Country"
                onChange={handleChange}
                disabled={!editMode}
                >
                {countryCodes.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                    {country.code}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 4 }} >
            <TextField
                label="Phone Number"
                name="phoneNumber"
                value={personalFormData.phoneNumber}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
            />
            </Grid>

            {/* Bio */}
            <Grid size={{ xs: 2, sm: 12, md: 12 }} >
            <TextField
                label="Bio"
                name="bio"
                value={personalFormData.bio}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={4}
                disabled={!editMode}
            />
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} textAlign="right">
            {!editMode ? (
                <Button variant="outlined" onClick={() => setEditMode(true)}>
                Edit
                </Button>
            ) : (
                <Button variant="contained" onClick={handleSave}>
                Save Changes
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
                label="Name"
                name="name"
                //value={formData.name}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
            />
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <TextField
                label="GST Name"
                name="gstName"
                //value={formData.gstName}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                placeholder="Enter your GST Name"
            />
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <TextField
                label="GST Number"
                name="gstNumber"
                //value={formData.gstNumber}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                placeholder="XXX XXXX XXXX"
            />
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <FormControl fullWidth>
                <InputLabel>Code</InputLabel>
                <Select
                name="phoneCode"
                //value={formData.phoneCode}
                onChange={handleChange}
                disabled={!editMode}
                >
                {countryCodes.map((item) => (
                    <MenuItem key={item.code} value={item.code}>
                    {item.code}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <TextField
                label="Phone Number"
                name="phoneNumber"
                //value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                placeholder="+1 (555) 000-0000"
            />
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <TextField
                label="Company Address"
                name="address"
                //value={formData.address}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                placeholder="Enter your Address"
            />
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <TextField
                label="Website"
                name="website"
                //value={formData.website}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
                placeholder="http://"
            />
            </Grid>

            <Grid size={{ xs: 2, sm: 6, md: 6 }} >
            <TextField
                label="Email"
                name="email"
                //value={formData.email}
                onChange={handleChange}
                fullWidth
                disabled={!editMode}
            />
            </Grid>

            <Grid item xs={12} textAlign="right">
            {!editMode ? (
                <Button variant="outlined" onClick={() => setEditMode(true)}>
                Edit
                </Button>
            ) : (
                <Button variant="contained" onClick={handleSave}>
                Save Changes
                </Button>
            )}
            </Grid>
      </Grid>
    </Box>
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <Box>
          <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Enter current password"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Enter new password"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Confirm New Password"
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handlePasswordChange}
              fullWidth
              placeholder="Confirm new password"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ backgroundColor: '#7E22CE' }} // Purple color as in image
            >
              Update Password
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