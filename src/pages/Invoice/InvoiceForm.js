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
    company_name: '',
    customer: '',
    gst_number: '',
    phone_number: '',
    address: '',
    company_website: '',
    job_title: '',
    work_email: '',
    gst_percentage: 18,
    total_amount: 0,
    status: 'Draft',
    due_date: dayjs().add(30, 'day'),
    line_items: [
      { description: '', quantity: 1, unit_price: 0 }
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
      line_items: [...prev.line_items, { description: '', quantity: 1, unit_price: 0 }]
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
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        due_date: formData.due_date.format('YYYY-MM-DD')
      };

      if (isEdit) {
        await InvoiceAPI.updateInvoice(id, submitData);
        toast.success('Invoice updated successfully');
      } else {
        await InvoiceAPI.createInvoice(submitData);
        toast.success('Invoice created successfully');
      }
      
      navigate('/invoices');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} invoice`);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} invoice:`, error);
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
                  onClick={() => navigate('/invoices')}
                >
                  <ArrowLeftIcon />
                </IconButton>
                
                  {isEdit ? 'Edit Invoice' : 'Create Invoice'}
                </Typography>
              
             
            

              <Box sx={{ display: 'flex', gap: 1 }}>
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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
              <Grid item xs={12} md={6} sx={{mb:2}} >
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                      Company Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Company Name *"
                          value={formData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="GST Number"
                          size="small"
                          value={formData.gst_number}
                          onChange={(e) => handleInputChange('gst_number', e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          size="small"
                          value={formData.phone_number}
                          onChange={(e) => handleInputChange('phone_number', e.target.value)} />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Company Website"
                          size="small"
                          value={formData.company_website}
                          onChange={(e) => handleInputChange('company_website', e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} sx={{mb:2}}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                      Customer Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Customer Name *"
                          value={formData.customer}
                          onChange={(e) => handleInputChange('customer', e.target.value)}
                          required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Job Title"
                          value={formData.job_title}
                          onChange={(e) => handleInputChange('job_title', e.target.value)} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Work Email"
                          type="email"
                          size="small"
                          value={formData.work_email}
                          onChange={(e) => handleInputChange('work_email', e.target.value)} />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={formData.status}
                            label="Status"
                            size="small"
                            onChange={(e) => handleInputChange('status', e.target.value)}
                          >
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <DatePicker
                          label="Due Date"
                          size="small"
                          value={formData.due_date}
                          onChange={(value) => handleInputChange('due_date', value)}
                          renderInput={(params) => <TextField {...params} fullWidth />} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sx={{mb:2}}>
                <Card elevation={3}>
                  <CardContent>
                    <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ color: '#882AFF' }}>
                        Line Items
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addLineItem}
                        sx={{ color: '#882AFF' }}
                      >
                        Add Item
                      </Button>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#B1C6FF', color:'#fff' }}>
                            <TableCell sx={{ color: '#fff' }}><strong>Description</strong></TableCell>
                            <TableCell sx={{ color: '#fff' }}><strong>Quantity</strong></TableCell>
                            <TableCell sx={{ color: '#fff' }}><strong>Unit Price</strong></TableCell>
                            <TableCell sx={{ color: '#fff' }}><strong>Total</strong></TableCell>
                            <TableCell sx={{ color: '#fff' }}><strong>Actions</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.line_items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={item.description}
                                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                                  placeholder="Item description" />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  size="small"
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                  inputProps={{ min: 0 }}
                                  sx={{ width: 100 }} />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  size="small"
                                  type="number"
                                  value={item.unit_price}
                                  onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                  inputProps={{ min: 0, step: 0.01 }}
                                  sx={{ width: 120 }} />
                              </TableCell>
                              <TableCell>
                                ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => removeLineItem(index)}
                                  disabled={formData.line_items.length === 1}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box mt={3}>
                      <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item xs={12} md={4}>
                          <Box p={2} bgcolor="#F5F5F5" borderRadius={1}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <TextField
                                  label="GST %"
                                  type="number"
                                  size="small"
                                  value={formData.gst_percentage}
                                  onChange={(e) => handleInputChange('gst_percentage', parseFloat(e.target.value) || 0)}
                                  inputProps={{ min: 0, max: 100 }} />
                              </Grid>
                            </Grid>
                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="between" mb={1}>
                              <Typography>Subtotal:</Typography>
                              <Typography>${subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="between" mb={1}>
                              <Typography>GST ({formData.gst_percentage}%):</Typography>
                              <Typography>${gstAmount.toFixed(2)}</Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" justifyContent="between" mt={1}>
                              <Typography variant="h6"><strong>Total:</strong></Typography>
                              <Typography variant="h6"><strong>${formData.total_amount.toFixed(2)}</strong></Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sx={{mb:2}}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/invoices')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#7020CC' } }}
                  >
                    {loading ? 'Saving...' : (isEdit ? 'Update Invoice' : 'Create Invoice')}
                  </Button>
                </Box>
              </Grid>
            
          </form>
        </Box>
      </LocalizationProvider>

        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default InvoiceForm;