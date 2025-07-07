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

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { icon: <AddCircleOutlineIcon fontSize="medium" />, label: 'Create Posts', path: '/createPost' },
    { icon: <EqualizerIcon fontSize="medium" />, label: 'Analytics', path: '/analytics' },
    { icon: <InstagramIcon fontSize="medium" />, label: 'Analytics 2', path: '/instagram-analytics' },
    { icon: <People fontSize="medium" />, label: 'Social Media', path: '/socialMedia' },
    { icon: <DescriptionIcon fontSize="medium" />, label: 'Contracts', path: '/contracts' },
    { icon: <StorefrontIcon fontSize="medium" />, label: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <Box sx={{ 
      bgcolor: "#091a48", 
      flexDirection: "column", 
      width: "100%", 
      height: "100vh",
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Logo */}
      <Box sx={{ 
        p: { xs: 1.5, md: 3 }, 
        pt: { xs: 2, md: 4 }, 
        pb: { xs: 1.5, md: 3 },
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
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
        px: { xs: 0.5, md: 1.5 },
        py: { xs: 1, md: 1.5 },
        overflow: 'hidden',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                py: { xs: 1.2, md: 1.8 },
                px: { xs: 0.8, md: 1.5 },
                borderRadius: 1.5,
                color: '#cbaef7',
                gap: { xs: 0.3, md: 1.5 },
                minHeight: { xs: 60, md: 50 },
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(203, 174, 247, 0.1)',
                  color: '#fff',
                  transform: 'translateX(2px)'
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: { xs: 24, md: 32 },
                height: { xs: 24, md: 32 }
              }}>
                {item.icon}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '10px', md: '13px' },
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { xs: '100%', md: '150px' }
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
        px: { xs: 0.5, md: 1.5 }, 
        pb: { xs: 1.5, md: 2.5 },
        borderTop: '1px solid rgba(255,255,255,0.1)',
        pt: { xs: 1, md: 1.5 }
      }}>
        {/* Logout Button */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              py: { xs: 1.2, md: 1.8 },
              px: { xs: 0.8, md: 1.5 },
              borderRadius: 1.5,
              color: '#cbaef7',
              gap: { xs: 0.3, md: 1.5 },
              minHeight: { xs: 60, md: 50 },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: '#f44336',
                transform: 'translateX(2px)'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: { xs: 24, md: 32 },
              height: { xs: 24, md: 32 }
            }}>
              <LogoutIcon fontSize="medium" />
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '10px', md: '13px' },
                fontWeight: 500,
                whiteSpace: 'nowrap',
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