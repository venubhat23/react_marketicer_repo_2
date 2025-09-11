import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
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
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from "../../components/Layout";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../../components/Sidebar';
import {Link} from 'react-router-dom';

const AIContractGenerator = ({ onBack = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check the mode - edit, create from template, or create new
  const isEditMode = location.state?.editMode || false;
  const isCreateFromTemplate = location.state?.createFromTemplate || false;
  const contractData = location.state?.contractData || null;
  const templateData = location.state?.templateData || null;
  
  const [formData, setFormData] = useState({
    contractName: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const [showContractContent, setShowContractContent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = 'https://api.marketincer.com/api/v1';

  // Load contract data if in edit mode or template data if creating from template
  useEffect(() => {
    if (isEditMode && contractData) {
      setFormData({
        contractName: contractData.name || '',
        description: contractData.description || '',
      });
      
      // If contract has content, show it immediately
      if (contractData.content) {
        setGeneratedContract(contractData.content);
        setShowContractContent(true);
      }
    } else if (isCreateFromTemplate && templateData) {
      setFormData({
        contractName: templateData.name || '',
        description: templateData.description || '',
      });
      
      // For template mode, show template_content immediately
      const templateContent = templateData.template_content || templateData.content || '';
      if (templateContent) {
        setGeneratedContract(templateContent);
        setShowContractContent(true);
      }
    }
  }, [isEditMode, isCreateFromTemplate, contractData, templateData]);

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

  const handleSaveContract = async (isDraft = false) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          contract: {
            name: formData.contractName,
            description: formData.description,
            content: generatedContract,
            status: isDraft ? 'draft' : 'active',
            contract_type: isCreateFromTemplate ? (templateData?.contract_type || templateData?.type || 'service') : 'service',
            category: isCreateFromTemplate ? (templateData?.category || 'freelancer') : 'freelancer',
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

  const handleUpdateContract = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/contracts/${contractData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          contract: {
            name: formData.contractName,
            description: formData.description,
            content: generatedContract,
            status: contractData.status || 'active',
            contract_type: contractData.contract_type || 'service',
            category: contractData.category || 'freelancer',
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contract: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Show success message
      alert('Contract updated successfully!');
      
      // Navigate back to contracts page
      handleBack();
      
    } catch (err) {
      setError(`Error updating contract: ${err.message}`);
      console.error('Error updating contract:', err);
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
      
      const requestBody = {
        name: formData.contractName,
        description: formData.description,
        use_template: isCreateFromTemplate,
      };

      // If creating from template, include template ID
      if (isCreateFromTemplate && templateData?.id) {
        requestBody.template_id = templateData.id;
      }
      
      const response = await fetch(`${API_BASE_URL}/contracts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate contract: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Updated to handle the new API response structure
      if (data.success && data.contract_content) {
        setGeneratedContract(data.contract_content);
        setShowContractContent(true);
      } else if (data.success && data.ai_log && data.ai_log.generated_content) {
        setGeneratedContract(data.ai_log.generated_content);
        setShowContractContent(true);
      } else {
        // Fallback for other response structures
        setGeneratedContract(data.contract?.content || data.generated_content || 'Contract generated successfully');
        setShowContractContent(true);
      }
      
    } catch (err) {
      console.error('Full error object:', err);
      
      // More detailed error handling
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else if (err.message.includes('CORS')) {
        setError('CORS error: Please contact support for API access configuration.');
      } else {
        setError(`Error generating contract: ${err.message}`);
      }
      console.error('Error generating contract:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine the page title based on mode
  const getPageTitle = () => {
    if (isEditMode) return 'Edit Contract';
    if (isCreateFromTemplate) return 'Create Contract from Template';
    return 'AI Contract Generator';
  };

  // Determine the button text based on mode
  const getGenerateButtonText = () => {
    if (loading) return 'Generating...';
    if (isEditMode) return 'Regenerate Contract';
    return 'Generate AI Contract';
  };

  // PDF Export function with simplified A4 layout
  const handleExportPDF = async () => {
    if (!generatedContract) {
      setError('No contract content to export');
      return;
    }

    try {
      setLoading(true);
      
      const contractContent = generatedContract;
      
      // Extract document type from content
      const extractDocumentType = (content) => {
        const lines = content.split('\n');
        for (const line of lines) {
          const cleanLine = line.trim().toUpperCase();
          if (cleanLine.includes('AGREEMENT') || cleanLine.includes('CONTRACT')) {
            return cleanLine;
          }
        }
        return 'AGREEMENT'; // Default fallback
      };
      
      const documentType = extractDocumentType(contractContent);
      
      // Generate current date
      const now = new Date();
      const generationDate = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      // Process contract content with better formatting
      const lines = contractContent.split('\n');
      const processedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line) {
          // Remove markdown headers (# symbols)
          line = line.replace(/^#+\s*/, '');
          // Handle markdown bold formatting
          line = line.replace(/\*\*([^*]+)\*\*/g, '$1');
          // Remove any remaining # symbols
          line = line.replace(/#/g, '');
          // Replace SERVICE AGREEMENT and CONTRACT AGREEMENT with COLLABORATION AGREEMENT
          line = line.replace(/SERVICE AGREEMENT/gi, 'COLLABORATION AGREEMENT');
          line = line.replace(/CONTRACT AGREEMENT/gi, 'COLLABORATION AGREEMENT');
          processedLines.push(line);
        } else {
          // Add empty line for spacing
          processedLines.push('');
        }
      }
      
      // Create PDF with proper A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 25; // 25mm margin on all sides for better readability
      const contentWidth = pageWidth - (margin * 2);
      const lineHeight = 5; // 5mm line height for compact spacing
      let yPosition = margin;
      
      // Add watermark function
      const addWatermark = () => {
        pdf.setGState(new pdf.GState({opacity: 0.1}));
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(50);
        pdf.setFont('helvetica', 'bold');
        
        const watermarkText = 'MARKETINCER';
        const textWidth = pdf.getTextWidth(watermarkText);
        const x = (pageWidth - textWidth) / 2;
        const y = pageHeight / 2;
        
        pdf.text(watermarkText, x, y, {
          angle: -45,
          align: 'center'
        });
        
        // Reset state
        pdf.setGState(new pdf.GState({opacity: 1}));
        pdf.setTextColor(0, 0, 0);
      };
      
      // Add watermark to first page
      addWatermark();
      
      // Set default font
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Process each line with proper formatting
      for (let i = 0; i < processedLines.length; i++) {
        const line = processedLines[i];
        const nextLine = i < processedLines.length - 1 ? processedLines[i + 1] : '';
        
        // Check if we need a new page with better margin
        if (yPosition > pageHeight - margin - 40) {
          pdf.addPage();
          addWatermark();
          yPosition = margin;
          // Reset font state on new page to prevent font bleeding
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
        }
        
        if (line === '') {
          // Empty line for spacing
          yPosition += lineHeight * 0.3;
          continue;
        }
        
        // Detect main title (COLLABORATION AGREEMENT or CONTRACT AGREEMENT)
        const isMainTitle = line.toUpperCase().includes('COLLABORATION AGREEMENT') || 
                           line.toUpperCase().includes('CONTRACT AGREEMENT');
        
        // Detect headers (lines in all caps or with specific patterns)
        const isHeader = !isMainTitle && line.toUpperCase() === line && line.length > 3 && 
                        (line.includes('ARTICLE') || line.includes('AGREEMENT') || 
                         line.includes('CONTRACT') || line.includes('TERMS') ||
                         line.includes('PAYMENT') || line.includes('TIMELINE') ||
                         line.includes('DESCRIPTION') || line.includes('SIGNATURES'));
        
        // Detect section numbering (1., 2., etc.)
        const isNumberedSection = /^\d+\.\s/.test(line);
        
        // Detect bullet points
        const isBulletPoint = line.startsWith('- ') || line.startsWith('• ');
        
        // Check if this is the end of a section (current line is content and next line is a header or empty)
        const isEndOfSection = !isHeader && !isNumberedSection && !isMainTitle && 
                              (nextLine === '' || 
                               (nextLine && (nextLine.toUpperCase() === nextLine || /^\d+\.\s/.test(nextLine))));
        
        // Set font style based on content type (no spacing before points)
        if (isMainTitle) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(16);
          pdf.setTextColor(0, 100, 200); // Blue color
          yPosition += lineHeight * 0.5; // Space before main title only
        } else if (isHeader) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0); // Reset to black
          // No extra space before headers/points
        } else if (isNumberedSection) {
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0); // Reset to black
          // No extra space before numbered sections/points
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0); // Reset to black
          // No extra space before regular content
        }
        
        // Handle text wrapping and alignment
        const words = line.split(' ');
        let currentLine = '';
        let xPosition = margin;
        
        // Add indentation for bullet points
        if (isBulletPoint) {
          xPosition = margin + 5;
        }
        
        // Special handling for main title (center alignment)
        if (isMainTitle) {
          const titleWidth = pdf.getTextWidth(line);
          xPosition = (pageWidth - titleWidth) / 2; // Center align
          pdf.text(line, xPosition, yPosition);
        } else {
          // Regular text wrapping for other content
          for (let j = 0; j < words.length; j++) {
            const word = words[j];
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = pdf.getTextWidth(testLine);
            
            if (textWidth > contentWidth - (xPosition - margin) && currentLine) {
              // Print current line and start new line
              pdf.text(currentLine, xPosition, yPosition);
              yPosition += lineHeight;
              
              // Check if we need a new page mid-paragraph
              if (yPosition > pageHeight - margin - 20) {
                pdf.addPage();
                addWatermark();
                yPosition = margin;
              }
              
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          
          // Print the remaining text
          if (currentLine) {
            // Check if we have enough space for this line
            if (yPosition > pageHeight - margin - 40) {
              pdf.addPage();
              addWatermark();
              yPosition = margin;
              // Reset font state on new page
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(11);
              pdf.setTextColor(0, 0, 0);
            }
            pdf.text(currentLine, xPosition, yPosition);
          }
        }
        
        // Move to next line
        yPosition += lineHeight;
        
        // Add spacing only when sections actually end, not after headers
        if (isMainTitle) {
          yPosition += lineHeight * 0.5; // Space after main title
          // Reset font after main title to prevent affecting subsequent content
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
        } else if (isEndOfSection) {
          yPosition += lineHeight * 1; // 1 spacing after section content ends
        }
        // No spacing after headers like "Payment" - content should start immediately below
      }
      
      // Add page numbers with proper font reset
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        // Ensure font is properly set for page numbers
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, {
          align: 'right'
        });
      }
      
      // Final reset to ensure clean state
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      // Save the PDF
      const cleanDocumentType = documentType.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${cleanDocumentType}_${generationDate.replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
      alert(`PDF exported successfully with ${totalPages} page(s)!`);
      
    } catch (err) {
      setError(`Error exporting PDF: ${err.message}`);
      console.error('Error exporting PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderRightPanel = () => {
    // Always show content if available (for both edit mode and template mode)
    if (showContractContent || (isCreateFromTemplate && generatedContract)) {
      // Convert ** text ** to bold HTML
      const formatContractContent = (text) => {
        return text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br/>')
          .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      };

      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Edit/Clear Controls */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#f8f9fa'
          }}>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
              {isEditMode ? 'Edit Contract Content' : 
               isCreateFromTemplate ? 'Template Content' : 
               'Generated Contract'}
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 400, ml: 2 }}>
                {generatedContract ? `${generatedContract.length} characters` : 'No content'}
              </Typography>
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setGeneratedContract('')}
                sx={{
                  color: '#f44336',
                  borderColor: '#f44336',
                  textTransform: 'none',
                  fontSize: '12px',
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#d32f2f',
                    bgcolor: 'rgba(244, 67, 54, 0.04)',
                  },
                }}
              >
                Clear
              </Button>
              <Button
                variant={isEditing ? "contained" : "outlined"}
                size="small"
                onClick={() => setIsEditing(!isEditing)}
                sx={{
                  color: isEditing ? '#fff' : '#2196f3',
                  bgcolor: isEditing ? '#2196f3' : 'transparent',
                  borderColor: '#2196f3',
                  textTransform: 'none',
                  fontSize: '12px',
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#1976d2',
                    bgcolor: isEditing ? '#1976d2' : 'rgba(33, 150, 243, 0.04)',
                  },
                }}
              >
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            </Box>
          </Box>

          {/* Editable Preview Area - Full Height */}
          <Box sx={{ 
            flex: 1, 
            p: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {isEditing ? (
              // Edit Mode - Full screen text editor
              <TextField
                fullWidth
                multiline
                value={generatedContract}
                onChange={(e) => setGeneratedContract(e.target.value)}
                variant="outlined"
                placeholder={isCreateFromTemplate ? "Template content will appear here..." : "Generated contract will appear here..."}
                sx={{
                  height: '100%',
                  '& .MuiOutlinedInput-root': {
                    height: '100%',
                    bgcolor: '#ffffff',
                    borderRadius: 0,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                    '& textarea': {
                      height: '100% !important',
                      overflow: 'auto !important',
                      padding: '24px !important',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#333',
                      '&::placeholder': {
                        color: '#999',
                        opacity: 0.7,
                      },
                    },
                  },
                }}
              />
            ) : (
              // Preview Mode - Formatted display
              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  bgcolor: '#ffffff',
                  overflow: 'auto',
                  cursor: 'text',
                  minHeight: '100%',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#a8a8a8',
                    },
                  },
                }}
                onClick={() => setIsEditing(true)}
              >
                {generatedContract ? (
                  <Box
                    sx={{
                      textAlign: 'left',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#333',
                      '& strong': {
                        fontWeight: 700,
                        color: '#1976d2',
                      },
                      '& br': {
                        marginBottom: '8px',
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formatContractContent(generatedContract)
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    color: '#999',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {isCreateFromTemplate ? "Template content will appear here..." : "Generated contract will appear here..."}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', opacity: 0.7 }}>
                      Click here to start typing or use the Generate button
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isEditMode ? (
              // Edit mode - Show Update and Export PDF buttons
              <>
                <Button
                  variant="contained"
                  onClick={handleUpdateContract}
                  disabled={loading}
                  sx={{
                    bgcolor: '#4caf50',
                    textTransform: 'none',
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#388e3c',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Update Contract'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleExportPDF}
                  disabled={loading}
                  sx={{
                    color: '#ff5722',
                    borderColor: '#ff5722',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#e64a19',
                      bgcolor: 'rgba(255, 87, 34, 0.04)',
                    },
                  }}
                  startIcon={<PictureAsPdfIcon />}
                >
                  Export PDF
                </Button>
              </>
            ) : (
              // Create mode (both new and from template) - Show Save, Save as Draft, and Export PDF buttons
              <>
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
                <Button
                  variant="outlined"
                  onClick={handleExportPDF}
                  disabled={loading}
                  sx={{
                    color: '#ff5722',
                    borderColor: '#ff5722',
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#e64a19',
                      bgcolor: 'rgba(255, 87, 34, 0.04)',
                    },
                  }}
                  startIcon={<PictureAsPdfIcon />}
                >
                  Export PDF
                </Button>
              </>
            )}
          </Box>
        </Box>
      );
    }

    // Empty state
    return (
      <Box sx={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 4
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
        
        <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600, textAlign: 'center' }}>
          {isEditMode ? 'Contract Content' : 
           isCreateFromTemplate ? 'Template Content' : 
           'No Contract Generated'}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: '#666', 
            maxWidth: 400,
            textAlign: 'center',
            lineHeight: 1.6,
            fontSize: '14px'
          }}
        >
          {isEditMode 
            ? 'Update the contract details and click "Regenerate Contract" to refresh the content.'
            : isCreateFromTemplate 
            ? 'Template content will be loaded automatically. You can modify the content directly and save when ready.'
            : 'Fill in the contract name and description, then click "Generate AI Contract" to create your contract.'
          }
        </Typography>
        
        {!isCreateFromTemplate && (
          <Box sx={{ 
            p: 3, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2, 
            border: '1px dashed #ccc',
            textAlign: 'center',
            maxWidth: 300
          }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
              💡 Tip: Be specific in your description to get better AI-generated contracts
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <Grid container>
           <Grid size={{ md: 1 }} className="side_section"> <Sidebar/></Grid>
            <Grid size={{ md: 11 }}>
              {/* Header - Updated color to #091a48 */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: '#091a48', // Updated color
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
                  {getPageTitle()}
                </Typography>
                {isCreateFromTemplate && templateData && (
                  <Typography variant="body2" sx={{ ml: 2, opacity: 0.8 }}>
                    Template: {templateData.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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

          {/* Main Content */}
          <Box sx={{ padding: '24px' }}>
            <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
              {/* Left Panel - Contract Details Form */}
              <Grid size={{ md: 5 }}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 4, height: '100%' }}>
                    {/* Template Info (if creating from template) */}
                    {isCreateFromTemplate && templateData && (
                      <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 600 }}>
                          Creating from template: {templateData.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                          Type: {templateData.type || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                          {templateData.description || 'No description available'}
                        </Typography>
                      </Box>
                    )}

                    {/* Contract Name Field */}
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1, 
                          color: '#333', 
                          //fontWeight: 500 
                        }}
                      >
                        Contract Name
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter contract name"
                        variant="outlined"
                        size='small'
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
                        size='small'
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

                    {/* Generate Button - Only show for new contracts, not for template mode */}
                    {!isCreateFromTemplate && (
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
                        {getGenerateButtonText()}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Panel - Generated Contract Display */}
              <Grid size={{ md: 7 }}>
                <Card 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
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