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
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PurchaseOrderAPI from '../../services/purchaseOrderApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    company_name: '',
    gst_number: '',
    phone_number: '',
    address: '',
    customer: '',
    company_website: '',
    job_title: '',
    work_email: '',
    gst_percentage: 18,
    status: 'Pending',
    order_number: '',
    total_amount: 0,
    line_items: [
      { description: '', quantity: 1, unit_price: 0 }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchPurchaseOrder();
    }
  }, [id, isEdit]);

  useEffect(() => {
    calculateTotal();
  }, [formData.line_items, formData.gst_percentage]);

  const fetchPurchaseOrder = async () => {
    try {
      setLoadingData(true);
      const response = await PurchaseOrderAPI.getPurchaseOrder(id);
      const po = response.purchase_order;
      
      setFormData({
        ...po,
        line_items: po.line_items || [{ description: '', quantity: 1, unit_price: 0 }]
      });
    } catch (error) {
      toast.error('Failed to fetch purchase order');
      console.error('Error fetching purchase order:', error);
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
      if (isEdit) {
        await PurchaseOrderAPI.updatePurchaseOrder(id, formData);
        toast.success('Purchase order updated successfully');
      } else {
        await PurchaseOrderAPI.createPurchaseOrder(formData);
        toast.success('Purchase order created successfully');
      }
      
      navigate('/purchase-orders');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} purchase order`);
      console.error(`Error ${isEdit ? 'updating' : 'creating'} purchase order:`, error);
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
        <Typography>Loading purchase order...</Typography>
      </Box>
    );
  }

  return (
    <Layout>
    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/purchase-orders')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#091A48', fontWeight: 'bold' }}>
          {isEdit ? 'Edit Purchase Order' : 'Create Purchase Order'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                  Company Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name *"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      value={formData.gst_number}
                      onChange={(e) => handleInputChange('gst_number', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Website"
                      value={formData.company_website}
                      onChange={(e) => handleInputChange('company_website', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                  Customer & Order Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Customer Name *"
                      value={formData.customer}
                      onChange={(e) => handleInputChange('customer', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Work Email"
                      type="email"
                      value={formData.work_email}
                      onChange={(e) => handleInputChange('work_email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Order Number *"
                      value={formData.order_number}
                      onChange={(e) => handleInputChange('order_number', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
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
                      <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Quantity</strong></TableCell>
                        <TableCell><strong>Unit Price</strong></TableCell>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
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
                              placeholder="Item description"
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={item.unit_price}
                              onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              inputProps={{ min: 0, step: 0.01 }}
                              sx={{ width: 120 }}
                            />
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
                              inputProps={{ min: 0, max: 100 }}
                            />
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

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="outlined"
                onClick={() => navigate('/purchase-orders')}
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
                {loading ? 'Saving...' : (isEdit ? 'Update Purchase Order' : 'Create Purchase Order')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
    </Layout>
  );
};

export default PurchaseOrderForm;