import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const Invoice = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Invoice Management
      </Typography>
      
      <Alert severity="success" sx={{ mb: 3 }}>
        This page is accessible to all roles (Admin, Influencer, Brand).
      </Alert>
      
      <Typography variant="body1">
        Manage your invoices and billing here.
      </Typography>
    </Box>
  );
};

export default Invoice;