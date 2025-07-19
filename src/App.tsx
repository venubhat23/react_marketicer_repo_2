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
import DashboardLayout from './components/DashboardLayout'

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

// Demo layout components for role-based sidebar
import Calendar from './layouts/calendar';
import Media from './layouts/media';
import Explore from './layouts/explore';
import Analytics from './layouts/analytics';
import Reporting from './layouts/reporting';
import Invoice from './layouts/invoice';

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
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
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

          {/* Demo routes for role-based sidebar */}
          <Route path="/calendar" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Calendar />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/media" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Media />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Explore />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/reporting" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reporting />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/invoice" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Invoice />
              </DashboardLayout>
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
