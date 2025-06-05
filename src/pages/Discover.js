import React, {useState } from 'react';
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
  styled,Button,
  Select,Popover,FormControl,InputLabel,selectedFilters,
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
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

import Sidebar from '../components/Sidebar'


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




const Discover = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterType, setFilterType] = useState("");

  const handleSelectChange = (event) => {
    debugger
    setFilterType(event.target.value);
   
   // setSelectedFilters([]); // reset selections on filter change
  };
  console.log('1212', filterType)

  // const handleGridItemClick = (item: string) => {
  //   setSelectedFilters((prev) =>
  //     prev.includes(item)
  //       ? prev.filter((val) => val !== item)
  //       : [...prev, item]
  //   );
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  
  const handleClear = () => {
    setSelectedFilters([]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleToggleFilter =(e)=>{

  }

  const allFilters = {
    Influencer: [
      "Influencer Size",
      "Influencer Gender",
      "Account Type",
      "Search by Category",
      "Influencer Location",
      "Age"
    ],
    Audience: [
      "Audience Quality Score",
      "Audience Age",
      "Audience Interest",
      "Audience Interest 2",
      "Audience Interest 3",
      "Audience Location"
    ],
    Performance: [
      "Average Views",
      "Comment Rate",
      "Followers Growth",
      "Recent Post",
      "Recent Post 2",
      "Recent Post 3"
    ]
  };


  return (
    <Box sx={{ flexGrow: 1, bgcolor:'#f5edf8', height:'100%' }} >
    <Grid container>
      <Grid size={{ md: 1 }}> <Sidebar/></Grid>
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
                  Discover
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
              
                <FormControl fullWidth>
                  <Select
                    labelId="filter-label"
                    value={filterType}
                    //label="Filter"
                    onChange={handleSelectChange}
                  >
                    <Grid container>
                    <Grid container spacing={3}>
                      {Object.entries(allFilters).map(([section, items]) => (
                        <Grid size xs={4} key={section}>
                          <Typography variant="subtitle2">{section}</Typography>
                          {items.map((item) => (
                            <Typography
                              key={item}
                              variant="body2"
                              sx={{
                                mt: 1,
                                cursor: "pointer",
                                // color: isSelected(item) ? "primary.main" : "text.primary",
                                // fontWeight: isSelected(item) ? "bold" : "normal"
                              }}
                              onClick={() => handleToggleFilter(item)}
                            >
                              {item}
                            </Typography>
                          ))}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid size md={4} >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                      <Button variant="text" onClick={handleClear}>
                        Clear All
                      </Button>
                      <Button variant="contained" onClick={handleClose}>
                        Search
                      </Button>
                    </Box>
                  </Grid>
                 
                </Select>
              </FormControl>

      {/* Grid Filters */}
      {filterType === "Custom Filter" && (
        <Box mt={3}>
          
         

          {/* Show selected filters */}
          {selectedFilters.length > 0 && (
            <Box mt={3}>
              <Typography variant="body2">Selected:</Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                {selectedFilters.map((filter) => (
                  <Paper
                    key={filter}
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: "16px",
                      bgcolor: "primary.main",
                      color: "#fff",
                      fontSize: "0.875rem"
                    }}
                  >
                    {filter}
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
               
              </Box>
              <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
                <Grid container spacing={2}>
                  
                  <Grid size={{ xs: 2, sm: 4, md: 12 }}>
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>1887 Influencer Found</Typography>
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
          </Grid>
          </Grid>
          </Box>
          
  );
};

export default Discover;