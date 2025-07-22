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
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Link,
  Stack,
  ListItemIcon
} from '@mui/material';
import {
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Schedule as PendingIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  TrendingUp as EngagementIcon,
  People as FollowersIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import MarketplaceAPI, { handleApiError } from '../../services/marketplaceApi';

const BidManagement = ({ postId, onBidsUpdate }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [bidDetailOpen, setBidDetailOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState(null);
  
  // Fetch bids for the post
  const fetchBids = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await MarketplaceAPI.getMarketplacePostBids(postId, {
        status: statusFilter,
        page: 1,
        limit: 50 // Load more bids for management
      });
      
      if (response.success) {
        const transformedBids = (response.data?.bids || []).map(bid => ({
          id: bid.id,
          amount: typeof bid.amount === 'string' ? bid.amount : `₹${bid.amount || 0}`,
          message: bid.message || '',
          status: bid.status || 'pending',
          portfolio_links: bid.portfolio_links || [],
          created_at: bid.created_at,
          updated_at: bid.updated_at,
          influencer: {
            id: bid.influencer?.id,
            name: bid.influencer?.name || 'Unknown Influencer',
            email: bid.influencer?.email || '',
            avatar: bid.influencer?.avatar || '',
            followers_count: bid.influencer?.followers_count || 0,
            engagement_rate: bid.influencer?.engagement_rate || 0,
            social_profiles: bid.influencer?.social_profiles || {}
          }
        }));
        
        setBids(transformedBids);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch bids');
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError(handleApiError(error));
      setBids([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [postId, statusFilter]);

  // Handle bid acceptance
  const handleAcceptBid = async () => {
    if (!selectedBid) return;
    
    try {
      setActionLoading(true);
      const response = await MarketplaceAPI.updateBidStatus(selectedBid.id, {
        status: 'accepted',
        message: responseMessage
      });
      
      if (response.success) {
        toast.success(response.message || 'Bid accepted successfully!');
        setAcceptDialogOpen(false);
        setResponseMessage('');
        setSelectedBid(null);
        fetchBids();
        if (onBidsUpdate) onBidsUpdate();
      } else {
        throw new Error(response.error?.message || 'Failed to accept bid');
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
      toast.error(handleApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  // Handle bid rejection
  const handleRejectBid = async () => {
    if (!selectedBid) return;
    
    try {
      setActionLoading(true);
      const response = await MarketplaceAPI.updateBidStatus(selectedBid.id, {
        status: 'rejected',
        message: responseMessage || 'Thank you for your interest. We have decided to go with another influencer.'
      });
      
      if (response.success) {
        toast.success(response.message || 'Bid rejected successfully!');
        setRejectDialogOpen(false);
        setResponseMessage('');
        setSelectedBid(null);
        fetchBids();
        if (onBidsUpdate) onBidsUpdate();
      } else {
        throw new Error(response.error?.message || 'Failed to reject bid');
      }
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast.error(handleApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <AcceptIcon />;
      case 'rejected':
        return <RejectIcon />;
      case 'pending':
      default:
        return <PendingIcon />;
    }
  };

  // Filter bids by status
  const filteredBids = bids.filter(bid => {
    if (tabValue === 0) return bid.status === 'pending';
    if (tabValue === 1) return bid.status === 'accepted';
    if (tabValue === 2) return bid.status === 'rejected';
    return true;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openBidDetail = (bid) => {
    setSelectedBid(bid);
    setBidDetailOpen(true);
  };

  const openAcceptDialog = (bid) => {
    setSelectedBid(bid);
    setAcceptDialogOpen(true);
  };

  const openRejectDialog = (bid) => {
    setSelectedBid(bid);
    setRejectDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={fetchBids} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#882AFF' }}>
        Bid Management ({bids.length} bids)
      </Typography>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label={`Pending (${bids.filter(b => b.status === 'pending').length})`} 
            icon={<PendingIcon />} 
          />
          <Tab 
            label={`Accepted (${bids.filter(b => b.status === 'accepted').length})`} 
            icon={<AcceptIcon />} 
          />
          <Tab 
            label={`Rejected (${bids.filter(b => b.status === 'rejected').length})`} 
            icon={<RejectIcon />} 
          />
        </Tabs>
      </Box>

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <Alert severity="info">
          No {tabValue === 0 ? 'pending' : tabValue === 1 ? 'accepted' : 'rejected'} bids found.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredBids.map((bid) => (
            <Grid item xs={12} key={bid.id}>
              <Card sx={{ 
                border: `2px solid ${bid.status === 'accepted' ? '#4caf50' : bid.status === 'rejected' ? '#f44336' : '#ff9800'}`,
                borderRadius: 2 
              }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Influencer Info */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={bid.influencer.avatar} 
                          sx={{ width: 50, height: 50 }}
                        >
                          {bid.influencer.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {bid.influencer.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {bid.influencer.email}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            {bid.influencer.followers_count > 0 && (
                              <Chip 
                                size="small" 
                                icon={<FollowersIcon />} 
                                label={`${(bid.influencer.followers_count / 1000).toFixed(1)}K`}
                              />
                            )}
                            {bid.influencer.engagement_rate > 0 && (
                              <Chip 
                                size="small" 
                                icon={<EngagementIcon />} 
                                label={`${bid.influencer.engagement_rate}%`}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Bid Details */}
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 'bold', 
                          color: '#4caf50',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <MoneyIcon />
                          {bid.amount}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, maxHeight: 60, overflow: 'hidden' }}>
                          {bid.message || 'No message provided'}
                        </Typography>
                        {bid.portfolio_links && bid.portfolio_links.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Portfolio Links:
                            </Typography>
                            {bid.portfolio_links.slice(0, 2).map((link, index) => (
                              <Link 
                                key={index}
                                href={link} 
                                target="_blank" 
                                sx={{ display: 'block', fontSize: '0.75rem' }}
                              >
                                {link}
                              </Link>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    {/* Status & Actions */}
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip
                          icon={getStatusIcon(bid.status)}
                          label={bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          color={getStatusColor(bid.status)}
                          variant="filled"
                        />
                        
                        <Typography variant="caption" color="text.secondary">
                          {new Date(bid.created_at).toLocaleDateString()}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => openBidDetail(bid)}
                              sx={{ bgcolor: '#e3f2fd' }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {bid.status === 'pending' && (
                            <>
                              <Tooltip title="Accept Bid">
                                <IconButton 
                                  size="small" 
                                  onClick={() => openAcceptDialog(bid)}
                                  sx={{ bgcolor: '#e8f5e8' }}
                                >
                                  <AcceptIcon />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Reject Bid">
                                <IconButton 
                                  size="small" 
                                  onClick={() => openRejectDialog(bid)}
                                  sx={{ bgcolor: '#ffebee' }}
                                >
                                  <RejectIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
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
        <DialogTitle>
          Bid Details - {selectedBid?.influencer.name}
        </DialogTitle>
        <DialogContent>
          {selectedBid && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Influencer Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar 
                      src={selectedBid.influencer.avatar} 
                      sx={{ width: 60, height: 60 }}
                    >
                      {selectedBid.influencer.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedBid.influencer.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedBid.influencer.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {(selectedBid.influencer.followers_count > 0 || selectedBid.influencer.engagement_rate > 0) && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Statistics</Typography>
                      <Stack direction="row" spacing={1}>
                        {selectedBid.influencer.followers_count > 0 && (
                          <Chip 
                            icon={<FollowersIcon />} 
                            label={`${selectedBid.influencer.followers_count.toLocaleString()} followers`}
                          />
                        )}
                        {selectedBid.influencer.engagement_rate > 0 && (
                          <Chip 
                            icon={<EngagementIcon />} 
                            label={`${selectedBid.influencer.engagement_rate}% engagement`}
                          />
                        )}
                      </Stack>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Bid Information</Typography>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>
                    {selectedBid.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status: <Chip 
                      size="small" 
                      label={selectedBid.status} 
                      color={getStatusColor(selectedBid.status)} 
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Submitted: {new Date(selectedBid.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Message</Typography>
                  <Typography variant="body1" sx={{ 
                    bgcolor: '#f5f5f5', 
                    p: 2, 
                    borderRadius: 1,
                    minHeight: 60
                  }}>
                    {selectedBid.message || 'No message provided'}
                  </Typography>
                </Grid>
                
                {selectedBid.portfolio_links && selectedBid.portfolio_links.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Portfolio Links</Typography>
                    <List>
                      {selectedBid.portfolio_links.map((link, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LinkIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <Link href={link} target="_blank" rel="noopener">
                              {link}
                            </Link>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selectedBid?.status === 'pending' && (
            <>
              <Button 
                onClick={() => {
                  setBidDetailOpen(false);
                  openAcceptDialog(selectedBid);
                }}
                color="success" 
                variant="contained"
              >
                Accept Bid
              </Button>
              <Button 
                onClick={() => {
                  setBidDetailOpen(false);
                  openRejectDialog(selectedBid);
                }}
                color="error" 
                variant="outlined"
              >
                Reject Bid
              </Button>
            </>
          )}
          <Button onClick={() => setBidDetailOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Accept Bid Dialog */}
      <Dialog open={acceptDialogOpen} onClose={() => setAcceptDialogOpen(false)}>
        <DialogTitle>Accept Bid</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to accept the bid from {selectedBid?.influencer.name} for {selectedBid?.amount}?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Response Message (Optional)"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Thank you for your proposal. We're excited to work with you!"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAcceptBid} 
            color="success" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Accept Bid'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Bid Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Bid</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to reject the bid from {selectedBid?.influencer.name}?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason (Optional)"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            placeholder="Thank you for your interest. We have decided to go with another influencer."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRejectBid} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Reject Bid'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BidManagement;