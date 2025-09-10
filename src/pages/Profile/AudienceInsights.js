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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { PieChart, Pie, Cell,  BarChart, Bar, XAxis, YAxis, CartesianGrid, } from 'recharts';
import {
  RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer
} from 'recharts';

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

// Data for engagement metrics
const COLORS = ['#882AFF', '#a063ec', '#dcc3fa'];

const  AudienceInsights= ({audienceAge, reachability, notableNo, gender, location, cities, brand_affinity,intrest,language})=> {
  console.log('qaqa', reachability)

  // Convert data for the chart
  const ageData = Object.entries(audienceAge).map(([key, value], index) => ({
    name: key,
    value: parseFloat(value.replace('%', '')),
    fill: ['#8884d8', '#83a6ed', '#8dd1e1'][index]  // Optional colors
  }));

  const reachdata = reachability.map((entry) => {
    const match = entry.match(/^([a-zA-Z]+)([\d.]+)K$/);
    return {
      name: match[1],
      value: parseFloat(match[2]) * 1000
    };
  });

  const GenderData = Object.entries(gender).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: parseFloat(value)
  }));

  // Convert countries object to array for recharts
  const locationData = Object.entries(location).map(([country, value]) => ({
    country,
    value
  }));

  

  return (
    
      <Grid container spacing={2}>
        {/* Top row: 3 / 4 / 5 */}


        <Grid item xs={12} md={3} size={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Age</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  innerRadius="20%"
                  outerRadius="90%"
                  data={ageData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} size={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Reachability</Typography>
              <ResponsiveContainer width="100%" height={300}>
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
            <CardContent width="100%" sx={{height:'325px'}}>
              <Typography variant="subtitle1" gutterBottom>
                Notable Followers: {notableNo}
              </Typography>
              <Grid container spacing={1}>
                {reachability.map((name) => (
                  <Grid item xs={4} sm={2} key={name} textAlign="center">
                    <Avatar
                      src={`https://i.pravatar.cc/40?u=${name}`}
                      sx={{ mx: 'auto' }}
                    />
                    <Typography variant="caption" component='div'>{name}</Typography>
                    {/* <Typography variant="caption" color="text.secondary">
                      32.5K
                    </Typography> */}
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
              <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={GenderData}
                        outerRadius={80}
                        innerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {GenderData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="top" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} size={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1">Audience Location</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  layout="vertical"
                  data={locationData}
                  width={250} height={50}
                  margin={{ top: 10, right: 5, left: 15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="country" type="category" />
                  <Tooltip />
                 
                  <Bar dataKey="value"  barSize={10} fill="#882AFF"  name="Location" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5} size={5}>
          <Card>
            <CardContent width="100%" sx={{height:'325px'}}>
              <Typography variant="subtitle1">Audience Details</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" className='audDeatils'>
                <strong>Aduience Cities: </strong> 
                {/* <List> */}
                  {cities?.map((city,index)=>(
                    <Typography variant="body2" key={index} sx={{display:'inline-flex', color:'#a5a9a9'}}>{city},</Typography>
                    // <ListItem key={index} disableGutters>
                    // <ListItemText>{city}</ListItemText>
                    // </ListItem>
                  ))}
                {/* </List> */}
              </Typography>
              <Typography variant="body2" className='audDeatils'>
                <strong>Aduience Language: </strong> 
                {language?.map((lang,index)=>(
                   <Typography variant="body2" key={index} sx={{display:'inline-flex', color:'#a5a9a9'}}>{lang}</Typography>
                ))}
              </Typography>
              <Typography variant="body2" className='audDeatils'>
                <strong>Aduience Interests: </strong>
                {intrest?.map((int, index)=>(
                  <Typography variant="body2" key={index} sx={{display:'inline-flex', color:'#a5a9a9'}}>{int}</Typography>
                ))}
              </Typography>
              <Typography variant="body2" className='audDeatils'>
                <strong>Aduience Brand Affinity: </strong>
                {brand_affinity?.map((brand, index)=>(
                  <Typography variant="body2" key={index} sx={{display:'inline-flex', color:'#a5a9a9'}}>{brand}</Typography>
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
   
  );
}

export default AudienceInsights
