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
  const audData =
    audienceData && Object.keys(audienceData).length > 0
      ? Object.entries(audienceData).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: parseFloat(value.replace("%", "")),
        }))
      : [];

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
        <Typography variant="h6" color="text.secondary">
          No audience data available
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
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={audData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              paddingAngle={5}
              label
            >
              {audData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Audience;
