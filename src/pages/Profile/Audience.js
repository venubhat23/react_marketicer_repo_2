import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Audience = ({ audienceData }) => {
  // Convert the input audienceData to chart-friendly format
  let audData = [];

  if (audienceData && Object.keys(audienceData).length > 0) {
    audData = Object.entries(audienceData).map(([key, value]) => {
      let parsedValue = 0;
      if (typeof value === 'string' && value.includes('%')) {
        parsedValue = parseFloat(value.replace('%', ''));
      } else if (typeof value === 'number') {
        parsedValue = value;
      } else {
        parsedValue = parseFloat(value) || 0;
      }

      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: parsedValue,
      };
    }).filter(item => item.value > 0); // Only include items with positive values
  }

  const COLORS = ["#882AFF", "#a063ec", "#dcc3fa"];

  // Show message if data is empty
  if (audData.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid #d6d6d6",
          boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
          position: "relative",
          bgcolor: "#fffdfd",
          height: "370px",
          padding: "20px",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#882AFF", mb: 2 }}>
          Audience Engagement
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          No audience engagement data available
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: "1px solid #d6d6d6",
        boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",
        position: "relative",
        bgcolor: "#fffdfd",
        height: "370px",
        padding: "20px"
      }}
    >
      <CardContent sx={{ padding: "0px !important" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#882AFF", mb: 2 }}>
          Audience Engagement
        </Typography>

        <Box sx={{ height: "280px", width: "100%", minHeight: 280, minWidth: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={280}>
            <PieChart>
              <Pie
                data={audData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                labelLine={false}
                label={({value}) => `${value}%`}
              >
                {audData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Audience;