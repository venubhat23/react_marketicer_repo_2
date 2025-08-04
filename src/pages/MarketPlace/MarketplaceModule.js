import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, Card, FormControl,
  Tab, Tabs, Checkbox, Grid, Modal, Paper, AppBar, Toolbar, Container, InputLabel, ListItemText,
  CardContent, Autocomplete, CardActions, CardMedia, Divider, Stack, ListItemIcon, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Badge, Dialog, DialogTitle, DialogContent, DialogActions,InputAdornment
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
import MyBidsView from "./MyBidsView";
import { useAuth } from "../../authContext/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import MarketplaceAPI, { handleApiError } from "../../services/marketplaceApi";
import { bidsApi } from "../../utils/marketplaceApi";
import Sidebar from '../../components/Sidebar'

const MarketplaceModule = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine user role and current view from route
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';
  const isInfluencer = user?.role === 'Influencer' || user?.role === 'influencer';
  const isBrand = user?.role === 'Brand' || user?.role === 'brand';
  
  // Determine current view based on route - Admin can access both views
  const getCurrentView = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/brand/marketplace/new')) return 'create';
    if (path.includes('/brand/marketplace')) return 'listing';
    if (path.includes('/influencer/marketplace')) return 'feed';
    return isInfluencer ? 'feed' : 'listing';
  }, [location.pathname, isInfluencer]);

  // Determine current interface mode based on route
  const getCurrentMode = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/brand/marketplace')) return 'brand';
    if (path.includes('/influencer/marketplace')) return 'influencer';
    return isInfluencer ? 'influencer' : 'brand';
  }, [location.pathname, isInfluencer]);

  const [currentView, setCurrentView] = useState(getCurrentView());
  const [currentMode, setCurrentMode] = useState(getCurrentMode());
  
  // Updated constants as per API specification
  const Categories = ['A', 'B'];
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];
  const Statuses = ['published', 'draft', 'archived']; // Updated as per API spec

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [targetAudienceFilter, setTargetAudienceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Listing states
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidsViewOpen, setBidsViewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [searchFeedQuery, setSearchFeedQuery] = useState('');
  
  // Influencer view toggle states
  const [influencerView, setInfluencerView] = useState('feed'); // 'feed' or 'bids'
  const [myBids, setMyBids] = useState([]);

  // Statistics state
  const [statistics, setStatistics] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const inputRef = useRef(null); // create reference to TextField

  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, []);

  // Load posts when page changes or initial mount
  useEffect(() => {
    loadMarketplacePosts();
  }, [currentPage, currentMode]);

  // Load bids when influencer switches to bids view
  useEffect(() => {
    if (currentMode === 'influencer' && influencerView === 'bids') {
      loadMyBids();
    }
  }, [influencerView, currentMode]);

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

  const loadMarketplacePosts = useCallback(async () => {
    setPostsLoading(true);
    try {
      let response;
      
      if (currentMode === 'influencer') {
        // Load marketplace feed for influencers
        if (searchQuery) {
          // Use search endpoint for influencers
          response = await MarketplaceAPI.searchMarketplacePosts({
            q: searchQuery,
            category: categoryFilter,
            target_audience: targetAudienceFilter,
            page: currentPage,
            per_page: 10
          });
        } else {
          // Use regular feed endpoint
          response = await MarketplaceAPI.getMarketplaceFeed({
            category: categoryFilter,
            target_audience: targetAudienceFilter,
            page: currentPage,
            per_page: 10
          });
        }
      } else {
        // Load brand posts for brands/admins
        response = await MarketplaceAPI.getMyMarketplacePosts();
        
        // Apply client-side filtering for brand posts since the API doesn't support search for brand posts
        if (response.success && response.data) {
          let filteredPosts = response.data;
          
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredPosts = filteredPosts.filter(post => 
              post.title?.toLowerCase().includes(query) ||
              post.description?.toLowerCase().includes(query) ||
              post.brand_name?.toLowerCase().includes(query)
            );
          }
          
          if (statusFilter) {
            filteredPosts = filteredPosts.filter(post => post.status === statusFilter);
          }
          
          if (categoryFilter) {
            filteredPosts = filteredPosts.filter(post => post.category === categoryFilter);
          }
          
          if (targetAudienceFilter) {
            filteredPosts = filteredPosts.filter(post => post.target_audience === targetAudienceFilter);
          }
          
          response.data = filteredPosts;
        }
      }
      
      if (response.success && response.data) {
        // Transform API response to match existing component expectations
        const transformedPosts = response.data.map(post => ({
          id: post.id,
          title: post.title,
          description: post.description,
          brand: post.brand_name || 'Unknown Brand',
          brand_name: post.brand_name,
          budget: typeof post.budget === 'number' ? `₹${post.budget.toLocaleString()}` : post.budget,
          deadline: post.deadline,
          location: post.location,
          platform: post.platform,
          languages: post.languages,
          category: post.category,
          targetAudience: post.target_audience,
          target_audience: post.target_audience,
          tags: post.tags,
          imageUrl: post.media_url,
          media_url: post.media_url,
          media_type: post.media_type,
          status: post.status,
          views: post.views_count || 0,
          views_count: post.views_count || 0,
          bids_count: post.bids_count || 0,
          dateCreated: post.created_at ? new Date(post.created_at).toLocaleDateString() : '',
          created_at: post.created_at,
          updated_at: post.updated_at,
          user_has_bid: post.user_has_bid || false,
          user_bid: post.user_bid,
          // Legacy fields for backward compatibility
          type: 'Sponsored Post'
        }));
        
        setMarketplacePosts(transformedPosts);
        
        // Update pagination if available
        if (response.pagination) {
          setCurrentPage(response.pagination.current_page || 1);
          setTotalPages(Math.ceil((response.pagination.total_count || 0) / (response.pagination.per_page || 10)));
          setTotalCount(response.pagination.total_count || 0);
        }
      } else {
        throw new Error(response.error?.message || 'Failed to load posts');
      }
    } catch (error) {
      console.error('Error loading marketplace posts:', error);
      
      // Fallback to mock data if API fails
      const mockData = MarketplaceAPI.getMockMarketplaceData();
      const transformedMockPosts = mockData.posts.map(post => ({
        ...post,
        brand: post.brand_name,
        targetAudience: post.target_audience,
        views: post.views_count,
        dateCreated: new Date(post.created_at).toLocaleDateString(),
        imageUrl: post.media_url,
        type: 'Sponsored Post'
      }));
      setMarketplacePosts(transformedMockPosts);
      
      toast.error(handleApiError(error));
    } finally {
      setPostsLoading(false);
    }
  }, [searchQuery, statusFilter, typeFilter, categoryFilter, targetAudienceFilter, currentPage, currentMode]);

  const loadMyBids = useCallback(async () => {
    setBidsLoading(true);
    try {
      const response = await MarketplaceAPI.getMyBids();
      
      if (response.success && response.data) {
        // Transform API response to match existing component expectations
        const transformedBids = response.data.map(bid => ({
          id: bid.id,
          amount: typeof bid.amount === 'number' ? bid.amount : parseFloat(bid.amount?.toString().replace(/[₹,]/g, '') || 0),
          status: bid.status,
          message: bid.message,
          submittedDate: bid.created_at ? new Date(bid.created_at).toLocaleDateString() : '',
          created_at: bid.created_at,
          updated_at: bid.updated_at,
          // Post details
          postId: bid.marketplace_post?.id,
          postTitle: bid.marketplace_post?.title,
          brand: bid.marketplace_post?.brand_name,
          description: bid.marketplace_post?.description,
          deadline: bid.marketplace_post?.deadline
        }));
        
        setMyBids(transformedBids);
      } else {
        throw new Error(response.error?.message || 'Failed to load bids');
      }
    } catch (error) {
      console.error('Error loading my bids:', error);
      
      // Fallback to mock data if API fails
      const mockBids = [
        {
          id: 1,
          postId: 1,
          postTitle: "Instagram Reel for Fashion Brand",
          amount: 8000,
          status: "pending",
          submittedDate: "2024-01-20",
          brand: "StyleCo",
          description: "Looking for fashion influencers to create engaging reels",
          deadline: "2024-02-01"
        },
        {
          id: 2,
          postId: 2,
          postTitle: "Product Review - Tech Gadget",
          amount: 12000,
          status: "accepted",
          submittedDate: "2024-01-18",
          brand: "TechGuru",
          description: "Need honest reviews for our latest smartphone",
          deadline: "2024-01-30"
        },
        {
          id: 3,
          postId: 3,
          postTitle: "Food Blog Feature",
          amount: 5000,
          status: "rejected",
          submittedDate: "2024-01-15",
          brand: "FoodieWorld",
          description: "Feature our restaurant in your food blog",
          deadline: "2024-01-25"
        }
      ];
      setMyBids(mockBids);
      
      toast.error(handleApiError(error));
    } finally {
      setBidsLoading(false);
    }
  }, []);

  const loadStatistics = useCallback(async () => {
    try {
      const response = await MarketplaceAPI.getMarketplaceStatistics();
      
      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Statistics are optional, don't show error to user
    }
  }, []);

  // Debounced search effect - placed after function definitions
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      loadMarketplacePosts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, statusFilter, typeFilter, categoryFilter, targetAudienceFilter]);

  // Route change effect - placed after function definitions
  useEffect(() => {
    // Update view when route changes
    setCurrentView(getCurrentView());
    setCurrentMode(getCurrentMode());
    setCurrentPage(1);
    loadMarketplacePosts();
    loadStatistics();
  }, [location.pathname]);

  const handleEditDirect = (post) => {
    navigate('/brand/marketplace/new', { state: { editPost: post } });
  };

  const handlePostCreated = async (newPost) => {
    try {
      setLoading(true);
      
      if (selectedPost) {
        // Update existing post
        const response = await MarketplaceAPI.updateMarketplacePost(selectedPost.id, newPost);
        if (response.success) {
          // Refresh the posts list
          await loadMarketplacePosts();
          toast.success(response.message || "Post updated successfully!");
        } else {
          throw new Error(response.error?.message || 'Failed to update post');
        }
        setSelectedPost(null);
      } else {
        // Create new post
        const response = await MarketplaceAPI.createMarketplacePost(newPost);
        if (response.success) {
          // Refresh the posts list
          await loadMarketplacePosts();
          toast.success(response.message || "Post created successfully!");
        } else {
          throw new Error(response.error?.message || 'Failed to create post');
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
      const response = await MarketplaceAPI.deleteMarketplacePost(post.id);
      
      if (response.success) {
        // Refresh the posts list
        await loadMarketplacePosts();
        toast.success(response.message || "Post deleted successfully!");
      } else {
        throw new Error(response.error?.message || 'Failed to delete post');
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
        amount: bidAmount,
        message: bidMessage || `Bid submitted for ${selectedPost.title}`
      };
      
      const response = await MarketplaceAPI.createBid(selectedPost.id, bidData);
      
      if (response.success) {
        toast.success(response.message || "Bid submitted successfully!");
        setBidAmount("");
        setBidMessage("");
        setBidDialogOpen(false);
        
        // Track post view when bidding
        try {
          await MarketplaceAPI.trackPostView(selectedPost.id);
        } catch (viewError) {
          console.error('Error tracking post view:', viewError);
        }
        
        // Refresh posts to update bid status
        await loadMarketplacePosts();
      } else {
        throw new Error(response.error?.message || 'Failed to submit bid');
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
      const response = await MarketplaceAPI.getMarketplacePostBids(post.id);
      
      if (response.success && response.data) {
        // Transform API response to match existing component expectations
        const transformedBids = (response.data.bids || []).map(bid => ({
          id: bid.id,
          amount: typeof bid.amount === 'number' ? `₹${bid.amount.toLocaleString()}` : bid.amount,
          status: bid.status,
          message: bid.message,
          created_at: bid.created_at,
          updated_at: bid.updated_at,
          influencer: {
            name: bid.influencer_name,
            email: bid.influencer_email
          }
        }));
        
        setBids(transformedBids);
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

  const handleBidStatusUpdate = async (bidId, status) => {
    try {
      let response;
      
      if (status === 'accepted') {
        response = await MarketplaceAPI.acceptBid(bidId);
      } else if (status === 'rejected') {
        response = await MarketplaceAPI.rejectBid(bidId);
      } else {
        throw new Error('Invalid bid status');
      }
      
      if (response.success) {
        toast.success(response.message || `Bid ${status} successfully!`);
        // Refresh bids list
        await handleViewBids(selectedPost);
      } else {
        throw new Error(response.error?.message || `Failed to ${status} bid`);
      }
    } catch (error) {
      console.error(`Error ${status} bid:`, error);
      toast.error(handleApiError(error));
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
    setTargetAudienceFilter('');
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return searchQuery || statusFilter || typeFilter || categoryFilter || targetAudienceFilter;
  };

  const handleAcceptBid = async (bidId) => {
    try {
      const response = await bidsApi.acceptBid(bidId);
      
      if (response.data && response.data.status === 'success') {
        toast.success("Bid accepted successfully!");
        // Reload bids to show updated status
        if (selectedPost) {
          handleViewBids(selectedPost);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to accept bid');
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to accept bid";
      toast.error(errorMessage);
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      const response = await bidsApi.rejectBid(bidId);
      
      if (response.data && response.data.status === 'success') {
        toast.success("Bid rejected successfully!");
        // Reload bids to show updated status
        if (selectedPost) {
          handleViewBids(selectedPost);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to reject bid');
      }
    } catch (error) {
      console.error("Error rejecting bid:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to reject bid";
      toast.error(errorMessage);
    }
  };

  // Brand Listing View
  const BrandListingView = () => {
    const filteredPosts = getFilteredPosts;

    return (
      <Box>
        {/* Search and Filter Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 1, 
            //mb: 2, 
            borderRadius: 0,
            background: '#B1C6FF',
            boxShadow:'none'
          }}
        >
          {/* Search Bar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center'}}>
          <TextField
            inputRef={inputRef}
            placeholder="Search by title..."
            value={searchQuery}
            autoFocus
            size="small"
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              height:'40',
              padding:'0px 0px',
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#882AFF' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ color: '#666' }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 30,
                width: '350px',
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e1e7ff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#882AFF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#882AFF',
                },
              },
            }}
          />
          
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                minWidth: '150px',
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
              p: 1,
              backgroundColor: 'white',
              borderRadius: 2,
              border: '1px solid #e1e7ff',
              mt:1,
            }}>
              <FormControl size="small" sx={{ minWidth: 260 }}>
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

              <FormControl size="small" sx={{ minWidth: 260 }}>
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

              <FormControl size="small" sx={{ minWidth: 260 }}>
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

              <FormControl size="small" sx={{ minWidth: 260 }}>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={targetAudienceFilter}
                  onChange={(e) => setTargetAudienceFilter(e.target.value)}
                  label="Target Audience"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {TargetAudiences.map((audience) => (
                    <MenuItem key={audience} value={audience}>
                      {audience}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="body2" color="text.secondary">
              {/* Showing {filteredPosts.length} of {marketplacePosts.length} posts */}
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
        <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 2, sm: 4, md: 12 }}>
              <Box>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}
              >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: '#B1C6FF',
                '& .MuiTableCell-root': {
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  padding:'10px 10px'
                }
              }}>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date Created</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Bids</TableCell>
                <TableCell>Actions</TableCell>
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
                        bgcolor: post.status === 'published' ? '#e8f5e8' : 
                                post.status === 'draft' ? '#fff3e0' : 
                                post.status === 'archived' ? '#f5f5f5' : '#e3f2fd',
                        color: post.status === 'published' ? '#2e7d32' : 
                               post.status === 'draft' ? '#f57c00' : 
                               post.status === 'archived' ? '#616161' : '#1976d2',
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
            </Grid>
          </Grid>
        </Box>
        
      </Box>
    );
  };

  // Influencer Feed View
  const InfluencerFeedView = () => {
    const filteredPosts = getFilteredPosts.filter(post => post.status === 'published');
    
    return (
      <Box sx={{ 
        padding: '20px',
      }}>
        
        {/* View Toggle Switch */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'left', 
          mb: 2 
        }}>
          <Tabs
            value={influencerView}
            onChange={(e, newValue) => setInfluencerView(newValue)}
            sx={{
              backgroundColor: 'white',
              '& .MuiTabs-indicator': {
                backgroundColor: '#882AFF',
                height: '2px',
              },
              '& .MuiTab-root': {
                minWidth: '120px',
                color: '#666',
                '&.Mui-selected': {
                  color: '#882AFF'
                }
              }
            }}
          >
            <Tab 
              label="Feed" 
              value="feed"
              icon={<ShoppingCartIcon />}
              iconPosition="start"
            />
            <Tab 
              label="My Bids" 
              value="bids"
              icon={<CheckCircleOutlineIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        {influencerView === 'feed' && (
          <>
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search opportunities..."
                value={searchQuery}
                autoFocus
                size="small" 
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#882AFF', mr: 1 }} />,
                  endAdornment: searchQuery && (
                    <IconButton 
                      size="small" 
                      onClick={() => setSearchQuery('')}
                      sx={{ color: '#666', ml:1 }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: 50,
                    padding:'0px !important',
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
        <Box >
        <Grid size={{ md: 8 }} sx={{margin:'auto'}}>
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
                    disabled={post.user_has_bid}
                    sx={{ 
                      flex: 1,
                      bgcolor: '#882AFF',
                      borderRadius: 2,
                      py: 1,
                      '&:hover': { 
                        bgcolor: '#6a1b9a',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {post.user_has_bid ? 'Bid Placed' : 'Bid Now'}
                  </Button>
                </Box>
              </Box>
            </Card>
          )))}
          
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                gap: 2,
                mt: 4, 
                mb: 2 
              }}>
                <Button
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  sx={{
                    borderColor: '#882AFF',
                    color: '#882AFF',
                    '&:hover': {
                      borderColor: '#6a1b9a',
                      bgcolor: '#f3e5f5'
                    },
                    '&:disabled': {
                      borderColor: '#ccc',
                      color: '#ccc'
                    }
                  }}
                >
                  Previous
                </Button>
                
                <Typography variant="body2" sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: '#f8f9ff',
                  borderRadius: 2,
                  border: '1px solid #e1e7ff',
                  fontWeight: 'medium'
                }}>
                  Page {currentPage} of {totalPages}
                </Typography>
                
                <Button
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  sx={{
                    borderColor: '#882AFF',
                    color: '#882AFF',
                    '&:hover': {
                      borderColor: '#6a1b9a',
                      bgcolor: '#f3e5f5'
                    },
                    '&:disabled': {
                      borderColor: '#ccc',
                      color: '#ccc'
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            )}
            
            {/* Results Summary */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalCount)} of {totalCount} opportunities
              </Typography>
            </Box>
          
          
            </Grid>
            </Box>
          </>
        )}

        {/* My Bids View */}
        {influencerView === 'bids' && (
          <Box>
            {bidsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#882AFF' }} />
              </Box>
            ) : myBids.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                backgroundColor: 'white',
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No Bids Submitted Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse the feed and submit bids on opportunities you're interested in!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setInfluencerView('feed')}
                  sx={{
                    mt: 3,
                    bgcolor: '#882AFF',
                    '&:hover': { bgcolor: '#6a1b9a' }
                  }}
                >
                  Browse Opportunities
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {myBids.map((bid) => (
                  <Grid size={{ xs: 12, sm: 6, md: 6 }} key={bid.id}>
                    <Card sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        {/* Bid Status Badge */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Chip
                            label={bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            size="small"
                            sx={{
                              bgcolor: 
                                bid.status === 'accepted' ? '#4caf50' :
                                bid.status === 'rejected' ? '#f44336' :
                                '#ff9800',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {bid.submittedDate}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          {/* Post Title */}
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            color: '#333',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                          {bid.postTitle} 
                        </Typography>
                        </Box>

                        {/* Brand */}
                        <Typography variant="body2" sx={{ 
                          color: '#882AFF', 
                          fontWeight: 'bold',
                          mb: 1
                        }}>
                          by {bid.brand}
                        </Typography>

                        <Box sx={{
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          //bgcolor: '#f8f9fa',
                          //p: 2,
                          borderRadius: 2,
                          mb: 1
                          }}>

                          <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          bgcolor: '#f8f9fa',
                          p: 1,
                          borderRadius: 2,
                          //mb: 1,
                          width:'50%'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Your Bid:
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            color: '#882AFF', 
                            fontWeight: 'bold' 
                          }}>
                            ₹{bid.amount.toLocaleString()}
                          </Typography>
                        </Box>
                          
                          {/* <LocationOnIcon sx={{ color: '#666', fontSize: 16, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Deadline: {bid.deadline}
                          </Typography> */}

                          <Button
                            variant="outlined"
                            size="small"
                            //fullWidth
                            sx={{
                              
                              borderColor: '#882AFF',
                              color: '#882AFF',
                              '&:hover': {
                                borderColor: '#6a1b9a',
                                bgcolor: '#f3e5f5'
                              }
                            }}
                            onClick={() => {
                              // Navigate to post details or open message dialog
                              toast.info('View post details functionality coming soon!');
                            }}
                          >
                            View Post
                          </Button>
                          {bid.status === 'accepted' && (
                            <Button
                              variant="contained"
                              size="small"
                              //fullWidth
                              sx={{
                                bgcolor: '#4caf50',
                                '&:hover': { bgcolor: '#388e3c' }
                              }}
                              onClick={() => {
                                toast.info('Start project functionality coming soon!');
                              }}
                            >
                              Start Project
                            </Button>
                          )}

                        </Box>
                        
                        

                       

                        {/* Bid Amount */}
                        {/* <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          bgcolor: '#f8f9fa',
                          p: 2,
                          borderRadius: 2,
                          mb: 2
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Your Bid:
                          </Typography>
                          <Typography variant="h6" sx={{ 
                            color: '#882AFF', 
                            fontWeight: 'bold' 
                          }}>
                            ₹{bid.amount.toLocaleString()}
                          </Typography>
                        </Box> */}

                        {/* Deadline */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOnIcon sx={{ color: '#666', fontSize: 16, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Deadline: {bid.deadline}
                          </Typography>
                        </Box>

                        {/* Action Buttons */}
                        {/* <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                              borderColor: '#882AFF',
                              color: '#882AFF',
                              '&:hover': {
                                borderColor: '#6a1b9a',
                                bgcolor: '#f3e5f5'
                              }
                            }}
                            onClick={() => {
                              // Navigate to post details or open message dialog
                              toast.info('View post details functionality coming soon!');
                            }}
                          >
                            View Post
                          </Button>
                          {bid.status === 'accepted' && (
                            <Button
                              variant="contained"
                              size="small"
                              fullWidth
                              sx={{
                                bgcolor: '#4caf50',
                                '&:hover': { bgcolor: '#388e3c' }
                              }}
                              onClick={() => {
                                toast.info('Start project functionality coming soon!');
                              }}
                            >
                              Start Project
                            </Button>
                          )}
                        </Box> */}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    );
  };

  // Bid Dialog
  const BidDialog = () => (
    <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#882AFF' }}>
          Submit Your Bid
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bidding for: <strong>{selectedPost?.title}</strong>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
            Bid Amount (₹) *
          </Typography>
          <TextField
            fullWidth
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="5000"
            type="number"
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#882AFF' },
                '&.Mui-focused fieldset': { borderColor: '#882AFF' }
              }
            }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
            Message (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={bidMessage}
            onChange={(e) => setBidMessage(e.target.value)}
            placeholder="Tell the brand why you're the perfect fit for this campaign..."
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#882AFF' },
                '&.Mui-focused fieldset': { borderColor: '#882AFF' }
              }
            }}
          />
        </Box>

        {selectedPost && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#f8f9ff', 
            borderRadius: 2, 
            border: '1px solid #e1e7ff',
            mt: 2
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
              Campaign Details:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Budget: <strong>{selectedPost.budget}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Deadline: <strong>{selectedPost.deadline}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platform: <strong>{selectedPost.platform}</strong>
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={() => {
            setBidDialogOpen(false);
            setBidAmount("");
            setBidMessage("");
          }} 
          disabled={loading}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleBidSubmit} 
          variant="contained"
          disabled={loading || !bidAmount}
          sx={{ 
            bgcolor: '#882AFF',
            '&:hover': { bgcolor: '#6a1b9a' },
            '&:disabled': { bgcolor: '#ccc' },
            px: 3
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Submit Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Bids View Dialog
  const BidsViewDialog = () => (
    <Dialog open={bidsViewOpen} onClose={() => setBidsViewOpen(false)} Width="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Bids for: {selectedPost?.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Budget: ₹{selectedPost?.budget?.toLocaleString()}
          </Typography>
        </Box>
      </DialogTitle>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Influencer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                                await handleBidStatusUpdate(bid.id, 'accepted');
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
                                await handleBidStatusUpdate(bid.id, 'rejected');
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
   
      <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
        <Grid container>
          <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid>
            <Grid size={{ md: 11 }}>
              {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 1,
            backgroundColor: '#091a48',
            borderRadius: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff' }}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    sx={{ mr: 2, color: '#fff' }}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                  {getHeaderTitle()}
                </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
         
          <IconButton size="large" sx={{ color: 'white' }}>
            <NotificationsIcon />
          </IconButton>
          <IconButton size="large" sx={{ color: 'white' }}>
            <AccountCircleIcon />
          </IconButton>
          </Box>
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
            </Grid>
        </Grid>
        
      </Box>
   
  );
};

export default MarketplaceModule;