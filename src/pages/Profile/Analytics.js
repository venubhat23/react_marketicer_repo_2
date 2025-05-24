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
  CardContent, Chip,IconButton,
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
      <Grid container spacing={2}>
        <Grid item xs={1} md={1} size={1}>
          <Sidebar />
        </Grid>
        <Grid item xs={11} md={11} size={11} sx={{ bgcolor: '#f3edf8' }}>
        <AppBar position="static" sx={{ bgcolor: "#091a48", boxShadow: "none" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2 }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h5" component="div" fontWeight={500}>
              Analytics
            </Typography>
          </Toolbar>
        </AppBar>

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

        
        {/* <Box component={Paper} sx={{ p: 2, bgcolor: '#e0f7fa' }}>
            <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              mt: 2,
              mb: 1,
              ml: 61,
            }}
          >
            Campaign Analytics
          </Typography>

          <Grid container spacing={2} sx={{ px: 5, ml: 56 }}>
            {analyticsCards.slice(0, 4).map((card, index) => (
              <Grid item key={index}>
                <Card
                  sx={{
                    width: 180,
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

            {analyticsCards.slice(4).map((card, index) => (
              <Grid item key={index}>
                <Card
                  sx={{
                    width: 180,
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
          
        </Box> */}
            </Grid>
            </Grid>

        {/* Engagement section */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} size={6}  sx={{p:2}}>
            <Engagement/>
          </Grid>

          <Grid item xs={6} md={6} size={6} sx={{mt:2, }}>
            <Audience />
          </Grid>
        </Grid>

        {/* Engagement section */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} size={12} spacing={2} >
            <TabComponent tabs={tabs} defaultIndex={0} />
        </Grid> 
        </Grid>

        {/* Brand section */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} size={12} spacing={2}>
            <BrandProfile/>
        </Grid> 
        </Grid>

        
        


      </Grid>

      </Grid>          
          
    )
}

export default Analytics