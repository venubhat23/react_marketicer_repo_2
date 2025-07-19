import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Calendar = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Calendar
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This page is only accessible to Admin and Influencer roles.
      </Alert>
      
      <Typography variant="body1">
        Manage your schedule and appointments here.
      </Typography>
    </Box>
  );
};

export default Calendar;