import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Sidebar from '../../components/Sidebar';

const AIContractGenerator = () => {
  // State management
  const [contractName, setContractName] = useState('');
  const [description, setDescription] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templates, setTemplates] = useState([]);

  // API Base URL
  const API_BASE_URL = 'http://localhost:3001/api/v1';

  // Fetch templates when useTemplate is toggled on
  useEffect(() => {
    if (useTemplate) {
      fetchTemplates();
    }
    // eslint-disable-next-line
  }, [useTemplate]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contracts/templates`);
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates || []);
      }
    } catch (error) {
      // Handle error (optional for this minimal version)
    }
  };

  // Button disabled logic
  const canGenerate =
    useTemplate
      ? !!selectedTemplate
      : !!description.trim();

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      minWidth: '100vw',
      bgcolor: '#f3f4fa',
      m: 0,
      p: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Sidebar as overlay, or remove if not wanted */}
      <Box
        sx={{
          width: 80,
          bgcolor: '#22277a',
          color: 'white',
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <Sidebar />
      </Box>
      {/* Content Area */}
      <Box sx={{
        flex: 1,
        minHeight: '100vh',
        minWidth: '100vw',
        bgcolor: '#f3f4fa',
        display: 'flex',
        flexDirection: 'column',
        ml: { sm: '80px' }, // shift content for sidebar on desktop
        p: 0,
        m: 0,
      }}>
        {/* TopBar */}
        <Box
          sx={{
            width: '100%',
            height: 64,
            bgcolor: '#232c85',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            pl: 4,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: '0.03em',
            position: 'relative',
          }}
        >
          AI Contract Generator
        </Box>
        {/* Split Layout */}
        <Grid container sx={{
          flex: 1,
          p: 0,
          m: 0,
          height: 'calc(100vh - 64px)',
          width: '100vw',
        }}>
          {/* Form Side */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              px: { xs: 2, md: 10 },
              pt: 6,
              bgcolor: '#fff',
              minHeight: '100%',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 4,
                color: '#2a2ab0',
                background: 'linear-gradient(90deg,#5f44f6 60%,#2a2ab0 100%)',
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                fontSize: { xs: 24, md: 32 },
                lineHeight: 1.2,
              }}
            >
              Contract Details
            </Typography>

            {/* Card-like form area */}
            <Paper
              elevation={1}
              sx={{
                px: 4,
                pt: 3,
                pb: 1.5,
                mb: 3,
                borderRadius: 3,
                width: '100%',
                maxWidth: 500,
                minWidth: { xs: '90%', md: 360 },
                boxShadow: '0px 2px 16px 0px #eee',
              }}
            >
              {/* Use Template Switch */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 16, color: '#45489a', mr: 2 }}>
                  Use Template
                </Typography>
                <Switch
                  checked={useTemplate}
                  onChange={e => setUseTemplate(e.target.checked)}
                  color="primary"
                />
              </Box>

              {useTemplate && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="template-select-label">Select Template</InputLabel>
                  <Select
                    labelId="template-select-label"
                    value={selectedTemplate}
                    label="Select Template"
                    onChange={e => setSelectedTemplate(e.target.value)}
                  >
                    <MenuItem value="">Choose a template...</MenuItem>
                    {templates.map(t => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Paper>

            <Typography sx={{ mt: 1, mb: 1, fontWeight: 500, color: '#45489a', fontSize: 15 }}>
              Contract Name
            </Typography>
            <TextField
              placeholder="Enter contract name"
              value={contractName}
              onChange={e => setContractName(e.target.value)}
              fullWidth
              sx={{
                mb: 2,
                maxWidth: 500,
                background: '#fafaff',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  fontSize: 16,
                  color: '#7a7ab8',
                },
              }}
              InputProps={{
                style: { fontWeight: 500 },
              }}
            />

            {!useTemplate && (
              <>
                <Typography sx={{ mt: 2, mb: 1, fontWeight: 500, color: '#45489a', fontSize: 15 }}>
                  Description
                </Typography>
                <TextField
                  placeholder="Describe what this contract should cover..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={5}
                  sx={{
                    mb: 2,
                    maxWidth: 500,
                    background: '#fafaff',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      fontSize: 16,
                      color: '#b6aee4',
                    },
                  }}
                  InputProps={{
                    style: { fontWeight: 500, color: '#a098d4' },
                  }}
                />
              </>
            )}

            <Button
              fullWidth
              variant="contained"
              disabled={!canGenerate}
              sx={{
                mt: 2,
                maxWidth: 500,
                py: 1.4,
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 2,
                background: !canGenerate ? '#eee' : 'linear-gradient(90deg,#b9a3fa,#7c5dfa)',
                color: !canGenerate ? '#bbb' : '#fff',
                boxShadow: 'none',
                textTransform: 'none',
                '&:hover': {
                  background: canGenerate
                    ? 'linear-gradient(90deg,#a184e9,#5f44f6)'
                    : '#eee',
                },
              }}
              startIcon={
                <svg width={22} height={22} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13 8L12 14L11 8L12 2M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 0C9.79 0 8 1.79 8 4S9.79 8 12 8 16 6.21 16 4 14.21 0 12 0Z"/>
                </svg>
              }
            >
              Generate AI Contract
            </Button>
          </Grid>
          {/* Preview Side */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              bgcolor: '#f8f9fb',
              minHeight: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              pt: 10,
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            {/* Empty State */}
            {!generatedContract && (
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 90,
                      height: 90,
                      background: '#e6e6f7',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width={54} height={54} fill="#a7a7e4" viewBox="0 0 24 24">
                      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2h7v5h5v13H6zm8 0.5L18.5 8H14z"/>
                    </svg>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#3f3f64', fontSize: 22 }}>
                  No Contract Generated
                </Typography>
                <Typography sx={{ color: '#8d8dc5', fontSize: 16, mt: 1, maxWidth: 350 }}>
                  Fill in the contract name and description, then click
                  <span style={{ color: '#6c63ff', fontWeight: 600 }}> "Generate AI Contract"</span> to create your contract.
                </Typography>
              </Box>
            )}
            {/* You can add contract preview/editor here when generatedContract exists */}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AIContractGenerator;