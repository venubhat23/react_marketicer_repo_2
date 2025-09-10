import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PurchaseOrderAPI from '../../services/purchaseOrderApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, poId: null });

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await PurchaseOrderAPI.listPurchaseOrders();
      setPurchaseOrders(Array.isArray(response) ? response : []);
    } catch (error) {
      toast.error('Failed to fetch purchase orders');
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await PurchaseOrderAPI.deletePurchaseOrder(id);
      toast.success('Purchase order deleted successfully');
      fetchPurchaseOrders();
    } catch (error) {
      toast.error('Failed to delete purchase order');
      console.error('Error deleting purchase order:', error);
    }
    setDeleteDialog({ open: false, poId: null });
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.id?.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || po.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const paginatedPurchaseOrders = filteredPurchaseOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading purchase orders...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#091A48', fontWeight: 'bold' }}>
          Purchase Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/purchase-orders/create')}
          sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#7020CC' } }}
        >
          Create Purchase Order
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search purchase orders..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="partially paid">Partially Paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F5F5F5' }}>
              <TableRow>
                <TableCell><strong>PO ID</strong></TableCell>
                <TableCell><strong>Order Number</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPurchaseOrders.map((po) => (
                <TableRow key={po.id} hover>
                  <TableCell>#{po.id}</TableCell>
                  <TableCell>{po.order_number}</TableCell>
                  <TableCell>{po.company_name}</TableCell>
                  <TableCell>{po.customer}</TableCell>
                  <TableCell>${parseFloat(po.total_amount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={po.status || ''}
                        onChange={(e) => {
                          console.log('Status change not implemented yet for PO');
                        }}
                        displayEmpty
                      >
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/purchase-orders/${po.id}`)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/purchase-orders/edit/${po.id}`)}
                      color="secondary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, poId: po.id })}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPurchaseOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, poId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this purchase order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, poId: null })}>
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteDialog.poId)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Layout>
  );
};

export default PurchaseOrderList;