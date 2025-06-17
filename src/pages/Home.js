import React from 'react';

const Home = () => {
  // CSS Styles as objects for inline styling
  const styles = {
    // Reset and Base Styles
    body: {
      fontFamily: "'Poppins', sans-serif",
      lineHeight: 1.6,
      color: '#ECF0F1',
      backgroundColor: '#121212',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    
    // Typography
    headingPrimary: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: '1.5rem',
      color: '#ECF0F1',
    },
    headingSecondary: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: '2rem',
      color: '#ECF0F1',
    },
    headingTertiary: {
      fontSize: '1.8rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
      color: '#ECF0F1',
    },
    subheading: {
      display: 'block',
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#3498DB',
      textTransform: 'uppercase',
      marginBottom: '0.75rem',
      letterSpacing: '1.5px',
    },
    
    // Header
    header: {
      backgroundColor: '#0A0A0A',
      padding: '1.25rem 0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    mainNav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#3498DB',
      textDecoration: 'none',
      letterSpacing: '-0.5px',
    },
    mainNavList: {
      display: 'flex',
      listStyle: 'none',
      alignItems: 'center',
      gap: '2rem',
    },
    mainNavLink: {
      textDecoration: 'none',
      color: '#BDC3C7',
      fontWeight: 500,
      fontSize: '0.95rem',
      transition: 'color 0.3s',
      padding: '0.5rem 0',
      position: 'relative',
    },
    navCta: {
      backgroundColor: '#3498DB',
      color: '#0A0A0A !important',
      padding: '0.75rem 1.5rem !important',
      borderRadius: '4px',
      transition: 'background-color 0.3s, transform 0.3s !important',
    },
    
    // Buttons
    btn: {
      display: 'inline-block',
      textDecoration: 'none',
      padding: '0.9rem 1.8rem',
      borderRadius: '4px',
      fontWeight: 600,
      fontSize: '0.95rem',
      transition: 'all 0.3s',
      letterSpacing: '0.5px',
    },
    btnFull: {
      backgroundColor: '#3498DB',
      color: '#0A0A0A',
      boxShadow: '0 4px 6px rgba(52, 152, 219, 0.3)',
    },
    btnOutline: {
      backgroundColor: 'transparent',
      border: '2px solid #3498DB',
      color: '#3498DB',
    },
    ctaButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
    },
    
    // Hero Section
    sectionHero: {
      backgroundColor: '#1E1E1E',
      padding: '6rem 0',
      borderBottom: '1px solid #2D3436',
    },
    hero: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      alignItems: 'center',
      textAlign: 'center',
    },
    heroDescription: {
      fontSize: '1.1rem',
      maxWidth: '700px',
      margin: '0 auto 2.5rem',
      color: '#BDC3C7',
      lineHeight: 1.8,
    },
    heroStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4rem',
      marginBottom: '2.5rem',
    },
    statNumber: {
      display: 'block',
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#3498DB',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#BDC3C7',
      fontWeight: 500,
    },
    
    // Features Section
    sectionFeatures: {
      padding: '6rem 0',
      backgroundColor: '#1E1E1E',
      textAlign: 'center',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2.5rem',
      marginTop: '3rem',
    },
    feature: {
      backgroundColor: '#121212',
      padding: '3rem 2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      textAlign: 'left',
    },
    featureIcon: {
      fontSize: '2rem',
      marginBottom: '1.5rem',
      color: '#3498DB',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    },
    featureTitle: {
      marginBottom: '1rem',
      color: '#ECF0F1',
      fontSize: '1.4rem',
    },
    featureDescription: {
      color: '#BDC3C7',
      lineHeight: 1.7,
    },
    
    // For Brands/Influencers Sections
    sectionForBrands: {
      padding: '7rem 0',
      backgroundColor: '#121212',
    },
    sectionForInfluencers: {
      padding: '7rem 0',
      backgroundColor: '#1E1E1E',
    },
    benefitsList: {
      listStyleType: 'none',
      marginBottom: '2.5rem',
    },
    benefitsItem: {
      marginBottom: '1rem',
      position: 'relative',
      paddingLeft: '2rem',
      fontSize: '1.05rem',
      color: '#ECF0F1',
    },
    
    // Resources Section
    sectionResources: {
      padding: '7rem 0',
      backgroundColor: '#1E1E1E',
      textAlign: 'center',
    },
    resourcesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2.5rem',
      marginTop: '3rem',
    },
    resource: {
      backgroundColor: '#121212',
      padding: '3rem 2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      textAlign: 'center',
    },
    resourceTitle: {
      fontSize: '1.5rem',
      color: '#ECF0F1',
      marginBottom: '1rem',
    },
    
    // CTA Section
    sectionCta: {
      backgroundColor: '#121212',
      padding: '6rem 0',
    },
    cta: {
      background: 'linear-gradient(135deg, #0A0A0A 0%, #1E1E1E 100%)',
      padding: '4rem',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
      color: '#ECF0F1',
      border: '1px solid #2D3436',
    },
    ctaText: {
      fontSize: '1.1rem',
      maxWidth: '700px',
      margin: '0 auto 2.5rem',
      opacity: 0.9,
    },
    
    // Footer
    footer: {
      backgroundColor: '#0A0A0A',
      color: '#ECF0F1',
      padding: '5rem 0 2rem',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr repeat(3, 1fr)',
      gap: '3rem',
      marginBottom: '4rem',
    },
    footerLogo: {
      color: '#3498DB',
      fontSize: '1.8rem',
      fontWeight: 700,
      textDecoration: 'none',
      display: 'inline-block',
      marginBottom: '1.5rem',
      letterSpacing: '-0.5px',
    },
    footerAbout: {
      color: '#BDC3C7',
      marginBottom: '1.5rem',
      lineHeight: 1.7,
    },
    footerHeading: {
      fontSize: '1.1rem',
      marginBottom: '1.5rem',
      color: '#ECF0F1',
      position: 'relative',
      paddingBottom: '0.5rem',
    },
    footerList: {
      listStyle: 'none',
    },
    footerListItem: {
      marginBottom: '0.75rem',
    },
    footerLink: {
      color: '#BDC3C7',
      textDecoration: 'none',
      transition: 'color 0.3s',
      fontSize: '0.95rem',
    },
    footerContact: {
      color: '#BDC3C7',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      fontSize: '0.95rem',
    },
    footerBottom: {
      textAlign: 'center',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      color: '#7F8C8D',
      fontSize: '0.9rem',
    }
  };

  // Benefits with fake checkmark
  const BenefitItem = ({ text }) => (
    <li style={styles.benefitsItem}>
      <span style={{ marginRight: '10px', color: '#1ABC9C' }}>✓</span>
      {text}
    </li>
  );

  return (
    <div style={styles.body}>
      {/* Header */}
    <header style={styles.header}>
      <div style={styles.container}>
        <nav style={styles.mainNav}>
          <a href="#" style={styles.logo}>Marketincer</a>
          <ul style={styles.mainNavList}>
            <li><a href="#features" style={styles.mainNavLink}>Features</a></li>
            <li><a href="#for-brands" style={styles.mainNavLink}>For Brands</a></li>
            <li><a href="#for-influencers" style={styles.mainNavLink}>For Influencers</a></li>
            <li><a href="#resources" style={styles.mainNavLink}>Resources</a></li>
            <li>
              <a 
                href="https://app.marketincer.com/login" 
                style={{...styles.mainNavLink, ...styles.navCta}}
              >
                Sign In
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section style={styles.sectionHero}>
          <div style={styles.container}>
            <div style={styles.hero}>
              <div>
                <h1 style={styles.headingPrimary}>
                  Connect. Collaborate. Create Impact.
                </h1>
                <p style={styles.heroDescription}>
                  Marketincer is the premier platform bridging brands, agencies, and influencers for seamless, authentic collaborations.
                </p>
                <div style={styles.heroStats}>
                  <div>
                    <span style={styles.statNumber}>10,000+</span>
                    <span style={styles.statLabel}>Verified Influencers</span>
                  </div>
                  <div>
                    <span style={styles.statNumber}>5,000+</span>
                    <span style={styles.statLabel}>Successful Campaigns</span>
                  </div>
                </div>
                <div style={{ ...styles.ctaButtons, marginLeft: "466px" }}>
                  <a 
                    href="https://app.marketincer.com/login" 
                    style={{...styles.btn, ...styles.btnFull}}
                  >
                    Start Connecting
                  </a>
                  <a 
                    href="#features" 
                    style={{...styles.btn, ...styles.btnOutline}}
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={styles.sectionFeatures}>
          <div style={styles.container}>
            <span style={styles.subheading}>Platform Features</span>
            <h2 style={styles.headingSecondary}>Why Choose Marketincer?</h2>
            
            <div style={styles.featuresGrid}>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>📞</div>
                <h3 style={styles.featureTitle}>Direct Communication</h3>
                <p style={styles.featureDescription}>
                  Instantly connect with influencers or brands through integrated calling and chat features.
                </p>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>✅</div>
                <h3 style={styles.featureTitle}>Verified Profiles</h3>
                <p style={styles.featureDescription}>
                  Comprehensive verification process ensures authenticity and builds trust in every connection.
                </p>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>🌈</div>
                <h3 style={styles.featureTitle}>Diverse Categories</h3>
                <p style={styles.featureDescription}>
                  Access influencers across multiple niches, from fashion and tech to lifestyle and wellness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Brands Section */}
        <section id="for-brands" style={styles.sectionForBrands}>
          <div style={styles.container}>
            <span style={styles.subheading}>For Brands & Agencies</span>
            <h2 style={styles.headingSecondary}>Find Your Perfect Influencer</h2>
            
            <div>
              <div>
                <h3 style={styles.headingTertiary}>Discover Powerful Partnerships</h3>
                <ul style={styles.benefitsList}>
                  <BenefitItem text="Advanced search and filter tools" />
                  <BenefitItem text="Detailed influencer analytics" />
                  <BenefitItem text="Campaign management dashboard" />
                  <BenefitItem text="Transparent performance tracking" />
                </ul>
                <a 
                  href="https://app.marketincer.com/login" 
                  style={{...styles.btn, ...styles.btnFull}}
                >
                  Start Your Campaign
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* For Influencers Section */}
        <section id="for-influencers" style={styles.sectionForInfluencers}>
          <div style={styles.container}>
            <span style={styles.subheading}>For Influencers</span>
            <h2 style={styles.headingSecondary}>Grow Your Professional Network</h2>
            
            <div>
              <div>
                <h3 style={styles.headingTertiary}>Unlock New Opportunities</h3>
                <ul style={styles.benefitsList}>
                  <BenefitItem text="Verified profile badge" />
                  <BenefitItem text="Direct brand collaborations" />
                  <BenefitItem text="Performance insights" />
                  <BenefitItem text="Community networking" />
                </ul>
                <a 
                  href="https://app.marketincer.com/login" 
                  style={{...styles.btn, ...styles.btnFull}}
                >
                  Join Marketincer
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" style={styles.sectionResources}>
          <div style={styles.container}>
            <span style={styles.subheading}>Resources</span>
            <h2 style={styles.headingSecondary}>Learn and Grow</h2>
            
            <div style={styles.resourcesGrid}>
              <div style={styles.resource}>
                <h3 style={styles.resourceTitle}>Blog</h3>
                <p style={{ marginBottom: '20px', color: '#BDC3C7' }}>
                  Industry insights, collaboration tips, and platform updates.
                </p>
                <a 
                  href="#" 
                  style={{...styles.btn, ...styles.btnOutline}}
                >
                  Read Articles
                </a>
              </div>
              <div style={styles.resource}>
                <h3 style={styles.resourceTitle}>Help Center</h3>
                <p style={{ marginBottom: '20px', color: '#BDC3C7' }}>
                  Comprehensive guides and support for seamless platform usage.
                </p>
                <a 
                  href="#" 
                  style={{...styles.btn, ...styles.btnOutline}}
                >
                  Get Support
                </a>
              </div>
              <div style={styles.resource}>
                <h3 style={styles.resourceTitle}>Webinars</h3>
                <p style={{ marginBottom: '20px', color: '#BDC3C7' }}>
                  Live sessions and tutorials to maximize your platform potential.
                </p>
                <a 
                  href="#" 
                  style={{...styles.btn, ...styles.btnOutline}}
                >
                  Explore Webinars
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.sectionCta}>
          <div style={styles.container}>
            <div style={styles.cta}>
              <h2 style={styles.headingSecondary}>Ready to Transform Your Influencer Marketing?</h2>
              <p style={styles.ctaText}>
                Join thousands of brands and influencers who are creating impactful collaborations today.
              </p>
              <a 
                href="https://app.marketincer.com/login" 
                style={{...styles.btn, ...styles.btnFull, padding: '1.1rem 2.2rem', fontSize: '1.1rem'}}
              >
                Create Free Account
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <a href="#" style={styles.footerLogo}>Marketincer</a>
              <p style={styles.footerAbout}>
                Bridging brands and influencers through technology and trust.
              </p>
            </div>
            <div>
              <h4 style={styles.footerHeading}>Quick Links</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink}>About Us</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink}>Careers</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="contact" style={styles.footerLink}>Contact Us</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerHeading}>Legal</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <a href="terms-and-conditions" style={styles.footerLink}>Terms of Service</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="privacy-policy" style={styles.footerLink}>Privacy Policy</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="data-deletion" style={styles.footerLink}>Data Deletion Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerHeading}>Get in Touch</h4>
              <p style={styles.footerContact}>info@marketincer.com</p>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p>&copy; 2025 Marketincer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;