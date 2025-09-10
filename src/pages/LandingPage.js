import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";

export const LandingPage = () => {
  // Data for "Why Choose Marketincer?" section
  const marketincerFeatures = [
    {
      title: "Direct Communication",
      description:
        "Instantly connect with influencers or brands through integrated calling and chat features.",
      icon: "https://c.animaapp.com/mawdit5zxHITvK/img/chat.svg",
    },
    {
      title: "Verified Profiles",
      description:
        "Comprehensive verification process ensures authenticity and builds trust in every connection.",
      icon: "https://c.animaapp.com/mawdit5zxHITvK/img/group-1.png",
    },
    {
      title: "Diverse Categories",
      description:
        "Access influencers across multiple niches, from fashion and tech to lifestyle and wellness.",
      icon: "https://c.animaapp.com/mawdit5zxHITvK/img/globe.png",
    },
  ];

  // Data for footer links
  const footerLinks = {
    explore: ["About Us", "Careers", "Contact", "Blog", "Webinars"],
    legal: ["Terms of Service", "Privacy Policy", "Data Deletion Policy"],
  };

  return (
    <Box
      sx={{
        bgcolor: "#160a4d",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "#160a4d",
          overflow: "hidden",
          width: "1440px",
          position: "relative",
        }}
      >
        {/* Hero Section */}
        <Box sx={{ position: "relative", height: "1340px" }}>
          <Box
            sx={{
              position: "absolute",
              width: "480px",
              height: "481px",
              top: 0,
              left: 0,
              bgcolor: "#392cd5",
              borderRadius: "240px/240.5px",
              transform: "rotate(180deg)",
              filter: "blur(100px)",
              opacity: 0.8,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: "480px",
              height: "481px",
              top: "278px",
              left: "1124px",
              bgcolor: "#a229b9b2",
              borderRadius: "240px/240.5px",
              filter: "blur(100px)",
              opacity: 0.8,
            }}
          />

          <Box
            component="img"
            src="https://c.animaapp.com/mawdit5zxHITvK/img/ellipse-3.svg"
            alt="Ellipse"
            sx={{
              position: "absolute",
              width: "465px",
              height: "956px",
              top: "336px",
              left: "103px",
            }}
          />

          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: "99px",
              left: "297px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: "bold",
              color: "white",
              fontSize: "22px",
              lineHeight: "33px",
            }}
          >
            Marketincer
          </Typography>

          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: "111px",
              left: "831px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: "normal",
              color: "white",
              fontSize: "14px",
              lineHeight: "21px",
              whiteSpace: "nowrap",
            }}
          >
            FEATURES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SOLUTIONS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RESOURCES
          </Typography>

          <Button
            sx={{
              position: "absolute",
              top: "105px",
              left: "1227px",
              bgcolor: "#2d58b9",
              borderRadius: "20px",
              boxShadow: "2px 2px 4px #dddddd85",
              padding: "2.5px",
              width: "125px",
              height: "35px",
              "&:hover": { bgcolor: "#1e3c7a" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: "bold",
                color: "white",
                fontSize: "20px",
                letterSpacing: "2px",
                lineHeight: "30px",
              }}
            >
              Login
            </Typography>
          </Button>

          <Typography
            variant="h2"
            sx={{
              position: "absolute",
              width: "835px",
              top: "222px",
              left: "406px",
              textShadow: "4px 4px 4px #433e4340",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: 800,
              color: "white",
              fontSize: "48px",
              lineHeight: "72px",
            }}
          >
            Connect. Collaborate. Create Impact
          </Typography>

          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              width: "491px",
              top: "308px",
              left: "578px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: 600,
              color: "white",
              fontSize: "28px",
              textAlign: "center",
              lineHeight: "42px",
            }}
          >
            Helping Brands find Influencers they can trust-instantly
          </Typography>

          <Stack
            direction="row"
            spacing={10}
            sx={{
              position: "absolute",
              top: "482px",
              left: "609px",
              textAlign: "center",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "22px",
                  lineHeight: "33px",
                }}
              >
                10,000+
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "20px",
                  lineHeight: "30px",
                }}
              >
                Verified Influencers
              </Typography>
            </Box>

            <Box sx={{ ml: 5 }}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "22px",
                  lineHeight: "33px",
                }}
              >
                5,000+
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "20px",
                  lineHeight: "30px",
                }}
              >
                Successful campaigns
              </Typography>
            </Box>
          </Stack>

          <Button
            sx={{
              position: "absolute",
              top: "610px",
              left: "522px",
              bgcolor: "#2d58b9",
              borderRadius: "20px",
              boxShadow: "2px 2px 4px #dddddd85",
              padding: "2.5px",
              width: "276px",
              "&:hover": { bgcolor: "#1e3c7a" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: "bold",
                color: "white",
                fontSize: "22px",
                letterSpacing: "2.2px",
                lineHeight: "33px",
              }}
            >
              Start Connecting
            </Typography>
          </Button>

          <Box
            component="img"
            src="https://c.animaapp.com/mawdit5zxHITvK/img/component-2.svg"
            alt="Component"
            sx={{
              position: "absolute",
              width: "292px",
              height: "69px",
              top: "604px",
              left: "842px",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: "978px",
              left: "606px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: "bold",
              color: "white",
              fontSize: "36px",
              lineHeight: "54px",
              whiteSpace: "nowrap",
            }}
          >
            Why Choose Marketincer?
          </Typography>

          <Grid
            container
            spacing={4}
            sx={{
              position: "absolute",
              top: "1050px",
              left: "250px",
              width: "900px",
            }}
          >
            {marketincerFeatures.map((feature, index) => (
              <Grid item xs={4} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={feature.icon}
                    alt={feature.title}
                    sx={{
                      width: index === 1 ? "42px" : "40px",
                      height: index === 1 ? "42px" : "40px",
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Outfit', Helvetica",
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "25px",
                      textAlign: "center",
                      mt: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Outfit', Helvetica",
                      fontWeight: 500,
                      color: "white",
                      fontSize: "22px",
                      textAlign: "center",
                      lineHeight: "33px",
                      mt: 4,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* For Brands and Agencies Section */}
        <Box sx={{ position: "relative", height: "570px", mt: 20 }}>
          <Box
            sx={{
              position: "absolute",
              width: "480px",
              height: "481px",
              top: "45px",
              left: "46px",
              borderRadius: "240px/240.5px",
              transform: "rotate(102.12deg)",
              filter: "blur(100px)",
              background:
                "linear-gradient(180deg, rgba(17,238,170,0.54) 0%, rgba(109,40,217,1) 100%)",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: "107px",
              left: "423px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: "bold",
              color: "#407bff",
              fontSize: "30px",
              lineHeight: "45px",
            }}
          >
            For Brands and Agencies
          </Typography>

          <Box
            sx={{
              position: "absolute",
              top: "177px",
              left: "423px",
              width: "348px",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: 600,
                color: "white",
                fontSize: "25px",
                lineHeight: "37.5px",
              }}
            >
              Find your perfect Influencer
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "22px",
                  lineHeight: "33px",
                }}
              >
                Discover Powerful Partnerships
              </Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: "normal",
                  color: "white",
                  fontSize: "20px",
                  lineHeight: "30px",
                }}
              >
                Advanced search and filter tools
                <br />
                Detailed influencer analytics
                <br />
                Campaign management dashboard
                <br />
                Transparent performance tracking
              </Typography>
            </Box>
          </Box>

          <Button
            sx={{
              position: "absolute",
              top: "476px",
              left: "429px",
              bgcolor: "#2d58b9",
              borderRadius: "20px",
              boxShadow: "2px 2px 4px #dddddd85",
              padding: "2.5px",
              width: "271px",
              "&:hover": { bgcolor: "#1e3c7a" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: "bold",
                color: "white",
                fontSize: "22px",
                letterSpacing: "2.2px",
                lineHeight: "33px",
              }}
            >
              Start Your Campaign
            </Typography>
          </Button>
        </Box>

        {/* For Influencers Section */}
        <Box sx={{ position: "relative", height: "1075px", mt: 10 }}>
          <Box
            sx={{
              position: "absolute",
              width: "480px",
              height: "481px",
              top: "2394px",
              left: "941px",
              borderRadius: "240px/240.5px",
              transform: "rotate(-107.52deg)",
              filter: "blur(100px)",
              background:
                "linear-gradient(180deg, rgba(17,238,170,0.54) 0%, rgba(109,40,217,1) 100%)",
              opacity: 0.7,
            }}
          />

          <Box
            component="img"
            src="https://c.animaapp.com/mawdit5zxHITvK/img/ellipse-6.svg"
            alt="Ellipse"
            sx={{
              position: "absolute",
              width: "592px",
              height: "956px",
              top: "119px",
              left: 0,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: "2183px",
              left: "185px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: "bold",
              color: "#407bff",
              fontSize: "30px",
              lineHeight: "45px",
            }}
          >
            For Influencers
          </Typography>

          <Box sx={{ position: "absolute", top: 0, left: "185px" }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: 600,
                color: "white",
                fontSize: "25px",
                lineHeight: "37.5px",
              }}
            >
              Grow Your Personal Network
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "22px",
                  lineHeight: "33px",
                }}
              >
                Unlock New Opportunities
              </Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: "normal",
                  color: "white",
                  fontSize: "20px",
                  lineHeight: "30px",
                }}
              >
                Verified profile badge
                <br />
                Direct brand collaborations
                <br />
                Performance insights
                <br />
                Community networking
              </Typography>
            </Box>
          </Box>

          <Button
            sx={{
              position: "absolute",
              top: "320px",
              left: "185px",
              bgcolor: "#2d58b9",
              borderRadius: "20px",
              boxShadow: "2px 2px 4px #dddddd85",
              padding: "2.5px",
              width: "129px",
              "&:hover": { bgcolor: "#1e3c7a" },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: "bold",
                color: "white",
                fontSize: "22px",
                letterSpacing: "2.2px",
                lineHeight: "33px",
              }}
            >
              Join Now
            </Typography>
          </Button>
        </Box>

        {/* Resources Section */}
        <Box sx={{ position: "relative", mt: 20 }}>
          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: "3450px",
              left: "636px",
              fontFamily: "'Outfit', Helvetica",
              fontWeight: "bold",
              color: "white",
              fontSize: "36px",
              lineHeight: "54px",
            }}
          >
            Resources
          </Typography>

          <Grid container spacing={4} sx={{ mt: 10, px: 10 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "30px",
                    lineHeight: "45px",
                  }}
                >
                  Blogs
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "normal",
                    color: "white",
                    fontSize: "25px",
                    lineHeight: "37.5px",
                    mt: 4,
                  }}
                >
                  Stay ahead with smart tips, creator trends, and platform news.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "30px",
                    lineHeight: "45px",
                  }}
                >
                  Webinars
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "normal",
                    color: "white",
                    fontSize: "25px",
                    lineHeight: "37.5px",
                    mt: 4,
                  }}
                >
                  Watch live sessions and tutorials to grow your influence.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "30px",
                    lineHeight: "45px",
                  }}
                >
                  Help Center
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "normal",
                    color: "white",
                    fontSize: "25px",
                    lineHeight: "37.5px",
                    mt: 4,
                  }}
                >
                  Need a hand? Find quick guides and answers here.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Box sx={{ position: "relative", mt: 20, height: "631px" }}>
          <Box
            sx={{
              position: "absolute",
              width: "480px",
              height: "481px",
              top: "75px",
              left: "76px",
              borderRadius: "240px/240.5px",
              transform: "rotate(66.79deg)",
              filter: "blur(100px)",
              background:
                "linear-gradient(180deg, rgba(17,238,170,0.54) 0%, rgba(109,40,217,1) 100%)",
              opacity: 0.8,
            }}
          />

          <Box
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              pt: 10,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: "bold",
                color: "white",
                fontSize: "35px",
                lineHeight: "52.5px",
              }}
            >
              Start Collaborating with Top Brands Today
            </Typography>

            <Typography
              sx={{
                fontFamily: "'Outfit', Helvetica",
                fontWeight: 500,
                color: "white",
                fontSize: "25px",
                lineHeight: "37.5px",
                maxWidth: "724px",
                mx: "auto",
                mt: 4,
                textAlign: "center",
              }}
            >
              Join thousands of brands and influencers who are creating
              impactful collaborations today.
              <br />
              <br />
              Over 10,000 influencers onboarded!
            </Typography>

            <Button
              sx={{
                bgcolor: "#2d58b9",
                borderRadius: "20px",
                boxShadow: "2px 2px 4px #dddddd85",
                padding: "2.5px",
                width: "129px",
                mt: 8,
                "&:hover": { bgcolor: "#1e3c7a" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: "bold",
                  color: "white",
                  fontSize: "22px",
                  letterSpacing: "2.2px",
                  lineHeight: "33px",
                }}
              >
                Join Now
              </Typography>
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ position: "relative", mt: 10, pb: 10 }}>
          <Box
            sx={{
              position: "absolute",
              width: "480px",
              height: "481px",
              top: "120px",
              left: "99px",
              borderRadius: "240px/240.5px",
              transform: "rotate(-47.57deg)",
              filter: "blur(100px)",
              background:
                "linear-gradient(180deg, rgba(17,238,170,0.54) 0%, rgba(109,40,217,1) 100%)",
              opacity: 0.5,
            }}
          />

          <Grid container spacing={4} sx={{ px: 10 }}>
            <Grid item xs={12} md={3}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: "bold",
                  color: "#407bff",
                  fontSize: "25px",
                  lineHeight: "37.5px",
                }}
              >
                Marketincer
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 500,
                  color: "white",
                  fontSize: "22px",
                  lineHeight: "33px",
                  mt: 2,
                }}
              >
                Helping brands and influencers connect, grow, and win together.
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: "normal",
                  color: "white",
                  fontSize: "22px",
                  lineHeight: "33px",
                  mt: 8,
                }}
              >
                Stay updated with the latest influencer trends — Subscribe to
                our newsletter!
              </Typography>

              <Button
                sx={{
                  bgcolor: "#2d58b9",
                  borderRadius: "20px",
                  boxShadow: "2px 2px 4px #dddddd85",
                  padding: "2.5px",
                  width: "196px",
                  mt: 3,
                  "&:hover": { bgcolor: "#1e3c7a" },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Outfit', Helvetica",
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "22px",
                    letterSpacing: "2.2px",
                    lineHeight: "33px",
                  }}
                >
                  Subscribe Now
                </Typography>
              </Button>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 600,
                  color: "white",
                  fontSize: "25px",
                  lineHeight: "37.5px",
                }}
              >
                Explore
              </Typography>

              <Stack spacing={1} sx={{ mt: 4 }}>
                {footerLinks.explore.map((link, index) => (
                  <Typography
                    key={index}
                    sx={{
                      fontFamily: "'Outfit', Helvetica",
                      fontWeight: "normal",
                      color: "#b7b1b1",
                      fontSize: "22px",
                      lineHeight: "33px",
                      cursor: "pointer",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 600,
                  color: "white",
                  fontSize: "25px",
                  lineHeight: "37.5px",
                }}
              >
                Legal
              </Typography>

              <Stack spacing={1} sx={{ mt: 4 }}>
                {footerLinks.legal.map((link, index) => (
                  <Typography
                    key={index}
                    sx={{
                      fontFamily: "'Outfit', Helvetica",
                      fontWeight: "normal",
                      color: "#b7b1b1",
                      fontSize: "22px",
                      lineHeight: "33px",
                      cursor: "pointer",
                      "&:hover": { color: "white" },
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: 600,
                  color: "white",
                  fontSize: "25px",
                  lineHeight: "37.5px",
                }}
              >
                Get in Touch
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Outfit', Helvetica",
                  fontWeight: "normal",
                  color: "#b7b1b1",
                  fontSize: "22px",
                  lineHeight: "33px",
                  mt: 4,
                }}
              >
                info@marketincer.com
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};


export default LandingPage