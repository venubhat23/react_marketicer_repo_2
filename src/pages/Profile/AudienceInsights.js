import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const ageData = [
  { name: '18-24', value: 300 },
  { name: '24-30', value: 400 },
  { name: '>30',   value: 300 },
];

const reachData = [
  { name: 'Real & Active', value: 75 },
  { name: 'Ghost/Inactive', value: 18 },
  { name: 'Suspicious/Bot', value: 6 },
];

const genderData = [
  { name: 'Female', value: 65 },
  { name: 'Male',   value: 35 },
];

const locationData = [
  { name: 'United States', value: 80 },
  { name: 'India',         value: 95 },
  { name: 'Germany',       value: 60 },
  { name: 'Russia',        value: 50 },
  { name: 'Dubai',         value: 70 },
];

const COLORS = ['#3f51b5', '#9c27b0', '#03a9f4'];

const  AudienceInsights=()=> {
  return (
    
      <Grid container spacing={2}>
        {/* Top row: 3 / 4 / 5 */}
        <Grid item xs={12} md={3} size={3}>
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
        </Grid>

        <Grid item xs={12} md={4} size={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Reachability</Typography>
              <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={reachData}
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {reachData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5} size={5} >
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Notable Followers: 132
              </Typography>
              <Grid container spacing={1}>
                {['Alice','Sophia','Allana','Sam','Julia'].map((name) => (
                  <Grid item xs={4} sm={2} key={name} textAlign="center">
                    <Avatar
                      src={`https://i.pravatar.cc/40?u=${name}`}
                      sx={{ mx: 'auto' }}
                    />
                    <Typography variant="caption">{name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      32.5K
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Second row: also 3 / 4 / 5 */}
        <Grid item xs={12} md={3} size={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Gender</Typography>
              <ResponsiveContainer width="100%" height={120}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {genderData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} size={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Location</Typography>
              <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={locationData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <Tooltip />
                      <Bar dataKey="value" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  {locationData.map((d, i) => (
                    <Typography key={i} variant="caption" display="block">
                      {d.name}
                    </Typography>
                  ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5} size={5}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Details</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                <strong>Cities:</strong> New York, Mumbai, Berlin, Noida
              </Typography>
              <Typography variant="body2">
                <strong>Language:</strong> English, Hindi
              </Typography>
              <Typography variant="body2">
                <strong>Interests:</strong> Music, Food, Lifestyle
              </Typography>
              <Typography variant="body2">
                <strong>Brand Affinity:</strong> Nike, Sony, Apple
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
   
  );
}

export default AudienceInsights
