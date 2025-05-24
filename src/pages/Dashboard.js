import React from 'react'
import {  Grid, Box, Typography, Paper, AppBar, Toolbar,IconButton } from '@mui/material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Dashboard =()=>{
  return(
    <Grid container spacing={2}>
        <Grid item xs={1} md={1} size={1}>
          <Sidebar />
        </Grid>
        <Grid item xs={11} md={11} size={11} sx={{ bgcolor: '#f3edf8' }}>
        <AppBar position="static" sx={{ bgcolor: "#091a48", boxShadow: "none" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2 }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h5" component="div" fontWeight={500}>
              Analytics
            </Typography>
          </Toolbar>
        </AppBar>
        </Grid>
    </Grid>
    
  )
  }

  export default Dashboard