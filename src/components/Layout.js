import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: sidebarWidth,
          height: '100vh',
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
          //transition: 'margin-left 0.3s ease-in-out',
          minHeight: '100vh',
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