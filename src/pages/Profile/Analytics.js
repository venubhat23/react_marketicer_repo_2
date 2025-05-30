import React from 'react'
import {
   Box, Typography, FormControl, Avatar, Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Autocomplete,
  Grid,
  TextField,Stack,
  InputAdornment,
  Card,AppBar,Toolbar,Paper,
  CardContent, Chip,IconButton,Container
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
  
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  
} from '@mui/icons-material';


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
  const tabs = [
    {
      label: 'Audience Insights',
      content: <div><AudienceInsights /></div>,
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

    return(
      <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box
          component="nav"
          sx={{ 
            width: { md: '5.333%' }, 
            minWidth: { md: '80px' },
            flexShrink: 0 
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content - 11/12 */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            width: { md: '92.667%' },
            backgroundColor: '#f4edf8',
            mt: { xs: 8, md: 0 }
          }}
        >

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
            
            <Typography variant="h6" sx={{ color:'#fff' }}>
              <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2, color:'#fff' }}
            >
              <ArrowLeftIcon />
            </IconButton>
              Analytics
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="large" sx={{ color:'#fff' }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton size="large" sx={{ color:'#fff' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

          {/* Content Container */}
          <Container maxWidth={false} sx={{ py: 2, px: { xs: 2, sm: 3 } }}>

          <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2, // spacing between items
            alignItems: 'center',bgcolor: '#B1C6FF',padding: '15px' 
          }}>
                    
                <FormControl >
                  <TextField
                  fullWidth
                    type="date"
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 250,
                      borderRadius: '50px',
                      backgroundColor: '#fff',
                      '& .MuiInputBase-input': {
                        padding: '9px',
                        border: 'none',
                      },
                    }} />

                </FormControl>

              
                <Autocomplete
                  disablePortal
                  options={top100Films}
                  renderInput={(params) => <TextField {...params} label="Platform Instagram" />}
                  sx={{
                    width: 250,
                    '& .MuiInputBase-root': {
                      height: 40,
                      paddingRight: '8px', // optional padding
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      bgcolor: '#fff',
                      padding: '0px'
                    },
                    '& .MuiInputLabel-root': {
                      top: '-5px', // optional: adjust label position
                    },
                  }} />

              
                <Autocomplete
                  disablePortal
                  options={top100Films}
                  renderInput={(params) => <TextField {...params} label="Influencer" />}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: 40,
                      width: 250,
                      paddingRight: '8px', // optional padding
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      bgcolor: '#fff',
                      padding: '0px'
                    },
                    '& .MuiInputLabel-root': {
                      top: '-5px', // optional: adjust label position
                    },
                  }} />

              
                <Autocomplete
                  disablePortal
                  options={top100Films}
                  renderInput={(params) => <TextField {...params} label="Post Type" />}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: 40,
                      width: 250,
                      paddingRight: '8px', // optional padding
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      bgcolor: '#fff',
                      padding: '0px'
                    },
                    '& .MuiInputLabel-root': {
                      top: '-5px', // optional: adjust label position
                    },
                  }} />
          </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <AnalyticsProfile />
              </Grid>

              <Grid item xs={6} spacing={2}>
      
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
                  {analyticsCards.slice(0, 4).map((card, index) => (
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
                            <Typography variant="h6">{card.value}</Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              {card.label}
                            </Typography>
                          </CardContent>
                        </Card>
                    </Grid>
                    ))}
                    
                    
                  </Grid>
                  <Grid container spacing={2} sx={{mt:5}}>
                  {analyticsCards.slice(0, 4).map((card, index) => (
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
                            <Typography variant="h6">{card.value}</Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              {card.label}
                            </Typography>
                          </CardContent>
                        </Card>
                    </Grid>
                    ))}  
                  </Grid>
                </Box>
            </Grid>

            <Grid item xs={6} md={6} lg={6} >
              <Engagement/>
            </Grid>

            <Grid item xs={6} md={6} lg={6} >
              <Audience />
            </Grid>

            {/* Engagement section */}
            <Grid item xs={12} md={12} lg={12} spacing={2}>
               <TabComponent tabs={tabs} defaultIndex={0} />
            </Grid>
            
            {/* Brand section */}
            
           <Grid item xs={12} md={12} lg={12} spacing={2}>
                <BrandProfile/>
            </Grid> 
            
            
              
          
            </Grid>
          </Container>
        </Box>
      </Box>
              
      </>  
    )
}

export default Analytics