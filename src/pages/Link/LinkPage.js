import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  IconButton,
  Button
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  AccountCircle as AccountCircleIcon 
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";

// Import the original components
import ShortLinkPage from './ShortLinkPage';
import LinkAdvancedPage from './LinkAdvancedPage';

const LinkPage = () => {
  const [activeView, setActiveView] = useState('shortlink'); // Default to shortlink

  // Get header title for the Link module
  const getHeaderTitle = () => {
    return 'Link Management';
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar/>
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: '#091a48',
              borderRadius: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff' }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    sx={{ mr: 2, color: '#fff' }}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                  {getHeaderTitle()}
             </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton size="large" sx={{ color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton size="large" sx={{ color: 'white' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* Button Navigation */}
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <Button
                variant={activeView === 'shortlink' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('shortlink')}
                sx={{
                  backgroundColor: activeView === 'shortlink' ? '#091a48' : 'transparent',
                  color: activeView === 'shortlink' ? 'white' : '#091a48',
                  borderColor: '#091a48',
                  '&:hover': {
                    backgroundColor: activeView === 'shortlink' ? '#0d2557' : 'rgba(9, 26, 72, 0.1)',
                  }
                }}
              >
                Short Link
              </Button>
              <Button
                variant={activeView === 'advanced' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('advanced')}
                sx={{
                  backgroundColor: activeView === 'advanced' ? '#091a48' : 'transparent',
                  color: activeView === 'advanced' ? 'white' : '#091a48',
                  borderColor: '#091a48',
                  '&:hover': {
                    backgroundColor: activeView === 'advanced' ? '#0d2557' : 'rgba(9, 26, 72, 0.1)',
                  }
                }}
              >
                Advanced Link
              </Button>
            </Box>

            {/* Content Area */}
            <Box>
              {activeView === 'shortlink' && (
                <ShortLinkPage noLayout={true} />
              )}
              {activeView === 'advanced' && (
                <LinkAdvancedPage />
              )}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkPage;