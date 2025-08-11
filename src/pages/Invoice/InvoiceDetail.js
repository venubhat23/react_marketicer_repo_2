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
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceAPI from '../../services/invoiceApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await InvoiceAPI.getInvoice(id);
      setInvoice(response.invoice);
    } catch (error) {
      toast.error('Failed to fetch invoice details');
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await InvoiceAPI.deleteInvoice(id);
        toast.success('Invoice deleted successfully');
        navigate('/invoices');
      } catch (error) {
        toast.error('Failed to delete invoice');
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const calculateSubtotal = () => {
    return invoice?.line_items?.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    }, 0) || 0;
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * (parseFloat(invoice?.gst_percentage) || 0)) / 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading invoice details...</Typography>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Invoice not found</Typography>
      </Box>
    );
  }

  const subtotal = calculateSubtotal();
  const gstAmount = calculateGST();

  return (
    <Layout>
    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/invoices')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ color: '#091A48', fontWeight: 'bold' }}>
            Invoice #{invoice.id}
          </Typography>
        </Box>
        <Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/invoices/edit/${id}`)}
            sx={{ mr: 1, color: '#882AFF' }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="error"
            sx={{ mr: 1 }}
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
              <Typography><strong>Company Name:</strong> {invoice.company_name}</Typography>
              <Typography><strong>GST Number:</strong> {invoice.gst_number || 'N/A'}</Typography>
              <Typography><strong>Phone:</strong> {invoice.phone_number || 'N/A'}</Typography>
              <Typography><strong>Website:</strong> {invoice.company_website || 'N/A'}</Typography>
              <Typography><strong>Address:</strong> {invoice.address || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                Customer & Invoice Details
              </Typography>
              <Typography><strong>Customer:</strong> {invoice.customer}</Typography>
              <Typography><strong>Job Title:</strong> {invoice.job_title || 'N/A'}</Typography>
              <Typography><strong>Work Email:</strong> {invoice.work_email || 'N/A'}</Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography><strong>Status:</strong></Typography>
                <Chip 
                  label={invoice.status} 
                  color={getStatusColor(invoice.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
              <Typography><strong>Due Date:</strong> {invoice.due_date}</Typography>
              <Typography><strong>Created:</strong> {new Date(invoice.created_at).toLocaleDateString()}</Typography>
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
                  <TableHead sx={{ bgcolor: '#F5F5F5' }}>
                    <TableRow>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell align="center"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Unit Price</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.line_items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">${parseFloat(item.unit_price || 0).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
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
                        <Typography>${subtotal.toFixed(2)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="between" mb={1}>
                        <Typography>GST ({invoice.gst_percentage}%):</Typography>
                        <Typography>${gstAmount.toFixed(2)}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="between">
                        <Typography variant="h6"><strong>Total:</strong></Typography>
                        <Typography variant="h6"><strong>${parseFloat(invoice.total_amount || 0).toFixed(2)}</strong></Typography>
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
    </Layout>
  );
};

export default InvoiceDetail;