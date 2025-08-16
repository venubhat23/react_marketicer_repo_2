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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Assignment as TemplateIcon,
  CreateNewFolder as CreatedIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import AIContractGenerator from './AIContractGenerator';
import Sidebar from '../../components/Sidebar'
import {Link} from 'react-router-dom'

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
  const navigate = useNavigate();

  // Helper function to get status display text and color
  const getStatusDisplay = (status) => {
    if (status === 1 || status === '1') {
      return {
        text: 'Draft',
        bgcolor: '#f3e5f5',
        color: '#7b1fa2'
      };
    } else {
      return {
        text: 'Active',
        bgcolor: '#e8f5e8',
        color: '#388e3c'
      };
    }
  };

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

  // Fetch single contract details for editing
  const fetchContractDetails = async (contractId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch contract details: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.contract || data; // Return the contract data
    } catch (err) {
      setError(`Error fetching contract details: ${err.message}`);
      console.error('Error fetching contract details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch template details for creating contract from template
  const fetchTemplateDetails = async (templateId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts/${templateId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch template details: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.contract || data; // Return the template data
    } catch (err) {
      setError(`Error fetching template details: ${err.message}`);
      console.error('Error fetching template details:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete contract or template
  const deleteItem = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }

      // Refresh the list
      if (showTemplates) {
        fetchTemplates();
      } else {
        fetchContracts();
      }
      
      setError('');
    } catch (err) {
      setError(`Error deleting item: ${err.message}`);
      console.error('Error deleting item:', err);
    }
  };

  // Edit contract - fetch details and navigate to AI generator
  const editContract = async (contract) => {
    try {
      // Fetch complete contract details including content
      const fullContractData = await fetchContractDetails(contract.id);
      
      if (fullContractData) {
        navigate("/ai-generator", { 
          state: { 
            editMode: true, 
            contractData: {
              id: contract.id,
              name: fullContractData.name || contract.name,
              description: fullContractData.description || contract.description || '',
              content: fullContractData.content || '',
              status: fullContractData.status || contract.status,
              contract_type: fullContractData.contract_type || contract.type,
              category: fullContractData.category || 'freelancer',
              date_created: fullContractData.date_created || contract.date_created,
              created_at: fullContractData.created_at || contract.created_at
            }
          } 
        });
      } else {
        // Fallback: use the basic contract data if API call fails
        navigate("/ai-generator", { 
          state: { 
            editMode: true, 
            contractData: {
              id: contract.id,
              name: contract.name,
              description: contract.description || '',
              content: contract.content || '',
              status: contract.status,
              contract_type: contract.type,
              category: 'freelancer',
              date_created: contract.date_created,
              created_at: contract.created_at
            }
          } 
        });
      }
    } catch (err) {
      setError(`Error preparing contract for editing: ${err.message}`);
      console.error('Error in editContract:', err);
    }
  };

  // Create contract from template
  const createContractFromTemplate = async (template) => {
    try {
      // Fetch complete template details including content
      const fullTemplateData = await fetchTemplateDetails(template.id);
      
      if (fullTemplateData) {
        navigate("/ai-generator", { 
          state: { 
            createFromTemplate: true, 
            templateData: {
              id: template.id,
              name: template.name,
              description: template.description || '',
              template_content: template.template_content || '', // This is the key field
              content: template.template_content || '', // Also map to content for backward compatibility
              contract_type: template.type,
              type: template.type, // Keep both for compatibility
              category: 'freelancer',
              date_created: template.date_created
            }
          } 
        });
      } else {
        // Fallback: use the basic template data if API call fails
        navigate("/ai-generator", { 
          state: { 
            createFromTemplate: true, 
            templateData: {
                id: template.id,
                name: template.name,
                description: template.description || '',
                template_content: template.template_content || '', // This is the key field
                content: template.template_content || '', // Also map to content for backward compatibility
                contract_type: template.type,
                type: template.type, // Keep both for compatibility
                category: 'freelancer',
                date_created: template.date_created
            }
          } 
        });
      }
    } catch (err) {
      setError(`Error preparing template for contract creation: ${err.message}`);
      console.error('Error in createContractFromTemplate:', err);
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

  const handleCreateContract = () => {
    navigate("/ai-generator");
  };

  const handleBackToContracts = () => {
    setShowContractGenerator(false);
    if (showTemplates) {
      fetchTemplates();
    } else {
      fetchContracts();
    }
  };

  const handleItemAction = (action, itemId, item) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete this ${showTemplates ? 'template' : 'contract'}?`)) {
          deleteItem(itemId);
        }
        break;
      case 'edit':
        if (showTemplates) {
          // Handle template editing - for now just log
          console.log(`Edit template ${itemId}`);
        } else {
          editContract(item);
        }
        break;
      case 'create-from-template':
        // Create contract from template
        createContractFromTemplate(item);
        break;
      case 'view':
        // Handle view contract details
        console.log(`View item ${itemId}`);
        break;
      default:
        console.log(`Action ${action} for item ${itemId}`);
    }
  };

  // Render table headers based on current view
  const renderTableHeaders = () => {
    if (showTemplates) {
      return (
        <TableRow sx={{ bgcolor: '#B1C6FF', padding:'0 20px' }}>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Template Name</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Type</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Date Created</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Actions</TableCell>
        </TableRow>
      );
    } else {
      return (
        <TableRow sx={{ bgcolor: '#B1C6FF', padding:'0 20px'}}>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Contract Name</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Type</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Status</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Date Created</TableCell>
          <TableCell sx={{ fontWeight: 600, color: '#fff' }}>Actions</TableCell>
        </TableRow>
      );
    }
  };

  // Render table rows based on current view
  const renderTableRows = () => {
    return filteredData.map((item) => {
      // Get status display for contracts
      const statusDisplay = getStatusDisplay(item.status);
      
      return (
        <TableRow
          key={item.id}
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
              onClick={() => handleItemAction('view', item.id, item)}
            >
              {item.name}
            </Typography>
          </TableCell>
          <TableCell sx={{ color: '#666' }}>
            {showTemplates 
              ? (item.type || 'N/A')
              : (item.type || item.contract_type || 'Template')
            }
          </TableCell>
          {!showTemplates && (
            <TableCell>
              <Chip
                label={statusDisplay.text}
                size="small"
                sx={{
                  bgcolor: statusDisplay.bgcolor,
                  color: statusDisplay.color,
                  border: 'none',
                  fontWeight: 500
                }}
              />
            </TableCell>
          )}
          <TableCell sx={{ color: '#666' }}>
            {item.date_created 
              ? (typeof item.date_created === 'string' 
                  ? item.date_created 
                  : new Date(item.date_created).toLocaleDateString())
              : (item.created_at 
                  ? new Date(item.created_at).toLocaleDateString()
                  : 'N/A')
            }
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {showTemplates ? (
                // Template actions - Show "Create Contract" button
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleItemAction('create-from-template', item.id, item)}
                  sx={{ 
                    bgcolor: 'white',
                    textTransform: 'none',
                    //px: 2,
                    //py: 0.5,
                    
                    borderRadius: 1,
                    
                    '&:hover': { 
                      bgcolor: '#f5f5f5',
                      borderColor: '#ccc'
                    }
                  }}
                  startIcon={<AddIcon fontSize="small" />}
                >
                  Create Contract
                </Button>
              ) : (
                // Contract actions - Show Edit and Delete buttons
                <>
                  <IconButton 
                    size="small" 
                    onClick={() => handleItemAction('edit', item.id, item)}
                    sx={{ 
                      color: '#1976d2',
                      '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' }
                    }}
                    title="Edit Contract"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleItemAction('delete', item.id, item)}
                    sx={{ 
                      color: '#d32f2f',
                      '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
                    }}
                    title="Delete Contract"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              
              {/* Delete button for templates */}
             
            </Box>
          </TableCell>
        </TableRow>
      );
    });
  };

  // Render AI Contract Generator if showContractGenerator is true
  if (showContractGenerator) {
    return <AIContractGenerator onBack={handleBackToContracts} />;
  }

  return (
    
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <Grid container>
          <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid>
            <Grid size={{ md: 11 }}>
              {/* Header with updated background color */}
        <Paper
          elevation={0}
          sx={{
            p: 1,
            backgroundColor: '#091a48', // Updated header background color
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
                  Contract
             </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateContract}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    lineHeight:0,
                  }}
                >
                  Create Contract
                </Button>
                <IconButton size="large" sx={{ color: 'white' }}>
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
                minWidth: 350,borderRadius: '50px',
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: 10,
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
                    color:'#fff'
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
                  minWidth: 'auto',
                }}
                startIcon={<TemplateIcon sx={{ fontSize: 18 }} />}
              >
                Templates ({templateCount})
              </Button>
            </Box>

            {/* View Mode Toggle */}
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
                    {renderTableHeaders()}
                  </TableHead>
                  <TableBody>
                    {renderTableRows()}
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
                  No {showTemplates ? 'Templates' : 'Contracts'} Yet
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#666', maxWidth: 400 }}>
                  Start by creating your first {showTemplates ? 'Template' : 'Contract'}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateContract}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Create {showTemplates ? 'Template' : 'Contract'}
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