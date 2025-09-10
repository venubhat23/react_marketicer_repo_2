import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Avatar, Paper, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  Alert, Snackbar, Badge, Tooltip, LinearProgress
} from '@mui/material';
import {
  Search, Settings, Refresh, Visibility, BookmarkBorder, Bookmark,
  Launch as ExternalLink, CalendarToday, Person, TrendingUp, FilterList,
  Add, Delete, BarChart, Forum as MessageSquare, Close, Analytics,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { toast } from "react-toastify";
import Sidebar from '../../components/Sidebar';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import {Link} from 'react-router-dom'

const SocialMonitoring = () => {
  // State management
  const [keywords, setKeywords] = useState(['Marketincer', 'film actor ramya', 'hashfame']);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [viewedPosts, setViewedPosts] = useState(new Set());
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    keywords: 'all',
    platforms: 'all',
    sentiment: 'all',
    relevance: 'all',
    viewStatus: 'all',
    bookmarks: false
  });

  // Sample data generator with realistic content
  const generateSamplePosts = () => {
    const platforms = [
      { name: 'Twitter', icon: 'X', color: '#000000', bgColor: 'bg-black' },
      { name: 'Instagram', icon: 'IG', color: '#E4405F', bgColor: 'bg-pink-500' },
      { name: 'LinkedIn', icon: 'IN', color: '#0077B5', bgColor: 'bg-blue-600' },
      { name: 'Medium', icon: 'M', color: '#000000', bgColor: 'bg-gray-800' },
      { name: 'Reddit', icon: 'R', color: '#FF4500', bgColor: 'bg-orange-500' },
      { name: 'YouTube', icon: 'YT', color: '#FF0000', bgColor: 'bg-red-500' }
    ];
    
    const sentiments = ['positive', 'neutral', 'negative'];
    const relevance = ['high', 'medium', 'low'];
    const brandTypes = ['OWN BRAND', 'COMPETITOR'];
    
    const sampleContent = [
      {
        content: "HashFame rolls out 'Brand Interest Signals' to decode pre-campaign demand for creators",
        url: "https://t.co/TUP3sQYNLI",
        hashtags: "#campaign #creators #Hashfame",
        summary: "HashFame introduces 'Brand Interest Signals' to analyze pre-campaign demand for creators.",
        author: "buzzincontent"
      },
      {
        content: "Marketincer's new AI-powered analytics dashboard is revolutionizing how brands track social media performance",
        url: "https://linkedin.com/post/marketincer-ai",
        hashtags: "#AI #analytics #socialmedia #Marketincer",
        summary: "Marketincer launches advanced AI analytics for social media tracking.",
        author: "techmarketing"
      },
      {
        content: "Just discovered film actor Ramya's latest project collaboration with major streaming platform",
        url: "https://instagram.com/ramya-project",
        hashtags: "#filmactorramya #streaming #collaboration",
        summary: "Film actor Ramya announces new streaming platform collaboration.",
        author: "entertainment_news"
      },
      {
        content: "The competition between HashFame and other creator platforms is heating up with new features",
        url: "https://medium.com/creator-economy",
        hashtags: "#creatoreconomy #hashfame #competition",
        summary: "Analysis of competitive landscape in creator platform market.",
        author: "creator_analyst"
      },
      {
        content: "Marketincer's customer success stories show 300% improvement in campaign ROI",
        url: "https://marketincer.com/case-studies",
        hashtags: "#ROI #marketing #success #Marketincer",
        summary: "Case studies demonstrate significant ROI improvements with Marketincer platform.",
        author: "marketing_pro"
      },
      {
        content: "Film actor Ramya's performance in the latest movie has received critical acclaim",
        url: "https://twitter.com/movie-review",
        hashtags: "#filmactorramya #movie #review #acclaim",
        summary: "Critics praise film actor Ramya's latest performance.",
        author: "movie_critic"
      },
      {
        content: "Negative review about HashFame's customer service response time",
        url: "https://reddit.com/r/marketing/hashfame-review",
        hashtags: "#hashfame #customerservice #review",
        summary: "User complaints about delayed customer support responses.",
        author: "frustrated_user"
      }
    ];

    const newPosts = [];
    for (let i = 0; i < 17; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const content = sampleContent[Math.floor(Math.random() * sampleContent.length)];
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const rel = relevance[Math.floor(Math.random() * relevance.length)];
      const brandType = brandTypes[Math.floor(Math.random() * brandTypes.length)];
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      newPosts.push({
        id: i + 1,
        content: content.content,
        url: content.url,
        hashtags: content.hashtags,
        summary: content.summary,
        sentiment: sentiment,
        platform: platform,
        author: content.author,
        keyword: keyword,
        brandType: brandType,
        relevance: rel,
        postedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
        isViewed: false,
        isBookmarked: false
      });
    }
    return newPosts;
  };

  // Initialize with sample data
  useEffect(() => {
    const initialPosts = generateSamplePosts();
    setPosts(initialPosts);
    setFilteredPosts(initialPosts);
  }, [keywords]);

  // Fetch posts simulation
  const fetchPosts = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newPosts = generateSamplePosts();
      setPosts(newPosts);
      setFilteredPosts(newPosts);
      toast.success("Mentions fetched successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error("Failed to fetch mentions", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter posts
  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.hashtags.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.keywords !== 'all') {
      filtered = filtered.filter(post => post.keyword === activeFilters.keywords);
    }

    if (activeFilters.platforms !== 'all') {
      filtered = filtered.filter(post => post.platform.name === activeFilters.platforms);
    }

    if (activeFilters.sentiment !== 'all') {
      filtered = filtered.filter(post => post.sentiment === activeFilters.sentiment);
    }

    if (activeFilters.relevance !== 'all') {
      filtered = filtered.filter(post => post.relevance === activeFilters.relevance);
    }

    if (activeFilters.viewStatus !== 'all') {
      if (activeFilters.viewStatus === 'viewed') {
        filtered = filtered.filter(post => viewedPosts.has(post.id));
      } else if (activeFilters.viewStatus === 'unviewed') {
        filtered = filtered.filter(post => !viewedPosts.has(post.id));
      }
    }

    if (activeFilters.bookmarks) {
      filtered = filtered.filter(post => bookmarkedPosts.has(post.id));
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, activeFilters, bookmarkedPosts, viewedPosts]);

  // Toggle bookmark
  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.info("Bookmark removed", { position: "bottom-right", autoClose: 2000 });
      } else {
        newSet.add(postId);
        toast.success("Post bookmarked", { position: "bottom-right", autoClose: 2000 });
      }
      return newSet;
    });
  };

  // Mark as viewed
  const markAsViewed = (postId) => {
    setViewedPosts(prev => new Set([...prev, postId]));
  };

  // Add new keyword
  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      setShowAddKeyword(false);
      toast.success("Keyword added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Remove keyword
  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    toast.info("Keyword removed", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Get sentiment styling
  const getSentimentStyle = (sentiment) => {
    switch (sentiment) {
      case 'positive': 
        return { 
          backgroundColor: '#E8F5E8', 
          color: '#2E7D32', 
          borderColor: '#4CAF50' 
        };
      case 'negative': 
        return { 
          backgroundColor: '#FFEBEE', 
          color: '#C62828', 
          borderColor: '#F44336' 
        };
      default: 
        return { 
          backgroundColor: '#F5F5F5', 
          color: '#616161', 
          borderColor: '#9E9E9E' 
        };
    }
  };

  // Get relevance styling
  const getRelevanceStyle = (relevance) => {
    switch (relevance) {
      case 'high': 
        return { 
          backgroundColor: '#FFEBEE', 
          color: '#C62828', 
          borderColor: '#F44336' 
        };
      case 'medium': 
        return { 
          backgroundColor: '#FFF3E0', 
          color: '#F57C00', 
          borderColor: '#FF9800' 
        };
      default: 
        return { 
          backgroundColor: '#F5F5F5', 
          color: '#616161', 
          borderColor: '#9E9E9E' 
        };
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container spacing={0}>
        <Grid size={{ md: 1 }} className="side_section"><Sidebar /></Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
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
              <Typography variant="h6" sx={{ color: '#fff', ml: 2 }}>
              <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    sx={{ mr: 2, color: '#fff' }}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                Social Monitoring
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

          <Box sx={{ 
            flexGrow: 1, 
            mt: { xs: 8, md: 0 }, 
            padding: { xs: '10px', sm: '15px', md: '20px' },
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            {/* Top Stats Bar */}
            
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between', 
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 2, sm: 0 },
                  backgroundColor: '#B1C6FF', color: 'white',
                  padding:'10px',
                  mb:'2%'
                }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {filteredPosts.length}
                    </Typography>
                    <Typography variant="body1">
                      Total Mentions Found
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 2 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowAddKeyword(true)}
                      startIcon={<Settings />}
                      sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderColor: 'white'
                        }
                      }}
                    >
                      Add Keywords
                    </Button>
                    <Button
                      variant="contained"
                      onClick={fetchPosts}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
                      sx={{
                        backgroundColor: '#091A48',
                        '&:hover': { backgroundColor: '#0a1f5a' },
                        '&:disabled': { backgroundColor: 'rgba(9, 26, 72, 0.5)' }
                      }}
                    >
                      {loading ? 'Fetching...' : 'Get Mentions'}
                    </Button>
                  </Box>
                </Box>
              

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  flexWrap: 'wrap', 
                  gap: { xs: 1, sm: 2 }, 
                  alignItems: { xs: 'stretch', sm: 'center' }
                }}>
                  {/* Search Bar */}
                  <TextField
                    placeholder="Search mentions..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: '#882AFF' }} />
                    }}
                    sx={{ 
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { sm: 250, md: 220 },
                      flex: { sm: 1, md: 'none' },
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                    }}
                  />

                  {/* Filter Dropdowns */}
                  <FormControl size="small" sx={{ 
                    minWidth: { xs: '100%', sm: 220 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <InputLabel>Keywords</InputLabel>
                    <Select
                      value={activeFilters.keywords}
                      onChange={(e) => setActiveFilters({...activeFilters, keywords: e.target.value})}
                      label="Keywords"
                    >
                      <MenuItem value="all">All Keywords</MenuItem>
                      {keywords.map(keyword => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ 
                    minWidth: { xs: '100%', sm: 220 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <InputLabel>Platforms</InputLabel>
                    <Select
                      value={activeFilters.platforms}
                      onChange={(e) => setActiveFilters({...activeFilters, platforms: e.target.value})}
                      label="Platforms"
                    >
                      <MenuItem value="all">All Platforms</MenuItem>
                      <MenuItem value="Twitter">Twitter</MenuItem>
                      <MenuItem value="Instagram">Instagram</MenuItem>
                      <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Reddit">Reddit</MenuItem>
                      <MenuItem value="YouTube">YouTube</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ 
                    minWidth: { xs: '100%', sm:200 },
                    width: { xs: '100%', sm: 'auto' }
                  }}>
                    <InputLabel>Sentiment</InputLabel>
                    <Select
                      value={activeFilters.sentiment}
                      onChange={(e) => setActiveFilters({...activeFilters, sentiment: e.target.value})}
                      label="Sentiment"
                    >
                      <MenuItem value="all">All Sentiments</MenuItem>
                      <MenuItem value="positive">Positive</MenuItem>
                      <MenuItem value="neutral">Neutral</MenuItem>
                      <MenuItem value="negative">Negative</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    variant={activeFilters.bookmarks ? "contained" : "outlined"}
                    onClick={() => setActiveFilters({...activeFilters, bookmarks: !activeFilters.bookmarks})}
                    startIcon={<Bookmark />}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      backgroundColor: activeFilters.bookmarks ? '#882AFF' : 'transparent',
                      borderColor: '#882AFF',
                      color: activeFilters.bookmarks ? 'white' : '#882AFF',
                      '&:hover': {
                        backgroundColor: activeFilters.bookmarks ? '#7a4dd3' : '#f3e8ff',
                      }
                    }}
                  >
                    Bookmarks
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Keyword Cards */}
            <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mb: 4 }}>
              {keywords.map((keyword, index) => {
                const keywordPosts = posts.filter(post => post.keyword === keyword);
                const brandType = keywordPosts.length > 0 ? keywordPosts[0].brandType : 'OWN BRAND';
                const mentionCount = keywordPosts.length;
                const positiveMentions = keywordPosts.filter(post => post.sentiment === 'positive').length;
                const negativeMentions = keywordPosts.filter(post => post.sentiment === 'negative').length;
                const neutralMentions = keywordPosts.filter(post => post.sentiment === 'neutral').length;
                
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}  key={index}>
                    <Card 
                      sx={{ 
                        //height: '100%', 
                        border: '1px solid #fff',
                        '&:hover': { 
                          boxShadow: 4,
                          borderColor: '#882AFF'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <CardContent>
                        {/* Brand Type Badge and Delete */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip 
                            label={brandType}
                            size="small"
                            sx={{
                              backgroundColor: brandType === 'OWN BRAND' ? '#882AFF' : '#f44336',
                              color: 'white',
                            }}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => removeKeyword(keyword)}
                            sx={{ color: '#666', '&:hover': { color: '#f44336' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Keyword Name */}
                        <Typography variant="body" sx={{ fontWeight:'500', mb: 1, color: '#091A48' }}>
                          {keyword}
                        </Typography>

                        {/* Stats */}
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Total Mentions: {mentionCount}
                          </Typography>
                          
                          {/* Sentiment Grid */}
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} >
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#E8F5E8', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#2E7D32' }}>
                                  {positiveMentions}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#4CAF50' }}>
                                  Positive
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#F5F5F5', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#616161', }}>
                                  {neutralMentions}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
                                  Neutral
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                              <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#FFEBEE', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ color: '#C62828' }}>
                                  {negativeMentions}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#F44336' }}>
                                  Negative
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Button 
                            size="small"
                            variant="outlined"
                            onClick={() => setActiveFilters({...activeFilters, keywords: keyword})}
                            startIcon={<Visibility />}
                            sx={{ 
                              flex: 1, 
                              borderColor: '#882AFF', 
                              color: '#882AFF',
                              '&:hover': { 
                                backgroundColor: '#f3e8ff',
                                borderColor: '#882AFF'
                              }
                            }}
                          >
                            View
                          </Button>
                          <Button 
                            size="small"
                            variant="contained"
                            startIcon={<Analytics />}
                            sx={{ 
                              backgroundColor: '#882AFF',
                              '&:hover': { backgroundColor: '#7a4dd3' }
                            }}
                          >
                            Analyze
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
              
              {/* Add New Keyword Card */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }} lg={4}>
                <Card 
                  sx={{ 
                    //height: '100%', 
                    border: '1px dashed #ccc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: 300, sm: 220 },
                    '&:hover': { 
                      borderColor: '#882AFF',
                      backgroundColor: '#f9f9f9'
                    }
                  }}
                  onClick={() => setShowAddKeyword(true)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ backgroundColor: '#f0f0f0', color: '#666', mx: 'auto', mb: 2 }}>
                      <Add />
                    </Avatar>
                    <Typography variant="h6" color="textSecondary">
                      Add New Keyword
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Monitor mentions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Posts List */}
            {loading ? (
              <Card sx={{ textAlign: 'center', p: 6 }}>
                <CircularProgress sx={{ color: '#882AFF', mb: 2 }} />
                <Typography color="textSecondary">Fetching mentions...</Typography>
              </Card>
            ) : filteredPosts.length > 0 ? (
              <Box sx={{ space: 2 }}>
                {filteredPosts.map((post) => (
                  <Card key={post.id} sx={{ 
                    mb: 2, 
                    border: '1px solid #f0f0f0', 
                    '&:hover': { boxShadow: 2 },
                    overflow: 'hidden'
                  }}>
                    <CardContent>
                      {/* Post Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'flex-start' }, 
                        gap: { xs: 2, sm: 0 },
                        mb: 2 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flex: 1 }}>
                          <Avatar 
                            sx={{ 
                              backgroundColor: post.platform.color, 
                              color: 'white', 
                              width: 32, 
                              height: 32,
                              fontSize: 12,
                              fontWeight: 'bold'
                            }}
                          >
                            {post.platform.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Mention of <strong style={{ color: '#882AFF' }}>{post.keyword}</strong> in {post.platform.name}
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: { xs: 'column', sm: 'row' },
                              alignItems: { xs: 'flex-start', sm: 'center' }, 
                              gap: { xs: 0.5, sm: 1 }, 
                              mt: 0.5,
                              flexWrap: 'wrap'
                            }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <CalendarToday sx={{ fontSize: 14, color: 'textSecondary' }} />
                                <Typography variant="caption" color="textSecondary">
                                  {post.postedDate}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">by</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                  {post.author}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: { xs: 0.5, sm: 0 } }}>
                                <Button
                                  size="small"
                                  onClick={() => {
                                    markAsViewed(post.id);
                                    window.open(post.url, '_blank');
                                  }}
                                  endIcon={<ExternalLink sx={{ fontSize: 14 }} />}
                                  sx={{ 
                                    color: '#882AFF', 
                                    textTransform: 'none',
                                    minWidth: 'auto',
                                    p: 0,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    '&:hover': { textDecoration: 'underline' }
                                  }}
                                >
                                  View Post
                                </Button>
                                <Chip 
                                  label={post.sentiment}
                                  size="small"
                                  sx={getSentimentStyle(post.sentiment)}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'row', sm: 'row' },
                          alignItems: 'center', 
                          gap: 1,
                          flexWrap: 'wrap',
                          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                          width: { xs: '100%', sm: 'auto' }
                        }}>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ 
                              color: '#882AFF', 
                              borderColor: '#882AFF',
                              textTransform: 'none',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Generate AI Reply
                          </Button>
                          {viewedPosts.has(post.id) && (
                            <Chip
                              icon={<Visibility />}
                              label="Viewed"
                              size="small"
                              sx={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}
                            />
                          )}
                          <IconButton
                            onClick={() => toggleBookmark(post.id)}
                            sx={{ 
                              color: bookmarkedPosts.has(post.id) ? '#FFC107' : '#ccc',
                              '&:hover': { color: '#FFC107' }
                            }}
                          >
                            {bookmarkedPosts.has(post.id) ? <Bookmark /> : <BookmarkBorder />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Post Content */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.6 }}>
                          {post.content}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#882AFF', mb: 0.5 }}>
                          {post.url}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#882AFF' }}>
                          {post.hashtags}
                        </Typography>
                      </Box>

                      {/* Post Summary */}
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          border: '1px solid',
                          ...getRelevanceStyle(post.relevance)
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                              label={post.relevance.toUpperCase()}
                              size="small"
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }}
                            />
                            <Typography variant="body2">
                              {post.summary}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Card sx={{ textAlign: 'center', p: 6 }}>
                <MessageSquare sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No mentions found
                </Typography>
                <Typography color="textSecondary">
                  Try adjusting your filters or search terms
                </Typography>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Add Keyword Dialog */}
      <Dialog 
        open={showAddKeyword} 
        onClose={() => setShowAddKeyword(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#091A48', fontWeight: 'bold' }}>
          Add New Keyword
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Enter keyword to monitor"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            sx={{ 
              mt: 1,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#882AFF',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => {
              setShowAddKeyword(false);
              setNewKeyword('');
            }}
            sx={{ color: '#666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={addKeyword}
            variant="contained"
            disabled={!newKeyword.trim() || keywords.includes(newKeyword.trim())}
            sx={{ 
              backgroundColor: '#882AFF',
              '&:hover': { backgroundColor: '#7a4dd3' }
            }}
          >
            Add Keyword
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialMonitoring;