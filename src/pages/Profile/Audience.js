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
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Audience Engagement
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No engagement data available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No engagement data available for analysis.
          Start engaging with your audience to see metrics here.
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
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Audience Engagement
        </Typography>

        {/* Display engagement summary */}
        <Box sx={{ mb: 2 }}>
          {audData.map((item, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              {item.name}: {item.value}%
            </Typography>
          ))}
        </Box>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={audData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              innerRadius={45}
              paddingAngle={5}
              label={({ value }) => `${value}%`}
            >
              {audData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => value}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Audience;