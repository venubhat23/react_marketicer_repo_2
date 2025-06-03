import React, {useEffect, useState } from 'react'
import {
   Box, Typography, FormControl, Avatar,
  List,
  ListItem,
  ListItemIcon,
  Autocomplete,
  Grid,Select,
  TextField,MenuItem,
  InputAdornment,ListItemText,
  Card,AppBar,Toolbar,Paper,InputLabel,
  CardContent, IconButton,OutlinedInput,
  } from "@mui/material";
  import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
  import AnalyticsProfile from '../Profile/AnalyticsProfile'
  import Engagement  from '../Profile/Engagement';
import Audience from '../Profile/Audience';
import AudienceInsights from '../Profile/AudienceInsights';
import BrandProfile from '../Profile/BrandProfile'
import Sidebar from '../../components/Sidebar'
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
  ]

const Analytics =()=>{
  
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
    const [engagementData, setEngagementData] = useState([]);
    const [audienceInsight, setAudienceInsight] = useState([]);
    const [audienceEngagement, setAudienceEngagement] = useState([])
    const [audienceAge, setAudienceAge] = useState([]);
    const [reachability, setReachability] = useState([]);
    const [gender, setGender]= useState([]);
    const [location, setLocation] = useState([]);

    
    
    useEffect(() => {
      axios.get('https://api.marketincer.com/api/v1/influencer/analytics')
        .then((response) => {
          setProfileData(response?.data?.data || []);
          setBrandData(response?.data?.data?.recent_posts || [])
          setEngagementData(response?.data?.data?.engagement_over_time.daily || {})
          setAudienceEngagement(response?.data?.data?.audience_engagement || {})
          setAudienceAge(response?.data?.data?.audience_age || {})
          setReachability(response?.data?.data?.audience_reachability.notable_followers || {})
          setGender(response?.data?.data?.audience_gender || {})
          setLocation(response?.data?.data?.audience_location.countries || {})

          //setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching analytics:', error);
          //setLoading(false);
        });
    }, []);
    
    const notableNo = profileData?.audience_reachability?.notable_followers_count
    const cities = profileData?.audience_location?.cities
    const language = profileData?.audience_details?.languages
    const intrest = profileData?.audience_details?.interests
    const brand_affinity = profileData?.audience_details?.brand_affinity


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


    return(

    <Box sx={{ flexGrow: 1 }} >
        <Grid container>
          <Grid size={{ md: 1 }}> <Sidebar/></Grid>
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
                gap: 2, // spacing between items
                alignItems: 'center',bgcolor: '#B1C6FF',padding: '15px',
              }}>
                        
                    <FormControl fullWidth>
                    
                      <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        sx={{
                         
                          borderRadius: '50px !important',
                          backgroundColor: '#fff',
                          '& .MuiInputBase-input': {
                            padding: '9px',
                            border: 'none',
                            
                          },
                        }} />

                    </FormControl>


                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Platform Instagram</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Platform Instagram"
                    size="small"
                    value={platformOption}
                    onChange={(e) => setPlatformOption(e.target.value)}
                    sx={{bgcolor:'#fff',borderRadius:'50px'}}
                  >
                    {top100Films.map((platform) => (
                      <MenuItem value={platform}>{platform.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                  
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Influencer</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Influencer"
                    size="small"
                    value={platformOption}
                    onChange={(e) => setPlatformOption(e.target.value)}
                    sx={{bgcolor:'#fff', borderRadius:'50px'}}
                  >
                    {top100Films.map((platform) => (
                      <MenuItem value={platform}>{platform.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
  
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Post Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Post Type"
                    size="small"
                    value={platformOption}
                    onChange={(e) => setPlatformOption(e.target.value)}
                    sx={{bgcolor:'#fff', borderRadius:'50px'}}
                  >
                    {top100Films.map((platform) => (
                      <MenuItem value={platform}>{platform.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

          <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 4 }} spacing={2}>
                <AnalyticsProfile profile={profileData} />
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 8 }} spacing={2}>
                <Box sx={{  p: 2 }}>
                <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        textAlign: "left",
                        display:'table-cell',
                        mt: 2,
                        mb: 2,
                        ml: 61,
                      }}
                    >
                      Campaign Analytics
                    </Typography>
                <Grid container spacing={2}>
                
                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">{profileData?.campaign_analytics?.total_likes}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Likes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">{profileData?.campaign_analytics?.total_comments}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Comments
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">{profileData?.campaign_analytics?.total_engagement}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Engagemnet
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">{profileData?.campaign_analytics?.total_reach}</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Reach
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
               
                </Box>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2} >
                <Engagement engagement={engagementData} />
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2}>
                <Audience audienceData={audienceEngagement} />
                
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 12 }} spacing={2}>
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
              
    )
}

export default Analytics