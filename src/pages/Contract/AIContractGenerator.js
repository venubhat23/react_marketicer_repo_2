import React, { useState } from 'react';
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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');

  const API_BASE_URL = 'http://localhost:3001/api/v1';

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/contracts');
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
          use_template: formData.useTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate contract: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedContract(data.contract || 'Contract generated successfully');
      
    } catch (err) {
      setError(`Error generating contract: ${err.message}`);
      console.error('Error generating contract:', err);
    } finally {
      setLoading(false);
    }
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
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

                    {/* Generate Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleGenerateContract}
                      disabled={loading}
                      sx={{
                        bgcolor: '#e0e0e0',
                        color: '#666',
                        textTransform: 'none',
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&:hover': {
                          bgcolor: '#d0d0d0',
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
                    {generatedContract ? (
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                          Generated Contract
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
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#333' }}>
                            {generatedContract}
                          </Typography>
                        </Paper>
                        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Button
                            variant="contained"
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
                            Save Contract
                          </Button>
                          <Button
                            variant="outlined"
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
                            Edit Contract
                          </Button>
                        </Box>
                      </Box>
                    ) : (
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
                          Fill in the contract name and description, then click "Generate AI Contract" to create your contract.
                        </Typography>
                      </Box>
                    )}
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