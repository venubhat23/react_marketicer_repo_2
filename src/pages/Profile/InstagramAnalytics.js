import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, Button,
  Chip, Container, Stack,
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

  // Create analytics cards array similar to Analytics component
  const getAnalyticsCards = (data) => {
    if (!data) return [];
    
    const totalPosts = data.profile?.media_count || 0;
    const totalLikes = data.analytics?.engagement_stats?.total_likes || 0;
    const totalComments = data.analytics?.engagement_stats?.total_comments || 0;
    const followers = data.profile?.followers_count || 0;
    
    return [
      { value: formatNumber(followers), label: "Followers Count" },
      { value: formatNumber(data.profile?.follows_count || 0), label: "Follows Count" },
      { value: formatNumber(totalPosts), label: "Media Count" },
      { value: formatNumber(totalLikes), label: "Total Likes" },
      { value: formatNumber(totalComments), label: "Total Comments" },
      { value: formatNumber(totalLikes + totalComments), label: "Total Engagement" },
      { value: formatNumber(totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0), label: "Avg Likes per Post" },
      { value: formatNumber(totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0), label: "Avg Comments per Post" },
      { value: formatNumber(totalPosts > 0 ? Math.round((totalLikes + totalComments) / totalPosts) : 0), label: "Avg Engagement per Post" },
      { value: data.summary?.engagement_rate || '0.0%', label: "Engagement Rate" },
      { value: formatNumber(totalPosts), label: "Total Posts" },
      { value: formatNumber(Math.round(followers * 0.1)), label: "Reach Potential" },
    ];
  };

  const ProfileCard = ({ data }) => (
    <Card sx={{ 
      borderRadius: 2, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      height: 'fit-content'
    }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #E1306C 0%, #fd8856 100%)',
        p: 2,
        color: 'white',
        textAlign: 'center'
      }}>
        <Avatar
          src={data.profile?.profile_picture_url}
          sx={{ 
            width: 60, 
            height: 60, 
            margin: '0 auto 12px',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        />
        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ fontSize: '1rem' }}>
          {data.profile?.full_name || `@${data.username}`}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1.5, fontSize: '0.85rem' }}>
          @{data.username}
        </Typography>
      </Box>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ mb: 1.5, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" fontWeight={700} gutterBottom sx={{ fontSize: '1.5rem' }}>
            {formatNumber(data.profile?.followers_count || 0)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Followers
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">Engagement:</Typography>
            <Typography variant="caption" fontWeight={600}>{data.summary?.engagement_rate || '0.0%'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">Earned Media:</Typography>
            <Typography variant="caption" fontWeight={600}>${formatNumber(data.earned_media || 0)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">Avg Interactions:</Typography>
            <Typography variant="caption" fontWeight={600}>{formatNumber(calculateAverageInteractions(data))}</Typography>
          </Box>
        </Box>
        {data.profile?.bio && (
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.7rem' }}>
              {data.profile.bio.length > 80 ? data.profile.bio.substring(0, 80) + '...' : data.profile.bio}
            </Typography>
          </Box>
        )}
        {data.profile?.location && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {data.profile.location}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column'
        }}>
          <CircularProgress size={60} sx={{ color: '#E1306C' }} />
          <Typography sx={{ mt: 2, color: '#64748b', fontSize: '1.1rem' }}>
            Loading Instagram analytics...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Card sx={{ 
            p: 4, 
            maxWidth: '600px',
            mx: 'auto',
            borderRadius: 3,
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
        </Box>
      </Layout>
    );
  }

  if (instagramData.length === 0) {
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Card sx={{ 
            p: 4, 
            maxWidth: '600px',
            mx: 'auto',
            borderRadius: 3,
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
                borderRadius: 2,
                px: 4,
                py: 1.5
              }}
            >
              Connect Instagram Account
            </Button>
          </Card>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ flexGrow: 1 }}>
        {/* Header matching Analytics component */}
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

        {/* Blue filter section matching Analytics component */}
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
              {instagramData.map((account, index) => (
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
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

                          {/* Main content matching Analytics component layout */}
         <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '15px' }}>
           {selectedAccountData && (
             <>
                               {/* Profile and Analytics in one line */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mt: '-20px' }}>
                  {/* Profile section - left side */}
                  <Box sx={{ width: '240px', flexShrink: 0 }}>
                    <ProfileCard data={selectedAccountData} />
                  </Box>

                  {/* Campaign Analytics section - right side */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: 1.5,
                      width: '100%'
                    }}>
                      {getAnalyticsCards(selectedAccountData).map((card, index) => (
                        <Card
                          key={index}
                          sx={{
                            width: '100%',
                            height: 95,
                            border: "1px solid #b6b6b6",
                            borderRadius: "10px",
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <CardContent sx={{ textAlign: "center", p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h5" sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.5 }}>{card.value}</Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                              {card.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                </Box>

               {/* Recent Posts Section */}
               {selectedAccountData.analytics?.recent_posts && selectedAccountData.analytics.recent_posts.length > 0 && (
                 <Box sx={{ mt: 3 }}>
                   <Card sx={{ 
                     borderRadius: 2, 
                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                     overflow: 'hidden'
                   }}>
                     <Box sx={{ 
                       background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                       p: 3,
                       color: 'white'
                     }}>
                       <Typography variant="h5" fontWeight={600} gutterBottom>
                         Recent Posts ({selectedAccountData.analytics.recent_posts.length})
                       </Typography>
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         Your latest Instagram content performance
                       </Typography>
                     </Box>
                     <CardContent sx={{ p: 3 }}>
                       <Grid container spacing={2}>
                         {selectedAccountData.analytics.recent_posts.map((post, index) => (
                           <Grid item xs={12} sm={6} md={4} lg={3} key={post.id || index}>
                             <Card sx={{ 
                               borderRadius: 2, 
                               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
                                     height: 200,
                                     objectFit: 'cover'
                                   }}
                                   onError={(e) => {
                                     e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
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
                                     borderRadius: 1
                                   }}
                                 />
                               </Box>
                               <CardContent sx={{ p: 2 }}>
                                 <Tooltip title={post.caption || 'No caption'}>
                                   <Typography 
                                     variant="body2" 
                                     sx={{ 
                                       mb: 1,
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
                                 <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                   {formatDate(post.timestamp)}
                                 </Typography>
                                 <Box sx={{ 
                                   display: 'flex', 
                                   justifyContent: 'space-between', 
                                   alignItems: 'center',
                                   gap: 1,
                                   mb: 1
                                 }}>
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                     <FavoriteIcon fontSize="small" sx={{ color: '#E1306C' }} />
                                     <Typography variant="caption">{formatNumber(post.likes || 0)}</Typography>
                                   </Box>
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                     <ChatBubbleIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                     <Typography variant="caption">{formatNumber(post.comments || 0)}</Typography>
                                   </Box>
                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                     <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                                     <Typography variant="caption">{formatNumber(post.engagement || 0)}</Typography>
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
                                       borderRadius: 1,
                                       textTransform: 'none',
                                       fontSize: '0.75rem'
                                     }}
                                   >
                                     View
                                   </Button>
                                 )}
                               </CardContent>
                             </Card>
                           </Grid>
                         ))}
                       </Grid>
                     </CardContent>
                   </Card>
                 </Box>
               )}

               {/* Top Performing Posts Section */}
               {selectedAccountData.analytics?.top_performing_posts && selectedAccountData.analytics.top_performing_posts.length > 0 && (
                 <Box sx={{ mt: 3 }}>
                   <Card sx={{ 
                     borderRadius: 2, 
                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                     overflow: 'hidden'
                   }}>
                     <Box sx={{ 
                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                       p: 3,
                       color: 'white'
                     }}>
                       <Typography variant="h5" fontWeight={600} gutterBottom>
                         Top Performing Posts ({selectedAccountData.analytics.top_performing_posts.length})
                       </Typography>
                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
                         Your best-performing Instagram content
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
                         {selectedAccountData.analytics.top_performing_posts.map((post, index) => (
                           <Card key={post.id || index} sx={{ 
                             minWidth: 280,
                             borderRadius: 2, 
                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                             overflow: 'hidden',
                             transition: 'transform 0.2s',
                             position: 'relative',
                             '&:hover': { transform: 'translateY(-4px)' }
                           }}>
                             <Box sx={{ position: 'relative' }}>
                               <img
                                 src={post.media_url}
                                 alt={post.caption || 'Instagram post'}
                                 style={{
                                   width: '100%',
                                   height: 200,
                                   objectFit: 'cover'
                                 }}
                                 onError={(e) => {
                                   e.target.src = 'https://via.placeholder.com/280x200?text=No+Image';
                                 }}
                               />
                               <Chip
                                 icon={<TrendingUpIcon />}
                                 label={`#${index + 1}`}
                                 size="small"
                                 sx={{
                                   position: 'absolute',
                                   top: 8,
                                   left: 8,
                                   bgcolor: 'rgba(16,185,129,0.9)',
                                   color: 'white',
                                   borderRadius: 1,
                                   fontWeight: 600
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
                                   borderRadius: 1
                                 }}
                               />
                             </Box>
                             <CardContent sx={{ p: 2 }}>
                               <Tooltip title={post.caption || 'No caption'}>
                                 <Typography 
                                   variant="body2" 
                                   sx={{ 
                                     mb: 1,
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
                               <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                 {formatDate(post.timestamp)}
                               </Typography>
                               <Box sx={{ 
                                 display: 'flex', 
                                 justifyContent: 'space-between', 
                                 alignItems: 'center',
                                 gap: 1,
                                 mb: 1
                               }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                   <FavoriteIcon fontSize="small" sx={{ color: '#E1306C' }} />
                                   <Typography variant="caption">{formatNumber(post.likes || 0)}</Typography>
                                 </Box>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                   <ChatBubbleIcon fontSize="small" sx={{ color: '#1976d2' }} />
                                   <Typography variant="caption">{formatNumber(post.comments || 0)}</Typography>
                                 </Box>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                   <TrendingUpIcon fontSize="small" sx={{ color: '#10b981' }} />
                                   <Typography variant="caption">{formatNumber(post.engagement || 0)}</Typography>
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
                                     borderRadius: 1,
                                     textTransform: 'none',
                                     fontSize: '0.75rem',
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
                 </Box>
               )}
             </>
           )}
         </Box>
       </Box>
     </Layout>
   );
 };

 export default InstagramAnalytics;