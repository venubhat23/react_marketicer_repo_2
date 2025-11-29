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
  Divider,
  Paper
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
import Sidebar from '../../components/Sidebar';
import { Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    order_number: `PO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    company_name: '',
    gst_number: '',
    phone_number: '',
    address: '',
    company_website: '',
    customer: '',
    job_title: '',
    work_email: '',
    gst_percentage: 18,
    status: 'Pending',
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
    <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section"> <Sidebar /></Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: '#091a48',
              borderRadius: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
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
              {isEdit ? 'Edit Purchase Order' : 'Create Purchase Order'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton size="large" sx={{ color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
              <Link to="/SettingPage">
                <IconButton size="large" sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Link>
            </Box>
          </Paper>

          <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 2 }}>
            <form onSubmit={handleSubmit}>
              {/* Purchase Order Header */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  mx: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 180 }}>
                    <TextField
                      label="PO Number *"
                      value={formData.order_number}
                      onChange={(e) => handleInputChange('order_number', e.target.value)}
                      required
                      size="small"
                      sx={{ 
                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                      }}
                    />
                    <FormControl size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        label="Status"
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 700, mb: 1.5 }}>
                      Purchase Order
                    </Typography>
                    {/* Company Details Display */}
                    <Box sx={{ 
                      mt: 1, 
                      textAlign: 'left', 
                      maxWidth: 320, 
                      mx: 'auto',
                      wordWrap: 'break-word',
                      overflow: 'hidden'
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: '#1e293b', 
                        fontWeight: 600, 
                        mb: 0.5,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}>
                        {formData.company_name || 'Company Name'}
                      </Typography>
                      {formData.address && (
                        <Typography variant="caption" sx={{ 
                          color: '#64748b', 
                          mb: 0.3,
                          lineHeight: 1.3,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'pre-line',
                          display: 'block'
                        }}>
                          {formData.address}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontSize: '11px' }}>
                        {formData.gst_number && (
                          <Typography variant="caption" sx={{ 
                            color: '#64748b',
                            fontSize: '11px'
                          }}>
                            GST: {formData.gst_number}
                          </Typography>
                        )}
                        {formData.phone_number && (
                          <Typography variant="caption" sx={{ 
                            color: '#64748b',
                            fontSize: '11px'
                          }}>
                            Ph: {formData.phone_number}
                          </Typography>
                        )}
                      </Box>
                      {formData.company_website && (
                        <Typography variant="caption" sx={{ 
                          color: '#64748b', 
                          display: 'block', 
                          mt: 0.3,
                          fontSize: '11px',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          {formData.company_website}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right', minWidth: 160 }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Date: {dayjs().format('MMM DD, YYYY')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Company Information & Customer Details */}
              <Grid container spacing={2} sx={{ mb: 3, mx: 1 }}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2.5, 
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      height: 'fit-content'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 600, mb: 2 }}>
                      Company Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        fullWidth
                        label="Company Name *"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        required
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="GST Number"
                            value={formData.gst_number}
                            onChange={(e) => handleInputChange('gst_number', e.target.value)}
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={formData.phone_number}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>
                      </Grid>
                      <TextField
                        fullWidth
                        label="Company Website"
                        value={formData.company_website}
                        onChange={(e) => handleInputChange('company_website', e.target.value)}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2.5, 
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      height: 'fit-content'
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 600, mb: 2 }}>
                      Customer Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        fullWidth
                        label="Customer Name *"
                        value={formData.customer}
                        onChange={(e) => handleInputChange('customer', e.target.value)}
                        required
                        size="small"
                        placeholder="Enter customer name"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={formData.job_title}
                        onChange={(e) => handleInputChange('job_title', e.target.value)}
                        size="small"
                        placeholder="Enter job title"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                      <TextField
                        fullWidth
                        label="Work Email"
                        type="email"
                        value={formData.work_email}
                        onChange={(e) => handleInputChange('work_email', e.target.value)}
                        size="small"
                        placeholder="Enter work email"
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
                  p: 3, 
                  mb: 3,
                  mx: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ color: '#1e293b', fontWeight: 600 }}>
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
                                onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                inputProps={{ min: 0, step: 0.01, style: { textAlign: 'center' } }}
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
                            <Typography sx={{ fontWeight: 500, color: '#1e293b' }}>
                              ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: '1px solid #e2e8f0', py: 2 }}>
                            <IconButton
                              onClick={() => removeLineItem(index)}
                              disabled={formData.line_items.length === 1}
                              size="small"
                              sx={{ 
                                color: '#ef4444',
                                '&:hover': { backgroundColor: '#fef2f2' },
                                '&:disabled': { color: '#d1d5db' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Totals Section */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Box sx={{ minWidth: 280, maxWidth: 350 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>Total</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        ₹{subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <TextField
                        label="GST %"
                        type="number"
                        size="small"
                        value={formData.gst_percentage}
                        onChange={(e) => handleInputChange('gst_percentage', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, max: 100 }}
                        sx={{ 
                          width: 100,
                          '& .MuiOutlinedInput-root': { borderRadius: 2 }
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                        ₹{gstAmount.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Total (INR)
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        ₹{(parseFloat(formData.total_amount) || 0).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, mx: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/purchase-orders')}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: '#d1d5db',
                    color: '#6b7280'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  {loading ? 'Saving...' : (isEdit ? 'Update Purchase Order' : 'Create Purchase Order')}
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchaseOrderForm;