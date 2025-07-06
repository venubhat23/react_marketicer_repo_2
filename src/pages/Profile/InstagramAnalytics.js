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
  const [loading, setLoading] = useState(false);
  const [showNoDataModal, setShowNoDataModal] = useState(false);

  useEffect(() => {
    fetchInstagramAnalytics();
  }, []);

  const fetchInstagramAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('https://api.marketincer.com/api/v1/instagram_analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success && response.data.data.length > 0) {
        setInstagramData(response.data.data);
        const firstAccount = response.data.data[0];
        setSelectedAccount(firstAccount.username);
        setSelectedAccountData(firstAccount);
      } else {
        setShowNoDataModal(true);
      }
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      setShowNoDataModal(true);
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

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show "No Data Found" modal
  if (showNoDataModal) {
    return (
      <Modal
        open={showNoDataModal}
        onClose={() => setShowNoDataModal(false)}
        aria-labelledby="no-data-modal-title"
        aria-describedby="no-data-modal-description"
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
          <Typography id="no-data-modal-title" variant="h6" component="h2" color="error">
            No Instagram Analytics Found
          </Typography>
          <Typography id="no-data-modal-description" sx={{ mt: 2 }}>
            We couldn't find any Instagram analytics data to display. Please connect your Instagram account first.
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
            onClick={() => window.location.href = "/social"}
          >
            Connect Instagram
          </Button>
        </Box>
      </Modal>
    );
  }

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

          {/* Account Selection */}
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
                    <em>No accounts available</em>
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
                        <InstagramIcon />
                        {account.username}
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>

          {selectedAccountData && (
            <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '15px' }}>
              <Grid container spacing={3}>
                
                {/* Profile Information Card */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar
                        src={selectedAccountData.profile.profile_picture_url}
                        sx={{ width: 100, height: 100, margin: '0 auto 16px' }}
                      />
                      <Typography variant="h5" gutterBottom>
                        @{selectedAccountData.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {selectedAccountData.profile.biography}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {formatNumber(selectedAccountData.profile.followers_count)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Followers
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {formatNumber(selectedAccountData.profile.follows_count)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Following
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="primary">
                            {formatNumber(selectedAccountData.profile.media_count)}
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
                            {selectedAccountData.analytics.total_posts}
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
                            {selectedAccountData.analytics.engagement_stats.total_likes}
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
                            {selectedAccountData.analytics.engagement_stats.total_comments}
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
                            {selectedAccountData.summary.engagement_rate}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Engagement Rate
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Content Performance Summary */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Content Performance
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Most Used Media Type
                        </Typography>
                        <Chip
                          icon={getMediaTypeIcon(selectedAccountData.summary.most_used_media_type)}
                          label={selectedAccountData.summary.most_used_media_type}
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Posting Frequency
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {selectedAccountData.summary.posting_frequency}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Average Engagement per Post
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          {selectedAccountData.analytics.engagement_stats.average_engagement_per_post.toFixed(1)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Media Types Distribution */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Media Types Distribution
                      </Typography>
                      {Object.entries(selectedAccountData.analytics.media_types).map(([type, count]) => (
                        <Box key={type} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getMediaTypeIcon(type)}
                              <Typography variant="body1">{type}</Typography>
                            </Box>
                            <Typography variant="h6" color="primary">
                              {count}
                            </Typography>
                          </Box>
                          <Divider sx={{ mt: 1 }} />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recent Posts */}
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recent Posts
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedAccountData.analytics.recent_posts.map((post, index) => (
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
                                    <Typography variant="caption">{post.likes}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ChatBubbleIcon fontSize="small" color="primary" />
                                    <Typography variant="caption">{post.comments}</Typography>
                                  </Box>
                                </Box>
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
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Performing Posts */}
                {selectedAccountData.analytics.top_performing_posts.length > 0 && (
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Top Performing Posts
                        </Typography>
                        <Grid container spacing={2}>
                          {selectedAccountData.analytics.top_performing_posts.map((post, index) => (
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
                                  />
                                  <Chip
                                    label={`#${index + 1} Best`}
                                    size="small"
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      bgcolor: 'gold',
                                      color: 'black'
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
                                      <Typography variant="caption">{post.likes}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <ChatBubbleIcon fontSize="small" color="primary" />
                                      <Typography variant="caption">{post.comments}</Typography>
                                    </Box>
                                  </Box>
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
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstagramAnalytics;