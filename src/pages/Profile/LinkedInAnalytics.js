import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent,
  Paper, IconButton, CircularProgress, TextField,Tabs, Tab,
  Divider, Container, Stack, Button, InputLabel,CardMedia
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import {Link, useNavigate, useLocation} from 'react-router-dom'
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import BrandProfile from "./BrandProfile";


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


const LinkedinAnalytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [instagramData, setInstagramData] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAccountData, setSelectedAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [platform, setPlatform] = useState('LinkedIn');
  const [influencer, setInfluencer] = useState('');
  const [postType, setPostType] = useState('');
  const [value, setValue] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchInstagramAnalytics();
  }, []);

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

      if (!token) {
        setError('No authentication token found');
        setInstagramData([]);
        setLoading(false);
        return;
      }

      console.log('Fetching Instagram analytics...');
      const response = await axios.get('https://api.marketincer.com/api/v1/linkedin_analytics', {
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


        const posts = response.data?.data?.[0]?.analytics?.recent_posts ?? [];

        //const posts = accountsArray.map((account) => account.analytics?.recent_posts || []);
        setRecentPosts(posts);



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

  const audienceEngagementData = [
    { name: 'Likes', value: 60, color: '#8B5CF6' },
    { name: 'Comments', value: 35, color: '#A78BFA' },
    { name: 'Shares', value: 5, color: '#C4B5FD' }
  ];

  const audienceReachabilityData = [
    { name: 'Real & Active Followers', value: 76, color: '#8B5CF6' },
    { name: 'Ghost/Inactive Followers', value: 18, color: '#A78BFA' },
    { name: 'Suspicious/Bot Accounts', value: 6, color: '#E5E7EB' }
  ];

  const audienceLocationData = [
    { country: 'United States', percentage: 85 },
    { country: 'India', percentage: 70 },
    { country: 'Germany', percentage: 60 },
    { country: 'Russia', percentage: 35 },
    { country: 'Dubai', percentage: 30 }
  ];

  const notableFollowers = [
    { name: 'Alice', percentage: '12.3%', avatar: '/api/placeholder/32/32' },
    { name: 'Sophia', percentage: '9.8%', avatar: '/api/placeholder/32/32' },
    { name: 'Alana', percentage: '8.1%', avatar: '/api/placeholder/32/32' },
    { name: 'Sam', percentage: '7.2%', avatar: '/api/placeholder/32/32' },
    { name: 'Julia', percentage: '6.8%', avatar: '/api/placeholder/32/32' }
  ];

  // Campaign Analytics cards - showing 8 fields from analytics data
  const getCampaignAnalytics = (selectedAccountData) => {
    if (!selectedAccountData) return [];

    const analytics = selectedAccountData.analytics || {};

    return [
      { value: formatNumber(analytics.total_posts || 0), label: "Total Posts", key: "posts" },
      { value: formatNumber(analytics.total_engagement || 0), label: "Total Engagement", key: "engagement" },
      { value: formatNumber(analytics.total_likes || 0), label: "Total Likes", key: "likes" },
      { value: formatNumber(analytics.total_comments || 0), label: "Total Comments", key: "comments" },
      { value: formatNumber(analytics.total_shares || 0), label: "Total Shares", key: "shares" },
      { value: formatNumber(analytics.total_saves || 0), label: "Total Saves", key: "saves" },
      { value: formatNumber(analytics.total_clicks || 0), label: "Total Clicks", key: "clicks" },
      { value: analytics.average_engagement_per_post?.toFixed(2) || '0.00', label: "Avg Engagement/Post", key: "avg_engagement" }
    ];
  };

  const handlePlatformChange = (event) => {
    const selectedPlatform = event.target.value;
    setPlatform(selectedPlatform);

    if (selectedPlatform === 'Instagram') {
      navigate('/instagram-analytics?type=Instagram');
    } else if (selectedPlatform === 'LinkedIn') {
      navigate('/linkedin-analytics');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#f5edf8'
      }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#8B5CF6', mb: 1 }}>
            Marketincer
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
            Analytics Loading...
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={loadingProgress}
            size={60}
            sx={{ color: '#8B5CF6' }}
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
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(loadingProgress)}%`}
            </Typography>
          </Box>
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
                LinkenIn Analytics
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
              <FormControl size="small" sx={{ minWidth: 250, display:'none' }}>
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
                    minHeight:'250px'
                  }}>
                    {/* Profile Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        src={selectedAccountData.profile?.profile_picture_url || '/api/placeholder/48/48'}
                        sx={{ width: 50, height: 50, mr: 2 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '18px' }}>
                          {selectedAccountData.page_name || 'Alice'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '13px' }}>
                          Beauty & Lifestyle
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '13px', lineHeight: 1.3 }}>
                          <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {formatNumber(selectedAccountData.profile?.followers_count || 32800)}
                          </Box>
                          {' Followers '}
                          <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {formatNumber(selectedAccountData.profile?.follows_count || 30000)}
                          </Box>
                          {' Following'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bio */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4, fontSize: '13px' }}>
                      {selectedAccountData.profile?.biography || 'Bio: Lorem ipsum dolor sit'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: '13px' }}>
                      USA
                    </Typography>

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
                    <Box sx={{ display: 'flex', gap: 2, mb: 2}}>
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
              <Box sx={{ display: 'flex', gap: 2, mb: 2}}>
                {/* Engagement Over Time */}
                <Box sx={{ flex: 1 }}>
                  <Card sx={{ p: 2.5, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                        Engagement Over 
                      </Typography>
                      <FormControl size="small">
                        <Select
                          value="Last 7 days"
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                            '& .MuiSelect-select': { padding: '4px 8px', fontSize: '12px' }
                          }}
                        >
                          <MenuItem value="Last 7 days">Last 7 days</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ height: 160 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementData}>
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#666' }} />
                          <YAxis hide />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Card>
                </Box>

                {/* Audience Engagement */}
                <Box sx={{ flex: 1 }}>
                  <Card sx={{ p: 2.5, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                      Audience Engagement
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 100, height: 100 }}>
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
                      </Box>
                      <Box sx={{ ml: 2 }}>
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
                      </Box>
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
                <Box sx={{ display: 'flex', gap:2 }}>
                <Grid spacing={2} size={{ xs: 2, sm: 4, md: 3 }}>
                    {/* Audience Age */}
                  <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Age</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, mr:1 }}>
                      <Box sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        border: '4px solid #8B5CF6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>1,000</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <Typography variant="body2" sx={{ fontSize: '11px' }}>18-24</Typography>
                      <Typography variant="body2" sx={{ fontSize: '11px' }}>24-30</Typography>
                      <Typography variant="body2" sx={{ fontSize: '11px' }}>More than 30</Typography>
                    </Box>
                  </Card>

                    {/* Audience Gender */}
                    <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Gender</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 100, height: 100 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { value: 95, color: '#8B5CF6' },
                                { value: 5, color: '#E5E7EB' }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={12}
                              outerRadius={25}
                              dataKey="value"
                            >
                              <Cell fill="#8B5CF6" />
                              <Cell fill="#E5E7EB" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" sx={{ fontSize: '11px' }}>
                          • Female 95%
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '11px' }}>
                          • Male 5%
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>

                <Grid spacing={2} size={{ xs: 2, sm: 4, md: 4 }}>
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Reachability</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 70, height: 70 }}>
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
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        {audienceReachabilityData.map((item, index) => (
                          <Typography key={index} variant="body2" sx={{  mb: 0.5 }}>
                            • {item.name}: {item.value}%
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Card>

                  {/* Audience Location */}
                  <Card sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Location</Typography>
                    {audienceLocationData.map((location, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{  mb: 0.5 }}>
                          {location.country}
                        </Typography>
                        <Box sx={{
                          width: '100%',
                          height: 3,
                          backgroundColor: '#E5E7EB',
                          borderRadius: 2
                        }}>
                          <Box sx={{
                            width: `${location.percentage}%`,
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
                  <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                  <Card sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{  color: 'text.secondary', mb: 1 }}>
                      <strong>Audience Cities:</strong> Indore, Mumbai, Delhi, Noida
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      <strong>Audience Language:</strong> Hindi, English
                    </Typography>
                    <Typography variant="body2" sx={{  color: 'text.secondary', mb:1 }}>
                      <strong>Audience Interests:</strong> Beauty, Fashion, Lifestyle
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <strong>Audience Brand Affinity:</strong> Nykaa, Sephora, Apple
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
                <BrandProfile brand={selectedAccountData?.analytics?.recent_posts || []} />
              </Grid>



            </Grid>
          </Box>

        </Grid>
      </Grid>
    </Box>

  );
};

export default LinkedinAnalytics;