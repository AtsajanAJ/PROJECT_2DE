import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Paper,
  Snackbar,
  Pagination,
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
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import userDataService from '../../services/UserDataService';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RestaurantMap from './RestaurantMap';

const SearchResults = ({ 
  results, 
  loading, 
  error, 
  searchCriteria,
  totalResults,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  userLocation,
  showLocationRadius,
  allResults // All restaurants for map (not paginated)
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.username;
  const [savedRestaurants, setSavedRestaurants] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [savingRestaurant, setSavingRestaurant] = useState(null); // Track which restaurant is being saved

  // Load saved restaurants on component mount
  useEffect(() => {
    if (userId) {
      const saved = userDataService.getSavedRestaurants(userId);
      setSavedRestaurants(saved);
    }
  }, [userId]);

  const handleViewDetails = (restaurantId) => {
    navigate(`/restaurant/${encodeURIComponent(restaurantId)}`);
  };

  const handleSaveRestaurant = async (restaurant) => {
    if (!userId) {
      setSnackbarMessage('Please login to save restaurants.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    
    const restaurantId = restaurant.restaurantId || restaurant.id || restaurant.name;
    setSavingRestaurant(restaurantId); // Set loading state
    
    console.log('Saving restaurant:', restaurant); // Debug log
    
    // Create a proper restaurant object for saving
    const restaurantToSave = {
      id: restaurantId,
      name: restaurant.restaurantName || restaurant.name,
      cuisine: restaurant.cuisineType || restaurant.cuisine,
      location: restaurant.location || restaurant.address,
      rating: restaurant.rating || 4.0,
      price: restaurant.budget || restaurant.price || 0,
      restaurantType: restaurant.restaurantType || 'Unknown',
      nutritionProfile: restaurant.nutritionProfile,
      telephone: restaurant.telephone || restaurant.phone,
      nationality: restaurant.nationality
    };
    
    console.log('Restaurant to save:', restaurantToSave); // Debug log
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = userDataService.saveRestaurant(restaurantToSave, userId);
    if (success) {
      const saved = userDataService.getSavedRestaurants(userId);
      setSavedRestaurants(saved);
      setSnackbarMessage(`"${restaurantToSave.name}" saved successfully! ❤️`);
      setSnackbarSeverity('success');
    } else {
      setSnackbarMessage('Failed to save restaurant. Please try again.');
      setSnackbarSeverity('error');
    }
    
    setSavingRestaurant(null); // Clear loading state
    setSnackbarOpen(true);
  };

  const handleRemoveRestaurant = async (restaurantId) => {
    if (!userId) return;
    
    setSavingRestaurant(restaurantId); // Set loading state
    
    console.log('Removing restaurant:', restaurantId); // Debug log
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const success = userDataService.removeRestaurant(restaurantId, userId);
    if (success) {
      const saved = userDataService.getSavedRestaurants(userId);
      setSavedRestaurants(saved);
      setSnackbarMessage('Restaurant removed from saved list 💔');
      setSnackbarSeverity('info');
    } else {
      setSnackbarMessage('Failed to remove restaurant. Please try again.');
      setSnackbarSeverity('error');
    }
    
    setSavingRestaurant(null); // Clear loading state
    setSnackbarOpen(true);
  };

  const isRestaurantSaved = (restaurantId) => {
    if (!userId) return false;
    const isSaved = savedRestaurants.some(r => r.id === restaurantId);
    console.log(`Restaurant ${restaurantId} saved status:`, isSaved); // Debug log
    return isSaved;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
    if (budget === null || budget === undefined || budget === 0) {
      return 'ไม่ระบุ';
    }
    return `฿${budget.toFixed(2)}`;
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
      <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: 'left' }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🔍 Search Results ({totalResults !== undefined ? totalResults : results.length})
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Found <strong>{totalResults !== undefined ? totalResults : results.length}</strong> restaurant{(totalResults !== undefined ? totalResults : results.length) !== 1 ? 's' : ''} matching your criteria
          {totalResults !== undefined && totalPages > 1 && (
            <> • Showing <strong>{results.length}</strong> on this page</>
          )}
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
      </Box>

      {/* Map Section - Show map if there are any results (including search results) */}
      {(allResults && allResults.length > 0) || results.length > 0 ? (
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            📍 Restaurant Locations
            {(allResults && allResults.length > 0) && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({allResults.length} {allResults.length === 1 ? 'restaurant' : 'restaurants'})
              </Typography>
            )}
          </Typography>
          <RestaurantMap 
            restaurants={allResults || results} 
            userLocation={userLocation}
            showRadius={showLocationRadius}
            key={`map-${(allResults || results).length}`} // Force re-render when restaurants change
          />
        </Box>
      ) : null}

      {/* Results Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(3, 1fr)',
        },
        gap: { xs: 2, sm: 3 },
        width: '100%',
        padding: { xs: '8px', sm: '12px', md: '16px' }, // Increased padding to prevent cards from overflowing
        overflow: 'visible', // Allow content to be visible
      }}>
        {results.map((restaurant, index) => (
          <Box key={restaurant.restaurantId || index} sx={{ width: '100%', minWidth: 0 }}>
            <Card 
              sx={{ 
                height: '100%', // Full height of grid item - ensures all cards are same height
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
                overflow: 'hidden', // Prevent overflow
                padding: '16px',
                minHeight: 0 // Allow flex child to shrink
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
                  minHeight: '140px', // Minimum height, can expand for price
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75, // Consistent spacing between items
                  flex: '0 0 auto' // Don't shrink, allow natural expansion
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

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    minHeight: '28px', // Ensure enough space for price
                    padding: '4px 0' // Add some vertical padding
                  }}>
                    <MoneyIcon sx={{ fontSize: 18, mr: 1, color: 'success.main' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: restaurant.budget && restaurant.budget > 0 ? 'success.main' : 'text.secondary',
                        fontSize: '0.95rem' // Slightly larger font for better visibility
                      }}
                    >
                      ราคา: {formatBudget(restaurant.budget || restaurant.price || 0)}
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
                  minHeight: '70px', // Minimum height, can expand if needed
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Nutrition Profile:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.75, 
                    flexWrap: { xs: 'wrap', sm: 'nowrap' }, // Single line on sm+ screens
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                  }}>
                    <Chip
                      icon={<FitnessIcon sx={{ fontSize: '14px' }} />}
                      label={`Carbs: ${restaurant.nutritionProfile?.carbLevel || 'N/A'}`}
                      size="small"
                      color={getNutritionChipColor(restaurant.nutritionProfile?.carbLevel)}
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '24px',
                        '& .MuiChip-label': { whiteSpace: 'nowrap' }
                      }}
                    />
                    <Chip
                      icon={<FitnessIcon sx={{ fontSize: '14px' }} />}
                      label={`Fat: ${restaurant.nutritionProfile?.fatLevel || 'N/A'}`}
                      size="small"
                      color={getNutritionChipColor(restaurant.nutritionProfile?.fatLevel)}
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '24px',
                        '& .MuiChip-label': { whiteSpace: 'nowrap' }
                      }}
                    />
                    <Chip
                      icon={<FitnessIcon sx={{ fontSize: '14px' }} />}
                      label={`Protein: ${restaurant.nutritionProfile?.proteinLevel || 'N/A'}`}
                      size="small"
                      color={getNutritionChipColor(restaurant.nutritionProfile?.proteinLevel)}
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem',
                        height: '24px',
                        '& .MuiChip-label': { whiteSpace: 'nowrap' }
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

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button
                    variant={isRestaurantSaved(restaurant.restaurantId) ? "contained" : "outlined"}
                    size="small"
                    startIcon={
                      savingRestaurant === restaurant.restaurantId ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : isRestaurantSaved(restaurant.restaurantId) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )
                    }
                    onClick={() => isRestaurantSaved(restaurant.restaurantId) 
                      ? handleRemoveRestaurant(restaurant.restaurantId) 
                      : handleSaveRestaurant(restaurant)
                    }
                    disabled={savingRestaurant === restaurant.restaurantId}
                    sx={{ 
                      height: '40px',
                      flex: 1,
                      color: isRestaurantSaved(restaurant.restaurantId) ? 'white' : 'primary.main',
                      backgroundColor: isRestaurantSaved(restaurant.restaurantId) ? 'error.main' : 'transparent',
                      borderColor: isRestaurantSaved(restaurant.restaurantId) ? 'error.main' : 'primary.main',
                      '&:hover': {
                        backgroundColor: isRestaurantSaved(restaurant.restaurantId) ? 'error.dark' : 'primary.light',
                        color: isRestaurantSaved(restaurant.restaurantId) ? 'white' : 'white',
                        transform: savingRestaurant === restaurant.restaurantId ? 'none' : 'scale(1.02)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      transition: 'all 0.2s ease-in-out',
                      '&:disabled': {
                        opacity: 0.7
                      }
                    }}
                  >
                    {savingRestaurant === restaurant.restaurantId 
                      ? 'Saving...' 
                      : isRestaurantSaved(restaurant.restaurantId) 
                        ? 'Saved ❤️' 
                        : 'Save 💖'
                    }
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(restaurant.restaurantId)}
                    sx={{ 
                      height: '40px',
                      flex: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'scale(1.02)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mt: { xs: 3, sm: 4 },
          mb: 2,
          flexDirection: 'column',
          gap: 2
        }}>
          <Pagination
            count={totalPages}
            page={currentPage || 1}
            onChange={onPageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '1rem',
                fontWeight: 600,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                }
              }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{((currentPage || 1) - 1) * (itemsPerPage || 12) + 1}</strong> - <strong>{Math.min((currentPage || 1) * (itemsPerPage || 12), totalResults || results.length)}</strong> of <strong>{totalResults || results.length}</strong> restaurants
          </Typography>
        </Box>
      )}

      {/* Results Summary */}
      {results.length > 0 && (
        <Box sx={{ 
          mt: { xs: 3, sm: 4 }, 
          p: { xs: 2, sm: 3 }, 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
        }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {totalResults !== undefined ? (
              <>
                Total: <strong>{totalResults}</strong> restaurant{totalResults !== 1 ? 's' : ''}
                {' • '}
                Showing page <strong>{currentPage || 1}</strong> of <strong>{totalPages || 1}</strong>
              </>
            ) : (
              <>
                Showing <strong>{results.length}</strong> restaurant{results.length !== 1 ? 's' : ''}
              </>
            )}
            {' • '}
            Budget range: <strong>{formatBudget(Math.min(...results.map(r => r.budget || 0)))} - {formatBudget(Math.max(...results.map(r => r.budget || 0)))}</strong>
            {results.some(r => r.matchScore) && (
              <>
                {' • '}
                Average match score: <strong>{(results.reduce((sum, r) => sum + (r.matchScore || 0), 0) / results.length).toFixed(1)}%</strong>
              </>
            )}
          </Typography>
        </Box>
      )}

      {/* Snackbar for notifications */}
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
    </Box>
  );
};

export default SearchResults;
