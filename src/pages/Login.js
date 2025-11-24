import React,{useState} from 'react'
import { Button, TextField, Box, Typography, Grid , Divider, InputLabel} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginBg from '../assets/images/loginBG.png';
import axios from "axios";
import GoogleIcon from '../assets/images/google_icon.png'
import { useAuth } from '../authContext/AuthContext';
import { setUserRole } from '../utils/userUtils';





const Login = () => {

  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '', general: '' }));
  }

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email address";

    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };



  const handleSubmit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post("https://api.marketincer.com/api/v1/login", form);
      //localStorage.setItem("token", res.data.token); // Save token
      
      // Extract user data from the API response
      const userRole = res.data.user?.role || 'influencer'; // Default to 'influencer' if role not provided
      const userId = res.data.user?.id || res.data.user?.user_id || res.data.userId; // Try different possible user ID fields
      
      // Save user role using utility function
      setUserRole(userRole);
      
      // Pass token, role, and user ID to login function
      login(res.data.token, userRole, userId);
      navigate('/');
      
    } catch (error) {
      //console.error("Login failed", error);
      if (error.response && error.response.data) {
        const { errors: serverErrors, message } = error.response.data;
        if (serverErrors) {
          setErrors(serverErrors); // Field level errors
        } else if (message) {
          setErrors({ general: message }); // General error
        }
      } else {
        setErrors({ general: "Something went wrong. Please try again later." });
      }

    }
  };


  // const handleLogin = () => {
  //   // Dummy login
  //   navigate("/dashboard");
  // };

  const handleSignupRedirect = () => {
    navigate('/sign-up'); // or the path you have set in routes
  };
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

    <Typography variant='h5' className="typo_primary" sx={{color:'#fff', textAlign:'center'}}>Log in to your account </Typography>
      <Typography
        variant="h6"
        color="white"          
        fontWeight="light" 
        //verticalAlign="middle"
        sx={{textAlign:'center', fontSize:'12px', letterSpacing:'0.6px'}}
        mb={2}>

        Welcome back! Please enter your details
      </Typography>

      {/* Show general error */}
      {errors.general && (
            <Typography color="error" sx={{ mb: 1, textAlign: 'center', fontSize: '0.875rem' }}>
              {errors.general}
            </Typography>
          )}


      <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         className="form_header"
         >
          Email 
         </Typography>
          <TextField
            fullWidth
            size='small'
            name="email"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#882AFF'} }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
          />

        <Typography 
          variant="h6" 
          fontWeight="400"
          align="left" 
          className="form_header"
          >
            Password 
         </Typography>
          <TextField
            fullWidth
            type="password"
            name="password"
            size='small'
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#882AFF' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px'} }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              mb: 1,
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
            <span style={{ color: '#90caf9', cursor: 'pointer' }} onClick={handleSignupRedirect}>Signup</span>
          </Typography>
      
    </Box>
    
    
    </Grid>
    </Grid>
   
  );
};

export default Login;
