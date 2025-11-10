import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CardActions,
  Rating,
  Divider,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  LinearProgress,
  InputAdornment,
  Pagination,
  useTheme,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  DirectionsRun as RunIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import userDataService from '../services/UserDataService';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  userId: yup.string().required('User ID is required'),
  runnerType: yup.string().required('Runner type is required'),
  maxBudget: yup.number().positive('Budget must be positive').required('Budget is required'),
  preferredCuisines: yup.array().min(1, 'Select at least one cuisine'),
  preferredRestaurantTypes: yup.array().min(1, 'Select at least one restaurant type'),
  preRunNutrition: yup.object().shape({
    carbLevel: yup.string().required('Pre-run carb level is required'),
    fatLevel: yup.string().required('Pre-run fat level is required'),
    proteinLevel: yup.string().required('Pre-run protein level is required'),
  }),
  postRunNutrition: yup.object().shape({
    carbLevel: yup.string().required('Post-run carb level is required'),
    fatLevel: yup.string().required('Post-run fat level is required'),
    proteinLevel: yup.string().required('Post-run fat level is required'),
  }),
});

const nutritionLevels = ['Low', 'Medium', 'High'];
const runnerTypes = ['Fun Run', 'Mini Marathon', 'Half Marathon', 'Marathon', 'Ultra Marathon', 'Trail Run'];

// Cuisine Types - ประเภทอาหาร (25 types)
const cuisineTypes = [
  'GrilledPork', 'Noodles', 'Burger', 'Steak', 'BubbleMilkTea', 
  'Breakfast', 'Shabu Sukiyaki', 'Sushi', 'ALaCarte', 'FastFood', 
  'Vegetarian Jay', 'Buffet', 'Omakase', 'Pizza', 'Seafood', 
  'Grill', 'IceCream', 'VegetarianFood', 'DrinksJuice', 'OneDishMeal', 
  'Dimsum', 'Dessert', 'Ramen', 'CleanFood Salad', 'Bakery Cake'
];

