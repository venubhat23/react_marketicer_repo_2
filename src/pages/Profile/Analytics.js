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
          setShowNoAnalyticsModal(true);
          setLoading(false);
          return;
        }
        setProfileData(profileRes);
        if (profileRes.length > 0) {
          const firstUser = profileRes[0];
          setPlatformOption(firstUser.name);
          setSelectedUser(firstUser);
          // Extract engagement data from the first user
          if (firstUser.engagement_over_time?.daily) {
            setEngagementData(firstUser.engagement_over_time.daily);
          } else {
            setEngagementData({});
          }
          // Extract audience engagement data
          if (firstUser.audience_engagement) {
            setAudienceEngagement(firstUser.audience_engagement);
          } else {
            setAudienceEngagement({});
          }
          // Extract recent posts
          if (firstUser.recent_posts) {
            setBrandData(firstUser.recent_posts);
          } else {
            setBrandData([]);
          }
          // Extract other audience data (if available in API response)
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
if (false) {
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