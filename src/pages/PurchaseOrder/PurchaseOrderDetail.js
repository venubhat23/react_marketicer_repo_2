import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PurchaseOrderAPI from '../../services/purchaseOrderApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const PurchaseOrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseOrder();
  }, [id]);

  const fetchPurchaseOrder = async () => {
    try {
      setLoading(true);
      const response = await PurchaseOrderAPI.getPurchaseOrder(id);
      setPurchaseOrder(response.purchase_order);
    } catch (error) {
      toast.error('Failed to fetch purchase order details');
      console.error('Error fetching purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        await PurchaseOrderAPI.deletePurchaseOrder(id);
        toast.success('Purchase order deleted successfully');
        navigate('/purchase-orders');
      } catch (error) {
        toast.error('Failed to delete purchase order');
        console.error('Error deleting purchase order:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'partially paid': return 'info';
      default: return 'default';
    }
  };

  const calculateSubtotal = () => {
    return purchaseOrder?.line_items?.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    }, 0) || 0;
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * (parseFloat(purchaseOrder?.gst_percentage) || 0)) / 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading purchase order details...</Typography>
      </Box>
    );
  }

  if (!purchaseOrder) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Purchase order not found</Typography>
      </Box>
    );
  }

  const subtotal = calculateSubtotal();
  const gstAmount = calculateGST();

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
                  onClick={() => navigate('/purchase-orders')}
                >
                  <ArrowBackIcon />
                </IconButton>
                Purchase Order #{purchaseOrder.id}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  onClick={() => navigate(`/purchase-orders/edit/${id}`)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    lineHeight:0,
                  }}
                >
                  Edit
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
          <Box sx={{ mt: { xs: 8, md: 0 }, padding:'20px', minHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
            <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
              <Box display="flex" gap={2}>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  color="error"
                  variant="outlined"
                >
                  Delete
                </Button>
                <Button
                  startIcon={<PrintIcon />}
                  variant="outlined"
                  onClick={() => window.print()}
                >
                  Print
                </Button>
              </Box>
            </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                Company Information
              </Typography>
              <Typography><strong>Company Name:</strong> {purchaseOrder.company_name}</Typography>
              <Typography><strong>GST Number:</strong> {purchaseOrder.gst_number || 'N/A'}</Typography>
              <Typography><strong>Phone:</strong> {purchaseOrder.phone_number || 'N/A'}</Typography>
              <Typography><strong>Website:</strong> {purchaseOrder.company_website || 'N/A'}</Typography>
              <Typography><strong>Address:</strong> {purchaseOrder.address || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                Customer & Order Details
              </Typography>
              <Typography><strong>Customer:</strong> {purchaseOrder.customer}</Typography>
              <Typography><strong>Job Title:</strong> {purchaseOrder.job_title || 'N/A'}</Typography>
              <Typography><strong>Work Email:</strong> {purchaseOrder.work_email || 'N/A'}</Typography>
              <Typography><strong>Order Number:</strong> {purchaseOrder.order_number}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography><strong>Status:</strong></Typography>
                <Chip 
                  label={purchaseOrder.status} 
                  color={getStatusColor(purchaseOrder.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Typography><strong>Created:</strong> {new Date(purchaseOrder.created_at).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                Line Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#091a48' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Description</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Quantity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Unit Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: '#fff', fontSize: '16px' }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrder.line_items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">₹{parseFloat(item.unit_price || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={3}>
                <Grid container justifyContent="flex-end">
                  <Grid item xs={12} md={4}>
                    <Box p={2} bgcolor="#F5F5F5" borderRadius={1}>
                      <Box display="flex" justifyContent="between" mb={1}>
                        <Typography>Subtotal:</Typography>
                        <Typography>₹{subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="between" mb={1}>
                        <Typography>GST ({purchaseOrder.gst_percentage}%):</Typography>
                        <Typography>₹{gstAmount.toFixed(2)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="between">
                        <Typography variant="h6"><strong>Total:</strong></Typography>
                        <Typography variant="h6"><strong>₹{parseFloat(purchaseOrder.total_amount || 0).toFixed(2)}</strong></Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchaseOrderDetail;