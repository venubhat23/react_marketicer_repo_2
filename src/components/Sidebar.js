import React, { useState, useEffect } from 'react';
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
  Instagram as InstagramIcon,
  Menu as MenuIcon,
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

const Sidebar = ({ isOpen: controlledIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const navigate = useNavigate();

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { icon: <AddCircleOutlineIcon />, label: 'Create Posts', path: '/createPost' },
    { icon: <EqualizerIcon />, label: 'Analytics', path: '/analytics' },
    { icon: <InstagramIcon />, label: 'Analytics 2', path: '/instagram-analytics' },
    { icon: <People />, label: 'Social Media', path: '/socialMedia' },
    { icon: <DescriptionIcon />, label: 'Contracts', path: '/contracts' },
    { icon: <StorefrontIcon />, label: 'Marketplace', path: '/marketplace' },
  ];

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', isOpen.toString());
  }, [isOpen]);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null && controlledIsOpen === undefined) {
      setInternalIsOpen(savedState === 'true');
    }
  }, []);

  const sidebarWidth = isOpen ? 240 : 80;

  return (
    <Box sx={{ 
      bgcolor: "#091a48", 
      flexDirection: "column", 
      width: sidebarWidth,
      height: "100vh",
      display: 'flex',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1200,
      transition: 'width 0.3s ease-in-out',
      overflow: 'hidden',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Header with Logo and Toggle Button */}
      <Box sx={{ 
        p: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'space-between' : 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        minHeight: 64
      }}>
        {isOpen && (
          <img
            src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
            alt="Marketincer logo"
            width={29}
            height={21}
          />
        )}
        <IconButton
          onClick={handleToggle}
          sx={{
            color: '#cbaef7',
            '&:hover': {
              backgroundColor: 'rgba(203, 174, 247, 0.1)',
            }
          }}
        >
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ 
        flexGrow: 1, 
        px: 1,
        py: 1,
        overflow: 'auto'
      }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip 
              title={!isOpen ? item.label : ""} 
              placement="right"
              arrow
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  py: 1.5,
                  px: isOpen ? 2 : 1,
                  borderRadius: 1.5,
                  color: '#cbaef7',
                  gap: isOpen ? 2 : 0,
                  minHeight: 48,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(203, 174, 247, 0.1)',
                    color: '#fff',
                    transform: 'translateX(2px)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 'auto',
                  color: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(item.icon, { fontSize: 'medium' })}
                </ListItemIcon>
                {isOpen && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ 
        px: 1, 
        pb: 2,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        pt: 1
      }}>
        {/* Logout Button */}
        <ListItem disablePadding>
          <Tooltip 
            title={!isOpen ? "Logout" : ""} 
            placement="right"
            arrow
          >
            <ListItemButton
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'flex-start' : 'center',
                py: 1.5,
                px: isOpen ? 2 : 1,
                borderRadius: 1.5,
                color: '#cbaef7',
                gap: isOpen ? 2 : 0,
                minHeight: 48,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  color: '#f44336',
                  transform: 'translateX(2px)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 'auto',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LogoutIcon fontSize="medium" />
              </ListItemIcon>
              {isOpen && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '14px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Logout
                </Typography>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;