import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent, 
  Paper, IconButton, CircularProgress, TextField,
  Divider, Container, Stack, Button, InputLabel
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

  // Campaign Analytics cards
  const getCampaignAnalytics = (data) => {
    if (!data) return [];
    
    const totalLikes = data.analytics?.engagement_stats?.total_likes || 24300;
    const totalComments = data.analytics?.engagement_stats?.total_comments || 403;
    const engagementRate = data.summary?.engagement_rate || '1.3%';
    const followers = data.profile?.followers_count || 32800;
    
    return [
      { value: formatNumber(totalLikes), label: "Total Likes", key: "likes" },
      { value: formatNumber(totalComments), label: "Total Comments", key: "comments" },
      { value: engagementRate, label: "Total Engagement", key: "engagement" },
      { value: formatNumber(followers), label: "Total Reach", key: "reach" },
      { value: formatNumber(12100), label: "Total Shares", key: "shares" },
      { value: formatNumber(428), label: "Total Saves", key: "saves" },
      { value: formatNumber(829), label: "Total Clicks", key: "clicks" },
      { value: formatNumber(829), label: "Profile Visits", key: "visits" }
    ];
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#8B5CF6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', bgcolor: '#f8f9fa', overflow: 'hidden', display: 'flex' }}>
      <Box sx={{ width: '115px', flexShrink: 0 }}>
        <Sidebar />
      </Box>
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        overflow: 'hidden'
      }}>
        {/* Header - Dark Blue */}
        <Paper
          elevation={0}
          sx={{
            display: { xs: 'none', md: 'block' },
            p: 1,
            backgroundColor: '#091a48',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
            flexShrink: 0
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
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton size="large" sx={{ color: '#fff' }}>
                <DownloadIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 24, height: 24 }} />
                <Typography variant="body2" sx={{ color: '#fff', fontSize: '12px' }}>
                  Influencer Login
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Search and Filters Bar - Light Purple */}
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: '#C7D2FE',
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            {/* Search */}
            <TextField
              placeholder="Search"
              size="small"
              sx={{
                width: 200,
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
              }}
            />

            {/* Date Range */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
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
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
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
            <FormControl size="small" sx={{ minWidth: 130 }}>
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
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

        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          px: 3, 
          pt: 2, 
          pb: 3, 
          height: 'calc(100vh - 120px)'
        }}>
          <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
            {/* Left Column - Profile */}
            <Box sx={{ flex: '0 0 320px' }}>
              {selectedAccountData && (
                <Card sx={{ 
                  borderRadius: 3, 
                  p: 2.5, 
                  height: 'fit-content',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0'
                }}>
                  {/* Profile Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      src={selectedAccountData.profile?.profile_picture_url || '/api/placeholder/48/48'}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
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
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '13px', color: '#1a1a1a' }}>
                        {selectedAccountData.summary?.engagement_rate || '3.1%'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                        Earned Media:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '13px', color: '#1a1a1a' }}>
                        249
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                        Average Interactions:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '13px', color: '#1a1a1a' }}>
                        3.1%
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              )}
            </Box>

            {/* Right Column - Analytics */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
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
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '24px', color: '#1a1a1a' }}>
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
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: '24px', color: '#1a1a1a' }}>
                            {card.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                            {card.label}
                          </Typography>
                        </Card>
                      </Box>
                    ))}
                  </Box>

                  {/* Charts Row */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    {/* Engagement Over Time */}
                    <Box sx={{ flex: 1 }}>
                      <Card sx={{ p: 2.5, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                            Engagement Over Time
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
                                tick={{ fontSize: 12, fill: '#666' }}
                              />
                              <YAxis hide />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8B5CF6" 
                                strokeWidth={3}
                                dot={false}
                              />
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
                                  }}
                                />
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

                  {/* Bottom Section - Insights */}
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Audience Insight */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                        Audience Insight
                      </Typography>
                      
                      {/* Audience Age */}
                      <Card sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontSize: '14px', fontWeight: 600 }}>Audience Age</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Box sx={{ 
                            width: 70, 
                            height: 70, 
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
                          <Box sx={{ width: 50, height: 50 }}>
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
                    </Box>

                    {/* Paid Performance */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                        Paid Performance
                      </Typography>
                      
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
                              <Typography key={index} variant="body2" sx={{ fontSize: '10px', mb: 0.5 }}>
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
                            <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.5 }}>
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
                    </Box>

                    {/* Content Insight */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                        Content Insight
                      </Typography>
                      
                      {/* Notable Followers */}
                      <Card sx={{ p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>Notable Followers: 132</Typography>
                          <IconButton size="small">
                            <TrendingUpIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                          {notableFollowers.map((follower, index) => (
                            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, mb: 0.5 }} />
                              <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 600 }}>
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
                        <Typography variant="body2" sx={{ fontSize: '11px', color: 'text.secondary', mb: 0.5 }}>
                          <strong>Audience Cities:</strong> Indore, Mumbai, Delhi, Noida
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '11px', color: 'text.secondary', mb: 0.5 }}>
                          <strong>Audience Language:</strong> Hindi, English
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '11px', color: 'text.secondary', mb: 0.5 }}>
                          <strong>Audience Interests:</strong> Beauty, Fashion, Lifestyle
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '11px', color: 'text.secondary' }}>
                          <strong>Audience Brand Affinity:</strong> Nykaa, Sephora, Apple
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>

          {/* All Brand-Tagged Posts */}
          <Box sx={{ mt: 3, px: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontSize: '18px' }}>
              All Brand-Tagged Posts
            </Typography>
            
            {selectedAccountData && selectedAccountData.analytics?.recent_posts?.slice(0, 2).map((post, index) => (
              <Card key={index} sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 2, 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Avatar sx={{ width: 48, height: 48, mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '16px' }}>
                    Influencer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '14px' }}>
                    @name
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '13px' }}>
                    Lorem ipsum dolor sit...
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>♥ {formatNumber(post.likes || 378000)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>💬 {formatNumber(post.comments || 248)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>📤 {formatNumber(234)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '12px' }}>🔗 {formatNumber(122)}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    @anybrand
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    13March
                  </Typography>
                  <Button variant="text" sx={{ fontSize: '11px', color: '#8B5CF6', p: 0, minWidth: 'auto' }}>
                    View full Analytics
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InstagramAnalytics;