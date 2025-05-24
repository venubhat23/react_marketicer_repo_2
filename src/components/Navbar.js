import React from 'react';
import { AppBar, Toolbar, IconButton,Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Navbar = ({ toggleDrawer }) => {
  return (
    <AppBar
          position="static"
          sx={{ bgcolor: "#091a48", boxShadow: "none" }}
        >
          <Toolbar>
            <IconButton
              color="#fff"
              sx={{ mr: 2 }}
            >
            <ArrowBackIcon />
              
            </IconButton>
            <Typography variant="h5" component="div" fontWeight={500} sx={{marginLeft:'10%'}}>
               Social Media Accounts
            </Typography>
          </Toolbar>
        </AppBar>

  );
};

export default Navbar;
