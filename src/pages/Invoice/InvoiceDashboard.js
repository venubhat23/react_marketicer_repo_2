import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Receipt,
  PendingActions
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvoiceAPI from '../../services/invoiceApi';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';

const InvoiceDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    paid_invoices_count: 0,
    pending_invoices_count: 0,
    total_paid: 0,
    total_pending: 0,
    total_all: 0,
    all_invoices: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await InvoiceAPI.getInvoiceDashboard();
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color: color, fontWeight: 'bold' }}>
              {value}
            </Typography>
            {subtext && (
              <Typography variant="body2" color="textSecondary">
                {subtext}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: color, opacity: 0.8 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  const recentInvoices = dashboardData.all_invoices.slice(0, 5);

  return (
    <Layout>
    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ color: '#091A48', fontWeight: 'bold' }}>
          Invoice Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/invoices/create')}
          sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#7020CC' } }}
        >
          Create Invoice
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Paid Invoices"
            value={dashboardData.paid_invoices_count}
            icon={<Receipt sx={{ fontSize: 40 }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Invoices"
            value={dashboardData.pending_invoices_count}
            icon={<PendingActions sx={{ fontSize: 40 }} />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Paid"
            value={`$${parseFloat(dashboardData.total_paid || 0).toFixed(2)}`}
            icon={<AttachMoney sx={{ fontSize: 40 }} />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Outstanding"
            value={`$${parseFloat(dashboardData.total_pending || 0).toFixed(2)}`}
            icon={<TrendingUp sx={{ fontSize: 40 }} />}
            color="#FF9800"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <Box p={2}>
              <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: '#882AFF' }}>
                  Recent Invoices
                </Typography>
                <Button
                  onClick={() => navigate('/invoices')}
                  sx={{ color: '#882AFF' }}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#F5F5F5' }}>
                    <TableRow>
                      <TableCell><strong>Invoice ID</strong></TableCell>
                      <TableCell><strong>Customer</strong></TableCell>
                      <TableCell><strong>Amount</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Due Date</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentInvoices.map((invoice) => (
                      <TableRow 
                        key={invoice.id} 
                        hover 
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>#{invoice.id}</TableCell>
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>${parseFloat(invoice.total_amount || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={invoice.status} 
                            color={getStatusColor(invoice.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{invoice.due_date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {recentInvoices.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                  <Typography color="textSecondary">No invoices found</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: 'fit-content' }}>
            <Box p={2}>
              <Typography variant="h6" gutterBottom sx={{ color: '#882AFF' }}>
                Quick Stats
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Total Invoice Value
                </Typography>
                <Typography variant="h5" sx={{ color: '#091A48', fontWeight: 'bold' }}>
                  ${parseFloat(dashboardData.total_all || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Collection Rate
                </Typography>
                <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  {dashboardData.total_all > 0 
                    ? ((dashboardData.total_paid / dashboardData.total_all) * 100).toFixed(1)
                    : 0}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Total Invoices
                </Typography>
                <Typography variant="h5" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                  {dashboardData.all_invoices.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </Layout>
  );
};

export default InvoiceDashboard;