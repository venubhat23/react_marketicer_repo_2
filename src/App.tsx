import React from 'react';
import './App.css';

import { Routes, Route } from "react-router-dom";
import Dashboard from '../src/pages/Dashboard';
import Login from './pages/Login';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import SignUp from './pages/SignUp';
import {AuthProvider} from './authContext/AuthContext'
import ProtectedRoute from './components/ProctedRoute'
import { getUserRole } from './utils/userUtils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CreatePost from './pages/CreatePost/CreatePost';
import Analytics  from './pages/Profile/Analytics';
import InstagramAnalytics from './pages/Profile/InstagramAnalytics';
import Analytics2 from './pages/Profile/Analytics2';
import SocialMedia from './pages/SocialMedia';
import FullAnalytics from './pages/Profile/FullAnalytics';
import ContractPage from './pages/Contract/ContractPage'
import Discover from './pages/Discover';
import AIContractGenerator from './pages/Contract/AIContractGenerator';
import MarketplaceModule from './pages/MarketPlace/MarketplaceModule';
import MarketplacePostDetail from './pages/MarketPlace/MarketplacePostDetail';
import MarketplaceStatistics from './pages/MarketPlace/MarketplaceStatistics';
import SettingPage from './pages/Setting/SettingPage';
import LinkPage from './pages/Link/LinkPage';
import LinkAdvancedPage from './pages/Link/LinkAdvancedPage';
import SocialMonitoring from './pages/SocialMonitoring/SocialMonitoring';
import Calendar from './pages/Calendar/Calendar';
import { InvoiceList, InvoiceForm, InvoiceDetail, InvoiceDashboard } from './pages/Invoice';
import { PurchaseOrderList, PurchaseOrderForm, PurchaseOrderDetail, PurchaseOrderDashboard } from './pages/PurchaseOrder';
import SystemSettings from './pages/SystemSettings';


// Component that renders routes based on user role
const AppRoutes = () => {
  // Get user role using utility function
  const userRole = getUserRole();

  // Function to render marketplace routes based on role
  const renderMarketplaceRoutes = () => {
    // Check for both 'Admin' and 'admin' to handle case inconsistencies
    if (userRole === 'Admin' || userRole === 'admin') {
      // Admin sees all marketplace routes
      return (
        <>
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/marketplace/:id" element={
            <ProtectedRoute>
              <MarketplacePostDetail />
            </ProtectedRoute>
          } />
          <Route path="/marketplace/statistics" element={
            <ProtectedRoute>
              <MarketplaceStatistics />
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
          <Route path="/brand/marketplace/edit/:id" element={
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
    } else if (userRole === 'Brand' || userRole === 'brand') {
      // Brand sees only brand routes
      return (
        <>
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/marketplace/:id" element={
            <ProtectedRoute>
              <MarketplacePostDetail />
            </ProtectedRoute>
          } />
          <Route path="/marketplace/statistics" element={
            <ProtectedRoute>
              <MarketplaceStatistics />
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
          <Route path="/brand/marketplace/edit/:id" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
        </>
      );
    } else if (userRole === 'Influencer' || userRole === 'influencer') {
      // Influencer sees only influencer routes
      return (
        <>
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <MarketplaceModule />
            </ProtectedRoute>
          } />
          <Route path="/marketplace/:id" element={
            <ProtectedRoute>
              <MarketplacePostDetail />
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
      <Route path="/socialMedia" element={
        <ProtectedRoute>
        <SocialMedia />
        </ProtectedRoute>
      } />
      <Route path="/fullAnalytics/:id" element={
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

      <Route path="/settingPage" element={
        <ProtectedRoute>
          <SettingPage />
        </ProtectedRoute>
      } />

      <Route path="/system-settings" element={
        <ProtectedRoute>
          <SystemSettings />
        </ProtectedRoute>
      } />

      <Route path="/link" element={
        <ProtectedRoute>
          <LinkPage />
        </ProtectedRoute>
      } />

      <Route path="/link-advanced" element={
        <ProtectedRoute>
          <LinkAdvancedPage />
        </ProtectedRoute>
      } />

      <Route path="/social-monitoring" element={
        <ProtectedRoute>
          <SocialMonitoring />
        </ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />

      {/* Invoice Routes */}
      <Route path="/invoices" element={
        <ProtectedRoute>
          <InvoiceList />
        </ProtectedRoute>
      } />
      <Route path="/invoices/dashboard" element={
        <ProtectedRoute>
          <InvoiceDashboard />
        </ProtectedRoute>
      } />
      <Route path="/invoices/create" element={
        <ProtectedRoute>
          <InvoiceForm />
        </ProtectedRoute>
      } />
      <Route path="/invoices/edit/:id" element={
        <ProtectedRoute>
          <InvoiceForm />
        </ProtectedRoute>
      } />
      <Route path="/invoices/:id" element={
        <ProtectedRoute>
          <InvoiceDetail />
        </ProtectedRoute>
      } />

      {/* Purchase Order Routes */}
      <Route path="/purchase-orders" element={
        <ProtectedRoute>
          <PurchaseOrderList />
        </ProtectedRoute>
      } />
      <Route path="/purchase-orders/dashboard" element={
        <ProtectedRoute>
          <PurchaseOrderDashboard />
        </ProtectedRoute>
      } />
      <Route path="/purchase-orders/create" element={
        <ProtectedRoute>
          <PurchaseOrderForm />
        </ProtectedRoute>
      } />
      <Route path="/purchase-orders/edit/:id" element={
        <ProtectedRoute>
          <PurchaseOrderForm />
        </ProtectedRoute>
      } />
      <Route path="/purchase-orders/:id" element={
        <ProtectedRoute>
          <PurchaseOrderDetail />
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
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>    
    </ThemeProvider>
    </div>
    </>
  );
}

export default App;
