import React from 'react';
import './App.css';

import { Routes, Route } from "react-router-dom";
import Dashboard from '../src/pages/Dashboard';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import SignUp from './pages/SignUp';
import {AuthProvider, useAuth} from './authContext/AuthContext'
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

// Component that renders routes based on user role
const AppRoutes = () => {
  const authContext = useAuth();
  
  // Handle the case where authContext might be null
  if (!authContext) {
    return <div>Loading...</div>;
  }
  
  const { user } = authContext;
  const userRole = user?.role;

  // Function to render marketplace routes based on role
  const renderMarketplaceRoutes = () => {
    if (userRole === 'admin') {
      // Admin sees all marketplace routes
      return (
        <>
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
        </>
      );
    } else if (userRole === 'brand') {
      // Brand sees only brand routes
      return (
        <>
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
        </>
      );
    } else if (userRole === 'influencer') {
      // Influencer sees only influencer routes
      return (
        <>
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/influencer/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
        </>
      );
    } else {
      // Default fallback - show basic marketplace route
      return (
        <Route path="/marketplace" element={
          <ProtectedRoute>
            <MarketplaceModule />
          </ProtectedRoute>
        } />
      );
    }
  };

  return (
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
      
      {/* Dynamic Marketplace Routes based on User Role */}
      {renderMarketplaceRoutes()}
      
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
};

function App() { 

  return (
    <>
   <div style={{ minHeight: '100%' }}>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>    
    </ThemeProvider>
    </div>
    </>
  );
}

export default App;
