import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
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
  Switch,
  FormControlLabel,
  Divider,
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
import AIContractGenerator from "./AIContractGenerator";

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

  const API_BASE_URL = 'http://localhost:3001/api/v1';

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
    setShowContractGenerator(true);
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

  if (showContractGenerator) {
    return <AIContractGenerator onBack={handleBackToContracts} />;
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100%' }}>
      <Grid container>
        <Grid size={{ md: 1 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
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
                Contract
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateContract}
                  sx={{
                    bgcolor: '#ded6e9',
                    color: '#091a48',
                    '&:hover': {
                      bgcolor: '#F3F6FF',
                    },
                  }}
                >
                  Create Contract
                </Button>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: '#fff' }}>
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
              padding: '15px',
              display: 'flex',
              flexDirection: 'row',
              gap: 3,
              alignItems: 'center',
            }}
          >
            {/* Search - Only for contracts */}
            {!showTemplates && (
              <TextField
                placeholder="Search contracts..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 280 }}
              />
            )}

            {/* Single Toggle Switch */}
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
                  bgcolor: !showTemplates ? '#091a48' : 'transparent',
                  color: !showTemplates ? '#fff' : '#091a48',
                  '&:hover': {
                    bgcolor: !showTemplates ? '#091a48' : 'rgba(9,26,72,0.1)',
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
                  bgcolor: showTemplates ? '#7c3aed' : 'transparent',
                  color: showTemplates ? '#fff' : '#7c3aed',
                  '&:hover': {
                    bgcolor: showTemplates ? '#7c3aed' : 'rgba(124,58,237,0.1)',
                  },
                }}
                startIcon={<TemplateIcon sx={{ fontSize: 18 }} />}
              >
                Templates ({templateCount})
              </Button>
            </Box>

            {/* Results Count */}
            <Box sx={{ ml: 'auto' }}>
              <Typography variant="body2" sx={{ color: '#091a48', fontStyle: 'italic' }}>
                Showing {filteredData.length} {showTemplates ? 'templates' : 'contracts'}
                {!showTemplates && totalContracts > 0 && ` of ${totalContracts}`}
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredData.length > 0 ? (
                  /* Table */
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                          <TableCell padding="checkbox">
                            <Checkbox />
                          </TableCell>
                          <TableCell><strong>Contract Name</strong></TableCell>
                          <TableCell><strong>Type</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Date Created</strong></TableCell>
                          <TableCell><strong>Description</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredData.map((contract) => (
                          <TableRow
                            key={contract.id}
                            hover
                            sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {contract.category === 'template' || showTemplates ? (
                                  <TemplateIcon sx={{ fontSize: 16, color: '#7c3aed' }} />
                                ) : (
                                  <CreatedIcon sx={{ fontSize: 16, color: '#091a48' }} />
                                )}
                                <Typography
                                  component="span"
                                  sx={{
                                    color: '#7c3aed',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    '&:hover': {
                                      textDecoration: 'underline',
                                    },
                                  }}
                                >
                                  {contract.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{contract.contract_type || contract.type || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip
                                label={contract.status}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {contract.created_at 
                                ? new Date(contract.created_at).toLocaleDateString()
                                : contract.dateCreated || 'N/A'
                              }
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                title={contract.description}
                              >
                                {contract.description || 'No description'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleContractAction('duplicate', contract.id)}
                                  title="Duplicate"
                                >
                                  <DuplicateIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small"
                                  title="Edit"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleContractAction('delete', contract.id)}
                                  title="Delete"
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  /* Empty State */
                  <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      No {showTemplates ? 'Templates' : 'Contracts'} Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {searchQuery && !showTemplates
                        ? `No contracts match your search for "${searchQuery}"`
                        : `No ${showTemplates ? 'templates' : 'contracts'} available`
                      }
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateContract}
                      sx={{
                        bgcolor: '#7c3aed',
                        '&:hover': {
                          bgcolor: '#6d28d9',
                        },
                      }}
                    >
                      Create New {showTemplates ? 'Template' : 'Contract'}
                    </Button>
                  </Paper>
                )}

                {/* Pagination Controls */}
                {!showTemplates && totalContracts > perPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractPage;