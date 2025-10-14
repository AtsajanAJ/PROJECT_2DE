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
    location: '',
    nationality: '',
    minBudget: '',
    maxBudget: '',
    carbLevel: '',
    fatLevel: '',
    proteinLevel: '',
    runnerType: '',
    sortBy: 'name',
    sortOrder: 'asc',
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
    budget: false,
    nutrition: false,
    sorting: false,
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
  const sortOptions = [
    { value: 'name', label: 'Restaurant Name' },
    { value: 'budget', label: 'Budget' },
    { value: 'cuisine', label: 'Cuisine Type' },
    { value: 'location', label: 'Location' },
    { value: 'type', label: 'Restaurant Type' },
  ];

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Convert empty strings to null for API
    const criteria = Object.keys(searchCriteria).reduce((acc, key) => {
      const value = searchCriteria[key];
      acc[key] = value === '' ? null : value;
      return acc;
    }, {});

    // Convert budget strings to numbers
    if (criteria.minBudget) criteria.minBudget = parseFloat(criteria.minBudget);
    if (criteria.maxBudget) criteria.maxBudget = parseFloat(criteria.maxBudget);

    onSearch(criteria);
  };

  const handleClear = () => {
    setSearchCriteria({
      restaurantName: '',
      cuisineType: '',
      restaurantType: '',
      location: '',
      nationality: '',
      minBudget: '',
      maxBudget: '',
      carbLevel: '',
      fatLevel: '',
      proteinLevel: '',
      runnerType: '',
      sortBy: 'name',
      sortOrder: 'asc',
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
                  Location
                </Typography>
                <TextField
                  fullWidth
                  value={searchCriteria.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Bangkok, Sukhumvit"
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

        {/* Budget Section */}
        <Accordion 
          expanded={expandedSections.budget} 
          onChange={() => handleSectionToggle('budget')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Budget Range</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Minimum Budget (฿)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={searchCriteria.minBudget}
                  onChange={(e) => handleInputChange('minBudget', e.target.value)}
                  placeholder="0"
                  variant="outlined"
                  inputProps={{ min: 0, step: 50 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Maximum Budget (฿)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={searchCriteria.maxBudget}
                  onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                  placeholder="1000"
                  variant="outlined"
                  inputProps={{ min: 0, step: 50 }}
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

        {/* Sorting Section */}
        <Accordion 
          expanded={expandedSections.sorting} 
          onChange={() => handleSectionToggle('sorting')}
          sx={{ mb: 3 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6">Sorting Options</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Sort By
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Typography variant="body1" sx={{ minWidth: 150, fontWeight: 500 }}>
                  Sort Order
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={searchCriteria.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    sx={{
                      borderRadius: '8px',
                    }}
                  >
                    <MenuItem value="asc">Ascending (A-Z, Low-High)</MenuItem>
                    <MenuItem value="desc">Descending (Z-A, High-Low)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

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
