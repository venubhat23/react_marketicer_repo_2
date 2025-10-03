import React, {useCallback} from 'react';
import {Button, Typography, Stack} from '@mui/material';
import warnIcon from '../assets/images/warn.png';


const handleDisConnect = async (account, onClose, getAccounts) => {

  const token = localStorage.getItem("token");
  try {
    // Call the connect API with the selected account's data
    const response = await fetch("https://api.marketincer.com/api/v1/social_pages/dis_connect  ", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        page: account
      }),
    });

    const data = await response.json();
    console.log("Disconnect API Response:", data);
    onClose()
    if (data.status) {
      // Refresh accounts without page reload
      getAccounts();
      // alert(`${account.name} disconnected successfully!`);
    } else {
      alert(`Failed to disconnect ${account.name}`);
    }
  } catch (error) {
    console.error("Error connecting account:", error);
    onClose()
    alert("Failed to disconnect account.");
  }
};

const SocialDisConnect =({onClose, account, getAccounts}) =>{
   console.log("account", account);
  
    return (
      <>
        <Typography>
          <img src={warnIcon} className="warnButton" alt="instagram" width='25' height='25'  />
        </Typography>
        <Typography variant="h6" component="h2" sx={{color:'#882AFF'}}>
          Disconnect Account 
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Are you sure you wnat to disconnect this account ?<br></br>
          This action cannot be undone
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" className="disconnectBtn" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" className="disconnectBtn" onClick={() => handleDisConnect(account, onClose, getAccounts)}>
            Disconnect
          </Button>
        </Stack>
      </>
    );
}

export default SocialDisConnect