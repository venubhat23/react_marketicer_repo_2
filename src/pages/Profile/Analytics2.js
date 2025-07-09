import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Button,
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
  const [error, setError] = useState('');

  // Sample data matching image 1
  const sampleData = {
    name: "Alice",
    profileImage: "https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png",
    category: "Beauty & Lifestyle",
    followers: "32.8K",
    following: "30K",
    bio: "Bio: Lorem Ipsum dolor sit",
    location: "USA",
    engagement_rate: "3.1%",
    earned_media: "249",
    average_interactions: "3.1%",
    campaign_analytics: [
      { value: "24.3K", label: "Total Likes" },
      { value: "403", label: "Total Comments" },
      { value: "1.3%", label: "Total Engagement" },
      { value: "32.8K", label: "Total Reach" },
      { value: "12.1K", label: "Total Shares" },
      { value: "428", label: "Total Saves" },
      { value: "829", label: "Total Clicks" },
      { value: "829", label: "Profile Visits" },
    ]
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
      
      const data = response?.data?.data || [];
      if (data.length > 0) {
        setProfileData(data);
        setSelectedUser(data[0]);
        setPlatformOption(data[0].name);
      } else {
        // Use sample data if no API data
        setProfileData([sampleData]);
        setSelectedUser(sampleData);
        setPlatformOption(sampleData.name);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use sample data on error
      setProfileData([sampleData]);
      setSelectedUser(sampleData);
      setPlatformOption(sampleData.name);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const name = e.target.value;
    if (!name) return;
    
    setPlatformOption(name);
    const user = profileData.find(item => item.name === name);
    setSelectedUser(user);
  };

  const ProfileCard = ({ data }) => (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
        height: 'fit-content',
        position: 'sticky',
        top: 20
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={data.profileImage || data.image_url}
            alt={data.name}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid #e3f2fd',
              mr: 2
            }}
          />
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 0.5
              }}
            >
              {data.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                backgroundColor: '#e8f5e8',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              {data.category || 'Beauty & Lifestyle'}
            </Typography>
          </Box>
        </Box>

        {/* Followers Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                fontSize: '18px'
              }}
            >
              {data.followers || '32.8K'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '12px'
              }}
            >
              Followers
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                fontSize: '18px'
              }}
            >
              {data.following || '30K'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '12px'
              }}
            >
              Following
            </Typography>
          </Box>
        </Box>

        {/* Bio */}
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 1,
            fontSize: '13px',
            lineHeight: 1.4
          }}
        >
          {data.bio || 'Bio: Lorem Ipsum dolor sit'}
        </Typography>

        {/* Location */}
        <Typography
          variant="body2"
          sx={{
            color: '#999',
            mb: 2,
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          {data.location || 'USA'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Metrics */}
        <Box sx={{ mt: 2 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                Engagement Rate:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '13px' }}>
                {data.engagement_rate || '3.1%'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                Earned Media:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '13px' }}>
                {data.earned_media || '249'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                Average Interactions:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '13px' }}>
                {data.average_interactions || '3.1%'}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  const AnalyticsCard = ({ value, label, index }) => (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        background: index % 2 === 0 ? 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)' : 'linear-gradient(135deg, #fff8f8 0%, #ffffff 100%)'
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 2 }}>
        <Typography
          variant="h5"
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
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
                Analytics Dashboard
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
              <Grid item xs={12} md={4}>
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
                    {profileData.map((item, index) => (
                      <MenuItem key={index} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
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
          <Grid container spacing={3}>
            {/* Profile Section */}
            <Grid item xs={12} md={4}>
              {selectedUser && <ProfileCard data={selectedUser} />}
            </Grid>

            {/* Campaign Analytics */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 3,
                  fontSize: '24px'
                }}
              >
                Campaign Analytics
              </Typography>
              <Grid container spacing={2}>
                {selectedUser?.campaign_analytics?.map((analytics, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                    <AnalyticsCard
                      value={analytics.value}
                      label={analytics.label}
                      index={index}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Analytics2;