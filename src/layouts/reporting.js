import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Reporting = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Reports
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This page is only accessible to Admin and Influencer roles.
      </Alert>
      
      <Typography variant="body1">
        Generate and view reports here.
      </Typography>
    </Box>
  );
};

export default Reporting;