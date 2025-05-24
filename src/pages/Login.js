import React,{useState} from 'react'
import { Button, TextField, Box, Typography, Grid , Divider, InputLabel} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginBg from '../assets/images/loginBG.png';
import axios from "axios";
import GoogleIcon from '../assets/images/google_icon.png'
import { useAuth } from '../authContext/AuthContext';





const Login = () => {

  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://api.marketincer.com/api/v1/login", form);
      //localStorage.setItem("token", res.data.token); // Save token
      login(res.data.token);
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // const handleLogin = () => {
  //   // Dummy login
  //   navigate("/dashboard");
  // };

  return (
    <Grid container spacing={2} className="login_section"
    sx={{
      backgroundImage: `url(${LoginBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height:'100vh'
    }}
    >
    <Grid size={12}>
    
    <Box className="loginContent" sx={{ maxWidth: 400, margin: "auto", mt: 15 }}>

    <Typography variant='h5' className="typo_primary" sx={{color:'#fff'}}>Log in to your account </Typography>
      <Typography
        variant="h6"
        color="white"          
        fontWeight="light" 
        verticalAlign="middle"
        sx={{textAlign:'center', fontSize:'12px'}}
        mb={2}>

        Welcome back! Please enter your details
      </Typography>
      <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         sx={{ color:'#fff', fontSize:'14px', mb:'-5px' }}>
          Email 
         </Typography>
          <TextField
            fullWidth
            //label="Email"
            name="email"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px', height:'40px' } }}
          />

        <Typography 
          variant="h6" 
          fontWeight="400"
          align="left" 
          sx={{ color:'#fff', fontSize:'14px', mb:'-5px' }}>
            Password 
         </Typography>
          <TextField
            fullWidth
            //label="Password"
            type="password"
            name="password"
            variant="filled"
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px', height:'40px' } }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              mb: 1,
              background: '#882AFF',
              textTransform: 'none',
            }}
          >
            Sign in
          </Button>

          <Divider sx={{ my: 2, borderColor: '#fff', color:'#fff' }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#ccc',
              textTransform: 'none',
              mb: 2,
            }}
          >
            <img src={GoogleIcon} alt="my image" width='15' height='15' style={{marginRight:'15px'}} />
            Sign in with Google
          </Button>

          <Typography variant="body2" align="center" sx={{color:'#fff'}}>
            Don’t have an account?{' '}
            <span style={{ color: '#90caf9', cursor: 'pointer' }}>Sign up</span>
          </Typography>

      
    </Box>
    
    
    </Grid>
    </Grid>
   
  );
};

export default Login;
