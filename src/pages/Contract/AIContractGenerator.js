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
        },
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
        },
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
        },
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
      setError(`Error generating contract: ${err.message}`);
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
      
      // Set font properties
      pdf.setFont('helvetica', isBold ? 'bold' : fontStyle);
      pdf.setFontSize(fontSize);
      pdf.setTextColor(0, 0, 0);
      
      // Handle title alignment
      if (isTitle) {
        checkNewPage(lineHeight * 2);
        const textWidth = pdf.getTextWidth(text);
        const x = align === 'center' ? (pdfWidth - textWidth) / 2 : margin;
        pdf.text(text, x, currentY);
        currentY += lineHeight * 1.5;
      } else {
        // Split text into lines that fit within the page width
        const words = text.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = pdf.getTextWidth(testLine);
          
          if (textWidth > contentWidth - 10) {
            // Current line is full, print it and start new line
            if (currentLine) {
              checkNewPage();
              pdf.text(currentLine, margin, currentY);
              currentY += lineHeight;
              currentLine = word;
            } else {
              // Single word is too long, force it on the line
              checkNewPage();
              pdf.text(word, margin, currentY);
              currentY += lineHeight;
              currentLine = '';
            }
          } else {
            currentLine = testLine;
          }
        }
        
        // Print the remaining line
        if (currentLine) {
          checkNewPage();
          pdf.text(currentLine, margin, currentY);
          currentY += lineHeight;
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
      
      // Process contract content to preserve formatting
      const processedContent = contractContent
        // Handle bold text patterns
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Handle line breaks and paragraphs
        .replace(/\n\s*\n/g, '</p><p style="margin: 16px 0; page-break-inside: avoid; orphans: 3; widows: 3;">')
        .replace(/\n/g, '<br>')
        // Handle article/section headers
        .replace(/(<strong>ARTICLE\s+\d+[^<]*<\/strong>)/gi, '<div style="page-break-inside: avoid; page-break-before: auto; margin-top: 24px; margin-bottom: 16px;">$1</div>')
        .replace(/(<strong>[^<]*AGREEMENT[^<]*<\/strong>)/gi, '<div style="page-break-inside: avoid; margin-top: 24px; margin-bottom: 16px; text-align: center;">$1</div>')
        .replace(/^/, '<p style="margin: 16px 0; page-break-inside: avoid; orphans: 3; widows: 3;">')
        .replace(/$/, '</p>');
      
      // Create PDF with proper A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20; // 20mm margin on all sides
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      const lineHeight = 6; // 6mm line height
             const maxLinesPerPage = Math.floor((contentHeight - 30) / lineHeight); // Reserve space for 5 blank lines
      
             // Add single diagonal watermark function
       const addWatermark = (pdf) => {
         pdf.setTextColor(200, 200, 200); // Light gray
         pdf.setFontSize(40);
         pdf.setFont('helvetica', 'bold');
         
         // Add single centered diagonal watermark
         pdf.text('MARKETINCER', pageWidth / 2, pageHeight / 2, {
           angle: -45,
           align: 'center'
         });
         
         // Reset text color for content
         pdf.setTextColor(0, 0, 0);
       };
      
      // Split content into lines and pages
      const lines = processedContent.split('<br>');
      const pages = [];
      let currentPage = [];
      let currentLineCount = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/<[^>]*>/g, '').trim(); // Remove HTML tags for line counting
        
        if (line.length > 0) {
          // Estimate number of lines needed for this content
          const estimatedLines = Math.ceil(line.length / 80); // Rough estimate based on character count
          
          if (currentLineCount + estimatedLines > maxLinesPerPage && currentPage.length > 0) {
            // Add 5 blank lines to current page
            for (let j = 0; j < 5; j++) {
              currentPage.push('');
            }
            pages.push(currentPage);
            currentPage = [];
            currentLineCount = 0;
          }
          
          currentPage.push(lines[i]);
          currentLineCount += estimatedLines;
        } else {
          currentPage.push(lines[i]);
          currentLineCount += 1;
        }
      }
      
      // Add remaining content and 5 blank lines to last page
      if (currentPage.length > 0) {
        for (let j = 0; j < 5; j++) {
          currentPage.push('');
        }
        pages.push(currentPage);
      }
      
             // Generate PDF pages
       for (let pageNum = 0; pageNum < pages.length; pageNum++) {
         if (pageNum > 0) {
           pdf.addPage();
         }
         
         // Add single watermark to each page
         addWatermark(pdf);
         
         // Add content
         pdf.setFontSize(12);
         pdf.setFont('helvetica', 'normal');
         
         let yPosition = margin + 10;
        
        for (let lineIndex = 0; lineIndex < pages[pageNum].length; lineIndex++) {
          const line = pages[pageNum][lineIndex];
          const cleanLine = line.replace(/<[^>]*>/g, '').trim();
          
          if (cleanLine.length > 0) {
            // Handle bold text
            if (line.includes('<strong>') && line.includes('</strong>')) {
              pdf.setFont('helvetica', 'bold');
            } else {
              pdf.setFont('helvetica', 'normal');
            }
            
            // Split long lines to fit page width
            const words = cleanLine.split(' ');
            let currentLine = '';
            
            for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
              const word = words[wordIndex];
              const testLine = currentLine + (currentLine ? ' ' : '') + word;
              const textWidth = pdf.getTextWidth(testLine);
              
              if (textWidth > contentWidth && currentLine) {
                pdf.text(currentLine, margin, yPosition);
                yPosition += lineHeight;
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }
            
            if (currentLine) {
              pdf.text(currentLine, margin, yPosition);
              yPosition += lineHeight;
            }
          } else {
            // Empty line
            yPosition += lineHeight;
          }
        }
        continue;
      }
      
      // Save the PDF
      const cleanDocumentType = documentType.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${cleanDocumentType}_${generationDate.replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
      // Show success message
      alert(`PDF exported successfully with ${pages.length} page(s) in standard A4 format!`);
      
      // Check for WHEREAS clauses
      if (cleanLine.startsWith('WHEREAS')) {
        addFormattedText(cleanLine, {
          fontSize: 10,
          addSpaceBefore: lineHeight,
          addSpaceAfter: lineHeight * 0.5
        });
        continue;
      }
      
      // Regular paragraph text
      if (cleanLine.length > 0) {
        const spaceBefore = inRecitals ? lineHeight * 0.5 : lineHeight * 0.3;
        addFormattedText(cleanLine, {
          fontSize: 10,
          addSpaceBefore: spaceBefore,
          addSpaceAfter: lineHeight * 0.3
        });
      }
    }
    
    // Add page numbers
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - 25, pdfHeight - 10);
    }
    
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
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
            {isEditMode ? 'Edit Contract Content' : 
             isCreateFromTemplate ? 'Template Content' : 
             'Generated Contract'}
          </Typography>
          
          {/* Contract Editor */}
          <Paper
            sx={{
              p: 0,
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              mb: 2,
              border: '1px solid #e0e0e0',
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={8}
              value={generatedContract}
              onChange={(e) => setGeneratedContract(e.target.value)}
              variant="outlined"
              placeholder={isCreateFromTemplate ? "Template content will appear here..." : "Generated contract will appear here..."}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: '8px 8px 0 0',
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
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace',
                },
              }}
            />
          </Paper>

          {/* Contract Preview */}
          <Paper
            sx={{
              p: 3,
              bgcolor: '#ffffff',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxHeight: '400px',
              overflow: 'auto',
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
          >
            <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600, borderBottom: '2px solid #2196f3', pb: 1 }}>
              Preview
            </Typography>
            
            <Box
              sx={{
                textAlign: 'left',
                lineHeight: 1.6,
                fontSize: '14px',
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
                __html: formatContractContent(generatedContract || 'No content to preview')
              }}
            />
          </Paper>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
          {isEditMode ? 'Contract Content' : 
           isCreateFromTemplate ? 'Template Content' : 
           'No Contract Generated'}
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
          {isEditMode 
            ? 'Update the contract details and click "Regenerate Contract" to refresh the content.'
            : isCreateFromTemplate 
            ? 'Template content will be loaded automatically. You can modify the content directly and save when ready.'
            : 'Fill in the contract name and description, then click "Generate AI Contract" to create your contract.'
          }
        </Typography>
      </Box>
    );
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
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
        </Box>
      </Layout>
    );
  };

export default AIContractGenerator;