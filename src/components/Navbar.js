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
    
    // Force clear and set
    localStorage.removeItem('userRole');
    localStorage.setItem('userRole', role);
    localStorage.setItem('token', token);
    
    login(token, role);
    
    // Force a page reload to ensure everything updates
    setTimeout(() => {
      window.location.reload();
    }, 100);
    
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
              {/* Debug: Manual Role Setter */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  localStorage.setItem('userRole', 'admin');
                  localStorage.setItem('token', 'admin-token');
                  window.location.reload();
                }}
                sx={{ 
                  color: 'red', 
                  borderColor: 'red',
                  fontSize: '10px',
                  minWidth: 'auto',
                  px: 1
                }}
              >
                Force Admin
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  localStorage.setItem('userRole', 'brand');
                  localStorage.setItem('token', 'brand-token');
                  window.location.reload();
                }}
                sx={{ 
                  color: 'blue', 
                  borderColor: 'blue',
                  fontSize: '10px',
                  minWidth: 'auto',
                  px: 1
                }}
              >
                Force Brand
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  localStorage.setItem('userRole', 'influencer');
                  localStorage.setItem('token', 'influencer-token');
                  window.location.reload();
                }}
                sx={{ 
                  color: 'green', 
                  borderColor: 'green',
                  fontSize: '10px',
                  minWidth: 'auto',
                  px: 1
                }}
              >
                Force Influencer
              </Button>
              
              <Button
                color="inherit"
                onClick={handleRoleMenuOpen}
                sx={{ 
                  textTransform: 'none',
                  bgcolor: '#882AFF',
                  color: 'white',
                  '&:hover': { bgcolor: '#6a1b9a' },
                  minWidth: '150px'
                }}
              >
                Current Role: {user?.role || 'No Role'}
              </Button>
              <Menu
                anchorEl={roleMenuAnchor}
                open={Boolean(roleMenuAnchor)}
                onClose={handleRoleMenuClose}
              >
                <MenuItem 
                  onClick={() => handleRoleChange('admin')}
                  sx={{ bgcolor: user?.role === 'admin' ? '#e3f2fd' : 'transparent' }}
                >
                  Admin {user?.role === 'admin' && '✓'}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleRoleChange('brand')}
                  sx={{ bgcolor: user?.role === 'brand' ? '#e3f2fd' : 'transparent' }}
                >
                  Brand {user?.role === 'brand' && '✓'}
                </MenuItem>
                <MenuItem 
                  onClick={() => handleRoleChange('influencer')}
                  sx={{ bgcolor: user?.role === 'influencer' ? '#e3f2fd' : 'transparent' }}
                >
                  Influencer {user?.role === 'influencer' && '✓'}
                </MenuItem>
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
