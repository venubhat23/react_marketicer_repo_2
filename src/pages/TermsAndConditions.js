import React, { useEffect } from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";

const TermsAndConditions = () => {
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
    lastUpdated: {
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      paddingTop: "20px",
      marginTop: "30px",
      textAlign: "right",
      color: "#8ec5fc",
      fontWeight: "bold"
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
            Terms and Conditions
          </Typography>
        </Box>

        {/* Introduction */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            1. Introduction
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Marketincer ("the Service" or "the Website") is operated by <strong style={styles.bold}>SRI SUPARNA MARKETING SOLUTIONS PRIVATE LIMITED</strong>. By accessing or using the Website, you agree to comply with these terms. If you do not agree, you may not use the Website or its services.
          </Typography>
        </Box>

        {/* Account Access */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            2. Account Access
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Users must be at least 13 years old and are responsible for maintaining their login credentials.
          </Typography>
        </Box>

        {/* Usage Restrictions */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            3. Usage Restrictions
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Users are prohibited from:
          </Typography>
          <ul style={styles.list}>
            <li style={styles.listItem}>Reverse engineering or modifying the Service.</li>
            <li style={styles.listItem}>Using bots or scraping tools.</li>
            <li style={styles.listItem}>Engaging in unlawful activities.</li>
          </ul>
        </Box>

        {/* Fees & Payments */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            4. Fees & Payments
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Payments are processed through third-party providers such as <strong style={styles.bold}>Razorpay, Stripe, and Trilo</strong>.
          </Typography>
        </Box>

        {/* Registration & Security */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            5. Registration & Security
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Some services require registration. Users are responsible for maintaining account security.
          </Typography>
        </Box>

        {/* Third-Party Services */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            6. Third-Party Services
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Integrations with third-party platforms are subject to their respective terms.
          </Typography>
        </Box>

        {/* Termination */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            7. Termination
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We may suspend or terminate access to the Service at any time.
          </Typography>
        </Box>

        {/* Content Ownership */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            8. Content Ownership
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Users may not copy, modify, or distribute content without explicit permission.
          </Typography>
        </Box>

        {/* Changes to Terms */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            9. Changes to Terms
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance.
          </Typography>
        </Box>

        {/* Service Warranties */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            10. Service Warranties
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We commit to maintaining a professional standard of service.
          </Typography>
        </Box>

        {/* Disclaimer */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            11. Disclaimer of Warranties
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            The Website and Service are provided "as is" without any warranties, express or implied.
          </Typography>
        </Box>

        {/* Last Updated */}
        <Box style={styles.lastUpdated}>
          <Typography variant="body2">
            Last Updated: March 12, 2025
          </Typography>
        </Box>

        {/* Footer */}
        <Box py={3} style={styles.footer}>
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
              href="terms-and-conditions" 
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

export default TermsAndConditions;