import React, {useEffect, useState} from 'react'
//import { XIcon } from "lucide-react";
import { Button,Card, CardContent, DialogClose,DialogHeader,
    DialogTitle,InputSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue, } from "@mui/material";

import { Box, IconButton, Modal, Typography, CircularProgress, Grid } from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Divider from "@mui/material/Divider";
import AxiosManager from '../utils/api';

const FACEBOOK_APP_ID = "499798672825129";
const FACEBOOK_APP_SECRET = "0972b471f1d251f8db7762be1db4613c";
const REDIRECT_URI = "https://www.marketincer.com/social";

const LINKEDIN_CRED = {
  clientId: "77ufne14jzxbbc",
  clientSecret: "k0a1Jt5K0iZx7l7Y",
  redirectUri: "http://localhost:3000/socialMedia",
  scope: "openid profile email w_member_social",
  state: "marketincer-linkedin", // Should be random & stored for verification
}



const SocialConnect = ({onClose, authCode, authState}) => {
    const [openModal, setOpenModal] = useState(false);
    const [linkedinOpenModal, setLinkedinOpenModal] = useState(false);
    const [openInstaNoticeModal, setOpenInstaNoticeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [instagramAccounts, setInstagramAccounts] = useState([]);
    const [linkedinAccounts, setLinkedinAccounts] = useState({});
    const [linkedinType, setLinkedinType] = useState("");
    const [gettingPage, setGettingPage] = useState(false);
        const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    async function fetchLinkedInProfile(code, redirectUri, type) {
        try {
          const paylod = {
              code: code,
              redirect_uri: redirectUri,
              type: type,
          };
          console.log('Payload:', paylod);
          const response = await AxiosManager.post('/api/v1/linkedin/exchange-token', paylod);
          console.log('Access Token:', response);
          const data =  response.data;
          if (data.status == "success") {
              // Store the access token in localStorage
              localStorage.setItem("linkedin_access_token", data["accessToken"]);
      
          //     // Proceed with fetching the LinkedIn accounts
          //     // fetchAccountsFromAPI(accessToken);
          }
          return data;
        } catch (error) {
          console.error('Failed to fetch LinkedIn access token:', error);
          throw error;
        }
      }


    useEffect(() => {
        console.log("SocialConnect mounted", authCode, authState);
        if (authCode) {
            fetchAccessToken(authCode, authState);
        }
    }, []);

    const fetchAccessToken = async (code, authState='') => {
        setLoading(true);

        try {
        if (code) {
            if(authState == LINKEDIN_CRED.state) {
                console.log("LinkedIn auth code:", code);
                let response = await fetchLinkedInProfile(code, LINKEDIN_CRED.redirectUri, linkedinType);
                setOpenModal(true);
                console.log("LinkedIn response:", response);
                setLinkedinAccounts(response.user_profile)
            } else {
                // Step 1: Exchange the code for a short-lived access token
                const tokenResponse = await fetch(
                    `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`
                );
                const tokenData = await tokenResponse.json();

                const shortLivedToken = tokenData.access_token;
                if (shortLivedToken) {
                    // Step 2: Exchange the short-lived token for a long-lived token
                    const longTokenResponse = await fetch(
                    `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${shortLivedToken}`
                    );
                    const longTokenData = await longTokenResponse.json();

                    const longLivedToken = longTokenData.access_token;

                    if (longLivedToken) {
                    // Store the long-lived access token in localStorage
                    localStorage.setItem("fb_access_token", longLivedToken);

                    // Proceed with fetching the Facebook pages and Instagram accounts
                    fetchAccountsFromAPI(longLivedToken);

                    // Clear the code from the query params
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl); // Remove the code from the URL
                    }
                }
            }
        }
        } catch (error) {
        console.error("Error fetching access token:", error);
        } finally {
        setLoading(false);
        }
    };


    const fetchAccountsFromAPI = async (authCode) => {
        setGettingPage(true);
        const token = localStorage.getItem("token");
        try {
        const response = await fetch(
            `https://api.marketincer.com/api/v1/social_accounts/get_pages`, 
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                auth_token: authCode
            })
            }
        );
    
        const data = await response.json();
        console.log("Fetched accounts:", data);
        setPages(data.data.accounts);
        setOpenModal(true);
    
        // Automatically connect if only 1 account exists
        if (data.data.accounts.length === 1) {
            await handleConnect(data.data.accounts[0]);
        }
        } catch (error) {
        console.error("Error fetching accounts:", error);
        } finally {
        setGettingPage(false);
        }
    };
    
    // Update handleConnect to use functional update
    const handleConnect = async (account) => {
        const token = localStorage.getItem("token");
        try {
        const response = await fetch("https://api.marketincer.com/api/v1/social_pages/connect", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            page: account
            }),
        });
    
        const data = await response.json();
    
        if (data.status) {
            // Use functional update to ensure state consistency
            setPages(prevPages => 
            prevPages.map(pg =>
                pg.page_id === account.page_id ? { ...pg, connected: true } : pg
            )
            );
            openSuccessSB();
        } else {
            alert(`Failed to connect ${account.name}`);
        }
        } catch (error) {
        console.error("Error connecting account:", error);
        alert("Failed to connect account.");
        }
    };

    // const handleAuthRedirect = (platform) => {
    //     let authURL = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_content_publish&response_type=code`;

    //     if (platform === "facebook" || platform === "instagram") {
    //     window.location.href = authURL;
    //     }
    // };

    const handleLinkedinRedirect = () => {
        const clientId = LINKEDIN_CRED.clientId;
        const redirectUri = encodeURIComponent(LINKEDIN_CRED.redirectUri);
        const state = LINKEDIN_CRED.state; // Should be random & stored for verification
        const scope = LINKEDIN_CRED.scope;

        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };


    return (
        <Box
        sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
            maxHeight: '80vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: "15px",
            paddingBottom: "3px"
        }}
        >
        {/* Close Button */}
        <IconButton
            onClick={onClose}  // Close the modal on click
            sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#888",  // Light gray color for the close button
            }}
        >
            <CloseIcon />
        </IconButton>


        <Box
            sx={{
            display: "flex",
            }}
        >
            <LinkedInIcon fontSize="large" sx={{ color: "#1778f4" }} />
            <Typography variant="h6" fontWeight="bold" mb={2} sx={{ textAlign: 'center', marginTop: "5px" }}>
            LinkedIn
            </Typography>
        </Box>

        <Divider sx={{ margin: 0, width: "100%", backgroundColor: "#bbbbbb" }} />

        {loading ? (
            <CircularProgress sx={{ 'margin': '50px auto' }}/>
        ) : (
            <>
            {linkedinType && authCode && authState == LINKEDIN_CRED.state ? (
                <Box sx={{ margin: 0, width: "100%", }} >
                    <Typography sx={{
                    fontSize: "14px",
                    color: "#373737",
                    padding: "20px",
                    border: "1px solid #ddd",
                    margin: "20px 0",
                    }}>
                    {linkedinAccounts["name"]}
                    <span style={{ "color": "green", "fontWeight": 700, "float": "right" }}>Connected</span>
                    </Typography>           
                </Box>
                ) : (
                <Box sx={{ margin: 0, width: "100%", display: "flex", gap: 2 }}>
                    {["profile", "pages"].map((type) => (
                    <Box
                        key={type}
                        sx={{
                        flex: 1,
                        padding: "12px 24px",
                        border: linkedinType === type ? "1px solid #1976d2" : "1px solid",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "0.3s",
                        backgroundColor: linkedinType === type ? "#e3f2fd" : "white",
                        margin: "20px 0",
                        "&:hover": {
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            borderColor: "#1976d2",
                            backgroundColor: "#f5faff",
                        },
                        }}
                        onClick={() => {
                        setLinkedinType(type);
                        }}
                    >
                        <Typography
                        sx={{
                            fontSize: "14px",
                            color: "#373737",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                        >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                        {linkedinType == type && (
                            <CheckCircleIcon sx={{ fontSize: 20, color: "#1976d2" }} />
                        )}
                        </Typography>
                    </Box>
                    ))}
                </Box>
                )
            }
            <Box
                sx={{
                display: "flex",
                justifyContent: "flex-end", // ✅ Aligns buttons to the right
                alignItems: "center",
                gap: "1rem",
                width: "100%", // Prevents overflow
                }}
            >

                <Button
                    variant="gradient"
                    sx={{
                        margin: "0.09375rem 1px",
                        mb: 2,
                        backgroundColor: "#01cbc6 !important", // Ensures background color applies
                        color: "white !important", // ✅ Forces white text
                        "&:hover": {
                        backgroundColor: "#00b3ad !important", // Slightly darker on hover
                        },
                    }}
                    onClick={() => {
                        if(linkedinType && authCode && authState == LINKEDIN_CRED.state) {
                        window.location.href = "/social-pages";
                        } else {
                        handleLinkedinRedirect();
                        }
                    }}
                    >
                    Continue
                </Button>
            </Box>

            </>
        )}
        </Box>
    );
}
export default SocialConnect





