import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Button,
  Chip, Divider, Container, Stack,
  Badge, Tooltip
} from "@mui/material";
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
import InteractiveIcon from '@mui/icons-material/TouchApp';
import Layout from '../../components/Layout';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
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
      }
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      setError(`API Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (e) => {
    const username = e.target.value;
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

  return (
    <Layout>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f1f5f9'
      }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            backgroundColor: '#0f172a',
            borderRadius: 0,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InstagramIcon sx={{ color: '#E1306C', fontSize: 32 }} />
              <Typography variant="h4" sx={{ 
                color: '#fff', 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}>
                Analytics Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="large" sx={{ color: '#fff' }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton size="large" sx={{ color: '#fff' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Content Container */}
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 3 },
          overflow: 'auto',
          maxWidth: '100%'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '60vh',
              flexDirection: 'column'
            }}>
              <CircularProgress size={60} sx={{ color: '#E1306C' }} />
              <Typography sx={{ mt: 2, color: '#64748b', fontSize: '1.1rem' }}>
                Loading Instagram analytics...
              </Typography>
            </Box>
          ) : error ? (
            <Card sx={{ 
              p: 4, 
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              mt: 4,
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <InstagramIcon sx={{ fontSize: 80, color: '#E1306C', mb: 2 }} />
              <Typography variant="h5" color="error" gutterBottom fontWeight={600}>
                Error Loading Data
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#64748b' }}>
                {error}
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  onClick={fetchInstagramAnalytics}
                  sx={{ 
                    bgcolor: '#0f172a',
                    '&:hover': { bgcolor: '#1e293b' },
                    borderRadius: 3,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Retry
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.href = "/socialMedia"}
                  sx={{ borderRadius: 3, px: 4, py: 1.5 }}
                >
                  Connect Instagram
                </Button>
              </Stack>
            </Card>
          ) : instagramData.length === 0 ? (
            <Card sx={{ 
              p: 4, 
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              mt: 4,
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <InstagramIcon sx={{ fontSize: 80, color: '#E1306C', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                No Instagram Analytics Found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#64748b' }}>
                Connect your Instagram account to view analytics and insights.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<InstagramIcon />}
                onClick={() => window.location.href = "/socialMedia"}
                sx={{ 
                  bgcolor: '#E1306C',
                  '&:hover': { bgcolor: '#c92a5c' },
                  borderRadius: 3,
                  px: 4,
                  py: 1.5
                }}
              >
                Connect Instagram Account
              </Button>
            </Card>
          ) : (
            <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
              {/* Account Selection */}
              <Card sx={{ 
                p: { xs: 2, md: 3 }, 
                mb: 4, 
                borderRadius: 4,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <InstagramIcon sx={{ fontSize: 36 }} />
                  <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Select Instagram Account
                  </Typography>
                  <FormControl sx={{ minWidth: { xs: 250, md: 300 } }}>
                    <Select
                      value={selectedAccount}
                      onChange={handleAccountChange}
                      displayEmpty
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.95)',
                        borderRadius: 3,
                        height: '50px',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }}
                    >
                      {instagramData.map((account, index) => (
                        <MenuItem
                          key={`${account.username}-${index}`}
                          value={account.username}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar 
                              src={account.profile?.profile_picture_url}
                              sx={{ width: 28, height: 28 }}
                            />
                            <Typography fontWeight={500}>@{account.username}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Card>

              {selectedAccountData && (
                <>
                  {/* First Row: Combined Profile & Campaign Analytics */}
                  <Card sx={{ 
                    borderRadius: 4, 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    mb: 4
                  }}>
                    <Grid container>
                      {/* Profile Section */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          background: 'linear-gradient(135deg, #E1306C 0%, #fd8856 100%)',
                          p: 4,
                          color: 'white',
                          textAlign: 'center',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <Avatar
                            src={selectedAccountData.profile?.profile_picture_url}
                            sx={{ 
                              width: 100, 
                              height: 100, 
                              margin: '0 auto 16px',
                              border: '4px solid rgba(255,255,255,0.2)',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                            }}
                          />
                          <Typography variant="h5" gutterBottom fontWeight={700}>
                            {selectedAccountData.profile?.full_name || `@${selectedAccountData.username}`}
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                            @{selectedAccountData.username}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <PeopleIcon sx={{ fontSize: 20 }} />
                              <Typography variant="h6" fontWeight={600}>
                                {formatNumber(selectedAccountData.profile?.followers_count || 0)} Followers
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <TrendingUpIcon sx={{ fontSize: 20 }} />
                              <Typography variant="body1" fontWeight={600}>
                                {selectedAccountData.summary?.engagement_rate || '0.0%'} Engagement
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <AttachMoneyIcon sx={{ fontSize: 20 }} />
                              <Typography variant="body1" fontWeight={600}>
                                ${formatNumber(selectedAccountData.earned_media || 0)} Earned Media
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <InteractiveIcon sx={{ fontSize: 20 }} />
                              <Typography variant="body1" fontWeight={600}>
                                {formatNumber(calculateAverageInteractions(selectedAccountData))} Avg Interactions
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {/* Campaign Analytics Section */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ 
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          p: 3,
                          color: 'white'
                        }}>
                          <Typography variant="h5" fontWeight={700} gutterBottom>
                            Campaign Analytics
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Comprehensive performance metrics and insights
                          </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            overflowX: 'auto',
                            pb: 1,
                            '&::-webkit-scrollbar': {
                              height: 6,
                            },
                            '&::-webkit-scrollbar-track': {
                              backgroundColor: '#f1f5f9',
                              borderRadius: 3,
                            },
                            '&::-webkit-scrollbar-thumb': {
                              backgroundColor: '#cbd5e1',
                              borderRadius: 3,
                            }
                          }}>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.profile?.followers_count || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Followers Count
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.profile?.follows_count || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Follows Count
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.profile?.media_count || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Media Count
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#E1306C' }} fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.analytics?.engagement_stats?.total_likes || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Total Likes
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#1976d2' }} fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.analytics?.engagement_stats?.total_comments || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Total Comments
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#10b981' }} fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.analytics?.engagement_stats?.total_engagement || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Total Engagement
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#f59e0b' }} fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.analytics?.engagement_stats?.average_likes_per_post || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Avg Likes per Post
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#8b5cf6' }} fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.analytics?.engagement_stats?.average_comments_per_post || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Avg Comments per Post
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#ef4444' }} fontWeight={700} gutterBottom>
                                 {formatNumber(selectedAccountData.analytics?.engagement_stats?.average_engagement_per_post || 0)}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Avg Engagement per Post
                               </Typography>
                             </Box>
                             <Box sx={{ textAlign: 'center', minWidth: 120, p: 1 }}>
                               <Typography variant="h5" sx={{ color: '#06b6d4' }} fontWeight={700} gutterBottom>
                                 {selectedAccountData.summary?.engagement_rate || '0.0%'}
                               </Typography>
                               <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                 Engagement Rate
                               </Typography>
                             </Box>
                           </Box>
                         </CardContent>
                      </Grid>
                    </Grid>
                  </Card>

                  {/* Second Row: Recent Posts */}
                  {selectedAccountData.analytics?.recent_posts && selectedAccountData.analytics.recent_posts.length > 0 && (
                    <Card sx={{ 
                      borderRadius: 4, 
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      mb: 4
                    }}>
                      <Box sx={{ 
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        p: 4,
                        color: 'white'
                      }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Recent Posts
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Your latest Instagram content performance ({selectedAccountData.analytics.recent_posts.length} posts)
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                          {selectedAccountData.analytics.recent_posts.map((post, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={post.id || index}>
                              <Card sx={{ 
                                borderRadius: 4, 
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                  transform: 'translateY(-8px)',
                                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                                }
                              }}>
                                <Box sx={{ position: 'relative' }}>
                                  <img
                                    src={post.media_url}
                                    alt={post.caption || 'Instagram post'}
                                    style={{
                                      width: '100%',
                                      height: 280,
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/300x280?text=No+Image';
                                    }}
                                  />
                                  <Chip
                                    icon={getMediaTypeIcon(post.type)}
                                    label={post.type}
                                    size="small"
                                    sx={{
                                      position: 'absolute',
                                      top: 12,
                                      right: 12,
                                      bgcolor: 'rgba(0,0,0,0.8)',
                                      color: 'white',
                                      borderRadius: 2,
                                      fontWeight: 600
                                    }}
                                  />
                                </Box>
                                <CardContent sx={{ p: 3 }}>
                                  <Tooltip title={post.caption || 'No caption'}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        minHeight: '60px',
                                        fontWeight: 500
                                      }}
                                    >
                                      {post.caption || 'No caption'}
                                    </Typography>
                                  </Tooltip>
                                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', fontWeight: 500 }}>
                                    {formatDate(post.timestamp)}
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 2
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <FavoriteIcon fontSize="small" sx={{ color: '#E1306C' }} />
                                      <Typography variant="body2" fontWeight={600}>
                                        {formatNumber(post.likes || 0)}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <ChatBubbleIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                      <Typography variant="body2" fontWeight={600}>
                                        {formatNumber(post.comments || 0)}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                                      <Typography variant="body2" fontWeight={600}>
                                        {formatNumber(post.engagement || 0)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  {post.url && (
                                    <Button
                                      fullWidth
                                      variant="outlined"
                                      size="small"
                                      startIcon={<InstagramIcon />}
                                      href={post.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ 
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        py: 1
                                      }}
                                    >
                                      View on Instagram
                                    </Button>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                  {/* Third Row: Top Performing Posts */}
                  {selectedAccountData.analytics?.top_performing_posts && selectedAccountData.analytics.top_performing_posts.length > 0 && (
                    <Card sx={{ 
                      borderRadius: 4, 
                      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        p: 4,
                        color: 'white'
                      }}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          Top Performing Posts
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          Your best-performing Instagram content ({selectedAccountData.analytics.top_performing_posts.length} posts)
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 3, 
                          overflowX: 'auto',
                          pb: 2,
                          '&::-webkit-scrollbar': {
                            height: 6,
                          },
                          '&::-webkit-scrollbar-track': {
                            backgroundColor: '#f1f5f9',
                            borderRadius: 3,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#cbd5e1',
                            borderRadius: 3,
                          }
                        }}>
                          {selectedAccountData.analytics.top_performing_posts.map((post, index) => (
                            <Card key={post.id || index} sx={{ 
                              minWidth: 320,
                              borderRadius: 4, 
                              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                              overflow: 'hidden',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              '&:hover': { 
                                transform: 'translateY(-8px)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                              }
                            }}>
                              <Box sx={{ position: 'relative' }}>
                                <img
                                  src={post.media_url}
                                  alt={post.caption || 'Instagram post'}
                                  style={{
                                    width: '100%',
                                    height: 280,
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/320x280?text=No+Image';
                                  }}
                                />
                                <Chip
                                  icon={<TrendingUpIcon />}
                                  label={`#${index + 1} Top Post`}
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    bgcolor: 'rgba(16,185,129,0.9)',
                                    color: 'white',
                                    borderRadius: 2,
                                    fontWeight: 700
                                  }}
                                />
                                <Chip
                                  icon={getMediaTypeIcon(post.type)}
                                  label={post.type}
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    bgcolor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    borderRadius: 2,
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                              <CardContent sx={{ p: 3 }}>
                                <Tooltip title={post.caption || 'No caption'}>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      mb: 2,
                                      display: '-webkit-box',
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                      minHeight: '60px',
                                      fontWeight: 500
                                    }}
                                  >
                                    {post.caption || 'No caption'}
                                  </Typography>
                                </Tooltip>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', fontWeight: 500 }}>
                                  {formatDate(post.timestamp)}
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 2
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <FavoriteIcon fontSize="small" sx={{ color: '#E1306C' }} />
                                    <Typography variant="body2" fontWeight={600}>
                                      {formatNumber(post.likes || 0)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ChatBubbleIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                    <Typography variant="body2" fontWeight={600}>
                                      {formatNumber(post.comments || 0)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                                    <Typography variant="body2" fontWeight={600}>
                                      {formatNumber(post.engagement || 0)}
                                    </Typography>
                                  </Box>
                                </Box>
                                {post.url && (
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    size="small"
                                    startIcon={<InstagramIcon />}
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ 
                                      borderRadius: 3,
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      py: 1,
                                      bgcolor: '#E1306C',
                                      '&:hover': { bgcolor: '#c92a5c' }
                                    }}
                                  >
                                    View on Instagram
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </Container>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default InstagramAnalytics;