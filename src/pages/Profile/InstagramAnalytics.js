import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Button,
  Chip, Container, Stack, Modal, Tooltip,
  LinearProgress, Divider
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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MouseIcon from '@mui/icons-material/Mouse';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import ImageIcon from '@mui/icons-material/Image';
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

  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'IMAGE':
        return <PhotoIcon sx={{ color: '#fff', fontSize: 16 }} />;
      case 'VIDEO':
        return <VideoLibraryIcon sx={{ color: '#fff', fontSize: 16 }} />;
      default:
        return <PhotoIcon sx={{ color: '#fff', fontSize: 16 }} />;
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

  // Enhanced analytics cards with beautiful icons and styling
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
      { 
        value: formatNumber(totalLikes), 
        label: "Total Likes", 
        icon: <FavoriteIcon sx={{ color: '#e91e63', fontSize: 20 }} />,
        color: '#e91e63',
        bgColor: '#fce4ec'
      },
      { 
        value: formatNumber(totalComments), 
        label: "Total Comments", 
        icon: <ChatBubbleIcon sx={{ color: '#2196f3', fontSize: 20 }} />,
        color: '#2196f3',
        bgColor: '#e3f2fd'
      },
      { 
        value: engagementRate, 
        label: "Engagement Rate", 
        icon: <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 20 }} />,
        color: '#4caf50',
        bgColor: '#e8f5e8'
      },
      { 
        value: formatNumber(followers), 
        label: "Followers", 
        icon: <PeopleIcon sx={{ color: '#ff9800', fontSize: 20 }} />,
        color: '#ff9800',
        bgColor: '#fff3e0'
      },
      { 
        value: formatNumber(Math.round(totalLikes * 0.5)), 
        label: "Estimated Shares", 
        icon: <ShareIcon sx={{ color: '#9c27b0', fontSize: 20 }} />,
        color: '#9c27b0',
        bgColor: '#f3e5f5'
      },
      { 
        value: formatNumber(Math.round(totalPosts * 15)), 
        label: "Estimated Saves", 
        icon: <BookmarkIcon sx={{ color: '#795548', fontSize: 20 }} />,
        color: '#795548',
        bgColor: '#efebe9'
      },
      { 
        value: formatNumber(Math.round(totalPosts * 25)), 
        label: "Estimated Clicks", 
        icon: <MouseIcon sx={{ color: '#607d8b', fontSize: 20 }} />,
        color: '#607d8b',
        bgColor: '#eceff1'
      },
      { 
        value: formatNumber(Math.round(followers * 0.08)), 
        label: "Profile Visits", 
        icon: <VisibilityIcon sx={{ color: '#00bcd4', fontSize: 20 }} />,
        color: '#00bcd4',
        bgColor: '#e0f2f1'
      },
      { 
        value: formatNumber(following), 
        label: "Following", 
        icon: <PersonIcon sx={{ color: '#3f51b5', fontSize: 20 }} />,
        color: '#3f51b5',
        bgColor: '#e8eaf6'
      },
      { 
        value: formatNumber(mediaCount), 
        label: "Media Count", 
        icon: <ImageIcon sx={{ color: '#ff5722', fontSize: 20 }} />,
        color: '#ff5722',
        bgColor: '#fbe9e7'
      },
      { 
        value: formatNumber(Math.round(followers * 0.15)), 
        label: "Reach Potential", 
        icon: <GroupsIcon sx={{ color: '#8bc34a', fontSize: 20 }} />,
        color: '#8bc34a',
        bgColor: '#f1f8e9'
      },
      { 
        value: formatNumber(calculateAverageInteractions(data)), 
        label: "Avg. Interactions", 
        icon: <InteractiveIcon sx={{ color: '#673ab7', fontSize: 20 }} />,
        color: '#673ab7',
        bgColor: '#ede7f6'
      },
    ];
  };

  // Enhanced Profile card with beautiful styling
  const ProfileCard = ({ data }) => {
    const influencerData = {
      name: data.page_name || `@${data.username}`,
      profileImage: data.profile?.profile_picture_url || "https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png",
      followers: formatNumber(data.profile?.followers_count || 0),
      following: formatNumber(data.profile?.follows_count || 0),
      bio: data.profile?.biography ? (data.profile.biography.length > 100 ? data.profile.biography.substring(0, 100) + '...' : data.profile.biography) : "Instagram Analytics Profile",
      category: "Instagram Creator",
      location: "Instagram",
      mediaCount: formatNumber(data.profile?.media_count || 0),
      engagementRate: data.summary?.engagement_rate || '0.0%',
      metrics: [
        { label: "Engagement Rate:", value: data.summary?.engagement_rate || '0.0%' },
        { label: "Most Used Media:", value: data.summary?.most_used_media_type || 'IMAGE' },
        { label: "Posting Frequency:", value: data.summary?.posting_frequency || 'N/A' },
      ],
    };

    return (
      <Card
        sx={{
          width: '100%',
          height: 'auto',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Avatar
            src={influencerData.profileImage}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {influencerData.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center', mb: 3 }}>
            @{data.username}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%', mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {influencerData.followers}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Followers
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {influencerData.following}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Following
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {influencerData.mediaCount}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Posts
              </Typography>
            </Box>
          </Box>
          
          <Card sx={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', p: 2, mb: 3 }}>
            <Typography variant="body2" sx={{ textAlign: 'center', lineHeight: 1.6 }}>
              {influencerData.bio}
            </Typography>
          </Card>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <InstagramIcon sx={{ fontSize: 20, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {influencerData.location}
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            {influencerData.metrics.map((metric, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
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
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2, color: '#667eea' }} />
            <Typography variant="h6" sx={{ color: '#667eea', mb: 1 }}>
              Loading Instagram Analytics...
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please wait while we fetch your data
            </Typography>
          </Box>
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
            {/* Profile Section - matching Analytics exact Grid structure */}
            <Grid item xs={12} sm={4} md={4} sx={{ mt: '-20px', p: 1 }}>
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

            {/* Analytics Cards Section - matching Analytics exact Grid structure */}
            {selectedAccountData && (
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
            )}

            {/* Recent Posts Section - matching Analytics exact Grid structure */}
            <Grid item xs={12} sm={12} md={12}>
              <Card sx={{ mt: 2, borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                    Recent Instagram Posts
                  </Typography>
                  {selectedAccountData && selectedAccountData.analytics?.recent_posts && selectedAccountData.analytics.recent_posts.length > 0 ? (
                    <Grid container spacing={2}>
                      {selectedAccountData.analytics.recent_posts.slice(0, 6).map((post, index) => (
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
                                {getMediaTypeIcon(post.type)}
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
                                  <Typography variant="body2">{formatNumber(post.likes || 0)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <ChatBubbleIcon sx={{ fontSize: 16, color: '#2196f3' }} />
                                  <Typography variant="body2">{formatNumber(post.comments || 0)}</Typography>
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
                        {instagramData.length === 0 
                          ? 'Loading Instagram posts...' 
                          : selectedAccountData 
                            ? 'No recent posts found for this account' 
                            : 'Please select an Instagram account'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default InstagramAnalytics;