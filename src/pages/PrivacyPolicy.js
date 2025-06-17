import React, { useEffect } from "react";
import { Box, Container, Typography, Link, Grid } from "@mui/material";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            This Privacy Policy explains how <strong style={styles.bold}>SRI SUPARNA MARKETING SOLUTIONS PRIVATE LIMITED</strong> ("Marketincer," "we," "our," or "us") collects, uses, and discloses personally identifiable information from users of our website, <Link href="https://marketincer.com" target="_blank" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>https://marketincer.com</Link>, and all related services.
          </Typography>
        </Box>

        {/* Introduction */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            1. Introduction
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Since Marketincer integrates with various social networks, the information you provide or we collect may be shared with these platforms and is subject to their respective privacy policies. We do not control their data practices. To understand how your information is used by them, please review their privacy policies.
          </Typography>
        </Box>

        {/* Information Collection */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            2. Information Collection and Use
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We collect personally identifiable information primarily to provide our services, communicate with you, and manage your registered account if you have one. If you choose not to provide the requested information, certain features may not be available to you.
          </Typography>
          <Typography variant="h6" style={{...styles.sectionTitle, fontSize: "1.1rem", marginTop: "16px"}}>
            Information Collected During Registration
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            To access restricted sections of our Site, you may need to register and provide certain personal details, including your full name, email address, and time zone.
          </Typography>
          <Typography variant="h6" style={{...styles.sectionTitle, fontSize: "1.1rem", marginTop: "16px"}}>
            Use of Contact Information
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We may use your contact details to send marketing communications regarding our services. If you wish to opt out, you can unsubscribe via email instructions.
          </Typography>
        </Box>

        {/* Cookies */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            3. Cookies
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We use cookies to enhance website functionality. Cookies do not collect personally identifiable information. Marketincer may use session cookies (temporary) and persistent cookies (remain after closing the browser).
          </Typography>
        </Box>

        {/* Information Sharing */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            4. Information Sharing
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Our primary use of your data is to publish your content on the social networks you have authenticated with. If you link your Marketincer account to a third-party social platform, your information may be shared with that service.
          </Typography>
        </Box>

        {/* Access to Information */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            5. Access to Information
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            You can access and update your personal information via your account settings. To delete your data, contact us at <strong style={styles.bold}>info@marketincer.com</strong>.
          </Typography>
        </Box>

        {/* Data Security */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            6. Data Security
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We use <strong style={styles.bold}>AWS</strong> servers and security measures to protect your data from unauthorized access. In case of a data breach, affected users will be notified as per legal requirements.
          </Typography>
        </Box>

        {/* External Links */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            7. External Links
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            Our website may contain links to third-party sites. We are not responsible for their privacy practices and encourage you to review their policies before providing personal information.
          </Typography>
        </Box>

        {/* Data Transfer */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            8. Data Transfer
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            By using Marketincer, you consent to your data being processed on <strong style={styles.bold}>AWS servers</strong>, which may be located outside your country.
          </Typography>
        </Box>

        {/* Children's Privacy */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            9. Children's Privacy
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We do not knowingly collect information from individuals under 13. If we discover that a child under 13 has provided us with personal data, we will delete it immediately.
          </Typography>
        </Box>

        {/* Policy Updates */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            10. Changes to This Policy
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            We may update this Privacy Policy periodically. Any significant changes will be announced on our Site.
          </Typography>
        </Box>

        {/* Contact Information */}
        <Box style={styles.section}>
          <Typography variant="h5" style={styles.sectionTitle}>
            11. Contact Information
          </Typography>
          <Typography variant="body1" style={styles.sectionContent}>
            If you have any questions, contact us at:
          </Typography>
          <Typography variant="body2" style={{...styles.sectionContent, marginTop: "10px"}}>
            <strong style={styles.bold}>SRI SUPARNA MARKETING SOLUTIONS PRIVATE LIMITED</strong><br />
            #47 Sri Garuda 2nd Cross, 4th Main, Vittal Nagar,<br />
            Kumaraswamy Layout, Bangalore South, Bangalore- 560078, Karnataka<br />
            Email: <Link href="mailto:info@marketincer.com" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>info@marketincer.com</Link>
          </Typography>
        </Box>

        {/* Last Updated */}
        <Box style={styles.lastUpdated}>
          <Typography variant="body2">
            Last Updated: March 12, 2025
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

export default PrivacyPolicy;