import React, {useCallback} from 'react';
import {Button, Typography} from '@mui/material';



const SocialDisConnect =({openModal = false, onCloseModal}) =>{
   
  
    return (
      <>
        <Typography variant="h6" component="h2">
        Child Component Modal Content
      </Typography>
      <Typography sx={{ mt: 2 }}>
        This content is rendered from the child component.
      </Typography>
      </>
    );
}

export default SocialDisConnect