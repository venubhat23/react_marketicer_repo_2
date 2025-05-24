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
  
  
  const AnalyticsProfile = () => {
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
      <Box sx={{ width: "100%", ml: 2, my: 2 }}>
        <Card
          sx={{
            width: "100%",
            //maxWidth: "429px",
            borderRadius: 2,
            border: "1px solid #e2e2e2",
            boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
          }}
        >
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
                {influencerData.name}
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
                  {influencerData.followers}{" "}
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
                  {influencerData.following}{" "}
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
                {influencerData.bio}
              </Typography>
  
              <Chip
                label={influencerData.category}
                variant="outlined"
                sx={{
                  mt: 1,
                  borderColor: "#d6d6d6",
                  color: "#a2a2a2",
                  fontFamily: "Inter, Helvetica",
                  fontWeight: 400,
                  fontSize: "14px",
                  height: "24px",
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
                }}
              >
                {influencerData.location}
              </Typography>
            </Box>
  
            {/* Divider */}
            <Divider sx={{ my: 2, mt: 3 }} />
  
            {/* Metrics */}
            <Grid container direction="column" spacing={2} sx={{ pl: 2 , textAlign:'justify'}}>
              {influencerData.metrics.map((metric, index) => (
                <Grid item key={index}>
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
                      component="span"
                      sx={{ display: "inline-block", width: 160 }}
                    >
                      {metric.label}
                    </Box>
                    {metric.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  };
  export default AnalyticsProfile