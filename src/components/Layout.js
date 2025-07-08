import React from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={10}>
          <Box
            component="main"
            sx={{
              minHeight: '100vh',
              bgcolor: '#f5f5f5',
              overflow: 'auto'
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;