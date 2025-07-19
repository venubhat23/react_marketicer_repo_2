import React,{useState} from 'react';
import { AppBar, Toolbar, IconButton,Typography, Box,Paper, Button, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { useAuth } from "../authContext/AuthContext";

const Navbar = () => {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user, login } = useAuth();
  const [roleMenuAnchor, setRoleMenuAnchor] = useState(null);

  const handleRoleMenuOpen = (event) => {
    setRoleMenuAnchor(event.currentTarget);
  };

  const handleRoleMenuClose = () => {
    setRoleMenuAnchor(null);
  };

  const handleRoleChange = (role) => {
    const token = localStorage.getItem('token') || 'demo-token';
    login(token, role);
    handleRoleMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Analytics', icon: <AnalyticsIcon /> },
    { text: 'Campaigns', icon: <CampaignIcon /> },
    { text: 'Audience', icon: <PeopleIcon /> },
    { text: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
 
    <>
    <AppBar
      position="fixed"
      sx={{
        display: { md: 'none' },
        backgroundColor: '#1a1a2e',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          //onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          knkjnkn
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    
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
        <Paper
          elevation={0}
          sx={{
            display: { xs: 'none', md: 'block' },
            p: 3,
            backgroundColor: 'white',
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
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              jhikjhnoikj
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                color="inherit"
                onClick={handleRoleMenuOpen}
                sx={{ 
                  textTransform: 'none',
                  bgcolor: '#882AFF',
                  color: 'white',
                  '&:hover': { bgcolor: '#6a1b9a' }
                }}
              >
                Role: {user?.role || 'influencer'}
              </Button>
              <Menu
                anchorEl={roleMenuAnchor}
                open={Boolean(roleMenuAnchor)}
                onClose={handleRoleMenuClose}
              >
                <MenuItem onClick={() => handleRoleChange('influencer')}>Influencer</MenuItem>
                <MenuItem onClick={() => handleRoleChange('brand')}>Brand</MenuItem>
                <MenuItem onClick={() => handleRoleChange('admin')}>Admin</MenuItem>
              </Menu>
              <IconButton size="large">
                <NotificationsIcon />
              </IconButton>
              <IconButton size="large">
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box></>

  );
};

export default Navbar;
