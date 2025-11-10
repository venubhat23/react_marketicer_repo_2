import React, { useEffect, useState } from 'react'
import {
  Box, Typography, FormControl, Avatar,
  List,
  ListItem,
  ListItemIcon,
  Autocomplete,
  Grid, Select,
  TextField, MenuItem,
  InputAdornment, ListItemText,
  Card, AppBar, Toolbar, Paper, InputLabel,
  CardContent, IconButton, OutlinedInput, CircularProgress,
  Modal,
  Button
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import AnalyticsProfile from '../Profile/AnalyticsProfile'
import Engagement from '../Profile/Engagement';
import Audience from '../Profile/Audience';
import AudienceInsights from '../Profile/AudienceInsights';
import BrandProfile from '../Profile/BrandProfile'
import Layout from '../../components/Layout'
import TabComponent from '../../components/TabComponent';
import PaidPerformance from '../Profile/PaidPerformance';
import ContentInsight from '../Profile/ContentInsight';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar' 
import axios from 'axios';

const Analytics = () => {

  const influencerData = {
    name: "Alice",
    profileImage: "https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png",
    followers: "32.8K",
    following: "30K",
    bio: "Bio: Lorem Ipsum dolor sit",
    category: "Beauty & Lifestyle",
    location: "USA",
    metrics: [
      { label: "Engagement Rate:", value: "3.1%" },
      { label: "Earned Media:", value: "249" },
      { label: "Average Interactions:", value: "3.1%" },
    ],
  };

  const analyticsCards = [
    { value: "24.3K", label: "Total Likes" },
    { value: "403", label: "Total Comments" },
    { value: "1.3%", label: "Total Engagement" },
    { value: "32.8K", label: "Total Reach" },
    { value: "12.1K", label: "Total Shares" },
    { value: "428", label: "Total Saves" },
    { value: "829", label: "Total Clicks" },
    { value: "829", label: "Profile Visits" },
  ];

  const [profileData, setProfileData] = useState([])
  const [brandData, setBrandData] = useState([])
  const [platformOption, setPlatformOption] = useState('')
  const [engagementData, setEngagementData] = useState({});
  const [audienceInsight, setAudienceInsight] = useState([]);
  const [audienceEngagement, setAudienceEngagement] = useState({})
  const [audienceAge, setAudienceAge] = useState([]);
  const [reachability, setReachability] = useState([]);
  const [gender, setGender] = useState([]);
  const [location, setLocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNoAnalyticsModal, setShowNoAnalyticsModal] = useState(false);


useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");

    // First try LinkedIn analytics API
    axios.get('https://api.marketincer.com/api/v1/linkedin/analytics', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        const profileRes = response?.data?.data || []
        // Show modal if backend returns nil or empty array
        if (!profileRes || profileRes.length === 0) {
          // Fallback to influencer analytics API
          return axios.get('https://api.marketincer.com/api/v1/influencer/analytics', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
        }
        return { data: response.data };
      })
      .then((response) => {
        const profileRes = response?.data?.data || []

        if (!profileRes || profileRes.length === 0) {
          setShowNoAnalyticsModal(true);
          setLoading(false);
          return;
        }

        // Transform data to expected format (handles both LinkedIn and Instagram data)
        const transformedData = profileRes.map(profileData => {
          const profile = profileData.profile || {};
          const analytics = profileData.analytics || {};
          const insights = profileData.insights || {};

          // Detect platform - LinkedIn data will have page_id, Instagram will have different structure
          const isLinkedIn = profileData.page_id !== undefined || profileData.insights !== undefined;

          // Transform engagement trends for chart (LinkedIn specific)
          const engagementTrends = isLinkedIn ? insights?.content_performance?.engagement_trends || [] : [];
          const engagementOverTime = {};

          if (isLinkedIn && engagementTrends.length > 0) {
            engagementTrends.forEach((trend, index) => {
              const weekDate = new Date(trend.week_starting);
              const weekName = `Week ${index + 1}`;
              engagementOverTime[weekName.toLowerCase()] = trend.average_engagement || 0;
            });
          } else if (isLinkedIn) {
            // Create default weekly data for LinkedIn if no trends available
            ['Week 1', 'Week 2', 'Week 3', 'Week 4'].forEach((week, index) => {
              engagementOverTime[week.toLowerCase()] = 0;
            });
          } else {
            // For Instagram, preserve existing engagement_over_time structure if it exists
            if (profileData.engagement_over_time?.daily) {
              Object.assign(engagementOverTime, profileData.engagement_over_time.daily);
            }
          }

          // Transform audience engagement for pie chart
          let audienceEngagement = {};

          if (isLinkedIn) {
            // LinkedIn-specific audience engagement logic
            const likesPerc = analytics?.engagement_stats?.likes_percentage || 0;
            const commentsPerc = analytics?.engagement_stats?.comments_percentage || 0;
            const sharesPerc = analytics?.engagement_stats?.shares_percentage || 0;

            if (likesPerc > 0 || commentsPerc > 0 || sharesPerc > 0) {
              audienceEngagement = {
                likes: `${likesPerc}%`,
                comments: `${commentsPerc}%`,
                shares: `${sharesPerc}%`
              };
            } else {
              // If no engagement stats, try to calculate from recent posts
              const recentPosts = analytics?.recent_posts || [];
              if (recentPosts.length > 0) {
                const totalLikes = recentPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
                const totalComments = recentPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
                const totalShares = recentPosts.reduce((sum, post) => sum + (post.shares || 0), 0);
                const totalEngagement = totalLikes + totalComments + totalShares;

                if (totalEngagement > 0) {
                  audienceEngagement = {
                    likes: `${Math.round((totalLikes / totalEngagement) * 100)}%`,
                    comments: `${Math.round((totalComments / totalEngagement) * 100)}%`,
                    shares: `${Math.round((totalShares / totalEngagement) * 100)}%`
                  };
                }
              }
            }
          } else {
            // For Instagram, preserve existing audience_engagement structure
            if (profileData.audience_engagement) {
              Object.assign(audienceEngagement, profileData.audience_engagement);
            }
          }

          // Transform campaign analytics cards
          let campaignAnalytics = [];

          if (isLinkedIn) {
            // LinkedIn-specific campaign analytics
            campaignAnalytics = [
              { value: analytics?.total_likes?.toString() || '0', label: 'Total Likes' },
              { value: analytics?.total_comments?.toString() || '0', label: 'Total Comments' },
              { value: `${analytics?.total_engagement || 0}`, label: 'Total Engagement' },
              { value: analytics?.total_reach?.toString() || '0', label: 'Total Reach' },
              { value: analytics?.total_shares?.toString() || '0', label: 'Total Shares' },
              { value: analytics?.total_saves?.toString() || '0', label: 'Total Saves' },
              { value: analytics?.total_clicks?.toString() || '0', label: 'Total Clicks' },
              { value: analytics?.visitor_highlights?.page_views?.toString() || '0', label: 'Profile Visits' },
              { value: analytics?.posting_frequency?.average_posts_per_month?.toString() || '0', label: 'Avg Posts/Month' },
              { value: profile?.engagement_rate?.toString() || '0%', label: 'Engagement Rate' },
              { value: profile?.followers_count?.toString() || '0', label: 'Followers' },
              { value: analytics?.content_analysis?.total_posts?.toString() || '0', label: 'Total Posts' }
            ];
          } else {
            // For Instagram, preserve existing campaign_analytics structure
            campaignAnalytics = profileData.campaign_analytics || [];
          }

          // Transform recent posts
          let recentPosts = [];
          if (isLinkedIn) {
            // LinkedIn-specific recent posts transformation
            recentPosts = analytics?.recent_posts?.map(post => ({
              platform: 'LinkedIn',
              brand: profile.name || 'LinkedIn Profile',
              content: post.caption || post.full_caption || 'No content available',
              date: post.timestamp,
              likes: post.likes || 0,
              comments: post.comments || 0,
              shares: post.shares || 0,
              views: 0, // LinkedIn doesn't provide views in this API
              thumbnail_url: null // LinkedIn doesn't provide thumbnail in this format
            })) || [];
          } else {
            // For Instagram, preserve existing recent_posts structure
            recentPosts = profileData.recent_posts || [];
          }

          return {
            name: profile.name || (isLinkedIn ? 'LinkedIn Profile' : profileData.name),
            username: profile.username || profileData.username || '@unknown',
            page_id: profileData.page_id,
            platform: isLinkedIn ? 'linkedin' : 'instagram', // Add platform indicator
            profile: profile,
            analytics: analytics, // Keep original analytics data
            insights: insights,   // Keep original insights data
            engagement_over_time: {
              daily: engagementOverTime
            },
            audience_engagement: audienceEngagement,
            campaign_analytics: campaignAnalytics,
            recent_posts: recentPosts,
            // Demographics data (LinkedIn specific)
            audience_age: isLinkedIn ? profileData.demographics?.seniorities || [] : profileData.audience_age || [],
            audience_gender: isLinkedIn ? profileData.demographics?.job_functions || [] : profileData.audience_gender || [],
            audience_location: isLinkedIn ? {
              countries: profileData.demographics?.industries || []
            } : profileData.audience_location || {},
            audience_reachability: isLinkedIn ? {
              notable_followers: [],
              notable_followers_count: insights?.audience_growth?.current_followers || 0
            } : profileData.audience_reachability || {},
            audience_details: isLinkedIn ? {
              languages: [],
              interests: [],
              brand_affinity: []
            } : profileData.audience_details || {}
          };
        });

        setProfileData(transformedData);

        if (transformedData.length > 0) {
          const firstUser = transformedData[0];
          setPlatformOption(firstUser.name);
          setSelectedUser(firstUser);

          // Set engagement data
          if (firstUser.engagement_over_time?.daily) {
            setEngagementData(firstUser.engagement_over_time.daily);
          } else {
            setEngagementData({});
          }

          // Set audience engagement data
          if (firstUser.audience_engagement) {
            setAudienceEngagement(firstUser.audience_engagement);
          } else {
            setAudienceEngagement({});
          }

          // Set recent posts
          if (firstUser.recent_posts) {
            setBrandData(firstUser.recent_posts);
          } else {
            setBrandData([]);
          }

          // Set other audience data
          if (firstUser.audience_age) {
            setAudienceAge(firstUser.audience_age);
          }
          if (firstUser.audience_reachability?.notable_followers) {
            setReachability(firstUser.audience_reachability.notable_followers);
          }
          if (firstUser.audience_gender) {
            setGender(firstUser.audience_gender);
          }
          if (firstUser.audience_location?.countries) {
            setLocation(firstUser.audience_location.countries);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching analytics:', error);
        setShowNoAnalyticsModal(true);
        setLoading(false);
      });
  }, []);

  // Extract additional data for AudienceInsights
  const notableNo = selectedUser?.audience_reachability?.notable_followers_count || 0;
  const cities = selectedUser?.audience_location?.cities || [];
  const language = selectedUser?.audience_details?.languages || [];
  const intrest = selectedUser?.audience_details?.interests || [];
  const brand_affinity = selectedUser?.audience_details?.brand_affinity || [];

  const handleProfileChange = (e) => {
    const name = e.target.value;

    // Don't proceed if empty value is selected
    if (!name) {
      return;
    }

    setPlatformOption(name);
    const user = profileData.find(item => item.name === name);
    setSelectedUser(user);

    if (user) {
      // Update engagement data when user changes
      if (user.engagement_over_time?.daily) {
        setEngagementData(user.engagement_over_time.daily);
      } else {
        setEngagementData({});
      }

      // Update audience engagement data
      if (user.audience_engagement) {
        setAudienceEngagement(user.audience_engagement);
      } else {
        setAudienceEngagement({});
      }

      // Update recent posts
      if (user.recent_posts) {
        setBrandData(user.recent_posts);
      } else {
        setBrandData([]);
      }

      // Update other audience data
      if (user.audience_age) {
        setAudienceAge(user.audience_age);
      }
      if (user.audience_reachability?.notable_followers) {
        setReachability(user.audience_reachability.notable_followers);
      }
      if (user.audience_gender) {
        setGender(user.audience_gender);
      }
      if (user.audience_location?.countries) {
        setLocation(user.audience_location.countries);
      }
    }
  };

  const tabs = [
    {
      label: 'Audience Insights',
      content: <div>
        <AudienceInsights
          audienceAge={audienceAge}
          reachability={reachability}
          brand_affinity={brand_affinity}
          intrest={intrest} cities={cities}
          language={language}
          notableNo={notableNo}
          gender={gender}
          location={location}
        />
      </div>,
    },
    {
      label: 'Paid Performance',
      content: <div>< PaidPerformance /></div>,
    },
    {
      label: 'Content Insights',
      content: <div>< ContentInsight /></div>,
    },
  ];

  const selectedData = profileData.filter(item => item.name === platformOption);

    // Show loading state
  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

// Show "No Analytics Found" modal
if (showNoAnalyticsModal) {
  return (
    <Modal
      open={showNoAnalyticsModal}
      onClose={() => setShowNoAnalyticsModal(false)}
      aria-labelledby="no-analytics-modal-title"
      aria-describedby="no-analytics-modal-description"
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
        <Typography id="no-analytics-modal-title" variant="h6" component="h2" color="error">
          No Analytics Found
        </Typography>
        <Typography id="no-analytics-modal-description" sx={{ mt: 2 }}>
          We couldn't find any analytics data to display. Please try again later or check your data source.
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
          onClick={() => window.location.href = "https://app.marketincer.com/createPost"}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
  return (
    // <Layout>
      <Box sx={{ flexGrow: 1 }} >
        <Grid container>
          <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid>
          <Grid size={{ md: 11 }}>
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              alignItems: 'center', bgcolor: '#B1C6FF', padding: '10px',
            }}>

            <FormControl fullWidth sx={{ display: 'none' }}>
              <TextField
                type="date"
                variant="outlined"
                size="small"
                sx={{
                  height: '40px',
                  mt: '6px',
                  borderRadius: '30px',
                  backgroundColor: '#fff',
                  '& .MuiInputBase-input': {
                    padding: '9px',
                    borderRadius: '30px'
                  },
                  '& .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.MuiInputBase-formControl.MuiInputBase-sizeSmall': {
                    borderRadius: '30px',
                  }
                }} />
            </FormControl>

            <FormControl fullWidth>
              <Select
                value={platformOption}
                onChange={handleProfileChange}
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
                {profileData.length === 0 ? (
                  <MenuItem value="" disabled>
                    <em>No profiles available</em>
                  </MenuItem>
                ) : (
                  profileData.map((item, index) => (
                    <MenuItem 
                      key={`${item.name}-${index}`}
                      value={item.name}
                      sx={{
                        backgroundColor: platformOption === item.name ? '#1976d2 !important' : 'transparent',
                        color: platformOption === item.name ? 'white !important' : 'inherit',
                        '&:hover': {
                          backgroundColor: platformOption === item.name ? '#1565c0 !important' : '#f5f5f5 !important',
                        },
                      }}
                    >
                      {item.name}
                      {item.username !== "@unknown" && ` (${item.username})`}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ display: 'none' }}>
              <InputLabel id="demo-simple-select-label">Influencer</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Influencer"
                size="small"
                sx={{
                  bgcolor: '#fff', borderRadius: '50px', height: '40px',
                  mt: '6px',
                }}
              >
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ display: 'none' }}>
              <InputLabel id="demo-simple-select-label">Post Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Post Type"
                size="small"
                sx={{
                  bgcolor: '#fff', borderRadius: '50px', height: '40px',
                  mt: '6px',
                }}
              >
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '15px' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 4 }} spacing={1} sx={{ mt: '-20px', p: 1 }}>
                <AnalyticsProfile profile={profileData} selectedData={selectedData} />
              </Grid>

              {selectedUser && (
                <Grid size={{ xs: 4, sm: 4, md: 8 }} spacing={1}>
                  <Box>
                    <Grid container spacing={1}>
                      {selectedUser?.campaign_analytics?.slice(0, 12).map((profile, index) => (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                          <Card
                            sx={{
                              width: 220,
                              height: 86,
                              border: "1px solid #b6b6b6",
                              borderRadius: "10px",
                            }}
                          >
                            <CardContent sx={{ textAlign: "center", p: 1 }}>
                              <Typography variant="h6">{profile?.value}</Typography>
                              <Typography variant="body2" sx={{ mt: 2 }}>
                                {profile?.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              )}


              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2} >
                <Engagement
                  engagement={engagementData}
                  selectedUser={selectedUser}
                />
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2}>
                <Audience audienceData={audienceEngagement} />
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 12 }} spacing={2} sx={{ display: 'none' }}>
                <TabComponent tabs={tabs} defaultIndex={0} />
              </Grid>

              <Grid size={{ xs: 2, sm: 6, md: 12 }} spacing={2}>
                <BrandProfile brand={brandData} />
              </Grid>

            </Grid>
          </Box>
          </Grid>
        </Grid>
          
      </Box>
    // </Layout>
  )
}

export default Analytics
