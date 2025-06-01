import React, {useCallback} from 'react';
import {Button, Typography, Stack} from '@mui/material';

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
    console.log("Connect API Response:", data);
    onClose()
    if (data.status) {
      getAccounts()
      window.location.reload();
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
        <Typography variant="h6" component="h2">
          Are you sure?
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Do you really want to perform this action?
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
          <Button variant="contained" color="error" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleDisConnect(account, onClose, getAccounts)}>
            Yes
          </Button>
        </Stack>
      </>
    );
}

export default SocialDisConnect