import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children }) => {
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

  const sidebarWidth = sidebarOpen ? 120 : 40;
  const topBarHeight = 64; // Standard AppBar height

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: topBarHeight, // Position below the top bar
          left: 0,
          width: sidebarWidth,
          height: `calc(100vh - ${topBarHeight}px)`, // Adjust height to account for top bar
          zIndex: 1200,
          transition: 'width 0.3s ease-in-out',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth}px`,
          marginTop: `${topBarHeight}px`, // Add top margin for the top bar
          //transition: 'margin-left 0.3s ease-in-out',
          minHeight: `calc(100vh - ${topBarHeight}px)`, // Adjust min height
          width: `calc(100vw - ${sidebarWidth}px)`,
          overflow: 'auto',
          //bgcolor: '#f5f5f5'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;