import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar,
  Grid, Select, TextField, MenuItem,
  Card, AppBar, Toolbar, Paper, InputLabel,
  CardContent, IconButton, Chip, LinearProgress,
  Container, Divider, ButtonGroup, Button
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ClickAwayIcon from "@mui/icons-material/TouchApp";
import AnalyticsProfile from '../Profile/AnalyticsProfile';
import Engagement from '../Profile/Engagement';
import Audience from '../Profile/Audience';
import AudienceInsights from '../Profile/AudienceInsights';
import BrandProfile from '../Profile/BrandProfile';
import Sidebar from '../../components/Sidebar';
import TabComponent from '../../components/TabComponent';
import PaidPerformance from '../Profile/PaidPerformance';
import ContentInsight from '../Profile/ContentInsight';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];

const Analytics = () => {
  const [profileData, setProfileData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [platformOption, setPlatformOption] = useState('');
  const [engagementData, setEngagementData] = useState([]);
  const [audienceInsight, setAudienceInsight] = useState([]);
  const [audienceEngagement, setAudienceEngagement] = useState([]);
  const [audienceAge, setAudienceAge] = useState([]);
  const [reachability, setReachability] = useState([]);
  const [gender, setGender] = useState([]);
  const [location, setLocation] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    axios.get('https://api.marketincer.com/api/v1/influencer/analytics')
      .then((response) => {
        setProfileData(response?.data?.data || []);
        setBrandData(response?.data?.data?.recent_posts || []);
        setEngagementData(response?.data?.data?.engagement_over_time.daily || {});
        setAudienceEngagement(response?.data?.data?.audience_engagement || {});
        setAudienceAge(response?.data?.data?.audience_age || {});
        setReachability(response?.data?.data?.audience_reachability.notable_followers || {});
        setGender(response?.data?.data?.audience_gender || {});
        setLocation(response?.data?.data?.audience_location.countries || {});
      })
      .catch((error) => {
        console.error('Error fetching analytics:', error);
      });
  }, []);

  const notableNo = profileData?.audience_reachability?.notable_followers_count;
  const cities = profileData?.audience_location?.cities;
  const language = profileData?.audience_details?.languages;
  const intrest = profileData?.audience_details?.interests;
  const brand_affinity = profileData?.audience_details?.brand_affinity;

  // Enhanced metrics cards with icons and colors
  const getMetricIcon = (label) => {
    switch (label.toLowerCase()) {
      case 'total likes': return <FavoriteIcon sx={{ color: '#e91e63' }} />;
      case 'total comments': return <ChatBubbleIcon sx={{ color: '#2196f3' }} />;
      case 'total engagement': return <TrendingUpIcon sx={{ color: '#4caf50' }} />;
      case 'total reach': return <VisibilityIcon sx={{ color: '#ff9800' }} />;
      case 'total shares': return <ShareIcon sx={{ color: '#9c27b0' }} />;
      case 'total saves': return <BookmarkIcon sx={{ color: '#00bcd4' }} />;
      case 'total clicks': return <ClickAwayIcon sx={{ color: '#795548' }} />;
      case 'profile visits': return <PeopleIcon sx={{ color: '#607d8b' }} />;
      default: return <TrendingUpIcon sx={{ color: '#4caf50' }} />;
    }
  };

  const getMetricColor = (label) => {
    const colors = {
      'total likes': '#e91e63',
      'total comments': '#2196f3',
      'total engagement': '#4caf50',
      'total reach': '#ff9800',
      'total shares': '#9c27b0',
      'total saves': '#00bcd4',
      'total clicks': '#795548',
      'profile visits': '#607d8b'
    };
    return colors[label.toLowerCase()] || '#4caf50';
  };

  const MetricCard = ({ title, value, change, icon }) => (
    <Card 
      sx={{ 
        height: '140px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {value || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {change > 0 ? <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />}
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {change > 0 ? '+' : ''}{change}% vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const tabs = [
    {
      label: 'Audience Insights',
      content: (
        <AudienceInsights 
          audienceAge={audienceAge} 
          reachability={reachability} 
          brand_affinity={brand_affinity} 
          intrest={intrest} 
          cities={cities} 
          language={language} 
          notableNo={notableNo}  
          gender={gender}  
          location={location}
        />
      ),
    },
    {
      label: 'Paid Performance',
      content: <PaidPerformance />,
    },
    {
      label: 'Content Insights',
      content: <ContentInsight />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 2,
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              borderRadius: 0,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 2
            }}>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                📊 Influencer Analytics Dashboard
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
            {/* Decorative elements */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              zIndex: 1
            }} />
          </Paper>

          {/* Filters Section */}
          <Paper 
            elevation={0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px',
              borderRadius: 0
            }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    type="date"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '& fieldset': { border: 'none' },
                      },
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    <Select
                      value={platformOption}
                      onChange={(e) => setPlatformOption(e.target.value)}
                      displayEmpty
                      size="small"
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                      }}
                    >
                      <MenuItem value="">Select Platform</MenuItem>
                      {top100Films.map((platform, index) => (
                        <MenuItem key={index} value={platform.label}>{platform.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    <Select
                      value={platformOption}
                      onChange={(e) => setPlatformOption(e.target.value)}
                      displayEmpty
                      size="small"
                      sx={{
                        bgcolor: '#fff',
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                      }}
                    >
                      <MenuItem value="">Select Influencer</MenuItem>
                      {top100Films.map((platform, index) => (
                        <MenuItem key={index} value={platform.label}>{platform.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <ButtonGroup variant="contained" sx={{ backgroundColor: '#fff', borderRadius: '12px' }}>
                    {['7d', '30d', '90d'].map((range) => (
                      <Button
                        key={range}
                        onClick={() => setSelectedTimeRange(range)}
                        sx={{
                          backgroundColor: selectedTimeRange === range ? '#1976d2' : '#fff',
                          color: selectedTimeRange === range ? '#fff' : '#1976d2',
                          borderRadius: selectedTimeRange === range ? '12px' : '0px',
                          '&:hover': {
                            backgroundColor: selectedTimeRange === range ? '#1565c0' : '#f5f5f5'
                          }
                        }}
                      >
                        {range}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Container>
          </Paper>

          {/* Main Content */}
          <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
            <Grid container spacing={4}>
              {/* Profile Section */}
              <Grid size={{ xs: 12, md: 4 }}>
                <AnalyticsProfile profile={profileData} />
              </Grid>

              {/* Campaign Analytics Cards */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: '#1a202c',
                    fontSize: '1.5rem'
                  }}
                >
                  📈 Campaign Performance
                </Typography>
                <Grid container spacing={3}>
                  {profileData?.campaign_analytics && (
                    <>
                      <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                        <MetricCard
                          title="Total Likes"
                          value={profileData.campaign_analytics.total_likes}
                          icon={getMetricIcon('total likes')}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                        <MetricCard
                          title="Total Comments"
                          value={profileData.campaign_analytics.total_comments}
                          icon={getMetricIcon('total comments')}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                        <MetricCard
                          title="Total Engagement"
                          value={profileData.campaign_analytics.total_engagement}
                          icon={getMetricIcon('total engagement')}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                        <MetricCard
                          title="Total Reach"
                          value={profileData.campaign_analytics.total_reach}
                          icon={getMetricIcon('total reach')}
                        />
                      </Grid>
                    </>
                  )}
                  
                  {/* Additional metrics if available in API */}
                  {profileData?.campaign_analytics?.total_shares && (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                      <MetricCard
                        title="Total Shares"
                        value={profileData.campaign_analytics.total_shares}
                        icon={getMetricIcon('total shares')}
                      />
                    </Grid>
                  )}
                  
                  {profileData?.campaign_analytics?.total_saves && (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                      <MetricCard
                        title="Total Saves"
                        value={profileData.campaign_analytics.total_saves}
                        icon={getMetricIcon('total saves')}
                      />
                    </Grid>
                  )}
                  
                  {profileData?.campaign_analytics?.total_clicks && (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                      <MetricCard
                        title="Total Clicks"
                        value={profileData.campaign_analytics.total_clicks}
                        icon={getMetricIcon('total clicks')}
                      />
                    </Grid>
                  )}
                  
                  {profileData?.campaign_analytics?.profile_visits && (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }}>
                      <MetricCard
                        title="Profile Visits"
                        value={profileData.campaign_analytics.profile_visits}
                        icon={getMetricIcon('profile visits')}
                      />
                    </Grid>
                  )}

                  {/* If no campaign analytics data available, show message */}
                  {!profileData?.campaign_analytics && (
                    <Grid size={{ xs: 12 }}>
                      <Card sx={{ 
                        borderRadius: '20px', 
                        p: 4, 
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white'
                      }}>
                        <Typography variant="h6">
                          📊 Campaign Analytics Loading...
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                          Fetching your latest campaign performance data
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {/* Engagement and Audience Charts */}
              <Grid size={{ xs: 12, md: 6 }}>
                {engagementData && Object.keys(engagementData).length > 0 ? (
                  <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
                        📊 Engagement Overview
                      </Typography>
                      <Engagement engagement={engagementData} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card sx={{ 
                    borderRadius: '20px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    color: '#1a202c'
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        📊 Engagement Data
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        No engagement data available yet
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {audienceEngagement && Object.keys(audienceEngagement).length > 0 ? (
                  <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1a202c' }}>
                        👥 Audience Engagement
                      </Typography>
                      <Audience audienceData={audienceEngagement} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card sx={{ 
                    borderRadius: '20px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    color: '#1a202c'
                  }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        👥 Audience Data
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        No audience engagement data available yet
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Grid>

              {/* Advanced Analytics Tabs */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      🔍 Advanced Analytics
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                      {audienceAge && Object.keys(audienceAge).length > 0 || 
                       reachability && Object.keys(reachability).length > 0 ||
                       brand_affinity || intrest || cities || language
                        ? "Deep dive into audience insights, paid performance, and content analytics"
                        : "Analytics data will appear here once available"}
                    </Typography>
                  </Box>
                  {(audienceAge && Object.keys(audienceAge).length > 0) || 
                   (reachability && Object.keys(reachability).length > 0) ||
                   brand_affinity || intrest || cities || language ? (
                    <TabComponent tabs={tabs} defaultIndex={0} />
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                        🔄 Loading advanced analytics data...
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        Audience insights, paid performance, and content analytics will be displayed here
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>

              {/* Brand Profile Section */}
              <Grid size={{ xs: 12 }}>
                <Card sx={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a202c' }}>
                      🏢 Brand Collaborations
                    </Typography>
                    {brandData && brandData.length > 0 ? (
                      <BrandProfile brand={brandData} />
                    ) : (
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 4,
                        background: 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)',
                        borderRadius: '15px',
                        color: '#1a202c'
                      }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          🤝 Brand Collaborations
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          No brand collaboration data available yet
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;