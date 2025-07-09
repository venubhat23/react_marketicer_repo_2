import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar,
  Grid, Card, CardContent, 
  CircularProgress,
  Divider, Container, Stack
} from "@mui/material";
import Layout from '../../components/Layout';
import axios from 'axios';

const Analytics2 = () => {
  const [profileData, setProfileData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample data matching image 2
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
      } else {
        // Use sample data if no API data
        setProfileData([sampleData]);
        setSelectedUser(sampleData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use sample data on error
      setProfileData([sampleData]);
      setSelectedUser(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const ProfileCard = ({ data }) => (
    <Card
      elevation={1}
      sx={{
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        background: '#ffffff',
        height: 'fit-content'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={data.profileImage || data.image_url}
            alt={data.name}
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
                mb: 0.5
              }}
            >
              {data.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '14px'
              }}
            >
              {data.category || 'Beauty & Lifestyle'}
            </Typography>
          </Box>
        </Box>

        {/* Followers Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                fontSize: '16px'
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
                fontSize: '16px'
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
            fontSize: '12px'
          }}
        >
          {data.location || 'USA'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Metrics */}
        <Box sx={{ mt: 2 }}>
          <Stack spacing={1.5}>
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

  const AnalyticsCard = ({ value, label }) => (
    <Card
      elevation={1}
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
      <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 1,
            fontSize: '20px'
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '12px',
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
      <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Analytics Profile Section */}
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1a1a1a',
                  mb: 2,
                  fontSize: '18px'
                }}
              >
                Analytics Profile
              </Typography>
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
                {selectedUser?.campaign_analytics?.map((analytics, index) => (
                  <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                    <AnalyticsCard
                      value={analytics.value}
                      label={analytics.label}
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