import React, { useState } from 'react';
import {
  Box,

  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Paper,
  Grid,
  Container,
  Card,
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
  MenuItem,FromControl,TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
// import {
//   Dashboard as DashboardIcon,
//   Analytics as AnalyticsIcon,
//   Campaign as CampaignIcon,
//   People as PeopleIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   TrendingUp as TrendingUpIcon,
//   AttachMoney as AttachMoneyIcon,
//   Group as GroupIcon,
//   Assessment as AssessmentIcon,
//   Close as CloseIcon
  
// } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";

import Layout from '../components/Layout'


// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a2e',
    },
    secondary: {
      main: '#16213e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const stats = [
  { label: 'Total posts', value: '238', change: '+5.6%' },
  { label: 'Followers gained', value: '12.6K', change: '+1.2%' },
  { label: 'Views', value: '43.8K', change: '-1.6%' },
  { label: 'Engagement', value: '6.8%', change: '+5.6%' }
];

const chartCards = [
  { label: 'Followers growth', change: '+21%', type: 'bar' },
  { label: 'Followers', change: '+21%', type: 'bar' },
  { label: 'Engagement Rate', change: '+21%', type: 'line' }
];

const topPosts = [
  { name: 'David', engagement: '27.8K', views: '3.1K', clicks: 286 },
  { name: 'Sarah', engagement: '21.0K', views: '1.1K', clicks: 191 },
  { name: 'Mike', engagement: '17.8K', views: '4.1K', clicks: 126 },
  { name: 'Thomas', engagement: '37.4K', views: '7.8K', clicks: 582 },
  { name: 'Klaus', engagement: '26.9K', views: '3.1K', clicks: 286 }
];

const data = [
  { name: 'A', value: 10 },
  { name: 'B', value: 25 },
  { name: 'C', value: 15 },
  { name: 'D', value: 30 },
];

const Dashboard = () => {


  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100%' }} > 
        <Paper
              elevation={0}
              sx={{
                display: { xs: 'none', md: 'block' },
                p: 1,
                backgroundColor: '#091a48',
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderRadius: 0
              }}
            >
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>

                <Typography variant="h6" sx={{ color: '#fff' }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    sx={{ mr: 2, color: '#fff' }}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                  Dashboard
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <NotificationsIcon />
                  </IconButton>
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Box>
              </Box>
        </Paper>
        <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2, // spacing between items
                alignItems: 'center',bgcolor: '#B1C6FF',padding: '15px',
              }}>
                    
                <TextField size="small" variant="outlined" placeholder="Search" />
              
                <TextField select size="small" defaultValue="last_7_days">
                  <MenuItem value="last_7_days">Last 7 days</MenuItem>
                  <MenuItem value="last_30_days">Last 30 days</MenuItem>
                </TextField>
               
              </Box>
              <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
                <Grid container spacing={2}>
                  
                  {stats.map((stat, index) => (
                    <Grid size={{ xs: 2, sm: 4, md: 3 }} key={index}>
                      <Card sx={{
                          borderRadius: 5,
                          border: "1px solid #e2e2e2",
                          boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",}}>
                        <CardContent>
                          <Typography variant="h5">{stat.value}</Typography>
                          <Typography variant="subtitle2">{stat.label}</Typography>
                          <Typography variant="caption" color="green">
                            {stat.change}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  
                    {chartCards.map((chart, index) => (
                      <Grid size={{ xs: 2, sm: 4, md: 4 }} key={index}>
                        <Card sx={{
                          borderRadius: 5,
                          border: "1px solid #e2e2e2",
                          boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",}}>
                          <CardContent>
                            <Typography variant="subtitle2">{chart.label}</Typography>
                            <Typography variant="h6" color="primary">{chart.change} this week</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                            <BarChart width={500} height={300} data={data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="value" barSize={10} fill="#8884d8" />
                            </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  
                  <Grid size={{ xs: 2, sm: 4, md: 12 }}>
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Top performing Posts</Typography>
                    <Table width="100%" sx={{
                          borderRadius: 5,
                          bgcolor:'#fff',
                          boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)",}}>
                      <TableHead>
                        <TableRow>
                          <TableCell><b>Name</b></TableCell>
                          <TableCell align='center'><b>Engagement</b></TableCell>
                          <TableCell align='center'><b>Views</b></TableCell>
                          <TableCell align='center'><b>Clicks</b></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topPosts.map((post, index) => (
                          <TableRow key={index}>
                            <TableCell >
                              <Grid container alignItems="center" spacing={1}>
                                <Grid item>
                                  <Avatar src={`https://via.placeholder.com/40?text=${post.name[0]}`} />
                                </Grid>
                                <Grid item>{post.name}</Grid>
                              </Grid>
                            </TableCell>
                            <TableCell align='center'>{post.engagement}</TableCell>
                            <TableCell align='center'>{post.views}</TableCell>
                            <TableCell align='center'>{post.clicks}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                  </Grid>
                  
                  
                  

                </Grid>
              </Box>
          </Box>
      </Layout>
          
  );
};

export default Dashboard;