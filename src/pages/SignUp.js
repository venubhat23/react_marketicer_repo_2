import React,{useState} from 'react'
import { Button,MenuItem, TextField, Box,styled,ListItemText, OutlinedInput,InputBase,Typography,Stack, Grid,Select, Divider, InputLabel} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginBg from '../assets/images/loginBG.png';
import GoogleIcon from '../assets/images/google_icon.png'
import FacebookIcon from '../assets/images/facebook.png'
import AppleIcon from '@mui/icons-material/Apple';
import axios from "axios";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { toast } from "react-toastify";
//import { Controller, useForm } from "react-hook-form";



const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: (theme.vars ?? theme).palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      
      '"Helvetica Neue"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

const SignUp = () => {

  const [formData, setFormData] = useState({
    user: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    terms: false,
  });

  // const {
  //   control,
  //   watch,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const roles = ['Admin', 'Brand', 'Agency'];

  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.user || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (!formData.terms) {
        toast.error('Please accept the terms and conditions');
        return;
      }

      const response = await axios.post('https://api.marketincer.com/api/v1/signup', {
        user: {
          name: formData.user,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          role: formData.role
        }
      });

      toast.success('Signup successful!');
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Signup failed. Please try again.'
      );
      console.error(error);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/login'); // or the path you have set in routes
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
    <Grid size={12} >
    
    <Box className="loginContent" sx={{ maxWidth: 400, margin:'auto', marginTop:'15px' }}>

    <Typography variant='h6' className="typo_primary" sx={{color:'#fff', textAlign:'center'}}>Create an account </Typography>
      <Typography
        variant="h6"
        color="white"          
        fontWeight="light" 
        verticalAlign="middle"
        sx={{textAlign:'center', fontSize:'12px'}}
        mb={2}>

       Start your 30-days free trail
      </Typography>

      <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         className="form_header">
          Name 
         </Typography>

        <TextField 
        fullWidth 
        //id="outlined-basic" 
        //label="Name" 
        name="user"
        value={formData.user}
        variant="outlined" 
        size='small'
        onChange={handleChange}
        InputLabelProps={{ style: { color: '#dfdfd' } }}
        InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
        />

        <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         className="form_header">
          Email 
         </Typography>

        <TextField
            fullWidth
            name="email"
            size='small'
            value={formData.email}
            variant="outlined"
            //label="Email"
            type="email"
            required
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px'} }}
          />

        <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         className="form_header">
          Password 
         </Typography>    
          <TextField
            fullWidth
            name="password"
            //label="Password"
            value={formData.password}
            size="small"
            type="password"
            variant="outlined"
            
            required
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
          />

        <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         className="form_header">
          Confirm Password 
         </Typography> 
          <TextField
            fullWidth
            name="confirmPassword"
            //label="Confirm Password"
            value={formData.confirmPassword}
            size="small"
            type="password"
            variant="outlined"
            //margin="normal"
            required
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px',  } }}
          />

          
      {/* <FormControl variant="outlined" fullWidth size='small' margin="normal" sx={{  background:'#fff',borderRadius:'5px', }}>
        <select style={{height:'45px', borderRadius:'5px'}} name="role" value={formData.role} onChange={handleChange} >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </FormControl> */}

        <Typography 
         variant="h6" 
         fontWeight="400"
         align="left" 
         className="form_header">
          Select Role 
         </Typography> 
        <FormControl fullWidth>
          {/* <InputLabel id="select_label">Select Role</InputLabel> */}
          <Select
            labelId="select_label"
            size="small"
            name="role"
            //margin="normal"
            value={formData.role}
            onChange={handleChange}
            //input={<OutlinedInput label="Select Role" />}
            sx={{bgcolor:'#fff', mb:'10px'}}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                <ListItemText primary={role} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <label style={{color:'#fff', textAlign:'left'}}>
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              
            />
            Accept terms and conditions
          </label>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 2,
              mb: 1,
              background: '#882AFF',
              textTransform: 'none',
              color:'#fff'
            }}
          >
            Get Started
          </Button>

          <Divider sx={{ my: 1, borderColor: '#fff', color:'#fff', fontSize:'14px' }}>OR</Divider>

          <Stack direction="row" spacing={1}
            sx={{padding: '8px',justifyContent: 'center',alignItems: 'center',}}>
            <Button>
                <img src={GoogleIcon} alt="my image" width='20' height='20'  />
            </Button>
            <Button>
                <img src={FacebookIcon} alt="my image" width='20' height='20' /> 
            </Button>

            <Button startIcon={<AppleIcon />}
              sx={{ color: '#fff'}}/>
        </Stack>

          

          <Typography variant="body2" align="center" sx={{color:'#fff'}}>
            Already have an account?{' '}
            <span style={{ color: '#90caf9', cursor: 'pointer' }} onClick={handleSignupRedirect}>Login</span>
          </Typography>

      
    </Box>
    
    
    </Grid>
    </Grid>
  );
};

export default SignUp;
