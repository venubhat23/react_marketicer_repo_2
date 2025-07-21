import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  CardMedia
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewsIcon,
  People as BidsIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../authContext/AuthContext';
import MarketplaceAPI, { handleApiError } from '../../services/marketplaceApi';
import BidManagement from './BidManagement';

const MarketplacePostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [submittingBid, setSubmittingBid] = useState(false);

  // Determine user permissions
  const isInfluencer = user?.role === 'Influencer' || user?.role === 'influencer';
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';
  const isBrand = user?.role === 'Brand' || user?.role === 'brand';
  const canManageBids = isAdmin || isBrand;
  const canBid = isInfluencer;
  const isOwner = canManageBids && post?.user_id === user?.id;

  // Fetch post details
  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await MarketplaceAPI.getMarketplacePost(id);
      if (response.success) {
        setPost(response.data);
      } else {
        toast.error('Failed to fetch post details');
        navigate('/marketplace');
      }
    } catch (error) {
      handleApiError(error);
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  // Handle bid submission
  const handleBidSubmit = async () => {
    if (!bidAmount) {
      toast.error('Please enter a bid amount');
      return;
    }

    try {
      setSubmittingBid(true);
      const response = await MarketplaceAPI.createBid({
        marketplace_post_id: parseInt(id),
        amount: parseFloat(bidAmount),
        message: bidMessage
      });

      if (response.success) {
        toast.success('Bid submitted successfully!');
        setBidDialogOpen(false);
        setBidAmount('');
        setBidMessage('');
        fetchPostDetails(); // Refresh to update bid count
      } else {
        toast.error(response.error?.message || 'Failed to submit bid');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmittingBid(false);
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      const response = await MarketplaceAPI.deleteMarketplacePost(id);
      if (response.success) {
        toast.success('Post deleted successfully');
        navigate('/marketplace');
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return <Alert severity="error">Post not found</Alert>;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#882AFF' }}>
          Marketplace Post Details
        </Typography>
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Share">
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          
          {isOwner && (
            <>
              <Tooltip title="Edit Post">
                <IconButton 
                  onClick={() => navigate(`/brand/marketplace/edit/${id}`)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Post">
                <IconButton 
                  onClick={() => setDeleteDialogOpen(true)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          
          {canBid && !post.user_has_bid && (
            <Button
              variant="contained"
              onClick={() => setBidDialogOpen(true)}
              sx={{
                bgcolor: '#882AFF',
                '&:hover': { bgcolor: '#6a1b9a' }
              }}
            >
              Submit Bid
            </Button>
          )}
          
          {canBid && post.user_has_bid && (
            <Chip
              label="Bid Submitted"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Post Details */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              {/* Media */}
              {post.media_url && (
                <CardMedia
                  component={post.media_type === 'video' ? 'video' : 'img'}
                  height="300"
                  image={post.media_url}
                  alt={post.title}
                  controls={post.media_type === 'video'}
                  sx={{ borderRadius: 2, mb: 3 }}
                />
              )}

              {/* Title and Brand */}
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {post.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                by {post.brand_name}
              </Typography>

              {/* Tags */}
              <Box sx={{ mb: 3 }}>
                {post.tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              {/* Description */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {post.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Post Details Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MoneyIcon sx={{ mr: 1, color: '#882AFF' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Budget</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        ₹{post.budget.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon sx={{ mr: 1, color: '#882AFF' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Deadline</Typography>
                      <Typography variant="body1">
                        {new Date(post.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ mr: 1, color: '#882AFF' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1">{post.location}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: '#882AFF' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Platform</Typography>
                      <Typography variant="body1">{post.platform}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ mr: 1, color: '#882AFF' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Category</Typography>
                      <Typography variant="body1">Category {post.category}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Target Audience</Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {post.target_audience}
                    </Typography>
                  </Box>
                </Grid>

                {post.languages && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LanguageIcon sx={{ mr: 1, color: '#882AFF' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">Languages</Typography>
                        <Typography variant="body1">{post.languages}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats and Actions Sidebar */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                📊 Post Statistics
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ViewsIcon sx={{ mr: 1, color: '#882AFF' }} />
                  <Typography variant="body2">Views</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {post.views_count.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BidsIcon sx={{ mr: 1, color: '#882AFF' }} />
                  <Typography variant="body2">Total Bids</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {post.bids_count}
                </Typography>
              </Box>

              {canManageBids && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Pending</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {post.pending_bids_count || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Accepted</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {post.accepted_bids_count || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Rejected</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                      {post.rejected_bids_count || 0}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Created {new Date(post.created_at).toLocaleDateString()}
              </Typography>
              {post.updated_at !== post.created_at && (
                <Typography variant="body2" color="text.secondary">
                  Updated {new Date(post.updated_at).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bid Management Section for Brands/Admins */}
      {canManageBids && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            🎯 Bid Management
          </Typography>
          <BidManagement postId={id} onBidsUpdate={fetchPostDetails} />
        </Box>
      )}

      {/* Bid Submission Dialog */}
      <Dialog open={bidDialogOpen} onClose={() => setBidDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Your Bid</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bidding for: <strong>{post?.title}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Your Bid Amount (₹)"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="5,000"
            sx={{ mb: 2 }}
            type="number"
            disabled={submittingBid}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Message (Optional)"
            value={bidMessage}
            onChange={(e) => setBidMessage(e.target.value)}
            placeholder="Tell the brand why you're the perfect fit for this collaboration..."
            disabled={submittingBid}
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
            sx={{
              bgcolor: '#882AFF',
              '&:hover': { bgcolor: '#6a1b9a' }
            }}
          >
            {submittingBid ? <CircularProgress size={20} /> : 'Submit Bid'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this marketplace post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarketplacePostDetail;