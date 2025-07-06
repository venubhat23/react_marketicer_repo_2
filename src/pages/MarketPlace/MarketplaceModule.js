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
import Sidebar from "../../components/Sidebar";

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

  // Form states
  const [postContent, setPostContent] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [posting, setPosting] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  // Marketplace specific states
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [requirements, setRequirements] = useState("");

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
    setEditorLoaded(true);
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

  // File upload handlers
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleVideoBoxClick = () => {
    videoInputRef.current.click();
  };

  const handleFileUpload = async (file, type = 'image') => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(
        "https://kitintellect.tech/storage/public/api/upload/aaFacebook",
        {
          method: "POST",
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.url) {
        if (type === 'image') {
          setUploadedImageUrl(data.url);
        } else {
          setUploadedVideoUrl(data.url);
        }
        toast.success(`${type} uploaded successfully!`);
      }
    } catch (error) {
      toast.error(`${type} upload failed!`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadedFileName(selectedFile.name);
      handleFileUpload(selectedFile, 'image');
    }
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile, 'video');
    }
  };

  const handlePublish = async () => {
    if (!title || !postContent || !category || !type || !budget || !deadline) {
      toast.error("Please fill all required fields!");
      return;
    }
    
    setPosting(true);
    const stripHtmlTags = (content) => content.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      title,
      description: stripHtmlTags(postContent),
      category,
      type,
      budget,
      deadline,
      requirements: stripHtmlTags(requirements),
      gender,
      condition,
      location,
      price: parseFloat(price) || 0,
      image_url: uploadedImageUrl,
      video_url: uploadedVideoUrl,
      status: "published"
    };
    
    try {
      // Replace with actual API call
      console.log('Publishing marketplace post:', payloadData);
      
      // Mock success - add to local state
      const newPost = {
        id: Date.now(),
        ...payloadData,
        dateCreated: new Date().toISOString().split('T')[0],
        views: 0,
        brand: "Your Brand"
      };
      
      setMarketplacePosts([newPost, ...marketplacePosts]);
      
      toast.success("Post published successfully!");
      
      // Clear form and go back to listing
      setTitle("");
      setPostContent("");
      setCategory("");
      setType("");
      setBudget("");
      setDeadline("");
      setRequirements("");
      setGender("");
      setCondition("");
      setLocation("");
      setPrice("");
      setUploadedImageUrl("");
      setUploadedVideoUrl("");
      setUploadedFileName("");
      
      setCurrentView('listing');
    } catch (error) {
      console.error("Error publishing post:", error);
      toast.error("Failed to publish post");
    } finally {
      setPosting(false);
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
    // Populate form with selected post data
    setTitle(selectedPost.title);
    setPostContent(selectedPost.description);
    setCategory(selectedPost.category);
    setType(selectedPost.type);
    setBudget(selectedPost.budget);
    setLocation(selectedPost.location);
    setUploadedImageUrl(selectedPost.imageUrl);
    setCurrentView('create');
    handleMenuClose();
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
          onClick={() => setCurrentView('create')}
          sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#6a1b9a' } }}
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

  // Create Post View
  const CreatePostView = () => (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => setCurrentView('listing')}
          sx={{ mr: 2, color: '#882AFF' }}
        >
          <ArrowLeftIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
          Create New Post
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#882AFF' }}>
              Post Details
            </Typography>
            
            <TextField
              fullWidth
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type *</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Type *"
                  >
                    {Types.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category *"
                  >
                    {Categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Budget *"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="₹10,000"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Deadline *"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender Target</InputLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    label="Gender Target"
                  >
                    {Genders.map((g) => (
                      <MenuItem key={g} value={g}>{g}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    label="Location"
                  >
                    {Locations.map((loc) => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Description *
            </Typography>
            <Box sx={{ mb: 2, minHeight: 200 }}>
              <Editor value={postContent} onChange={setPostContent} />
            </Box>
            
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Requirements
            </Typography>
            <Box sx={{ mb: 2, minHeight: 150 }}>
              <Editor value={requirements} onChange={setRequirements} />
            </Box>
            
            {/* Upload Section */}
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#882AFF' }}>
              Upload Media
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Box
                  onClick={handleBoxClick}
                  sx={{
                    border: '2px dashed #882AFF',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3e5f5' }
                  }}
                >
                  <Typography>+ Upload Image</Typography>
                  {uploadedImageUrl && (
                    <Avatar src={uploadedImageUrl} sx={{ width: 60, height: 60, mx: 'auto', mt: 1 }} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  onClick={handleVideoBoxClick}
                  sx={{
                    border: '2px dashed #882AFF',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f3e5f5' }
                  }}
                >
                  <Typography>+ Upload Video</Typography>
                  {uploadedVideoUrl && (
                    <Typography variant="caption" sx={{ color: 'green', mt: 1 }}>
                      Video uploaded successfully
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*"
            />
            
            <input
              type="file"
              ref={videoInputRef}
              onChange={handleVideoChange}
              style={{ display: 'none' }}
              accept="video/*"
            />
            
            <Button
              variant="contained"
              fullWidth
              onClick={handlePublish}
              disabled={posting || uploading}
              sx={{ 
                mt: 2,
                bgcolor: '#882AFF',
                py: 1.5,
                '&:hover': { bgcolor: '#6a1b9a' }
              }}
            >
              {posting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </Paper>
        </Grid>
        
        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#882AFF' }}>
              Preview
            </Typography>
            <Card sx={{ borderRadius: 2 }}>
              {uploadedImageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={uploadedImageUrl}
                  alt="Preview"
                />
              )}
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {title || 'Post Title'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {postContent.replace(/<[^>]*>/g, '') || 'Post description will appear here...'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {type && <Chip label={type} size="small" />}
                  {category && <Chip label={category} size="small" />}
                </Box>
                <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                  {budget || 'Budget not set'}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
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
        <Button onClick={handleBidSubmit} variant="contained" sx={{ bgcolor: '#882AFF' }}>
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
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid item xs={12} md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={10}>
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
            currentView === 'listing' ? <BrandListingView /> : <CreatePostView />
          ) : (
            <InfluencerFeedView />
          )}
        </Grid>
      </Grid>

      {/* Dialogs */}
      <BidDialog />
      <BidsViewDialog />
    </Box>
  );
};

export default MarketplaceModule;