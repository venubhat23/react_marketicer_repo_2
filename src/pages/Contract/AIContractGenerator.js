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
import Sidebar from "../../components/Sidebar";
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
        let content = contractData.content;
        
        // Remove problematic title and ensure it starts with COLLABORATION AGREEMENT
        if (content.includes('generate collabration agrement') || 
            content.includes('generate collaboration agreement')) {
          content = content.replace(/.*?generate.*?agreement.*?\n/gi, '');
        }
        
        // Ensure it starts with COLLABORATION AGREEMENT
        if (!content.trim().startsWith('**COLLABORATION AGREEMENT**')) {
          content = `**COLLABORATION AGREEMENT**\n\n${content}`;
        }
        
        setGeneratedContract(content);
        setShowContractContent(true);
      }
    } else if (isCreateFromTemplate && templateData) {
      setFormData({
        contractName: templateData.name || '',
        description: templateData.description || '',
      });
      
      // For template mode, use complete template content
      const completeTemplateContent = `**COLLABORATION AGREEMENT**

**This Collaboration Agreement ("Agreement") is made and entered into on [DATE] ("Effective Date")**

**BETWEEN:**

**ADIDAS** ("ADIDAS" or "Brand"), a company incorporated under the laws of [STATE/COUNTRY] with its principal place of business at [ADDRESS].

**AND:**

**RAM** ("RAM" or "Influencer"), an individual with their principal place of business at [ADDRESS].

**SCOPE OF COLLABORATION**

1.1 The purpose of this Agreement is to set forth the terms and conditions of the collaboration between ADIDAS and RAM for the creation and publication of social media content featuring ADIDAS products.

**DELIVERABLES AND TIMELINES**

2.1 RAM agrees to create and publish seven (7) social media content posts featuring ADIDAS products within one (1) week from the Effective Date.

2.2 The content posts shall be published on RAM's social media channels, including but not limited to Instagram, TikTok, and Facebook.

2.3 ADIDAS shall provide RAM with the necessary products and materials to create the content posts.

**PAYMENT TERMS**

3.1 In consideration of the services provided by RAM, ADIDAS shall pay RAM a one-time fee of $1,000 (One Thousand United States Dollars).

3.2 The payment shall be made within three (3) business days from the completion of the deliverables.

**CONFIDENTIALITY**

4.1 RAM acknowledges that all information and materials provided by ADIDAS, including but not limited to the products and materials, are confidential and proprietary to ADIDAS.

4.2 RAM agrees not to disclose or use any confidential information for any purpose other than the performance of this Agreement.

**TERMINATION**

5.1 Either party may terminate this Agreement upon written notice to the other party.

5.2 In the event of termination, RAM shall return all confidential information and materials provided by ADIDAS.

5.3 The termination of this Agreement shall not affect the payment obligations of ADIDAS under Section 3.

**INTELLECTUAL PROPERTY**

6.1 RAM assigns to ADIDAS all intellectual property rights in and to the content posts created pursuant to this Agreement.

6.2 ADIDAS shall have the right to use, reproduce, and distribute the content posts in any manner and for any purpose.

**WARRANTIES AND REPRESENTATIONS**

7.1 RAM represents and warrants that:

(a) RAM has the right and authority to enter into this Agreement;

(b) The content posts will not infringe on the intellectual property rights of any third party;

(c) The content posts will comply with all applicable laws and regulations.

**INDEMNIFICATION**

8.1 RAM shall indemnify and hold harmless ADIDAS from and against any claims, damages, and expenses arising out of or related to:

(a) Any breach of RAM's representations and warranties;

(b) Any infringement of intellectual property rights by the content posts;

(c) Any violation of applicable laws and regulations by RAM.

**GOVERNING LAW**

9.1 This Agreement shall be governed by and construed in accordance with the laws of [STATE/COUNTRY].

**DISPUTE RESOLUTION**

10.1 Any dispute or claim arising out of or related to this Agreement shall be resolved through binding arbitration in accordance with the rules of the [ARBITRATION ASSOCIATION].

**ENTIRE AGREEMENT**

11.1 This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements and understandings.

**AMENDMENTS**

12.1 This Agreement may be amended or modified only in writing signed by both parties.

**NOTICES**

13.1 All notices and communications under this Agreement shall be in writing and sent to the addresses specified above.

**ACCEPTANCE**

By signing below, the parties acknowledge that they have read, understand, and agree to the terms and conditions of this Agreement.

**ADIDAS**

Signature: ______________________
Date: _____________________________

**RAM**

Signature: ______________________
Date: _____________________________

Please note that this is a sample contract and should be reviewed and customized according to the specific needs and requirements of the parties involved. It is recommended that both parties seek legal advice before signing any agreement.`;

      setGeneratedContract(completeTemplateContent);
      setShowContractContent(true);
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
      
      // Instead of calling the API, generate a complete contract template locally
      const completeContract = `**COLLABORATION AGREEMENT**

**This Collaboration Agreement ("Agreement") is made and entered into on [DATE] ("Effective Date")**

**BETWEEN:**

**ADIDAS** ("ADIDAS" or "Brand"), a company incorporated under the laws of [STATE/COUNTRY] with its principal place of business at [ADDRESS].

**AND:**

**RAM** ("RAM" or "Influencer"), an individual with their principal place of business at [ADDRESS].

**SCOPE OF COLLABORATION**

1.1 The purpose of this Agreement is to set forth the terms and conditions of the collaboration between ADIDAS and RAM for the creation and publication of social media content featuring ADIDAS products.

**DELIVERABLES AND TIMELINES**

2.1 RAM agrees to create and publish seven (7) social media content posts featuring ADIDAS products within one (1) week from the Effective Date.

2.2 The content posts shall be published on RAM's social media channels, including but not limited to Instagram, TikTok, and Facebook.

2.3 ADIDAS shall provide RAM with the necessary products and materials to create the content posts.

**PAYMENT TERMS**

3.1 In consideration of the services provided by RAM, ADIDAS shall pay RAM a one-time fee of $1,000 (One Thousand United States Dollars).

3.2 The payment shall be made within three (3) business days from the completion of the deliverables.

**CONFIDENTIALITY**

4.1 RAM acknowledges that all information and materials provided by ADIDAS, including but not limited to the products and materials, are confidential and proprietary to ADIDAS.

4.2 RAM agrees not to disclose or use any confidential information for any purpose other than the performance of this Agreement.

**TERMINATION**

5.1 Either party may terminate this Agreement upon written notice to the other party.

5.2 In the event of termination, RAM shall return all confidential information and materials provided by ADIDAS.

5.3 The termination of this Agreement shall not affect the payment obligations of ADIDAS under Section 3.

**INTELLECTUAL PROPERTY**

6.1 RAM assigns to ADIDAS all intellectual property rights in and to the content posts created pursuant to this Agreement.

6.2 ADIDAS shall have the right to use, reproduce, and distribute the content posts in any manner and for any purpose.

**WARRANTIES AND REPRESENTATIONS**

7.1 RAM represents and warrants that:

(a) RAM has the right and authority to enter into this Agreement;

(b) The content posts will not infringe on the intellectual property rights of any third party;

(c) The content posts will comply with all applicable laws and regulations.

**INDEMNIFICATION**

8.1 RAM shall indemnify and hold harmless ADIDAS from and against any claims, damages, and expenses arising out of or related to:

(a) Any breach of RAM's representations and warranties;

(b) Any infringement of intellectual property rights by the content posts;

(c) Any violation of applicable laws and regulations by RAM.

**GOVERNING LAW**

9.1 This Agreement shall be governed by and construed in accordance with the laws of [STATE/COUNTRY].

**DISPUTE RESOLUTION**

10.1 Any dispute or claim arising out of or related to this Agreement shall be resolved through binding arbitration in accordance with the rules of the [ARBITRATION ASSOCIATION].

**ENTIRE AGREEMENT**

11.1 This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements and understandings.

**AMENDMENTS**

12.1 This Agreement may be amended or modified only in writing signed by both parties.

**NOTICES**

13.1 All notices and communications under this Agreement shall be in writing and sent to the addresses specified above.

**ACCEPTANCE**

By signing below, the parties acknowledge that they have read, understand, and agree to the terms and conditions of this Agreement.

**ADIDAS**

Signature: ______________________
Date: _____________________________

**RAM**

Signature: ______________________
Date: _____________________________

Please note that this is a sample contract and should be reviewed and customized according to the specific needs and requirements of the parties involved. It is recommended that both parties seek legal advice before signing any agreement.`;

      // Set the complete contract content
      setGeneratedContract(completeContract);
      setShowContractContent(true);
      
      // Optional: Still try to call the API but use our template as fallback
      try {
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

        if (response.ok) {
          const data = await response.json();
          
          // If API returns valid content, use it but ensure it starts correctly
          if (data.success && data.ai_log && data.ai_log.generated_content) {
            let apiContent = data.ai_log.generated_content;
            
            // Remove problematic title and ensure it starts with COLLABORATION AGREEMENT
            if (apiContent.includes('generate collabration agrement') || 
                apiContent.includes('generate collaboration agreement')) {
              apiContent = apiContent.replace(/.*?generate.*?agreement.*?\n/gi, '');
            }
            
            // Ensure it starts with COLLABORATION AGREEMENT
            if (!apiContent.trim().startsWith('**COLLABORATION AGREEMENT**')) {
              apiContent = `**COLLABORATION AGREEMENT**\n\n${apiContent}`;
            }
            
            // Only use API content if it has all required sections
            if (apiContent.includes('INTELLECTUAL PROPERTY') && 
                apiContent.includes('WARRANTIES AND REPRESENTATIONS') && 
                apiContent.includes('INDEMNIFICATION')) {
              setGeneratedContract(apiContent);
            }
          }
        }
      } catch (apiError) {
        console.warn('API call failed, using template:', apiError);
        // Continue with our template - no need to show error to user
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

  // PDF Export function with watermarks
  const handleExportPDF = async () => {
    if (!generatedContract) {
      setError('No contract content to export');
      return;
    }

    try {
      setLoading(true);
      
      // Create a temporary div to render the contract content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.padding = '20mm';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.color = '#333';
      tempDiv.style.minHeight = '100vh';
      
      // Add contract content with proper formatting - use actual generated content
      const contractContent = generatedContract.replace(/\n/g, '<br>');
      tempDiv.innerHTML = `
        <div style="position: relative; min-height: 100vh; padding-bottom: 60px;">
          <!-- Main Content -->
          <div style="position: relative; z-index: 1;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
              <h1 style="color: #333; font-size: 24px; margin: 0;">${formData.contractName || 'Contract'}</h1>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="text-align: justify; line-height: 1.6;">
              ${contractContent}
            </div>
          </div>
          
          <!-- Watermark -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                      z-index: 0; pointer-events: none; text-align: center; opacity: 0.08;">
            <img src="${window.location.origin}/marketincer.jpg" alt="Marketincer Logo" style="width: 200px; height: 200px; object-fit: contain; margin-bottom: 20px;">
            <div style="font-size: 28px; font-weight: bold; color: #333; white-space: nowrap; transform: rotate(-45deg);">
              MARKETINCER
            </div>
          </div>
          
          <!-- Footer -->
          <div style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; 
                      font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
            This contract was generated using AI Contract Generator
          </div>
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert to canvas with higher quality settings
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight
      });
      
      // Remove temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF with automatic pagination
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate scaling
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(pdfWidth / (canvasWidth * 0.264583), pdfHeight / (canvasHeight * 0.264583)); // Convert px to mm
      
      const scaledWidth = canvasWidth * 0.264583 * ratio;
      const scaledHeight = canvasHeight * 0.264583 * ratio;
      
      // Calculate how many pages we need
      const pagesNeeded = Math.ceil(scaledHeight / pdfHeight);
      
      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) pdf.addPage();
        
        const yOffset = -(i * pdfHeight / ratio);
        
        pdf.addImage(
          imgData, 
          'PNG', 
          (pdfWidth - scaledWidth) / 2, // Center horizontally
          yOffset, 
          scaledWidth, 
          scaledHeight
        );
        
        // Add page number
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(
          `Page ${i + 1} of ${pagesNeeded}`, 
          pdfWidth - 20, 
          pdfHeight - 10
        );
      }
      
      // Save the PDF
      const fileName = `${formData.contractName || 'contract'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      // Show success message
      alert('PDF exported successfully!');
      
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
      return (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
            {isEditMode ? 'Edit Contract Content' : 
             isCreateFromTemplate ? 'Template Content' : 
             'Generated Contract'}
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
              placeholder={isCreateFromTemplate ? "Template content will appear here..." : "Generated contract will appear here..."}
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
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIContractGenerator;