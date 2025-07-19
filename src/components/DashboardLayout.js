import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import DynamicSidenav from './DynamicSidenav';
import { useAuth } from '../authContext/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Get sidebar state from localStorage, default to true
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarWidth = sidebarOpen ? 240 : 80;

  // Only render the layout if user is authenticated and has a role
  if (!user || !user.role) {
    return children; // Return children without sidebar for unauthenticated users
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <DynamicSidenav isOpen={sidebarOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease',
          width: `calc(100vw - ${sidebarWidth}px)`,
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* Toggle Button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            top: 16,
            left: sidebarWidth + 16,
            zIndex: 1300,
            bgcolor: 'background.paper',
            boxShadow: 2,
            transition: 'left 0.3s ease',
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page Content */}
        <Box sx={{ p: 3, pt: 8 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;