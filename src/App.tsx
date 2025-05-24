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
import CreatePost from './pages/CreatePost';
import Analytics  from './pages/Profile/Analytics'
import SocialMedia from './pages/SocialMedia'


function App() {
  // const [isOpen, setIsOpen] = useState(false);
  // const drawerWidth = isOpen ? 250 : 40;

  //const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
    <ThemeProvider theme={theme}>
      
      <div className="App">
      {/* <CssBaseline />
      <Navbar toggleDrawer={toggleDrawer} />
      <Sidebar isOpen={isOpen} /> */}
    {/* </Box> */}

    <AuthProvider>
    <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<SignUp />} /> 
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/socialMedia" element={<SocialMedia />} /> 

        </Routes>
        </AuthProvider>
        
      
    
    </div>
    </ThemeProvider>
    </>
  );
}

export default App;
