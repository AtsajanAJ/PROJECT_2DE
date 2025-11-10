import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Divider,
  Chip,
  IconButton,
  Collapse,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import {
  Sort as SortIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';

const SearchSidebar = ({ 
  onSortChange, 
  onFilterChange, 
  sortBy, 
  sortOrder,
  priceRange,
  minRating,
  resultCount,
  useLocationFilter,
  userLocation,
  onLocationFilterChange,
  onGetUserLocation
}) => {
  const [expanded, setExpanded] = useState(true);
  const [localSortBy, setLocalSortBy] = useState(sortBy || 'none');
  const [localSortOrder, setLocalSortOrder] = useState(sortOrder || 'asc');
  const [localPriceRange, setLocalPriceRange] = useState(priceRange || [0, 10000]);
  const [localMinRating, setLocalMinRating] = useState(minRating || 0);
  const [localUseLocationFilter, setLocalUseLocationFilter] = useState(useLocationFilter || false);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    setLocalSortBy(sortBy || 'none');
    setLocalSortOrder(sortOrder || 'asc');
    setLocalUseLocationFilter(useLocationFilter || false);
  }, [sortBy, sortOrder, useLocationFilter]);

  const handleSortByChange = (event) => {
    const newSortBy = event.target.value;
    setLocalSortBy(newSortBy);
    if (onSortChange) {
      onSortChange(newSortBy, localSortOrder);
    }
  };

  const handleSortOrderChange = (event) => {
    const newSortOrder = event.target.value;
    setLocalSortOrder(newSortOrder);
    if (onSortChange) {
      onSortChange(localSortBy, newSortOrder);
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    setLocalPriceRange(newValue);
    if (onFilterChange) {
      onFilterChange({
        priceRange: newValue,
        minRating: localMinRating,
      });
    }
  };

  const handleMinRatingChange = (event, newValue) => {
    setLocalMinRating(newValue);
    if (onFilterChange) {
      onFilterChange({
        priceRange: localPriceRange,
        minRating: newValue,
      });
    }
  };

  const handleLocationToggle = (event) => {
    const enabled = event.target.checked;
    setLocalUseLocationFilter(enabled);
    
    if (enabled && !userLocation) {
      // Get user location if not available
      handleGetUserLocation();
    }
    
    if (onLocationFilterChange) {
      onLocationFilterChange(enabled);
    }
  };

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        
        if (onGetUserLocation) {
          onGetUserLocation(location);
        }
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enable location services.');
        setLocalUseLocationFilter(false);
        if (onLocationFilterChange) {
          onLocationFilterChange(false);
        }
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleReset = () => {
    setLocalSortBy('none');
    setLocalSortOrder('asc');
    setLocalPriceRange([0, 10000]);
    setLocalMinRating(0);
    setLocalUseLocationFilter(false);
    
    if (onSortChange) {
      onSortChange('none', 'asc');
    }
    if (onFilterChange) {
      onFilterChange({
        priceRange: [0, 10000],
        minRating: 0,
      });
    }
    if (onLocationFilterChange) {
      onLocationFilterChange(false);
    }
  };

  const hasActiveFilters = localSortBy !== 'none' || 
                          localPriceRange[0] !== 0 || 
                          localPriceRange[1] !== 10000 || 
                          localMinRating > 0 ||
                          localUseLocationFilter;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'sticky',
        top: 20,
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <FilterIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Filter & Sort
            </Typography>
            {hasActiveFilters && (
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Active filters applied
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.1)',
            }
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Results Count */}
      {resultCount !== undefined && (
        <Box sx={{ mb: 3, p: 2, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', borderRadius: '12px' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Showing Results
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {resultCount}
          </Typography>
        </Box>
      )}

      <Collapse in={expanded}>
        {/* Sort Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SortIcon sx={{ fontSize: '1.2rem', color: localSortBy !== 'none' ? 'primary.main' : 'text.secondary' }} />
            Sort By
            {localSortBy !== 'none' && (
              <Chip 
                label="Active" 
                size="small" 
                sx={{ 
                  ml: 'auto', 
                  height: 20, 
                  fontSize: '0.65rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }} 
              />
            )}
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={localSortBy}
              label="Sort By"
              onChange={handleSortByChange}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="none">No Sorting</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="matchScore">Match Score</MenuItem>
            </Select>
          </FormControl>

          {localSortBy !== 'none' && (
            <FormControl fullWidth>
              <InputLabel id="sort-order-label">Order</InputLabel>
              <Select
                labelId="sort-order-label"
                id="sort-order-select"
                value={localSortOrder}
                label="Order"
                onChange={handleSortOrderChange}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="asc">
                  {localSortBy === 'price' ? 'Low to High' : 
                   localSortBy === 'rating' ? 'Low to High' :
                   localSortBy === 'matchScore' ? 'Low to High' :
                   'A to Z'}
                </MenuItem>
                <MenuItem value="desc">
                  {localSortBy === 'price' ? 'High to Low' : 
                   localSortBy === 'rating' ? 'High to Low' :
                   localSortBy === 'matchScore' ? 'High to Low' :
                   'Z to A'}
                </MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Filter Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon sx={{ fontSize: '1.2rem', color: hasActiveFilters ? 'primary.main' : 'text.secondary' }} />
            Filters
            {hasActiveFilters && (
              <Chip 
                label="Active" 
                size="small" 
                sx={{ 
                  ml: 'auto', 
                  height: 20, 
                  fontSize: '0.65rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }} 
              />
            )}
          </Typography>

          {/* Price Range Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Price Range (฿)
            </Typography>
            <Slider
              value={localPriceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              valueLabelFormat={(value) => `฿${value}`}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Chip 
                label={`฿${localPriceRange[0]}`} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
              <Chip 
                label={`฿${localPriceRange[1]}`} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Box>

          {/* Rating Filter */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Minimum Rating
            </Typography>
            <Slider
              value={localMinRating}
              onChange={handleMinRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
              marks={[
                { value: 0, label: '0' },
                { value: 2.5, label: '2.5' },
                { value: 5, label: '5' },
              ]}
              sx={{
                color: 'warning.main',
                '& .MuiSlider-thumb': {
                  '&:hover': {
                    boxShadow: '0 0 0 8px rgba(255, 152, 0, 0.16)',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Chip 
                label={`${localMinRating} ⭐`} 
                size="small" 
                color="warning"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Box>

          {/* Location Filter */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon sx={{ fontSize: '1rem' }} />
              Nearby Restaurants
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={localUseLocationFilter}
                  onChange={handleLocationToggle}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    Within 5 km radius
                  </Typography>
                  {gettingLocation && (
                    <CircularProgress size={16} />
                  )}
                </Box>
              }
            />
            {localUseLocationFilter && (
              <Box sx={{ mt: 2, p: 2, background: 'rgba(102, 126, 234, 0.05)', borderRadius: '8px' }}>
                {userLocation ? (
                  <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MyLocationIcon sx={{ fontSize: '0.875rem' }} />
                    Location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Click to get your current location
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<MyLocationIcon />}
                      onClick={handleGetUserLocation}
                      disabled={gettingLocation}
                      sx={{ borderRadius: '8px' }}
                    >
                      {gettingLocation ? 'Getting Location...' : 'Get My Location'}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<ClearIcon />}
            onClick={handleReset}
            sx={{
              borderRadius: '12px',
              py: 1.5,
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                borderColor: 'error.dark',
                background: 'rgba(211, 47, 47, 0.1)',
              }
            }}
          >
            Reset All Filters
          </Button>
        )}
      </Collapse>
    </Paper>
  );
};

export default SearchSidebar;

