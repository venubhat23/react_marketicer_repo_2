import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

const Audience = () => {
  // Data for engagement metrics
  const engagementData = [
    { type: "Likes", percentage: "60%", color: "brand.600" },
    { type: "Comments", percentage: "35%", color: "brand.100" },
    { type: "Share", percentage: "5%", color: "brand.500" },
  ];

  return (
    <Box sx={{ width: "100%", height: "310px", }}>
      <Card
        sx={{
          width: "100%",
          height: "304px",
          borderRadius: "20px",
          border: "1px solid #d6d6d6",
          boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
          
        }}
      >
        <CardContent sx={{ position: "relative", p: 0 }}>
          <Typography
            variant="h6"
            sx={{
              position: "relative",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "20px",
              fontFamily: "'Inter', Helvetica",
              color: "#333333",
              ml: 5.5,
              mt: 3.5,
              
            }}
          >
            Audience Engagement
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              mt: 2.5,
              ml: 4.9,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "240px",
                height: "240px",
                backgroundImage:
                  "url(https://c.animaapp.com/mavezxjciUNcPR/img/background.svg)",
                backgroundSize: "100% 100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "157px",
                  height: "240px",
                  left: "83px",
                }}
              >
                <Box
                  component="img"
                  sx={{
                    position: "absolute",
                    width: "114px",
                    height: "101px",
                    top: 0,
                    left: "37px",
                  }}
                  alt="Series"
                  src="https://c.animaapp.com/mavezxjciUNcPR/img/series-1.svg"
                />
                <Box
                  component="img"
                  sx={{
                    position: "absolute",
                    width: "157px",
                    height: "157px",
                    top: "83px",
                    left: 0,
                  }}
                  alt="Series"
                  src="https://c.animaapp.com/mavezxjciUNcPR/img/series-2.svg"
                />
              </Box>
            </Box>

            <Stack spacing={1}>
              {engagementData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box sx={{ pt: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: item.color,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "gray.600",
                      mt: "-1px",
                    }}
                  >
                    {item.type} {item.percentage}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Audience