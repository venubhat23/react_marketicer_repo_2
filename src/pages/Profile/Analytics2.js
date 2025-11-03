import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress,
  Divider, Container, Stack
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Layout from '../../components/Layout';
import axios from 'axios';

const Analytics2 = () => {
  const [profileData, setProfileData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [platformOption, setPlatformOption] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper function to format API data
  const formatApiData = (apiData) => {
    return apiData.map(item => ({
      page_name: item.page_name || 'N/A',
      name: item.profile?.name || 'N/A',
      profileImage: item.profile?.profile_picture_url || '',
      biography: item.profile?.biography || 'N/A',
      followers_count: item.profile?.followers_count || 0,
      follows_count: item.profile?.follows_count || 0,
      media_count: item.profile?.media_count || 0,
      engagement_rate: item.profile?.engagement_rate || 0,
      total_posts: item.analytics?.total_posts || 0,
      // For dropdown selection
      displayName: item.page_name || item.profile?.name || 'N/A'
    }));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('https://api.marketincer.com/api/v1/influencer/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rawData = response?.data?.data || [];
      if (rawData.length > 0) {
        const formattedData = formatApiData(rawData);
        setProfileData(formattedData);
        setSelectedUser(formattedData[0]);
        setPlatformOption(formattedData[0].displayName);
      } else {
        // No data available
        setProfileData([]);
        setSelectedUser(null);
        setPlatformOption('');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // No data on error
      setProfileData([]);
      setSelectedUser(null);
      setPlatformOption('');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const name = e.target.value;
    if (!name) return;

    setPlatformOption(name);
    const user = profileData.find(item => item.displayName === name);
    setSelectedUser(user);
  };

  const ProfileCard = ({ data }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        background: '#ffffff',
        height: 'fit-content',
        p: 2
      }}
    >
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={data.profileImage}
          alt={data.page_name}
          sx={{
            width: 60,
            height: 60,
            mr: 2
          }}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 0.5,
              fontSize: '18px'
            }}
          >
            {data.page_name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              backgroundColor: '#e8f5e8',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '12px',
              fontWeight: 500,
              display: 'inline-block'
            }}
          >
            {data.name}
          </Typography>
        </Box>
      </Box>

      {/* Followers Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              fontSize: '16px'
            }}
          >
            {data.followers_count !== undefined ? data.followers_count : 'N/A'} followers
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              fontSize: '16px'
            }}
          >
            {data.follows_count !== undefined ? data.follows_count : 'N/A'} following
          </Typography>
        </Box>
      </Box>

      {/* Bio */}
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          mb: 2,
          fontSize: '14px',
          lineHeight: 1.4,
          whiteSpace: 'pre-line'
        }}
      >
        {data.biography}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Metrics */}
      <Box sx={{ mt: 2 }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Engagement Rate:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {data.engagement_rate !== undefined ? `${data.engagement_rate}%` : 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Media Count:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {data.media_count !== undefined ? data.media_count : 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Total Posts:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {data.total_posts !== undefined ? data.total_posts : 'N/A'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Card>
  );

  const AnalyticsCard = ({ value, label }) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        background: '#ffffff',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 1,
            fontSize: '24px'
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f8f9ff', minHeight: '100vh' }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: '#1a237e',
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ color: '#fff', mr: 1 }}>
                <ArrowLeftIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                Influencers Analytics
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#fff' }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton sx={{ color: '#fff' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Search Bar */}
        <Box sx={{ backgroundColor: '#e3f2fd', p: 2 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2.4}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#fff',
                    borderRadius: '25px',
                    height: '45px',
                    px: 2,
                    gap: 1
                  }}
                >
                  <Box sx={{ color: '#999', fontSize: '16px' }}>🔍</Box>
                  <Typography sx={{ color: '#999', fontSize: '14px' }}>Search</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Date Range</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Platform: Instagram</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <Select
                    value={platformOption}
                    onChange={handleProfileChange}
                    displayEmpty
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Influencer</em></MenuItem>
                    {profileData.map((item, index) => (
                      <MenuItem key={index} value={item.displayName}>
                        {item.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Post Type</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {profileData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No Analytics Data Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Please connect your social media accounts to view analytics.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Profile Section */}
              <Grid item xs={12} md={4}>
                {selectedUser && <ProfileCard data={selectedUser} />}
              </Grid>

              {/* Campaign Analytics Section */}
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 2,
                    fontSize: '18px'
                  }}
                >
                  Campaign Analytics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <AnalyticsCard
                      value={selectedUser?.followers_count || 'N/A'}
                      label="Followers"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <AnalyticsCard
                      value={selectedUser?.follows_count || 'N/A'}
                      label="Following"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <AnalyticsCard
                      value={selectedUser?.media_count || 'N/A'}
                      label="Media Count"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <AnalyticsCard
                      value={selectedUser?.total_posts || 'N/A'}
                      label="Total Posts"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Analytics2;