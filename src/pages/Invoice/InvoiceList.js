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
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvoiceAPI from '../../services/invoiceApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, invoiceId: null });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await InvoiceAPI.getInvoiceDashboard();
      setInvoices(response.all_invoices || []);
    } catch (error) {
      toast.error('Failed to fetch invoices');
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await InvoiceAPI.deleteInvoice(id);
      toast.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete invoice');
      console.error('Error deleting invoice:', error);
    }
    setDeleteDialog({ open: false, invoiceId: null });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await InvoiceAPI.updateInvoiceStatus(id, newStatus);
      toast.success('Invoice status updated successfully');
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to update invoice status');
      console.error('Error updating invoice status:', error);
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id?.toString().includes(searchTerm);
    const matchesStatus = !statusFilter || invoice.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const paginatedInvoices = filteredInvoices.slice(
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
        <Typography>Loading invoices...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#091A48', fontWeight: 'bold' }}>
          Invoices
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/invoices/create')}
          sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#7020CC' } }}
        >
          Create Invoice
        </Button>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search invoices..."
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
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F5F5F5' }}>
              <TableRow>
                <TableCell><strong>Invoice ID</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>
                <TableCell><strong>Customer</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInvoices.map((invoice) => (
                <TableRow key={invoice.id} hover>
                  <TableCell>#{invoice.id}</TableCell>
                  <TableCell>{invoice.company_name}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>${invoice.total_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={invoice.status || ''}
                        onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                      color="secondary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeleteDialog({ open: true, invoiceId: invoice.id })}
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
          count={filteredInvoices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, invoiceId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this invoice?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, invoiceId: null })}>
            Cancel
          </Button>
          <Button onClick={() => handleDelete(deleteDialog.invoiceId)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </Layout>
  );
};

export default InvoiceList;