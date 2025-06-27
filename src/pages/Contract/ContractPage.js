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
  Checkbox,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Assignment as TemplateIcon,
  CreateNewFolder as CreatedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as DuplicateIcon,
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import AIContractGenerator from './AIContractGenerator';

const ContractPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContractGenerator, setShowContractGenerator] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalContracts, setTotalContracts] = useState(0);

  const API_BASE_URL = 'https://api.marketincer.com/api/v1';

  // Fetch contracts from API
  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        category: 'created',
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`${API_BASE_URL}/contracts?${params}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contracts: ${response.statusText}`);
      }
      
      const data = await response.json();
      setContracts(data.contracts || []);
      setTotalContracts(data.total || 0);
    } catch (err) {
      setError(`Error fetching contracts: ${err.message}`);
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts/templates`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError(`Error fetching templates: ${err.message}`);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete contract
  const deleteContract = async (contractId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contract: ${response.statusText}`);
      }

      // Refresh the contracts list
      if (showTemplates) {
        fetchTemplates();
      } else {
        fetchContracts();
      }
      
      setError('');
    } catch (err) {
      setError(`Error deleting contract: ${err.message}`);
      console.error('Error deleting contract:', err);
    }
  };

  // Duplicate contract
  const duplicateContract = async (contractId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to duplicate contract: ${response.statusText}`);
      }

      // Refresh the contracts list
      fetchContracts();
      setError('');
    } catch (err) {
      setError(`Error duplicating contract: ${err.message}`);
      console.error('Error duplicating contract:', err);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    if (showTemplates) {
      fetchTemplates();
    } else {
      fetchContracts();
    }
  }, [showTemplates, page, perPage]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!showTemplates) {
        fetchContracts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredData = showTemplates ? templates : contracts;
  const contractCount = contracts.length;
  const templateCount = templates.length;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'primary';
      case 'draft':
        return 'default';
      case 'signed':
        return 'success';
      case 'active':
        return 'success';
      case 'template':
        return 'secondary';
      default:
        return 'default';
    }
  };
const navigate = useNavigate();
  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'ready':
        return 'info';
      case 'viewed':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleCreateContract = () => {
      navigate("/ai-generator"); // <-- navigate to your contract creation route
  };

  const handleBackToContracts = () => {
    setShowContractGenerator(false);
    // Refresh contracts when coming back from generator
    if (showTemplates) {
      fetchTemplates();
    } else {
      fetchContracts();
    }
  };

  const handleContractAction = (action, contractId) => {
    switch (action) {
      case 'delete':
        if (window.confirm('Are you sure you want to delete this contract?')) {
          deleteContract(contractId);
        }
        break;
      case 'duplicate':
        duplicateContract(contractId);
        break;
      default:
        console.log(`Action ${action} for contract ${contractId}`);
    }
  };

  // Render AI Contract Generator if showContractGenerator is true
  if (showContractGenerator) {
    return <AIContractGenerator onBack={handleBackToContracts} />;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: '#1a237e',
              borderRadius: 0,
              color: 'white'
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
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 1 }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Contract
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateContract}
                  sx={{
                    bgcolor: '#7c4dff',
                    color: 'white',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#6200ea',
                    },
                  }}
                >
                  Create Contract
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
              bgcolor: '#e3f2fd',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              borderBottom: '1px solid #e0e0e0'
            }}
          >
            {/* Search */}
            <TextField
              placeholder="Search"
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
                minWidth: 280,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 2,
                }
              }}
            />

            {/* Contract/Template Switcher */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: '50px',
                padding: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                mx: 'auto',
              }}
            >
              <Button
                variant={!showTemplates ? "contained" : "text"}
                onClick={() => setShowTemplates(false)}
                sx={{
                  borderRadius: '50px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 'auto',
                  bgcolor: !showTemplates ? '#1a237e' : 'transparent',
                  color: !showTemplates ? '#fff' : '#1a237e',
                  '&:hover': {
                    bgcolor: !showTemplates ? '#1a237e' : 'rgba(26,35,126,0.1)',
                  },
                }}
                startIcon={<CreatedIcon sx={{ fontSize: 18 }} />}
              >
                Contracts ({contractCount})
              </Button>
              
              <Button
                variant={showTemplates ? "contained" : "text"}
                onClick={() => setShowTemplates(true)}
                sx={{
                  borderRadius: '50px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 'auto',
                  bgcolor: showTemplates ? '#7c4dff' : 'transparent',
                  color: showTemplates ? '#fff' : '#7c4dff',
                  '&:hover': {
                    bgcolor: showTemplates ? '#7c4dff' : 'rgba(124,77,255,0.1)',
                  },
                }}
                startIcon={<TemplateIcon sx={{ fontSize: 18 }} />}
              >
                Templates ({templateCount})
              </Button>
            </Box>

            {/* View Mode Toggle */}
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={() => setViewMode('list')}
                sx={{ 
                  bgcolor: viewMode === 'list' ? '#1976d2' : 'transparent',
                  color: viewMode === 'list' ? 'white' : '#666',
                  '&:hover': {
                    bgcolor: viewMode === 'list' ? '#1565c0' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <ViewListIcon />
              </IconButton>
              <IconButton 
                onClick={() => setViewMode('grid')}
                sx={{ 
                  bgcolor: viewMode === 'grid' ? '#1976d2' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : '#666',
                  '&:hover': {
                    bgcolor: viewMode === 'grid' ? '#1565c0' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                <ViewModuleIcon />
              </IconButton>
            </Box>
          </Box>
          {/* Main Content */}
          <Box sx={{ padding: '24px' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredData.length > 0 ? (
              /* Table */
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#333' }}>Contract Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#333' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#333' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#333' }}>Date Created</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#333' }}>Action</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((contract) => (
                      <TableRow
                        key={contract.id}
                        hover
                        sx={{ 
                          '&:hover': { bgcolor: '#f8f9fa' },
                          borderBottom: '1px solid #e0e0e0'
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
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
                            {contract.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#666' }}>
                          {contract.contract_type || contract.type || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={contract.status}
                            size="small"
                            sx={{
                              bgcolor: contract.status === 'Sent' ? '#e3f2fd' : 
                                      contract.status === 'Draft' ? '#f3e5f5' :
                                      contract.status === 'Signed' ? '#e8f5e8' : '#f5f5f5',
                              color: contract.status === 'Sent' ? '#1976d2' : 
                                     contract.status === 'Draft' ? '#7b1fa2' :
                                     contract.status === 'Signed' ? '#388e3c' : '#666',
                              border: 'none',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#666' }}>
                          {contract.created_at 
                            ? new Date(contract.created_at).toLocaleDateString()
                            : contract.dateCreated || 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={contract.action || 'Viewed'}
                            size="small"
                            sx={{
                              bgcolor: contract.action === 'Pending' ? '#fff3e0' : '#f5f5f5',
                              color: contract.action === 'Pending' ? '#ef6c00' : '#666',
                              border: 'none',
                              fontWeight: 500
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
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
                  <DescriptionIcon sx={{ fontSize: 64, color: '#ccc' }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                  No Contracts Yet
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#666', maxWidth: 400 }}>
                  Start by creating your first Contract
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateContract}
                  sx={{
                    bgcolor: '#7c4dff',
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#6200ea',
                    },
                  }}
                >
                  Create Contract
                </Button>
              </Box>
            )}

            {/* Pagination Controls */}
            {!showTemplates && totalContracts > perPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  sx={{ mr: 2 }}
                >
                  Previous
                </Button>
                <Typography sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                  Page {page} of {Math.ceil(totalContracts / perPage)}
                </Typography>
                <Button
                  disabled={page >= Math.ceil(totalContracts / perPage)}
                  onClick={() => setPage(page + 1)}
                  sx={{ ml: 2 }}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractPage;