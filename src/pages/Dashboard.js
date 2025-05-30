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
  styled
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon
  
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

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

// Styled components
// const StyledDrawer = styled(Drawer)(({ theme }) => ({
//   '& .MuiDrawer-paper': {
//     backgroundColor: '#1a1a2e',
//     color: '#ffffff',
//     borderRight: 'none',
//   },
// }));

// const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
//   borderRadius: theme.spacing(1),
//   margin: theme.spacing(0.5, 1),
//   '&:hover': {
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   '&.Mui-selected': {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     '&:hover': {
//       backgroundColor: 'rgba(255, 255, 255, 0.25)',
//     },
//   },
// }));

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
      <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 2, sm: 4, md: 12 }} spacing={2} sx={{ padding:'10px', bgcolor: '#fff', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', }}>
          <Typography variant="h6" align='center'>Welcome to Dashboard !!</Typography>
          </Grid>
          </Grid>
          </Box>
          </Grid>
          </Grid>
          </Box>
          
  );
};

export default Dashboard;