import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent,
  Paper, IconButton, CircularProgress, TextField, Tabs, Tab,
  Divider, Container, Stack, Button, InputLabel, CardMedia
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, RadialBarChart,
  RadialBar, Pie, Cell, BarChart, Bar, Tooltip, Legend, CartesianGrid, AreaChart,
  Area,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import { useSearchParams } from "react-router-dom";



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD"];

const InstagramAnalytics = () => {
  const [instagramData, setInstagramData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [platform, setPlatform] = useState('Instagram');
  const [influencer, setInfluencer] = useState('');
  const [postType, setPostType] = useState('');
  const [value, setValue] = useState(0);
  const [platformData, setPlatformData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // const [recentPosts, setRecentPosts] = useState([]);
  // const [audienceGender, setAudienceGender] = useState([]);

  console.log('sssa', platform)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchInstagramAnalytics();
  }, [platform]);

  // Force refresh function to fetch fresh API data
  const forceRefresh = () => {
    // Clear all cached data
    setSelectedAccountData(null);
    setInstagramData([]);
    setSelectedAccount('');
    setError('');
    // Clear any potential localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.includes('instagram') || key.includes('analytics')) {
        localStorage.removeItem(key);
      }
    });
    fetchInstagramAnalytics();
  };

  const platformApiMap = {
    Instagram: "instagram_analytics",
    facebook: "facebook_analytics",
    twitter: "twitter_analytics",
    LinkedIn: "linkedin_analytics",
  };

  // // 🟠 API 2: Fetch data when platform changes
  // useEffect(() => {
  //   if (!platform) return; // skip until a platform is selected

  //   const fetchPlatformData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       setLoading(true);
  //       const apiEndpoint = platformApiMap[platform.toLowerCase()];

  //       const res = await axios.get(`https://api.marketincer.com/api/v1/${apiEndpoint}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         }
  //       });
  //       setPlatformData(res.data);
  //     } catch (error) {
  //       console.error("Error fetching platform data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPlatformData();
  // }, [platform]); // runs whenever platform changes

  //handle dropdown change
  const handlePlatformChange = (event) => {
    const selectedPlatform = event.target.value;
    setPlatform(selectedPlatform);

    // Navigate to the appropriate route based on platform selection
    if (selectedPlatform === 'LinkedIn') {
      navigate('/linkedin-analytics');
    } else if (selectedPlatform === 'Instagram') {
      navigate('/instagram-analytics');
    } else if (selectedPlatform === 'Facebook') {
      // You can add Facebook analytics route here if needed
      // navigate('/facebook-analytics');
      console.log('Facebook analytics not implemented yet');
    }

    // Clear existing data to prevent stale data display
    setSelectedAccountData(null);
    setInstagramData([]);
    setSelectedAccount('');
  };

  const fetchInstagramAnalytics = async () => {

    setLoading(true);
    setLoadingProgress(0);
    setError('');

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const token = localStorage.getItem("token");
      const apiEndpoint = platformApiMap[platform];

      if (!token) {
        setError('No authentication token found');
        setInstagramData([]);
        setLoading(false);
        return;
      }

      console.log('Fetching Instagram analytics...');
      const response = await axios.get(`https://api.marketincer.com/api/v1/${apiEndpoint}?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        }
      });

      console.log('API Response:', response.data);
      console.log('First account audience_demographics:', response.data?.data?.[0]?.analytics?.audience_demographics);


      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setInstagramData(response.data.data);
        const firstAccount = response.data.data[0];
        setSelectedAccount(firstAccount.username);
        setSelectedAccountData(firstAccount);
        setSearchParams({ type: platform });

        console.log('Set selectedAccountData to:', firstAccount);
        console.log('Account audience_demographics:', firstAccount?.analytics?.audience_demographics);

        // const posts = response.data?.data?.[0]?.analytics?.recent_posts ?? [];
        // const genders = response.data?.data?.[0]?.analytics?.audience_demographics?.gender ?? [];

        // setRecentPosts(posts);
        // setAudienceGender(genders) 

      } else {
        setError('No Instagram data found');
        setInstagramData([]);
      }
    } catch (error) {
      console.error('Error fetching Instagram analytics:', error);
      setError(`API Error: ${error.response?.data?.message || error.message}`);
      setInstagramData([]);
    } finally {
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 500);
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

  // This sample data is no longer used - all data comes from API

  // Get notable followers from API, with fallback to empty array
  const notableFollowers = selectedAccountData?.analytics?.audience_demographics?.notable_followers || [];

  // Campaign Analytics cards
  const getCampaignAnalytics = (selectedAccountData) => {

    if (!selectedAccountData) return [];

    const engagement_stats = selectedAccountData.analytics?.engagement_stats || {};
    const profile_stats = selectedAccountData.profile || {};
    const analytics = selectedAccountData.analytics || {};

    return [
      { value: formatNumber(engagement_stats.total_likes || 0), label: "Total Likes", key: "likes" },
      { value: formatNumber(engagement_stats.total_comments || 0), label: "Total Comments", key: "comments" },
      { value: formatNumber(engagement_stats.total_engagement || 0), label: "Total Engagement", key: "engagement" },
      { value: formatNumber(analytics.total_reach || 0), label: "Total Reach", key: "reach" },
      { value: formatNumber(engagement_stats.total_shares || 0), label: "Total Shares", key: "shares" },
      { value: formatNumber(engagement_stats.total_saves || 0), label: "Total Saves", key: "saves" },
      { value: formatNumber(engagement_stats.total_clicks || 0), label: "Total Clicks", key: "clicks" },
      { value: formatNumber(analytics.total_profile_visits || 0), label: "Profile Visits", key: "visits" }
    ];
  };

  const audiGender = selectedAccountData?.analytics?.audience_demographics?.gender ?? {}

  const genderData = Object.entries(audiGender).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const engOverTime = selectedAccountData?.analytics?.engagement_over_time ?? {}

  const engOverData = Object.keys(engOverTime).map((day) => ({
    day,
    engagement: engOverTime[day].engagement,
    reach: engOverTime[day].reach,
    impressions: engOverTime[day].impressions,
    profile_views: engOverTime[day].profile_views,
  }));

  console.log('Raw engagement_over_time:', engOverTime)
  console.log('Processed engOverData:', engOverData)
  const audiReach = selectedAccountData?.analytics?.audience_demographics?.reachability ?? {}

  const audienceReachabilityData = Object.entries(audiReach).map(([key, value]) => ({
    name: key,
    value: value
  }));

  // Try engagement_breakdown first, fallback to engagement_stats
  const audiEngagement = selectedAccountData?.analytics?.engagement_breakdown || {};
  const engagementStats = selectedAccountData?.analytics?.engagement_stats || {};

  // Create engagement data from available sources
  const audienceEngagementData = Object.keys(audiEngagement).length > 0
    ? Object.entries(audiEngagement).map(([key, value]) => ({
        name: key,
        value: value.percentage || 0,
        color: key === 'likes' ? '#8B5CF6' : key === 'comments' ? '#A78BFA' : '#C4B5FD'
      })).filter(item => item.value > 0) // Only show items with values
    : [
        { name: 'likes', value: engagementStats.likes_percentage || 0, color: '#8B5CF6' },
        { name: 'comments', value: engagementStats.comments_percentage || 0, color: '#A78BFA' },
        { name: 'shares', value: engagementStats.shares_percentage || 0, color: '#C4B5FD' }
      ].filter(item => item.value > 0); // Only show items with values


  console.log('Audience Engagement Data:', audienceEngagementData)

  const audiLocation = selectedAccountData?.analytics?.audience_demographics?.locations?.countries ?? {}

  const audienceLocationData = Object.entries(audiLocation).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const audiage = selectedAccountData?.analytics?.audience_demographics?.age_groups ?? {}

  const audienceAge = Object.entries(audiage).map(([key, value]) => ({
    name: key,
    value: value
  }));



  const audiEngage = selectedAccountData?.analytics?.engagement_over_time ?? {}

  const audiEngagementOver = Object.entries(audiEngage).map(([day, values]) => ({
    day,
    ...values
  }));

  // const EngData = audiEngagementOver && audiEngagementOver.length > 0 &&
  // audiEngagementOver.some((item) => item.value !== 0);


  const audiCities = selectedAccountData?.analytics?.audience_demographics?.locations?.cities ?? []

  const audiLang = selectedAccountData?.analytics?.audience_demographics?.languages ?? []

  const audiInterest = selectedAccountData?.analytics?.audience_demographics?.interests ?? []

  const audiBrand = selectedAccountData?.analytics?.audience_demographics?.brand_affinity ?? []







  // Show loading state
  if (loading) {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <Box sx={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          minWidth: '320px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={80}
              thickness={4}
              sx={{
                color: '#e5e7eb',
                position: 'absolute'
              }}
            />
            <CircularProgress
              variant="determinate"
              value={loadingProgress}
              size={80}
              thickness={4}
              sx={{
                color: '#8b5cf6',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  📸
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#1f2937',
            mb: 1
          }}>
            Loading Analytics
          </Typography>

          <Typography variant="body2" sx={{
            color: '#6b7280',
            mb: 2
          }}>
            Fetching your Instagram data...
          </Typography>

          <Typography variant="body2" sx={{
            color: '#8b5cf6',
            fontWeight: 500
          }}>
            {Math.round(loadingProgress)}% Complete
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100%' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section"> <Sidebar /></Grid>
        <Grid size={{ md: 11 }}>
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#091a48',
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>

              <Typography variant="h6" sx={{ color: '#fff' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                Influencers Analytics
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={forceRefresh}
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Refresh Data
                </Button>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <Link to="/SettingPage">
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Paper>
          {/* Search and Filters Bar - Light Purple */}
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1.5,
              backgroundColor: '#B1C6FF',
              border: 'none',
              flexShrink: 0
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
              {/* Search */}
              <TextField
                placeholder="Search"
                size="small"
                sx={{
                  width: 250,
                  '& .MuiInputBase-root': {
                    height: '36px',
                    bgcolor: '#fff',
                    borderRadius: '18px',
                    '& fieldset': {
                      borderColor: 'transparent',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                      borderWidth: '1px',
                    }
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px 12px',
                    fontSize: '14px'
                  }
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#666', mr: 0.5, fontSize: '18px' }} />
                }} />

              {/* Date Range */}
              <FormControl size="small" sx={{ minWidth: 250, display: 'none' }}>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{
                    height: '36px',
                    fontSize: '14px',
                    bgcolor: '#fff',
                    borderRadius: '18px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        mt: 1
                      }
                    }
                  }}
                >
                  <MenuItem value="Last 7 days">Date Range</MenuItem>
                  <MenuItem value="Last 30 days">Last 30 days</MenuItem>
                  <MenuItem value="Last 90 days">Last 90 days</MenuItem>
                </Select>
              </FormControl>

              {/* Platform */}
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <Select
                  value={platform}
                  onChange={handlePlatformChange}
                  //onChange={(e) => setPlatform(e.target.value)}
                  sx={{
                    height: '36px',
                    fontSize: '14px',
                    bgcolor: '#fff',
                    borderRadius: '18px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        mt: 1
                      }
                    }
                  }}
                >
                  <MenuItem value="Instagram">Platform: Instagram</MenuItem>
                  <MenuItem value="LinkedIn">Platform: LinkedIn</MenuItem>
                  <MenuItem value="Facebook">Platform: Facebook</MenuItem>
                </Select>
              </FormControl>

              {/* Influencer */}
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <Select
                  value={selectedAccount}
                  onChange={handleAccountChange}
                  displayEmpty
                  sx={{
                    height: '36px',
                    fontSize: '14px',
                    bgcolor: '#fff',
                    borderRadius: '18px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        mt: 1
                      }
                    }
                  }}
                >
                  <MenuItem value="" disabled>Influencer</MenuItem>
                  {instagramData.map((account, index) => (
                    <MenuItem key={`${account.username}-${index}`} value={account.username}>
                      {account.page_name || account.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Post Type */}
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <Select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  displayEmpty
                  sx={{
                    height: '36px',
                    fontSize: '14px',
                    bgcolor: '#fff',
                    borderRadius: '18px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '& .MuiSelect-select': {
                      padding: '8px 12px'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #e0e0e0',
                        mt: 1
                      }
                    }
                  }}
                >
                  <MenuItem value="">Post Type</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="carousel">Carousel</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '20px', background: '#f6edf8' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 4 }}>

                {selectedAccountData && (
                  <Card sx={{
                    borderRadius: 3,
                    p: 2.5,
                    height: 'fit-content',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    minHeight: '250px'
                  }}>
                    {/* Profile Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      {platform === "Instagram" ? (
                        <Avatar
                          src={selectedAccountData.profile?.profile_picture_url || '/api/placeholder/48/48'}
                          sx={{ width: 100, height: 100, mr: 2 }} />
                      ) : (
                        <Avatar
                          src={selectedAccountData.profile?.profile_picture_url || '/api/placeholder/48/48'}
                          sx={{ width: 100, height: 100, mr: 2 }} />
                      )}

                      <Box sx={{ flex: 1 }}>
                        {platform === "Instagram" ? (<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '18px' }}>
                          {selectedAccountData.page_name || 'N/A'}
                        </Typography>
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '18px' }}>
                            {selectedAccountData?.page_name || 'N/A'}
                          </Typography>
                        )}

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '13px' }}>
                          {selectedAccountData?.profile?.name || 'N/A'}
                        </Typography>

                        <Typography variant="body2" sx={{ fontSize: '13px', lineHeight: 1.3 }}>
                          <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {formatNumber(selectedAccountData.profile?.followers_count || 0)} <span style={{ color: "gray" }}>followers</span>
                          </Box>
                          <br />
                          <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {formatNumber(selectedAccountData.profile?.follows_count || 0)} <span style={{ color: "gray" }}>following</span>
                          </Box>
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bio */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.6, lineHeight: 1.4, fontSize: '13px' }}>
                      {selectedAccountData.profile?.biography || 'N/A'}
                    </Typography>

                    <hr></hr>
                    {/* Stats */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Engagement Rate:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.profile?.engagement_rate || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Total Posts:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.profile?.media_count || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Average Interactions:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.analytics?.total_posts || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                )}
              </Grid>
              <Grid size={{ xs: 2, sm: 4, md: 8 }}>
                {/* Campaign Analytics */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '20px' }}>
                  Campaign Analytics
                </Typography>

                {selectedAccountData && (
                  <>
                    {/* Analytics Cards - First Row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {getCampaignAnalytics(selectedAccountData).slice(0, 4).map((card, index) => (
                        <Box key={index} sx={{ flex: 1 }}>
                          <Card sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e0e0',
                            height: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {card.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                              {card.label}
                            </Typography>
                          </Card>
                        </Box>
                      ))}
                    </Box>

                    {/* Analytics Cards - Second Row */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {getCampaignAnalytics(selectedAccountData).slice(4, 8).map((card, index) => (
                        <Box key={index + 4} sx={{ flex: 1 }}>
                          <Card sx={{
                            p: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            border: '1px solid #e0e0e0',
                            height: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {card.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                              {card.label}
                            </Typography>
                          </Card>
                        </Box>
                      ))}
                    </Box>


                  </>
                )}
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 12 }}>
                {/* Charts Row */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* Engagement Over Time */}
                  <Box sx={{ flex: 1 }}>
                    <Card sx={{ p: 2.5, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                      {platform === "Instagram" ? (<Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', mb: 2 }}>
                          Engagement Over Time
                        </Typography>
                        <ResponsiveContainer width="100%" height={150}>
                          <AreaChart data={engOverData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" fontSize={12} />
                            <YAxis domain={[0, 'dataMax + 1']} fontSize={12} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <Tooltip
                              formatter={(value) => [value, 'Engagement']}
                              labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Area
                              type="monotone"
                              dataKey="engagement"
                              stroke="#8884d8"
                              strokeWidth={2}
                              fillOpacity={0.6}
                              fill="url(#colorEngagement)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>) : (

                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', mb: 2 }}>
                            Engagement Over Time
                          </Typography>
                            {engOverData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={150}>
                            <AreaChart data={engOverData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorEngagement2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" fontSize={12} />
                              <YAxis domain={[0, 'dataMax + 1']} fontSize={12} />
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <Tooltip
                                formatter={(value) => [value, 'Engagement']}
                                labelFormatter={(label) => `Day: ${label}`}
                              />
                              <Area
                                type="monotone"
                                dataKey="engagement"
                                stroke="#8884d8"
                                strokeWidth={2}
                                fillOpacity={0.6}
                                fill="url(#colorEngagement2)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                          ) : (
                              <Typography variant="h6" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>No data available</Typography>
                              )
                          }
                        </Box>
                      )}
                    </Card>
                  </Box>

                  {/* Audience Engagement */}
                  <Box sx={{ flex: 1 }}>
                    <Card sx={{ p: 2.5, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                        Audience Engagement
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {platform === "Instagram" ? (
                         <><Box sx={{ width: 100, height: 100 }}>

                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie
                               data={audienceEngagementData}
                               cx="50%"
                               cy="50%"
                               innerRadius={25}
                               outerRadius={50}
                               dataKey="value"
                             >
                               {audienceEngagementData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                             </Pie>
                           </PieChart>
                         </ResponsiveContainer>

                       </Box><Box sx={{ ml: 2 }}>
                           {audienceEngagementData.map((item, index) => (
                             <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                               <Box
                                 sx={{
                                   width: 8,
                                   height: 8,
                                   borderRadius: '50%',
                                   backgroundColor: item.color,
                                   mr: 1
                                 }} />
                               <Typography variant="body2" sx={{ fontSize: '12px' }}>
                                 {item.name} {item.value}%
                               </Typography>
                             </Box>
                           ))}
                         </Box></>
                      ):(
                        <><Box sx={{ width: 100, height: 100 }}>

                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={audienceEngagementData}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={50}
                              dataKey="value"
                            >
                              {audienceEngagementData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                      </Box><Box sx={{ ml: 2 }}>
                          {audienceEngagementData.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: item.color,
                                  mr: 1
                                }} />
                              <Typography variant="body2" sx={{ fontSize: '12px' }}>
                                {item.name} {item.value}%
                              </Typography>
                            </Box>
                          ))}
                        </Box></>
                      )}
                       
                      </Box>
                    </Card>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 12 }} style={{ display: platform === "LinkedIn" ? "none" : "block" }}>
                <Box sx={{ width: "100%" }}>
                  {/* Tabs Header */}
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
                      <Tab label="Audience Insight" />
                      {/* <Tab label="Paid Performance" />
                    <Tab label="Content Insight" /> */}
                    </Tabs>
                  </Box>

                  {/* Tab Content */}
                  <TabPanel value={value} index={0}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Grid spacing={2} size={{ xs: 2, sm: 4, md: 3 }}>
                        {/* Audience Age */}
                        <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Age</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mr: 1 }}>
                            <ResponsiveContainer width="100%" height={150}>
                              <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="20%"
                                outerRadius="100%"
                                barSize={20}
                                data={audienceAge}
                              >
                                <RadialBar
                                  minAngle={15}
                                  clockWise
                                  background
                                  dataKey="value"
                                  label={{ position: "insideStart", fill: "#fff" }}
                                >
                                  {audienceAge.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </RadialBar>

                              </RadialBarChart>
                            </ResponsiveContainer>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                            {audienceAge.map((age, index) => (
                              <Typography key={index} variant="body2" sx={{ fontSize: '11px' }}>{age.name} : {age.value}</Typography>
                            ))}

                          </Box>
                        </Card>

                        {/* Audience Gender */}
                        <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Gender</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mr: 1 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={15}
                                    outerRadius={25}
                                    dataKey="value"
                                  >
                                    <Cell fill="#8B5CF6" />
                                    <Cell fill="#E5E7EB" />
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </Box>
                            <Box>
                              {genderData?.map((gender, index) => (
                                <Typography key={index} variant="body2">
                                  • {gender.name} {gender.value}

                                </Typography>
                              ))}

                            </Box>
                          </Box>
                        </Card>
                      </Grid>

                      <Grid spacing={2} size={{ xs: 2, sm: 4, md: 4 }}>
                        <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Reachability</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 100, height: 100 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={audienceReachabilityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={15}
                                    outerRadius={35}
                                    dataKey="value"
                                  >

                                    {audienceReachabilityData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              {audienceReachabilityData.map((item, index) => (
                                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                  • {item.name}: {item.value}%
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Card>

                        {/* Audience Location */}
                        <Card sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Location</Typography>
                          {audienceLocationData.map((location, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {location.name}
                              </Typography>
                              <Box sx={{
                                width: '100%',
                                height: 3,
                                backgroundColor: '#E5E7EB',
                                borderRadius: 2
                              }}>
                                <Box sx={{
                                  width: `${location.value}%`,
                                  height: '100%',
                                  backgroundColor: '#8B5CF6',
                                  borderRadius: 2
                                }} />
                              </Box>
                            </Box>
                          ))}
                        </Card>
                      </Grid>

                      <Grid spacing={2} size={{ xs: 2, sm: 4, md: 5 }}>
                        {/* Notable Followers */}
                        <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, }}>
                            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>Notable Followers: {notableFollowers.length}</Typography>
                            <IconButton size="small">
                              <TrendingUpIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          <Box sx={{ display: 'flex', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                            {notableFollowers.length > 0 ? (
                              notableFollowers.map((follower, index) => (
                                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                                  <Avatar sx={{ width: 28, height: 28, mb: 0.5 }} />
                                  <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 600 }}>
                                    {follower.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontSize: '9px', color: 'text.secondary' }}>
                                    {follower.percentage}
                                  </Typography>
                                </Box>
                              ))
                            ) : (
                              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', width: '100%', mt: 2 }}>
                                No notable followers data available
                              </Typography>
                            )}
                          </Box>
                        </Card>

                        {/* Additional Insights */}
                        <Box sx={{ mt: 2 }}>
                          <Card sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              <strong>Audience Cities:</strong> {audiCities.map((city, index) => (<span key={index}> {city}, </span>))}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              <strong>Audience Language:</strong> {audiLang.map((lang, index) => (<span key={index}>{lang}, </span>))}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              <strong>Audience Interests:</strong> {audiInterest.map((int, index) => (<span key={index}>{int}, </span>))}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              <strong>Audience Brand Affinity:</strong> {audiBrand.map((brand, index) => (<span key={index}>{brand}, </span>))}
                            </Typography>
                          </Card>

                        </Box>
                      </Grid>




                    </Box>
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    {/* Paid Performance */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                        Paid Performance
                      </Typography>

                    </Box>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {/* Content Insight */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                        Content Insight
                      </Typography>




                    </Box>
                  </TabPanel>
                </Box>
              </Grid>

              <Grid spacing={2} size={{ xs: 2, sm: 4, md: 12 }} style={{ display: platform === "LinkedIn" ? "none" : "block" }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                  All Brand - Tagged Posts
                </Typography>

                {selectedAccountData?.analytics?.recent_posts.length > 0 ? (selectedAccountData?.analytics?.recent_posts.map((post, index) => (

                  <Card
                    key={post.id || index}
                    variant="outlined"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                    }}
                  >
                    {/* Left Side: Avatar + Post Info */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CardMedia
                        component="img"
                        image={post.media_url || post.url || '/api/placeholder/100/100'}
                        alt={post.caption || "Post image"}
                        sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.caption || post.full_caption || 'No caption'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{selectedAccountData?.username || selectedAccountData?.page_name || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {post.full_caption && post.full_caption.length > 50
                            ? `${post.full_caption.substring(0, 50)}...`
                            : post.full_caption || 'No description available'}
                        </Typography>

                        {/* Stats */}
                        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <FavoriteBorderIcon fontSize="small" />{" "}
                            <Typography variant="body2">{post.likes || 0}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <ChatBubbleOutlineIcon fontSize="small" />{" "}
                            <Typography variant="body2">{post.comments || 0}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <SendIcon fontSize="small" />{" "}
                            <Typography variant="body2">{post.shares || 0}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <ShareIcon fontSize="small" />{" "}
                            <Typography variant="body2">{post.saved || 0}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Right Side: Date + Link */}
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.timestamp).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}

                      </Typography>
                      <Link
                        to={`/FullAnalytics/${post.id}`}
                        underline="hover"
                        sx={{ fontWeight: "bold", color: "purple" }}
                      >
                        View full Analytics →
                      </Link>
                    </Box>
                  </Card>
                ))
                ) : (
                  <p>No posts available</p>
                )}
              </Grid>



            </Grid>
          </Box>

        </Grid>
      </Grid>
    </Box>

  );
};

export default InstagramAnalytics;