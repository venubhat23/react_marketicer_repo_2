import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, Button, Grid, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { bidsApi } from '../../utils/marketplaceApi';

const MyBidsView = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadMyBids();
  }, []);

  const loadMyBids = async () => {
    setLoading(true);
    try {
      const response = await bidsApi.getMyBids();
      
      if (response.data && response.data.status === 'success') {
        setBids(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading bids:', error);
      toast.error('Failed to load your bids');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBid = (bid) => {
    setSelectedBid(bid);
    setEditAmount(bid.amount.toString());
    setEditMessage(bid.message || '');
    setEditDialogOpen(true);
  };

  const handleUpdateBid = async () => {
    if (!editAmount) {
      toast.error('Please enter bid amount!');
      return;
    }

    setUpdating(true);
    try {
      const bidData = {
        amount: parseFloat(editAmount.toString().replace(/[^\d.]/g, '')),
        message: editMessage
      };

      const response = await bidsApi.updateBid(selectedBid.id, bidData);

      if (response.data && response.data.status === 'success') {
        toast.success('Bid updated successfully!');
        setEditDialogOpen(false);
        loadMyBids(); // Reload bids
      } else {
        throw new Error(response.data?.message || 'Failed to update bid');
      }
    } catch (error) {
      console.error('Error updating bid:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update bid';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to delete this bid?')) {
      return;
    }

    try {
      const response = await bidsApi.deleteBid(bidId);

      if (response.data && response.data.status === 'success') {
        toast.success('Bid deleted successfully!');
        loadMyBids(); // Reload bids
      } else {
        throw new Error(response.data?.message || 'Failed to delete bid');
      }
    } catch (error) {
      console.error('Error deleting bid:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete bid';
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ color: '#882AFF', fontWeight: 'bold', mb: 3 }}>
        My Bids
      </Typography>

      {bids.length === 0 ? (
        <Card sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" color="text.secondary">
            No bids placed yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start browsing marketplace posts to place your first bid!
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Campaign</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>My Bid</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Campaign Budget</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bids.map((bid) => (
                <TableRow key={bid.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {bid.marketplace_post?.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Deadline: {new Date(bid.marketplace_post?.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {bid.marketplace_post?.brand_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#882AFF' }}>
                      ₹{bid.amount?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      ₹{bid.marketplace_post?.budget?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bid.status} 
                      size="small" 
                      color={getStatusColor(bid.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(bid.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {bid.status === 'pending' && (
                        <>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditBid(bid)}
                            sx={{ color: '#882AFF' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteBid(bid.id)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Bid Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Your Bid</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Campaign: <strong>{selectedBid?.marketplace_post?.title}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Campaign Budget: ₹{selectedBid?.marketplace_post?.budget?.toLocaleString()}
          </Typography>
          
          <TextField
            fullWidth
            label="Your Bid Amount (₹)"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            placeholder="5,000"
            sx={{ mb: 2 }}
            type="number"
          />
          
          <TextField
            fullWidth
            label="Message (Optional)"
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            placeholder="Tell them why you're the perfect fit for this campaign..."
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} disabled={updating}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateBid} 
            variant="contained"
            disabled={updating || !editAmount}
            startIcon={updating ? <CircularProgress size={20} /> : null}
            sx={{ 
              bgcolor: '#882AFF',
              '&:hover': { bgcolor: '#6a1b9a' }
            }}
          >
            {updating ? 'Updating...' : 'Update Bid'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBidsView;