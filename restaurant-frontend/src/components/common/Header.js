import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  DirectionsRun as RunIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Get Recommendations', path: '/recommendations', icon: <RunIcon /> },
    { text: 'Search Restaurants', path: '/search', icon: <SearchIcon /> },
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ];

  const authMenuItems = [
    { text: 'Login', path: '/login', icon: <LoginIcon /> },
    { text: 'Register', path: '/register', icon: <PersonAddIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      height: '100%',
      color: 'white'
    }}>
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Box sx={{ 
          width: 60, 
          height: 60, 
          mx: 'auto', 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          overflow: 'hidden',
          padding: '4px',
        }}>
          <img 
            src="/LogoRecommendation.png" 
            alt="Runner's Restaurant Guide Logo"
            style={{
              height: '52px',
              width: '52px',
              objectFit: 'cover',
              borderRadius: '50%',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
            }}
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Runner's Guide
        </Typography>
      </Box>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={isActive(item.path)}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: '16px',
              backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                transform: 'translateX(8px)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.25)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.8)',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{ 
                color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.9)',
                '& .MuiTypography-root': {
                  fontWeight: isActive(item.path) ? 600 : 500,
                }
              }}
            />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        
        {!isAuthenticated ? (
          authMenuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: '16px',
                backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(8px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.8)',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ 
                  color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.9)',
                  '& .MuiTypography-root': {
                    fontWeight: isActive(item.path) ? 600 : 500,
                  }
                }}
              />
            </ListItem>
          ))
        ) : (
          <>
            <ListItem
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 40 }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary={`Welcome, ${user?.username}`}
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                  }
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: '16px',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  transform: 'translateX(8px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  '& .MuiTypography-root': {
                    fontWeight: 500,
                  }
                }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexGrow: 1, 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => navigate('/')}
            >
              <Box sx={{ 
                mr: 2,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                padding: '4px',
              }}>
                <img 
                  src="/LogoRecommendation.png" 
                  alt="Runner's Restaurant Guide Logo"
                  style={{
                    height: '40px',
                    width: '40px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Runner's Restaurant Guide
                </Typography>
                <Chip 
                  label="Jena Reasoning Recommendations" 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="primary"
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    variant={isActive(item.path) ? "contained" : "text"}
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      ...(isActive(item.path) && {
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)',
                        },
                      }),
                      ...(!isActive(item.path) && {
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.08)',
                          transform: 'translateY(-1px)',
                        },
                      }),
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                
                {!isAuthenticated ? (
                  <>
                    <Button
                      color="primary"
                      startIcon={<LoginIcon />}
                      onClick={() => handleNavigation('/login')}
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        borderWidth: '2px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderWidth: '2px',
                          background: 'rgba(99, 102, 241, 0.08)',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      color="primary"
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleNavigation('/register')}
                      variant="contained"
                      sx={{
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                        boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(236, 72, 153, 0.4)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <>
                    <Chip
                      avatar={
                        <Avatar sx={{ 
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          width: 32,
                          height: 32,
                        }}>
                          {user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      label={`Welcome, ${user?.username}`}
                      variant="outlined"
                      sx={{
                        borderRadius: '20px',
                        borderColor: 'rgba(99, 102, 241, 0.3)',
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          color: 'primary.main',
                        },
                      }}
                    />
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            mt: 1,
            minWidth: 200,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleNavigation('/profile');
            handleUserMenuClose();
          }}
          sx={{
            borderRadius: '12px',
            mx: 1,
            my: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          }}
        >
          <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
          Profile
        </MenuItem>
        <Divider sx={{ mx: 1 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            mx: 1,
            my: 0.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
