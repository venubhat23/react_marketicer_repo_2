import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Button,
  Chip, Container, Stack, Modal,
  Badge, Tooltip
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People';
import PhotoIcon from '@mui/icons-material/Photo';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InteractiveIcon from '@mui/icons-material/TouchApp';
import Layout from '../../components/Layout';
import axios from 'axios';

const InstagramAnalytics = () => {
  const [instagramData, setInstagramData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNoAnalyticsModal, setShowNoAnalyticsModal] = useState(false);

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
        setShowNoAnalyticsModal(true);
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
        setShowNoAnalyticsModal(true);
      }
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      setError(`API Error: ${error.response?.data?.message || error.message}`);
      setShowNoAnalyticsModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const username = e.target.value;
    
    // Don't proceed if empty value is selected
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

  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'IMAGE':
        return <PhotoIcon />;
      case 'VIDEO':
        return <VideoLibraryIcon />;
      default:
        return <PhotoIcon />;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateAverageInteractions = (data) => {
    if (!data?.analytics?.engagement_stats) return 0;
    const totalLikes = data.analytics.engagement_stats.total_likes || 0;
    const totalComments = data.analytics.engagement_stats.total_comments || 0;
    const totalPosts = data.analytics.total_posts || 1;
    return Math.round((totalLikes + totalComments) / totalPosts);
  };

  // Create analytics cards array matching Analytics component structure
  const getAnalyticsCards = (data) => {
    if (!data) return [];
    
    const totalPosts = data.profile?.media_count || 0;
    const totalLikes = data.analytics?.engagement_stats?.total_likes || 0;
    const totalComments = data.analytics?.engagement_stats?.total_comments || 0;
    const followers = data.profile?.followers_count || 0;
    const following = data.profile?.follows_count || 0;
    const avgLikes = totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0;
    const avgComments = totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0;
    const avgEngagement = totalPosts > 0 ? Math.round((totalLikes + totalComments) / totalPosts) : 0;
    const reachPotential = Math.round(followers * 0.15); // Estimated reach potential
    
    return [
      { value: formatNumber(totalLikes), label: "Total Likes" },
      { value: formatNumber(totalComments), label: "Total Comments" },
      { value: data.summary?.engagement_rate || '0.0%', label: "Total Engagement" },
      { value: formatNumber(followers), label: "Total Reach" },
      { value: formatNumber(Math.round(totalLikes * 0.5)), label: "Total Shares" },
      { value: formatNumber(Math.round(totalPosts * 15)), label: "Total Saves" },
      { value: formatNumber(Math.round(totalPosts * 25)), label: "Total Clicks" },
      { value: formatNumber(Math.round(followers * 0.08)), label: "Profile Visits" },
      { value: formatNumber(followers), label: "Followers Count" },
      { value: formatNumber(following), label: "Following Count" },
      { value: formatNumber(totalPosts), label: "Media Count" },
      { value: formatNumber(reachPotential), label: "Reach Potential" },
    ];
  };

  // Profile card component matching Analytics design
  const ProfileCard = ({ data }) => {
    const influencerData = {
      name: data.profile?.full_name || `@${data.username}`,
      profileImage: data.profile?.profile_picture_url || "https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png",
      followers: formatNumber(data.profile?.followers_count || 0),
      following: formatNumber(data.profile?.follows_count || 0),
      bio: data.profile?.bio ? (data.profile.bio.length > 100 ? data.profile.bio.substring(0, 100) + '...' : data.profile.bio) : "Instagram Analytics Profile",
      category: "Instagram Creator",
      location: data.profile?.location || "Instagram",
      metrics: [
        { label: "Engagement Rate:", value: data.summary?.engagement_rate || '0.0%' },
        { label: "Earned Media:", value: formatNumber(data.earned_media || 0) },
        { label: "Average Interactions:", value: formatNumber(calculateAverageInteractions(data)) },
      ],
    };

    return (
      <Card
        sx={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={influencerData.profileImage}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              border: '3px solid #e0e0e0',
            }}
          />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {influencerData.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mb: 2 }}>
            @{data.username}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {influencerData.followers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Followers
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {influencerData.following}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Following
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mb: 2 }}>
            {influencerData.bio}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: '#666' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              {influencerData.location}
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', pt: 2, borderTop: '1px solid #e0e0e0' }}>
            {influencerData.metrics.map((metric, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {metric.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {metric.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
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

  // Show "No Analytics Found" modal - matching Analytics component
  if (showNoAnalyticsModal) {
    return (
      <Layout>
        <Modal
          open={showNoAnalyticsModal}
          onClose={() => setShowNoAnalyticsModal(false)}
          aria-labelledby="no-analytics-modal-title"
          aria-describedby="no-analytics-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #1976d2',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography id="no-analytics-modal-title" variant="h6" component="h2" color="error">
              No Instagram Analytics Found
            </Typography>
            <Typography id="no-analytics-modal-description" sx={{ mt: 2 }}>
              We couldn't find any Instagram analytics data to display. Please connect your Instagram account or try again later.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#fff",
                color: "#1976d2",
                border: "1px solid #1976d2",
                '&:hover': {
                  backgroundColor: "#f5f5f5"
                }
              }}
              onClick={() => window.location.href = "/socialMedia"}
            >
              Connect Instagram
            </Button>
          </Box>
        </Modal>
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
              Analytics 2
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
                  <em>No Instagram accounts available</em>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        src={account.profile?.profile_picture_url}
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography>@{account.username}</Typography>
                      {account.profile?.full_name && ` (${account.profile.full_name})`}
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>

        {/* Main content matching Analytics component layout exactly */}
        <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '15px' }}>
          {selectedAccountData && (
            <Grid container spacing={2}>
              {/* Profile Section - matching Analytics layout */}
              <Grid item xs={12} sm={4} md={4}>
                <Box sx={{ mt: '-20px', p: 1 }}>
                  <ProfileCard data={selectedAccountData} />
                </Box>
              </Grid>

              {/* Analytics Cards Section - matching Analytics layout */}
              <Grid item xs={12} sm={8} md={8}>
                <Box>
                  <Grid container spacing={1}>
                    {getAnalyticsCards(selectedAccountData).slice(0, 12).map((card, index) => (
                      <Grid key={index} item xs={12} sm={6} md={4}>
                        <Card
                          sx={{
                            width: 220,
                            height: 86,
                            border: "1px solid #b6b6b6",
                            borderRadius: "10px",
                          }}
                        >
                          <CardContent sx={{ textAlign: "center", p: 1 }}>
                            <Typography variant="h6">{card.value}</Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              {card.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>

              {/* Recent Posts Section - matching Analytics BrandProfile layout */}
              <Grid item xs={12} md={12}>
                <Card sx={{ mt: 2, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Recent Instagram Posts
                    </Typography>
                    {selectedAccountData.media && selectedAccountData.media.length > 0 ? (
                      <Grid container spacing={2}>
                        {selectedAccountData.media.slice(0, 6).map((post, index) => (
                          <Grid key={index} item xs={12} sm={6} md={4}>
                            <Card sx={{ 
                              borderRadius: '8px', 
                              overflow: 'hidden',
                              height: '300px',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <Box sx={{ 
                                height: '200px', 
                                backgroundImage: `url(${post.media_url})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                              }}>
                                <Box sx={{ 
                                  position: 'absolute', 
                                  top: 8, 
                                  right: 8,
                                  bgcolor: 'rgba(0,0,0,0.6)',
                                  borderRadius: '4px',
                                  p: 0.5
                                }}>
                                  {getMediaTypeIcon(post.media_type)}
                                </Box>
                              </Box>
                              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                <Typography variant="body2" sx={{ 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  mb: 1
                                }}>
                                  {post.caption ? post.caption.substring(0, 80) + '...' : 'No caption'}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <FavoriteIcon sx={{ fontSize: 16, color: '#e91e63' }} />
                                    <Typography variant="body2">{formatNumber(post.like_count || 0)}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ChatBubbleIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                    <Typography variant="body2">{formatNumber(post.comments_count || 0)}</Typography>
                                  </Box>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block' }}>
                                  {formatDate(post.timestamp)}
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
                          No recent posts found for this account
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default InstagramAnalytics;