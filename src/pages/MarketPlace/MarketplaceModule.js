import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, Card, FormControl,
  Tab, Tabs, Checkbox, Grid, Modal, Paper, AppBar, Toolbar, Container, InputLabel, ListItemText,
  CardContent, Autocomplete, CardActions, CardMedia, Divider, Stack, ListItemIcon, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Badge, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PriceTagIcon from '@mui/icons-material/LocalOffer';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Add as AddIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Skeleton from "@mui/material/Skeleton";
import OutlinedInput from '@mui/material/OutlinedInput';
import Editor from "../../components/Editor";
import Layout from "../../components/Layout";
import CreateMarketplacePost from "./CreateMarketplacePost";
import { useAuth } from "../../authContext/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import MarketplaceAPI, { handleApiError } from "../../services/marketplaceApi";

const MarketplaceModule = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine user role and current view from route
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';
  const isInfluencer = user?.role === 'Influencer' || user?.role === 'influencer';
  const isBrand = user?.role === 'Brand' || user?.role === 'brand';
  
  // Determine current view based on route - Admin can access both views
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/brand/marketplace/new')) return 'create';
    if (path.includes('/brand/marketplace')) return 'listing';
    if (path.includes('/influencer/marketplace')) return 'feed';
    return isInfluencer ? 'feed' : 'listing';
  };

  // Determine current interface mode based on route
  const getCurrentMode = () => {
    const path = location.pathname;
    if (path.includes('/brand/marketplace')) return 'brand';
    if (path.includes('/influencer/marketplace')) return 'influencer';
    return isInfluencer ? 'influencer' : 'brand';
  };

  const [currentView, setCurrentView] = useState(getCurrentView());
  const [currentMode, setCurrentMode] = useState(getCurrentMode());
  
  // Existing states
  const Categories = ['A', 'B']; // Updated as per specification
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35']; // Updated as per specification
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];
  const Statuses = ['Published', 'Draft', 'Pending', 'Expired'];

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Listing states
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidsViewOpen, setBidsViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery || statusFilter || typeFilter || categoryFilter) {
        loadMarketplacePosts();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, statusFilter, typeFilter, categoryFilter]);

  useEffect(() => {
    // Update view when route changes
    setCurrentView(getCurrentView());
    setCurrentMode(getCurrentMode());
    loadMarketplacePosts();
  }, [location.pathname]);

  // Redirect based on user role (only for non-admin users accessing wrong routes)
  useEffect(() => {
    if (location.pathname === '/marketplace') {
      if (isInfluencer) {
        navigate('/influencer/marketplace', { replace: true });
      } else if (isBrand || isAdmin) {
        navigate('/brand/marketplace', { replace: true });
      }
    }
    
    // Prevent non-admin users from accessing wrong interfaces
    if (!isAdmin) {
      const path = location.pathname;
      if (isBrand && path.includes('/influencer/marketplace')) {
        navigate('/brand/marketplace', { replace: true });
      } else if (isInfluencer && path.includes('/brand/marketplace')) {
        navigate('/influencer/marketplace', { replace: true });
      }
    }
  }, [user, location.pathname, navigate, isInfluencer, isBrand, isAdmin]);

  const loadMarketplacePosts = async () => {
    setPostsLoading(true);
    try {
      let response;
      
      if (currentMode === 'influencer') {
        // Load marketplace feed for influencers
        response = await MarketplaceAPI.getMarketplaceFeed({
          page: 1,
          limit: 20,
          category: categoryFilter,
          search: searchQuery
        });
      } else {
        // Load brand posts for brands/admins
        response = await MarketplaceAPI.getBrandPosts({
          page: 1,
          limit: 20,
          status: statusFilter,
          category: categoryFilter,
          type: typeFilter,
          search: searchQuery
        });
      }
      
      if (response.success && response.data) {
        setMarketplacePosts(response.data.posts || []);
      } else {
        throw new Error('Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading marketplace posts:', error);
      
      // Fallback to mock data if API fails
      const mockData = MarketplaceAPI.getMockMarketplaceData();
      setMarketplacePosts(mockData.posts);
      
      toast.error(handleApiError(error));
    } finally {
      setPostsLoading(false);
    }
  };

  const handleEditDirect = (post) => {
    navigate('/brand/marketplace/new', { state: { editPost: post } });
  };

  const handlePostCreated = async (newPost) => {
    try {
      setLoading(true);
      
      if (selectedPost) {
        // Update existing post
        const response = await MarketplaceAPI.updatePost(selectedPost.id, newPost);
        if (response.success) {
          setMarketplacePosts(marketplacePosts.map(post => 
            post.id === selectedPost.id ? { ...post, ...newPost } : post
          ));
          toast.success("Post updated successfully!");
        }
        setSelectedPost(null);
      } else {
        // Create new post
        const response = await MarketplaceAPI.createPost(newPost);
        if (response.success) {
          setMarketplacePosts([response.data, ...marketplacePosts]);
          toast.success("Post created successfully!");
        }
      }
      
      navigate('/brand/marketplace');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDirect = async (post) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await MarketplaceAPI.deletePost(post.id);
      
      if (response.success) {
        setMarketplacePosts(marketplacePosts.filter(p => p.id !== post.id));
        toast.success("Post deleted successfully!");
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    if (!bidAmount) {
      toast.error("Please enter bid amount!");
      return;
    }
    
    try {
      setLoading(true);
      const bidData = {
        amount: `₹${bidAmount}`,
        message: `Bid submitted for ${selectedPost.title}`,
        portfolio_links: []
      };
      
      const response = await MarketplaceAPI.submitBid(selectedPost.id, bidData);
      
      if (response.success) {
        toast.success("Bid submitted successfully!");
        setBidAmount("");
        setBidDialogOpen(false);
        
        // Track post view when bidding
        await MarketplaceAPI.trackPostView(selectedPost.id);
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleViewBids = async (post) => {
    setSelectedPost(post);
    setBidsLoading(true);
    
    try {
      const response = await MarketplaceAPI.getPostBids(post.id);
      
      if (response.success && response.data) {
        setBids(response.data.bids || []);
      } else {
        setBids([]);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error(handleApiError(error));
      setBids([]);
    } finally {
      setBidsLoading(false);
      setBidsViewOpen(true);
    }
  };

  // Filter and Search Logic - Optimized with useMemo to prevent unnecessary re-renders
  const getFilteredPosts = useMemo(() => {
    let filtered = [...marketplacePosts];

    // Search filter - only search by title
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title && post.title.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(post => post.type === typeFilter);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    return filtered;
  }, [marketplacePosts, searchQuery, statusFilter, typeFilter, categoryFilter]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
    setCategoryFilter('');
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchQuery || statusFilter || typeFilter || categoryFilter;
  };

  // Brand Listing View
  const BrandListingView = () => {
    const filteredPosts = getFilteredPosts;

    return (
      <Box sx={{ padding: '20px' }}>
        {/* Search and Filter Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
            border: '1px solid #e1e7ff'
          }}
        >
          {/* Search Bar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#882AFF', mr: 1 }} />,
                endAdornment: searchQuery && (
                  <IconButton 
                    size="small" 
                    onClick={() => setSearchQuery('')}
                    sx={{ color: '#666' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e1e7ff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#882AFF',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#882AFF',
                  }
                }
              }}
            />
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                minWidth: '140px',
                borderRadius: 2,
                bgcolor: showFilters ? '#882AFF' : 'transparent',
                borderColor: '#882AFF',
                color: showFilters ? 'white' : '#882AFF',
                '&:hover': {
                  bgcolor: showFilters ? '#6a1b9a' : '#f3e5f5',
                  borderColor: '#6a1b9a'
                }
              }}
            >
              Filters
            </Button>
          </Box>

          {/* Filter Options */}
          {showFilters && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              alignItems: 'center',
              p: 2,
              backgroundColor: 'white',
              borderRadius: 2,
              border: '1px solid #e1e7ff'
            }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {Statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {Types.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {Categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      Category {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {hasActiveFilters() && (
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={clearAllFilters}
                  sx={{ 
                    color: '#f44336',
                    '&:hover': { bgcolor: '#ffebee' }
                  }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          )}

          {/* Results Summary */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredPosts.length} of {marketplacePosts.length} posts
              {hasActiveFilters() && (
                <Chip 
                  label="Filtered" 
                  size="small" 
                  sx={{ ml: 1, bgcolor: '#882AFF', color: 'white' }}
                />
              )}
            </Typography>
          </Box>
        </Paper>

        {/* Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: 'linear-gradient(135deg, #882AFF 0%, #6a1b9a 100%)',
                '& .MuiTableCell-root': {
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
                }
              }}>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Title</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Type</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Status</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Date Created</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Deadline</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Budget</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Bids</TableCell>
                <TableCell sx={{ bgcolor: '#882AFF' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {postsLoading ? (
                // Loading skeleton rows
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={200} />
                      </Box>
                    </TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  </TableRow>
                ))
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <SearchIcon sx={{ fontSize: 48, color: '#ccc' }} />
                      <Typography variant="h6" color="text.secondary">
                        {hasActiveFilters() ? 'No posts match your filters' : 'No posts found'}
                      </Typography>
                      {hasActiveFilters() && (
                        <Button 
                          variant="outlined" 
                          onClick={clearAllFilters}
                          sx={{ borderColor: '#882AFF', color: '#882AFF' }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={post.imageUrl} sx={{ width: 40, height: 40 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {post.title}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={post.type} 
                    size="small" 
                    sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                  />
                </TableCell>
                  <TableCell>
                    <Chip 
                      label={post.status} 
                      size="small" 
                      sx={{
                        bgcolor: post.status === 'Published' ? '#e8f5e8' : 
                                post.status === 'Draft' ? '#fff3e0' : 
                                post.status === 'Pending' ? '#e3f2fd' : '#f5f5f5',
                        color: post.status === 'Published' ? '#2e7d32' : 
                               post.status === 'Draft' ? '#f57c00' : 
                               post.status === 'Pending' ? '#1976d2' : '#616161',
                        fontWeight: 'medium'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#666' }}>{post.dateCreated}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{post.deadline}</TableCell>
                  <TableCell>
                    <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                      {post.budget}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewBids(post)}
                      sx={{ 
                        color: '#882AFF', 
                        borderColor: '#882AFF',
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: '#f3e5f5',
                          borderColor: '#6a1b9a'
                        }
                      }}
                    >
                      View Bids
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        onClick={() => handleEditDirect(post)}
                        sx={{ 
                          color: '#882AFF', 
                          '&:hover': { bgcolor: '#f3e5f5' },
                          borderRadius: 2
                        }}
                        size="small"
                        title="Edit Post"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteDirect(post)}
                        sx={{ 
                          color: '#f44336', 
                          '&:hover': { bgcolor: '#ffebee' },
                          borderRadius: 2
                        }}
                        size="small"
                        title="Delete Post"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Influencer Feed View
  const InfluencerFeedView = () => {
    const filteredPosts = getFilteredPosts.filter(post => post.status === 'Published');
    
    return (
      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h4" sx={{ 
          color: '#882AFF', 
          fontWeight: 'bold', 
          mb: 3,
          textAlign: 'center'
        }}>
          Marketplace Feed
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#882AFF', mr: 1 }} />,
              endAdornment: searchQuery && (
                <IconButton 
                  size="small" 
                  onClick={() => setSearchQuery('')}
                  sx={{ color: '#666' }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
              sx: {
                borderRadius: 3,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e1e7ff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#882AFF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#882AFF',
                }
              }
            }}
          />
        </Box>
        
        {/* Feed Container */}
        <Box sx={{ 
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto',
          paddingRight: '8px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#882AFF',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#6a1b9a',
          },
        }}>
          {postsLoading ? (
            // Loading skeleton cards
            [...Array(3)].map((_, index) => (
              <Card key={index} sx={{ 
                mb: 3,
                borderRadius: 3, 
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e1e7ff',
                backgroundColor: 'white'
              }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" height={300} />
                <Box sx={{ p: 2 }}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              </Card>
            ))
          ) : filteredPosts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SearchIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No opportunities found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {hasActiveFilters() ? 'Try adjusting your search filters' : 'Check back later for new opportunities'}
              </Typography>
            </Box>
          ) : (
            filteredPosts.map((post, index) => (
            <Card key={post.id} sx={{ 
              mb: 3,
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e1e7ff',
              backgroundColor: 'white',
              overflow: 'hidden',
              '&:hover': { 
                boxShadow: '0 4px 20px rgba(136, 42, 255, 0.15)',
                borderColor: '#882AFF'
              },
              transition: 'all 0.3s ease'
            }}>
              {/* Post Header */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: '#882AFF', 
                    width: 40, 
                    height: 40,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {post.brand.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {post.brand}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted • {post.views} views
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={post.type} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#e3f2fd', 
                      color: '#1976d2',
                      fontWeight: 'bold',
                      fontSize: '11px'
                    }} 
                  />
                  <Chip 
                    label={post.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#f3e5f5', 
                      color: '#7b1fa2',
                      fontWeight: 'bold',
                      fontSize: '11px'
                    }} 
                  />
                </Box>
              </Box>

              {/* Post Content */}
              <Box>
                {/* Image */}
                <CardMedia
                  component="img"
                  height="300"
                  image={post.imageUrl}
                  alt={post.title}
                  sx={{ 
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
                
                {/* Content Body */}
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: '#333',
                    fontSize: '18px'
                  }}>
                    {post.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    lineHeight: 1.6,
                    fontSize: '14px'
                  }}>
                    {post.description}
                  </Typography>
                  
                  {/* Budget and Deadline */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 1.5,
                    bgcolor: '#f8f9ff',
                    borderRadius: 2,
                    border: '1px solid #e1e7ff'
                  }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Budget
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: '#882AFF', 
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        {post.budget}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Deadline
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {post.deadline}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Location */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: '#882AFF' }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.location}
                    </Typography>
                  </Box>
                </CardContent>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                p: 2, 
                borderTop: '1px solid #f0f0f0',
                bgcolor: '#fafbff'
              }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    size="medium"
                    startIcon={<ChatBubbleOutlineIcon />}
                    onClick={async () => {
                      try {
                        const messageData = {
                          recipient_id: post.brand_id || 'brand_user_id',
                          message: `Hi! I'm interested in your "${post.title}" campaign. I'd love to discuss this opportunity further.`,
                          post_id: post.id,
                          type: 'text'
                        };
                        
                        const response = await MarketplaceAPI.sendMessage(messageData);
                        
                        if (response.success) {
                          toast.success('Message sent successfully!');
                        }
                      } catch (error) {
                        console.error('Error sending message:', error);
                        toast.error(handleApiError(error));
                      }
                    }}
                    sx={{ 
                      flex: 1,
                      borderColor: '#882AFF',
                      color: '#882AFF',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      py: 1,
                      '&:hover': { 
                        borderColor: '#6a1b9a', 
                        bgcolor: '#f3e5f5',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Message
                  </Button>
                  <Button 
                    variant="contained" 
                    size="medium"
                    onClick={async () => {
                      setSelectedPost(post);
                      setBidDialogOpen(true);
                      
                      // Track post view when user opens bid dialog
                      try {
                        await MarketplaceAPI.trackPostView(post.id);
                      } catch (error) {
                        console.error('Error tracking post view:', error);
                      }
                    }}
                    sx={{ 
                      flex: 1,
                      bgcolor: '#882AFF',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      py: 1,
                      '&:hover': { 
                        bgcolor: '#6a1b9a',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Bid Now
                  </Button>
                </Box>
              </Box>
            </Card>
          )))}
          
          {/* Load More Button */}
          <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
            <Button 
              variant="outlined" 
              size="large"
              sx={{
                borderColor: '#882AFF',
                color: '#882AFF',
                fontWeight: 'bold',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#6a1b9a',
                  bgcolor: '#f3e5f5'
                }
              }}
            >
              Load More Posts
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  // Bid Dialog
  const BidDialog = () => (
    <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Submit Your Bid</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Bidding for: <strong>{selectedPost?.title}</strong>
        </Typography>
        <TextField
          fullWidth
          label="Your Bid Amount (₹)"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="5,000"
          sx={{ mb: 2 }}
          type="number"
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBidDialogOpen(false)} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleBidSubmit} 
          variant="contained"
          disabled={loading}
          sx={{ 
            bgcolor: '#882AFF',
            '&:hover': { bgcolor: '#6a1b9a' }
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Place Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Bids View Dialog
  const BidsViewDialog = () => (
    <Dialog open={bidsViewOpen} onClose={() => setBidsViewOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Bids for: {selectedPost?.title}</DialogTitle>
      <DialogContent>
        {bidsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : bids.length === 0 ? (
          <Typography>No bids yet for this post.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Influencer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {bid.influencer?.name?.charAt(0) || 'I'}
                        </Avatar>
                        {bid.influencer?.name || 'Influencer'}
                      </Box>
                    </TableCell>
                    <TableCell>{bid.amount}</TableCell>
                    <TableCell>{new Date(bid.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={bid.status} 
                        size="small"
                        sx={{
                          bgcolor: bid.status === 'accepted' ? '#e8f5e8' : 
                                 bid.status === 'rejected' ? '#ffebee' : '#e3f2fd',
                          color: bid.status === 'accepted' ? '#2e7d32' : 
                               bid.status === 'rejected' ? '#d32f2f' : '#1976d2'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {bid.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="success"
                            onClick={async () => {
                              try {
                                await MarketplaceAPI.updateBidStatus(bid.id, { 
                                  status: 'accepted',
                                  message: 'Congratulations! Your bid has been accepted.'
                                });
                                toast.success("Bid accepted!");
                                handleViewBids(selectedPost); // Refresh bids
                              } catch (error) {
                                toast.error(handleApiError(error));
                              }
                            }}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            color="error"
                            onClick={async () => {
                              try {
                                await MarketplaceAPI.updateBidStatus(bid.id, { 
                                  status: 'rejected',
                                  message: 'Thank you for your interest. We went with another influencer.'
                                });
                                toast.info("Bid rejected!");
                                handleViewBids(selectedPost); // Refresh bids
                              } catch (error) {
                                toast.error(handleApiError(error));
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBidsViewOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Show access denied for users without proper roles
  if (!user || (!isInfluencer && !isBrand && !isAdmin)) {
    return (
      <Layout>
        <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" color="error">
            Access denied. Please log in with appropriate permissions.
          </Typography>
        </Box>
      </Layout>
    );
  }

  // Get header title based on current mode
  const getHeaderTitle = () => {
    if (currentMode === 'brand') {
      return isAdmin ? 'Marketincer-Brand Dashboard' : 'Brand Marketplace';
    } else {
      return isAdmin ? 'Marketincer-Influencer Feed' : 'Influencer Marketplace';
    }
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: '#091a48',
            borderRadius: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff' }}>
            {getHeaderTitle()}
          </Typography>
          
          {/* Add Create New Post button to top nav for brand/admin users */}
          {(currentMode === 'brand' && (isBrand || isAdmin) && currentView !== 'create') && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/brand/marketplace/new')}
              sx={{ 
                bgcolor: '#882AFF',
                '&:hover': { bgcolor: '#6a1b9a' }
              }}
            >
              Create New Post
            </Button>
          )}
        </Paper>

        {/* Main Content */}
        {(currentMode === 'brand' && (isBrand || isAdmin)) ? (
          currentView === 'create' ? (
            <CreateMarketplacePost 
              onBack={() => navigate('/brand/marketplace')} 
              onPostCreated={handlePostCreated}
              initialData={location.state?.editPost}
            />
          ) : (
            <BrandListingView />
          )
        ) : (currentMode === 'influencer' && (isInfluencer || isAdmin)) ? (
          <InfluencerFeedView />
        ) : (
          <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" color="error">
              Access denied. You don't have permission to access this view.
            </Typography>
          </Box>
        )}

        {/* Dialogs */}
        <BidDialog />
        <BidsViewDialog />
      </Box>
    </Layout>
  );
};

export default MarketplaceModule;