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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon,
  //Settings as SettingsIcon,
  //Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon,
  Instagram as InstagramIcon,
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

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();      // Clear local storage
    sessionStorage.clear();    // Clear session storage (optional)
    navigate("/login");        // Redirect to login page
  };

  const menuItems = [
    { icon: <AddCircleOutlineIcon />, label: 'Create Posts', path: '/createPost' },
    { icon: <EqualizerIcon />, label: 'Analytics', path: '/analytics' },
    { icon: <InstagramIcon />, label: 'Influencer Analytics', path: '/instagram-analytics' },
    { icon: <People />, label: 'Social Media', path: '/socialMedia' },
    { icon: <DescriptionIcon />, label: 'Contracts', path: '/contracts' },
    { icon: <StorefrontIcon />, label: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <Box sx={{ 
      bgcolor: "#091a48", 
      flexDirection: "column", 
      width: "100%", 
      height: "100vh",
      display: 'flex'
    }}>
      {/* Logo */}
      <Box sx={{ 
        p: { xs: 2, md: 3 }, 
        pt: { xs: 3, md: 4 }, 
        pb: { xs: 2, md: 3 },
        textAlign: 'center'
      }}>
        <img
          src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
          alt="Marketincer logo"
          width={29}
          height={21}
          style={{ display: 'block', margin: 'auto' }}
        />
      </Box>

      {/* Navigation Items */}
      <List sx={{ 
        flexGrow: 1, 
        px: { xs: 1, md: 2 },
        py: { xs: 1, md: 2 }
      }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                py: { xs: 1.5, md: 2 },
                px: { xs: 1, md: 2 },
                borderRadius: 2,
                color: '#cbaef7',
                gap: { xs: 0.5, md: 2 },
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(203, 174, 247, 0.1)',
                  color: '#fff',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: { xs: 'auto', md: 40 }
              }}>
                {React.cloneElement(item.icon, { 
                  fontSize: { xs: 'medium', md: 'large' } 
                })}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '11px', md: '14px' },
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  display: { xs: 'block', md: 'block' },
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.2
                }}
              >
                {item.label}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ 
        px: { xs: 1, md: 2 }, 
        pb: { xs: 2, md: 3 },
        mt: 'auto'
      }}>
        <Divider sx={{ 
          bgcolor: "rgba(255,255,255,0.1)", 
          mb: 2
        }} />

        {/* Logout Button */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              py: { xs: 1.5, md: 2 },
              px: { xs: 1, md: 2 },
              borderRadius: 2,
              color: '#cbaef7',
              gap: { xs: 0.5, md: 2 },
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                transform: 'translateX(4px)'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: { xs: 'auto', md: 40 }
            }}>
              <LogoutIcon fontSize={{ xs: 'medium', md: 'large' }} />
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '11px', md: '14px' },
                fontWeight: 500,
                whiteSpace: 'nowrap',
                display: { xs: 'block', md: 'block' },
                textAlign: { xs: 'center', md: 'left' },
                lineHeight: 1.2
              }}
            >
              Logout
            </Typography>
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;