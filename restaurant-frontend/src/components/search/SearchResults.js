import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Button,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  LocalDining as CuisineIcon,
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon,
  FitnessCenter as FitnessIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, loading, error, searchCriteria }) => {
  const navigate = useNavigate();

  const handleViewDetails = (restaurantId) => {
    navigate(`/restaurant/${encodeURIComponent(restaurantId)}`);
  };

  const getNutritionChipColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  const getNutritionIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  };

  const formatBudget = (budget) => {
    return `฿${budget?.toFixed(2) || '0.00'}`;
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Searching restaurants...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we find the best matches for you
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Error
        </Typography>
        <Typography variant="body2">
          {error}
        </Typography>
      </Alert>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <RestaurantIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
          No restaurants found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Try adjusting your search criteria or browse all restaurants
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()}
          sx={{ mr: 2 }}
        >
          Reset Search
        </Button>
        <Button 
          variant="contained" 
          onClick={() => navigate('/search')}
        >
          Browse All
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Search Summary */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Search Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Found <strong>{results.length}</strong> restaurant{results.length !== 1 ? 's' : ''} matching your criteria
        </Typography>
        {searchCriteria && Object.values(searchCriteria).some(value => value && value !== 'name' && value !== 'asc') && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active filters:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(searchCriteria).map(([key, value]) => {
                if (!value || value === 'name' || value === 'asc') return null;
                return (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </Paper>

      {/* Results Grid */}
      <Grid container spacing={3}>
        {results.map((restaurant, index) => (
          <Grid item xs={12} md={6} lg={4} key={restaurant.restaurantId || index}>
            <Card 
              sx={{ 
                height: '520px', // Fixed height for all cards
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden', // Prevent content overflow
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              {/* Restaurant Image Placeholder */}
              <Box
                sx={{
                  height: 200,
                  bgcolor: 'grey.100',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <RestaurantIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                {restaurant.matchScore && (
                  <Chip
                    label={`${restaurant.matchScore.toFixed(0)}% match`}
                    color={getMatchScoreColor(restaurant.matchScore)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '320px', // Fixed height for content area
                overflow: 'hidden',
                padding: '16px'
              }}>
                {/* Restaurant Name */}
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    height: '48px', // Fixed height for title
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '24px'
                  }}
                >
                  {restaurant.restaurantName || 'Unknown Restaurant'}
                </Typography>

                {/* Basic Info */}
                <Box sx={{ 
                  mb: 2, 
                  height: '120px', // Fixed height for basic info
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CuisineIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {restaurant.cuisineType || 'Unknown Cuisine'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {restaurant.location || 'Unknown Location'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MoneyIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {formatBudget(restaurant.budget)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {restaurant.telephone || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                {/* Restaurant Type */}
                {restaurant.restaurantType && (
                  <Chip
                    label={restaurant.restaurantType}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2, alignSelf: 'flex-start' }}
                  />
                )}

                {/* Nutrition Profile - Always show all 3 nutrition labels */}
                <Box sx={{ 
                  mb: 2, 
                  height: '60px', // Fixed height for nutrition profile
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Nutrition Profile:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5, 
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                    height: '32px'
                  }}>
                    <Chip
                      icon={<FitnessIcon />}
                      label={`Carbs: ${restaurant.nutritionProfile?.carbLevel || 'N/A'}`}
                      size="small"
                      color={getNutritionChipColor(restaurant.nutritionProfile?.carbLevel)}
                      variant="outlined"
                      sx={{ 
                        minWidth: 'fit-content',
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                    <Chip
                      icon={<FitnessIcon />}
                      label={`Fat: ${restaurant.nutritionProfile?.fatLevel || 'N/A'}`}
                      size="small"
                      color={getNutritionChipColor(restaurant.nutritionProfile?.fatLevel)}
                      variant="outlined"
                      sx={{ 
                        minWidth: 'fit-content',
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                    <Chip
                      icon={<FitnessIcon />}
                      label={`Protein: ${restaurant.nutritionProfile?.proteinLevel || 'N/A'}`}
                      size="small"
                      color={getNutritionChipColor(restaurant.nutritionProfile?.proteinLevel)}
                      variant="outlined"
                      sx={{ 
                        minWidth: 'fit-content',
                        fontSize: '0.75rem',
                        height: '24px'
                      }}
                    />
                  </Box>
                </Box>

                {/* Matched Rules */}
                {restaurant.matchedRules && restaurant.matchedRules.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                      Matching Rules:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {restaurant.matchedRules.slice(0, 2).map((rule, idx) => (
                        <Chip
                          key={idx}
                          label={rule.replace('Rule ', '').substring(0, 20) + '...'}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ))}
                      {restaurant.matchedRules.length > 2 && (
                        <Chip
                          label={`+${restaurant.matchedRules.length - 2} more`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Action Button - Fixed at bottom */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ViewIcon />}
                  onClick={() => handleViewDetails(restaurant.restaurantId)}
                  sx={{ 
                    height: '40px', // Fixed button height
                    mt: 'auto' // Push to bottom
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Results Summary */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Showing {results.length} restaurant{results.length !== 1 ? 's' : ''} 
          {results.length > 0 && (
            <>
              {' • '}
              Budget range: {formatBudget(Math.min(...results.map(r => r.budget || 0)))} - {formatBudget(Math.max(...results.map(r => r.budget || 0)))}
              {' • '}
              Average match score: {(results.reduce((sum, r) => sum + (r.matchScore || 0), 0) / results.length).toFixed(1)}%
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
};

export default SearchResults;
