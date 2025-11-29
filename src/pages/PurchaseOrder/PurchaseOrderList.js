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
  TablePagination,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  ArrowBack as ArrowLeftIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import PurchaseOrderAPI from '../../services/purchaseOrderApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, poId: null });
  const [emailDialog, setEmailDialog] = useState({ 
    open: false, 
    purchaseOrder: null,
    email: '',
    subject: '',
    message: '',
    sending: false 
  });

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

  const handleOpenEmailDialog = (purchaseOrder) => {
    setEmailDialog({
      open: true,
      purchaseOrder: purchaseOrder,
      email: purchaseOrder.work_email || '',
      subject: `Purchase Order #${purchaseOrder.order_number || purchaseOrder.id} from ${purchaseOrder.company_name || 'Your Company'}`,
      message: `Dear ${purchaseOrder.customer || 'Customer'},\n\nPlease find attached your purchase order #${purchaseOrder.order_number || purchaseOrder.id}.\n\nPurchase Order Details:\n- Amount: ₹${parseFloat(purchaseOrder.total_amount || 0).toFixed(2)}\n- Status: ${purchaseOrder.status}\n\nThank you for your business!\n\nBest regards,\n${purchaseOrder.company_name || 'Your Company'}`,
      sending: false
    });
  };

  const handleCloseEmailDialog = () => {
    setEmailDialog({
      open: false,
      purchaseOrder: null,
      email: '',
      subject: '',
      message: '',
      sending: false
    });
  };

  const handleSendEmail = async () => {
    if (!emailDialog.email || !emailDialog.subject) {
      toast.error('Please fill in email and subject fields');
      return;
    }

    setEmailDialog(prev => ({ ...prev, sending: true }));

    try {
      // Fallback to mailto link since API endpoint may not exist yet
      const mailtoLink = `mailto:${emailDialog.email}?subject=${encodeURIComponent(emailDialog.subject)}&body=${encodeURIComponent(emailDialog.message)}`;
      window.open(mailtoLink, '_blank');
      
      toast.success('Opened email client to send purchase order!');
      handleCloseEmailDialog();
    } catch (error) {
      console.error('Error opening email client:', error);
      toast.error('Failed to open email client');
    } finally {
      setEmailDialog(prev => ({ ...prev, sending: false }));
    }
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
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section"> <Sidebar /></Grid>
        <Grid size={{ md: 11 }}>
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#091a48',
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#fff' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                Purchase Orders
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/purchase-orders/create')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    lineHeight:0,
                  }}
                >
                  Create Purchase Order
                </Button>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>

                <Link to="/SettingPage">
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Paper>
          <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2, // spacing between items
            alignItems: 'center',bgcolor: '#B1C6FF',padding: '10px',
          }}>
              <TextField
              fullWidth
              size='small'
              label="Search purchase orders..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              />

            <FormControl fullWidth>
              <Select
              value={statusFilter}
              label="Status"
              size="small"
              onChange={(e) => setStatusFilter(e.target.value)}
              renderValue={(selected) =>
                selected !== '' ? selected : <Typography color="#882AFF">Status</Typography>
                }
              sx={{
                borderRadius: 10,
              }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="partially paid">Partially Paid</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: { xs: 8, md: 0 }, padding:'20px', minHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 12 }}>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#091a48' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>PO ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Order Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPurchaseOrders.map((po) => (
                <TableRow key={po.id} hover>
                  <TableCell>#{po.id}</TableCell>
                  <TableCell>{po.order_number}</TableCell>
                  <TableCell>{po.company_name}</TableCell>
                  <TableCell>{po.customer}</TableCell>
                  <TableCell>₹{parseFloat(po.total_amount || 0).toFixed(2)}</TableCell>
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
                      title="Edit Purchase Order"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenEmailDialog(po)}
                      sx={{ color: '#882AFF' }}
                      size="small"
                      title="Send Email"
                    >
                      <EmailIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, poId: po.id })}
                      color="error"
                      size="small"
                      title="Delete Purchase Order"
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

              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
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

      {/* Email Purchase Order Dialog */}
      <Dialog
        open={emailDialog.open}
        onClose={handleCloseEmailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#091a48', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <EmailIcon />
          Send Purchase Order Email
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Purchase Order: #{emailDialog.purchaseOrder?.order_number || emailDialog.purchaseOrder?.id} - {emailDialog.purchaseOrder?.customer}
            </Typography>
          </Box>
          
          <TextField
            fullWidth
            label="Recipient Email"
            type="email"
            value={emailDialog.email}
            onChange={(e) => setEmailDialog(prev => ({ ...prev, email: e.target.value }))}
            margin="normal"
            required
            helperText="Customer's email address"
          />
          
          <TextField
            fullWidth
            label="Subject"
            value={emailDialog.subject}
            onChange={(e) => setEmailDialog(prev => ({ ...prev, subject: e.target.value }))}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={8}
            value={emailDialog.message}
            onChange={(e) => setEmailDialog(prev => ({ ...prev, message: e.target.value }))}
            margin="normal"
            helperText="Email body content (purchase order will be attached as PDF)"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEmailDialog} disabled={emailDialog.sending}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendEmail} 
            variant="contained"
            disabled={emailDialog.sending || !emailDialog.email || !emailDialog.subject}
            sx={{ 
              backgroundColor: '#882AFF',
              '&:hover': { backgroundColor: '#7C3AED' }
            }}
            startIcon={emailDialog.sending ? <CircularProgress size={16} color="inherit" /> : <EmailIcon />}
          >
            {emailDialog.sending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderList;