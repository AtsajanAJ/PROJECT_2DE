import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container,
  Paper,
  Fade,
  Grow,
  Slide,
  Alert,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  DirectionsRun as RunIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  Favorite as FavoriteIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Check if user was redirected from login/register
  const loginMessage = location.state?.message;

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Smart Recommendations',
      description: 'Get personalized restaurant suggestions based on your running needs, nutrition requirements, and food preferences like Ramen, Burger, or Noodles.',
      action: 'Get Started',
      path: '/recommendations',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      iconBg: 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)',
    },
    {
      icon: <SearchIcon sx={{ fontSize: 50, color: 'secondary.main' }} />,
      title: 'Advanced Search',
      description: 'Find restaurants by cuisine type (Ramen, Burger, Noodles), location, budget, and nutrition profile to match your training schedule.',
      action: 'Search Now',
      path: '/search',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      iconBg: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 50, color: '#10b981' }} />,
      title: 'Performance Tracking',
      description: 'Track your nutrition intake and see how it affects your running performance over time.',
      action: 'View Profile',
      path: '/profile',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      iconBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Runners', icon: <RunIcon /> },
    { number: '171+', label: 'Restaurants', icon: <RestaurantIcon /> },
    { number: '95%', label: 'Satisfaction', icon: <StarIcon /> },
    // { number: '24/7', label: 'AI Support', icon: <BoltIcon /> },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Welcome Message */}
      {loginMessage && (
        <Container maxWidth="lg" sx={{ mb: 3 }}>
          <Alert 
            severity="success" 
            sx={{ 
              borderRadius: '16px',
              '& .MuiAlert-icon': {
                fontSize: '24px',
              },
            }}
          >
            {loginMessage}
          </Alert>
        </Container>
      )}

      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          color: '#fff',
          mb: 6,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%), url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '32px',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', py: 10, position: 'relative', zIndex: 1 }}>
              <Typography
                component="h1"
                variant="h1"
                color="inherit"
                gutterBottom
                sx={{
                  fontWeight: 900,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  mb: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🏃‍♂️ {isAuthenticated ? `Welcome back, ${user?.username}!` : 'Find Your Perfect Running Fuel'}
              </Typography>
              <Typography 
                variant="h4" 
                color="inherit" 
                paragraph 
                sx={{ 
                  mb: 6, 
                  fontWeight: 400,
                  opacity: 0.95,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                Discover restaurants that match your running goals, nutrition needs, and food preferences.
                Get personalized recommendations for pre and post-run meals.
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/recommendations')}
                      startIcon={<RestaurantIcon />}
                      sx={{ 
                        px: 6, 
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                        color: '#6366f1',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Get Recommendations
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/search')}
                      startIcon={<SearchIcon />}
                      sx={{ 
                        px: 6, 
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '16px',
                        color: 'white', 
                        borderColor: 'white',
                        borderWidth: '3px',
                        '&:hover': {
                          borderWidth: '3px',
                          background: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Search Restaurants
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      startIcon={<LoginIcon />}
                      sx={{ 
                        px: 6, 
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                        color: '#6366f1',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Sign In to Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      startIcon={<RestaurantIcon />}
                      sx={{ 
                        px: 6, 
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '16px',
                        color: 'white', 
                        borderColor: 'white',
                        borderWidth: '3px',
                        '&:hover': {
                          borderWidth: '3px',
                          background: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Create Account
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Paper>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Slide direction="up" in timeout={800 + index * 200}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '24px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Slide>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          component="h2"
          variant="h2"
          align="center"
          gutterBottom
          sx={{ 
            mb: 8, 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Why Choose Runner's Restaurant Guide?
        </Typography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '28px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: feature.gradient,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '24px',
                        background: feature.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      gutterBottom 
                      variant="h4" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        color: 'text.primary',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.7,
                        fontSize: '1rem',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 4, px: 4 }}>
                    <Button
                      size="large"
                      onClick={() => navigate(feature.path)}
                      sx={{ 
                        px: 4,
                        py: 1.5,
                        borderRadius: '16px',
                        background: feature.gradient,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {feature.action}
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Fade in timeout={1500}>
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              borderRadius: '32px',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite',
              },
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
          >
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                mb: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Ready to Optimize Your Running Nutrition?
            </Typography>
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ 
                mb: 4,
                opacity: 0.95,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Join thousands of runners who have found their perfect pre and post-run meals.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/recommendations')}
              startIcon={<RunIcon />}
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                color: '#6366f1',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Start Your Journey
            </Button>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;
