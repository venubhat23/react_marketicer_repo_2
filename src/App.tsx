import React from 'react';
import './App.css';

import { Routes, Route } from "react-router-dom";
import Dashboard from '../src/pages/Dashboard';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import {AuthProvider} from './authContext/AuthContext'
import ProtectedRoute from './components/ProctedRoute'

import CreatePost from './pages/CreatePost/CreatePost';
import Analytics  from './pages/Profile/Analytics';
import InstagramAnalytics from './pages/Profile/InstagramAnalytics';
import Analytics2 from './pages/Profile/Analytics2';
import SocialMedia from './pages/SocialMedia';
import FullAnalytics from './pages/Profile/FullAnalytics';
import ContractPage from './pages/Contract/ContractPage';
import Discover from './pages/Discover';
import AIContractGenerator from './pages/Contract/AIContractGenerator';
import MarketplaceModule from './pages/MarketPlace/MarketplaceModule';

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
          <Route path="/" element={<InstagramAnalytics />} />
          
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
          <Route path="/instagram-analytics" element={
            <ProtectedRoute>
              <InstagramAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/analytics2" element={
            <ProtectedRoute>
              <Analytics2 />
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
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/brand/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/brand/marketplace/new" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/influencer/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
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
