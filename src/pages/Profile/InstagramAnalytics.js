import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Modal, Button,
  Chip, Divider, Link as MuiLink, Container, Stack,
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
import Sidebar from '../../components/Sidebar';
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
  const [showNoDataModal, setShowNoDataModal] = useState(false);
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

  const getEngagementColor = (rate) => {
    const numRate = parseFloat(rate);
    if (numRate >= 5) return '#4caf50';
    if (numRate >= 3) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f5f7fa'
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: { xs: '80px', md: '240px' }, 
        flexShrink: 0,
        backgroundColor: '#091a48',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        marginLeft: { xs: '80px', md: '240px' },
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            backgroundColor: '#091a48',
            borderRadius: 0,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ 
                color: '#fff', 
                fontWeight: 600,
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}>
                Instagram Analytics
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
          overflow: 'auto'
        }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '60vh',
              flexDirection: 'column'
            }}>
              <CircularProgress size={60} sx={{ color: '#091a48' }} />
              <Typography sx={{ mt: 2, color: '#666' }}>Loading Instagram analytics...</Typography>
            </Box>
          ) : error ? (
            <Card sx={{ 
              p: 4, 
              textAlign: 'center',
              maxWidth: '600px',
              mx: 'auto',
              mt: 4,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <InstagramIcon sx={{ fontSize: 80, color: '#E1306C', mb: 2 }} />
              <Typography variant="h5" color="error" gutterBottom fontWeight={600}>
                Error Loading Data
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                {error}
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  onClick={fetchInstagramAnalytics}
                  sx={{ 
                    bgcolor: '#091a48',
                    '&:hover': { bgcolor: '#0f2454' },
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Retry
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.href = "/socialMedia"}
                  sx={{ borderRadius: 2, px: 3 }}
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
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <InstagramIcon sx={{ fontSize: 80, color: '#E1306C', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight={600}>
                No Instagram Analytics Found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                Connect your Instagram account to view analytics and insights.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<InstagramIcon />}
                onClick={() => window.location.href = "/socialMedia"}
                sx={{ 
                  bgcolor: '#E1306C',
                  '&:hover': { bgcolor: '#c92a5c' },
                  borderRadius: 2,
                  px: 4,
                  py: 1.5
                }}
              >
                Connect Instagram Account
              </Button>
            </Card>
          ) : (
            <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto' }}>
              {/* Account Selection */}
              <Card sx={{ 
                p: 3, 
                mb: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <InstagramIcon sx={{ fontSize: 30 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Select Instagram Account
                  </Typography>
                  <FormControl sx={{ minWidth: 300 }}>
                    <Select
                      value={selectedAccount}
                      onChange={handleAccountChange}
                      displayEmpty
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.95)',
                        borderRadius: 2,
                        height: '45px',
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
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography>@{account.username}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Card>

              {selectedAccountData && (
                <Grid container spacing={3}>
                  {/* Profile Card */}
                  <Grid item xs={12} md={4}>
                    <Card sx={{ 
                      height: '100%', 
                      borderRadius: 3, 
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        background: 'linear-gradient(135deg, #E1306C 0%, #fd8856 100%)',
                        p: 4,
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <Avatar
                          src={selectedAccountData.profile?.profile_picture_url}
                          sx={{ 
                            width: 100, 
                            height: 100, 
                            margin: '0 auto 20px',
                            border: '4px solid rgba(255,255,255,0.2)'
                          }}
                        />
                        <Typography variant="h5" gutterBottom fontWeight={600}>
                          @{selectedAccountData.username}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Intelligent Smart power
                        </Typography>
                      </Box>
                      <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="primary" fontWeight={600}>
                                {formatNumber(selectedAccountData.profile?.followers_count || 1)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Followers
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="primary" fontWeight={600}>
                                {formatNumber(selectedAccountData.profile?.follows_count || 21)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Following
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h4" color="primary" fontWeight={600}>
                                {formatNumber(selectedAccountData.profile?.media_count || 1)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Posts
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Analytics Cards */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                      <Grid item xs={6} lg={3}>
                        <Card sx={{ 
                          height: '200px',
                          borderRadius: 3, 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                          <CardContent sx={{ 
                            textAlign: 'center', 
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%'
                          }}>
                            <PhotoIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                              {selectedAccountData.analytics?.total_posts || 1}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              Total Posts
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} lg={3}>
                        <Card sx={{ 
                          height: '200px',
                          borderRadius: 3, 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                          <CardContent sx={{ 
                            textAlign: 'center', 
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%'
                          }}>
                            <FavoriteIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                              {formatNumber(selectedAccountData.analytics?.engagement_stats?.total_likes || 0)}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              Total Likes
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} lg={3}>
                        <Card sx={{ 
                          height: '200px',
                          borderRadius: 3, 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                          <CardContent sx={{ 
                            textAlign: 'center', 
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%'
                          }}>
                            <ChatBubbleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                              {formatNumber(selectedAccountData.analytics?.engagement_stats?.total_comments || 0)}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              Total Comments
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} lg={3}>
                        <Card sx={{ 
                          height: '200px',
                          borderRadius: 3, 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                          <CardContent sx={{ 
                            textAlign: 'center', 
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%'
                          }}>
                            <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                              {selectedAccountData.summary?.engagement_rate || '0.0%'}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                              Engagement Rate
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Recent Posts */}
                  {selectedAccountData.analytics?.recent_posts && selectedAccountData.analytics.recent_posts.length > 0 && (
                    <Grid item xs={12} sx={{ mt: 3 }}>
                      <Card sx={{ 
                        borderRadius: 3, 
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          p: 4,
                          color: 'white'
                        }}>
                          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                            Recent Posts ({selectedAccountData.analytics.recent_posts.length})
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            Your latest Instagram content performance
                          </Typography>
                        </Box>
                        <CardContent sx={{ p: 4 }}>
                          <Grid container spacing={3}>
                            {selectedAccountData.analytics.recent_posts.map((post, index) => (
                              <Grid item xs={12} sm={6} md={4} lg={3} key={post.id || index}>
                                <Card sx={{ 
                                  borderRadius: 3, 
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                  overflow: 'hidden',
                                  transition: 'transform 0.2s',
                                  '&:hover': { transform: 'translateY(-4px)' }
                                }}>
                                  <Box sx={{ position: 'relative' }}>
                                    <img
                                      src={post.media_url}
                                      alt={post.caption || 'Instagram post'}
                                      style={{
                                        width: '100%',
                                        height: 250,
                                        objectFit: 'cover'
                                      }}
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x250?text=No+Image';
                                      }}
                                    />
                                    <Chip
                                      icon={getMediaTypeIcon(post.type)}
                                      label={post.type}
                                      size="small"
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        borderRadius: 2
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
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          minHeight: '40px'
                                        }}
                                      >
                                        {post.caption || 'No caption'}
                                      </Typography>
                                    </Tooltip>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                      {new Date(post.timestamp).toLocaleDateString()}
                                    </Typography>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center',
                                      gap: 1
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <FavoriteIcon fontSize="small" sx={{ color: '#E1306C' }} />
                                        <Typography variant="body2" fontWeight={500}>
                                          {formatNumber(post.likes || 0)}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ChatBubbleIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                        <Typography variant="body2" fontWeight={500}>
                                          {formatNumber(post.comments || 0)}
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
                                          mt: 2,
                                          borderRadius: 2,
                                          textTransform: 'none'
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
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default InstagramAnalytics;