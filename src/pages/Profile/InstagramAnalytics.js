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
import { Link } from 'react-router-dom';
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
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [platform, setPlatform] = useState('Instagram');
  const [influencer, setInfluencer] = useState('');
  const [postType, setPostType] = useState('');
  const [value, setValue] = useState(0);
  const [platformData, setPlatformData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // const [recentPosts, setRecentPosts] = useState([]);
  // const [audienceGender, setAudienceGender] = useState([]);

  console.log('sssa', platform)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchInstagramAnalytics();
  }, [platform]);

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
    setPlatform(event.target.value);
  };

  const fetchInstagramAnalytics = async () => {

    setLoading(true);
    setError('');

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
      const response = await axios.get(`https://api.marketincer.com/api/v1/${apiEndpoint}`, {
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

        setSelectedAccountData((prev) => ({
          ...prev,
          [platform]: firstAccount, // store by platform name
        }));
        setSearchParams({ type: platform });

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

  // Sample data for charts (replace with real API data)
  const engagementData = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 48 },
    { day: 'Thu', value: 61 },
    { day: 'Fri', value: 55 },
    { day: 'Sat', value: 67 },
    { day: 'Sun', value: 59 }
  ];

  const notableFollowers = [
    { name: 'Alice', percentage: '12.3%', avatar: '/api/placeholder/32/32' },
    { name: 'Sophia', percentage: '9.8%', avatar: '/api/placeholder/32/32' },
    { name: 'Alana', percentage: '8.1%', avatar: '/api/placeholder/32/32' },
    { name: 'Sam', percentage: '7.2%', avatar: '/api/placeholder/32/32' },
    { name: 'Julia', percentage: '6.8%', avatar: '/api/placeholder/32/32' }
  ];

  // Campaign Analytics cards
  const getCampaignAnalytics = (selectedAccountData) => {

    if (!selectedAccountData) return [];

    const totalLikes = selectedAccountData.analytics?.engagement_stats?.total_likes || 24300;
    const totalComments = selectedAccountData.analytics?.engagement_stats?.total_comments || 403;
    const engagementRate = selectedAccountData.analytics?.engagement_stats?.total_engagement || '1.3%';
    const followers = selectedAccountData.profile?.followers_count || 32800;

    return [
      { value: formatNumber(totalLikes), label: "Total Likes", key: "likes" },
      { value: formatNumber(totalComments), label: "Total Comments", key: "comments" },
      { value: formatNumber(engagementRate), label: "Total Engagement", key: "engagement" },
      { value: formatNumber(followers), label: "Total Reach", key: "reach" },
      { value: formatNumber(12100), label: "Total Shares", key: "shares" },
      { value: formatNumber(428), label: "Total Saves", key: "saves" },
      { value: formatNumber(829), label: "Total Clicks", key: "clicks" },
      { value: formatNumber(829), label: "Profile Visits", key: "visits" }
    ];
  };

  const audiGender = selectedAccountData?.analytics?.audience_demographics?.gender ?? []

  const genderData = Object.entries(audiGender).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const engOverTime = selectedAccountData?.analytics?.engagement_over_time ?? []

  const engOverData = Object.keys(engOverTime).map((day) => ({
    day,
    engagement: engOverTime[day].engagement,
    reach: engOverTime[day].reach,
    impressions: engOverTime[day].impressions,
    profile_views: engOverTime[day].profile_views,
  }));

  console.log('engg', engOverData)
  const audiReach = selectedAccountData?.analytics?.audience_demographics.reachability ?? []

  const audienceReachabilityData = Object.entries(audiReach).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const audiEngagement = selectedAccountData?.analytics?.engagement_breakdown ?? []

  const audienceEngagementData = Object.entries(audiEngagement).map(([key, value]) => ({
    name: key,
    value: value.count
  }));


  console.log('sas', audienceEngagementData)
  const audiLocation = selectedAccountData?.analytics?.audience_demographics?.locations?.countries ?? []

  const audienceLocationData = Object.entries(audiLocation).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const audiage = selectedAccountData?.analytics?.audience_demographics?.age_groups ?? []

  const audienceAge = Object.entries(audiage).map(([key, value]) => ({
    name: key,
    value: value
  }));
  // const ageData = audienceAge && audienceAge.length > 0 &&
  // audiEngagementOver.some((item) => item.value !== 0);


  const audiEngage = selectedAccountData?.analytics?.engagement_over_time ?? []

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
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
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
                          {selectedAccountData.page_name || 'Alice'}
                        </Typography>
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '18px' }}>
                            {selectedAccountData?.profile?.name || 'Alice link'}
                          </Typography>
                        )}

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '13px' }}>
                          Beauty & Lifestyle
                        </Typography>

                        <Typography variant="body2" sx={{ fontSize: '13px', lineHeight: 1.3 }}>
                          {platform === "Instagram" ? (
                            <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                              {formatNumber(selectedAccountData.profile?.followers_count || 32800)} <span style={{ color: "gray" }}>followers</span>

                            </Box>

                          ) : (
                            <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                              {formatNumber(selectedAccountData.profile?.followers_count || 32800)} <span style={{ color: "gray" }}>followers</span>

                            </Box>

                          )}


                          {platform === "Instagram" ? (
                            <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                              {formatNumber(selectedAccountData.profile?.follows_count || 30000)} <span style={{ color: "gray" }}>followers</span>

                            </Box>

                          ) : (
                            <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                              {formatNumber(selectedAccountData.profile?.follows_count || 30000)} <span style={{ color: "gray" }}>followers</span>

                            </Box>

                          )}

                        </Typography>
                      </Box>
                    </Box>

                    {/* Bio */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4, fontSize: '13px' }}>
                      {selectedAccountData.profile?.biography || 'Bio: Lorem ipsum dolor sit'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.6, fontSize: '13px' }}>
                      USA
                    </Typography>

                    <hr></hr>
                    {/* Stats */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Engagement Rate:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.summary?.engagement_rate || '3.1%'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Earned Media:
                        </Typography>
                        <Typography variant="body2">
                          249
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Average Interactions:
                        </Typography>
                        <Typography variant="body2">
                          3.1%
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
                      {platform === "Instagram" ? (<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                          Engagement Over Time
                        </Typography>
                        <ResponsiveContainer>
                          <AreaChart data={engOverData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="engagement"
                              stroke="#8884d8"
                              fillOpacity={1}
                              fill="url(#colorEngagement)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>) : (

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                            Engagement Over Time
                          </Typography>
                            {engOverData.length > 0 ? (
                          <ResponsiveContainer>
                            <AreaChart data={engOverData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" />
                              <YAxis />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip />
                              <Area
                                type="monotone"
                                dataKey="engagement"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorEngagement)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                          ) : (
                              <h2>No data available</h2>
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

              <Grid size={{ xs: 2, sm: 4, md: 12 }}>
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
                            {audienceAge.map((age) => (
                              <Typography variant="body2" sx={{ fontSize: '11px' }}>{age.name} : {age.value}</Typography>
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
                              {genderData?.map((gender) => (
                                <Typography variant="body2">
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
                            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>Notable Followers: 132</Typography>
                            <IconButton size="small">
                              <TrendingUpIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          <Box sx={{ display: 'flex', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                            {notableFollowers.map((follower, index) => (
                              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                                <Avatar sx={{ width: 28, height: 28, mb: 0.5 }} />
                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 600 }}>
                                  {follower.name}
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '9px', color: 'text.secondary' }}>
                                  {follower.percentage}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Card>

                        {/* Additional Insights */}
                        <Box sx={{ mt: 2 }}>
                          <Card sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0', minHeight: '215px' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              <strong>Audience Cities:</strong> {audiCities.map((city) => (<span> {city}, </span>))}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              <strong>Audience Language:</strong> {audiLang.map((lang) => (<span>{lang}, </span>))}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                              <strong>Audience Interests:</strong> {audiInterest.map((int) => (<span>{int}, </span>))}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              <strong>Audience Brand Affinity:</strong> {audiBrand.map((brand) => (<span>{brand}, </span>))}
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

              <Grid spacing={2} size={{ xs: 2, sm: 4, md: 12 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                  All Brand - Tagged Posts
                </Typography>

                {selectedAccountData?.analytics?.recent_posts.length > 0 ? (selectedAccountData?.analytics?.recent_posts.map((post) => (

                  <Card
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
                        image={post.url}
                        alt={post.caption || "Post image"}
                        sx={{ width: 100, height: 100, borderRadius: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {post.caption}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @name
                        </Typography>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          Lorem ipsum dolor sit...
                        </Typography>

                        {/* Stats */}
                        <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <FavoriteBorderIcon fontSize="small" />{" "}
                            <Typography variant="body2">{post.likes}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <ChatBubbleOutlineIcon fontSize="small" />{" "}
                            <Typography variant="body2">{post.comments}</Typography>
                          </Box>
                          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <SendIcon fontSize="small" />{" "}
                          <Typography variant="body2">234</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <ShareIcon fontSize="small" />{" "}
                          <Typography variant="body2">122</Typography>
                        </Box> */}
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