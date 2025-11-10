import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const QuickSearchForm = ({ onSearch, loading = false }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    cuisineType: '',
    location: 'Phuket', // Default location - project focuses on Phuket
  });

  // Complete cuisine types list (25 types)
  const cuisineOptions = [
    'GrilledPork',
    'Noodles',
    'Burger',
    'Steak',
    'BubbleMilkTea',
    'Breakfast',
    'Shabu Sukiyaki',
    'Sushi',
    'ALaCarte',
    'FastFood',
    'Vegetarian Jay',
    'Buffet',
    'Omakase',
    'Pizza',
    'Seafood',
    'Grill',
    'IceCream',
    'VegetarianFood',
    'DrinksJuice',
    'OneDishMeal',
    'Dimsum',
    'Dessert',
    'Ramen',
    'CleanFood Salad',
    'Bakery Cake'
  ];

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    const criteria = {
      cuisineType: searchCriteria.cuisineType || null,
      // Location not sent - project focuses on Phuket only, backend handles it automatically
      // Budget filtering is handled by Price Range filter in SearchSidebar
    };
    // Pass null for location and maxBudget - backend won't check location (Phuket only)
    // Budget filtering is done client-side via SearchSidebar Price Range filter
    onSearch(criteria.cuisineType, null, null);
  };

  const handleClear = () => {
    setSearchCriteria({
      cuisineType: '',
      location: 'Phuket', // Default location - project focuses on Phuket
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(searchCriteria).filter(value => value !== '').length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Quick Search
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={`${activeFiltersCount} filters active`} 
              color="primary" 
              size="small" 
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Quickly find restaurants by cuisine and budget (Location: Phuket)
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Cuisine Type</InputLabel>
              <Select
                value={searchCriteria.cuisineType}
                onChange={(e) => handleInputChange('cuisineType', e.target.value)}
                label="Cuisine Type"
                startAdornment={<RestaurantIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="">Any Cuisine</MenuItem>
                {cuisineOptions.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Budget Info - Use Price Range Filter in Sidebar */}
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: 2,
              border: '1px solid rgba(102, 126, 234, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}>
              <MoneyIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                💡 <strong>Tip:</strong> Use the <strong>Price Range</strong> filter in the sidebar to filter results by budget.
              </Typography>
            </Box>
          </Grid>

          {/* Location info - hidden field, always Phuket */}
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2.5, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}>
              <LocationIcon sx={{ color: 'white', fontSize: 28 }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                📍 This system focuses on restaurants in <strong style={{ fontSize: '1.1em' }}>Phuket</strong> (Location filter disabled)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            size="large"
            sx={{ px: 4 }}
          >
            {loading ? 'Searching...' : 'Search Restaurants'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={loading}
            size="large"
            sx={{ px: 4 }}
          >
            Clear
          </Button>
        </Box>

        {/* Quick Tips */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
            💡 Quick Tips:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Leave fields empty to search all restaurants in Phuket<br/>
            • All search results are limited to Phuket area<br/>
            • Use the Price Range filter in the sidebar to filter by budget
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickSearchForm;
