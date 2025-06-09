import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Engagement = ({ engagement, selectedUser }) => {
  const [timeRange, setTimeRange] = React.useState("last7days");

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Function to prepare chart data
  const prepareChartData = () => {
    // Check if we have engagement_over_time data from selectedUser
    if (selectedUser?.engagement_over_time?.daily) {
      const dailyData = selectedUser.engagement_over_time.daily;
      return Object.entries(dailyData).map(([day, value]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize first letter
        engagement: value,
      }));
    }
    
    // Check if engagement prop has data
    if (engagement && typeof engagement === 'object' && Object.keys(engagement).length > 0) {
      return Object.entries(engagement).map(([day, value]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        engagement: value,
      }));
    }
    
    // Default data with zeros for all days
    const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return defaultDays.map(day => ({
      day,
      engagement: 0,
    }));
  };

  const engageData = prepareChartData();

  // Calculate total engagement for display
  const totalEngagement = engageData.reduce((sum, item) => sum + item.engagement, 0);

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
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.25rem",
              color: "#333333",
              lineHeight: "18px",
            }}
          >
            Engagement Over Time
          </Typography>

          <FormControl
            size="small"
            sx={{
              width: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "#fafafa",
                border: "1px solid #d5d6da",
                boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
                display: 'none'
              },
            }}
          >
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                color: "#6C737F",
                "& .MuiSelect-select": {
                  py: 1.25,
                  px: 1.75,
                },
              }}
            >
              <MenuItem value="last7days">Last 7 days</MenuItem>
              <MenuItem value="last30days">Last 30 days</MenuItem>
              <MenuItem value="last90days">Last 90 days</MenuItem>
            </Select>
          </FormControl>
          <Typography sx={{ width: '100px' }}>Last 7 days</Typography>
        </Box>

        {/* Display total engagement */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total Engagement: {totalEngagement}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, height: 218 }}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={engageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6C737F' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6C737F' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#882AFF"
                  fill="#F9F5FF"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: '#882AFF' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Engagement;
