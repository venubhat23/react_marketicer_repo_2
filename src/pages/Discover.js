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
  Tabs,
  Tab,
  Drawer
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { YouTube, Instagram, Facebook, WhatsApp, ExpandMore } from '@mui/icons-material';
import { Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from '@mui/icons-material/Tune';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import Sidebar from '../components/Sidebar'
import {Link, useNavigate} from 'react-router-dom'


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
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterType, setFilterType] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [value, setValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [quickFilters, setQuickFilters] = useState([]);

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

  // Quick filter presets for easy selection
  const quickFilterPresets = {
    'Micro Influencers': {
      'Influencer:Influencer Size': ['Micro (10K-100K)']
    },
    'Beauty & Fashion': {
      'Audience:Audience Interest': ['Beauty', 'Fashion']
    },
    'Tech & Gaming': {
      'Audience:Audience Interest': ['Technology', 'Gaming']
    },
    'Fitness & Health': {
      'Audience:Audience Interest': ['Fitness', 'Health']
    },
    'High Engagement': {
      'Performance:Recent Post 2': ['High Engagement']
    },
    'US Influencers': {
      'Influencer:Influencer Location': ['United States']
    }
  };

  const applyQuickFilter = (presetName) => {
    const preset = quickFilterPresets[presetName];
    if (quickFilters.includes(presetName)) {
      // Remove the preset
      setQuickFilters(prev => prev.filter(f => f !== presetName));
      setSelectedFilters(prev => {
        const newFilters = { ...prev };
        Object.keys(preset).forEach(key => {
          delete newFilters[key];
        });
        return newFilters;
      });
    } else {
      // Add the preset
      setQuickFilters(prev => [...prev, presetName]);
      setSelectedFilters(prev => ({
        ...prev,
        ...preset
      }));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' },
            bgcolor: '#e4d4f4',
            padding: '15px',
            flexWrap: 'wrap'
          }}>
              
              {/* Filter Controls Container */}
              <Box sx={{ 
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                flexWrap: 'wrap'
              }}>
                {/* Left side - Search Field */}
                <TextField
                  placeholder="Search..."
                  variant="outlined"
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
                    minWidth: '200px',
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      borderRadius: 10,
                    }
                  }}
                />

                {/* Center - Active Filters */}
                <Box sx={{ 
                  flex: 1, 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                  maxHeight: '60px',
                  overflow: 'auto'
                }}>
                  {getSelectedFiltersCount() > 0 && getSelectedFiltersArray().map((filterItem, index) => (
                    <Box
                      key={`${filterItem.key}-${filterItem.value}-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#882AFF',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '15px',
                        fontSize: '12px',
                        maxWidth: '200px'
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '11px', mr: 0.5 }}>
                        {filterItem.filterName}: {filterItem.value}
                      </Typography>
                      <CloseIcon
                        sx={{ 
                          fontSize: 14, 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }
                        }}
                        onClick={() => handleToggleFilter(filterItem.category, filterItem.filterName, filterItem.value)}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Right side - Advanced Filter Button */}
                <Button
                  variant={filterDrawerOpen ? "contained" : "outlined"}
                  startIcon={<TuneIcon />}
                  onClick={() => {
                    console.log('Button clicked, current filterDrawerOpen state:', filterDrawerOpen);
                    setFilterDrawerOpen(!filterDrawerOpen);
                  }}
                  sx={{
                    borderColor: filterDrawerOpen ? '#d0d0d0' : '#e4d4f4',
                    color: filterDrawerOpen ? '#333' : '#666',
                    bgcolor: filterDrawerOpen ? '#e8e9ea' : '#f8f9fa',
                    borderRadius: 10,
                    minWidth: { md: '140px' },
                    '&:hover': {
                      bgcolor: '#e8e9ea',
                      borderColor: '#d0d0d0',
                      color: '#333'
                    }
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>Advanced </Box>Filters
                  {getSelectedFiltersCount() > 0 && (
                    <Box sx={{
                      bgcolor: '#666',
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      ml: 1
                    }}>
                      {getSelectedFiltersCount()}
                    </Box>
                  )}
                </Button>
              </Box>

               
              </Box>

              {/* Advanced Filters Drawer */}
              <Drawer
                anchor="right"
                open={filterDrawerOpen}
                onClose={() => {
                  console.log('Closing drawer via overlay');
                  setFilterDrawerOpen(false);
                }}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: 450, md: 500 },
                    p: 0
                  }
                }}
              >
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Drawer Header */}
                  <Box sx={{ 
                    p: 2, 
                    borderBottom: '1px solid #e0e0e0', 
                    bgcolor: '#091a48',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Advanced Filters
                    </Typography>
                    <IconButton 
                      onClick={() => {
                        console.log('Closing drawer via X button');
                        setFilterDrawerOpen(false);
                      }}
                      sx={{ color: 'white' }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Filter Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      sx={{
                        '& .MuiTab-root': {
                          color: '#666',
                          '&.Mui-selected': {
                            color: '#091a48'
                          }
                        },
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#091a48'
                        }
                      }}
                    >
                      <Tab label="Influencer" />
                      <Tab label="Audience" />
                      <Tab label="Performance" />
                    </Tabs>
                  </Box>

                  {/* Filter Content */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {activeTab === 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Object.entries(filterCategories.Influencer).map(([filterName, filterConfig]) => (
                          <Box key={filterName}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#091a48' }}>
                              {filterName}
                            </Typography>
                            
                            {filterConfig.type === 'checkbox' && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {filterConfig.options.map((option) => (
                                  <Chip
                                    key={option}
                                    label={option}
                                    clickable
                                    size="small"
                                    variant={isSelected('Influencer', filterName, option) ? 'filled' : 'outlined'}
                                    onClick={() => handleToggleFilter('Influencer', filterName, option)}
                                    sx={{
                                      bgcolor: isSelected('Influencer', filterName, option) ? '#091a48' : 'transparent',
                                      color: isSelected('Influencer', filterName, option) ? 'white' : '#091a48',
                                      borderColor: '#091a48',
                                      '&:hover': {
                                        bgcolor: isSelected('Influencer', filterName, option) ? '#1e3a8a' : 'rgba(9,26,72,0.1)'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}

                            {filterConfig.type === 'dropdown' && (
                              <Select
                                multiple
                                value={selectedFilters[`Influencer:${filterName}`] || []}
                                onChange={(e) => {
                                  const values = e.target.value;
                                  setSelectedFilters(prev => ({
                                    ...prev,
                                    [`Influencer:${filterName}`]: values
                                  }));
                                }}
                                size="small"
                                fullWidth
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
                                    size="small"
                                    variant={isSelected('Influencer', filterName, option) ? 'filled' : 'outlined'}
                                    onClick={() => handleToggleFilter('Influencer', filterName, option)}
                                    sx={{
                                      bgcolor: isSelected('Influencer', filterName, option) ? '#091a48' : 'transparent',
                                      color: isSelected('Influencer', filterName, option) ? 'white' : '#091a48',
                                      borderColor: '#091a48',
                                      '&:hover': {
                                        bgcolor: isSelected('Influencer', filterName, option) ? '#1e3a8a' : 'rgba(9,26,72,0.1)'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {activeTab === 1 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Object.entries(filterCategories.Audience).map(([filterName, filterConfig]) => (
                          <Box key={filterName}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#091a48' }}>
                              {filterName}
                            </Typography>
                            
                            {filterConfig.type === 'checkbox' && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {filterConfig.options.map((option) => (
                                  <Chip
                                    key={option}
                                    label={option}
                                    clickable
                                    size="small"
                                    variant={isSelected('Audience', filterName, option) ? 'filled' : 'outlined'}
                                    onClick={() => handleToggleFilter('Audience', filterName, option)}
                                    sx={{
                                      bgcolor: isSelected('Audience', filterName, option) ? '#091a48' : 'transparent',
                                      color: isSelected('Audience', filterName, option) ? 'white' : '#091a48',
                                      borderColor: '#091a48',
                                      '&:hover': {
                                        bgcolor: isSelected('Audience', filterName, option) ? '#1e3a8a' : 'rgba(9,26,72,0.1)'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}

                            {filterConfig.type === 'dropdown' && (
                              <Select
                                multiple
                                value={selectedFilters[`Audience:${filterName}`] || []}
                                onChange={(e) => {
                                  const values = e.target.value;
                                  setSelectedFilters(prev => ({
                                    ...prev,
                                    [`Audience:${filterName}`]: values
                                  }));
                                }}
                                size="small"
                                fullWidth
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
                                    size="small"
                                    variant={isSelected('Audience', filterName, option) ? 'filled' : 'outlined'}
                                    onClick={() => handleToggleFilter('Audience', filterName, option)}
                                    sx={{
                                      bgcolor: isSelected('Audience', filterName, option) ? '#091a48' : 'transparent',
                                      color: isSelected('Audience', filterName, option) ? 'white' : '#091a48',
                                      borderColor: '#091a48',
                                      '&:hover': {
                                        bgcolor: isSelected('Audience', filterName, option) ? '#1e3a8a' : 'rgba(9,26,72,0.1)'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {activeTab === 2 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Object.entries(filterCategories.Performance).map(([filterName, filterConfig]) => (
                          <Box key={filterName}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#091a48' }}>
                              {filterName}
                            </Typography>
                            
                            {filterConfig.type === 'checkbox' && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {filterConfig.options.map((option) => (
                                  <Chip
                                    key={option}
                                    label={option}
                                    clickable
                                    size="small"
                                    variant={isSelected('Performance', filterName, option) ? 'filled' : 'outlined'}
                                    onClick={() => handleToggleFilter('Performance', filterName, option)}
                                    sx={{
                                      bgcolor: isSelected('Performance', filterName, option) ? '#091a48' : 'transparent',
                                      color: isSelected('Performance', filterName, option) ? 'white' : '#091a48',
                                      borderColor: '#091a48',
                                      '&:hover': {
                                        bgcolor: isSelected('Performance', filterName, option) ? '#1e3a8a' : 'rgba(9,26,72,0.1)'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}

                            {filterConfig.type === 'range' && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {filterConfig.options.map((option) => (
                                  <Chip
                                    key={option}
                                    label={option}
                                    clickable
                                    size="small"
                                    variant={isSelected('Performance', filterName, option) ? 'filled' : 'outlined'}
                                    onClick={() => handleToggleFilter('Performance', filterName, option)}
                                    sx={{
                                      bgcolor: isSelected('Performance', filterName, option) ? '#091a48' : 'transparent',
                                      color: isSelected('Performance', filterName, option) ? 'white' : '#091a48',
                                      borderColor: '#091a48',
                                      '&:hover': {
                                        bgcolor: isSelected('Performance', filterName, option) ? '#1e3a8a' : 'rgba(9,26,72,0.1)'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Drawer Footer */}
                  <Box sx={{ 
                    p: 2, 
                    borderTop: '1px solid #e0e0e0',
                    bgcolor: '#f8f9fa',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2
                  }}>
                    <Button 
                      variant="outlined" 
                      onClick={handleClear}
                      sx={{ 
                        borderColor: '#091a48',
                        color: '#091a48',
                        flex: 1
                      }}
                    >
                      Clear All
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => {
                        console.log('Closing drawer via Apply Filters button');
                        handleSearch();
                        setFilterDrawerOpen(false);
                      }}
                      sx={{ 
                        bgcolor: '#091a48',
                        '&:hover': { bgcolor: '#1e3a8a' },
                        flex: 1
                      }}
                    >
                      Apply Filters
                    </Button>
                  </Box>
                </Box>
              </Drawer>
              <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
                <Grid container spacing={2}>
                  
                  <Grid size={{ xs: 2, sm: 4, md: 12 }}>
                  <Box >
                    <Typography variant="h6" gutterBottom>{filteredInfluencers.length} Influencer Found</Typography>
                    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#091a48', color:'#fff' }}>
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
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => navigate(`/influencer-analytics/${row.name}`)}
                    sx={{ color: '#882AFF' }}
                  >
                    View full analytics
                  </Button>
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