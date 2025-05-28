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
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';

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

      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box
          component="nav"
          sx={{ 
            width: { md: '6.333%' }, 
            minWidth: { md: '80px' },
            flexShrink: 0 
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content - 11/12 */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            width: { md: '91.667%' },
            backgroundColor: 'background.default',
            mt: { xs: 8, md: 0 }
          }}
        >
          {/* Desktop Header */}
          <Navbar/>

          {/* Content Container */}
          <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={3}>
              {/* Main Content Placeholder */}
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Main Content Area
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    This layout uses Material-UI Grid system with:
                  </Typography>
                  <Box component="ul" sx={{ 
                    mt: 2, 
                    pl: 3,
                    '& li': { mb: 1 }
                  }}>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Sidebar: 1 column (8.333% width, min-width: 240px)
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Main content: 11 columns (91.667% width)
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Responsive design with mobile drawer
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Dark themed sidebar with Material-UI components
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Stat Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Growth
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      +23%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AttachMoneyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      $45.2K
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <GroupIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Users
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      1,234
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AssessmentIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      Analytics
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      89%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Content Area */}
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 4, minHeight: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Content Goes Here
                  </Typography>
                  <Box 
                    sx={{ 
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 4, 
                      textAlign: 'center',
                      bgcolor: 'grey.50'
                    }}
                  >
                    <Typography color="text.secondary">
                      Replace this section with your actual content components.
                      The grid system is ready for your implementation.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
  );
};

export default Dashboard;