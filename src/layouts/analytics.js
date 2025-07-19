import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Analytics = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Analytics Dashboard
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        This page is accessible to Brand, Admin, and Influencer roles.
      </Alert>
      
      <Typography variant="body1">
        View detailed analytics and performance metrics here.
      </Typography>
    </Box>
  );
};

export default Analytics;