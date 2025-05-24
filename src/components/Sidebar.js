import React from 'react';

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Stack,
  Toolbar,
  Typography,
  ListItemText,
  ListItemButton,
  IconButton,
  Grid,
} from "@mui/material";

import {
  Home,
  GridView,
  Public,
  BarChart,
  People,
  CalendarToday,
  InsertDriveFile,
  Chat,
  Settings,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  
} from '@mui/icons-material';

import MessageSquareIcon from "@mui/icons-material/Message";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SettingsIcon from "@mui/icons-material/Settings";

import { Link } from "react-router-dom";

// import {
//   Drawer,
//   Toolbar,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   ListItemButton,
//   IconButton,
//   Box,
//   footerItems,
//   Divider, 
//   Avatar,
// } from '@mui/material';


// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import CreatePost from '../pages/CreatePost'
// import Dashboard from '../pages/Dashboard'


// const drawerWidthExpanded = 240;
// const drawerWidthCollapsed = 60;

const iconList = [
  <TrendingUp />,
  <Home />,
  <GridView />,
  <Public />,
  <BarChart />,
  <People />,
  <CalendarToday />,
  <InsertDriveFile />,
  <InsertDriveFile />,
  <Chat />,
  <Settings />,
];


const footerItems = [
  { icon: <MessageSquareIcon />, active: true },
  { icon: <SettingsIcon />, active: true },
];

const Sidebar = () => {

  return(
    
  <Drawer
        variant="permanent"
        sx={{
          //width: 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            //width: 80,
            boxSizing: "border-box",
            bgcolor: "#091a48",
            border: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo */}
          <Box sx={{ p: 2, pt: 4, pb: 2 }}>
            <img
              src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
              alt="Marketincer logo"
              width={29}
              height={21}
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
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap'}}>Create Posts</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>
          
         

          <ListItem disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/dashboard">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Home fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px',whiteSpace:'nowrap'}}>Dashboard</Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <GridView fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px',whiteSpace:'nowrap'}}>Grid View</Typography>
              </Box>
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <BarChart fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap'}}>BarChart</Typography>
              </Box>
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
                <Typography variant="body2" sx={{fontSize:'12px',whiteSpace:'nowrap'}}>Socail Media </Typography>
              </Box>
              </Link>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <CalendarToday fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px',whiteSpace:'nowrap'}}>Calender</Typography>
              </Box>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: '#FFFFFF',
                }}
              >
                <InsertDriveFile  fontSize="medium" />
                <Typography variant="body2" sx={{fontSize:'12px', whiteSpace:'nowrap'}}> InsertDriveFile</Typography>
              </Box>
            </ListItemButton>
          </ListItem>         
      </List>

          {/* Footer */}
          <Box sx={{ mt: "auto", px: 1, pb: 2 }}>
            <List>
              {footerItems.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 0.5, p: 0 }}>
                  <IconButton
                    sx={{
                      borderRadius: 1,
                      p: 1.5,
                      width: "100%",
                      bgcolor: "#091a48",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        minWidth: "auto",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)", my: 1.5 }} />
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src="https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-4.svg"
                sx={{ width: 48, height: 48 }}
              />
            </Box>
          </Box>
          
        </Box>
      </Drawer>
  

      
    
  );
};

export default Sidebar;


