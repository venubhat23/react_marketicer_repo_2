import React,{useState} from 'react'
import { Button, TextField, Box, Typography, Grid , Divider, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Link} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginBg from '../assets/images/loginBG.png';
import axios from "axios";
import GoogleIcon from '../assets/images/google_icon.png'
import { useAuth } from '../authContext/AuthContext';
import { setUserRole } from '../utils/userUtils';
import { toast } from "react-toastify";





const Login = () => {

  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  
  // Forgot password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  
  
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

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
    setForgotPasswordError("");
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordEmail("");
    setForgotPasswordMessage("");
    setForgotPasswordError("");
    setForgotPasswordLoading(false);
  };

  const handleForgotPasswordSubmit = async () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordError("Invalid email address");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      // Try different possible endpoints and data structures for forgot password
      const possibleEndpoints = [
        "https://api.marketincer.com/api/v1/forgot-password",
        "https://api.marketincer.com/api/v1/password/forgot",
        "https://api.marketincer.com/api/v1/auth/forgot-password",
        "https://api.marketincer.com/api/v1/password-reset",
        "https://api.marketincer.com/api/v1/reset-password"
      ];
      
      const possiblePayloads = [
        { email: forgotPasswordEmail },
        { user: { email: forgotPasswordEmail } },
        { reset: { email: forgotPasswordEmail } }
      ];
      
      console.log("🔐 FORGOT PASSWORD DEBUG:");
      console.log("Email:", forgotPasswordEmail);
      console.log("Timestamp:", new Date().toISOString());
      
      // Try the most likely combination first
      let apiEndpoint = possibleEndpoints[0];
      let payload = possiblePayloads[0];
      
      console.log("📡 API Call Details:");
      console.log("Endpoint:", apiEndpoint);
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("Headers:", { 'Content-Type': 'application/json' });
      
      await axios.post(apiEndpoint, payload);

      setForgotPasswordMessage("Password reset link has been sent to your email address.");
      toast.success("Password reset link has been sent to your email address!");
      setForgotPasswordEmail("");
      
      // Auto close dialog after 2 seconds
      setTimeout(() => {
        handleForgotPasswordClose();
      }, 2000);

    } catch (error) {
      console.error("Forgot password failed", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      
      if (error.response && error.response.data) {
        const { message } = error.response.data;
        const errorMsg = message || "Failed to send reset email. Please try again.";
        setForgotPasswordError(errorMsg);
        toast.error(errorMsg);
      } else if (error.response) {
        // Server responded with error status
        let errorMsg;
        if (error.response.status === 404) {
          errorMsg = "Forgot password feature is not yet available. Please contact support.";
        } else if (error.response.status === 500) {
          errorMsg = "Server error. Please try again later.";
        } else {
          errorMsg = `Server error: ${error.response.status}. Please try again.`;
        }
        setForgotPasswordError(errorMsg);
        toast.error(errorMsg);
      } else if (error.request) {
        // Request was made but no response received
        const errorMsg = "Network error. Please check your connection and try again.";
        setForgotPasswordError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = "Something went wrong. Please try again later.";
        setForgotPasswordError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };
  return (
    <>
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

          <Box sx={{ textAlign: 'right', mt: 1 }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleForgotPasswordOpen}
              sx={{
                color: '#90caf9',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.875rem',
                '&:hover': {
                  color: '#bbdefb'
                }
              }}
            >
              Forgot Password?
            </Link>
          </Box>

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
            Don't have an account?{' '}
            <span style={{ color: '#90caf9', cursor: 'pointer' }} onClick={handleSignupRedirect}>Signup</span>
          </Typography>
      
    </Box>
    
    
    </Grid>
    </Grid>

    {/* Forgot Password Dialog */}
    <Dialog 
      open={forgotPasswordOpen} 
      onClose={handleForgotPasswordClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold',
        color: '#882AFF',
        pb: 1
      }}>
        Reset Password
      </DialogTitle>
      
      <DialogContent sx={{ px: 3, py: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {forgotPasswordError && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {forgotPasswordError}
          </Typography>
        )}

        {forgotPasswordMessage && (
          <Typography 
            color="success.main" 
            variant="body2" 
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {forgotPasswordMessage}
          </Typography>
        )}

        <TextField
          autoFocus
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          value={forgotPasswordEmail}
          onChange={(e) => setForgotPasswordEmail(e.target.value)}
          disabled={forgotPasswordLoading}
          error={!!forgotPasswordError && !forgotPasswordMessage}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#882AFF',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#882AFF',
            },
          }}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button 
          onClick={handleForgotPasswordClose}
          disabled={forgotPasswordLoading}
          sx={{ color: '#666' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleForgotPasswordSubmit}
          variant="contained"
          disabled={forgotPasswordLoading || forgotPasswordMessage}
          sx={{
            bgcolor: '#882AFF',
            '&:hover': {
              bgcolor: '#7C3AED'
            },
            '&:disabled': {
              bgcolor: '#ccc'
            }
          }}
        >
          {forgotPasswordLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default Login;
