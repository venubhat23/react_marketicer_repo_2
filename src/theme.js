
import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins';

const theme = createTheme({
  palette: {
    background: {
      default: '#f6edf8',
    },
  },
  typography: {
    fontFamily: `'Poppins', Arial, sans-serif`,
    h1: {
      fontFamily: `'Poppins', Arial, sans-serif`,
    },
    h2: {
      fontFamily: `'Poppins', Arial, sans-serif`,
    },
    h3: {
        fontFamily: `'Poppins', Arial, sans-serif`,
      },
    h4: {
      fontFamily: `'Poppins', Arial, sans-serif`,
    },
    h5: {
        fontFamily: `'Poppins', Arial, sans-serif`,
      },
    h6: {
        fontFamily: `'Poppins', Arial, sans-serif`,
    },
    body1: {
      fontFamily: `'Poppins', Arial, sans-serif`,
    },
    body2: {
      fontFamily: `'Poppins', Arial, sans-serif`,
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: '8px',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#882AFF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ddd',
            borderWidth: '1px',
            //backgroundColor:'#fff'
          },
          
        },
        input: {
          color: '#882AFF', // Text color
          padding: '12px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#882AFF',
          '&.Mui-focused': {
            color: '#882AFF',
            backgroundColor:'#fff !important'
          },
        },
      },
    },
    '&.Mui-selected': {
      backgroundColor: '#ddd',
      color: '#882AFF',
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '16px',
          '&.Mui-selected': {
            color: '#673ab7',
            background:'#eeeeee',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase
          borderRadius: 8,
          padding: '10px 20px',
          color: '#882AFF',
          '&:hover': {
            backgroundColor: '#f6edf8',
            color:'#882AFF'
          },
        },
      },
    },

  },
  
});


export default theme;
