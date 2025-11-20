import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Grid,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Restaurant as RestaurantIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

// Components
import AdvancedSearchForm from '../components/search/AdvancedSearchForm';
import QuickSearchForm from '../components/search/QuickSearchForm';
import SearchResults from '../components/search/SearchResults';
import SearchSidebar from '../components/search/SearchSidebar';
import { AuthenticationAlert, RateLimitAlert } from '../components/auth/AuthenticationComponents';

// Services
import RestaurantSearchAPI from '../services/RestaurantSearchAPI';
import { useAuth } from '../contexts/AuthContext';
import { isWithinRadius } from '../utils/locationUtils';

const RestaurantSearch = () => {
  const { isAuthenticated } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [authError, setAuthError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [originalResults, setOriginalResults] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const resultsSectionRef = useRef(null);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5); // Default radius in kilometers

  // Load all restaurants on component mount
  useEffect(() => {
    loadAllRestaurants();
  }, []);

  const loadAllRestaurants = async () => {
    if (!isAuthenticated) {
      setAuthError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setAuthError(false);
    setRateLimitError(false);
    try {
      const response = await RestaurantSearchAPI.getAllRestaurants();
      if (response.success) {
        const restaurants = response.data || [];
        setOriginalResults(restaurants);
        setSearchResults(restaurants);
        setSearchCriteria(null); // Clear search criteria for "all restaurants" view
        showSnackbar(`Loaded ${restaurants.length} restaurants`, 'success');
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error(response.message || 'Failed to load restaurants');
      }
    } catch (err) {
      if (err.message.includes('Authentication required')) {
        setAuthError(true);
      } else if (err.message.includes('Too many requests')) {
        setRateLimitError(true);
        setRetryCount(prev => prev + 1);
      } else {
        setError(err.message);
      }
      showSnackbar(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvancedSearch = async (criteria) => {
    if (!isAuthenticated) {
      setAuthError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setAuthError(false);
    try {
      console.log('Searching with criteria:', criteria);
      const response = await RestaurantSearchAPI.searchRestaurantsAdvanced(criteria);
      
      if (response.success) {
        const restaurants = response.data || [];
        setOriginalResults(restaurants);
        setSearchResults(restaurants);
        setSearchCriteria(criteria);
        showSnackbar(
          `Found ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} matching your criteria`, 
          'success'
        );
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err) {
      if (err.message.includes('Authentication required')) {
        setAuthError(true);
      } else {
        setError(err.message);
      }
      showSnackbar(`Search error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicSearch = async (cuisineType, location, maxBudget) => {
    if (!isAuthenticated) {
      setAuthError(true);
      return;
    }

    setLoading(true);
    setError(null);
    setAuthError(false);
    try {
      const response = await RestaurantSearchAPI.searchRestaurants(cuisineType, location, maxBudget);
      
      if (response.success) {
        const restaurants = response.data || [];
        setOriginalResults(restaurants);
        setSearchResults(restaurants);
        setSearchCriteria({ cuisineType, location, maxBudget });
        showSnackbar(
          `Found ${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} matching your criteria`, 
          'success'
        );
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err) {
      if (err.message.includes('Authentication required')) {
        setAuthError(true);
      } else {
        setError(err.message);
      }
      showSnackbar(`Search error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      // Advanced search tab
    } else if (newValue === 1) {
      // Basic search tab
    } else if (newValue === 2) {
      // Browse all tab
      loadAllRestaurants();
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRefresh = () => {
    if (searchCriteria) {
      handleAdvancedSearch(searchCriteria);
    } else {
      loadAllRestaurants();
    }
  };

  // Handle sort change
  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Handle filter change
  const handleFilterChange = (filters) => {
    setPriceRange(filters.priceRange);
    setMinRating(filters.minRating);
  };

  // Apply sorting and filtering to results
  const filteredAndSortedResults = useMemo(() => {
    let results = [...originalResults];

    // Apply filters
    results = results.filter(restaurant => {
      const price = restaurant.budget || restaurant.price || 0;
      const rating = restaurant.rating || 0;
      
      // Price range filter
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }
      
      // Rating filter
      if (rating < minRating) {
        return false;
      }
      
      // Location filter (within radius)
      // Only apply filter if userLocation is valid
      if (useLocationFilter && userLocation && 
          userLocation.lat != null && 
          userLocation.lon != null &&
          !isNaN(userLocation.lat) && 
          !isNaN(userLocation.lon) &&
          !(userLocation.lat === 0 && userLocation.lon === 0)) {
        if (!isWithinRadius(restaurant, userLocation, radiusKm)) {
          return false;
        }
      }
      
      return true;
    });

    // Apply sorting
    if (sortBy !== 'none') {
      results.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'price':
            aValue = a.budget || a.price || 0;
            bValue = b.budget || b.price || 0;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'name':
            aValue = (a.restaurantName || a.name || '').toLowerCase();
            bValue = (b.restaurantName || b.name || '').toLowerCase();
            break;
          case 'matchScore':
            aValue = a.matchScore || 0;
            bValue = b.matchScore || 0;
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return results;
  }, [originalResults, sortBy, sortOrder, priceRange, minRating, useLocationFilter, userLocation, radiusKm]);

  // Reset page when filters or sorting change
  useEffect(() => {
    setPage(1);
  }, [sortBy, sortOrder, priceRange, minRating, useLocationFilter, userLocation, radiusKm]);

  // Handle location filter change
  const handleLocationFilterChange = (enabled) => {
    setUseLocationFilter(enabled);
  };

  // Handle get user location
  const handleGetUserLocation = (location) => {
    setUserLocation(location);
  };

  // Update displayed results when filtered/sorted results change
  useEffect(() => {
    setSearchResults(filteredAndSortedResults);
  }, [filteredAndSortedResults]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to search results section when page changes
    if (resultsSectionRef.current) {
      const offset = 100; // Offset from top for better visibility
      const elementPosition = resultsSectionRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedResults.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = filteredAndSortedResults.slice(startIndex, endIndex);

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
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 3, sm: 4, md: 5 }, 
          position: 'relative', 
          zIndex: 1, 
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          '& .MuiContainer-root': {
            width: '100%',
          }
        }}
      >
        {/* Modern Header */}
        <Box sx={{ 
          mb: { xs: 4, sm: 5, md: 6 }, 
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          p: { xs: 3, sm: 4, md: 5 },
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
            <RestaurantIcon sx={{ 
              fontSize: { xs: 40, md: 56 }, 
              mr: 2, 
              verticalAlign: 'middle',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }} />
            Restaurant Search
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
            Discover amazing restaurants tailored to your taste and preferences
      </Typography>
      
          {/* Modern Navigation Tabs */}
          <Paper sx={{ 
            mb: 0, 
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
                icon={<SearchIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Advanced Search" 
                iconPosition="start"
              />
              <Tab 
                icon={<RestaurantIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Quick Search" 
                iconPosition="start"
              />
              <Tab 
                icon={<TrendingUpIcon sx={{ fontSize: '1.2rem' }} />} 
                label="Browse All" 
                iconPosition="start"
              />
            </Tabs>
          </Paper>
        </Box>

      {/* Authentication Alert */}
      {authError && (
        <AuthenticationAlert onRetry={() => {
          setAuthError(false);
          if (activeTab === 2) {
            loadAllRestaurants();
          }
        }} />
      )}

      {/* Rate Limit Alert */}
      {rateLimitError && (
        <RateLimitAlert 
          onRetry={() => {
            setRateLimitError(false);
            if (activeTab === 2) {
              loadAllRestaurants();
            } else if (searchCriteria) {
              handleAdvancedSearch(searchCriteria);
            }
          }}
          retryCount={retryCount}
        />
      )}

        {/* Modern Search Forms */}
        <Box sx={{ 
          mb: { xs: 3, sm: 4, md: 5 },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          p: { xs: 3, sm: 4, md: 5 },
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          width: '100%',
        }}>
          {!authError && !rateLimitError && activeTab === 0 && (
            <AdvancedSearchForm 
              onSearch={handleAdvancedSearch}
              loading={loading}
            />
          )}

          {!authError && !rateLimitError && activeTab === 1 && (
            <QuickSearchForm 
              onSearch={handleBasicSearch}
              loading={loading}
            />
          )}

          {!authError && !rateLimitError && activeTab === 2 && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 6,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <TrendingUpIcon sx={{ 
                fontSize: 64, 
                color: 'primary.main', 
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Browse All Restaurants
        </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Discover our complete collection of amazing restaurants
        </Typography>
            </Box>
          )}
        </Box>

        {/* Modern Search Results with Sidebar */}
        <Grid container spacing={3} sx={{ width: '100%', margin: 0 }} ref={resultsSectionRef}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ width: '100%' }}>
            <SearchSidebar
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              priceRange={priceRange}
              minRating={minRating}
              resultCount={filteredAndSortedResults.length}
              useLocationFilter={useLocationFilter}
              userLocation={userLocation}
              onLocationFilterChange={handleLocationFilterChange}
              onGetUserLocation={handleGetUserLocation}
              radiusKm={radiusKm}
              onRadiusChange={setRadiusKm}
            />
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={9} sx={{ width: '100%' }}>
            <Box sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              p: { xs: 2, sm: 3, md: 4 },
              px: { xs: 3, sm: 4, md: 6 }, // Extra horizontal padding to prevent cards from overflowing
              py: { xs: 3, sm: 4, md: 5 }, // Extra vertical padding
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              width: '100%',
              overflow: 'visible', // Allow cards to be visible when hovering
            }}>
              <SearchResults 
                results={paginatedResults}
                loading={loading}
                error={error}
                searchCriteria={searchCriteria}
                totalResults={filteredAndSortedResults.length}
                currentPage={page}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                userLocation={userLocation}
                showLocationRadius={useLocationFilter}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                allResults={originalResults} // Show all restaurants from search in map, not filtered ones
              />
            </Box>
          </Grid>
        </Grid>

        {/* Modern Floating Action Button */}
        <Tooltip title="Refresh Results" arrow>
          <Fab
            aria-label="refresh"
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              width: 64,
              height: 64,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(180deg)',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
              '&:disabled': {
                background: 'rgba(102, 126, 234, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            <RefreshIcon sx={{ fontSize: '1.5rem' }} />
          </Fab>
        </Tooltip>

        {/* Modern Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }
          }}
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
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              },
              '& .MuiAlert-message': {
                fontSize: '1rem',
                fontWeight: 500,
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </Container>
    </Box>
  );
};

export default RestaurantSearch;
