import React,{useState} from 'react';
import logo from './logo.svg';
import './App.css';

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Dashboard from '../src/pages/Dashboard';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import {AuthProvider} from './authContext/AuthContext'
import ProtectedRoute from './components/ProctedRoute'


import { Box, CssBaseline, Toolbar, Grid } from '@mui/material';
import Navbar  from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePost from './pages/CreatePost/CreatePost';
import Analytics  from './pages/Profile/Analytics';
import SocialMedia from './pages/SocialMedia';
import FullAnalytics from './pages/Profile/FullAnalytics';
import ContractPage from './pages/Contract/ContractPage';
import Discover from './pages/Discover';
import AIContractGenerator from './pages/Contract/AIContractGenerator';

function App() { 

  return (
    <>
   <div style={{ minHeight: '100%' }}>
    <ThemeProvider theme={theme}>
      
      {/* <div className="App"> */}
      
      {/* <CssBaseline />
      <Navbar toggleDrawer={toggleDrawer} />
      <Sidebar isOpen={isOpen} /> */}
    {/* </Box> */}

      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route path="/createPost" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
            
            } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/socialMedia" element={
            <ProtectedRoute>
            <SocialMedia />
            </ProtectedRoute>
          } />
          <Route path="/fullAnalytics" element={
            <ProtectedRoute>
            <FullAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/discover" element={
            <ProtectedRoute>
            <Discover />
            </ProtectedRoute>
            } />
          <Route path="/contracts" element={
            <ProtectedRoute>
            <ContractPage />
            </ProtectedRoute>
            } />

          <Route path="/ai-generator" element={
            <ProtectedRoute>
              <AIContractGenerator />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />



        </Routes>
      </AuthProvider>    
    {/* </div> */}
    </ThemeProvider>
    </div>
    </>
  );
}

export default App;
