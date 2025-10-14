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
    location: '',
    maxBudget: '',
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
      location: searchCriteria.location || null,
      maxBudget: searchCriteria.maxBudget ? parseFloat(searchCriteria.maxBudget) : null,
    };
    onSearch(criteria.cuisineType, criteria.location, criteria.maxBudget);
  };

  const handleClear = () => {
    setSearchCriteria({
      cuisineType: '',
      location: '',
      maxBudget: '',
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
          Quickly find restaurants by cuisine, location, and budget
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

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              value={searchCriteria.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Bangkok, Sukhumvit"
              variant="outlined"
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Maximum Budget (฿)"
              type="number"
              value={searchCriteria.maxBudget}
              onChange={(e) => handleInputChange('maxBudget', e.target.value)}
              placeholder="e.g., 500"
              variant="outlined"
              inputProps={{ min: 0, step: 50 }}
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
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
            • Leave fields empty to search all restaurants<br/>
            • Use partial location names (e.g., "Sukhumvit" instead of full address)<br/>
            • Budget is in Thai Baht (฿)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickSearchForm;
