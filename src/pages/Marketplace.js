import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';

const Marketplace = () => {
  return (
    <Layout>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column'
        }}>
          <StorefrontIcon sx={{ fontSize: 80, color: '#091a48', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#666', textAlign: 'center' }}>
            Marketplace
          </Typography>
          <Typography variant="body1" sx={{ color: '#999', textAlign: 'center', mt: 2 }}>
            Coming soon...
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default Marketplace;