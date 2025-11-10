import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Grid,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Rating,
  Badge,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Restaurant as RestaurantIcon,
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  FitnessCenter as FitnessIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Notes as NotesIcon,
  DirectionsRun as RunIcon,
  LocalDining as CuisineIcon,
  RestaurantMenu as RestaurantTypeIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import userDataService from '../services/UserDataService';
import AddNutritionEntryDialog from '../components/profile/AddNutritionEntryDialog';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use userId from route params, or fallback to current logged-in user
  const profileUserId = userId || user?.username;
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [nutritionDialogOpen, setNutritionDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [showPassword, setShowPassword] = useState(false);

  // User profile state
  const [userProfile, setUserProfile] = useState({
    username: user?.username || 'admin',
    email: user?.email || 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+66 123 456 789',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    bio: 'Passionate runner and food enthusiast. Love exploring new restaurants and trying different cuisines.',
    location: 'Phuket, Thailand',
    // Recommendation preferences
    runnerType: '',
    maxBudget: '',
    preferredCuisines: [],
    preferredRestaurantTypes: [],
    preRunNutrition: {
      carbLevel: '',
      fatLevel: '',
      proteinLevel: '',
    },
    postRunNutrition: {
      carbLevel: '',
      fatLevel: '',
      proteinLevel: '',
    },
    dietaryPreferences: ['Vegetarian', 'Gluten-Free'],
    notifications: {
      email: true,
      push: true,
      recommendations: true,
      promotions: false,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    }
  });

  // Real data for saved restaurants
  const [savedRestaurants, setSavedRestaurants] = useState([]);

  // Real data for nutrition history
  const [nutritionHistory, setNutritionHistory] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (profileUserId) {
      loadUserData();
    }
  }, [profileUserId]);

  const loadUserData = () => {
    if (!profileUserId) return;
    
    const saved = userDataService.getSavedRestaurants(profileUserId);
    const nutrition = userDataService.getNutritionHistory(profileUserId);
    const profile = userDataService.getUserProfile(profileUserId);
    
    if (profile) {
      setUserProfile(profile);
    } else if (user?.username === profileUserId) {
      // Initialize profile with user data if viewing own profile
      setUserProfile(prev => ({
        ...prev,
        username: user?.username || 'admin',
        email: user?.email || 'admin@example.com',
      }));
    }
    
    setSavedRestaurants(saved);
    setNutritionHistory(nutrition);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    if (!profileUserId) {
      setSnackbarMessage('User ID is required to save profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    const success = userDataService.saveUserProfile(userProfile, profileUserId);
    if (success) {
      setEditMode(false);
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('Failed to save profile. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleRemoveRestaurant = (restaurantId) => {
    if (!profileUserId) return;
    
    const success = userDataService.removeRestaurant(restaurantId, profileUserId);
    if (success) {
      loadUserData(); // Reload data
      setSnackbarMessage('Restaurant removed from saved list');
      setSnackbarSeverity('info');
    } else {
      setSnackbarMessage('Failed to remove restaurant. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleRemoveNutritionEntry = (entryId) => {
    if (!profileUserId) return;
    
    const success = userDataService.removeNutritionEntry(entryId, profileUserId);
    if (success) {
      loadUserData(); // Reload data
      setSnackbarMessage('Nutrition entry removed');
      setSnackbarSeverity('info');
    } else {
      setSnackbarMessage('Failed to remove nutrition entry. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleExportData = () => {
    if (!profileUserId) {
      setSnackbarMessage('User ID is required to export data.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    const success = userDataService.exportData(profileUserId);
    if (success) {
      setSnackbarMessage('Data exported successfully!');
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('Failed to export data. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleAddNutritionEntry = () => {
    setNutritionDialogOpen(true);
  };

  const handleNutritionEntrySaved = (entry) => {
    if (!profileUserId) return;
    
    // Save the entry with userId
    const success = userDataService.addNutritionEntry(entry, profileUserId);
    if (success) {
      loadUserData(); // Reload data
      setSnackbarMessage('Nutrition entry added successfully!');
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('Failed to add nutrition entry. Please try again.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3,
      }
    }}>
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Modern Header */}
        <Box sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          p: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            <PersonIcon sx={{ 
              fontSize: { xs: 40, md: 56 }, 
              mr: 2, 
              verticalAlign: 'middle',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }} />
            User Profile
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              mb: 4,
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            Manage your profile, preferences, and dining history
      </Typography>
        </Box>

        {/* Profile Content */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          p: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
          {/* Profile Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                mr: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '2rem'
              }}
            >
              {userProfile.firstName[0]}{userProfile.lastName[0]}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {userProfile.firstName} {userProfile.lastName}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                @{userProfile.username}
        </Typography>
        <Typography variant="body1" color="text.secondary">
                {userProfile.bio}
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Edit Profile">
                <IconButton 
                  onClick={handleEdit}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Navigation Tabs */}
          <Paper sx={{ 
            mb: 4, 
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 2.5,
                  px: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.1)',
                  }
                },
                '& .Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white !important',
                  borderRadius: '12px',
                  margin: '8px',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab 
                icon={<PersonIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Personal Info" 
                iconPosition="start"
              />
              <Tab 
                icon={<RestaurantIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Saved Restaurants" 
                iconPosition="start"
              />
              <Tab 
                icon={<HistoryIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Nutrition History" 
                iconPosition="start"
              />
              <Tab 
                icon={<SettingsIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Settings" 
                iconPosition="start"
              />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              {/* Personal Information Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 4, 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ fontSize: 28, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Personal Information
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, ml: 6 }}>
                  Manage your personal details and profile information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      First Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={userProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Last Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={userProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Email
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Phone
                    </Typography>
                    <TextField
                      fullWidth
                      value={userProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Date of Birth
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      value={userProfile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!editMode}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Gender
                    </Typography>
                    <FormControl 
                      fullWidth 
                      disabled={!editMode}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    >
                      <Select
                        value={userProfile.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        startAdornment={
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <GenderIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500, mt: 1 }}>
                      Bio
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Tell us about yourself..."
                      multiline
                      rows={4}
                      value={userProfile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <NotesIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., Phuket, Thailand"
                      value={userProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Recommendation Preferences Section */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  mb: 4, 
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(168, 85, 247, 0.03) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <RunIcon sx={{ fontSize: 28, mr: 2, color: 'secondary.main' }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Recommendation Preferences
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Fill in these preferences to get personalized restaurant recommendations
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Runner Type
                    </Typography>
                    <FormControl 
                      fullWidth 
                      disabled={!editMode}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    >
                      <Select
                        value={userProfile.runnerType || ''}
                        onChange={(e) => handleInputChange('runnerType', e.target.value)}
                        startAdornment={
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <RunIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="Fun Run">Fun Run</MenuItem>
                        <MenuItem value="Mini Marathon">Mini Marathon</MenuItem>
                        <MenuItem value="Half Marathon">Half Marathon</MenuItem>
                        <MenuItem value="Marathon">Marathon</MenuItem>
                        <MenuItem value="Ultra Marathon">Ultra Marathon</MenuItem>
                        <MenuItem value="Trail Run">Trail Run</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Max Budget
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., 500"
                      type="number"
                      value={userProfile.maxBudget || ''}
                      onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                              ฿
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500, mt: 1 }}>
                      Cuisine Types
                    </Typography>
                    <FormControl 
                      fullWidth 
                      disabled={!editMode}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    >
                      <Select
                        multiple
                        value={userProfile.preferredCuisines || []}
                        onChange={(e) => handleInputChange('preferredCuisines', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small"
                                sx={{
                                  borderRadius: '16px',
                                  backgroundColor: '#8b5cf6',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        startAdornment={
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <CuisineIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        }
                      >
                        {['GrilledPork', 'Noodles', 'Burger', 'Steak', 'BubbleMilkTea', 'Breakfast', 'Shabu Sukiyaki', 'Sushi', 'ALaCarte', 'FastFood', 'Vegetarian Jay', 'Buffet', 'Omakase', 'Pizza', 'Seafood', 'Grill', 'IceCream', 'VegetarianFood', 'DrinksJuice', 'OneDishMeal', 'Dimsum', 'Dessert', 'Ramen', 'CleanFood Salad', 'Bakery Cake'].map((cuisine) => (
                          <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500, mt: 1 }}>
                      Restaurant Types
                    </Typography>
                    <FormControl 
                      fullWidth 
                      disabled={!editMode}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                          },
                          '&.Mui-disabled': {
                            backgroundColor: '#f9fafb',
                          },
                        },
                      }}
                    >
                      <Select
                        multiple
                        value={userProfile.preferredRestaurantTypes || []}
                        onChange={(e) => handleInputChange('preferredRestaurantTypes', e.target.value)}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip 
                                key={value} 
                                label={value} 
                                size="small"
                                sx={{
                                  borderRadius: '16px',
                                  backgroundColor: '#8b5cf6',
                                  color: 'white',
                                  fontWeight: 500,
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        startAdornment={
                          <InputAdornment position="start" sx={{ mr: 1 }}>
                            <RestaurantTypeIcon sx={{ color: 'action.active', fontSize: 20 }} />
                          </InputAdornment>
                        }
                      >
                        {['Fast Dining', 'Casual Dining', 'Fine Dining', 'Buffet', 'Street Food', 'Cafe', 'Food Court', 'Food Truck', 'Family Restaurant', 'Bistro', 'Pub', 'Diner', 'Kiosk'].map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  {/* Pre-Run Nutrition */}
                  <Box sx={{ 
                    mt: 3, 
                    mb: 2, 
                    p: 2, 
                    borderRadius: '12px',
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FitnessIcon sx={{ fontSize: 22, mr: 1.5, color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Pre-Run Nutrition
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Your nutritional preferences before running
                    </Typography>
                  </Box>
                  
                  {['carbLevel', 'fatLevel', 'proteinLevel'].map((nutrient) => (
                    <Box key={nutrient} sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                        {nutrient.charAt(0).toUpperCase() + nutrient.slice(1).replace('Level', '')}
                      </Typography>
                      <FormControl 
                        fullWidth 
                        disabled={!editMode}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#f9fafb',
                            },
                          },
                        }}
                      >
                        <Select
                          value={userProfile.preRunNutrition?.[nutrient] || ''}
                          onChange={(e) => handleNestedInputChange('preRunNutrition', nutrient, e.target.value)}
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ))}

                  {/* Post-Run Nutrition */}
                  <Box sx={{ 
                    mt: 3, 
                    mb: 2, 
                    p: 2, 
                    borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.05)',
                    border: '1px solid rgba(139, 92, 246, 0.1)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <FitnessIcon sx={{ fontSize: 22, mr: 1.5, color: 'secondary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Post-Run Nutrition
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Your nutritional preferences after running
                    </Typography>
                  </Box>
                  
                  {['carbLevel', 'fatLevel', 'proteinLevel'].map((nutrient) => (
                    <Box key={nutrient} sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                        {nutrient.charAt(0).toUpperCase() + nutrient.slice(1).replace('Level', '')}
        </Typography>
                      <FormControl 
                        fullWidth 
                        disabled={!editMode}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: editMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: editMode ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: '#f9fafb',
                            },
                          },
                        }}
                      >
                        <Select
                          value={userProfile.postRunNutrition?.[nutrient] || ''}
                          onChange={(e) => handleNestedInputChange('postRunNutrition', nutrient, e.target.value)}
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </Box>
      </Paper>
              
              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 4, 
                justifyContent: 'flex-end',
                pt: 3,
                borderTop: '2px solid rgba(102, 126, 234, 0.1)',
              }}>
                {!editMode ? (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ 
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ 
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderWidth: '2px',
                        borderColor: 'text.secondary',
                        color: 'text.secondary',
                        '&:hover': {
                          borderWidth: '2px',
                          borderColor: 'text.primary',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      sx={{ 
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Saved Restaurants ({savedRestaurants.length})
              </Typography>
              <Grid container spacing={3}>
                {savedRestaurants.map((restaurant) => (
                  <Grid item xs={12} md={6} lg={4} key={restaurant.id}>
                    <Card sx={{ 
                      height: '100%',
                      borderRadius: '16px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <RestaurantIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {restaurant.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {restaurant.cuisine} • {restaurant.location}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={restaurant.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {restaurant.rating}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <MoneyIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                          <Typography variant="body2">
                            ฿{restaurant.price}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Saved on: {restaurant.savedDate}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          "{restaurant.notes}"
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" startIcon={<VisibilityIcon />}>
                          View Details
                        </Button>
                        <Button 
                          size="small" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveRestaurant(restaurant.id)}
                        >
                          Remove
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Nutrition History ({nutritionHistory.length} entries)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddNutritionEntry}
                  sx={{ 
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  Add Entry
                </Button>
              </Box>
              <List>
                {nutritionHistory.map((entry) => (
                  <ListItem 
                    key={entry.id}
                    sx={{ 
                      borderRadius: '12px',
                      mb: 2,
                      background: 'rgba(102, 126, 234, 0.05)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <FitnessIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="h6">{entry.restaurant}</Typography>
                          <Chip label={entry.meal} size="small" color="primary" />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {entry.date} • {entry.calories} calories
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip label={`Carbs: ${entry.carbs}`} size="small" variant="outlined" />
                            <Chip label={`Protein: ${entry.protein}`} size="small" variant="outlined" />
                            <Chip label={`Fat: ${entry.fat}`} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {entry.notes}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => handleRemoveNutritionEntry(entry.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Account Settings
              </Typography>
              
              {/* Notifications */}
              <Card sx={{ mb: 3, borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Notifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.notifications.email}
                          onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.notifications.push}
                          onChange={(e) => handleNestedInputChange('notifications', 'push', e.target.checked)}
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.notifications.recommendations}
                          onChange={(e) => handleNestedInputChange('notifications', 'recommendations', e.target.checked)}
                        />
                      }
                      label="Recommendation Updates"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.notifications.promotions}
                          onChange={(e) => handleNestedInputChange('notifications', 'promotions', e.target.checked)}
                        />
                      }
                      label="Promotional Offers"
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card sx={{ mb: 3, borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Privacy Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.privacy.profileVisible}
                          onChange={(e) => handleNestedInputChange('privacy', 'profileVisible', e.target.checked)}
                        />
                      }
                      label="Make Profile Visible to Others"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.privacy.showEmail}
                          onChange={(e) => handleNestedInputChange('privacy', 'showEmail', e.target.checked)}
                        />
                      }
                      label="Show Email Address"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={userProfile.privacy.showPhone}
                          onChange={(e) => handleNestedInputChange('privacy', 'showPhone', e.target.checked)}
                        />
                      }
                      label="Show Phone Number"
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card sx={{ borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Account Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ borderRadius: '8px' }}
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      sx={{ borderRadius: '8px' }}
                      onClick={handleExportData}
                    >
                      Export Data
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: '8px' }}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Add Nutrition Entry Dialog */}
        <AddNutritionEntryDialog
          open={nutritionDialogOpen}
          onClose={() => setNutritionDialogOpen(false)}
          onSave={handleNutritionEntrySaved}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            sx={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </Container>
    </Box>
  );
};

export default UserProfile;
