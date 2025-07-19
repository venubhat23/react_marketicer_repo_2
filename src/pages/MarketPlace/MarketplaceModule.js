import React, { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Button, TextField, Avatar, Chip, Select, MenuItem, IconButton, Card, FormControl,
  Tab, Tabs, Checkbox, Grid, Modal, Paper, AppBar, Toolbar, Container, InputLabel, ListItemText,
  CardContent, Autocomplete, CardActions, CardMedia, Divider, Stack, ListItemIcon, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, Badge, Dialog, DialogTitle, DialogContent, DialogActions
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
import { marketplaceApi, bidsApi } from "../../utils/marketplaceApi";

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

  // Listing states
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidsViewOpen, setBidsViewOpen] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0
  });
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTargetAudience, setSelectedTargetAudience] = useState("");
  
  // Influencer tab state
  const [influencerTab, setInfluencerTab] = useState(0); // 0: Feed, 1: My Bids

  useEffect(() => {
    // Update view when route changes
    setCurrentView(getCurrentView());
    setCurrentMode(getCurrentMode());
  }, [location.pathname]);

  useEffect(() => {
    // Load marketplace posts when component mounts or mode changes
    loadMarketplacePosts();
  }, [currentMode]);

  // Debounced search effect
  useEffect(() => {
    if (currentMode === 'influencer' && influencerTab === 0) {
      const timeoutId = setTimeout(() => {
        loadMarketplacePosts(1, { 
          category: selectedCategory, 
          target_audience: selectedTargetAudience 
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, currentMode, influencerTab]);

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

  const loadMarketplacePosts = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      let response;
      
      if (currentMode === 'influencer') {
        // Load marketplace feed for influencers
        const params = {
          page,
          per_page: pagination.per_page,
          ...filters
        };
        
        if (searchQuery) {
          // Use search endpoint if there's a search query
          response = await marketplaceApi.searchMarketplacePosts({
            q: searchQuery,
            ...params
          });
        } else {
          // Use regular feed endpoint
          response = await marketplaceApi.getMarketplaceFeed(params);
        }
      } else {
        // Load my posts for brands/admin
        response = await marketplaceApi.getMyMarketplacePosts();
      }
      
      if (response.data && response.data.status === 'success') {
        setMarketplacePosts(response.data.data || []);
        
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error("Error loading marketplace posts:", error);
      toast.error("Failed to load marketplace posts");
      
      // Fallback to empty array on error
      setMarketplacePosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEdit = () => {
    navigate('/brand/marketplace/new', { state: { editPost: selectedPost } });
    handleMenuClose();
  };

  const handlePostCreated = (newPost) => {
    if (selectedPost) {
      // Update existing post
      setMarketplacePosts(marketplacePosts.map(post => 
        post.id === selectedPost.id ? newPost : post
      ));
      setSelectedPost(null);
    } else {
      // Add new post
      setMarketplacePosts([newPost, ...marketplacePosts]);
    }
    navigate('/brand/marketplace');
  };

  const handleDelete = async () => {
    if (!selectedPost?.id) {
      toast.error("No post selected!");
      return;
    }
    
    try {
      const response = await marketplaceApi.deleteMarketplacePost(selectedPost.id);
      
      if (response.data && response.data.status === 'success') {
        setMarketplacePosts(marketplacePosts.filter(post => post.id !== selectedPost.id));
        toast.success(response.data.message || "Post deleted successfully!");
      } else {
        throw new Error(response.data?.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete post";
      toast.error(errorMessage);
    } finally {
      handleMenuClose();
    }
  };

  const handleBidSubmit = async () => {
    if (!bidAmount) {
      toast.error("Please enter bid amount!");
      return;
    }
    
    if (!selectedPost?.id) {
      toast.error("No post selected!");
      return;
    }
    
    setSubmittingBid(true);
    try {
      const bidData = {
        amount: parseFloat(bidAmount.toString().replace(/[^\d.]/g, '')),
        message: bidMessage || ""
      };
      
      const response = await bidsApi.createBid(selectedPost.id, bidData);
      
      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message || "Bid submitted successfully!");
        setBidAmount("");
        setBidMessage("");
        setBidDialogOpen(false);
        
        // Reload marketplace posts to update bid counts
        loadMarketplacePosts();
      } else {
        throw new Error(response.data?.message || 'Failed to submit bid');
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to submit bid";
      toast.error(errorMessage);
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleViewBids = async (post) => {
    setSelectedPost(post);
    setLoading(true);
    try {
      const response = await bidsApi.getBidsForPost(post.id);
      
      if (response.data && response.data.status === 'success') {
        setBids(response.data.data.bids || []);
      } else {
        setBids([]);
      }
    } catch (error) {
      console.error("Error loading bids:", error);
      toast.error("Failed to load bids");
      setBids([]);
    } finally {
      setLoading(false);
    }
    setBidsViewOpen(true);
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
  const BrandListingView = () => (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
          My Marketplace Posts
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/brand/marketplace/new')}
          sx={{ 
            bgcolor: '#882AFF',
            '&:hover': { bgcolor: '#6a1b9a' }
          }}
        >
          + Create New Post
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Budget</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Views</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bids</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marketplacePosts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={post.media_url} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.platform} • {post.location}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={post.category} 
                      size="small" 
                      sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={post.status} 
                      size="small" 
                      color={post.status === 'published' ? 'success' : post.status === 'draft' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#882AFF' }}>
                      ₹{post.budget?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VisibilityIcon fontSize="small" color="action" />
                      <Typography variant="body2">{post.views_count || 0}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleViewBids(post)}
                      sx={{ color: '#882AFF', borderColor: '#882AFF' }}
                    >
                      View Bids ({post.bids_count || 0})
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={(e) => handleMenuClick(e, post)}
                      sx={{ color: '#882AFF' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );

  // Influencer Feed View
  const InfluencerFeedView = () => {
    return (
      <Box sx={{ padding: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
            Marketplace
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs 
          value={influencerTab} 
          onChange={(e, newValue) => setInfluencerTab(newValue)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Browse Opportunities" />
          <Tab label="My Bids" />
        </Tabs>

        {/* Tab Content */}
        {influencerTab === 0 ? (
          <Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {Categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Target Audience</InputLabel>
          <Select
            value={selectedTargetAudience}
            onChange={(e) => setSelectedTargetAudience(e.target.value)}
            label="Target Audience"
          >
            <MenuItem value="">All</MenuItem>
            {TargetAudiences.map(audience => (
              <MenuItem key={audience} value={audience}>{audience}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          variant="contained" 
          onClick={() => loadMarketplacePosts(1, { 
            category: selectedCategory, 
            target_audience: selectedTargetAudience 
          })}
          sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#6a1b9a' } }}
        >
          Apply Filters
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1,2,3,4,5,6].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card sx={{ borderRadius: 2 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={32} />
                    <Skeleton variant="rectangular" width={80} height={32} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {marketplacePosts.map((post) => (
                      <Grid item xs={12} md={6} lg={4} key={post.id}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
            }}>
              {post.media_url && (
                <CardMedia
                  component={post.media_type === 'video' ? 'video' : 'img'}
                  height="200"
                  image={post.media_url}
                  src={post.media_url}
                  alt={post.title}
                  controls={post.media_type === 'video'}
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={post.category} size="small" sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }} />
                  <Chip label={post.target_audience} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
                  <Chip label={post.platform} size="small" sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                    ₹{post.budget?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {new Date(post.deadline).toLocaleDateString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.location}
                  </Typography>
                </Box>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Tags:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {post.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<ChatBubbleOutlineIcon />}
                    sx={{ 
                      flex: 1,
                      borderColor: '#882AFF',
                      color: '#882AFF',
                      '&:hover': { borderColor: '#6a1b9a', bgcolor: '#f3e5f5' }
                    }}
                  >
                    Message
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => {
                      setSelectedPost(post);
                      setBidDialogOpen(true);
                    }}
                    disabled={post.user_has_bid}
                    sx={{ 
                      flex: 1,
                      bgcolor: post.user_has_bid ? '#ccc' : '#882AFF',
                      '&:hover': { bgcolor: post.user_has_bid ? '#ccc' : '#6a1b9a' }
                    }}
                  >
                    {post.user_has_bid ? 'Bid Placed' : 'Bid Now'}
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    By {post.brand_name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {post.views_count} views
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.bids_count} bids
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.total_count > pagination.per_page && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button 
            disabled={pagination.current_page === 1}
            onClick={() => loadMarketplacePosts(pagination.current_page - 1)}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {pagination.current_page} of {Math.ceil(pagination.total_count / pagination.per_page)}
          </Typography>
          <Button 
            disabled={pagination.current_page >= Math.ceil(pagination.total_count / pagination.per_page)}
            onClick={() => loadMarketplacePosts(pagination.current_page + 1)}
            sx={{ ml: 1 }}
          >
            Next
          </Button>
        </Box>
      )}
          </Box>
        ) : (
          <MyBidsView />
        )}
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Budget: ₹{selectedPost?.budget?.toLocaleString()}
        </Typography>
        
        <TextField
          fullWidth
          label="Your Bid Amount (₹)"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="5,000"
          sx={{ mb: 2 }}
          type="number"
        />
        
        <TextField
          fullWidth
          label="Message (Optional)"
          value={bidMessage}
          onChange={(e) => setBidMessage(e.target.value)}
          placeholder="Tell them why you're the perfect fit for this campaign..."
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBidDialogOpen(false)} disabled={submittingBid}>
          Cancel
        </Button>
        <Button 
          onClick={handleBidSubmit} 
          variant="contained"
          disabled={submittingBid || !bidAmount}
          startIcon={submittingBid ? <CircularProgress size={20} /> : null}
          sx={{ 
            bgcolor: '#882AFF',
            '&:hover': { bgcolor: '#6a1b9a' }
          }}
        >
          {submittingBid ? 'Placing Bid...' : 'Place Bid'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Bids View Dialog
  const BidsViewDialog = () => (
    <Dialog open={bidsViewOpen} onClose={() => setBidsViewOpen(false)} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Bids for: {selectedPost?.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Budget: ₹{selectedPost?.budget?.toLocaleString()}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {bid.influencer_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bid.influencer_email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#882AFF' }}>
                        ₹{bid.amount?.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {bid.message || 'No message provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={bid.status} 
                        size="small" 
                        color={
                          bid.status === 'accepted' ? 'success' : 
                          bid.status === 'rejected' ? 'error' : 
                          'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(bid.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {bid.status === 'pending' ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            color="success"
                            onClick={() => handleAcceptBid(bid.id)}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            color="error"
                            onClick={() => handleRejectBid(bid.id)}
                          >
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {bid.status === 'accepted' ? 'Accepted' : 'Rejected'}
                        </Typography>
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
            borderRadius: 0
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff' }}>
            {getHeaderTitle()}
          </Typography>
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