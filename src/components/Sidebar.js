import React from 'react';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
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
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useNavigate } from "react-router-dom";
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from "../authContext/AuthContext";

const footerItems = [
  { icon: <MessageSquareIcon />, active: true },
  { icon: <SettingsIcon />, active: true },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.clear();      // Clear local storage
    sessionStorage.clear();    // Clear session storage (optional)
    navigate("/login");        // Redirect to login page
  };

  // Determine which marketplace options to show based on role
  const getMarketplaceOptions = () => {
    const role = user?.role;
    const options = [];

    if (role === 'admin') {
      // Admin sees both options
      options.push(
        {
          link: '/brand/marketplace',
          icon: <BusinessIcon fontSize="medium" />,
          label: 'Marketincer-Brand'
        },
        {
          link: '/influencer/marketplace',
          icon: <PersonIcon fontSize="medium" />,
          label: 'Marketincer-Influencer'
        }
      );
    } else if (role === 'brand') {
      // Brand sees only brand option
      options.push({
        link: '/brand/marketplace',
        icon: <BusinessIcon fontSize="medium" />,
        label: 'Marketincer-Brand'
      });
    } else if (role === 'influencer') {
      // Influencer sees only influencer option
      options.push({
        link: '/influencer/marketplace',
        icon: <PersonIcon fontSize="medium" />,
        label: 'Marketincer-Influencer'
      });
    }

    return options;
  };

  const marketplaceOptions = getMarketplaceOptions();

  return(
    <Box sx={{ bgcolor: "#091a48", flexDirection: "column", width:"100%", height: "100vh" }}>
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
      <List className="sidebar-list">

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/createPost">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <AddCircleOutlineIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Create Posts</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

          <ListItem disablePadding >
            <ListItemButton sx={{ display: 'none', justifyContent: 'center' }}>
              <Link to="/dashboard">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#cbaef7',
                }}
              >
                <AppsIcon fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap'}}>Dashboard</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding >
            <ListItemButton sx={{ display: 'none', justifyContent: 'center' }}>
              <Link to="/discover">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#cbaef7',
                }}
              >
                <LanguageIcon fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap'}}>Discover</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>

          

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/instagram-analytics">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <TrendingUpIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Analytics</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/socialMedia">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <People fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Social Media</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/contracts">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <DescriptionIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Contracts</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        {/* Dynamic Marketplace Options Based on Role */}
        {marketplaceOptions.map((option, index) => (
          <ListItem key={`marketplace-${index}`} disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link to={option.link}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                  {option.icon}
                  <Typography variant="body2" sx={{ fontSize: '10px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    {option.label}
                  </Typography>
                </Box>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}

      </List>

      {/* Footer */}
      <Box sx={{ mt: "auto", px: 1, pb: 2 }}>
        <List>
          {/* Existing footer items if needed */}
          {footerItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 0.5, p: 0 }} />
          ))}

          {/* Logout item */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <LogoutIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Logout</Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
      </Box>
    </Box>
  );
};

export default Sidebar;