import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Welcome to Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is the main dashboard accessible to all roles.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Quick Stats
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View your performance metrics here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check your latest activities and updates.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;