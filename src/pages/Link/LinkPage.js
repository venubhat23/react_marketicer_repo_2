import React from 'react';
import { 
  Container, 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  IconButton 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  AccountCircle as AccountCircleIcon 
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import TabComponent from '../../components/TabComponent';
import Sidebar from '../../components/Sidebar';

// Import the original components
import ShortLinkPage from './ShortLinkPage';
import LinkAdvancedPage from './LinkAdvancedPage';

const LinkPage = () => {
  // Create tab configuration for the switcher
  const tabs = [
    {
      label: 'ShortLink',
      content: <ShortLinkPage noLayout={true} />
    },
    {
      label: 'Link Advanced', 
      content: <LinkAdvancedPage />
    }
  ];

  // Get header title for the Link module
  const getHeaderTitle = () => {
    return 'Link Management';
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
              p: 2,
              backgroundColor: '#091a48',
              borderRadius: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff' }}>
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

          {/* Main Content */}
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <TabComponent tabs={tabs} defaultIndex={0} />
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkPage;