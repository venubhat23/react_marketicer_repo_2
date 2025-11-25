import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, MenuItem, Card, CardContent,
  Paper, IconButton, CircularProgress, TextField,Tabs, Tab,
  Divider, Container, Stack, Button, InputLabel,CardMedia, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import {Link, useNavigate, useLocation} from 'react-router-dom'
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import InsightsIcon from "@mui/icons-material/Insights";
import LockIcon from "@mui/icons-material/Lock";
import BrandProfile from "./BrandProfile";
import EnhancedAudienceInsights from "./EnhancedAudienceInsights";
import LinkedInAudienceAPI from '../../services/linkedinAudienceApi';


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
  const [audienceData, setAudienceData] = useState(null);
  const [hasAudienceData, setHasAudienceData] = useState(false);
  const [audienceLoading, setAudienceLoading] = useState(true);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showData, setShowData] = useState(false);
  const [dataSource, setDataSource] = useState(''); // 'fresh', 'cache', or ''
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [refreshLimitExceeded, setRefreshLimitExceeded] = useState(false);
  const [refreshButtonDisabled, setRefreshButtonDisabled] = useState(false);
  const [apiCallsUsed, setApiCallsUsed] = useState(0);
  const [apiCallsRemaining, setApiCallsRemaining] = useState(0);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    // When page loads, always call cache endpoint first
    fetchCachedAnalyticsOnLoad();
  }, []);

  const fetchCachedAnalyticsOnLoad = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('🔄 Page load - checking for cached data');

      // Call cache endpoint on page load
      const response = await axios.get('https://api.marketincer.com/api/v1/linkedin_analytics?cache=true', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Update API quota info from response
      setApiCallsUsed(response.data.api_calls_used || 0);
      setApiCallsRemaining(response.data.api_calls_remaining || 0);

      // Check if quota exceeded
      if (response.data.api_calls_remaining === 0) {
        setQuotaExceeded(true);
        setRefreshButtonDisabled(true);
      }

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // A: Cached data exists → show analytics
        setInstagramData(response.data.data);
        const firstAccount = response.data.data[0];
        setSelectedAccount(firstAccount.username);
        setSelectedAccountData(firstAccount);
        setDataSource('cache');
        setShowData(true);
        console.log('✅ Cached data loaded successfully');
      } else {
        // B: Cached data empty → show modal popup
        setInstagramData([]);
        setShowNoDataModal(true);
        console.log('📭 No cached data available - showing modal');
      }
    } catch (error) {
      console.error('Error fetching cached analytics:', error);
      if (error.response?.data?.data === null) {
        // Handle null data case
        setShowNoDataModal(true);
      } else {
        setError('Failed to load analytics data');
      }
      setInstagramData([]);
    } finally {
      setLoading(false);
    }
  };

  const incrementApiCallCount = () => {
    const newCount = apiCallCount + 1;
    setApiCallCount(newCount);
    localStorage.setItem('linkedinApiCallCount', newCount.toString());
  };

  const fetchConnectedAccountsFirstTime = async () => {
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

      console.log('🚀 API count ≤ 1 - using fresh data');
      // API count <= 1 - use fresh API and increment count
      const response = await axios.get('https://api.marketincer.com/api/v1/linkedin_analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setInstagramData(response.data.data);
        const firstAccount = response.data.data[0];
        setSelectedAccount(firstAccount.username);
        setSelectedAccountData(firstAccount);

        // Increment count and mark data source
        incrementApiCallCount();
        setDataSource('fresh');
        setShowData(true);

        console.log('✅ Fresh API call successful, count incremented');
      } else {
        setInstagramData([]);
      }
    } catch (error) {
      console.error('Error fetching connected accounts (first time):', error);
      setError('Failed to load connected accounts');
      setInstagramData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectedAccountsFromCache = async () => {
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

      console.log('💾 API count > 1 - using cached data');
      // API count > 1 - use cache API (no count increment)
      const response = await axios.get('https://api.marketincer.com/api/v1/linkedin_analytics_cache', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setInstagramData(response.data.data);
        const firstAccount = response.data.data[0];
        setSelectedAccount(firstAccount.username);
        setSelectedAccountData(firstAccount);
        setDataSource('cache');
        setShowData(true);

        console.log('✅ Cached data loaded successfully');
      } else {
        setInstagramData([]);
      }
    } catch (error) {
      console.error('Error fetching cached accounts:', error);
      setError('Failed to load cached accounts');
      setInstagramData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    // Check if quota exceeded before making call
    if (quotaExceeded || apiCallsRemaining === 0) {
      setError('API quota exceeded. No remaining calls available.');
      return;
    }

    if (refreshButtonDisabled) {
      return;
    }

    setRefreshing(true);
    setShowData(false);
    setError('');

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError('No authentication token found');
        return;
      }

      console.log('🔄 Manual refresh - fetching fresh data...');
      // Manual refresh calls fresh API endpoint
      const response = await axios.get('https://api.marketincer.com/api/v1/linkedin_analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log('API Response:', response.data);
      console.log('LinkedIn Accounts Data:', response.data.data?.map(account => ({
        username: account.username,
        page_name: account.page_name,
        account_type: account.account_type,
        type: account.type,
        profile: account.profile
      })));

      // Update API quota info from response
      setApiCallsUsed(response.data.api_calls_used || 0);
      setApiCallsRemaining(response.data.api_calls_remaining || 0);

      // Check if quota exceeded after this call
      if (response.data.api_calls_remaining === 0) {
        setQuotaExceeded(true);
        setRefreshButtonDisabled(true);
      }

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const updatedData = response.data.data;
        setInstagramData(updatedData);

        const currentAccount = updatedData.find(account => account.username === selectedAccount) || updatedData[0];
        setSelectedAccount(currentAccount.username);
        setSelectedAccountData(currentAccount);
        const posts = currentAccount?.analytics?.recent_posts ?? [];
        setRecentPosts(posts);

        // Fetch audience insights if available
        await fetchAudienceInsights(currentAccount);

        setDataSource('fresh');
        setShowData(true);
        setShowNoDataModal(false); // Close modal if it was open
        console.log('✅ Fresh data loaded and cache updated');
      } else {
        setError('No LinkedIn data found');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);

      // Check for refresh limit exceeded error
      if (error.response?.data?.error === 'Refresh limit exceeded' ||
          error.response?.status === 429 ||
          error.response?.data?.message?.includes('limit exceeded') ||
          error.response?.data?.api_calls_remaining === 0) {
        setRefreshLimitExceeded(true);
        setRefreshButtonDisabled(true);
        setQuotaExceeded(true);
        setError('API quota exceeded. Please try again later.');
      } else {
        setError(`API Error: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const fetchAudienceInsights = async (accountData = selectedAccountData) => {
    if (!accountData?.page_id && !accountData?.username) {
      setAudienceLoading(false);
      return;
    }

    try {
      setAudienceLoading(true);
      const organizationId = accountData?.page_id || accountData?.username;

      // Increment API call count for audience insights
      incrementApiCallCount();

      const data = await LinkedInAudienceAPI.getComprehensiveAudienceData(organizationId);

      if (data.success && data.data) {
        const hasValidData = Object.values(data.data).some(value => {
          return value !== null && value !== undefined &&
                 (Array.isArray(value) ? value.length > 0 :
                  typeof value === 'object' ? Object.keys(value).length > 0 : true);
        });
        setHasAudienceData(hasValidData);
        setAudienceData(data.data);
      } else {
        setHasAudienceData(false);
        setAudienceData(null);
      }
    } catch (error) {
      console.error('Error fetching audience insights:', error);
      setHasAudienceData(false);
      setAudienceData(null);
    } finally {
      setAudienceLoading(false);
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

    // Clear previous data when changing accounts
    setShowData(false);
    setRecentPosts([]);
    setAudienceData(null);
    setHasAudienceData(false);

    // Auto-load data for the selected account if it exists
    if (accountData && accountData.analytics) {
      setRecentPosts(accountData.analytics.recent_posts || []);
      setShowData(true);

      // Fetch audience insights for the new account
      fetchAudienceInsights(accountData);
    }
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

  // Get audience engagement data from selectedAccountData or use empty array
  const getAudienceEngagementData = () => {
    if (selectedAccountData?.analytics?.engagement_breakdown) {
      return [
        { name: 'Likes', value: selectedAccountData.analytics.engagement_breakdown.likes || 0, color: '#8B5CF6' },
        { name: 'Comments', value: selectedAccountData.analytics.engagement_breakdown.comments || 0, color: '#A78BFA' },
        { name: 'Shares', value: selectedAccountData.analytics.engagement_breakdown.shares || 0, color: '#C4B5FD' }
      ];
    }
    return null; // No data available
  };

  const audienceEngagementData = getAudienceEngagementData();

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

    // Update platform state first
    setPlatform(selectedPlatform);

    // Add a small delay before navigation to allow UI to update
    setTimeout(() => {
      if (selectedPlatform === 'Instagram') {
        navigate('/instagram-analytics?type=Instagram');
      } else if (selectedPlatform === 'LinkedIn') {
        // If already on LinkedIn page, just refresh data instead of navigating
        if (window.location.pathname === '/linkedin-analytics') {
          window.location.reload();
        } else {
          navigate('/linkedin-analytics');
        }
      }
    }, 100);
  };

  // Show loading state with blurred background
  if (loading) {
    return (
      <>
        {/* Blurred background content */}
        <Box sx={{
          flexGrow: 1,
          bgcolor: '#f5edf8',
          height: '100%',
          filter: 'blur(4px)',
          position: 'relative'
        }}>
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
                    LinkedIn Analytics
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
              {/* Search and Filters Bar */}
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
                  <TextField
                    placeholder="Search"
                    size="small"
                    sx={{
                      width: 250,
                      '& .MuiInputBase-root': {
                        height: '36px',
                        bgcolor: '#fff',
                        borderRadius: '18px'
                      }
                    }}
                  />
                </Box>
              </Paper>
              <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '20px', background: '#f6edf8' }}>
                {/* Placeholder content */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 2, sm: 4, md: 4 }}>
                    <Card sx={{ borderRadius: 3, p: 2.5, height: '250px', opacity: 0.7 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar sx={{ width: 50, height: 50, mr: 2, bgcolor: '#e0e0e0' }} />
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ height: 20, bgcolor: '#e0e0e0', borderRadius: 1, mb: 1 }} />
                          <Box sx={{ height: 14, bgcolor: '#e0e0e0', borderRadius: 1, mb: 1, width: '60%' }} />
                          <Box sx={{ height: 14, bgcolor: '#e0e0e0', borderRadius: 1, width: '80%' }} />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 2, sm: 4, md: 8 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} sx={{ flex: 1, p: 2, height: '80px', opacity: 0.7 }}>
                          <Box sx={{ height: 16, bgcolor: '#e0e0e0', borderRadius: 1, mb: 1 }} />
                          <Box sx={{ height: 12, bgcolor: '#e0e0e0', borderRadius: 1, width: '70%' }} />
                        </Card>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Loading overlay */}
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(2px)'
        }}>
          <Box sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            minWidth: '320px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(10px)'
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
                    📊
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
              Fetching your analytics data...
            </Typography>

            <Typography variant="body2" sx={{
              color: '#8b5cf6',
              fontWeight: 500
            }}>
              {Math.round(loadingProgress)}% Complete
            </Typography>
          </Box>
        </Box>
      </>
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
                LinkedIn Analytics
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
                  <MenuItem value="" disabled>
                    {platform === 'LinkedIn' && postType ? 
                      `Select ${postType.charAt(0).toUpperCase() + postType.slice(1)}` : 
                      'Influencer'
                    }
                  </MenuItem>
                  {instagramData
                    .filter(account => {
                      if (platform === 'LinkedIn' && postType) {
                        // Filter based on account type for LinkedIn
                        if (postType === 'profile') {
                          // Check if it's a personal profile (has username but limited page_name, or has specific profile indicators)
                          return !account.page_name || account.page_name === account.username || 
                                 account.account_type === 'profile' || account.type === 'profile';
                        } else if (postType === 'page') {
                          // Check if it's a company page (has page_name different from username, or has specific page indicators)
                          return account.page_name && account.page_name !== account.username ||
                                 account.account_type === 'page' || account.type === 'page';
                        }
                      }
                      return true; // Show all for other platforms or when no type selected
                    })
                    .map((account, index) => (
                      <MenuItem key={`${account.username}-${index}`} value={account.username}>
                        {account.page_name || account.username}
                        {platform === 'LinkedIn' && (
                          <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                            ({account.page_name && account.page_name !== account.username ? 'Page' : 'Profile'})
                          </span>
                        )}
                      </MenuItem>
                    ))
                  }
                  //  
                  // {instagramData.length > 0 ? 'Select LinkedIn Account' : 'Loading LinkedIn Accounts...'}
                  // </MenuItem>
                  // {loading ? (
                  //   <MenuItem value="" disabled>Loading accounts...</MenuItem>
                  // ) : instagramData.length > 0 ? (
                  //   instagramData.map((account, index) => (
                  //     <MenuItem key={`${account.username}-${index}`} value={account.username}>
                  //       {account.page_name || account.username}
                  //     </MenuItem>
                  //   ))
                  // ) : (
                  //   <MenuItem value="" disabled>No LinkedIn accounts found</MenuItem>
                  // )}
                </Select>
              </FormControl>

              {/* Post Type */}
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <Select
                  value={postType}
                  onChange={(e) => {
                    setPostType(e.target.value);
                    // Reset selected account when account type filter changes for LinkedIn
                    if (platform === 'LinkedIn') {
                      setSelectedAccount('');
                      setSelectedAccountData(null);
                    }
                  }}
                  
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
                  {platform === 'LinkedIn' ? (
                    <>
                      <MenuItem value="">Account Type</MenuItem>
                      <MenuItem value="profile">Profile</MenuItem>
                      <MenuItem value="page">Page</MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem value="">Post Type</MenuItem>
                      <MenuItem value="image">Image</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="carousel">Carousel</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>

              {/* Refresh Button */}
              {!quotaExceeded && apiCallsRemaining > 0 ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={fetchAnalyticsData}
                  disabled={refreshing || refreshButtonDisabled}
                  startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
                  sx={{
                    height: '36px',
                    backgroundColor: refreshButtonDisabled ? '#ccc' : '#8b5cf6',
                    color: 'white',
                    borderRadius: '18px',
                    px: 3,
                    fontSize: '14px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: refreshButtonDisabled ? '#ccc' : '#7c3aed',
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc',
                      color: '#666'
                    }
                  }}
                >
                  {refreshing ? 'Loading...' : 'Refresh Data'}
                </Button>
              ) : (
                <Chip
                  label="Quota Exceeded"
                  variant="filled"
                  sx={{
                    height: '36px',
                    backgroundColor: '#ffebee',
                    borderColor: '#f44336',
                    color: '#d32f2f',
                    fontWeight: 600,
                    fontSize: '14px',
                    border: '2px solid #f44336'
                  }}
                />
              )}

              {/* API Usage Counter */}
              <Chip
                label={`API Calls: ${apiCallsUsed} used | ${apiCallsRemaining} remaining`}
                variant="outlined"
                sx={{
                  height: '36px',
                  backgroundColor: apiCallsRemaining === 0 ? '#ffebee' : '#f3f4f6',
                  borderColor: apiCallsRemaining === 0 ? '#f44336' : '#d1d5db',
                  color: apiCallsRemaining === 0 ? '#d32f2f' : '#374151',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              />

              {/* Data Source Indicator */}
              {dataSource && (
                <Chip
                  label={dataSource === 'fresh' ? '🔄 Fresh Data' : '💾 Cached Data'}
                  variant="outlined"
                  sx={{
                    height: '36px',
                    backgroundColor: dataSource === 'fresh' ? '#e8f5e8' : '#f0f9ff',
                    borderColor: dataSource === 'fresh' ? '#4caf50' : '#2196f3',
                    color: dataSource === 'fresh' ? '#2e7d32' : '#1565c0',
                    fontWeight: 500,
                    fontSize: '12px'
                  }}
                />
              )}
            </Box>
          </Paper>
          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '20px', background: '#f6edf8' }}>

            {/* Error State */}
            {error && !loading && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                textAlign: 'center',
                p: 4
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: '#d32f2f',
                  mb: 2
                }}>
                  Unable to Load Analytics
                </Typography>
                <Typography variant="body1" sx={{
                  color: '#6b7280',
                  mb: 4,
                  maxWidth: 400,
                }}>
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => window.location.reload()}
                  sx={{
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    '&:hover': {
                      borderColor: '#7c3aed',
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    }
                  }}
                >
                  Try Again
                </Button>
              </Box>
            )}

            {/* Empty State - No Connected Pages */}
            {!error && (!instagramData || instagramData.length === 0) && !loading && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: '3px dashed #d1d5db'
                }}>
                  <LinkIcon sx={{ fontSize: 48, color: '#9ca3af' }} />
                </Box>

                <Typography variant="h5" sx={{
                  fontWeight: 600,
                  color: '#374151',
                  mb: 2
                }}>
                  No Social Pages Connected
                </Typography>

                <Typography variant="body1" sx={{
                  color: '#6b7280',
                  mb: 4,
                  maxWidth: 500,
                  lineHeight: 1.6
                }}>
                  Connect your LinkedIn pages to start viewing comprehensive analytics and insights.
                  Track your performance, understand your audience, and optimize your content strategy.
                </Typography>

                <Link
                  to="/SocialMedia"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    sx={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      '&:hover': {
                        backgroundColor: '#7c3aed',
                        boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
                      }
                    }}
                  >
                    Connect Social Media
                  </Button>
                </Link>

                <Typography variant="body2" sx={{
                  color: '#9ca3af',
                  mt: 3
                }}>
                  Need help? Check our{' '}
                  <Link
                    to="/help"
                    style={{ color: '#8b5cf6', textDecoration: 'none' }}
                  >
                    connection guide
                  </Link>
                </Typography>
              </Box>
            )}

            {/* Instruction message when no data loaded */}
            {!error && instagramData && instagramData.length > 0 && selectedAccountData && !showData && (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '30vh',
                textAlign: 'center',
                p: 4,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '2px dashed #d1d5db',
                mb: 2
              }}>
                <RefreshIcon sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                  Ready to Load Analytics Data
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280', mb: 3, maxWidth: 500 }}>
                  Click the "Refresh Data" button above to load analytics for {selectedAccountData.page_name || selectedAccountData.username}.
                  This will use {apiCallCount >= 20 ? '0' : '1-2'} of your daily API calls ({apiCallCount}/20 used).
                </Typography>
                {apiCallCount >= 20 ? (
                  <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                    Daily API limit reached. Please try again tomorrow.
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    onClick={fetchAnalyticsData}
                    disabled={refreshing}
                    startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                    sx={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      px: 4,
                      py: 1,
                      borderRadius: 2,
                      fontSize: '16px',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#7c3aed',
                      }
                    }}
                  >
                    {refreshing ? 'Loading Analytics...' : 'Refresh Data'}
                  </Button>
                )}
              </Box>
            )}

            {/* Main Content - Only show when pages are connected, no errors, and data loaded */}
            {!error && instagramData && instagramData.length > 0 && showData && (
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
                          {selectedAccountData.page_name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '13px' }}>
                          {selectedAccountData.profile?.category || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '13px', lineHeight: 1.3 }}>
                          <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {selectedAccountData.profile?.followers_count ? formatNumber(selectedAccountData.profile.followers_count) : 'N/A'}
                          </Box>
                          {' Followers '}
                          <Box component="span" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                            {selectedAccountData.profile?.follows_count ? formatNumber(selectedAccountData.profile.follows_count) : 'N/A'}
                          </Box>
                          {' Following'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bio */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.4, fontSize: '13px' }}>
                      {selectedAccountData.profile?.biography || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: '13px' }}>
                      {selectedAccountData.profile?.location || 'N/A'}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Engagement Rate:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.summary?.engagement_rate || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Earned Media:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.summary?.earned_media || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                          Average Interactions:
                        </Typography>
                        <Typography variant="body2">
                          {selectedAccountData.summary?.average_interactions || 'N/A'}
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
                    {audienceEngagementData ? (
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
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 120,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body1" sx={{
                          color: '#9ca3af',
                          fontSize: '14px',
                          fontWeight: 500,
                          mb: 1
                        }}>
                          No Data Available
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: '#6b7280',
                          fontSize: '12px'
                        }}>
                          Likes: N/A
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: '#6b7280',
                          fontSize: '12px'
                        }}>
                          Comments: N/A
                        </Typography>
                        <Typography variant="body2" sx={{
                          color: '#6b7280',
                          fontSize: '12px'
                        }}>
                          Shares: N/A
                        </Typography>
                      </Box>
                    )}
                  </Card>
                </Box>
              </Box>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 12 }}>
              {hasAudienceData ? (
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
                    {audienceLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading audience insights...</Typography>
                      </Box>
                    ) : (
                      <EnhancedAudienceInsights
                        organizationId={selectedAccountData?.page_id || selectedAccountData?.username}
                        selectedUser={selectedAccountData}
                      />
                    )}
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
              ) : (
                !audienceLoading && (
                  <Box sx={{
                    width: "100%",
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      border: '2px dashed #d1d5db',
                      position: 'relative'
                    }}>
                      <InsightsIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
                      <LockIcon sx={{
                        fontSize: 16,
                        color: '#6b7280',
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        p: 0.25
                      }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Audience Insights Not Available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
                      Enhanced audience insights require additional LinkedIn API permissions or are not available for this account. Please contact support to enable this feature.
                    </Typography>
                  </Box>
                )
              )}
              </Grid>

              <Grid spacing={2} size={{ xs: 2, sm: 4, md: 12 }}>
                {console.log('🔄 selectedAccountData:', selectedAccountData)}
                {console.log('🔄 analytics object:', selectedAccountData?.analytics)}
                {console.log('🔄 recent_posts:', selectedAccountData?.analytics?.recent_posts)}
                {console.log('🔄 Passing to BrandProfile:', selectedAccountData?.analytics?.recent_posts)}
                <BrandProfile brand={selectedAccountData?.analytics?.recent_posts || []} />
              </Grid>



            </Grid>
            )}
          </Box>

        </Grid>
      </Grid>

      {/* Attractive Modal Popup for "Data not present" */}
      <Dialog
        open={showNoDataModal}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          {/* Animated Icon */}
          <Box sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '3px solid #fecaca',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Typography variant="h2" sx={{
              color: '#dc2626',
              fontSize: '48px',
              animation: 'pulse 2s infinite'
            }}>
              📊
            </Typography>
            <Box sx={{
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, transparent 30%, rgba(220, 38, 38, 0.1) 50%, transparent 70%)',
              animation: 'rotate 3s linear infinite'
            }} />
          </Box>

          {/* Title */}
          <Typography variant="h4" sx={{
            fontWeight: 700,
            color: '#1f2937',
            mb: 2,
            background: 'linear-gradient(45deg, #1f2937 30%, #374151 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            No Data Available
          </Typography>

          {/* Message */}
          <Typography variant="h6" sx={{
            color: '#6b7280',
            mb: 4,
            lineHeight: 1.6,
            maxWidth: 400,
            margin: '0 auto 32px'
          }}>
            {quotaExceeded || apiCallsRemaining === 0
              ? 'Data not present. API quota exceeded - no remaining calls available.'
              : 'Data not present. Please refresh data to fetch the latest LinkedIn analytics.'
            }
          </Typography>

          {/* Decorative Elements */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            mb: 3,
            opacity: 0.6
          }}>
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6',
                  animation: `bounce 1.5s infinite ${i * 0.2}s`
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          {!quotaExceeded && apiCallsRemaining > 0 ? (
            <Button
              onClick={fetchAnalyticsData}
              disabled={refreshing || refreshButtonDisabled}
              variant="contained"
              size="large"
              startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
              sx={{
                backgroundColor: refreshButtonDisabled ? '#ccc' : '#8b5cf6',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
                '&:hover': {
                  backgroundColor: refreshButtonDisabled ? '#ccc' : '#7c3aed',
                  boxShadow: '0 15px 35px rgba(139, 92, 246, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666',
                  boxShadow: 'none'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {refreshing ? 'Loading...' : 'Refresh Data'}
            </Button>
          ) : (
            <Chip
              label="API Quota Exceeded"
              variant="filled"
              sx={{
                height: '48px',
                backgroundColor: '#ffebee',
                borderColor: '#f44336',
                color: '#d32f2f',
                fontWeight: 600,
                fontSize: '16px',
                px: 3,
                border: '2px solid #f44336'
              }}
            />
          )}

          {/* Show quota info */}
          <Box sx={{ textAlign: 'center', mt: 2, opacity: 0.8 }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '14px' }}>
              API Calls: {apiCallsUsed} used | {apiCallsRemaining} remaining
            </Typography>
          </Box>
        </DialogActions>
      </Dialog>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}
      </style>
    </Box>

  );
};

export default LinkedinAnalytics;