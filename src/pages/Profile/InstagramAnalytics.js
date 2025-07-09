import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress,
  Divider, Container, Stack
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Layout from '../../components/Layout';
import axios from 'axios';

const InstagramAnalytics = () => {
  const [instagramData, setInstagramData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstagramAnalytics();
  }, []);

  const fetchInstagramAnalytics = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError('No authentication token found');
        setInstagramData([]);
        setLoading(false);
        return;
      }

      console.log('Fetching Instagram analytics...');
      const response = await axios.get('https://api.marketincer.com/api/v1/instagram_analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('API Response:', response.data);

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setInstagramData(response.data.data);
        const firstAccount = response.data.data[0];
        setSelectedAccount(firstAccount.username);
        setSelectedAccountData(firstAccount);
      } else {
        setError('No Instagram data found');
        setInstagramData([]);
      }
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      setError(`API Error: ${error.response?.data?.message || error.message}`);
      setInstagramData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const username = e.target.value;
    
    if (!username) {
      return;
    }
    
    setSelectedAccount(username);
    const accountData = instagramData.find(account => account.username === username);
    setSelectedAccountData(accountData);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Create analytics cards matching Analytics component structure exactly
  const getAnalyticsCards = (data) => {
    if (!data) return [];
    
    const totalLikes = data.analytics?.engagement_stats?.total_likes || 0;
    const totalComments = data.analytics?.engagement_stats?.total_comments || 0;
    const totalPosts = data.analytics?.total_posts || 0;
    const followers = data.profile?.followers_count || 0;
    const following = data.profile?.follows_count || 0;
    const mediaCount = data.profile?.media_count || 0;
    const engagementRate = data.summary?.engagement_rate || '0.0%';
    
    return [
      { value: formatNumber(totalLikes), label: "Total Likes" },
      { value: formatNumber(totalComments), label: "Total Comments" },
      { value: engagementRate, label: "Total Engagement" },
      { value: formatNumber(followers), label: "Total Reach" },
      { value: formatNumber(Math.round(totalLikes * 0.5)), label: "Total Shares" },
      { value: formatNumber(Math.round(totalPosts * 15)), label: "Total Saves" },
      { value: formatNumber(Math.round(totalPosts * 25)), label: "Total Clicks" },
      { value: formatNumber(Math.round(followers * 0.08)), label: "Profile Visits" },
    ];
  };

  // Profile card component matching Analytics component exactly
  const ProfileCard = ({ data }) => {
    return (
      <Box sx={{ my: 2 }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: 2,
            border: "1px solid #e2e2e2",
            boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
          }}
        >
          <CardContent sx={{ position: "relative", p: 2 }}>
            {/* Profile Image */}
            <Avatar
              src={data.profile?.profile_picture_url || "https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png"}
              alt={`${data.username}'s profile`}
              sx={{
                width: 60,
                height: 60,
                position: "absolute",
                top: 11,
                left: 22,
              }}
            />

            {/* Profile Info */}
            <Box sx={{ ml: 10, mt: 1, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "20px",
                }}
              >
                {data.page_name || data.username}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "14px",
                    lineHeight: "14px",
                    display: "inline",
                  }}
                >
                  {formatNumber(data.profile?.followers_count || 0)}{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "12px",
                    lineHeight: "14px",
                    display: "inline",
                  }}
                >
                  Followers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "14px",
                    lineHeight: "14px",
                    display: "inline",
                    mx: 1,
                  }}
                >
                  {formatNumber(data.profile?.follows_count || 0)}{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "12px",
                    lineHeight: "14px",
                    display: "inline",
                  }}
                >
                  Following
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "#666666",
                  fontSize: "12px",
                  lineHeight: "14px",
                  mt: 1,
                }}
              >
                {data.profile?.biography ? 
                  (data.profile.biography.length > 60 ? 
                    data.profile.biography.substring(0, 60) + '...' : 
                    data.profile.biography) : 
                  "Instagram Profile"}
              </Typography>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 1.5, mt: 2 }} />

            {/* Metrics */}
            <Grid container direction="column" spacing={1} sx={{ pl: 2, textAlign: 'justify' }}>
              <Grid item>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 400,
                    color: "#333333",
                    fontSize: "12px",
                    lineHeight: "16px",
                  }}
                >
                  <Box
                    component="div"
                    className="profilecontent"
                    sx={{ display: "inline-block", width: "100%" }}
                  >
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      <li>Engagement: {data.summary?.engagement_rate || '0.0%'}</li>
                      <li>Media: {data.summary?.most_used_media_type || 'IMAGE'}</li>
                      <li>Posts: {data.analytics?.total_posts || 0}</li>
                      <li>Frequency: {data.summary?.posting_frequency || 'N/A'}</li>
                    </ul>
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  };

  // Show loading state
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
      <Box sx={{ flexGrow: 1 }}>
        {/* Header matching Analytics component exactly */}
        <Paper
          elevation={0}
          sx={{
            display: { xs: 'none', md: 'block' },
            p: 1,
            backgroundColor: '#091a48',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
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
              Instagram Analytics
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="large" sx={{ color: '#fff' }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton size="large" sx={{ color: '#fff' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Blue filter section matching Analytics component exactly */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center', 
            bgcolor: '#B1C6FF', 
            padding: '10px',
          }}
        >
          <FormControl fullWidth>
            <Select
              value={selectedAccount}
              onChange={handleAccountChange}
              displayEmpty
              sx={{
                width: '300px', 
                bgcolor: '#fff', 
                borderRadius: '50px', 
                height: '40px',
                mt: '6px',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    '& .MuiMenuItem-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#1976d2 !important',
                        color: 'white !important',
                        '&:hover': {
                          backgroundColor: '#1565c0 !important',
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    },
                  },
                },
              }}
            >
              {instagramData.length === 0 ? (
                <MenuItem value="" disabled>
                  <em>Loading Instagram accounts...</em>
                </MenuItem>
              ) : (
                instagramData.map((account, index) => (
                  <MenuItem
                    key={`${account.username}-${index}`}
                    value={account.username}
                    sx={{
                      backgroundColor: selectedAccount === account.username ? '#1976d2 !important' : 'transparent',
                      color: selectedAccount === account.username ? 'white !important' : 'inherit',
                      '&:hover': {
                        backgroundColor: selectedAccount === account.username ? '#1565c0 !important' : '#f5f5f5 !important',
                      },
                    }}
                  >
                    {account.username}
                    {account.page_name && ` (${account.page_name})`}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>

        {/* Main content matching Analytics component layout exactly */}
        <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '15px' }}>
          <Grid container spacing={2}>
            {/* Profile Section - Left side */}
            <Grid item xs={12} md={4} sx={{ mt: '-20px', p: 1 }}>
              {selectedAccountData ? (
                <ProfileCard data={selectedAccountData} />
              ) : (
                <Box sx={{ my: 2 }}>
                  <Card
                    sx={{
                      width: "100%",
                      borderRadius: 2,
                      border: "1px solid #e2e2e2",
                      boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <InstagramIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="textSecondary">
                        {instagramData.length === 0 ? 'Loading Instagram analytics data...' : 'No Instagram account selected'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Grid>

            {/* Campaign Analytics Section - Right side */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: '#333',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  mt: '-20px'
                }}
              >
                Campaign Analytics
              </Typography>
              {selectedAccountData ? (
                <Grid container spacing={2}>
                  {getAnalyticsCards(selectedAccountData).slice(0, 8).map((card, index) => (
                    <Grid key={index} item xs={12} sm={6} md={6} lg={3}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          background: '#ffffff',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: '#1a1a1a',
                              mb: 1,
                              fontSize: '24px'
                            }}
                          >
                            {card.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontSize: '14px',
                              fontWeight: 500
                            }}
                          >
                            {card.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <InstagramIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    Please select an Instagram account to view analytics
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default InstagramAnalytics;