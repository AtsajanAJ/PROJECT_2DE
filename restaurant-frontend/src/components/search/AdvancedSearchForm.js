import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Restaurant as RestaurantIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  LocalDining as CuisineIcon,
  FitnessCenter as FitnessIcon,
} from '@mui/icons-material';

const AdvancedSearchForm = ({ onSearch, loading = false }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    restaurantName: '',
    cuisineType: '',
    restaurantType: '',
    location: 'Phuket', // Default location - project focuses on Phuket
    nationality: '',
    carbLevel: '',
    fatLevel: '',
    proteinLevel: '',
    runnerType: '',
  });

  // Complete cuisine types list (25 types)
  const cuisineTypes = [
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

  // Complete restaurant types list (13 types)
  const restaurantTypes = [
    'Fast Dining',
    'Casual Dining',
    'Fine Dining',
    'Buffet',
    'Street Food',
    'Cafe',
    'Food Court',
    'Food Truck',
    'Family Restaurant',
    'Bistro',
    'Pub',
    'Diner',
    'Kiosk'
  ];

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    nutrition: false,
  });

  const cuisineOptions = [
    'Japanese', 'Thai', 'Italian', 'Chinese', 'Korean', 'Mexican', 
    'Indian', 'French', 'American', 'Vietnamese', 'Mediterranean'
  ];

  const restaurantTypeOptions = [
    'Fast Dining', 'Casual Dining', 'Fine Dining', 'Buffet', 
    'Kiosk', 'Street Food', 'Cafe', 'Fast Food'
  ];

  const nutritionLevels = ['Low', 'Medium', 'High'];
  const runnerTypes = ['Fun run', 'Marathon', 'Sprint', '5K', '10K', 'Half Marathon'];

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Convert empty strings to null for API
    const criteria = Object.keys(searchCriteria).reduce((acc, key) => {
      // Skip location - project focuses on Phuket only, no need to send location parameter
      // Skip minBudget and maxBudget - these are handled by Price Range filter in SearchSidebar
      if (key === 'location' || key === 'minBudget' || key === 'maxBudget') return acc;
      
      const value = searchCriteria[key];
      acc[key] = value === '' ? null : value;
      return acc;
    }, {});


    onSearch(criteria);
  };

  const handleClear = () => {
    setSearchCriteria({
      restaurantName: '',
      cuisineType: '',
      restaurantType: '',
      location: 'Phuket', // Default location - project focuses on Phuket
      nationality: '',
      carbLevel: '',
      fatLevel: '',
      proteinLevel: '',
      runnerType: '',
    });
  };

  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(searchCriteria).filter(value => 
      value !== '' && value !== 'name' && value !== 'asc'
    ).length;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Advanced Search Filters
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

        {/* Basic Search Section */}
        <Accordion 
          expanded={expandedSections.basic} 
          onChange={() => handleSectionToggle('basic')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Basic Information</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Restaurant Name
                </Typography>
                <TextField
                  fullWidth
                  value={searchCriteria.restaurantName}
                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  placeholder="e.g., Sushi Master"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Cuisine Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.cuisineType}
                    onChange={(e) => handleInputChange('cuisineType', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="">Any Cuisine</MenuItem>
                    {cuisineTypes.map((cuisine) => (
                      <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Restaurant Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.restaurantType}
                    onChange={(e) => handleInputChange('restaurantType', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="">Any Type</MenuItem>
                    {restaurantTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>


              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Nationality
                </Typography>
                <TextField
                  fullWidth
                  value={searchCriteria.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="e.g., Japanese, Thai"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Budget Info - Use Price Range Filter in Sidebar */}
        <Box sx={{ 
          mt: 2, 
          mb: 2,
          p: 2.5, 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: 2,
          border: '1px solid rgba(102, 126, 234, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <MoneyIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            💡 <strong>Tip:</strong> Use the <strong>Price Range</strong> filter in the sidebar to filter results by budget after searching.
          </Typography>
        </Box>

        {/* Nutrition Section */}
        <Accordion 
          expanded={expandedSections.nutrition} 
          onChange={() => handleSectionToggle('nutrition')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FitnessIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Nutrition Profile</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Carbohydrates
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.carbLevel}
                    onChange={(e) => handleInputChange('carbLevel', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="">Any Level</MenuItem>
                    {nutritionLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Fat
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.fatLevel}
                    onChange={(e) => handleInputChange('fatLevel', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="">Any Level</MenuItem>
                    {nutritionLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Protein
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.proteinLevel}
                    onChange={(e) => handleInputChange('proteinLevel', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="">Any Level</MenuItem>
                    {nutritionLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Runner Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.runnerType}
                    onChange={(e) => handleInputChange('runnerType', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="">Any Runner Type</MenuItem>
                    {runnerTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Location Info - Phuket Only */}
        <Box sx={{ 
          mt: 2, 
          mb: 2,
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
            Clear All
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchForm;
