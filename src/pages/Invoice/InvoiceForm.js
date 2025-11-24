import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Divider, Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import InvoiceAPI from '../../services/invoiceApi';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import {Link } from 'react-router-dom';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    invoice_number: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    company_name: '',
    customer: '',
    gst_number: '',
    phone_number: '',
    address: '',
    company_website: '',
    job_title: '',
    work_email: '',
    client_address: '',
    client_gstin: '',
    client_pan: '',
    gst_percentage: 18,
    total_amount: 0,
    status: 'Draft',
    due_date: dayjs().add(30, 'day'),
    notes: '',
    line_items: [
      { description: '', quantity: 1, unit_price: '' }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchInvoice();
    }
  }, [id, isEdit]);

  useEffect(() => {
    calculateTotal();
  }, [formData.line_items, formData.gst_percentage]);

  const fetchInvoice = async () => {
    try {
      setLoadingData(true);
      const response = await InvoiceAPI.getInvoice(id);
      const invoice = response.invoice;
      
      setFormData({
        ...invoice,
        due_date: dayjs(invoice.due_date),
        line_items: invoice.line_items || [{ description: '', quantity: 1, unit_price: 0 }]
      });
    } catch (error) {
      toast.error('Failed to fetch invoice');
      console.error('Error fetching invoice:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.line_items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    }, 0);
    
    const gstAmount = (subtotal * (parseFloat(formData.gst_percentage) || 0)) / 100;
    const total = subtotal + gstAmount;
    
    setFormData(prev => ({
      ...prev,
      total_amount: parseFloat(total.toFixed(2))
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedItems = formData.line_items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    
    setFormData(prev => ({
      ...prev,
      line_items: updatedItems
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { description: '', quantity: 1, unit_price: '' }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.line_items.length > 1) {
      const updatedItems = formData.line_items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        line_items: updatedItems
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSaveAndContinue();
  };

  const handleSaveAsDraft = async () => {
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        status: 'Draft',
        due_date: formData.due_date.format('YYYY-MM-DD')
      };

      if (isEdit) {
        await InvoiceAPI.updateInvoice(id, submitData);
        toast.success('Invoice draft updated successfully');
      } else {
        await InvoiceAPI.createInvoice(submitData);
        toast.success('Invoice saved as draft successfully');
      }
      
      navigate('/invoices');
    } catch (error) {
      toast.error(`Failed to save invoice as draft`);
      console.error(`Error saving invoice as draft:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.company_name || !formData.customer) {
        toast.error('Please fill in required fields: Company Name and Business Name');
        return;
      }

      // Validate line items
      const hasValidItems = formData.line_items.some(item => 
        item.description && item.quantity > 0 && parseFloat(item.unit_price) > 0
      );
      
      if (!hasValidItems) {
        toast.error('Please add at least one valid item with description, quantity, and rate');
        return;
      }

      // Clean and prepare data for submission
      const cleanedLineItems = formData.line_items.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity) || 0,
        unit_price: parseFloat(item.unit_price) || 0
      }));

      const submitData = {
        ...formData,
        line_items: cleanedLineItems,
        due_date: formData.due_date.format('YYYY-MM-DD')
      };

      console.log('Submitting invoice data:', submitData);

      if (isEdit) {
        await InvoiceAPI.updateInvoice(id, submitData);
        toast.success('Invoice updated successfully');
      } else {
        await InvoiceAPI.createInvoice(submitData);
        toast.success('Invoice created successfully');
      }
      
      navigate('/invoices');
    } catch (error) {
      const errorMessage = error.message || error.error || `Failed to ${isEdit ? 'update' : 'create'} invoice`;
      toast.error(errorMessage);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} invoice:`, error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        data: error.data,
        response: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = formData.line_items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
  }, 0);
  
  const gstAmount = (subtotal * (parseFloat(formData.gst_percentage) || 0)) / 100;

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading invoice...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section"> <Sidebar /></Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 2,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              borderRadius: 0
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="start"
                  sx={{ mr: 2, color: '#475569' }}
                  onClick={() => navigate('/invoices')}
                >
                  <ArrowLeftIcon />
                </IconButton>
                <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  {isEdit ? 'Edit Invoice' : 'Create Invoice'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton size="large" sx={{ color: '#64748b' }}>
                  <NotificationsIcon />
                </IconButton>
                <Link to="/SettingPage">
                  <IconButton size="large" sx={{ color: '#64748b' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Paper>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ maxWidth: 1000, mx: 'auto', px: 6, py: 4 }}>
              <form onSubmit={handleSubmit}>
                {/* Invoice Header */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 5, 
                    mb: 4, 
                    mx: 2,
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                    <Box>
                      <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700, mb: 1 }}>
                        Invoice
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {isEdit ? 'Edit invoice details' : 'Create a new invoice'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <TextField
                        label="Invoice No *"
                        value={formData.invoice_number}
                        onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                        required
                        size="small"
                        sx={{ 
                          mb: 2,
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Date: {dayjs().format('MMM DD, YYYY')}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Due Date"
                        value={formData.due_date}
                        onChange={(value) => handleInputChange('due_date', value)}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          label="Status"
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="Draft">Draft</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Paid">Paid</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Billed By & Billed To */}
                <Grid container spacing={4} sx={{ mb: 4, mx: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 4, 
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        height: 'fit-content'
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 3 }}>
                        Billed By
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                        Your Details
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Company Name *"
                          value={formData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          required
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="GST Number"
                              value={formData.gst_number}
                              onChange={(e) => handleInputChange('gst_number', e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={formData.phone_number}
                              onChange={(e) => handleInputChange('phone_number', e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                        </Grid>
                        <TextField
                          fullWidth
                          label="Work Email"
                          value={formData.company_website}
                          onChange={(e) => handleInputChange('company_website', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 4, 
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        height: 'fit-content'
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 3 }}>
                        Billed To
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                        Client's Details
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Business Name *"
                          value={formData.customer}
                          onChange={(e) => handleInputChange('customer', e.target.value)}
                          required
                          placeholder="Enter business name"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Address"
                          value={formData.client_address || ''}
                          onChange={(e) => handleInputChange('client_address', e.target.value)}
                          placeholder="Enter address"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="GSTIN"
                              value={formData.client_gstin || ''}
                              onChange={(e) => handleInputChange('client_gstin', e.target.value)}
                              placeholder="Enter GSTIN"
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="PAN"
                              value={formData.client_pan || ''}
                              onChange={(e) => handleInputChange('client_pan', e.target.value)}
                              placeholder="Enter PAN"
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                          </Grid>
                        </Grid>
                        <TextField
                          fullWidth
                          label="Work Email"
                          type="email"
                          value={formData.work_email}
                          onChange={(e) => handleInputChange('work_email', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Items Section */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    mb: 4,
                    mx: 2,
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                      Items
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addLineItem}
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        borderColor: '#3b82f6',
                        color: '#3b82f6',
                        '&:hover': {
                          borderColor: '#2563eb',
                          backgroundColor: '#eff6ff'
                        }
                      }}
                    >
                      Add New Line
                    </Button>
                  </Box>

                  <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #e2e8f0' }}>
                            Item
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #e2e8f0' }}>
                            Quantity
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #e2e8f0' }}>
                            Rate
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #e2e8f0' }}>
                            Amount
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#374151', borderBottom: '1px solid #e2e8f0' }}>
                            
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.line_items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ borderBottom: '1px solid #e2e8f0', py: 2 }}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Name/SKU Id (Required)"
                                value={item.description}
                                onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                                sx={{ 
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                  },
                                  '& input': { 
                                    fontSize: '14px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e2e8f0', py: 2 }}>
                              <TextField
                                type="number"
                                variant="outlined"
                                size="small"
                                value={item.quantity}
                                onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                inputProps={{ min: 0, style: { textAlign: 'center' } }}
                                sx={{ 
                                  width: 80,
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 1
                                  },
                                  '& input': { 
                                    fontSize: '14px'
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e2e8f0', py: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 1, color: '#64748b' }}>₹</Typography>
                                <TextField
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  value={item.unit_price}
                                  onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || '')}
                                  inputProps={{ min: 0, step: 0.01, style: { textAlign: 'right' } }}
                                  sx={{ 
                                    width: 100,
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 1
                                    },
                                    '& input': { 
                                      fontSize: '14px'
                                    }
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e2e8f0', py: 2 }}>
                              <Box sx={{ 
                                border: '1px solid #d1d5db', 
                                borderRadius: 1, 
                                px: 2, 
                                py: 1.5, 
                                minHeight: 40,
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f9fafb'
                              }}>
                                <Typography sx={{ fontWeight: 500, color: '#1e293b', fontSize: '14px' }}>
                                  ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #e2e8f0', py: 2 }}>
                              <IconButton
                                onClick={() => removeLineItem(index)}
                                disabled={formData.line_items.length === 1}
                                size="small"
                                sx={{ color: '#ef4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Summary Section */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Box sx={{ minWidth: 300 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ color: '#64748b' }}>Total</Typography>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                          ₹{subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <TextField
                          label="GST %"
                          type="number"
                          size="small"
                          value={formData.gst_percentage}
                          onChange={(e) => handleInputChange('gst_percentage', parseFloat(e.target.value) || 0)}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{ 
                            width: 120,
                            '& .MuiOutlinedInput-root': { borderRadius: 2 }
                          }}
                        />
                        <Typography sx={{ fontWeight: 500, color: '#1e293b' }}>
                          ₹{gstAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          Total (INR)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          ₹{formData.total_amount.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Notes Section */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    mb: 4,
                    mx: 2,
                    border: '1px solid #e2e8f0',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 3 }}>
                    Notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Add notes or additional information"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any additional notes, terms and conditions, or special instructions..."
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2 
                      }
                    }}
                  />
                </Paper>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, mx: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/invoices')}
                    sx={{ 
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      borderColor: '#d1d5db',
                      color: '#6b7280'
                    }}
                  >
                    Cancel
                  </Button>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleSaveAsDraft}
                      disabled={loading}
                      sx={{ 
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        borderColor: '#3b82f6',
                        color: '#3b82f6'
                      }}
                    >
                      {loading ? 'Saving...' : 'Save As Draft'}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{ 
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        bgcolor: '#3b82f6',
                        '&:hover': { bgcolor: '#2563eb' }
                      }}
                    >
                      {loading ? 'Saving...' : 'Save & Continue'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceForm;