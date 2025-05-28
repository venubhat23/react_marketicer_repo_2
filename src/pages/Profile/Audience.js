import React from "react";
import { Box, Card, CardContent, Stack, Typography,Grid,List,ListItem,ListItemIcon, Toolbar } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const Audience = () => {
  // Data for engagement metrics
  const COLORS = ['#3f51b5', '#9c27b0', '#03a9f4'];
  const ageData = [
    { name: '18-24', value: 300 },
    { name: '24-30', value: 400 },
    { name: '>30',   value: 300 },
  ];

  const engagementData = [
    { type: "Likes", percentage: "60%", color: "brand.600" },
    { type: "Comments", percentage: "35%", color: "brand.100" },
    { type: "Share", percentage: "5%", color: "brand.500" },
  ];

  return (
    <Box sx={{ width: "100%", height: "310px", }}>
      <Card
        sx={{
          // width: "100%",
          // height: "304px",
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
           
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Age</Typography>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={ageData}
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {ageData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box display="flex" justifyContent="space-around" mt={1}>
                {ageData.map((d) => (
                  <Typography key={d.name} variant="caption">
                    {d.name}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        

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