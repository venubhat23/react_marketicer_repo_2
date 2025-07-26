import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../authContext/AuthContext';

const LinkTopBar = ({ onCreateLinkClick, currentView, onViewChange }) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#1976d2',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '0 0 8px 8px'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Left side - Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinkIcon sx={{ fontSize: 32, color: '#fff' }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '0.5px'
            }}
          >
            LinkAutomation and Analytics
          </Typography>
        </Box>

        {/* Center - Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={currentView === 'dashboard' ? 'contained' : 'text'}
            color={currentView === 'dashboard' ? 'secondary' : 'inherit'}
            onClick={() => onViewChange('dashboard')}
            startIcon={<AnalyticsIcon />}
            sx={{ 
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Dashboard
          </Button>
          <Button
            variant={currentView === 'links' ? 'contained' : 'text'}
            color={currentView === 'links' ? 'secondary' : 'inherit'}
            onClick={() => onViewChange('links')}
            startIcon={<LinkIcon />}
            sx={{ 
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Links
          </Button>
        </Box>

        {/* Right side - Create Link Button and User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={onCreateLinkClick}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' },
              fontWeight: 'bold',
              px: 3
            }}
          >
            Create Link
          </Button>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user?.avatar ? (
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircleIcon />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <AccountCircleIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LinkTopBar;