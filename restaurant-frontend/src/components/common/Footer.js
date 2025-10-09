import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  Divider,
  Link,
  Stack,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
    { icon: <GitHubIcon />, href: '#', label: 'GitHub' },
  ];

  const quickLinks = [
    { text: 'About Us', href: '#' },
    { text: 'How It Works', href: '#' },
    { text: 'Privacy Policy', href: '#' },
    { text: 'Terms of Service', href: '#' },
    { text: 'Contact Support', href: '#' },
  ];

  const contactInfo = [
    { icon: <EmailIcon />, text: 'atsajan811@gmail.com', href: 'mailto:atsajan811@gmail.com' },
    { icon: <PhoneIcon />, text: '+66 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: <LocationIcon />, text: 'Puhket, Thailand', href: '#' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.5) 50%, transparent 100%)',
        },
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '24px',
                  }}
                >
                  🏃‍♂️
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Runner's Guide
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, mb: 3 }}>
                Your AI-powered companion for finding the perfect pre and post-run meals.
                Discover restaurants that match your running goals and nutrition needs.
              </Typography>

              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        color: 'white',
                        background: 'rgba(99, 102, 241, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'white' }}>
              Quick Links
            </Typography>
            <Stack spacing={2}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'white',
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'white' }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              {contactInfo.map((contact, index) => (
                <Link
                  key={index}
                  href={contact.href}
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'white',
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6366f1',
                    }}
                  >
                    {contact.icon}
                  </Box>
                  {contact.text}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Divider */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Bottom Footer */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © {currentYear} Runner's Restaurant Guide. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Made with ❤️ for runners
            </Typography>
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
              }}
            >
              🏃‍♂️
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
