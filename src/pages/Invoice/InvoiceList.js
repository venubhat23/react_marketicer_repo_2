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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvoiceAPI from '../../services/invoiceApi';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import {Link } from 'react-router-dom';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, invoiceId: null });
  const [emailDialog, setEmailDialog] = useState({ 
    open: false, 
    invoice: null,
    email: '',
    subject: '',
    message: '',
    sending: false 
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      console.log('Fetching invoices...');
      
      // Try the main invoices endpoint first
      let response;
      try {
        response = await InvoiceAPI.getInvoices();
        console.log('Response from getInvoices:', response);
        setInvoices(response.invoices || response.data || []);
      } catch (mainError) {
        console.log('Main endpoint failed, trying dashboard endpoint:', mainError);
        // Fallback to dashboard endpoint
        response = await InvoiceAPI.getInvoiceDashboard();
        console.log('Response from getInvoiceDashboard:', response);
        setInvoices(response.all_invoices || response.invoices || response.data || []);
      }
    } catch (error) {
      const errorMessage = error.message || error.error || 'Failed to fetch invoices';
      toast.error(errorMessage);
      console.error('Error fetching invoices:', error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        data: error.data
      });
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

  const handleOpenEmailDialog = (invoice) => {
    setEmailDialog({
      open: true,
      invoice: invoice,
      email: invoice.work_email || '',
      subject: `Invoice #${invoice.invoice_number || invoice.id} from ${invoice.company_name || 'Your Company'}`,
      message: `Dear ${invoice.customer || 'Customer'},\n\nPlease find attached your invoice #${invoice.invoice_number || invoice.id}.\n\nInvoice Details:\n- Amount: $${parseFloat(invoice.total_amount || 0).toFixed(2)}\n- Due Date: ${invoice.due_date}\n- Status: ${invoice.status}\n\nThank you for your business!\n\nBest regards,\n${invoice.company_name || 'Your Company'}`,
      sending: false
    });
  };

  const handleCloseEmailDialog = () => {
    setEmailDialog({
      open: false,
      invoice: null,
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
      // Try API call first
      await InvoiceAPI.sendInvoiceEmail({
        invoice_id: emailDialog.invoice.id,
        email: emailDialog.email,
        subject: emailDialog.subject,
        message: emailDialog.message
      });
      
      toast.success('Invoice email sent successfully!');
      handleCloseEmailDialog();
    } catch (error) {
      console.error('API Error sending email:', error);
      
      // Fallback to mailto link if API fails
      const mailtoLink = `mailto:${emailDialog.email}?subject=${encodeURIComponent(emailDialog.subject)}&body=${encodeURIComponent(emailDialog.message)}`;
      window.open(mailtoLink, '_blank');
      
      toast.info('Opened email client. Please send manually until email service is configured.');
      handleCloseEmailDialog();
    } finally {
      setEmailDialog(prev => ({ ...prev, sending: false }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading invoices...</Typography>
      </Box>
    );
  }

  return (

    <><Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100vh' }}>
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
                  Invoices
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/invoices/create')}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    lineHeight:0,
                  }}
                >
                  Create Invoice
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
              label="Search invoices..."
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
                selected !== '' ? selected : <Typography color="#882AFF"> Status </Typography>
                }
              sx={{
                borderRadius: 10,
              }}
                
                
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>


          </Box>
          <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, padding:'20px'}}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 12 }}>
                <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: '#B1C6FF', color:'#fff' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Invoice ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>#{invoice.id}</TableCell>
                      <TableCell>{invoice.company_name}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>${typeof invoice.total_amount === 'number' ? invoice.total_amount.toFixed(2) : (parseFloat(invoice.total_amount) || 0).toFixed(2)}</TableCell>
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
                          title="View Invoice"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                          color="secondary"
                          size="small"
                          title="Edit Invoice"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleOpenEmailDialog(invoice)}
                          sx={{ color: '#882AFF' }}
                          size="small"
                          title="Send Email"
                        >
                          <EmailIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeleteDialog({ open: true, invoiceId: invoice.id })}
                          color="error"
                          size="small"
                          title="Delete Invoice"
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
                  onRowsPerPageChange={handleChangeRowsPerPage} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
    
    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
        {/* Delete Confirmation Dialog */}
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

        {/* Email Invoice Dialog */}
        <Dialog
          open={emailDialog.open}
          onClose={handleCloseEmailDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#882AFF', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon />
            Send Invoice Email
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Invoice: #{emailDialog.invoice?.invoice_number || emailDialog.invoice?.id} - {emailDialog.invoice?.customer}
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
              helperText="Email body content (invoice will be attached as PDF)"
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
      </Box></>

  );
};

export default InvoiceList;