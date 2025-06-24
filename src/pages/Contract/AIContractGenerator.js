import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import Sidebar from '../../components/Sidebar';

const AIContractGenerator = () => {
  // State management
  const [contractName, setContractName] = useState('');
  const [description, setDescription] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);
  const [contractId, setContractId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // API Base URL
  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // Fetch templates when useTemplate is toggled on
  useEffect(() => {
    if (useTemplate) {
      fetchTemplates();
    }
    // eslint-disable-next-line
  }, [useTemplate]);

  // API Functions
  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/templates`);
      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates || []);
        showNotification('Templates loaded successfully', 'success');
      } else {
        showNotification('Failed to fetch templates', 'error');
      }
    } catch (error) {
      showNotification('Error fetching templates', 'error');
      console.error('Error fetching templates:', error);
    }
  };

  const generateAIContract = async () => {
    if (!useTemplate && !description.trim()) {
      showNotification('Please enter a description', 'warning');
      return;
    }

    if (useTemplate && !selectedTemplate) {
      showNotification('Please select a template', 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        description: description,
        use_template: useTemplate,
        template_id: useTemplate ? selectedTemplate : null
      };

      const response = await fetch(`${API_BASE_URL}/contracts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContract(data.contract.content || '');
        setContractId(data.contract.id);
        setContractName(data.contract.name || '');
        showNotification(data.message || 'Contract generated successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to generate contract', 'error');
      }
    } catch (error) {
      showNotification('Error generating contract. Please try again.', 'error');
      console.error('Error generating contract:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAsDraft = async () => {
    if (!generatedContract.trim()) {
      showNotification('No contract content to save', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        contract: {
          name: contractName || `Contract - ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`,
          description: description,
          content: generatedContract,
          contract_type: 0, // service
          category: 3, // freelancer
          status: 0 // draft
        },
        action_type: 'save_draft'
      };

      let response;
      if (contractId) {
        // Update existing contract
        response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new contract
        response = await fetch(`${API_BASE_URL}/contracts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (data.success) {
        setContractId(data.contract.id);
        showNotification(data.message || 'Contract saved as draft successfully!', 'success');
      } else {
        showNotification(data.message || 'Failed to save contract', 'error');
      }
    } catch (error) {
      showNotification('Error saving contract. Please try again.', 'error');
      console.error('Error saving contract:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveContract = async () => {
    if (!generatedContract.trim()) {
      showNotification('No contract content to save', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        contract: {
          name: contractName || `Contract - ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`,
          description: description,
          content: generatedContract,
          contract_type: 0, // service
          category: 3, // freelancer
          status: 2 // signed
        },
        action_type: 'save_contract'
      };

      let response;
      if (contractId) {
        // Update existing contract
        response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new contract
        response = await fetch(`${API_BASE_URL}/contracts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (data.success) {
        setContractId(data.contract.id);
        showNotification(data.message || 'Contract saved and signed successfully!', 'success');
        setTimeout(() => {
          resetForm();
        }, 2000);
      } else {
        showNotification(data.message || 'Failed to save contract', 'error');
      }
    } catch (error) {
      showNotification('Error saving contract. Please try again.', 'error');
      console.error('Error saving contract:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedContract.trim()) {
      showNotification('No contract content to download', 'warning');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([generatedContract], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `contract_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('Contract downloaded successfully!', 'success');
  };

  const resetForm = () => {
    setContractName('');
    setDescription('');
    setGeneratedContract('');
    setContractId(null);
    setUseTemplate(false);
    setSelectedTemplate('');
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, open: false }));
    }, 6000);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f3e8ff' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 100,
          bgcolor: '#1a237e',
          color: 'white',
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Sidebar />
      </Box>

      {/* Page Content */}
      <Box sx={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* TopBar */}
        <Box
          sx={{
            height: 70,
            bgcolor: '#3f298e',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            pl: 4,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: '0.03em',
            mb: 2,
          }}
        >
          AI Contract Generator
        </Box>

        {/* Split Centered Layout */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 6 }}>
          <Grid container spacing={4} sx={{ width: '100%', maxWidth: 1300, px: 2 }}>
            {/* Left Form */}
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ borderRadius: 4, p: 4, minHeight: 520 }}>
                <Typography variant="h4" sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: '#3f298e',
                }}>
                  Contract Details
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useTemplate}
                        onChange={e => setUseTemplate(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label={
                      <Typography sx={{ color: '#3f298e', fontWeight: 600 }}>
                        Use Template
                      </Typography>
                    }
                  />
                </Box>

                {useTemplate && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="template-select-label">Select Template</InputLabel>
                    <Select
                      labelId="template-select-label"
                      value={selectedTemplate}
                      label="Select Template"
                      onChange={e => setSelectedTemplate(e.target.value)}
                    >
                      <MenuItem value="">Choose a template...</MenuItem>
                      {templates.map(t => (
                        <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  label="Contract Name"
                  placeholder="Enter contract name"
                  value={contractName}
                  onChange={e => setContractName(e.target.value)}
                  fullWidth
                  sx={{ mb: 3 }}
                  InputLabelProps={{ style: { color: '#3f298e', fontWeight: 500 } }}
                />

                {!useTemplate && (
                  <TextField
                    label="Description"
                    placeholder="Describe what this contract should cover…"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    multiline
                    rows={5}
                    fullWidth
                    sx={{ mb: 4 }}
                    InputLabelProps={{ style: { color: '#3f298e', fontWeight: 500 } }}
                  />
                )}

                <Button
                  onClick={generateAIContract}
                  disabled={isGenerating || (!description.trim() && !useTemplate) || (useTemplate && !selectedTemplate)}
                  fullWidth
                  variant="contained"
                  sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    mb: 2,
                    bgcolor: '#a084f6',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#7c4dff'
                    }
                  }}
                  startIcon={isGenerating ? <CircularProgress color="inherit" size={22} /> : null}
                >
                  {isGenerating ? 'Generating...' : 'Generate AI Contract'}
                </Button>

                {contractId && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Contract ID: {contractId} - Ready for editing and saving
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Right Preview/Editor */}
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ borderRadius: 4, p: 4, minHeight: 520, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: '#3f298e',
                }}>
                  {generatedContract.trim() ? 'Generated Contract' : 'No Contract Generated'}
                </Typography>

                {generatedContract.trim() ? (
                  <>
                  <TextField
                    multiline
                    rows={10}
                    value={generatedContract}
                    onChange={e => setGeneratedContract(e.target.value)}
                    placeholder="Edit your contract here"
                    fullWidth
                    sx={{ mb: 3 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={saveAsDraft}
                      disabled={!generatedContract.trim() || isSaving}
                      fullWidth
                      startIcon={isSaving ? <CircularProgress color="inherit" size={18} /> : null}
                    >
                      {isSaving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={saveContract}
                      disabled={!generatedContract.trim() || isSaving}
                      fullWidth
                      startIcon={isSaving ? <CircularProgress color="inherit" size={18} /> : null}
                    >
                      {isSaving ? 'Saving...' : 'Save & Sign'}
                    </Button>
                  </Box>
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={!generatedContract.trim()}
                    fullWidth
                    variant="outlined"
                    sx={{
                      mb: 2,
                      borderColor: '#a084f6',
                      color: '#3f298e',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#7c4dff',
                        bgcolor: '#f3e8ff'
                      }
                    }}
                  >
                    Download Contract
                  </Button>
                  </>
                ) : (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}>
                    <Box sx={{
                      mb: 2,
                      p: 3,
                      borderRadius: '50%',
                      bgcolor: '#f3e8ff'
                    }}>
                      <svg width={48} height={48} fill="#a084f6" viewBox="0 0 24 24">
                        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2h7v5h5v13H6zm8 0.5L18.5 8H14z"/>
                      </svg>
                    </Box>
                    <Typography variant="h6" sx={{ color: '#3f298e', fontWeight: 700, mb: 1 }}>
                      No Contract Generated
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#836fff', textAlign: 'center', mb: 2 }}>
                      Fill in the contract name and description, then click "Generate AI Contract" to create your contract.
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />
                <Button
                  onClick={resetForm}
                  fullWidth
                  variant="text"
                  color="secondary"
                  sx={{ fontWeight: 600 }}
                >
                  Start New Contract
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AIContractGenerator;