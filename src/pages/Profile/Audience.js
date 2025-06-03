import React,{useState} from "react";
import { Box, Card, CardContent, Stack, Typography,Grid,List,ListItem,ListItemIcon, Toolbar } from "@mui/material";
//import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Audience = ({audienceData}) => {

  const audData = Object.entries(audienceData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: parseFloat(value.replace('%', '')),
  }));

  // Data for engagement metrics
  const COLORS = ['#882AFF', '#a063ec', '#dcc3fa'];

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
    <Card 
    sx={{
      //width: "100%",
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
          <PieChart width={200} height={200}>
            <Pie
              data={audData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60}
              paddingAngle={5}
              fill="green"
              label
            >
              {audData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Audience