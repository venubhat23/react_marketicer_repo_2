import React from 'react'
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
    styled
  } from '@mui/material';
  import {
    Notifications as NotificationsIcon,
    AccountCircle as AccountCircleIcon,
  } from '@mui/icons-material';
  import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
  import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
  import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
  import axios from 'axios';

  import Sidebar from '../../components/Sidebar'

const FullAnalytics = () =>{

    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
      ];
      
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
      const sdata = [
        { name: 'Jan', Saves: 30, Shares: 40, Comments: 20 },
        { name: 'Feb', Saves: 50, Shares: 30, Comments: 25 },
        { name: 'Mar', Saves: 40, Shares: 60, Comments: 30 },
        { name: 'Apr', Saves: 60, Shares: 45, Comments: 35 },
        { name: 'May', Saves: 70, Shares: 55, Comments: 45 },
        { name: 'Jun', Saves: 80, Shares: 60, Comments: 50 },
        { name: 'Jul', Saves: 100, Shares: 70, Comments: 60 },
        { name: 'Aug', Saves: 90, Shares: 80, Comments: 55 },
        { name: 'Sep', Saves: 110, Shares: 85, Comments: 65 },
        { name: 'Oct', Saves: 120, Shares: 90, Comments: 70 },
        { name: 'Nov', Saves: 130, Shares: 100, Comments: 75 },
        { name: 'Dec', Saves: 140, Shares: 110, Comments: 80 },
      ];



    return(
        <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100%' }} >
    <Grid container>
      <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid>
      <Grid size={{ md: 11 }}> 
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
                  Full Analytics
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
        <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 3 }} spacing={2}>
              <Card>
                <CardContent sx={{width:'200', height:'100',borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)"}}>
                    <img
                    alt="Influencer"
                    src="https://c.animaapp.com/mavezxjciUNcPR/img/ellipse-121-1.png"
                    width='200'
                    />
                </CardContent>
            </Card>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 9 }} spacing={2}>
                <Box sx={{  p: 2, background:'#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                    <Typography variant="h6" >Influencer Name</Typography>
                        <Typography variant="body2">@mybrand</Typography>
                        <Typography variant="body2" sx={{ mb:2 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                {/* <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        textAlign: "left",
                        display:'table-cell',
                        mt: 2,
                        mb: 2,
                        ml: 61,
                      }}
                    >
                      Campaign Analytics
                    </Typography> */}
                <Grid container spacing={2}>
                
                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">221</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Likes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">2211</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Comments
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">321</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Engagemnet
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={3}>
                      <Card
                      sx={{
                        width: 150,
                        height: 86,
                        border: "1px solid #b6b6b6",
                        borderRadius: "10px",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 1 }}>
                        <Typography variant="h6">345</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Total Reach
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
               
                </Box>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2} >
              <Card sx={{  p: 1, background:'#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                <CardContent>
                    <Typography variant='body2'>Sample Data 1</Typography>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Legend/>
                </PieChart>
                </ResponsiveContainer>
                </CardContent>
                </Card>
              
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2}>
              <Card sx={{  p: 1, background:'#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                <CardContent>
                <Typography variant='body2'>Sample Data 2</Typography>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Legend/>
                </PieChart>
                </ResponsiveContainer>
                </CardContent>
                </Card>
                
              </Grid>

              <Grid item xs={12} md={12} size={12}>
              <Card sx={{  p: 1, background:'#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Bar Graph
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={sdata}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Saves" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Shares" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Comments" stroke="#ffc658" />
                    <Legend/>
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            </Grid>
          </Box>
    </Grid>
          </Grid>
          </Box>
    )
}

export default FullAnalytics