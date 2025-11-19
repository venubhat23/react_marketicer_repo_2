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
  Typography,
  MenuItem,
  Paper, 
  Grid,
  Select,
  IconButton, 
  FormControl, 
  TextField, 
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Slider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { YouTube, Instagram, Facebook, WhatsApp, ExpandMore } from '@mui/icons-material';
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
    size: 'Micro',
    gender: 'Female',
    location: 'United States',
    age: '25-34',
    accountType: 'Creator'
  },
  {
    name: 'Phoenix Baker',
    username: '@phoenix',
    tag: 'Beauty',
    followers: '45.8K',
    email: 'phoenix@untitledui.com',
    avatar: 'https://i.pravatar.cc/300?img=2',
    platforms: ['Instagram', 'YouTube'],
    size: 'Micro',
    gender: 'Female',
    location: 'United Kingdom',
    age: '18-24',
    accountType: 'Business'
  },
  {
    name: 'John Smith',
    username: '@johnsmith',
    tag: 'Technology',
    followers: '1.2M',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/300?img=3',
    platforms: ['YouTube', 'Instagram'],
    size: 'Macro',
    gender: 'Male',
    location: 'Canada',
    age: '25-34',
    accountType: 'Creator'
  },
  {
    name: 'Sarah Johnson',
    username: '@sarahj',
    tag: 'Lifestyle',
    followers: '78K',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/300?img=4',
    platforms: ['Instagram', 'TikTok'],
    size: 'Mid-tier',
    gender: 'Female',
    location: 'Australia',
    age: '25-34',
    accountType: 'Personal'
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
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterType, setFilterType] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [value, setValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState({});

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSelectChange = (event) => {
    setFilterDropdownOpen(!filterDropdownOpen);
  };

  const handleToggleFilter = (category, filterName, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      const filterKey = `${category}:${filterName}`;
      
      if (!newFilters[filterKey]) {
        newFilters[filterKey] = [];
      }
      
      if (newFilters[filterKey].includes(value)) {
        newFilters[filterKey] = newFilters[filterKey].filter(v => v !== value);
        if (newFilters[filterKey].length === 0) {
          delete newFilters[filterKey];
        }
      } else {
        newFilters[filterKey] = [...newFilters[filterKey], value];
      }
      
      return newFilters;
    });
  };

  const isSelected = (category, filterName, value) => {
    const filterKey = `${category}:${filterName}`;
    return selectedFilters[filterKey]?.includes(value) || false;
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  
  const handleClear = () => {
    setSelectedFilters({});
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSearch = () => {
    console.log('Searching with filters:', selectedFilters);
    console.log('Search term:', searchTerm);
    setFilterDropdownOpen(false);
  };

  const getSelectedFiltersCount = () => {
    return Object.values(selectedFilters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  const getSelectedFiltersArray = () => {
    const result = [];
    Object.entries(selectedFilters).forEach(([key, values]) => {
      const [category, filterName] = key.split(':');
      values.forEach(value => {
        result.push({ category, filterName, value, key });
      });
    });
    return result;
  };

  const filteredInfluencers = influencerData.filter((influencer) => {
    const matchesSearch = searchTerm === '' || 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter logic based on selectedFilters
    if (Object.keys(selectedFilters).length === 0) {
      return matchesSearch;
    }

    const matchesFilters = Object.entries(selectedFilters).every(([filterKey, filterValues]) => {
      const [category, filterName] = filterKey.split(':');
      
      return filterValues.some(value => {
        switch (filterName) {
          case 'Influencer Size':
            // Map influencer follower count to size category
            const followers = influencer.followers;
            if (value === 'Nano (1K-10K)') return followers.includes('K') && parseInt(followers) < 10;
            if (value === 'Micro (10K-100K)') return followers.includes('K') && parseInt(followers) >= 10 && parseInt(followers) < 100;
            if (value === 'Mid-tier (100K-1M)') return followers.includes('K') && parseInt(followers) >= 100;
            if (value === 'Macro (1M-10M)') return followers.includes('M') && parseInt(followers) < 10;
            if (value === 'Mega (10M+)') return followers.includes('M') && parseInt(followers) >= 10;
            return true;
            
          case 'Influencer Gender':
            return influencer.gender?.toLowerCase() === value.toLowerCase();
            
          case 'Influencer Location':
            return influencer.location?.includes(value);
            
          case 'Account Type':
            return influencer.accountType?.toLowerCase() === value.toLowerCase();
            
          case 'Age':
            return influencer.age === value;
            
          case 'Audience Interest':
          case 'Audience Interest 2':  
          case 'Audience Interest 3':
            // Check if influencer tag matches the interest
            return influencer.tag.toLowerCase() === value.toLowerCase();
            
          default:
            return true;
        }
      });
    });
    
    return matchesSearch && matchesFilters;
  });

  const filterCategories = {
    Influencer: {
      "Influencer Size": {
        type: "checkbox",
        options: ["Nano (1K-10K)", "Micro (10K-100K)", "Mid-tier (100K-1M)", "Macro (1M-10M)", "Mega (10M+)"]
      },
      "Influencer Gender": {
        type: "checkbox", 
        options: ["Male", "Female", "Non-binary"]
      },
      "Account Type": {
        type: "checkbox",
        options: ["Personal", "Business", "Creator"]
      },
      "Influencer Location": {
        type: "dropdown",
        options: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Spain", "Italy", "Brazil", "India"]
      },
      "Age": {
        type: "range",
        min: 13,
        max: 65,
        options: ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
      }
    },
    Audience: {
      "Audience Quality Score": {
        type: "range",
        min: 0,
        max: 100,
        options: ["0-20", "21-40", "41-60", "61-80", "81-100"]
      },
      "Audience Age": {
        type: "checkbox",
        options: ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"]
      },
      "Audience Interest": {
        type: "checkbox",
        options: ["Fashion", "Beauty", "Fitness", "Technology", "Travel", "Food", "Lifestyle", "Gaming", "Sports", "Music"]
      },
      "Audience Interest 2": {
        type: "checkbox", 
        options: ["Art", "Photography", "Business", "Education", "Health", "Parenting", "Pets", "Cars", "Home & Garden"]
      },
      "Audience Interest 3": {
        type: "checkbox",
        options: ["Politics", "News", "Entertainment", "Books", "Movies", "TV Shows", "Comedy", "Science"]
      },
      "Audience Location": {
        type: "dropdown",
        options: ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Spain", "Italy", "Brazil", "India"]
      }
    },
    Performance: {
      "Average Views": {
        type: "range",
        options: ["0-1K", "1K-10K", "10K-100K", "100K-1M", "1M+"]
      },
      "Comment Rate": {
        type: "range", 
        options: ["0-1%", "1-3%", "3-5%", "5-10%", "10%+"]
      },
      "Followers Growth": {
        type: "range",
        options: ["-10% to 0%", "0-5%", "5-15%", "15-30%", "30%+"]
      },
      "Recent Post": {
        type: "checkbox",
        options: ["Last 24 hours", "Last 7 days", "Last 30 days", "Last 90 days"]
      },
      "Recent Post 2": {
        type: "checkbox",
        options: ["High Engagement", "Medium Engagement", "Low Engagement"]
      },
      "Recent Post 3": {
        type: "checkbox",
        options: ["Video Content", "Image Content", "Story Content", "Reel Content"]
      }
    }
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    value={""}
                    size="small"
                    open={filterDropdownOpen}
                    onOpen={() => setFilterDropdownOpen(true)}
                    onClose={() => setFilterDropdownOpen(false)}
                    onClick={handleSelectChange}
                    displayEmpty
                    renderValue={() => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography color="#882AFF">Filter</Typography>
                        {getSelectedFiltersCount() > 0 && (
                          <Box sx={{
                            bgcolor: '#882AFF',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            {getSelectedFiltersCount()}
                          </Box>
                        )}
                      </Box>
                    )}
                    sx={{
                      borderRadius: 10,
                      bgcolor: 'white'
                    }}
                  >
                    <Box sx={{ width: 800, maxHeight: 600, overflow: 'auto', p: 2 }}>
                      {Object.entries(filterCategories).map(([categoryName, filters]) => (
                        <Accordion 
                          key={categoryName}
                          expanded={expandedAccordions[categoryName] || false}
                          onChange={handleAccordionChange(categoryName)}
                          sx={{ mb: 1, boxShadow: 1 }}
                        >
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#882AFF' }}>
                              {categoryName}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {Object.entries(filters).map(([filterName, filterConfig]) => (
                                <Box key={filterName}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                    {filterName}
                                  </Typography>
                                  
                                  {filterConfig.type === 'checkbox' && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {filterConfig.options.map((option) => (
                                        <FormControlLabel
                                          key={option}
                                          control={
                                            <Checkbox
                                              checked={isSelected(categoryName, filterName, option)}
                                              onChange={() => handleToggleFilter(categoryName, filterName, option)}
                                              sx={{ 
                                                color: '#882AFF',
                                                '&.Mui-checked': { color: '#882AFF' }
                                              }}
                                            />
                                          }
                                          label={<Typography variant="body2">{option}</Typography>}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                  
                                  {filterConfig.type === 'dropdown' && (
                                    <Select
                                      multiple
                                      value={selectedFilters[`${categoryName}:${filterName}`] || []}
                                      onChange={(e) => {
                                        const values = e.target.value;
                                        setSelectedFilters(prev => ({
                                          ...prev,
                                          [`${categoryName}:${filterName}`]: values
                                        }));
                                      }}
                                      size="small"
                                      sx={{ minWidth: 200 }}
                                      renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                          {selected.map((value) => (
                                            <Chip key={value} label={value} size="small" />
                                          ))}
                                        </Box>
                                      )}
                                    >
                                      {filterConfig.options.map((option) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  )}
                                  
                                  {filterConfig.type === 'range' && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                      {filterConfig.options.map((option) => (
                                        <Chip
                                          key={option}
                                          label={option}
                                          clickable
                                          variant={isSelected(categoryName, filterName, option) ? 'filled' : 'outlined'}
                                          onClick={() => handleToggleFilter(categoryName, filterName, option)}
                                          sx={{
                                            bgcolor: isSelected(categoryName, filterName, option) ? '#882AFF' : 'transparent',
                                            color: isSelected(categoryName, filterName, option) ? 'white' : '#882AFF',
                                            borderColor: '#882AFF',
                                            '&:hover': {
                                              bgcolor: isSelected(categoryName, filterName, option) ? '#7625e6' : 'rgba(136,42,255,0.1)'
                                            }
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                  
                                  <Divider sx={{ mt: 1 }} />
                                </Box>
                              ))}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, p: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Button variant="text" onClick={handleClear} sx={{ color: '#882AFF' }}>
                          Clear All
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={handleSearch}
                          sx={{ 
                            bgcolor: '#882AFF',
                            '&:hover': { bgcolor: '#7625e6' }
                          }}
                        >
                          Search
                        </Button>
                      </Box>
                    </Box>
                 
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

               
              </Box>
              <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
                <Grid container spacing={2}>
                  
                  <Grid size={{ xs: 2, sm: 4, md: 12 }}>
                  <Box >
                    <Typography variant="h6" gutterBottom>{filteredInfluencers.length} Influencer Found</Typography>
                    
                    {/* Selected Filters Display */}
                    {getSelectedFiltersCount() > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Active Filters:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {getSelectedFiltersArray().map((filterItem, index) => (
                            <Box
                              key={`${filterItem.key}-${filterItem.value}-${index}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: '#882AFF',
                                color: 'white',
                                px: 2,
                                py: 0.5,
                                borderRadius: '20px',
                                fontSize: '14px'
                              }}
                            >
                              <Typography variant="caption" sx={{ fontSize: '12px' }}>
                                {filterItem.filterName}: {filterItem.value}
                              </Typography>
                              <CloseIcon
                                sx={{ 
                                  ml: 1, 
                                  fontSize: 16, 
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }
                                }}
                                onClick={() => handleToggleFilter(filterItem.category, filterItem.filterName, filterItem.value)}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
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
            {filteredInfluencers.map((row, index) => (
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