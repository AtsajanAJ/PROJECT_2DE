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
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import userDataService from '../services/UserDataService';
import AddNutritionEntryDialog from '../components/profile/AddNutritionEntryDialog';

const UserProfile = () => {
  const { user } = useAuth();
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
    location: 'Bangkok, Thailand',
    runnerType: 'Marathon',
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
    loadUserData();
  }, []);

  const loadUserData = () => {
    const saved = userDataService.getSavedRestaurants();
    const nutrition = userDataService.getNutritionHistory();
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
    const success = userDataService.saveUserProfile(userProfile);
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
    const success = userDataService.removeRestaurant(restaurantId);
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
    const success = userDataService.removeNutritionEntry(entryId);
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
    const success = userDataService.exportData();
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

  const handleNutritionEntrySaved = () => {
    loadUserData(); // Reload data
    setSnackbarMessage('Nutrition entry added successfully!');
    setSnackbarSeverity('success');
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
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={userProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!editMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={userProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!editMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={userProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!editMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={userProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={userProfile.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!editMode}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!editMode}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={userProfile.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      label="Gender"
                      sx={{
                        borderRadius: '8px',
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    value={userProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!editMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={userProfile.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!editMode}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
              {editMode && (
                <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ 
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
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
