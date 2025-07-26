import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Description as ContractIcon,
  Store as MarketplaceIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Notifications,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
    handleClose();
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      roles: ['admin', 'influencer', 'brand'],
    },
    {
      label: 'Create Post',
      path: '/createPost',
      icon: <AddIcon />,
      roles: ['admin', 'influencer', 'brand'],
    },
    {
      label: 'Analytics',
      path: '/instagram-analytics',
      icon: <AnalyticsIcon />,
      roles: ['admin', 'influencer', 'brand'],
    },
    {
      label: 'Contracts',
      path: '/contracts',
      icon: <ContractIcon />,
      roles: ['admin', 'influencer', 'brand'],
    },
    {
      label: 'Marketplace',
      path: '/marketplace',
      icon: <MarketplaceIcon />,
      roles: ['admin', 'influencer', 'brand'],
    },
    {
      label: 'Discover',
      path: '/discover',
      icon: <PeopleIcon />,
      roles: ['admin', 'brand'],
    },
  ];

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    const userRole = user?.role?.toLowerCase();
    return item.roles.includes(userRole);
  });

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Mobile Menu Drawer
  const mobileMenu = (
    <Drawer
      anchor="top"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          top: 64, // Below the AppBar
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {filteredNavItems.map((item) => (
            <ListItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor: isActiveRoute(item.path) ? '#f0f0f0' : 'transparent',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#091a48' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  color: '#091a48',
                  '& .MuiListItemText-primary': {
                    fontWeight: isActiveRoute(item.path) ? 600 : 400,
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1201, // Higher than sidebar
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
              alt="Marketincer logo"
              width={32}
              height={24}
              style={{ marginRight: '12px' }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#091a48', 
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Marketincer
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            gap: 1
          }}>
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: isActiveRoute(item.path) ? '#6366f1' : '#091a48',
                  textTransform: 'none',
                  fontWeight: isActiveRoute(item.path) ? 600 : 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActiveRoute(item.path) ? '#f0f0ff' : 'transparent',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    color: '#6366f1',
                  },
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ mr: 1, display: 'flex' }}>
                  {item.icon}
                </Box>
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right side - Mobile menu, User menu and notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{ color: '#091a48', display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <IconButton 
              sx={{ color: '#091a48' }}
              aria-label="notifications"
            >
              <Notifications />
            </IconButton>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: '#091a48' }}
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/settingPage'); handleClose(); }}>
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      {mobileMenu}
    </>
  );
};

export default TopBar;