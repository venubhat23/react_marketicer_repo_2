import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Media = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Media Library
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This page is only accessible to Admin and Influencer roles.
      </Alert>
      
      <Typography variant="body1">
        Manage your media files, images, and videos here.
      </Typography>
    </Box>
  );
};

export default Media;