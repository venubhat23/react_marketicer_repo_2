import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import Sidebar from "../../components/Sidebar";

const AIContractGenerator = ({ onBack }) => {
  const [contractDescription, setContractDescription] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContract, setEditableContract] = useState('');

  const handleGenerateContract = async () => {
    if (!contractDescription.trim()) {
      alert('Please enter a contract description');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI contract generation
    setTimeout(() => {
      const generated = `CONTRACT AGREEMENT

This Agreement is entered into on ${new Date().toLocaleDateString()} between the parties for the following purpose:

${contractDescription}

TERMS AND CONDITIONS:

1. SCOPE OF WORK
   The service provider agrees to deliver the specified services as outlined in the contract description above.

2. PAYMENT TERMS
   Payment shall be made according to the agreed schedule and terms specified during negotiations.

3. DURATION
   This contract shall remain in effect for the duration specified in the agreement or until completion of services.

4. RESPONSIBILITIES
   Both parties agree to fulfill their respective obligations as outlined in this agreement.

5. TERMINATION
   Either party may terminate this agreement with proper notice as specified in the terms.

6. GOVERNING LAW
   This agreement shall be governed by applicable laws and regulations.

By signing below, both parties acknowledge and agree to the terms and conditions set forth in this contract.

_____________________                    _____________________
Party A Signature                       Party B Signature

Date: _______________                    Date: _______________`;

      setGeneratedContract(generated);
      setEditableContract(generated);
      setIsGenerating(false);
    }, 2000);
  };

  const handleLoadPreset = () => {
    setContractDescription('This is a standard collaboration agreement for social media content creation between an influencer and a brand. The agreement covers content deliverables, usage rights, payment terms, and performance metrics.');
  };

  const handleEditContract = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setGeneratedContract(editableContract);
    setIsEditing(false);
  };

  const handleSaveDraft = () => {
    alert('Contract draft saved successfully!');
  };

  const handleDownloadPDF = () => {
    // Create a simple text file download (in real app, you'd use a PDF library)
    const element = document.createElement('a');
    const file = new Blob([generatedContract], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'contract.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
              </Typography>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box sx={{ height: 'calc(100vh - 73px)', display: 'flex' }}>
            {/* Left Section - Contract Description */}
            <Box sx={{ 
              width: '50%', 
              p: 4, 
              bgcolor: '#fff',
              borderRight: '1px solid #e0e0e0'
            }}>
              <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#091a48' }}>
                Contract Description
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={12}
                value={contractDescription}
                onChange={(e) => setContractDescription(e.target.value)}
                placeholder="Enter a description..."
                variant="outlined"
                sx={{ mb: 4 }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <DescriptionIcon />}
                  onClick={handleGenerateContract}
                  disabled={isGenerating}
                  sx={{
                    bgcolor: '#7c3aed',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#6d28d9',
                    },
                  }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Contract'}
                </Button>

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
                  Load Preset
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

                  {/* Navigation arrows */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                    <IconButton 
                      sx={{ 
                        bgcolor: '#091a48', 
                        color: '#fff',
                        '&:hover': { bgcolor: '#1e293b' }
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        bgcolor: '#091a48', 
                        color: '#fff',
                        '&:hover': { bgcolor: '#1e293b' }
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {isEditing ? (
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
                      ) : (
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
                      )}
                      
                      <Button
                        variant="contained"
                        onClick={handleSaveDraft}
                        sx={{
                          flex: 1,
                          bgcolor: '#7c3aed',
                          '&:hover': { bgcolor: '#6d28d9' }
                        }}
                      >
                        Save Draft
                      </Button>
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
                      Download PDF
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
                  <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                    Enter a description and click "Generate Contract" to get started
                  </Typography>
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