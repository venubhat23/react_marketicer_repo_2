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

const MarketplaceModule = () => {
  // User role - You can get this from your auth context
  const [userRole, setUserRole] = useState('brand'); // 'brand' or 'influencer'
  const [currentView, setCurrentView] = useState('listing'); // 'listing', 'create', 'feed'
  
  // Existing states
  const Categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Health & Beauty', 'Toys & Games'];
  const Genders = ['Male', 'Female', 'Unisex'];
  const Conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const Locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];
  const Statuses = ['Published', 'Draft', 'Pending', 'Expired'];

  // Form states are now handled in CreateMarketplacePost component

  // Listing states
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidsViewOpen, setBidsViewOpen] = useState(false);

  useEffect(() => {
    // Determine user role from localStorage or auth context
    const token = localStorage.getItem('token');
    // For demo purposes, you can set role based on some logic
    // setUserRole(/* your logic here */);
    
    // Load marketplace posts
    loadMarketplacePosts();
  }, []);

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
        category: "Fashion",
        location: "Mumbai",
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
        category: "Electronics",
        location: "Delhi",
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
        category: "Sports",
        location: "Bangalore",
        imageUrl: "https://picsum.photos/400/300?random=3",
        brand: "FitLife"
      }
    ];
    setMarketplacePosts(mockPosts);
  };

  // File upload handlers are now in CreateMarketplacePost component

  // handlePublish is now in CreateMarketplacePost component

  const handleMenuClick = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEdit = () => {
    // Set the selected post data for editing
    setCurrentView('create');
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
  };

  const handleDelete = () => {
    setMarketplacePosts(marketplacePosts.filter(post => post.id !== selectedPost.id));
    toast.success("Post deleted successfully!");
    handleMenuClose();
  };

  const handleBidSubmit = () => {
    if (!bidAmount || !bidMessage) {
      toast.error("Please fill all bid fields!");
      return;
    }
    
    // Mock bid submission
    const newBid = {
      id: Date.now(),
      postId: selectedPost.id,
      amount: bidAmount,
      message: bidMessage,
      influencer: "Your Name",
      date: new Date().toISOString().split('T')[0],
      status: "pending"
    };
    
    setBids([...bids, newBid]);
    toast.success("Bid submitted successfully!");
    setBidAmount("");
    setBidMessage("");
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
          onClick={() => {
            setSelectedPost(null); // Clear selected post for new post creation
            setCurrentView('create');
          }}
        >
          Create New Post
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
        {marketplacePosts.map((post) => (
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
          label="Your Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="₹5,000"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Message to Brand"
          value={bidMessage}
          onChange={(e) => setBidMessage(e.target.value)}
          multiline
          rows={4}
          placeholder="Tell them why you're the perfect fit for this campaign..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setBidDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleBidSubmit} variant="contained">
                  Submit Bid
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
                  <TableCell>Influencer</TableCell>
                  <TableCell>Bid Amount</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>{bid.influencer}</TableCell>
                    <TableCell>{bid.amount}</TableCell>
                    <TableCell>{bid.message}</TableCell>
                    <TableCell>{bid.date}</TableCell>
                    <TableCell>
                      <Chip label={bid.status} size="small" color="warning" />
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

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: '#091a48',
            borderRadius: 0
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Marketplace {userRole === 'brand' ? '- Brand Dashboard' : '- Influencer Feed'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={userRole === 'brand' ? 'contained' : 'outlined'}
                onClick={() => setUserRole('brand')}
                sx={{ 
                  color: userRole === 'brand' ? '#000' : '#fff',
                  bgcolor: userRole === 'brand' ? '#fff' : 'transparent',
                  borderColor: '#fff'
                }}
              >
                Brand View
              </Button>
              <Button
                variant={userRole === 'influencer' ? 'contained' : 'outlined'}
                onClick={() => setUserRole('influencer')}
                sx={{ 
                  color: userRole === 'influencer' ? '#000' : '#fff',
                  bgcolor: userRole === 'influencer' ? '#fff' : 'transparent',
                  borderColor: '#fff'
                }}
              >
                Influencer View
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        {userRole === 'brand' ? (
          currentView === 'listing' ? <BrandListingView /> : 
          <CreateMarketplacePost 
            onBack={() => setCurrentView('listing')} 
            onPostCreated={handlePostCreated}
            initialData={selectedPost}
          />
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