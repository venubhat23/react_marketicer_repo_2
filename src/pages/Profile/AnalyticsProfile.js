import React from "react";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography,
  } from "@mui/material";
  
  
  const AnalyticsProfile = ({profile, selectedData}) => {

    console.log('apa', profile, selectedData)

    // if (!Array.isArray(profile) || profile.length === 0) {
    //   return <p>No data available</p>;
    // }

    // Influencer data
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
  
    return (
      <Box sx={{  my: 2 }}>
        <Card
          sx={{
            width: "100%",
            //maxWidth: "429px",
            borderRadius: 2,
            border: "1px solid #e2e2e2",
            boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
          }}
        >
          {selectedData.map((profile)=>(
            <CardContent sx={{ position: "relative", p: 2 }}>
            {/* Profile Image */}
            <Avatar
              src={influencerData.profileImage}
              alt={`${influencerData.name}'s profile`}
              sx={{
                width: 80,
                height: 80,
                position: "absolute",
                top: 11,
                left: 22,
              }}
            />
  
            {/* Profile Info */}
            <Box sx={{ ml: 13, mt: 1, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  //fontFamily: "Inter, Helvetica",
                  fontWeight: 500,
                  fontSize: "22px",
                  lineHeight: "24px",
                }}
              >
                {profile.name}
              </Typography>
  
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    //fontFamily: "Inter, Helvetica",
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "16px",
                    lineHeight: "14px",
                    display: "inline",
                  }}
                >
                  {profile.followers}{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    //fontFamily: "Inter, Helvetica",
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "14px",
                    lineHeight: "14px",
                    display: "inline",
                  }}
                >
                  Followers
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    //fontFamily: "Inter, Helvetica",
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "16px",
                    lineHeight: "14px",
                    display: "inline",
                    mx: 2,
                  }}
                >
                  {profile.following}{" "}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    //fontFamily: "Inter, Helvetica",
                    fontWeight: 500,
                    color: "#8b8b8b",
                    fontSize: "14px",
                    lineHeight: "14px",
                    display: "inline",
                  }}
                >
                  Following
                </Typography>
              </Box>
  
              <Typography
                variant="body2"
                sx={{
                  //fontFamily: "Inter, Helvetica",
                  fontWeight: 500,
                  color: "#666666",
                  fontSize: "14px",
                  lineHeight: "14px",
                  mt: 1,
                }}
              >
                {profile.bio}
              </Typography>
  
              <Chip
                label={profile.category}
                variant="outlined"
                sx={{
                  mt: 1,
                  borderColor: "#d6d6d6",
                  color: "#a2a2a2",
                  fontFamily: "Inter, Helvetica",
                  fontWeight: 400,
                  fontSize: "14px",
                  height: "24px",
                  display:'none'
                }}
              />
  
              <Typography
                variant="body2"
                sx={{
                  //fontFamily: "Inter, Helvetica",
                  fontWeight: 400,
                  color: "#666666",
                  fontSize: "16px",
                  lineHeight: "14px",
                  mt: 2,
                  display:'none'
                }}
              >
                {profile.location}
              </Typography>
            </Box>
  
            {/* Divider */}
            <Divider sx={{ my: 2, mt: 3 }} />
  
            {/* Metrics */}
            <Grid container direction="column" spacing={2} sx={{ pl: 2 , textAlign:'justify'}}>
              
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      //fontFamily: "Inter, Helvetica",
                      fontWeight: 400,
                      color: "#333333",
                      fontSize: "16px",
                      lineHeight: "14px",
                    }}
                  >
                    <Box
                      component="div"
                      className='profilecontent'
                      sx={{ display: "inline-block", width: 260 }}
                    >
                      <ul>
                        <li>Engagement Rate: {profile.engagement_rate} </li>
                        <li>Earned Media: {profile.earned_media}</li>
                        <li> Total Posts: {profile.recent_posts.length}</li>
                        <li>
                          Total Clicks: {
                            profile.campaign_analytics.find(item => item.label === "Total Clicks")?.value || 0
                          }
                        </li>

                      </ul>
                      
                      
                      
                    </Box>
                    
                  </Typography>
                </Grid>
             
            </Grid>
          </CardContent>
          ))}
          
        </Card>
      </Box>
    );
  };
  export default AnalyticsProfile
