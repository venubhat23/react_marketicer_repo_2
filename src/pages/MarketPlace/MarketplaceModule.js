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

  const loadMarketplacePosts = () => {
    // Mock data - replace with actual API call
    const mockPosts = [
      {
        id: 1,
        title: "Instagram Reel for Fashion Brand",
        type: "Sponsored Post",
        status: "Published",
        dateCreated: "2024-01-15",
        views: 150,
        description: "Looking for fashion influencers to create engaging reels showcasing our new collection",
        budget: "₹10,000",
        deadline: "2024-02-01",
        category: "A",
        targetAudience: "18–24",
        location: "Mumbai",
        platform: "Instagram",
        languages: "Hindi, English",
        tags: "Fashion, Style, Trendy",
        imageUrl: "https://picsum.photos/400/300?random=1",
        brand: "StyleCo"
      },
      {
        id: 2,
        title: "Product Review - Tech Gadget",
        type: "Product Review",
        status: "Published",
        dateCreated: "2024-01-12",
        views: 89,
        description: "Need tech reviewers for our latest smartphone accessory",
        budget: "₹5,000",
        deadline: "2024-01-30",
        category: "B",
        targetAudience: "24–30",
        location: "Delhi",
        platform: "YouTube",
        languages: "English",
        tags: "Tech, Review, Gadgets",
        imageUrl: "https://picsum.photos/400/300?random=2",
        brand: "TechCorp"
      },
      {
        id: 3,
        title: "Fitness Challenge Campaign",
        type: "Brand Collaboration",
        status: "Draft",
        dateCreated: "2024-01-10",
        views: 45,
        description: "Collaborate with fitness influencers for 30-day challenge",
        budget: "₹15,000",
        deadline: "2024-02-15",
        category: "A",
        targetAudience: "30–35",
        location: "Bangalore",
        platform: "Instagram, YouTube",
        languages: "English, Kannada",
        tags: "Fitness, Health, Challenge",
        imageUrl: "https://picsum.photos/400/300?random=3",
        brand: "FitLife"
      }
    ];
    setMarketplacePosts(mockPosts);
  };

  const handleEditDirect = (post) => {
    navigate('/brand/marketplace/new', { state: { editPost: post } });
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

  const handleDeleteDirect = (post) => {
    setMarketplacePosts(marketplacePosts.filter(p => p.id !== post.id));
    toast.success("Post deleted successfully!");
  };

  const handleBidSubmit = () => {
    if (!bidAmount) {
      toast.error("Please enter bid amount!");
      return;
    }
    
    // Mock bid submission
    const newBid = {
      id: Date.now(),
      postId: selectedPost.id,
      amount: bidAmount,
      influencer: "Your Name",
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    };
    
    setBids([...bids, newBid]);
    toast.success("Bid submitted successfully!");
    setBidAmount("");
    setBidDialogOpen(false);
  };

  const handleViewBids = (post) => {
    setSelectedPost(post);
    // Load bids for this post
    const postBids = bids.filter(bid => bid.postId === post.id);
    setBids(postBids);
    setBidsViewOpen(true);
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
              {filteredPosts.length === 0 ? (
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
    const filteredPosts = getFilteredPosts().filter(post => post.status === 'Published');
    
    return (
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold', mb: 3 }}>
          Marketplace Feed
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
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
        </Box>
        
        <Grid container spacing={3}>
          {filteredPosts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.id}>
            <Card sx={{ 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt={post.title}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {post.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={post.type} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
                  <Chip label={post.category} size="small" sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                    {post.budget}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deadline: {post.deadline}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                    sx={{ 
                      flex: 1,
                      bgcolor: '#882AFF',
                      '&:hover': { bgcolor: '#6a1b9a' }
                    }}
                  >
                    Bid Now
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    By {post.brand}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.views} views
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
                  ))}
        </Grid>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleBidSubmit} 
          variant="contained"
          sx={{ 
            bgcolor: '#882AFF',
            '&:hover': { bgcolor: '#6a1b9a' }
          }}
        >
          Place Bid
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Bids View Dialog
  const BidsViewDialog = () => (
    <Dialog open={bidsViewOpen} onClose={() => setBidsViewOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>Bids for: {selectedPost?.title}</DialogTitle>
      <DialogContent>
        {bids.length === 0 ? (
          <Typography>No bids yet for this post.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Influencer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>{bid.influencer}</TableCell>
                    <TableCell>₹{bid.amount}</TableCell>
                    <TableCell>{bid.date}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          size="small" 
                          color="success"
                          onClick={() => {
                            toast.success("Bid accepted!");
                            setBidsViewOpen(false);
                          }}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="error"
                          onClick={() => {
                            toast.info("Bid rejected!");
                            setBidsViewOpen(false);
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
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