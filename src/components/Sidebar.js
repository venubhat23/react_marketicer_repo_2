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
  Badge,
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
  Home as HomeIcon,
  Search as SearchIcon,
  Explore as ExploreIcon,
  VideoLibrary as VideoLibraryIcon,
  Send as SendIcon,
  FavoriteOutlined as FavoriteIcon,
  NotificationsOutlined as NotificationsIcon,
  BookmarkOutlined as BookmarkIcon,
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
    { icon: <HomeIcon fontSize="medium" />, label: 'Home', path: '/dashboard' },
    { icon: <SearchIcon fontSize="medium" />, label: 'Search', path: '/search' },
    { icon: <ExploreIcon fontSize="medium" />, label: 'Explore', path: '/explore' },
    { icon: <VideoLibraryIcon fontSize="medium" />, label: 'Reels', path: '/reels' },
    { icon: <MessageSquareIcon fontSize="medium" />, label: 'Messages', path: '/messages' },
    { icon: <FavoriteIcon fontSize="medium" />, label: 'Notifications', path: '/notifications' },
    { icon: <AddCircleOutlineIcon fontSize="medium" />, label: 'Create Post', path: '/createPost', highlight: true },
    { icon: <EqualizerIcon fontSize="medium" />, label: 'Analytics', path: '/analytics' },
    { icon: <InstagramIcon fontSize="medium" />, label: 'Analytics 2', path: '/instagram-analytics' },
    { icon: <People fontSize="medium" />, label: 'Social Media', path: '/socialMedia' },
    { icon: <DescriptionIcon fontSize="medium" />, label: 'Contracts', path: '/contracts' },
    { icon: <StorefrontIcon fontSize="medium" />, label: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <Box sx={{ 
      bgcolor: "#0f1419", 
      flexDirection: "column", 
      width: "100%", 
      height: "100vh",
      display: 'flex',
      position: 'relative',
      borderRight: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Logo */}
      <Box sx={{ 
        p: { xs: 1.5, md: 3 }, 
        pt: { xs: 2, md: 4 }, 
        pb: { xs: 1.5, md: 2 },
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img
          src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
          alt="Marketincer logo"
          width={32}
          height={24}
          style={{ display: 'block', margin: 'auto' }}
        />
      </Box>

      {/* User Profile Section */}
      <Box sx={{ 
        px: { xs: 1, md: 2 }, 
        py: { xs: 1.5, md: 2 },
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, md: 1.5 },
          mb: 2
        }}>
          <Avatar 
            sx={{ 
              width: { xs: 40, md: 48 }, 
              height: { xs: 40, md: 48 },
              bgcolor: '#6366f1',
              border: '2px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            U
          </Avatar>
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#fff', 
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: 1.2
              }}
            >
              Username
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#94a3b8', 
                fontSize: '12px',
                lineHeight: 1.2
              }}
            >
              @username
            </Typography>
          </Box>
        </Box>

        {/* Quick Action Icons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          gap: 1,
          px: { xs: 0, md: 1 }
        }}>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#94a3b8', 
              '&:hover': { 
                color: '#6366f1', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)' 
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#94a3b8', 
              '&:hover': { 
                color: '#6366f1', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)' 
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Badge badgeContent={5} color="error" variant="dot">
              <MessageSquareIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#94a3b8', 
              '&:hover': { 
                color: '#6366f1', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)' 
              },
              transition: 'all 0.2s ease'
            }}
          >
            <BookmarkIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              color: '#94a3b8', 
              '&:hover': { 
                color: '#6366f1', 
                backgroundColor: 'rgba(99, 102, 241, 0.1)' 
              },
              transition: 'all 0.2s ease'
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ 
        flexGrow: 1, 
        px: { xs: 0.5, md: 1 },
        py: { xs: 1, md: 1.5 },
        overflow: 'auto'
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
                py: { xs: 1.2, md: 1.5 },
                px: { xs: 0.8, md: 1.5 },
                borderRadius: 2,
                color: item.highlight ? '#fff' : '#94a3b8',
                gap: { xs: 0.3, md: 1.5 },
                minHeight: { xs: 60, md: 48 },
                transition: 'all 0.3s ease',
                backgroundColor: item.highlight ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: item.highlight ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                '&:hover': {
                  backgroundColor: item.highlight ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  transform: 'translateX(4px)',
                  boxShadow: item.highlight ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
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
                  fontWeight: item.highlight ? 600 : 500,
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
        px: { xs: 0.5, md: 1 }, 
        pb: { xs: 1.5, md: 2 },
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
              py: { xs: 1.2, md: 1.5 },
              px: { xs: 0.8, md: 1.5 },
              borderRadius: 2,
              color: '#94a3b8',
              gap: { xs: 0.3, md: 1.5 },
              minHeight: { xs: 60, md: 48 },
              transition: 'all 0.3s ease',
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