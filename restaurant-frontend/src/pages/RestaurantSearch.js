import React, { useState, useEffect } from 'react';
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
import { AuthenticationAlert, RateLimitAlert } from '../components/auth/AuthenticationComponents';

// Services
import RestaurantSearchAPI from '../services/RestaurantSearchAPI';
import { useAuth } from '../contexts/AuthContext';

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
        setSearchResults(response.data || []);
        setSearchCriteria(null); // Clear search criteria for "all restaurants" view
        showSnackbar(`Loaded ${response.data?.length || 0} restaurants`, 'success');
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
        setSearchResults(response.data || []);
        setSearchCriteria(criteria);
        showSnackbar(
          `Found ${response.data?.length || 0} restaurant${response.data?.length !== 1 ? 's' : ''} matching your criteria`, 
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
        setSearchResults(response.data || []);
        setSearchCriteria({ cuisineType, location, maxBudget });
        showSnackbar(
          `Found ${response.data?.length || 0} restaurant${response.data?.length !== 1 ? 's' : ''} matching your criteria`, 
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
          mb: 6, 
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
          mb: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          p: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          }
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

        {/* Modern Search Results */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          p: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          }
        }}>
          <SearchResults 
            results={searchResults}
            loading={loading}
            error={error}
            searchCriteria={searchCriteria}
          />
        </Box>

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
