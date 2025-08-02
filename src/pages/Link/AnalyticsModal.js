// components/ViewModal.jsx
import React from 'react';
import { Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Typography, 
  Box, 
  Grid,Card, CardContent, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';


const lineData = [
  { date: '07/23', clicks: 30 },
  { date: '07/24', clicks: 10 },
  { date: '07/25', clicks: 25 },
  { date: '07/26', clicks: 15 },
  { date: '07/27', clicks: 35 },
  { date: '07/28', clicks: 20 },
  { date: '07/29', clicks: 40 },
];

const pieData = [
  { name: 'Desktop', value: 146 },
  { name: 'E-Reader', value: 101 },
  { name: 'Tablet', value: 70 },
  { name: 'Mobile', value: 50 },
  { name: 'Unknown', value: 14 },
];

const barData = [
  { name: 'LinkedIn', clicks: 30 },
  { name: 'Facebook', clicks: 50 },
  { name: 'Google', clicks: 40 },
  { name: 'Twitter', clicks: 35 },
  { name: 'Bitly', clicks: 25 },
  { name: 'Direct', clicks: 45 },
];

const tableData = [
  { country: 'United States', clicks: 205, percent: 57.7 },
  { country: 'Japan', clicks: 6, percent: 1.7 },
  { country: 'Mexico', clicks: 19, percent: 5.4 },
  { country: 'Russian Federation', clicks: 5, percent: 1.4 },
  { country: 'India', clicks: 27, percent: 7.6 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Analytics </DialogTitle>
      <DialogContent dividers sx={{bgcolor:'#f6edf8'}}>
      <Box sx={{flexGrow:1, mt: { xs: 8, md: 0 }, height: '100vh', overflow: 'hidden !important', padding:'20px'}}>
        <Grid container spacing={2} sx={{ height: '100%', overflow: 'hidden !important' }}>
          <Grid size={{ xs: 12, sm: 8, md: 6 }} spacing={2} sx={{ padding:'10px', height:'100%' }}>
            <Grid className='analyticModal' item xs={12} md={4} >
            <Card sx={{borderRadius:'20px'}}>
              <CardContent className="analyticCard">
                <Typography variant="subtitle2">Top Performing Date</Typography>
                <Typography variant="h6" mt={2}>July 10, 2025</Typography>
                <Typography variant="body2">45 Clicks + Scans</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid className='analyticModal' item xs={12} md={4} >
          <Card sx={{borderRadius:'20px'}}>
            <CardContent>
              <Typography variant="subtitle2">Clicks + Scans by Device</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <Typography align="center" mt={1}>Total: 381</Typography>
            </CardContent>
          </Card>
          </Grid>

        <Grid className='analyticModal' item xs={12} md={4} >
          <Card sx={{borderRadius:'20px'}}>
            <CardContent>
              <Typography variant="subtitle2">Top Performing Location</Typography>
              <Typography variant="h6" mt={2}>USA & UK</Typography>
              <Typography variant="body2">205 Clicks + Scans</Typography>
            </CardContent>
          </Card>
        </Grid>

          
          </Grid>

          
          <Grid size={{ xs: 12, sm: 8, md: 6 }} spacing={2} sx={{ padding:'10px', height:'100%' }}>
          <Grid className='analyticModal' item xs={12} md={4} >
          <Card sx={{borderRadius:'20px'}}>
            <CardContent>
              <Typography variant="subtitle2">Clicks + Scans by Device</Typography>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Typography align="center" mt={1}>Total: 381</Typography>
            </CardContent>
          </Card>
          </Grid>

          <Grid className='analyticModal' item xs={12} md={4}>
          <Card sx={{borderRadius:'20px'}}>
            <CardContent>
              <Typography variant="subtitle2">Clicks + Scans by Referrer</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#1976d2" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Table */}
        <Grid item xs={4}>
          <Card sx={{borderRadius:'20px'}}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Clicks + Scans by Location
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Country</TableCell>
                      <TableCell align="right">Clicks + Scans</TableCell>
                      <TableCell align="right">%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.country}>
                        <TableCell>{row.country}</TableCell>
                        <TableCell align="right">{row.clicks}</TableCell>
                        <TableCell align="right">{row.percent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      

          </Grid>
        </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalyticsModal;
