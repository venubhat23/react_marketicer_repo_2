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

// AI Contract Generator Component (embedded to fix import issues)
const AIContractGenerator = ({ onBack }) => {
  const [contractName, setContractName] = useState('');
  const [description, setDescription] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    {
      id: 'service_agreement',
      name: 'Service Agreement',
      description: 'A standard service agreement between a service provider and client covering scope of work, payment terms, and deliverables.',
      contract: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on [DATE] between [CLIENT NAME] ("Client") and [SERVICE PROVIDER NAME] ("Service Provider").

1. SERVICES
The Service Provider agrees to provide the following services:
- [Service Description 1]
- [Service Description 2] 
- [Service Description 3]

2. COMPENSATION
Client agrees to pay Service Provider $[AMOUNT] for the services described above.
Payment terms: [Payment Schedule]

3. TIMELINE
Services will be completed by [END DATE].

4. RESPONSIBILITIES
Client Responsibilities:
- Provide necessary materials and information
- Review and approve deliverables in a timely manner

Service Provider Responsibilities:
- Complete work according to specifications
- Meet agreed deadlines

5. INTELLECTUAL PROPERTY
All work products created under this agreement shall belong to [CLIENT/SERVICE PROVIDER].

6. TERMINATION
Either party may terminate this agreement with [NUMBER] days written notice.

Client Signature: _________________________ Date: __________
Service Provider Signature: _________________ Date: __________`
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      description: 'A confidentiality agreement to protect sensitive business information between parties.',
      contract: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between [PARTY 1] and [PARTY 2].

1. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information includes all technical, business, financial, and other information disclosed by either party.

2. OBLIGATIONS
The receiving party agrees to:
- Keep all confidential information strictly confidential
- Not disclose information to third parties
- Use information only for the intended purpose

3. TERM
This agreement shall remain in effect for [DURATION] years from the date of signing.

4. GOVERNING LAW
This agreement shall be governed by the laws of [STATE/COUNTRY].

Party 1 Signature: _________________________ Date: __________
Party 2 Signature: _________________________ Date: __________`
    },
    {
      id: 'employment',
      name: 'Employment Contract',
      description: 'A comprehensive employment agreement outlining terms, conditions, and responsibilities for new hires.',
      contract: `EMPLOYMENT AGREEMENT

This Employment Agreement is entered into between [COMPANY NAME] ("Company") and [EMPLOYEE NAME] ("Employee").

1. POSITION AND DUTIES
Employee is hired as [JOB TITLE] and will perform the following duties:
- [Duty 1]
- [Duty 2]
- [Duty 3]

2. COMPENSATION
- Base Salary: $[AMOUNT] per [PERIOD]
- Benefits: [Health Insurance, Retirement Plan, etc.]
- Vacation: [NUMBER] days per year

3. TERMINATION
Either party may terminate with [NUMBER] days notice.

Company Representative: _____________________ Date: __________
Employee Signature: ________________________ Date: __________`
    },
    {
      id: 'freelance',
      name: 'Freelance Contract',
      description: 'An independent contractor agreement for freelance work including project scope and payment terms.',
      contract: `FREELANCE CONTRACTOR AGREEMENT

This Agreement is between [CLIENT NAME] ("Client") and [FREELANCER NAME] ("Contractor").

1. PROJECT DESCRIPTION
Contractor will provide the following services:
[Detailed project description]

2. DELIVERABLES
- [Deliverable 1] - Due: [DATE]
- [Deliverable 2] - Due: [DATE]

3. COMPENSATION
Total Project Fee: $[AMOUNT]

4. PAYMENT TERMS
Invoices due within [NUMBER] days.

Client Signature: _________________________ Date: __________
Contractor Signature: ____________________ Date: __________`
    }
  ];

  const handleTemplateChange = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setContractName(template.name);
      setDescription(template.description);
      setGeneratedContract(template.contract);
      setShowGenerated(true);
    }
  };

  const handleGenerateAI = () => {
    if (!contractName.trim() || !description.trim()) {
      alert('Please fill in both name and description');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const sampleContract = `CONTRACT AGREEMENT

Contract Name: ${contractName}

This Agreement is entered into between the parties as follows:

DESCRIPTION OF SERVICES:
${description}

TERMS AND CONDITIONS:
1. Scope of Work: The services described above shall be performed in accordance with industry standards and best practices.

2. Payment Terms: Payment shall be made according to the agreed schedule. All payments are due within 30 days of invoice date.

3. Duration: This contract shall remain in effect from the start date until completion of all specified deliverables.

4. Intellectual Property: All work products created under this agreement shall be owned by the client upon full payment.

5. Confidentiality: Both parties agree to maintain confidentiality of any proprietary information shared during the course of this agreement.

6. Termination: Either party may terminate this agreement with 30 days written notice.

7. Governing Law: This agreement shall be governed by applicable local laws.

By signing below, both parties agree to be bound by the terms of this contract.

_____________________          Date: ___________
Client Signature

_____________________          Date: ___________
Service Provider Signature`;

      setGeneratedContract(sampleContract);
      setShowGenerated(true);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSaveDraft = () => {
    console.log('Saving as draft:', { contractName, description, generatedContract, status: 'draft' });
    alert('Contract saved as draft successfully!');
  };

  const handleSave = () => {
    console.log('Saving contract:', { contractName, description, generatedContract, status: 'saved' });
    alert('Contract saved successfully!');
    // Call onBack to return to main contracts page
    if (onBack) onBack();
  };

  const handleBackToContracts = () => {
    setShowGenerated(false);
    setGeneratedContract('');
    setContractName('');
    setDescription('');
    setSelectedTemplate('');
    if (onBack) onBack();
  };

  const handleToggleTemplate = () => {
    setUseTemplate(!useTemplate);
    setSelectedTemplate('');
    setContractName('');
    setDescription('');
    setGeneratedContract('');
    setShowGenerated(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={handleBackToContracts}
            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            <ArrowLeftIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            AI Contract Generator
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Left Section - Input Form */}
        <Box sx={{ 
          width: '50%', 
          bgcolor: 'white', 
          p: 4, 
          overflowY: 'auto',
          borderRight: '1px solid #e0e0e0'
        }}>
          <Box sx={{ maxWidth: '400px', mx: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
              Contract Details
            </Typography>
            
            {/* Template Toggle Switch */}
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#666' }}>
                  Use Template
                </Typography>
                <Box
                  component="button"
                  onClick={handleToggleTemplate}
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: 44,
                    height: 24,
                    bgcolor: useTemplate ? '#7c4dff' : '#ccc',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:focus': { outline: 'none' }
                  }}
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: 'white',
                      borderRadius: '50%',
                      transform: useTemplate ? 'translateX(20px)' : 'translateX(4px)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </Box>
              </Box>
              
              {/* Template Dropdown */}
              {useTemplate && (
                <TextField
                  select
                  fullWidth
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  SelectProps={{ native: true }}
                  size="small"
                >
                  <option value="">Select a template...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </TextField>
              )}
            </Paper>

            {/* Contract Name */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#666', mb: 1 }}>
                Contract Name
              </Typography>
              <TextField
                fullWidth
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="Enter contract name"
                disabled={useTemplate && !selectedTemplate}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#666', mb: 1 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this contract should cover..."
                disabled={useTemplate && !selectedTemplate}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>

            {/* Generate Button - Only show when not using template */}
            {!useTemplate && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateAI}
                disabled={isGenerating || !contractName.trim() || !description.trim()}
                sx={{
                  bgcolor: '#7c4dff',
                  color: 'white',
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#6200ea',
                  },
                  '&:disabled': {
                    opacity: 0.5,
                  }
                }}
              >
                {isGenerating ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                    Generating Contract...
                  </Box>
                ) : (
                  '🤖 Generate AI Contract'
                )}
              </Button>
            )}
          </Box>
        </Box>

        {/* Right Section - Generated Contract */}
        <Box sx={{ 
          width: '50%', 
          bgcolor: '#f8f9fa', 
          p: 4, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {showGenerated ? (
            <>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 4 }}>
                Generated Contract
              </Typography>
              
              {/* Contract Content */}
              <Paper sx={{ 
                p: 3, 
                mb: 4, 
                flexGrow: 1, 
                overflowY: 'auto',
                border: '1px solid #e0e0e0'
              }}>
                <Typography 
                  component="pre" 
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '0.875rem', 
                    color: '#333',
                    lineHeight: 1.6,
                    fontFamily: 'monospace'
                  }}
                >
                  {generatedContract}
                </Typography>
              </Paper>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleSaveDraft}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: '#666',
                    color: '#666',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      borderColor: '#333',
                    }
                  }}
                >
                  💾 Save as Draft
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    bgcolor: '#4caf50',
                    '&:hover': {
                      bgcolor: '#388e3c',
                    }
                  }}
                >
                  ✅ Save Contract
                </Button>
              </Box>
            </>
          ) : (
            /* Empty State */
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: 96,
                  height: 96,
                  bgcolor: '#e0e0e0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Typography variant="h2">📄</Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#666', mb: 1 }}>
                  {useTemplate ? 'Select a Template' : 'No Contract Generated'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', maxWidth: 300, mx: 'auto' }}>
                  {useTemplate 
                    ? 'Choose a template from the dropdown to load a pre-built contract.'
                    : 'Fill in the contract name and description, then click "Generate AI Contract" to create your contract.'
                  }
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

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