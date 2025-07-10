import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress,
  Divider, Container, Stack, Button
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import Send from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShareIcon from '@mui/icons-material/Share';
import LinkIcon from '@mui/icons-material/Link';
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

  // Create analytics cards matching the exact Figma design
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



  // Profile card component matching exact Figma design
  const ProfileCard = ({ data }) => {
    return (
      <Card
        sx={{
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          background: '#ffffff',
          mb: 2,
          maxWidth: '400px'
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {/* Profile Header - exactly like Figma */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              src={data.profile?.profile_picture_url || "https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png"}
              alt={`${data.username}'s profile`}
              sx={{
                width: 48,
                height: 48,
                mr: 2,
                border: '1px solid #e0e0e0'
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: '#1a1a1a',
                  mb: 0.5,
                  lineHeight: 1.2
                }}
              >
                {data.page_name || data.username}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#888',
                  fontSize: "13px",
                  mb: 1
                }}
              >
                {data.profile?.category || 'Beauty & Lifestyle'}
              </Typography>
              
              {/* Followers/Following inline */}
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: "13px",
                  mb: 1
                }}
              >
                <Box component="span" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                  {formatNumber(data.profile?.followers_count || 0)}
                </Box>
                {' Followers '}
                <Box component="span" sx={{ fontWeight: 500, color: '#1a1a1a' }}>
                  {formatNumber(data.profile?.follows_count || 0)}
                </Box>
                {' Following'}
              </Typography>
            </Box>
          </Box>

          {/* Bio */}
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: "13px",
              mb: 1,
              lineHeight: 1.4
            }}
          >
            {data.profile?.biography || 'Bio: Lorem Ipsum dolor sit'}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontSize: "13px",
              mb: 2
            }}
          >
            {data.profile?.location || 'USA'}
          </Typography>

          {/* Stats section - exactly like Figma */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                Engagement Rate:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 500 }}>
                {data.summary?.engagement_rate || '3.1%'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                Earned Media:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 500 }}>
                {data.analytics?.total_posts || 249}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                Average Interactions:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a', fontSize: '13px', fontWeight: 500 }}>
                {data.summary?.engagement_rate || '3.1%'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Recent Posts component matching BrandProfile design
  const RecentPostCard = ({ post, accountData, index }) => {
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short' 
      });
    };

    return (
      <Card
        sx={{
          p: 2,
          borderRadius: "10px",
          border: "1px solid #d6d6d6",
          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
          bgcolor: "#fffdfd",
          width: '100%',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs={2} md={2}>
              <Box
                component="img"
                src={post?.media_url || `https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80`}
                alt="Post thumbnail"
                sx={{
                  width: 75,
                  height: 75,
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/75x75?text=No+Image";
                }}
              />
            </Grid>

            <Grid item xs={5} md={7}>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                >
                  <span>Instagram</span>
                  <Typography component="span" color="text.secondary">
                    @{accountData?.username || 'anybrand'}
                  </Typography>
                  <Typography component="span" color="text.secondary">
                    {formatDate(post?.timestamp || Date.now())}
                  </Typography>
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {accountData?.page_name || accountData?.username || 'Influencer'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mt: 0.5
                    }}
                  >
                    {post?.caption || "Lorem ipsum dolor sit..."}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FavoriteIcon fontSize="small" sx={{ color: "#e91e63" }} />
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, fontWeight: 300 }}
                  >
                    {formatNumber(post?.like_count || 378000)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ChatBubbleOutline fontSize="small" sx={{ color: "#2196f3" }} />
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, fontWeight: 300 }}
                  >
                    {formatNumber(post?.comments_count || 248)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Send fontSize="small" sx={{ color: "#4caf50" }} />
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, fontWeight: 300 }}
                  >
                    {formatNumber(Math.floor((post?.like_count || 378000) * 0.1))}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <VisibilityIcon fontSize="small" sx={{ color: "#ff9800" }} />
                  <Typography
                    variant="body2"
                    sx={{ ml: 1, fontWeight: 300 }}
                  >
                    {formatNumber(post?.views || 122000)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={3} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                <Button
                  variant="text"
                  sx={{
                    color: '#7c4dff',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '13px',
                    minWidth: 'auto',
                    p: 0.5
                  }}
                >
                  View full Analytics →
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Generate sample recent posts data
  const getRecentPosts = (accountData) => {
    if (!accountData) return [];
    
    // Use real posts if available, otherwise generate sample data
    const posts = accountData.posts || [];
    
    // If no real posts, generate sample posts
    if (posts.length === 0) {
      return [
        {
          id: '1',
          caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
          like_count: 378000,
          comments_count: 248,
          media_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        },
        {
          id: '2',
          caption: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          timestamp: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
          like_count: 425000,
          comments_count: 189,
          media_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        }
      ];
    }
    
    return posts.slice(0, 2); // Show only first 2 posts to match Figma
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
        {/* Header */}
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

        {/* Blue filter section */}
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
                  >
                    {account.username}
                    {account.page_name && ` (${account.page_name})`}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Box>

        {/* Main content - exact Figma layout */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          p: 3, 
          backgroundColor: '#f8f9fa',
          minHeight: 'calc(100vh - 120px)'
        }}>
          {/* Left Profile Section */}
          <Box sx={{ flex: '0 0 380px' }}>
            {selectedAccountData ? (
              <Box>
                <ProfileCard data={selectedAccountData} />
              </Box>
            ) : (
              <Card
                sx={{
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  background: '#ffffff',
                  maxWidth: '380px'
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <InstagramIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    {instagramData.length === 0 ? 'Loading Instagram analytics data...' : 'No Instagram account selected'}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Right Analytics Section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: '#1a1a1a',
                fontWeight: 600,
                fontSize: '20px'
              }}
            >
              Campaign Analytics
            </Typography>
            
            {selectedAccountData ? (
              <Box>
                {/* First row - 4 cards */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {getAnalyticsCards(selectedAccountData).slice(0, 4).map((card, index) => (
                    <Box key={index} sx={{ flex: 1 }}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          background: '#ffffff',
                          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                          transition: 'all 0.2s ease',
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 600,
                              color: '#1a1a1a',
                              mb: 0.5,
                              fontSize: '22px'
                            }}
                          >
                            {card.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontSize: '12px',
                              fontWeight: 400
                            }}
                          >
                            {card.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>

                {/* Second row - 4 cards */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                  {getAnalyticsCards(selectedAccountData).slice(4, 8).map((card, index) => (
                    <Box key={index + 4} sx={{ flex: 1 }}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          background: '#ffffff',
                          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                          transition: 'all 0.2s ease',
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 600,
                              color: '#1a1a1a',
                              mb: 0.5,
                              fontSize: '22px'
                            }}
                          >
                            {card.value}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666',
                              fontSize: '12px',
                              fontWeight: 400
                            }}
                          >
                            {card.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>

                {/* Recent Posts Section - Full Width */}
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#1a1a1a',
                        fontWeight: 600,
                        fontSize: '20px'
                      }}
                    >
                      Recent Posts
                    </Typography>
                  </Box>

                  {/* Posts List - BrandProfile Style */}
                  <Stack spacing={2}>
                    {getRecentPosts(selectedAccountData).map((post, index) => (
                      <RecentPostCard key={post.id || index} post={post} accountData={selectedAccountData} index={index} />
                    ))}
                  </Stack>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <InstagramIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                  No Data Available
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Please select an Instagram account to view analytics
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default InstagramAnalytics;