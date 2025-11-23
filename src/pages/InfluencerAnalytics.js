import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  Instagram,
  MusicNote as TikTokIcon,
  YouTube,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const InfluencerAnalytics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for the influencer - in real app, this would come from API
  const influencerData = {
    id: id,
    name: 'Alice',
    totalAudience: '24.3M',
    location: 'United States',
    categories: ['Beauty', 'Lifestyle', 'Fashion'],
    avatar: 'https://i.pravatar.cc/300?img=1',
    email: 'aliceqmail.com',
    platforms: {
      instagram: { followers: '22.3M', icon: Instagram, color: '#E1306C' },
      tiktok: { followers: '2.3M', icon: TikTokIcon, color: '#000' },
      youtube: { followers: '2.3M', icon: YouTube, color: '#FF0000' }
    },
    overview: {
      followers: '37.9K',
      qualityAudience: { score: 68, subtitle: '12.1M' },
      averageViews: '7.9K',
      engagementRate: { rate: '3.19%', status: 'Good' },
      postFrequency: { frequency: '3.1/week', status: 'Average' },
      followersGrowth: { growth: '7.9%', period: 'per month', trend: 'up' }
    },
    topContent: [
      { id: 1, image: 'https://i.pravatar.cc/300?img=11' },
      { id: 2, image: 'https://i.pravatar.cc/300?img=12' },
      { id: 3, image: 'https://i.pravatar.cc/300?img=13' },
      { id: 4, image: 'https://i.pravatar.cc/300?img=14' }
    ],
    brandCollaborations: [
      { brand: "Nike's Shoes", campaign: 'summer collaboration', subtitle: 'Nike summer sale', image: 'https://i.pravatar.cc/40?img=21' },
      { brand: "Nike's Shoes", campaign: 'summer collaboration', subtitle: 'Nike summer sale', image: 'https://i.pravatar.cc/40?img=22' },
      { brand: "Nike's Shoes", campaign: 'summer collaboration', subtitle: 'Nike summer sale', image: 'https://i.pravatar.cc/40?img=23' },
      { brand: "Nike's Shoes", campaign: 'summer collaboration', subtitle: 'Nike summer sale', image: 'https://i.pravatar.cc/40?img=24' }
    ],
    audienceQualityScore: 92,
    audienceInsights: [
      'Highly engaged audience',
      'Highly engaged audience',
      'Highly engaged audience'
    ],
    ageGroups: {
      '18-24': 30,
      '24-30': 25,
      '<30': 45,
      activeUsers: 1000
    },
    genderDistribution: {
      male: 25,
      female: 75
    }
  };

  // Chart data for engagement over time
  const engagementChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [600, 650, 700, 680, 720, 750, 800],
        borderColor: '#882AFF',
        backgroundColor: 'rgba(136, 42, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const engagementChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.1)'
        },
        beginAtZero: true
      }
    }
  };

  // Age groups doughnut chart
  const ageGroupsChartData = {
    labels: ['18-24', '24-30', '<30'],
    datasets: [
      {
        data: [30, 25, 45],
        backgroundColor: ['#882AFF', '#B388FF', '#E1BEE7'],
        borderWidth: 0
      }
    ]
  };

  const ageGroupsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 8
        }
      }
    },
    cutout: '60%'
  };

  // Gender distribution chart
  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [25, 75],
        backgroundColor: ['#882AFF', '#E1BEE7'],
        borderWidth: 0
      }
    ]
  };

  const genderChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxHeight: 8
        }
      }
    },
    cutout: '70%'
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(influencerData.email);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={0}>
        <Grid item md={1} className="side_section">
          <Sidebar />
        </Grid>
        <Grid item md={11}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#091a48',
              borderBottom: '1px solid #e2e8f0',
              borderRadius: 0
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="start"
                  sx={{ mr: 2, color: '#fff' }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Influencer Analytics
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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

          <Box sx={{ p: 2, height: 'calc(100vh - 80px)', overflow: 'auto' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {/* Left Sidebar - Profile Info */}
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', flex: '0 0 auto' }}>
                    <Avatar 
                      src={influencerData.avatar} 
                      sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} 
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {influencerData.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {influencerData.totalAudience} total audience
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {influencerData.location}
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      {influencerData.categories.map((category, index) => (
                        <Chip 
                          key={index} 
                          label={category} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5, fontSize: '10px' }}
                        />
                      ))}
                    </Box>

                    {/* Platform Icons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1 }}>
                      {Object.entries(influencerData.platforms).map(([platform, data]) => {
                        const IconComponent = data.icon;
                        return (
                          <Box key={platform} sx={{ textAlign: 'center' }}>
                            <IconComponent sx={{ color: data.color, fontSize: 16 }} />
                            <Typography variant="caption" sx={{ display: 'block', fontSize: '8px' }}>
                              {data.followers}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{
                        backgroundColor: '#882AFF',
                        '&:hover': { backgroundColor: '#7625e6' },
                        mb: 1
                      }}
                    >
                      Add to..
                    </Button>

                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 0.5,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        cursor: 'pointer'
                      }}
                      onClick={copyEmail}
                    >
                      <Typography variant="caption" sx={{ mr: 1 }}>
                        @{influencerData.email}
                      </Typography>
                      <CopyIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    </Box>
                  </Paper>

                  {/* Age Groups Chart */}
                  <Paper sx={{ p: 2, flex: '1 1 auto' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Age groups</Typography>
                    <Box sx={{ height: 150, position: 'relative' }}>
                      <Doughnut data={ageGroupsChartData} options={ageGroupsChartOptions} />
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          Active users
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {influencerData.ageGroups.activeUsers.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Gender Distribution */}
                    <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>Gender Distribution</Typography>
                    <Box sx={{ height: 100 }}>
                      <Doughnut data={genderChartData} options={genderChartOptions} />
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} md={9}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs 
                      value={activeTab} 
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        '& .MuiTab-root': {
                          textTransform: 'none',
                          fontWeight: 500,
                          minHeight: '48px',
                          '&.Mui-selected': {
                            color: '#882AFF'
                          }
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#882AFF'
                        }
                      }}
                    >
                      <Tab label="Overview" />
                    </Tabs>
                  </Box>

                  {/* Overview Tab Content */}
                    <Box sx={{ flex: 1, overflow: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                      {/* Overview Metrics Cards - Row 1 */}
                      <Grid container spacing={1} sx={{ mb: 1.5 }}>
                        <Grid item xs={12} md={4}>
                          <Card sx={{ height: '80px' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography color="text.secondary" sx={{ fontSize: 10, mb: 0.5 }}>
                                Followers
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                {influencerData.overview.followers}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card sx={{ height: '80px' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography color="text.secondary" sx={{ fontSize: 10, mb: 0.5 }}>
                                Quality Audience
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                  {influencerData.overview.qualityAudience.score}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                                  {influencerData.overview.qualityAudience.subtitle}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card sx={{ height: '80px' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography color="text.secondary" sx={{ fontSize: 10, mb: 0.5 }}>
                                Average Views
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                {influencerData.overview.averageViews}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      {/* Overview Metrics Cards - Row 2 */}
                      <Grid container spacing={1} sx={{ mb: 1.5 }}>
                        <Grid item xs={12} md={4}>
                          <Card sx={{ height: '80px' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography color="text.secondary" sx={{ fontSize: 10, mb: 0.5 }}>
                                Engagement Rate
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                  {influencerData.overview.engagementRate.rate}
                                </Typography>
                                <Chip 
                                  label={influencerData.overview.engagementRate.status}
                                  size="small"
                                  color="success"
                                  sx={{ height: '16px', fontSize: '8px' }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card sx={{ height: '80px' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography color="text.secondary" sx={{ fontSize: 10, mb: 0.5 }}>
                                Post Frequency
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                  {influencerData.overview.postFrequency.frequency}
                                </Typography>
                                <Chip 
                                  label={influencerData.overview.postFrequency.status}
                                  size="small"
                                  color="warning"
                                  sx={{ height: '16px', fontSize: '8px' }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card sx={{ height: '80px' }}>
                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                              <Typography color="text.secondary" sx={{ fontSize: 10, mb: 0.5 }}>
                                Followers Growth
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                  {influencerData.overview.followersGrowth.growth}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                                  {influencerData.overview.followersGrowth.period}
                                </Typography>
                                <Box sx={{ color: 'green', fontSize: 14 }}>↗</Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                    <Grid container spacing={1.5} sx={{ height: 'calc(100% - 120px)' }}>
                      {/* Top Performing Content */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 1.5, height: '250px', display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                            Top Performing Contents
                          </Typography>
                          <Grid container spacing={0.5} sx={{ flex: 1 }}>
                            {influencerData.topContent.map((content, index) => (
                              <Grid item xs={6} key={content.id}>
                                <Box
                                  sx={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    backgroundColor: '#f5f5f5',
                                    height: 80
                                  }}
                                >
                                  <img
                                    src={content.image}
                                    alt={`Content ${content.id}`}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                  <IconButton
                                    sx={{
                                      position: 'absolute',
                                      top: 4,
                                      right: 4,
                                      backgroundColor: 'rgba(0,0,0,0.5)',
                                      color: 'white',
                                      width: 20,
                                      height: 20,
                                      fontSize: '12px',
                                      '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.7)'
                                      }
                                    }}
                                  >
                                    ×
                                  </IconButton>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Paper>
                      </Grid>

                      {/* Engagement over time */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 1.5, height: '250px', display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                            Engagement over time
                          </Typography>
                          <Box sx={{ height: 180, flex: 1 }}>
                            <Line data={engagementChartData} options={engagementChartOptions} />
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Brand Collaboration */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 1.5, height: '250px', display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                            Brand Collaboration
                          </Typography>
                          <Box sx={{ flex: 1, overflow: 'auto' }}>
                            {influencerData.brandCollaborations.slice(0, 4).map((collab, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Avatar src={collab.image} sx={{ width: 32, height: 32, mr: 1 }} />
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '12px' }}>
                                    {collab.brand}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                                    {collab.subtitle}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      </Grid>

                      {/* Audience Quality Score */}
                      <Grid item xs={12} md={6}>
                        <Paper 
                          sx={{ 
                            p: 1.5, 
                            height: '250px',
                            background: 'linear-gradient(135deg, #882AFF 0%, #B388FF 100%)',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                            <Typography variant="h3" sx={{ fontWeight: 600, mr: 1, fontSize: '2.5rem' }}>
                              {influencerData.audienceQualityScore}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                              Audience Quality Score
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 1, fontSize: '12px' }}>
                            out of 100%
                          </Typography>
                          
                          <Box sx={{ flex: 1 }}>
                            {influencerData.audienceInsights.slice(0, 3).map((insight, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Box sx={{ 
                                  width: 4, 
                                  height: 4, 
                                  borderRadius: '50%', 
                                  backgroundColor: 'white',
                                  mr: 0.5 
                                }} />
                                <Typography variant="body2" sx={{ fontSize: '11px' }}>
                                  {insight}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfluencerAnalytics;