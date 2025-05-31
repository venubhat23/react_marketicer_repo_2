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
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
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



const SocialConnect = ({onClose, authCode, authState, socialMediaType}) => {
    const [openModal, setOpenModal] = useState(false);
    const [linkedinOpenModal, setLinkedinOpenModal] = useState(false);
    const [openInstaNoticeModal, setOpenInstaNoticeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [instagramAccounts, setInstagramAccounts] = useState([]);
    const [linkedinAccounts, setLinkedinAccounts] = useState({});
    const [linkedinType, setLinkedinType] = useState("");
    const [instagramType, setInstagramType] = useState("");
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


    const LinkedInComponent = (
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
            paddingBottom: "24px"
        }}
        >
        {/* Close Button */}
        <IconButton
            onClick={onClose}
            sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#666",
                '&:hover': {
                    backgroundColor: '#f5f5f5'
                }
            }}
        >
            <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#0077b5",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <LinkedInIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography variant="h6" fontWeight="600" sx={{ color: "#333" }}>
                LinkedIn
            </Typography>
        </Box>

        {/* Follow Button */}
        <Box sx={{ mb: 2, ml: 7 }}>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#0077b5",
                    color: "white",
                    borderRadius: "24px",
                    padding: "2px 7px",
                    textTransform: "none",
                    fontWeight: "600",
                    fontSize: "10px",
                    // '&:hover': {
                    //     backgroundColor: "#005885"
                    // }
                }}
            >
                <LinkedInIcon sx={{ fontSize: 18, mr: 1 }} />
                Follow
            </Button>
        </Box>

        <Divider sx={{ width: "100%", backgroundColor: "#e0e0e0", mb: 2 }} />

        {loading ? (
            <CircularProgress sx={{ margin: '50px auto' }}/>
        ) : (
            <>
            {linkedinType && authCode && authState == LINKEDIN_CRED.state ? (
                <Box sx={{ width: "100%", mb: 3 }} >
                    <Typography sx={{
                        fontSize: "14px",
                        color: "#373737",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        backgroundColor: "#f9f9f9"
                    }}>
                        {linkedinAccounts["name"]}
                        <span style={{ color: "green", fontWeight: 700, float: "right" }}>Connected</span>
                    </Typography>           
                </Box>
            ) : (
                <Box sx={{ width: "100%", display: "flex", gap: 7, mb: 2, justifyContent: "center" }}>
                    {["profile", "page"].map((type) => (
                        <Box
                            key={type}
                            sx={{
                                padding: "20px 30px",
                                border: linkedinType === type ? "2px solid #0077b5" : "1px solid #e0e0e0",
                                borderRadius: "16px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                backgroundColor: linkedinType === type ? "#f0f8ff" : "white",
                                textAlign: "center",
                                position: "relative",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    borderColor: "#0077b5",
                                    backgroundColor: "#f8fbff",
                                    transform: "translateY(-2px)"
                                }
                            }}
                            onClick={() => {
                                setLinkedinType(type);
                            }}
                        >
                            {/* Placeholder Icon Circle */}
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "50%",
                                    backgroundColor: "#f5f5f5",
                                    margin: "0 auto 16px auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, #ddd 4px, #ddd 8px)",
                                    opacity: 0.6
                                }}
                            />
                            
                            <Typography
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#333",
                                    textTransform: "capitalize"
                                }}
                            >
                                {type}
                            </Typography>
                            
                            {linkedinType === type && (
                                <CheckCircleIcon 
                                    sx={{ 
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        fontSize: 24, 
                                        color: "#0077b5" 
                                    }} 
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            )}
            
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    mt: 2
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#0077b5",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        textTransform: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                        "&:hover": {
                            backgroundColor: "#005885",
                        }
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

    const InstagramComponent = (
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
            borderRadius: "16px",
            maxHeight: '80vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            paddingTop: "15px",
            paddingBottom: "24px"
        }}
        >
        {/* Close Button */}
        <IconButton
            onClick={onClose}
            sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "#666",
                position: "absolute",
                top: 16,
                right: 16,
                color: "#666",
                '&:hover': {
                    backgroundColor: '#f5f5f5'
                }
            }}
        >
            <CloseIcon />
        </IconButton>

        {/* Header */}
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <InstagramIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Typography variant="h6" fontWeight="600" sx={{ color: "#333" }}>
                Instagram
            </Typography>
        </Box>

        {/* Follow us on Instagram text */}
        <Box sx={{ mb: 2, ml: 7 }}>
            <Typography 
                sx={{ 
                    fontSize: "14px", 
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >
                Follow us on Instagram
                {/* <Box
                    sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Typography sx={{ fontSize: "12px", color: "#999" }}>i</Typography>
                </Box> */}
            </Typography>
        </Box>

        <Divider sx={{ width: "100%", backgroundColor: "#e0e0e0", mb: 2 }} />

        {loading ? (
            <CircularProgress sx={{ margin: '50px auto' }}/>
        ) : (
            <>
            {instagramType && authCode ? (
                <Box sx={{ width: "100%", mb: 3 }} >
                    <Typography sx={{
                        fontSize: "14px",
                        color: "#373737",
                        padding: "20px",
                        border: "1px solid #ddd",
                        borderRadius: "12px",
                        backgroundColor: "#f9f9f9"
                    }}>
                        {instagramAccounts["name"]}
                        <span style={{ color: "green", fontWeight: 700, float: "right" }}>Connected</span>
                    </Typography>           
                </Box>
            ) : (
                <Box sx={{ width: "100%", display: "flex", gap: 7, mb: 2, justifyContent: "center" }}>
                    {[
                        { type: "facebook", label: "Professional\nvia Facebook", hasSubIcon: true },
                        { type: "instagram", label: "Professional\nvia Instagram", hasSubIcon: false }
                    ].map((item) => (
                        <Box
                            key={item.type}
                            sx={{
                                padding: "20px 30px",
                                border: instagramType === item.type ? "2px solid #e91e63" : "1px solid #e0e0e0",
                                borderRadius: "16px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                backgroundColor: instagramType === item.type ? "#fce4ec" : "white",
                                textAlign: "center",
                                position: "relative",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    borderColor: "#e91e63",
                                    backgroundColor: "#fef7f7",
                                    transform: "translateY(-2px)"
                                }
                            }}
                            onClick={() => {
                                setInstagramType(item.type);
                            }}
                        >
                            {/* Instagram Icon with optional Facebook overlay */}
                            <Box
                                sx={{
                                    position: "relative",
                                    width: 64,
                                    height: 64,
                                    margin: "0 auto 16px auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                                        borderRadius: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <InstagramIcon sx={{ color: "white", fontSize: 32 }} />
                                </Box>
                                
                                {item.hasSubIcon && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: -4,
                                            right: -4,
                                            width: 28,
                                            height: 28,
                                            backgroundColor: "#1877f2",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "2px solid white"
                                        }}
                                    >
                                        <FacebookIcon sx={{ color: "white", fontSize: 16 }} />
                                    </Box>
                                )}
                            </Box>
                            
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "#333",
                                    whiteSpace: "pre-line",
                                    lineHeight: 1.3
                                }}
                            >
                                {item.label}
                            </Typography>
                            
                            {instagramType === item.type && (
                                <CheckCircleIcon 
                                    sx={{ 
                                        position: "absolute",
                                        top: 12,
                                        right: 12,
                                        fontSize: 24, 
                                        color: "#e91e63" 
                                    }} 
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            )}
            
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    mt: 2
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#0077b5",
                        color: "white",
                        borderRadius: "8px",
                        padding: "6px 16px",
                        textTransform: "none",
                        fontWeight: "600",
                        fontSize: "14px",
                        "&:hover": {
                            backgroundColor: "#005885",
                        }
                    }}
                    onClick={() => {
                        if(instagramType && authCode) {
                            window.location.href = "/social-pages";
                        } else {
                            // handleInstagramRedirect();
                        }
                    }}
                >
                    Continue
                </Button>
            </Box>
            </>
          )}
        </Box>
    )

    if(socialMediaType == "Linkedin") {
        return LinkedInComponent
    } else {
        return InstagramComponent
    }
}
export default SocialConnect





