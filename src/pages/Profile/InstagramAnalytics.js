import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Modal, Button,
  Chip, Divider, Link as MuiLink
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12} md={1} className="side_section">
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={11}>
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
                Influencer Analytics
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

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, padding: '15px' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading Instagram analytics...</Typography>
              </Box>
            ) : error ? (
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Error Loading Data
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={fetchInstagramAnalytics}
                  sx={{ mr: 2 }}
                >
                  Retry
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => window.location.href = "/socialMedia"}
                >
                  Connect Instagram
                </Button>
              </Card>
            ) : instagramData.length === 0 ? (
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <InstagramIcon sx={{ fontSize: 60, color: '#E1306C', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Instagram Analytics Found
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Connect your Instagram account to view analytics and insights.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<InstagramIcon />}
                  onClick={() => window.location.href = "/socialMedia"}
                >
                  Connect Instagram Account
                </Button>
              </Card>
            ) : (
              <>
                {/* Account Selection */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    bgcolor: '#B1C6FF',
                    padding: '10px',
                    borderRadius: 1,
                    mb: 3
                  }}
                >
                  <FormControl>
                    <Select
                      value={selectedAccount}
                      onChange={handleAccountChange}
                      displayEmpty
                      sx={{
                        width: '300px',
                        bgcolor: '#fff',
                        borderRadius: '50px',
                        height: '40px',
                      }}
                    >
                      {instagramData.map((account, index) => (
                        <MenuItem
                          key={`${account.username}-${index}`}
                          value={account.username}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InstagramIcon />
                            {account.username}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {selectedAccountData && (
                  <Grid container spacing={3}>
                    
                    {/* Profile Information Card */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Avatar
                            src={selectedAccountData.profile?.profile_picture_url}
                            sx={{ width: 100, height: 100, margin: '0 auto 16px' }}
                          />
                          <Typography variant="h5" gutterBottom>
                            @{selectedAccountData.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {selectedAccountData.profile?.biography || 'No bio available'}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" color="primary">
                                {formatNumber(selectedAccountData.profile?.followers_count)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Followers
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" color="primary">
                                {formatNumber(selectedAccountData.profile?.follows_count)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Following
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" color="primary">
                                {formatNumber(selectedAccountData.profile?.media_count)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Posts
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Analytics Overview Cards */}
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#E3F2FD' }}>
                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h5" color="primary">
                                {selectedAccountData.analytics?.total_posts || 0}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Posts
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#FCE4EC' }}>
                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h5" color="error">
                                {selectedAccountData.analytics?.engagement_stats?.total_likes || 0}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Likes
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#F3E5F5' }}>
                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h5" color="secondary">
                                {selectedAccountData.analytics?.engagement_stats?.total_comments || 0}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Total Comments
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Card sx={{ borderRadius: 2, boxShadow: 2, bgcolor: '#E8F5E8' }}>
                            <CardContent sx={{ textAlign: 'center', p: 2 }}>
                              <Typography variant="h5" color="success.main">
                                {selectedAccountData.summary?.engagement_rate || '0%'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Engagement Rate
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Recent Posts */}
                    {selectedAccountData.analytics?.recent_posts && selectedAccountData.analytics.recent_posts.length > 0 && (
                      <Grid item xs={12}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Recent Posts
                            </Typography>
                            <Grid container spacing={2}>
                              {selectedAccountData.analytics.recent_posts.slice(0, 8).map((post, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                                  <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                                    <Box sx={{ position: 'relative' }}>
                                      <img
                                        src={post.media_url}
                                        alt={post.caption}
                                        style={{
                                          width: '100%',
                                          height: 200,
                                          objectFit: 'cover',
                                          borderRadius: '8px 8px 0 0'
                                        }}
                                        onError={(e) => {
                                          e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
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
                                          color: 'white'
                                        }}
                                      />
                                    </Box>
                                    <CardContent sx={{ p: 2 }}>
                                      <Typography variant="body2" noWrap sx={{ mb: 1 }}>
                                        {post.caption || 'No caption'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                        {new Date(post.timestamp).toLocaleDateString()}
                                      </Typography>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <FavoriteIcon fontSize="small" color="error" />
                                          <Typography variant="caption">{post.likes || 0}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <ChatBubbleIcon fontSize="small" color="primary" />
                                          <Typography variant="caption">{post.comments || 0}</Typography>
                                        </Box>
                                      </Box>
                                      {post.url && (
                                        <MuiLink
                                          href={post.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                                        >
                                          <Button size="small" variant="outlined" startIcon={<InstagramIcon />}>
                                            View on Instagram
                                          </Button>
                                        </MuiLink>
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
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstagramAnalytics;