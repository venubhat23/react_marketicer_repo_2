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
  People,
} from '@mui/icons-material';

import MessageSquareIcon from "@mui/icons-material/Message";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SettingsIcon from "@mui/icons-material/Settings";

import { Link } from "react-router-dom";

const footerItems = [
  { icon: <MessageSquareIcon />, active: true },
  { icon: <SettingsIcon />, active: true },
];

const Sidebar = () => {

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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <AddCircleOutlineIcon fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap', }}>Create Posts</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/analytics">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <EqualizerIcon fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap'}}>Analytics</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/socialMedia">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <People fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px',whiteSpace:'nowrap'}}>Social Media</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>
         
      </List>

          {/* Footer */}
          <Box sx={{ mt: "auto", px: 1, pb: 2 }}>
            <List>
              {footerItems.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5, p: 0 }}>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
          </Box>
          
        </Box>
    
  );
};

export default Sidebar;