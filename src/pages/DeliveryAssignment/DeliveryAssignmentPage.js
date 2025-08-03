import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import Sidebar from '../../components/Sidebar';
import SearchableDropdown from '../../components/SearchableDropdown';

const DeliveryAssignmentPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalAssignments, setTotalAssignments] = useState(0);

  // Form state for creating/editing delivery assignments
  const [formData, setFormData] = useState({
    assignmentName: '',
    description: '',
    customer: null,
    startDate: null,
    endDate: null,
    priority: 'Medium',
    status: 'Pending'
  });

  const API_BASE_URL = 'https://api.marketincer.com/api/v1';
  const navigate = useNavigate();

  // Mock customers data - in real app, this would come from API
  const mockCustomers = [
    { id: 1, name: 'Pramod Kumar', email: 'pramod@example.com' },
    { id: 2, name: 'Pradeep Singh', email: 'pradeep@example.com' },
    { id: 3, name: 'Prasad Sharma', email: 'prasad@example.com' },
    { id: 4, name: 'Priya Patel', email: 'priya@example.com' },
    { id: 5, name: 'Rajesh Kumar', email: 'rajesh@example.com' },
    { id: 6, name: 'Ravi Gupta', email: 'ravi@example.com' },
    { id: 7, name: 'Suresh Reddy', email: 'suresh@example.com' },
    { id: 8, name: 'Amit Joshi', email: 'amit@example.com' },
    { id: 9, name: 'Vikash Yadav', email: 'vikash@example.com' },
    { id: 10, name: 'Manish Agarwal', email: 'manish@example.com' }
  ];

  // Mock assignments data
  const mockAssignments = [
    {
      id: 1,
      assignmentName: 'Website Delivery',
      description: 'Deliver updated website to client',
      customer: { name: 'Pramod Kumar' },
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      priority: 'High',
      status: 'In Progress'
    },
    {
      id: 2,
      assignmentName: 'Mobile App Update',
      description: 'Deploy mobile application updates',
      customer: { name: 'Pradeep Singh' },
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      priority: 'Medium',
      status: 'Completed'
    }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  // Helper function to get status display text and color
  const getStatusDisplay = (status) => {
    const statusMap = {
      'Pending': { bgcolor: '#fff3cd', color: '#856404' },
      'In Progress': { bgcolor: '#d1ecf1', color: '#0c5460' },
      'Completed': { bgcolor: '#d4edda', color: '#155724' },
      'Cancelled': { bgcolor: '#f8d7da', color: '#721c24' }
    };
    return statusMap[status] || { bgcolor: '#e2e3e5', color: '#383d41' };
  };

  const getPriorityDisplay = (priority) => {
    const priorityMap = {
      'Low': { bgcolor: '#d4edda', color: '#155724' },
      'Medium': { bgcolor: '#fff3cd', color: '#856404' },
      'High': { bgcolor: '#f8d7da', color: '#721c24' },
      'Critical': { bgcolor: '#721c24', color: '#ffffff' }
    };
    return priorityMap[priority] || { bgcolor: '#e2e3e5', color: '#383d41' };
  };

  // Fetch assignments from API (mock for now)
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredAssignments = mockAssignments;
      
      if (searchQuery.trim()) {
        filteredAssignments = mockAssignments.filter(assignment =>
          assignment.assignmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setAssignments(filteredAssignments);
      setTotalAssignments(filteredAssignments.length);
    } catch (err) {
      setError(`Error fetching assignments: ${err.message}`);
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load customers (mock for now)
  useEffect(() => {
    setCustomers(mockCustomers);
  }, []);

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchAssignments();
  }, [searchQuery]);

  const handleCreateAssignment = () => {
    setShowCreateForm(true);
  };

  const handleBackToList = () => {
    setShowCreateForm(false);
    setFormData({
      assignmentName: '',
      description: '',
      customer: null,
      startDate: null,
      endDate: null,
      priority: 'Medium',
      status: 'Pending'
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.assignmentName || !formData.customer || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulate API call to create assignment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to mock data
      const newAssignment = {
        id: assignments.length + 1,
        ...formData,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0]
      };
      
      setAssignments([...assignments, newAssignment]);
      handleBackToList();
      
    } catch (err) {
      setError(`Error creating assignment: ${err.message}`);
      console.error('Error creating assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const deleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
        setError('');
      } catch (err) {
        setError(`Error deleting assignment: ${err.message}`);
        console.error('Error deleting assignment:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Render Create Form
  if (showCreateForm) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
          <Grid container>
            <Grid size={{ md: 1 }} className="side_section">
              <Sidebar />
            </Grid>
            <Grid size={{ md: 11 }}>
              {/* Header */}
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  backgroundColor: '#091a48',
                  borderRadius: 0,
                  color: 'white'
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
                      onClick={handleBackToList}
                    >
                      <ArrowLeftIcon />
                    </IconButton>
                    Create Delivery Assignment
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton size="large" sx={{ color: 'white' }}>
                      <NotificationsIcon />
                    </IconButton>
                    <IconButton size="large" sx={{ color: 'white' }}>
                      <AccountCircleIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {/* Create Form */}
              <Box sx={{ padding: '24px' }}>
                <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                    New Delivery Assignment
                  </Typography>

                  <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={3}>
                      {/* Assignment Name */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Assignment Name"
                          value={formData.assignmentName}
                          onChange={(e) => handleInputChange('assignmentName', e.target.value)}
                          required
                          variant="outlined"
                        />
                      </Grid>

                      {/* Customer Dropdown with Search */}
                      <Grid item xs={12} md={6}>
                        <SearchableDropdown
                          options={customers}
                          value={formData.customer}
                          onChange={(event, newValue) => handleInputChange('customer', newValue)}
                          label="Customer"
                          placeholder="Type to search customers..."
                          required
                        />
                      </Grid>

                      {/* Start Date - Allow older dates */}
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Start Date"
                          value={formData.startDate}
                          onChange={(newValue) => handleInputChange('startDate', newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth required variant="outlined" />
                          )}
                          // Allow any date - no restrictions on past dates
                          disableFuture={false}
                          disablePast={false}
                          minDate={null}
                          maxDate={null}
                        />
                      </Grid>

                      {/* End Date - Allow older dates */}
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="End Date"
                          value={formData.endDate}
                          onChange={(newValue) => handleInputChange('endDate', newValue)}
                          renderInput={(params) => (
                            <TextField {...params} fullWidth required variant="outlined" />
                          )}
                          // Allow any date - no restrictions on past dates
                          disableFuture={false}
                          disablePast={false}
                          minDate={null}
                          maxDate={null}
                        />
                      </Grid>

                      {/* Priority */}
                      <Grid item xs={12} md={6}>
                        <SearchableDropdown
                          options={priorityOptions.map(p => ({ name: p, value: p }))}
                          value={formData.priority ? { name: formData.priority, value: formData.priority } : null}
                          onChange={(event, newValue) => handleInputChange('priority', newValue?.value || 'Medium')}
                          label="Priority"
                          getOptionLabel={(option) => option?.name || option}
                        />
                      </Grid>

                      {/* Status */}
                      <Grid item xs={12} md={6}>
                        <SearchableDropdown
                          options={statusOptions.map(s => ({ name: s, value: s }))}
                          value={formData.status ? { name: formData.status, value: formData.status } : null}
                          onChange={(event, newValue) => handleInputChange('status', newValue?.value || 'Pending')}
                          label="Status"
                          getOptionLabel={(option) => option?.name || option}
                        />
                      </Grid>

                      {/* Description */}
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          multiline
                          rows={4}
                          variant="outlined"
                        />
                      </Grid>

                      {/* Action Buttons */}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={handleBackToList}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                          >
                            {loading ? 'Creating...' : 'Create Assignment'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </LocalizationProvider>
    );
  }

  // Render List View
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: '#091a48',
              borderRadius: 0,
              color: 'white'
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
                Delivery Assignments
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateAssignment}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    lineHeight: 0,
                  }}
                >
                  Create Assignment
                </Button>
                <IconButton size="large" sx={{ color: 'white' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Controls Bar */}
          <Box
            sx={{
              bgcolor: '#B1C6FF',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {/* Search */}
            <TextField
              placeholder="Search assignments or customers..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: 350,
                borderRadius: '50px',
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 10,
                }
              }}
            />
          </Box>

          {/* Main Content */}
          <Box sx={{ padding: '24px' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : assignments.length > 0 ? (
              /* Table */
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#B1C6FF', padding: '0 20px' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Assignment Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((assignment) => {
                      const statusDisplay = getStatusDisplay(assignment.status);
                      const priorityDisplay = getPriorityDisplay(assignment.priority);

                      return (
                        <TableRow
                          key={assignment.id}
                          hover
                          sx={{
                            '&:hover': { bgcolor: '#f8f9fa' },
                            borderBottom: '1px solid #e0e0e0'
                          }}
                        >
                          <TableCell>
                            <Typography
                              component="span"
                              sx={{
                                color: '#7c4dff',
                                cursor: 'pointer',
                                fontWeight: 500,
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {assignment.assignmentName}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#666' }}>
                            {assignment.customer?.name || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: '#666' }}>
                            {assignment.startDate}
                          </TableCell>
                          <TableCell sx={{ color: '#666' }}>
                            {assignment.endDate}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={assignment.priority}
                              size="small"
                              sx={{
                                bgcolor: priorityDisplay.bgcolor,
                                color: priorityDisplay.color,
                                border: 'none',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={assignment.status}
                              size="small"
                              sx={{
                                bgcolor: statusDisplay.bgcolor,
                                color: statusDisplay.color,
                                border: 'none',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#1976d2',
                                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' }
                                }}
                                title="Edit Assignment"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => deleteAssignment(assignment.id)}
                                sx={{
                                  color: '#d32f2f',
                                  '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                                }}
                                title="Delete Assignment"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              /* Empty State */
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                textAlign: 'center'
              }}>
                <Box sx={{
                  mb: 3,
                  p: 4,
                  borderRadius: '50%',
                  bgcolor: '#f5f5f5'
                }}>
                  <AssignmentIcon sx={{ fontSize: 64, color: '#ccc' }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                  No Delivery Assignments Yet
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#666', maxWidth: 400 }}>
                  Start by creating your first delivery assignment
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateAssignment}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Create Assignment
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryAssignmentPage;