
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
          backgroundColor: '#882AFF', // Purple background
          color: '#ffffff', // White text
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#882AFF', // Keep same background on hover
            color: '#ffffff', // Keep white text on hover
          },
          '&:focus': {
            backgroundColor: '#882AFF', // Keep same background on focus
            color: '#ffffff', // Keep white text on focus
          },
          '&:active': {
            backgroundColor: '#882AFF', // Keep same background on active/click
            color: '#ffffff', // Keep white text on active/click
          },
          '&.Mui-focusVisible': {
            backgroundColor: '#882AFF', // Keep same background on focus visible
            color: '#ffffff', // Keep white text on focus visible
          },
          '&.MuiButton-text': {
            backgroundColor: 'transparent',
            color: '#882AFF',
            '&:hover': {
              backgroundColor: 'rgba(136, 42, 255, 0.1)',
              color: '#882AFF',
            },
          },
          '&.MuiButton-outlined': {
            backgroundColor: 'transparent',
            color: '#882AFF',
            borderColor: '#882AFF',
            '&:hover': {
              backgroundColor: 'rgba(136, 42, 255, 0.1)',
              borderColor: '#882AFF',
              color: '#882AFF',
            },
          },
        },
        contained: {
          backgroundColor: '#882AFF',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#882AFF',
            color: '#ffffff',
          },
          '&:focus': {
            backgroundColor: '#882AFF',
            color: '#ffffff',
          },
          '&:active': {
            backgroundColor: '#882AFF',
            color: '#ffffff',
          },
        },
      },
    },

  },
  
});


export default theme;
