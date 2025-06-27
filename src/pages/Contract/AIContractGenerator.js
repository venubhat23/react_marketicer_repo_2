import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";

const AIContractGenerator = ({ onBack = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractName: '',
    description: '',
    useTemplate: false,
    selectedTemplate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [showContractContent, setShowContractContent] = useState(false);

  const API_BASE_URL = 'https://api.marketincer.com/api/v1';

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
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
      setLoadingTemplates(false);
    }
  };

  // Load templates when use template is toggled on
  useEffect(() => {
    if (formData.useTemplate) {
      fetchTemplates();
    } else {
      // Reset template selection when toggled off
      setFormData(prev => ({
        ...prev,
        selectedTemplate: '',
      }));
      setGeneratedContract('');
      setShowContractContent(false);
    }
  }, [formData.useTemplate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If template is selected, load its data
    if (field === 'selectedTemplate' && value) {
      const selectedTemplate = templates.find(template => template.id === value);
      if (selectedTemplate) {
        setFormData(prev => ({
          ...prev,
          contractName: selectedTemplate.name || '',
          description: selectedTemplate.description || '',
        }));
        // Load template content to the right side
        setGeneratedContract(selectedTemplate.template || selectedTemplate.content || selectedTemplate.description || 'Template content loaded successfully');
        setShowContractContent(true);
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/contracts');
    }
  };

  const handleSaveContract = async (isDraft = false) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract: {
            name: formData.contractName,
            description: formData.description,
            content: generatedContract,
            status: isDraft ? 'draft' : 'active',
            contract_type: formData.useTemplate ? 'template' : 'service',
            category: 'freelancer',
            action: isDraft ? 'draft' : 'pending'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save contract: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Show success message or redirect
      alert(isDraft ? 'Contract saved as draft!' : 'Contract saved successfully!');
      
      // Navigate back to contracts page
      handleBack();
      
    } catch (err) {
      setError(`Error saving contract: ${err.message}`);
      console.error('Error saving contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContract = async () => {
    if (!formData.contractName.trim() || !formData.description.trim()) {
      setError('Please fill in both contract name and description');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.contractName,
          description: formData.description,
          use_template: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate contract: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedContract(data.contract?.content || 'Contract generated successfully');
      setShowContractContent(true);
      
    } catch (err) {
      setError(`Error generating contract: ${err.message}`);
      console.error('Error generating contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderRightPanel = () => {
    if (showContractContent) {
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
            {formData.useTemplate ? 'Template Content' : 'Generated Contract'}
          </Typography>
          <Paper
            sx={{
              p: 3,
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              textAlign: 'left',
              maxHeight: '400px',
              overflow: 'auto',
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={15}
              value={generatedContract}
              onChange={(e) => setGeneratedContract(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '1px solid #2196f3',
                  },
                },
              }}
            />
          </Paper>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => handleSaveContract(false)}
              disabled={loading}
              sx={{
                bgcolor: '#2196f3',
                textTransform: 'none',
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#1976d2',
                },
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSaveContract(true)}
              disabled={loading}
              sx={{
                color: '#2196f3',
                borderColor: '#2196f3',
                textTransform: 'none',
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1976d2',
                  bgcolor: 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Save as Draft'}
            </Button>
          </Box>
        </Box>
      );
    }

    // Empty state
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        {/* Document Icon */}
        <Box sx={{ 
          mb: 3,
          p: 4,
          borderRadius: '50%',
          bgcolor: '#e3f2fd'
        }}>
          <DescriptionIcon sx={{ fontSize: 64, color: '#90caf9' }} />
        </Box>
        
        <Typography variant="h6" sx={{ mb: 1, color: '#999', fontWeight: 600 }}>
          No Contract Generated
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: '#999', 
            maxWidth: 300,
            textAlign: 'center',
            lineHeight: 1.6
          }}
        >
          {formData.useTemplate 
            ? 'Select a template from the dropdown to load its content here.'
            : 'Fill in the contract name and description, then click "Generate AI Contract" to create your contract.'
          }
        </Typography>
      </Box>
    );
  };

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
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  AI Contract Generator
                </Typography>
              </Box>
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

          {/* Main Content */}
          <Box sx={{ padding: '24px' }}>
            <Grid container spacing={3}>
              {/* Left Panel - Contract Details Form */}
              <Grid size={{ md: 6 }}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 4 }}>
                    {/* Contract Details Header */}
                    <Box
                      sx={{
                        display: 'inline-block',
                        bgcolor: '#2196f3',
                        color: 'white',
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        mb: 4,
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}
                    >
                      Contract Details
                    </Box>

                    {/* Use Template Toggle */}
                    <Box sx={{ mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.useTemplate}
                            onChange={(e) => handleInputChange('useTemplate', e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#2196f3',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#2196f3',
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ color: '#666', fontWeight: 500 }}>
                            Use Template
                          </Typography>
                        }
                      />
                    </Box>

                    {/* Template Selection Dropdown - Only show when Use Template is ON */}
                    {formData.useTemplate && (
                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 1, 
                            color: '#333', 
                            fontWeight: 500 
                          }}
                        >
                          Select Template
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            value={formData.selectedTemplate}
                            onChange={(e) => handleInputChange('selectedTemplate', e.target.value)}
                            displayEmpty
                            sx={{
                              borderRadius: 2,
                              bgcolor: '#f8f9fa',
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2196f3',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2196f3',
                              },
                            }}
                          >
                            <MenuItem value="" disabled>
                              {loadingTemplates ? 'Loading templates...' : 'Choose a template'}
                            </MenuItem>
                            {templates.map((template) => (
                              <MenuItem key={template.id} value={template.id}>
                                {template.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    {/* Contract Name Field */}
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          fontWeight: 500 
                        }}
                      >
                        Contract Name
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter contract name"
                        variant="outlined"
                        value={formData.contractName}
                        onChange={(e) => handleInputChange('contractName', e.target.value)}
                        disabled={formData.useTemplate && formData.selectedTemplate}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: formData.useTemplate && formData.selectedTemplate ? '#f5f5f5' : '#f8f9fa',
                            '&:hover fieldset': {
                              borderColor: '#2196f3',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2196f3',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Description Field */}
                    <Box sx={{ mb: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          fontWeight: 500 
                        }}
                      >
                        Description
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Describe what this contract should cover..."
                        variant="outlined"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={formData.useTemplate && formData.selectedTemplate}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: formData.useTemplate && formData.selectedTemplate ? '#f5f5f5' : '#f8f9fa',
                            '&:hover fieldset': {
                              borderColor: '#2196f3',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#2196f3',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Generate Button - Only show when Use Template is OFF */}
                    {!formData.useTemplate && (
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleGenerateContract}
                        disabled={loading}
                        sx={{
                          bgcolor: '#2196f3',
                          color: 'white',
                          textTransform: 'none',
                          py: 2,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': {
                            bgcolor: '#1976d2',
                          },
                          '&:disabled': {
                            bgcolor: '#f5f5f5',
                            color: '#999',
                          },
                        }}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                      >
                        {loading ? 'Generating...' : 'Generate AI Contract'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Panel - Generated Contract Display */}
              <Grid size={{ md: 6 }}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    height: 'fit-content',
                    minHeight: '500px'
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    {renderRightPanel()}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIContractGenerator;