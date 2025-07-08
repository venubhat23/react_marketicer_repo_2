import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  ListItemButton,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

import {
  People,
} from '@mui/icons-material';

import MessageSquareIcon from "@mui/icons-material/Message";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from '@mui/icons-material/Description';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Link, useNavigate } from "react-router-dom";
import LanguageIcon from '@mui/icons-material/Language';

const footerItems = [
  { icon: <MessageSquareIcon />, active: true },
  { icon: <SettingsIcon />, active: true },
];

const Sidebar = ({ isOpen = true, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();      // Clear local storage
    sessionStorage.clear();    // Clear session storage (optional)
    navigate("/login");        // Redirect to login page
  };

  const menuItems = [
    { 
      icon: <AddCircleOutlineIcon fontSize="medium" />, 
      text: 'Create Posts', 
      path: '/createPost', 
      visible: true 
    },
    { 
      icon: <AppsIcon fontSize="medium" />, 
      text: 'Dashboard', 
      path: '/dashboard', 
      visible: false 
    },
    { 
      icon: <LanguageIcon fontSize="medium" />, 
      text: 'Discover', 
      path: '/discover', 
      visible: false 
    },
    { 
      icon: <EqualizerIcon fontSize="medium" />, 
      text: 'Analytics', 
      path: '/analytics', 
      visible: true 
    },
    { 
      icon: <TrendingUpIcon fontSize="medium" />, 
      text: 'Analytics 2', 
      path: '/instagram-analytics', 
      visible: true 
    },
    { 
      icon: <People fontSize="medium" />, 
      text: 'Social Media', 
      path: '/socialMedia', 
      visible: true 
    },
    { 
      icon: <DescriptionIcon fontSize="medium" />, 
      text: 'Contracts', 
      path: '/contracts', 
      visible: true 
    },
    { 
      icon: <StorefrontIcon fontSize="medium" />, 
      text: 'Marketplace', 
      path: '/marketplace', 
      visible: true 
    },
  ];

  const renderMenuItem = (item) => {
    if (!item.visible) return null;

    const content = (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isOpen ? 'column' : 'column', 
        alignItems: 'center', 
        color: '#cbaef7',
        width: '100%',
        py: isOpen ? 1 : 1.5,
      }}>
        {item.icon}
        {isOpen && (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '12px', 
              whiteSpace: 'nowrap',
              mt: 0.5,
              opacity: 1,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            {item.text}
          </Typography>
        )}
      </Box>
    );

    return (
      <ListItem key={item.path} disablePadding>
        <Tooltip title={!isOpen ? item.text : ''} placement="right">
          <ListItemButton sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            minHeight: isOpen ? 'auto' : 56,
            '&:hover': {
              bgcolor: 'rgba(203, 174, 247, 0.1)',
              transform: 'translateX(2px)',
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <Link to={item.path} style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
              {content}
            </Link>
          </ListItemButton>
        </Tooltip>
      </ListItem>
    );
  };

  return(
    <Box sx={{ 
      bgcolor: "#091a48", 
      flexDirection: "column", 
      width: "100%", 
      height: "100vh",
      position: 'relative'
    }}>
      {/* Toggle Button */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        right: -12, 
        zIndex: 1300,
        bgcolor: '#091a48',
        borderRadius: '50%',
        border: '2px solid #fff',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            color: '#fff',
            padding: 0,
            width: '100%',
            height: '100%',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          {isOpen ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Logo */}
      <Box sx={{ p: 2, pt: 4, pb: 2 }}>
        <img
          src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
          alt="Marketincer logo"
          width={29}
          height={21}
          style={{display:'block', margin:'auto'}}
        />
      </Box>

      {/* Navigation Icons */}
      <List className="sidebar-list" sx={{ flex: 1, pt: 2 }}>
        {menuItems.map(renderMenuItem)}
      </List>

      {/* Footer */}
      <Box sx={{ mt: "auto", px: 1, pb: 2 }}>
        <List>
          {/* Logout item */}
          <ListItem disablePadding>
            <Tooltip title={!isOpen ? 'Logout' : ''} placement="right">
              <ListItemButton 
                onClick={handleLogout} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  minHeight: isOpen ? 'auto' : 56,
                  '&:hover': {
                    bgcolor: 'rgba(203, 174, 247, 0.1)',
                    transform: 'translateX(2px)',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  color: '#cbaef7',
                  py: isOpen ? 1 : 1.5,
                }}>
                  <LogoutIcon fontSize="medium" />
                  {isOpen && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '12px', 
                        whiteSpace: 'nowrap',
                        mt: 0.5,
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      Logout
                    </Typography>
                  )}
                </Box>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
      </Box>
    </Box>
  );
};

export default Sidebar;