// Restaurant Types - ประเภทร้านอาหาร (13 types)
const restaurantTypes = [
  'Fast Dining', 'Casual Dining', 'Fine Dining', 'Buffet', 
  'Street Food', 'Cafe', 'Food Court', 'Food Truck',
  'Family Restaurant', 'Bistro', 'Pub', 'Diner', 'Kiosk'
];

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid
  const { user, apiClient } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      userId: user?.username || '',
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
    },
  });

  // Load user profile and auto-fill form on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      const userId = user?.username;
      if (!userId) return;
      
      const profile = userDataService.getUserProfile(userId);
      if (profile) {
        // Set form values from profile
        setValue('userId', profile.username || userId || '');
        setValue('runnerType', profile.runnerType || '');
        setValue('maxBudget', profile.maxBudget || '');
        setValue('preferredCuisines', profile.preferredCuisines || []);
        setValue('preferredRestaurantTypes', profile.preferredRestaurantTypes || []);
        setValue('preRunNutrition.carbLevel', profile.preRunNutrition?.carbLevel || '');
        setValue('preRunNutrition.fatLevel', profile.preRunNutrition?.fatLevel || '');
        setValue('preRunNutrition.proteinLevel', profile.preRunNutrition?.proteinLevel || '');
        setValue('postRunNutrition.carbLevel', profile.postRunNutrition?.carbLevel || '');
        setValue('postRunNutrition.fatLevel', profile.postRunNutrition?.fatLevel || '');
        setValue('postRunNutrition.proteinLevel', profile.postRunNutrition?.proteinLevel || '');

        // Auto-get recommendations if profile data is complete
        if (profile.runnerType && profile.maxBudget && 
            profile.preferredCuisines?.length > 0 && 
            profile.preferredRestaurantTypes?.length > 0 &&
            profile.preRunNutrition?.carbLevel && profile.preRunNutrition?.fatLevel && profile.preRunNutrition?.proteinLevel &&
            profile.postRunNutrition?.carbLevel && profile.postRunNutrition?.fatLevel && profile.postRunNutrition?.proteinLevel) {
          // Auto-trigger recommendation after a short delay
          setTimeout(() => {
            if (!autoLoaded) {
              const formData = {
                userId: profile.username || userId || '',
                runnerType: profile.runnerType,
                maxBudget: parseFloat(profile.maxBudget) || 0,
                preferredCuisines: profile.preferredCuisines,
                preferredRestaurantTypes: profile.preferredRestaurantTypes,
                preRunNutrition: profile.preRunNutrition,
                postRunNutrition: profile.postRunNutrition,
              };
              handleAutoRecommendation(formData);
            }
          }, 500);
        }
      }
    };

    if (user?.username) {
      loadUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.username]);

  const handleAutoRecommendation = async (data) => {
    if (autoLoaded) return; // Prevent multiple auto-loads
    setAutoLoaded(true);
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.post('/restaurants/recommendations', data);
      
      if (response.data.success) {
        const data = response.data.data || [];
        setRecommendations(data);
        setPage(1); // Reset to first page when new recommendations are loaded
      } else {
        setError(response.data.message || 'Failed to get recommendations');
      }
    } catch (err) {
      // Don't show error for auto-load, just log it
      console.error('Auto-recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setAutoLoaded(true); // Mark as manually triggered
    
    try {
      const response = await apiClient.post('/restaurants/recommendations', data);
      
      if (response.data.success) {
        setRecommendations(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to get recommendations');
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setRecommendations([]);
    setError('');
    setPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecommendations = recommendations.slice(startIndex, endIndex);

  // Calculate maximum match score from all recommendations
  const maxMatchScore = useMemo(() => {
    if (recommendations.length === 0) return 0;
    return Math.max(...recommendations.map(r => r.matchScore || 0));
  }, [recommendations]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getNutritionColor = (level) => {
    switch (level) {
      case 'Low': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        py: 4,
        px: 2,
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
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 4, 
            mt: 2,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          🏃‍♂️ Get Personalized Restaurant Recommendations
        </Typography>

      <Paper 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
          mb: 4,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 25px 70px rgba(0,0,0,0.2)',
          }
        }}
      >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 250 }}>
                <Avatar
                  sx={{
                    width: { xs: 48, md: 64 },
                    height: { xs: 48, md: 64 },
                    mr: 2,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <RunIcon sx={{ fontSize: { xs: 24, md: 32 } }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    Your Running Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    {autoLoaded && recommendations.length > 0 
                      ? '✨ Loaded from your profile. Recommendations are shown below.' 
                      : 'Tell us about your preferences and get personalized recommendations'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={() => {
                  const profilePath = user?.username ? `/profile/${user.username}` : '/profile';
                  navigate(profilePath);
                }}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
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
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Basic Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                  Basic Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      User ID
                    </Typography>
                    <Controller
                      name="userId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          disabled
                          error={!!errors.userId}
                          helperText={errors.userId?.message || "Your username (auto-filled)"}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-disabled': {
                                backgroundColor: '#f9fafb',
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Runner Type
                    </Typography>
                    <Controller
                      name="runnerType"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.runnerType}>
                          <Select 
                            {...field} 
                            sx={{
                              borderRadius: '8px',
                            }}
                          >
                            {runnerTypes.map((type) => (
                              <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                      Max Budget
                    </Typography>
                    <Controller
                      name="maxBudget"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          error={!!errors.maxBudget}
                          helperText={errors.maxBudget?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Food Preferences Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                  Food Preferences
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500, mt: 1 }}>
                      Cuisine Types
                    </Typography>
                    <Controller
                      name="preferredCuisines"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.preferredCuisines}>
                          <Select
                            {...field}
                            multiple
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
                            sx={{
                              borderRadius: '8px',
                            }}
                          >
                            {cuisineTypes.map((cuisine) => (
                              <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500, mt: 1 }}>
                      Restaurant Types
                    </Typography>
                    <Controller
                      name="preferredRestaurantTypes"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.preferredRestaurantTypes}>
                          <Select
                            {...field}
                            multiple
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
                            sx={{
                              borderRadius: '8px',
                            }}
                          >
                            {restaurantTypes.map((type) => (
                              <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Pre-Run Nutrition Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                  Pre-Run Nutrition
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {['carbLevel', 'fatLevel', 'proteinLevel'].map((nutrient) => (
                    <Box key={nutrient} sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                        {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                      </Typography>
                      <Controller
                        name={`preRunNutrition.${nutrient}`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.preRunNutrition?.[nutrient]}>
                            <Select 
                              {...field} 
                              sx={{
                                borderRadius: '8px',
                              }}
                            >
                              {nutritionLevels.map((level) => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Post-Run Nutrition Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                  Post-Run Nutrition
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {['carbLevel', 'fatLevel', 'proteinLevel'].map((nutrient) => (
                    <Box key={nutrient} sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                        {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                      </Typography>
                      <Controller
                        name={`postRunNutrition.${nutrient}`}
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.postRunNutrition?.[nutrient]}>
                            <Select 
                              {...field} 
                              sx={{
                                borderRadius: '8px',
                              }}
                            >
                              {nutritionLevels.map((level) => (
                                <MenuItem key={level} value={level}>{level}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    borderWidth: '1px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: '#f9fafb',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                                         background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                     '&:hover': {
                       background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                     },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    },
                  }}
                >
                  {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                </Button>
              </Box>
            </form>
      </Paper>

      {/* Results Section - Show below form when there are results */}
      {recommendations.length > 0 && (
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1400, 
          mx: 'auto',
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '16px',
                '& .MuiAlert-icon': {
                  fontSize: '24px',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                                     background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                  },
                }}
              >
                <CircularProgress size={60} sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                Analyzing your preferences...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Finding the perfect restaurants for your running needs
              </Typography>
            </Box>
          )}

          {!loading && (
            <>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 4,
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#4c1d95',
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      🎯 Your Personalized Recommendations
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#000000', fontWeight: 600 }}>
                      Found <strong style={{ color: '#000000', fontWeight: 700 }}>{recommendations.length}</strong> restaurant{recommendations.length !== 1 ? 's' : ''} matching your preferences
                      {totalPages > 1 && (
                        <> • Showing <strong style={{ color: '#000000', fontWeight: 700 }}>{startIndex + 1}</strong> - <strong style={{ color: '#000000', fontWeight: 700 }}>{Math.min(endIndex, recommendations.length)}</strong> of <strong style={{ color: '#000000', fontWeight: 700 }}>{recommendations.length}</strong> on this page</>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 3,
                width: '100%',
                mb: 4,
              }}>
                {paginatedRecommendations.map((restaurant, index) => {
                  const globalIndex = startIndex + index;
                  const restaurantScore = restaurant.matchScore || 0;
                  const isTopRecommendation = restaurantScore === maxMatchScore && maxMatchScore > 0;
                  
                  return (
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        },
                        ...(isTopRecommendation && {
                          border: '3px solid #fbbf24',
                          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                          boxShadow: '0 8px 32px rgba(251, 191, 36, 0.3)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                            zIndex: 1,
                          },
                        }),
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                          {isTopRecommendation && (
                            <Chip
                              label="🥇 TOP RECOMMENDATION"
                              color="warning"
                              sx={{ 
                                mr: 2, 
                                fontWeight: 700,
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                color: 'white',
                              }}
                            />
                          )}
                          <Typography 
                            variant="h6" 
                            component="h3" 
                            sx={{ 
                              fontWeight: 700,
                              color: isTopRecommendation ? '#92400e' : 'text.primary',
                              fontSize: { xs: '1rem', md: '1.25rem' },
                            }}
                          >
                            {restaurant.restaurantName}
                          </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <RestaurantIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {restaurant.cuisineType} • {restaurant.restaurantType}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <LocationIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2">{restaurant.location}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <MoneyIcon sx={{ mr: 1.5, color: 'primary.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ${restaurant.budget.toFixed(2)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ mr: 1, fontWeight: 600 }}>
                              Match Score:
                            </Typography>
                            <Rating
                              value={(restaurant.matchScore || 0) / 20}
                              readOnly
                              max={5}
                              size="small"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#fbbf24',
                                },
                              }}
                            />
                            <Typography variant="body2" sx={{ ml: 1, fontWeight: 700, color: 'primary.main' }}>
                              {restaurant.matchScore?.toFixed(1) || 'N/A'}
                            </Typography>
                          </Box>

                          {typeof restaurant.ruleConfidence !== 'undefined' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                                Rule Confidence:
                              </Typography>
                              <Chip 
                                label={`${restaurant.ruleConfidence}%`}
                                size="small"
                                sx={{
                                  borderRadius: '12px',
                                  background: '#e0e7ff',
                                  color: '#3730a3',
                                  fontWeight: 700,
                                  height: 22,
                                }}
                              />
                            </Box>
                          )}

                          {Array.isArray(restaurant.matchedRules) && restaurant.matchedRules.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Matched Rules:
                              </Typography>
                              <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {restaurant.matchedRules.slice(0, 5).map((rule, i) => (
                                  <Chip 
                                    key={i}
                                    label={rule}
                                    size="small"
                                    sx={{
                                      borderRadius: '12px',
                                      background: '#f3f4f6',
                                      color: '#374151',
                                      fontWeight: 500,
                                      maxWidth: '100%',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}

                                                     {restaurant.nutritionProfile && (
                             <Box sx={{ mt: 'auto' }}>
                               <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                 Nutrition Profile:
                               </Typography>
                               <Box sx={{ 
                                 display: 'grid',
                                 gridTemplateColumns: 'repeat(3, 1fr)',
                                 gap: 0.5,
                                 width: '100%',
                               }}>
                                 {Object.entries(restaurant.nutritionProfile).map(([key, value]) => (
                                   <Chip
                                     key={key}
                                     label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                                     size="small"
                                     sx={{
                                       borderRadius: '12px',
                                       background: getNutritionColor(value),
                                       color: 'white',
                                       fontWeight: 600,
                                       fontSize: '0.65rem',
                                       height: 24,
                                       minWidth: 0,
                                       '& .MuiChip-label': {
                                         overflow: 'hidden',
                                         textOverflow: 'ellipsis',
                                         whiteSpace: 'nowrap',
                                         px: 0.5,
                                       },
                                     }}
                                   />
                                 ))}
                               </Box>
                             </Box>
                           )}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ px: 4, pb: 4, pt: 0, mt: 'auto' }}>
                        <Button 
                          size="small" 
                          color="primary"
                          startIcon={<VisibilityIcon />}
                          sx={{
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="small" 
                          color="secondary"
                          startIcon={<FavoriteIcon />}
                          sx={{
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          Save
                        </Button>
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 4,
                  mb: 2,
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#000000',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                          color: '#ffffff',
                          border: '1px solid #8b5cf6',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                            color: '#ffffff',
                          }
                        },
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 1)',
                          color: '#000000',
                          border: '1px solid rgba(0, 0, 0, 0.4)',
                        },
                        '&.Mui-disabled': {
                          color: '#9ca3af',
                          backgroundColor: 'rgba(255, 255, 255, 0.6)',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                        }
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ textAlign: 'center', color: '#000000', fontWeight: 600 }}>
                    Showing <strong style={{ color: '#000000', fontWeight: 700 }}>{startIndex + 1}</strong> - <strong style={{ color: '#000000', fontWeight: 700 }}>{Math.min(endIndex, recommendations.length)}</strong> of <strong style={{ color: '#000000', fontWeight: 700 }}>{recommendations.length}</strong> recommendations
                  </Typography>
                </Box>
              )}
            </>
          )}

          {!loading && !error && recommendations.length === 0 && (
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <RestaurantIcon sx={{ fontSize: 60, color: '#9ca3af' }} />
              </Box>
              <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                No recommendations yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '500px', mx: 'auto' }}>
                Fill out the form above to get personalized restaurant recommendations based on your running profile.
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* Loading state - show centered when loading */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 8, mt: 4 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
              },
            }}
          >
            <CircularProgress size={60} sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            Analyzing your preferences...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Finding the perfect restaurants for your running needs
          </Typography>
        </Box>
      )}
      </Container>
    </Box>
  );
};

export default Recommendations;
