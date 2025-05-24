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

  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   password: '',
  //   confirmPassword:'',

  // });

  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  //const handleChange = (e) => setEmail(e.target.value);

  // const handleSubmit = async () => {
  //   try {
  //     await axios.post("https://api.marketincer.com/api/v1/signup", {email});
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Signup failed", error);
  //   }
  // };

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

      
      {/* <TextField
            fullWidth
            name="name"
            label="Name"
            //value={setEmail}
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#ccc' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px', height:'40px' } }}
          /> */}
        <TextField 
        fullWidth 
        id="outlined-basic" 
        label="Name" 
        name="name"
        variant="filled" 
        size='small'
        InputLabelProps={{ style: { color: '#dfdfd' } }}
        InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
        />

        <TextField
            fullWidth
            name="email"
            size='small'
            //value={setEmail}
            variant="filled"
            margin="normal"
            label="Email"
            //onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px'} }}
          />

        
          <TextField
            fullWidth
            name="Password"
            label="password"
            
            //value={setEail}
            size="small"
            variant="filled"
            margin="normal"
            //onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px' } }}
          />

        
          <TextField
            fullWidth
            name="Confirm Password"
            label=" Confirm Password"
            
            //value={setEail}
            size="small"
            variant="filled"
            margin="normal"
           // onChange={handleChange}
            InputLabelProps={{ style: { color: '#dfdfd' } }}
            InputProps={{ style: { backgroundColor: '#fff', borderRadius:'5px',  } }}
          />

          
      <FormControl variant="filled" size='small' margin="normal" sx={{ minWidth:'100%', background:'#fff',borderRadius:'5px', }}>
        <InputLabel id="demo-simple-select-filled-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          //value={age}
          //onChange={handleChange}
        >
          
          <MenuItem value={10}>Admin</MenuItem>
          <MenuItem value={20}>Brand</MenuItem>
          <MenuItem value={30}>Agency</MenuItem>
        </Select>
        </FormControl>

       
        <FormControlLabel
        sx={{
          '& .MuiFormControlLabel-label': {
            
            color: '#fff',
          },
        }}
          control={
            <Checkbox checked={checked} onChange={handleCheckChange} sx={{color:'#FFF'}}/>
          }
          label="Terms and Condition"
        />
          <Button
            fullWidth
            variant="contained"
            //onClick={handleSubmit}
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
            <span style={{ color: '#90caf9', cursor: 'pointer' }} onClick={handleSignupRedirect}>Sign up</span>
          </Typography>

      
    </Box>
    
    
    </Grid>
    </Grid>
  );
};

export default SignUp;
