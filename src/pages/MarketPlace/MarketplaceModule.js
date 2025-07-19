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
import { useAuth } from "../../authContext/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const MarketplaceModule = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine user role and current view from route
  const isInfluencer = user?.role === 'influencer';
  const isBrand = user?.role === 'admin' || user?.role === 'brand';
  
  // Determine current view based on route
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/brand/marketplace/new')) return 'create';
    if (path.includes('/brand/marketplace')) return 'listing';
    if (path.includes('/influencer/marketplace')) return 'feed';
    return isInfluencer ? 'feed' : 'listing';
  };

  const [currentView, setCurrentView] = useState(getCurrentView());
  
  // Existing states
  const Categories = ['A', 'B']; // Updated as per specification
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35']; // Updated as per specification
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];
  const Statuses = ['Published', 'Draft', 'Pending', 'Expired'];

  // Listing states
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidsViewOpen, setBidsViewOpen] = useState(false);

  useEffect(() => {
    // Update view when route changes
    setCurrentView(getCurrentView());
    loadMarketplacePosts();
  }, [location.pathname]);

  // Redirect based on user role
  useEffect(() => {
    if (location.pathname === '/marketplace') {
      if (isInfluencer) {
        navigate('/influencer/marketplace', { replace: true });
      } else if (isBrand) {
        navigate('/brand/marketplace', { replace: true });
      }
    }
  }, [user, location.pathname, navigate, isInfluencer, isBrand]);

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

  const handleDelete = () => {
    setMarketplacePosts(marketplacePosts.filter(post => post.id !== selectedPost.id));
    toast.success("Post deleted successfully!");
    handleMenuClose();
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

      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                    color={post.status === 'Published' ? 'success' : post.status === 'Draft' ? 'warning' : 'default'}
                  />
                </TableCell>
                <TableCell>{post.dateCreated}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VisibilityIcon fontSize="small" color="action" />
                    {post.views}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleViewBids(post)}
                    sx={{ color: '#882AFF', borderColor: '#882AFF' }}
                  >
                    View Bids
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
  const InfluencerFeedView = () => (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold', mb: 3 }}>
        Marketplace Feed
      </Typography>
      
      <Grid container spacing={3}>
        {marketplacePosts.filter(post => post.status === 'Published').map((post) => (
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
  if (!user || (!isInfluencer && !isBrand)) {
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
            {isBrand ? 'Brand Marketplace' : 'Influencer Marketplace'}
          </Typography>
        </Paper>

        {/* Main Content */}
        {isBrand ? (
          currentView === 'create' ? (
            <CreateMarketplacePost 
              onBack={() => navigate('/brand/marketplace')} 
              onPostCreated={handlePostCreated}
              initialData={location.state?.editPost}
            />
          ) : (
            <BrandListingView />
          )
        ) : (
          <InfluencerFeedView />
        )}

        {/* Dialogs */}
        <BidDialog />
        <BidsViewDialog />
      </Box>
    </Layout>
  );
};

export default MarketplaceModule;