import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  Divider,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Sidebar from "../../components/Sidebar";

const AIContractGenerator = ({ onBack }) => {
  const [contractDescription, setContractDescription] = useState('');
  const [contractName, setContractName] = useState('');
  const [contractType, setContractType] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContract, setEditableContract] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [aiStatus, setAiStatus] = useState(null);
  const [currentContractId, setCurrentContractId] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api/v1'; // Using the base URL from your Postman collection

  const contractTypes = [
    { value: 'service_agreement', label: 'Service Agreement' },
    { value: 'software_development', label: 'Software Development' },
    { value: 'consulting_agreement', label: 'Consulting Agreement' },
    { value: 'employment_contract', label: 'Employment Contract' },
    { value: 'non_disclosure_agreement', label: 'Non-Disclosure Agreement' },
    { value: 'partnership_agreement', label: 'Partnership Agreement' },
    { value: 'license_agreement', label: 'License Agreement' }
  ];

  // Check AI service status on component mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/ai_status`);
      if (response.ok) {
        const data = await response.json();
        setAiStatus(data);
      }
    } catch (err) {
      console.warn('Could not check AI status:', err);
    }
  };

  const handleGenerateContract = async () => {
    if (!contractDescription.trim()) {
      setError('Please enter a contract description');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');
    
    try {
      const requestBody = {
        description: contractDescription.trim()
      };

      // Add optional fields if provided
      if (contractName.trim()) {
        requestBody.name = contractName.trim();
      }
      if (contractType) {
        requestBody.contract_type = contractType;
      }

      const response = await fetch(`${API_BASE_URL}/contracts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.contract) {
        setGeneratedContract(data.contract.content || 'Contract generated successfully but content is empty');
        setEditableContract(data.contract.content || '');
        setCurrentContractId(data.contract.id);
        setSuccess('Contract generated successfully!');
        
        // Auto-fill name and type if they were generated
        if (data.contract.name && !contractName) {
          setContractName(data.contract.name);
        }
        if (data.contract.contract_type && !contractType) {
          setContractType(data.contract.contract_type);
        }
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      setError(`Failed to generate contract: ${err.message}`);
      console.error('Error generating contract:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateContract = async () => {
    if (!currentContractId) {
      setError('No contract to regenerate');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/${currentContractId}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.contract) {
        setGeneratedContract(data.contract.content || 'Contract regenerated successfully but content is empty');
        setEditableContract(data.contract.content || '');
        setSuccess('Contract regenerated successfully!');
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      setError(`Failed to regenerate contract: ${err.message}`);
      console.error('Error regenerating contract:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateContract = async () => {
    if (!currentContractId) {
      setError('No contract to update');
      return;
    }

    try {
      const requestBody = {
        contract: {
          content: editableContract,
          name: contractName || 'Updated Contract',
          contract_type: contractType || 'service_agreement',
          description: contractDescription
        }
      };

      const response = await fetch(`${API_BASE_URL}/contracts/${currentContractId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedContract(editableContract);
      setIsEditing(false);
      setSuccess('Contract updated successfully!');
      
    } catch (err) {
      setError(`Failed to update contract: ${err.message}`);
      console.error('Error updating contract:', err);
    }
  };

  const handleSaveAsNewContract = async () => {
    try {
      const requestBody = {
        contract: {
          name: contractName || 'AI Generated Contract',
          contract_type: contractType || 'service_agreement',
          status: 'draft',
          category: 'created',
          description: contractDescription,
          content: generatedContract,
          metadata: {
            generated_by: 'AI',
            generated_at: new Date().toISOString(),
            based_on_description: contractDescription
          }
        }
      };

      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess('Contract saved as draft successfully!');
      setCurrentContractId(data.contract.id);
      
    } catch (err) {
      setError(`Failed to save contract: ${err.message}`);
      console.error('Error saving contract:', err);
    }
  };

  const handleLoadPreset = () => {
    const presets = [
      {
        name: 'Social Media Content Creation Agreement',
        type: 'service_agreement',
        description: 'This is a standard collaboration agreement for social media content creation between an influencer and a brand. The agreement covers content deliverables, usage rights, payment terms, and performance metrics.'
      },
      {
        name: 'Website Development Contract',
        type: 'software_development',
        description: 'Website development project for e-commerce platform with payment integration, user authentication, product catalog, shopping cart, and admin dashboard'
      },
      {
        name: 'Mobile App Development Agreement',
        type: 'software_development',
        description: 'Mobile app development for iOS and Android platforms, including backend API, database design, user interface, push notifications, and app store deployment'
      },
      {
        name: 'Digital Transformation Consulting',
        type: 'consulting_agreement',
        description: 'Business consulting services for digital transformation, process optimization, technology strategy, and staff training over 6 months'
      }
    ];

    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    setContractName(randomPreset.name);
    setContractType(randomPreset.type);
    setContractDescription(randomPreset.description);
  };

  const handleEditContract = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (currentContractId) {
      handleUpdateContract();
    } else {
      setGeneratedContract(editableContract);
      setIsEditing(false);
      setSuccess('Changes saved locally!');
    }
  };

  const handleCancelEdit = () => {
    setEditableContract(generatedContract);
    setIsEditing(false);
  };

  const handleDownloadPDF = () => {
    if (!generatedContract) {
      setError('No contract to download');
      return;
    }

    // Create a simple text file download (in real app, you'd use a PDF library)
    const element = document.createElement('a');
    const file = new Blob([generatedContract], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contractName || 'contract'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSuccess('Contract downloaded successfully!');
  };

  const handleClearAll = () => {
    setContractDescription('');
    setContractName('');
    setContractType('');
    setGeneratedContract('');
    setEditableContract('');
    setCurrentContractId(null);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
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
                  onClick={onBack}
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowBackIcon />
                </IconButton>
                AI Contract Generator
                {aiStatus && (
                  <Typography variant="caption" sx={{ ml: 2, opacity: 0.8 }}>
                    {aiStatus.status === 'available' ? '🟢 AI Service Online' : '🔴 AI Service Offline'}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Paper>

          {/* Error and Success Messages */}
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar 
            open={!!success} 
            autoHideDuration={4000} 
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="success" onClose={() => setSuccess('')}>
              {success}
            </Alert>
          </Snackbar>

          {/* Main Content */}
          <Box sx={{ height: 'calc(100vh - 73px)', display: 'flex' }}>
            {/* Left Section - Contract Description */}
            <Box sx={{ 
              width: '50%', 
              p: 4, 
              bgcolor: '#fff',
              borderRight: '1px solid #e0e0e0',
              overflow: 'auto'
            }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#091a48' }}>
                Contract Details
              </Typography>
              
              {/* Contract Name */}
              <TextField
                fullWidth
                label="Contract Name"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                placeholder="Enter contract name (optional)"
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {/* Contract Type */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Contract Type</InputLabel>
                <Select
                  value={contractType}
                  label="Contract Type"
                  onChange={(e) => setContractType(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Auto-detect from description</em>
                  </MenuItem>
                  {contractTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Contract Description */}
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Contract Description"
                value={contractDescription}
                onChange={(e) => setContractDescription(e.target.value)}
                placeholder="Describe what this contract should cover..."
                variant="outlined"
                sx={{ mb: 4 }}
                required
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
                  onClick={handleGenerateContract}
                  disabled={isGenerating || !contractDescription.trim()}
                  sx={{
                    bgcolor: '#7c3aed',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#6d28d9',
                    },
                  }}
                >
                  {isGenerating ? 'Generating Contract...' : 'Generate Contract'}
                </Button>

                {generatedContract && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRegenerateContract}
                    disabled={isGenerating}
                    sx={{
                      py: 1.5,
                      borderColor: '#7c3aed',
                      color: '#7c3aed',
                      '&:hover': {
                        borderColor: '#6d28d9',
                        bgcolor: 'rgba(124, 58, 237, 0.04)',
                      },
                    }}
                  >
                    Regenerate Contract
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleLoadPreset}
                  sx={{
                    py: 1.5,
                    borderColor: '#7c3aed',
                    color: '#7c3aed',
                    '&:hover': {
                      borderColor: '#6d28d9',
                      bgcolor: 'rgba(124, 58, 237, 0.04)',
                    },
                  }}
                >
                  Load Sample Description
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={handleClearAll}
                  sx={{
                    py: 1.5,
                    color: '#6b7280',
                    '&:hover': {
                      bgcolor: 'rgba(107, 114, 128, 0.04)',
                    },
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Box>

            {/* Right Section - Generated Contract */}
            <Box sx={{ 
              width: '50%', 
              p: 4, 
              bgcolor: '#f5edf8',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#091a48' }}>
                Generated Contract
                {currentContractId && (
                  <Typography variant="caption" sx={{ ml: 2, opacity: 0.7 }}>
                    (ID: {currentContractId})
                  </Typography>
                )}
              </Typography>
              
              {generatedContract ? (
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      flexGrow: 1, 
                      overflow: 'auto',
                      bgcolor: '#fff'
                    }}
                  >
                    {isEditing ? (
                      <TextField
                        fullWidth
                        multiline
                        value={editableContract}
                        onChange={(e) => setEditableContract(e.target.value)}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-root': {
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            minHeight: '400px',
                            alignItems: 'flex-start'
                          }
                        }}
                      />
                    ) : (
                      <Typography
                        component="pre"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          lineHeight: 1.6,
                          color: '#333',
                          margin: 0
                        }}
                      >
                        {generatedContract}
                      </Typography>
                    )}
                  </Paper>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {isEditing ? (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveEdit}
                            sx={{
                              flex: 1,
                              bgcolor: '#10b981',
                              '&:hover': { bgcolor: '#059669' }
                            }}
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            sx={{
                              flex: 1,
                              borderColor: '#6b7280',
                              color: '#6b7280',
                              '&:hover': { 
                                borderColor: '#4b5563',
                                bgcolor: '#f9fafb' 
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEditContract}
                            sx={{
                              flex: 1,
                              bgcolor: '#6b7280',
                              '&:hover': { bgcolor: '#4b5563' }
                            }}
                          >
                            Edit Contract
                          </Button>
                          
                          <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleSaveAsNewContract}
                            sx={{
                              flex: 1,
                              bgcolor: '#7c3aed',
                              '&:hover': { bgcolor: '#6d28d9' }
                            }}
                          >
                            Save as Draft
                          </Button>
                        </>
                      )}
                    </Box>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadPDF}
                      sx={{
                        py: 1.5,
                        borderColor: '#d1d5db',
                        color: '#374151',
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: '#f9fafb'
                        }
                      }}
                    >
                      Download as Text File
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    bgcolor: '#fff'
                  }}
                >
                  <DescriptionIcon 
                    sx={{ 
                      fontSize: 80, 
                      color: '#9ca3af', 
                      mx: 'auto', 
                      mb: 2 
                    }} 
                  />
                  <Typography variant="h6" sx={{ mb: 1, color: '#6b7280' }}>
                    No contract generated yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2 }}>
                    Fill in the contract details and click "Generate Contract" to get started
                  </Typography>
                  {aiStatus && aiStatus.status !== 'available' && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      AI service may be temporarily unavailable. Please try again later.
                    </Alert>
                  )}
                </Paper>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIContractGenerator;