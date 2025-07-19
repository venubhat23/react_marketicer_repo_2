import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Explore = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Explore
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        This page is only accessible to Brand and Admin roles.
      </Alert>
      
      <Typography variant="body1">
        Discover new opportunities and explore the marketplace.
      </Typography>
    </Box>
  );
};

export default Explore;