import React, {useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,MenuItem,
  Paper, Grid,Select,IconButton, FormControl, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { YouTube, Instagram, Facebook, WhatsApp } from '@mui/icons-material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import Sidebar from '../components/Sidebar'
import {Link} from 'react-router-dom'


// Create theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1a1a2e',
//     },
//     secondary: {
//       main: '#16213e',
//     },
//     background: {
//       default: '#f5f5f5',
//     },
//   },
// });

const influencerData = [
  {
    name: 'Olivia Rhye',
    username: '@olivia',
    tag: 'Fitness',
    followers: '46.8K',
    email: 'olivia@untitledui.com',
    avatar: 'https://i.pravatar.cc/300?img=1',
    platforms: ['TikTok', 'YouTube', 'Instagram'],
  },
  {
    name: 'Phoenix Baker',
    username: '@phoenix',
    tag: 'Beauty',
    followers: '45.8K',
    email: 'phoenix@untitledui.com',
    avatar: 'https://i.pravatar.cc/300?img=2',
    platforms: ['Instagram', 'YouTube'],
  },
];

const getPlatformIcons = (platforms) => {
  return platforms.map((platform, idx) => {
    switch (platform) {
      case 'YouTube':
        return <YouTube key={idx} sx={{ color: 'red', mr: 0.5 }} />;
      case 'Instagram':
        return <Instagram key={idx} sx={{ color: '#E1306C', mr: 0.5 }} />;
      case 'Facebook':
        return <Facebook key={idx} sx={{ color: '#1877F2', mr: 0.5 }} />;
      case 'WhatsApp':
        return <WhatsApp key={idx} sx={{ color: '#25D366', mr: 0.5 }} />;
      default:
        return null;
    }
  });
};

const Discover = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [value, setValue] = useState('');

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

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
                  Discover
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <NotificationsIcon />
                  </IconButton>
                  <Link to="/SettingPage"> 
                    <IconButton size="large" sx={{ color: '#fff' }}>
                      <AccountCircleIcon /> 
                    </IconButton>
                  </Link>
                </Box>
              </Box>
        </Paper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2, // spacing between items
            alignItems: 'center',bgcolor: '#B1C6FF',padding: '10px',
          }}>
                    
                <TextField
                  placeholder="Search..."
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    borderRadius: '50px',
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 10,
                    }
                  }}
                />
              
              <FormControl fullWidth>
                  <Select
                    labelId="filter-label"
                    value={filterType}
                    //label="Filter"
                    size="small"
                    onChange={handleSelectChange}
                    displayEmpty
                    renderValue={(selected) =>
                    selected !== '' ? selected : <Typography color="#882AFF">Filter </Typography>
                    }
                    sx={{
                      borderRadius: 10,
                    }}
                  >
                    <Grid container>
                    <Grid container spacing={3} className='filterSection'>
                      {Object.entries(allFilters).map(([section, items]) => (
                        <Grid size xs={4} key={section} sx={{ padding:'20px', boxShadow: '1px 1px 1px 1px rgb(0 0 0 / 10%)'}}>
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

              <FormControl fullWidth>
                <Select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  displayEmpty
                  size="small"
                  renderValue={(selected) =>
                    selected !== '' ? selected : <Typography color="#882AFF">Sort by</Typography>
                  }
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    
                  }}
                >
                  <MenuItem value="Option 1">All</MenuItem>
                  <MenuItem value="Option 2">Option 2</MenuItem>
                  <MenuItem value="Option 3">Option 3</MenuItem>
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
                  <Box >
                    <Typography variant="h6" gutterBottom>1887 Influencer Found</Typography>
                    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#B1C6FF', color:'#fff' }}>
              <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Tags</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Followers</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Email address</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Platform</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Analytics</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {influencerData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => handleOpen(row)}>
                    <Avatar src={row.avatar} sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body1">{row.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {row.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{row.tag}</TableCell>
                <TableCell>{row.followers}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Box display="flex">{getPlatformIcons(row.platforms)}</Box>
                </TableCell>
                <TableCell>
                  <Button variant="text" size="small">View full analytics</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>Influencer Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={selectedRow.avatar} sx={{ width: 56, height: 56, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{selectedRow.name}</Typography>
                  <Typography color="text.secondary">{selectedRow.username}</Typography>
                </Box>
              </Box>
              <Typography><strong>Tag:</strong> {selectedRow.tag}</Typography>
              <Typography><strong>Followers:</strong> {selectedRow.followers}</Typography>
              <Typography><strong>Email:</strong> {selectedRow.email}</Typography>
              <Typography><strong>Platforms:</strong> {getPlatformIcons(selectedRow.platforms)}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
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