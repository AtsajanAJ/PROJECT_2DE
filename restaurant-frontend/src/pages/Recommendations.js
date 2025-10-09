import React, { useState } from 'react';
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

// Cuisine Types - ประเภทอาหาร
const cuisineTypes = [
  'GrilledPork', 'Noodles', 'Burger', 'Steak', 'BubbleMilkTea', 
  'Breakfast', 'Shabu Sukiyaki', 'Sushi', 'ALaCarte', 'FastFood', 
  'Vegatarian Jay', 'Buffet', 'Omakase', 'Pizza', 'Seafood', 
  'Grill', 'IceCream', 'VegatarianFood', 'DrinksJuice', 'OneDishMeal', 
  'Dimsum', 'Dessert', 'Ramen', 'CleanFood Salad', 'Bakery Cake'
];

// Restaurant Types - ประเภทร้านอาหาร
const restaurantTypes = [
  'Fast Dining', 'Casual Dining', 'Fine Dining', 'Buffet', 
  'Street Food', 'Cafe', 'Food Court', 'Food Truck',
  'Family Restaurant', 'Bistro', 'Pub', 'Diner', 'Kiosk'
];

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, apiClient } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
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

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        gutterBottom 
        align="center" 
                 sx={{ 
           mb: 6, 
           fontWeight: 800,
           background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
           backgroundClip: 'text',
           WebkitBackgroundClip: 'text',
           WebkitTextFillColor: 'transparent',
         }}
      >
        🏃‍♂️ Get Personalized Restaurant Recommendations
      </Typography>

      <Paper 
        sx={{ 
          p: 6, 
          width: '100%',
          maxWidth: 800,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
      >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar
                                 sx={{
                   width: 56,
                   height: 56,
                   mr: 2,
                   background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                 }}
              >
                <RunIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  Your Running Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tell us about your preferences and get personalized recommendations
                </Typography>
              </Box>
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
          maxWidth: 1200, 
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
              <Typography 
                variant="h4" 
                gutterBottom 
                align="center"
                sx={{ 
                  mb: 4, 
                  fontWeight: 700,
                                     background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🎯 Your Personalized Recommendations ({recommendations.length})
              </Typography>

              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                },
                gap: 3,
                width: '100%',
              }}>
                {recommendations.map((restaurant, index) => (
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
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        },
                        ...(index === 0 && {
                          border: '3px solid #fbbf24',
                          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                          },
                        }),
                      }}
                    >
                      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          {index === 0 && (
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
                              color: index === 0 ? '#92400e' : 'text.primary',
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
                ))}
              </Box>
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
    </Box>
  );
};

export default Recommendations;
