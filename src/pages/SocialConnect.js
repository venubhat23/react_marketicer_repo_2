import React, {useEffect, useState} from 'react';
import { 
    Button, 
    IconButton, 
    Box, 
    Typography, 
    TextField,
    Divider,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AxiosManager from '../utils/api';

const FACEBOOK_APP_ID = "499798672825129";
const FACEBOOK_APP_SECRET = "0972b471f1d251f8db7762be1db4613c";
const REDIRECT_URI = "https://app.marketincer.com/socialMedia";


const SocialConnect = ({onClose, authCode, authState, socialMediaType}) => {
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [linkedinAccounts, setLinkedinAccounts] = useState([]);
    const [linkedinType, setLinkedinType] = useState(localStorage.getItem("linkedin_type") || "profile");
    const [instagramType, setInstagramType] = useState("");
    const [gettingPage, setGettingPage] = useState(false);
    const [successSB, setSuccessSB] = useState(false);
    const [showAccountsList, setShowAccountsList] = useState(false);

    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);

    // LinkedIn credentials by type
    let LINKEDIN_CRED = {
        clientId: "77ufne14jzxbbc",
        clientSecret: "k0a1Jt5K0iZx7l7Y",
        redirectUri: "https://app.marketincer.com/socialMedia",
        scope: "openid profile email w_member_social",
        state: "marketincer-linkedin",
    };
    if (linkedinType === "pages") {
        LINKEDIN_CRED = {
            clientId: "780iu7cgaok1lf",
            clientSecret: "WPL_AP1.pBnxoZgtOaxFkqeN.4Z42vA==",
            redirectUri: "https://app.marketincer.com/socialMedia",
            scope: "r_member_postAnalytics r_organization_followers r_organization_social rw_organization_admin r_organization_social_feed w_member_social r_member_profileAnalytics w_organization_social r_basicprofile w_organization_social_feed w_member_social_feed r_1st_connections_size",
            state: "marketincer-linkedin",
        };
    }

    async function fetchLinkedInProfile(code, redirectUri) {
        try {
            const payload = {
                code: code,
                redirect_uri: redirectUri,
                type: linkedinType,
            };
            const response = await AxiosManager.post('/api/v1/linkedin/exchange-token', payload);
            const data = response.data;
            if (data.status === "complete") {
                localStorage.setItem("linkedin_access_token", data["access_token"]);
            }
            return data;
        } catch (error) {
            console.error('Failed to fetch LinkedIn access token:', error);
            throw error;
        }
    }

    useEffect(() => {
        if (authCode) {
            fetchAccessToken(authCode, authState);
        }
        // eslint-disable-next-line
    }, []);

    const fetchAccessToken = async (code, authState = '') => {
        setLoading(true);
        try {
            if (code) {
                if (authState === LINKEDIN_CRED.state) {
                    let response = await fetchLinkedInProfile(code, LINKEDIN_CRED.redirectUri);
                    setShowAccountsList(true);
                    if (linkedinType === "pages") {
                        const result = response?.data?.accounts || [];
                        setLinkedinAccounts(result);
                    } else {
                        setLinkedinAccounts([{
                            ...response.user_profile,
                            access_token: response.access_token,
                        }]);
                    }
                } else {
                    // Facebook/Instagram
                    const tokenResponse = await fetch(
                        `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`
                    );
                    const tokenData = await tokenResponse.json();
                    const shortLivedToken = tokenData.access_token;
                    if (shortLivedToken) {
                        const longTokenResponse = await fetch(
                            `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=fb_exchange_token&fb_exchange_token=${shortLivedToken}`
                        );
                        const longTokenData = await longTokenResponse.json();
                        const longLivedToken = longTokenData.access_token;
                        if (longLivedToken) {
                            localStorage.setItem("fb_access_token", longLivedToken);
                            fetchAccountsFromAPI(longLivedToken);
                            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                            window.history.replaceState({}, document.title, newUrl);
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
                    body: JSON.stringify({ auth_token: authCode })
                }
            );
            const data = await response.json();
            setPages(data.data.accounts);
            setShowAccountsList(true);
            if (data.data.accounts.length === 1) {
                await handleConnect(data.data.accounts[0]);
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setGettingPage(false);
        }
    };

    // --- UPDATED LINKEDIN CONNECT FUNCTION ---
    const handleLinkedinConnect = async (account) => {
        const token = localStorage.getItem("token");
        try {
            const payload = {
                access_token: account.access_token,
                user_info: account.user || account, // For single profile, the whole object is user_info
                picture_url: account.user?.logoV2?.original || account.logoV2?.original || ""
            };
            const response = await fetch("https://api.marketincer.com/api/v1/linkedin/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (data.status === "success") {
                setLinkedinAccounts(prevAccounts => 
                    prevAccounts.map(pg =>
                        pg.page_id === account.page_id ? { ...pg, connected: true } : pg
                    )
                );
                openSuccessSB();
            } else {
                alert(`Failed to connect ${account.name}: ${data.error || ''}`);
            }
        } catch (error) {
            console.error("Error connecting account:", error);
            alert("Failed to connect account.");
        }
    };

    const handleConnect = async (account) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("https://api.marketincer.com/api/v1/social_pages/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ page: account }),
            });
            const data = await response.json();
            if (data.status) {
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

    const handleAuthRedirect = (platform) => {
        let authURL = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_show_list,instagram_basic,instagram_manage_insights,instagram_manage_comments,pages_read_engagement,instagram_content_publish&response_type=code`;
        if (platform === "facebook" || platform === "instagram") {
            window.location.href = authURL;
        }
    };

    const handleLinkedinRedirect = () => {
        const clientId = LINKEDIN_CRED.clientId;
        const redirectUri = encodeURIComponent(LINKEDIN_CRED.redirectUri);
        const state = LINKEDIN_CRED.state;
        const scope = LINKEDIN_CRED.scope;
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${encodeURIComponent(scope)}`;
        window.location.href = authUrl;
    };

    // Snackbar for success
    const renderSuccessSB = (
        <Snackbar
            open={successSB}
            autoHideDuration={6000}
            onClose={closeSuccessSB}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert 
                onClose={closeSuccessSB} 
                severity="success" 
                sx={{ width: '100%' }}
            >
                Account connected successfully!
            </Alert>
        </Snackbar>
    );

    // LinkedIn Modal
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
                    '&:hover': { backgroundColor: '#f5f5f5' }
                }}
            >
                <CloseIcon />
            </IconButton>
            {/* Header */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
            }}>
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
                    {/* Show accounts list after authentication */}
                    {showAccountsList && linkedinAccounts.length > 0 ? (
                        <>
                            <Box sx={{ margin: 0, width: "100%" }}>
                                <Typography sx={{
                                    fontSize: "14px",
                                    color: "#373737",
                                    paddingTop: "20px",
                                }}>
                                    Select the accounts that you want to add.
                                </Typography>
                                {linkedinAccounts.length > 1 && (
                                    <TextField 
                                        label="Search here" 
                                        variant="outlined"
                                        size="small"
                                        sx={{ margin: "10px 0", width: "100%" }} 
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    maxHeight: "40vh",
                                    overflowY: "auto",
                                    listStyleType: "none",
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            >
                                {linkedinAccounts.map((account, idx) => (
                                    <Box
                                        key={account.page_id || account.id || idx}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#f9f9f9",
                                            transition: "background-color 0.3s ease",
                                            "&:hover": { backgroundColor: "#f1f1f1" }
                                        }}
                                    >
                                        <img
                                            src={account?.user?.logoV2?.original || account?.logoV2?.original || ""}
                                            alt={account.name || account.localizedName}
                                            style={{
                                                borderRadius: "50%",
                                                width: "40px",
                                                height: "40px",
                                                marginRight: "15px",
                                            }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1" fontWeight="bold" sx={{
                                                fontSize: "14px",
                                                color: "#373737",
                                            }}>
                                                {account.name || account.localizedName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                fontSize: "12px",
                                            }}>
                                                {account.username || account.vanityName}
                                            </Typography>
                                        </Box>
                                        {account.connected ? (
                                            <Typography
                                                sx={{
                                                    color: "green",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Connected
                                            </Typography>
                                        ) : (
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => handleLinkedinConnect(account)}
                                                sx={{
                                                    textDecoration: "underline",
                                                    padding: 0,
                                                    minWidth: "auto",
                                                    "&:hover": { backgroundColor: "transparent" }
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ width: "100%", display: "flex", gap: 7, mb: 2, justifyContent: "center" }}>
                            {["profile", "pages"].map((type) => (
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
                                        localStorage.setItem("linkedin_type", type);
                                    }}
                                >
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
                                "&:hover": { backgroundColor: "#005885" }
                            }}
                            onClick={() => {
                                if (linkedinAccounts && authCode && authState === LINKEDIN_CRED.state) {
                                    window.location.href = "/socialMedia";
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

    // Instagram Modal (unchanged)
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
                    '&:hover': { backgroundColor: '#f5f5f5' }
                }}
            >
                <CloseIcon />
            </IconButton>
            {/* Header */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
            }}>
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
            <Box sx={{ mb: 2, ml: 7 }}>
                <Typography sx={{ fontSize: "14px", color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                    Follow us on Instagram
                </Typography>
            </Box>
            <Divider sx={{ width: "100%", backgroundColor: "#e0e0e0", mb: 2 }} />
            {loading ? (
                <CircularProgress sx={{ margin: '50px auto' }}/>
            ) : (
                <>
                    {showAccountsList && pages.length > 0 ? (
                        <>
                            <Box sx={{ margin: 0, width: "100%" }}>
                                <Typography sx={{
                                    fontSize: "14px",
                                    color: "#373737",
                                    paddingTop: "20px",
                                }}>
                                    Select the accounts that you want to add.
                                </Typography>
                                {pages.length > 1 && (
                                    <TextField 
                                        label="Search here" 
                                        variant="outlined"
                                        size="small"
                                        sx={{ margin: "10px 0", width: "100%" }} 
                                    />
                                )}
                            </Box>
                            <Box
                                sx={{
                                    maxHeight: "40vh",
                                    overflowY: "auto",
                                    listStyleType: "none",
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                    marginTop: "20px",
                                    width: "100%"
                                }}
                            >
                                {pages.map((account) => (
                                    <Box
                                        key={account.page_id}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#f9f9f9",
                                            transition: "background-color 0.3s ease",
                                            "&:hover": { backgroundColor: "#f1f1f1" }
                                        }}
                                    >
                                        <img
                                            src={account?.user?.picture?.data?.url}
                                            alt={account.name}
                                            style={{
                                                borderRadius: "50%",
                                                width: "40px",
                                                height: "40px",
                                                marginRight: "15px",
                                            }}
                                        />
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1" fontWeight="bold" sx={{
                                                fontSize: "14px",
                                                color: "#373737",
                                            }}>
                                                {account.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{
                                                fontSize: "12px",
                                            }}>
                                                {account.username}
                                            </Typography>
                                        </Box>
                                        {account.connected ? (
                                            <Typography
                                                sx={{
                                                    color: "green",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                Connected
                                            </Typography>
                                        ) : (
                                            <Button
                                                variant="text"
                                                color="primary"
                                                onClick={() => handleConnect(account)}
                                                sx={{
                                                    textDecoration: "underline",
                                                    padding: 0,
                                                    minWidth: "auto",
                                                    "&:hover": { backgroundColor: "transparent" }
                                                }}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                            <Box sx={{ margin: 0, width: "100%" }}>
                                <Typography sx={{
                                    fontSize: "14px",
                                    color: "#373737",
                                    paddingTop: "20px",
                                }}>
                                    You can only add Facebook Profiles, Facebook Groups, and Facebook Pages, including Instagram Business accounts linked to Facebook Pages.
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        !authCode && (
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
                                        onClick={() => setInstagramType(item.type)}
                                    >
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
                        )
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
                                backgroundColor: "#e91e63",
                                color: "white",
                                borderRadius: "8px",
                                padding: "6px 16px",
                                textTransform: "none",
                                fontWeight: "600",
                                fontSize: "14px",
                                "&:hover": { backgroundColor: "#c2185b" }
                            }}
                            onClick={() => {
                                if (showAccountsList && pages.length > 0) {
                                    window.location.href = "/socialMedia";
                                } else {
                                    handleAuthRedirect("instagram");
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

    return (
        <>
            {socialMediaType === "Linkedin" ? LinkedInComponent : InstagramComponent}
            {renderSuccessSB}
            {gettingPage && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CircularProgress size={60} />
                </Box>
            )}
        </>
    );
};

export default SocialConnect;