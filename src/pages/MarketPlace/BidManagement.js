import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import MarketplaceAPI, { handleApiError } from '../../services/marketplaceApi';

const BidManagement = ({ postId, onBidsUpdate }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);
  const [bidDetailOpen, setBidDetailOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Fetch bids for the post
  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await MarketplaceAPI.getMarketplacePostBids(postId);
      if (response.success) {
        setBids(response.data || []);
      } else {
        toast.error('Failed to fetch bids');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchBids();
    }
  }, [postId]);

  // Handle bid acceptance
  const handleAcceptBid = async (bidId) => {
    try {
      const response = await MarketplaceAPI.updateBidStatus(bidId, {
        status: 'accepted'
      });
      
      if (response.success) {
        toast.success('Bid accepted successfully!');
        fetchBids();
        if (onBidsUpdate) onBidsUpdate();
      } else {
        toast.error('Failed to accept bid');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle bid rejection
  const handleRejectBid = async () => {
    if (!selectedBid) return;
    
    try {
      const response = await MarketplaceAPI.updateBidStatus(selectedBid.id, {
        status: 'rejected',
        rejection_reason: rejectReason
      });
      
      if (response.success) {
        toast.success('Bid rejected');
        fetchBids();
        if (onBidsUpdate) onBidsUpdate();
        setRejectDialogOpen(false);
        setRejectReason('');
        setSelectedBid(null);
      } else {
        toast.error('Failed to reject bid');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Filter bids based on status and tab
  const getFilteredBids = () => {
    let filtered = bids;
    
    // Filter by tab
    if (tabValue === 1) filtered = filtered.filter(bid => bid.status === 'pending');
    else if (tabValue === 2) filtered = filtered.filter(bid => bid.status === 'accepted');
    else if (tabValue === 3) filtered = filtered.filter(bid => bid.status === 'rejected');
    
    // Filter by status dropdown
    if (statusFilter) {
      filtered = filtered.filter(bid => bid.status === statusFilter);
    }
    
    return filtered;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PendingIcon fontSize="small" />;
      case 'accepted': return <AcceptIcon fontSize="small" />;
      case 'rejected': return <RejectIcon fontSize="small" />;
      default: return null;
    }
  };

  const filteredBids = getFilteredBids();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label={`All Bids (${bids.length})`} />
          <Tab label={`Pending (${bids.filter(b => b.status === 'pending').length})`} />
          <Tab label={`Accepted (${bids.filter(b => b.status === 'accepted').length})`} />
          <Tab label={`Rejected (${bids.filter(b => b.status === 'rejected').length})`} />
        </Tabs>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <Alert severity="info">No bids found for this post.</Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredBids.map((bid) => (
            <Grid item xs={12} key={bid.id}>
              <Card sx={{ 
                border: bid.status === 'accepted' ? '2px solid #4caf50' : 'none',
                bgcolor: bid.status === 'accepted' ? '#f8fff8' : 'background.paper'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Avatar sx={{ bgcolor: '#882AFF' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {bid.influencer_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{bid.influencer_username} • {bid.followers_count} followers
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Submitted {new Date(bid.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#882AFF' }}>
                          ₹{bid.amount.toLocaleString()}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(bid.status)}
                          label={bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          color={getStatusColor(bid.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {bid.message && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        "{bid.message}"
                      </Typography>
                    </Box>
                  )}

                  {bid.status === 'rejected' && bid.rejection_reason && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #ffcdd2' }}>
                      <Typography variant="body2" color="error">
                        <strong>Rejection Reason:</strong> {bid.rejection_reason}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Tooltip title="View Details">
                      <IconButton 
                        onClick={() => {
                          setSelectedBid(bid);
                          setBidDetailOpen(true);
                        }}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {bid.status === 'pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<AcceptIcon />}
                          onClick={() => handleAcceptBid(bid.id)}
                          sx={{ ml: 1 }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<RejectIcon />}
                          onClick={() => {
                            setSelectedBid(bid);
                            setRejectDialogOpen(true);
                          }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Bid Detail Dialog */}
      <Dialog 
        open={bidDetailOpen} 
        onClose={() => setBidDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bid Details</DialogTitle>
        <DialogContent>
          {selectedBid && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Influencer</Typography>
                  <Typography variant="body1">{selectedBid.influencer_name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                  <Typography variant="body1">@{selectedBid.influencer_username}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Followers</Typography>
                  <Typography variant="body1">{selectedBid.followers_count.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Bid Amount</Typography>
                  <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                    ₹{selectedBid.amount.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedBid.status)}
                    label={selectedBid.status.charAt(0).toUpperCase() + selectedBid.status.slice(1)}
                    color={getStatusColor(selectedBid.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted</Typography>
                  <Typography variant="body1">
                    {new Date(selectedBid.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
                {selectedBid.message && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                    <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body1">{selectedBid.message}</Typography>
                    </Box>
                  </Grid>
                )}
                {selectedBid.status === 'rejected' && selectedBid.rejection_reason && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Rejection Reason</Typography>
                    <Box sx={{ mt: 1, p: 2, bgcolor: '#ffebee', borderRadius: 1, border: '1px solid #ffcdd2' }}>
                      <Typography variant="body1" color="error">{selectedBid.rejection_reason}</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBidDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Bid Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Bid</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to reject this bid from {selectedBid?.influencer_name}?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason (Optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejection..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectBid}
            color="error"
            variant="contained"
          >
            Reject Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BidManagement;