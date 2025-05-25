import React,{useState} from 'react'
import { Button,MenuItem, TextField, Box,styled,InputBase,Typography,Stack, Grid,Select, Divider, InputLabel} from "@mui/material";
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
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    terms: false,
  });

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
      await axios.post('https://your-api.com/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword:formData.confirmPassword,
        role: formData.role,
      });
      navigate('/login');
    } catch (error) {
      console.error("Signup failed", error);
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
    
    <Box className="loginContent" sx={{ maxWidth: 400, margin:'auto', marginTop:'20px' }}>

    <Typography variant='h6' className="typo_primary" sx={{color:'#fff'}}>Create an account </Typography>
      <Typography
        variant="h6"
        color="white"          
        fontWeight="light" 
        verticalAlign="middle"
        sx={{textAlign:'center', fontSize:'12px'}}
        mb={2}>

       Start your 30-days free trail
      </Typography>

        <TextField 
        fullWidth 
        id="outlined-basic" 
        label="Name" 
        name="name"
        value={formData.name}
        variant="filled" 
        size='small'
        onChange={handleChange}
        InputLabelProps={{ style: { color: '#dfdfd' } }}
        InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
        />

        <TextField
            fullWidth
            name="email"
            size='small'
            value={formData.email}
            variant="filled"
            margin="normal"
            label="Email"
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px'} }}
          />

        
          <TextField
            fullWidth
            name="password"
            label="password"
            value={formData.password}
            size="small"
            variant="filled"
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
          />

        
          <TextField
            fullWidth
            name="confirmPassword"
            label=" Confirm Password"
            value={formData.confirmPassword}
            size="small"
            variant="filled"
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px',  } }}
          />

          
      <FormControl variant="filled" size='small' margin="normal" sx={{ minWidth:'100%', background:'#fff',borderRadius:'5px', }}>
        
        <select style={{height:'45px', borderRadius:'5px'}} name="role" value={formData.role} onChange={handleChange} >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
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
            }}
          >
            Get Started
          </Button>

          <Divider sx={{ my: 2, borderColor: '#fff', color:'#fff', fontSize:'14px' }}>OR</Divider>

          <Stack direction="row" spacing={2}
            sx={{padding: '10px',justifyContent: 'center',alignItems: 'center',}}>
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
            Don’t have an account?{' '}
            <span style={{ color: '#90caf9', cursor: 'pointer' }} onClick={handleSignupRedirect}>Login</span>
          </Typography>

      
    </Box>
    
    
    </Grid>
    </Grid>
  );
};

export default SignUp;
