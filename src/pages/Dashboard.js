import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Paper,
  Grid,
  Container,
  Card,
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
  MenuItem,FromControl,TextField,
  styled
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
// import {
//   Dashboard as DashboardIcon,
//   Analytics as AnalyticsIcon,
//   Campaign as CampaignIcon,
//   People as PeopleIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   TrendingUp as TrendingUpIcon,
//   AttachMoney as AttachMoneyIcon,
//   Group as GroupIcon,
//   Assessment as AssessmentIcon,
//   Close as CloseIcon
  
// } from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";

import Sidebar from '../components/Sidebar'


// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a2e',
    },
    secondary: {
      main: '#16213e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const stats = [
  { label: 'Total posts', value: '238', change: '+5.6%' },
  { label: 'Followers gained', value: '12.6K', change: '+1.2%' },
  { label: 'Views', value: '43.8K', change: '-1.6%' },
  { label: 'Engagement', value: '6.8%', change: '+5.6%' }
];

const chartCards = [
  { label: 'Followers growth', change: '+21%', type: 'bar' },
  { label: 'Followers', change: '+21%', type: 'bar' },
  { label: 'Engagement Rate', change: '+21%', type: 'line' }
];

const topPosts = [
  { name: 'David', engagement: '27.8K', views: '3.1K', clicks: 286 },
  { name: 'Sarah', engagement: '21.0K', views: '1.1K', clicks: 191 },
  { name: 'Mike', engagement: '17.8K', views: '4.1K', clicks: 126 },
  { name: 'Thomas', engagement: '37.4K', views: '7.8K', clicks: 582 },
  { name: 'Klaus', engagement: '26.9K', views: '3.1K', clicks: 286 }
];

const Dashboard = () => {


  return (
    <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100%' }} >
    <Grid container>
      <Grid size={{ md: 1 }}> <Sidebar/></Grid>
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
                  Dashboard
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
        <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2, // spacing between items
                alignItems: 'center',bgcolor: '#B1C6FF',padding: '15px',
              }}>
                    
                <TextField size="small" variant="outlined" placeholder="Search" />
              
                <TextField select size="small" defaultValue="last_7_days">
                  <MenuItem value="last_7_days">Last 7 days</MenuItem>
                  <MenuItem value="last_30_days">Last 30 days</MenuItem>
                </TextField>
               
              </Box>
      <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 2, sm: 4, md: 12 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', }}>
          
          </Grid>
          </Grid>
          </Box>
          </Grid>
          </Grid>
          </Box>
          
  );
};

export default Dashboard;