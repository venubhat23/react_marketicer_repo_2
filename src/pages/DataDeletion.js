import React, { useEffect } from "react";
import { Box, Container, Typography, Link } from "@mui/material";

const DataDeletion = () => {
  // Apply styles to the entire document/body when component mounts
  useEffect(() => {
    // Save original styles to restore them later
    const originalBodyStyle = document.body.style.cssText;
    const originalHtmlStyle = document.documentElement.style.cssText;
    
    // Apply styles to html and body elements
    document.body.style.backgroundColor = "#000000";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";
    document.documentElement.style.backgroundColor = "#000000";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.minHeight = "100vh";
    
    // Clean up function to restore original styles on unmount
    return () => {
      document.body.style.cssText = originalBodyStyle;
      document.documentElement.style.cssText = originalHtmlStyle;
    };
  }, []);

  // Styles object for consistent styling
  const styles = {
    // Base Styles
    mainWrapper: {
      width: "100%",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      fontFamily: "'Poppins', sans-serif",
      color: "#ffffff",
      overflow: "auto"
    },
    container: {
      backgroundColor: "rgba(20, 20, 20, 0.8)",
      backdropFilter: "blur(10px)",
      borderRadius: "15px",
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      padding: "30px",
      marginTop: "30px",
      marginBottom: "30px"
    },
    companyHeader: {
      textAlign: "center",
      marginBottom: "15px"
    },
    companyName: {
      background: "linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0 0 15px rgba(142, 197, 252, 0.5)",
      fontWeight: "800",
      fontSize: "2.5rem",
      letterSpacing: "1px"
    },
    header: {
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      paddingBottom: "20px",
      textAlign: "center",
      marginBottom: "24px"
    },
    headerTitle: {
      background: "linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0 0 10px rgba(142, 197, 252, 0.3)",
      fontWeight: "bold"
    },
    sectionTitle: {
      color: "#8ec5fc",
      marginBottom: "10px",
      textShadow: "0 0 5px rgba(142, 197, 252, 0.5)",
      fontWeight: "bold"
    },
    sectionContent: {
      color: "#e0e0e0",
      lineHeight: "1.7",
      marginTop: "16px"
    },
    bold: {
      color: "#ffffff",
      fontWeight: "bold"
    },
    section: {
      marginBottom: "24px"
    },
    listItem: {
      marginBottom: "8px",
      color: "#e0e0e0"
    },
    list: {
      paddingLeft: "20px",
      color: "#e0e0e0"
    },
    footer: {
      background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(25,25,25,0.7) 100%)",
      borderRadius: "0 0 10px 10px",
      marginTop: "20px",
      marginLeft: "-30px",
      marginRight: "-30px",
      marginBottom: "-30px",
      paddingLeft: "30px",
      paddingRight: "30px",
      paddingTop: "15px",
      paddingBottom: "15px",
      textAlign: "center"
    },
    copyright: {
      color: "#8ec5fc",
      fontWeight: "bold"
    },
    footerLinks: {
      marginTop: "10px"
    },
    link: {
      color: "#e0e0e0",
      textDecoration: "none",
      margin: "0 10px",
      transition: "color 0.3s"
    },
    linkHover: {
      color: "#8ec5fc"
    },
    note: {
      marginTop: "16px",
      fontSize: "0.9rem",
      color: "#bdbdbd"
    }
  };

  return (
    <div style={styles.mainWrapper}>
      <Container maxWidth="md" style={styles.container}>
        {/* Company Header */}
        <Box style={styles.companyHeader}>
          <Typography variant="h1" style={styles.companyName}>
            Marketincer
          </Typography>
        </Box>
        
        {/* Header */}
        <Box style={styles.header}>
          <Typography variant="h4" style={styles.headerTitle}>
            Data Deletion Request
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            At <strong style={styles.bold}>Marketincer</strong>, we value your privacy and provide full control over your data. If you wish to delete your personal information, follow the steps below.
          </Typography>
        </Box>

        {/* Automatic Deletion */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            How to Request Data Deletion
          </Typography>
          
          <Typography variant="h6" style={{...styles.sectionTitle, fontSize: "1.1rem", marginTop: "16px"}}>
            Option 1: Automatic Deletion (For Facebook Users)
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            If you logged in via Facebook and want to delete your data:
          </Typography>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Go to <Link href="https://www.facebook.com/settings?tab=applications" target="_blank" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>Facebook's App Settings</Link>
            </li>
            <li style={styles.listItem}>Find and select <strong style={styles.bold}>Marketincer</strong></li>
            <li style={styles.listItem}>Click <strong style={styles.bold}>Remove</strong> and select <strong style={styles.bold}>Delete all data</strong></li>
            <li style={styles.listItem}>Your data will be automatically removed from our system</li>
          </ul>
        </Box>

        {/* Manual Deletion */}
        <Box style={styles.section}>
          <Typography variant="h6" style={{...styles.sectionTitle, fontSize: "1.1rem"}}>
            Option 2: Manual Data Deletion Request
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            If you prefer to request data deletion manually, follow these steps:
          </Typography>
          <ul style={styles.list}>
            <li style={styles.listItem}>Email us at <strong style={styles.bold}>info@marketincer.com</strong> with the subject: <strong style={styles.bold}>"Request for Data Deletion"</strong></li>
            <li style={styles.listItem}>Include your Full Name, Registered Email, and Facebook User ID (if applicable)</li>
            <li style={styles.listItem}>We will verify your request and delete your data within <strong style={styles.bold}>7 working days</strong></li>
            <li style={styles.listItem}>You will receive a confirmation email once the deletion is completed</li>
          </ul>
        </Box>

        {/* Data Removed */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            What Data is Removed?
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            The following information will be permanently erased upon request:
          </Typography>
          <ul style={styles.list}>
            <li style={styles.listItem}>Your profile details (name, email, and associated data)</li>
            <li style={styles.listItem}>Stored activity related to your account</li>
            <li style={styles.listItem}>Linked social login data</li>
          </ul>
          <Typography variant="body2" style={styles.note}>
            <strong style={styles.bold}>Note:</strong> Some data may be retained for legal or security reasons per our <Link href="privacy-policy" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>Privacy Policy</Link>.
          </Typography>
        </Box>

        {/* Help Section */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            📌 Need Help?
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            For any data deletion inquiries, contact us:
          </Typography>
          <Typography variant="body2" style={{...styles.sectionContent, marginTop: "8px"}}>
            <strong style={styles.bold}>Email:</strong> <Link href="mailto:info@marketincer.com" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>info@marketincer.com</Link>
          </Typography>
          <Typography variant="body2" style={{...styles.sectionContent, marginTop: "8px"}}>
            For more details, visit our <Link href="privacy-policy" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>Privacy Policy</Link> page.
          </Typography>
        </Box>

        {/* Footer */}
        <Box style={styles.footer}>
          <Typography variant="body2" style={styles.copyright}>
            &copy; 2025 Marketincer. All rights reserved.
          </Typography>
          <div style={styles.footerLinks}>
            <Link 
              href="/" 
              style={styles.link} 
              onMouseOver={(e) => e.target.style.color = styles.linkHover.color} 
              onMouseOut={(e) => e.target.style.color = styles.link.color}
            >
              Home
            </Link> | 
            <Link 
              href="terms" 
              style={styles.link}
              onMouseOver={(e) => e.target.style.color = styles.linkHover.color} 
              onMouseOut={(e) => e.target.style.color = styles.link.color}
            >
              Terms of Service
            </Link> | 
            <Link 
              href="privacy-policy" 
              style={styles.link}
              onMouseOver={(e) => e.target.style.color = styles.linkHover.color} 
              onMouseOut={(e) => e.target.style.color = styles.link.color}
            >
              Privacy Policy
            </Link> | 
            <Link 
              href="data-deletion" 
              style={styles.link}
              onMouseOver={(e) => e.target.style.color = styles.linkHover.color} 
              onMouseOut={(e) => e.target.style.color = styles.link.color}
            >
              Data Deletion
            </Link>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default DataDeletion;