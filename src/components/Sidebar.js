import React, { useState, useEffect } from 'react';
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
  Monitor as MonitorIcon,
  AutoMode as AutoModeIcon,
  PermMedia as MediaIcon,
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
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from "react-router-dom";
import LanguageIcon from '@mui/icons-material/Language';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from "../authContext/AuthContext";

const footerItems = [
  { icon: <MessageSquareIcon />, active: true },
  { icon: <SettingsIcon />, active: true },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, forceUpdate] = useState({});

  // Force re-render when user changes
  useEffect(() => {
    forceUpdate({});
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();      // Clear local storage
    sessionStorage.clear();    // Clear session storage (optional)
    navigate("/login");        // Redirect to login page
  };

  // Determine which marketplace options to show based on role
  const getMarketplaceOptions = () => {
    const role = user?.role;
    const options = [];

    // Check for both 'Admin' and 'admin' to handle case inconsistencies
    if (role === 'Admin' || role === 'admin') {
      // Admin sees both options
      options.push(
        {
          link: '/brand/marketplace',
          icon: <BusinessIcon fontSize="medium" />,
          label: 'Market-Brand'
        },
        {
          link: '/influencer/marketplace',
          icon: <PersonIcon fontSize="medium" />,
          label: 'Market-Influencer'
        }
      );
    } else if (role === 'Brand' || role === 'brand') {
      // Brand sees only brand option
      options.push({
        link: '/brand/marketplace',
        icon: <BusinessIcon fontSize="medium" />,
        label: 'Market-Brand'
      });
    } else if (role === 'Influencer' || role === 'influencer') {
      // Influencer sees only influencer option
      options.push({
        link: '/influencer/marketplace',
        icon: <PersonIcon fontSize="medium" />,
        label: 'Market-Influencer'
      });
    } else {
      // Fallback - if no role or unknown role, show influencer option
      options.push({
        link: '/influencer/marketplace',
        icon: <PersonIcon fontSize="medium" />,
        label: 'Market-Influencer'
      });
    }

    return options;
  };

  const marketplaceOptions = getMarketplaceOptions();

  return(
    <Box sx={{ bgcolor: "#091a48", flexDirection: "column", width:"100%", minHeight: "800px" }}>
      {/* Logo */}
      <Box sx={{ p: 2, pt: 4, pb: 2 }}>
        <Link to="/createPost" style={{ display: 'block' }}>
          <img
            src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
            alt="Marketincer logo"
            width={29}
            height={21}
            style={{display:'block', margin:'auto', cursor: 'pointer'}}
          />
        </Link>
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

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/calendar">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <CalendarTodayIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Calendar</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/automations">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <AutoModeIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Automations</Typography>
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
            <ListItemButton sx={{ justifyContent: 'center' }}>
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
            <Link to="/media">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <MediaIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Media</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/social-monitoring">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <MonitorIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Social Monitoring</Typography>
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

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/link">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <LanguageIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Link</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/invoices">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <ReceiptIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Invoices</Typography>
              </Box>
            </Link>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/purchase-orders">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <ShoppingCartIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Purchase Orders</Typography>
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
                  <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap', textAlign: 'center' }}>
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

          <ListItem disablePadding >
            <ListItemButton sx={{ display: 'none', justifyContent: 'center' }}>
            <Link to="/settingPage">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#cbaef7' }}>
                <SettingsIcon fontSize="medium" />
                <Typography variant="body2" sx={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Setting</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>


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