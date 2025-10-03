import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceAPI from '../../services/invoiceApi';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await InvoiceAPI.getInvoice(id);
      setInvoice(response.invoice);
    } catch (error) {
      toast.error('Failed to fetch invoice details');
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await InvoiceAPI.deleteInvoice(id);
        toast.success('Invoice deleted successfully');
        navigate('/invoices');
      } catch (error) {
        toast.error('Failed to delete invoice');
        console.error('Error deleting invoice:', error);
      }
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleDownloadPDF = async () => {
    try {
      // Import html2canvas and jsPDF dynamically
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;
      
      const element = document.getElementById('invoice-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${invoice.invoice_number || invoice.id}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const calculateSubtotal = () => {
    return invoice?.line_items?.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    }, 0) || 0;
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * (parseFloat(invoice?.gst_percentage) || 0)) / 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading invoice details...</Typography>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Invoice not found</Typography>
      </Box>
    );
  }

  const subtotal = calculateSubtotal();
  const gstAmount = calculateGST();

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section"> 
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              borderRadius: 0
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
                  sx={{ mr: 2, color: '#475569' }}
                  onClick={() => navigate('/invoices')}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 600 }}>
                  Invoice Preview - #{invoice.invoice_number || invoice.id}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton size="large" sx={{ color: '#64748b' }}>
                  <NotificationsIcon />
                </IconButton>
                <Link to="/SettingPage">
                  <IconButton size="large" sx={{ color: '#64748b' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ p: 1.5 }}>
            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1.5}>
        <Box>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/invoices/edit/${id}`)}
            sx={{ mr: 1, color: '#882AFF' }}
          >
            Edit
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="error"
            sx={{ mr: 1 }}
          >
            Delete
          </Button>
          <Button
            startIcon={<PrintIcon />}
            variant="outlined"
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            startIcon={<DownloadIcon />}
            variant="contained"
            onClick={handleDownloadPDF}
            sx={{ 
              backgroundColor: '#882AFF',
              '&:hover': { backgroundColor: '#7C3AED' }
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      <Box 
        id="invoice-content" 
        sx={{ 
          bgcolor: 'white', 
          p: 2.5, 
          borderRadius: 2, 
          boxShadow: 3,
          maxWidth: '210mm', // A4 width
          margin: '0 auto',
          minHeight: '297mm', // A4 height
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.4,
          '@media print': {
            boxShadow: 'none',
            borderRadius: 0,
            p: 3,
            maxWidth: 'none',
            margin: 0
          }
        }}
      >
        {/* Invoice Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2.5,
          pb: 2,
          borderBottom: '2px solid #882AFF'
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#882AFF', 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: { xs: '2rem', sm: '3rem' },
                letterSpacing: '2px'
              }}
            >
              INVOICE
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                fontSize: '1.2rem',
                fontWeight: 500
              }}
            >
              #{invoice.invoice_number || invoice.id}
            </Typography>
          </Box>
          <Box sx={{ 
            textAlign: 'right',
            flex: 1,
            maxWidth: '250px'
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1,
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Date:</span>
              <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                fontSize: '14px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 'bold' }}>Due Date:</span>
              <span>{invoice.due_date}</span>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Chip 
                label={invoice.status} 
                color={getStatusColor(invoice.status)}
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '12px',
                  height: '28px'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Company and Customer Info */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2.5, 
          mb: 2.5,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ 
            flex: 1,
            p: 2, 
            bgcolor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            minHeight: '150px'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#882AFF', 
                fontWeight: 'bold', 
                mb: 2,
                fontSize: '16px',
                borderBottom: '1px solid #e2e8f0',
                pb: 1
              }}
            >
              BILL FROM:
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '14px',
                color: '#1a1a1a'
              }}
            >
              {invoice.company_name}
            </Typography>
            {invoice.address && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  fontSize: '12px',
                  lineHeight: 1.4
                }}
              >
                {invoice.address}
              </Typography>
            )}
            {invoice.gst_number && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>GST:</span> <span>{invoice.gst_number}</span>
              </Typography>
            )}
            {invoice.phone_number && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>Phone:</span> <span>{invoice.phone_number}</span>
              </Typography>
            )}
            {invoice.company_website && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>Website:</span> <span>{invoice.company_website}</span>
              </Typography>
            )}
          </Box>
          
          <Box sx={{ 
            flex: 1,
            p: 2, 
            bgcolor: '#f8fafc', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            minHeight: '150px'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#882AFF', 
                fontWeight: 'bold', 
                mb: 2,
                fontSize: '16px',
                borderBottom: '1px solid #e2e8f0',
                pb: 1
              }}
            >
              BILL TO:
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold', 
                mb: 1,
                fontSize: '14px',
                color: '#1a1a1a'
              }}
            >
              {invoice.customer}
            </Typography>
            {invoice.client_address && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  fontSize: '12px',
                  lineHeight: 1.4
                }}
              >
                {invoice.client_address}
              </Typography>
            )}
            {invoice.client_gstin && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>GSTIN:</span> <span>{invoice.client_gstin}</span>
              </Typography>
            )}
            {invoice.client_pan && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1, 
                  color: '#666',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>PAN:</span> <span>{invoice.client_pan}</span>
              </Typography>
            )}
            {invoice.work_email && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>Email:</span> <span>{invoice.work_email}</span>
              </Typography>
            )}
          </Box>
        </Box>

        {/* Items Table */}
        <Box sx={{ 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 2 
        }}>
          <Table sx={{ 
            width: '100%',
            tableLayout: 'fixed'
          }}>
            <TableHead sx={{ bgcolor: '#882AFF' }}>
              <TableRow>
                <TableCell 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '16px 12px',
                    width: '45%'
                  }}
                >
                  DESCRIPTION
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '16px 12px',
                    width: '15%'
                  }}
                >
                  QTY
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '16px 12px',
                    width: '20%'
                  }}
                >
                  RATE (₹)
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '16px 12px',
                    width: '20%'
                  }}
                >
                  AMOUNT (₹)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.line_items?.map((item, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      backgroundColor: '#f9fafb' 
                    },
                    '&:hover': {
                      backgroundColor: '#f3f4f6'
                    }
                  }}
                >
                  <TableCell 
                    sx={{ 
                      fontSize: '13px',
                      padding: '12px',
                      lineHeight: 1.4,
                      wordWrap: 'break-word'
                    }}
                  >
                    {item.description}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      fontSize: '13px',
                      padding: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {item.quantity}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontSize: '13px',
                      padding: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {parseFloat(item.unit_price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      padding: '12px',
                      color: '#1a1a1a'
                    }}
                  >
                    {((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {/* Summary */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mb: 2.5 
        }}>
          <Box sx={{ 
            width: '350px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            p: 2,
            bgcolor: '#f8fafc'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#666'
              }}>
                Subtotal:
              </Typography>
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                ₹{subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              pb: 1,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#666'
              }}>
                GST ({invoice.gst_percentage}%):
              </Typography>
              <Typography sx={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>
                ₹{gstAmount.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 2,
              borderTop: '2px solid #882AFF'
            }}>
              <Typography sx={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1a1a1a'
              }}>
                TOTAL:
              </Typography>
              <Typography sx={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#882AFF'
              }}>
                ₹{parseFloat(invoice.total_amount || 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceDetail;