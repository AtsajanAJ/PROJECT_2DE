import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Restaurant as RestaurantIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import { getRestaurantLocationCoordinates, getDistanceToRestaurant, isWithinRadius } from '../../utils/locationUtils';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for restaurants (default - red)
const restaurantIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for restaurants within radius (green)
const restaurantInRadiusIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for restaurants outside radius (red)
const restaurantOutOfRadiusIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to fit map bounds
function FitBounds({ restaurants, userLocation, shouldFitBounds }) {
  const map = useMap();
  const hasFittedBounds = useRef(false);

  useEffect(() => {
    // Only fit bounds when restaurants or userLocation change, not on every render
    if (shouldFitBounds && !hasFittedBounds.current) {
      if (restaurants && restaurants.length > 0) {
        const bounds = [];
        
        // Add restaurant markers
        restaurants.forEach(restaurant => {
          const coords = getRestaurantLocationCoordinates(restaurant);
          bounds.push([coords.lat, coords.lon]);
        });
        
        // Add user location if available
        if (userLocation) {
          bounds.push([userLocation.lat, userLocation.lon]);
        }
        
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
          hasFittedBounds.current = true;
        }
      } else {
        // Default to Phuket center if no restaurants
        map.setView([7.8804, 98.3923], 13);
        hasFittedBounds.current = true;
      }
    }
  }, [map, restaurants, userLocation, shouldFitBounds]);

  // Reset when restaurants or location actually change
  useEffect(() => {
    hasFittedBounds.current = false;
  }, [restaurants?.length, userLocation?.lat, userLocation?.lon]);

  return null;
}

const RestaurantMap = ({ restaurants = [], userLocation = null, showRadius = false, radiusKm = 5 }) => {
  // Default center to Phuket
  const defaultCenter = [7.8804, 98.3923];
  const defaultZoom = 13;
  const [shouldFitBounds, setShouldFitBounds] = useState(true);

  // Calculate restaurants within radius
  // Only calculate if userLocation is valid and showRadius is enabled
  const restaurantsInRadius = React.useMemo(() => {
    if (!showRadius) return [];
    
    // Validate userLocation before calculating
    if (!userLocation || 
        userLocation.lat == null || 
        userLocation.lon == null ||
        isNaN(userLocation.lat) || 
        isNaN(userLocation.lon) ||
        (userLocation.lat === 0 && userLocation.lon === 0)) {
      return []; // Return empty array if userLocation is invalid
    }
    
    return restaurants.filter(restaurant => isWithinRadius(restaurant, userLocation, radiusKm));
  }, [restaurants, userLocation, showRadius, radiusKm]);

  // Debug: Log restaurants to verify data
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      console.log('🗺️ Map showing restaurants:', restaurants.length, restaurants.map(r => r.restaurantName || r.name));
      if (userLocation && showRadius) {
        console.log('📍 Restaurants within', radiusKm, 'km radius:', restaurantsInRadius.length);
      }
    }
  }, [restaurants, userLocation, showRadius, radiusKm, restaurantsInRadius.length]);

  // Prevent fitBounds when only radius changes
  useEffect(() => {
    // Only allow fitBounds when restaurants or userLocation actually change
    setShouldFitBounds(true);
  }, [restaurants?.length, userLocation?.lat, userLocation?.lon]);

  return (
    <Paper
      sx={{
        height: '500px',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
      }}
    >
      {/* Map Header with Statistics - Moved to top right to avoid overlap with zoom controls */}
      {showRadius && userLocation && 
       userLocation.lat != null && 
       userLocation.lon != null &&
       !isNaN(userLocation.lat) && 
       !isNaN(userLocation.lon) &&
       !(userLocation.lat === 0 && userLocation.lon === 0) && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            left: { xs: 10, sm: 'auto' }, // On mobile, allow left positioning
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            p: 1,
            px: 1.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            minWidth: 'auto',
            maxWidth: 'fit-content',
          }}
        >
          {/* Statistics Chips - Compact horizontal layout */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'nowrap' }}>
            <Chip
              label={`${restaurantsInRadius.length} ในรัศมี`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '24px',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
            <Chip
              label={`${restaurants.length - restaurantsInRadius.length} นอกรัศมี`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '24px',
                '& .MuiChip-label': {
                  px: 1,
                },
              }}
            />
          </Box>
        </Box>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit bounds to show all markers */}
        <FitBounds restaurants={restaurants} userLocation={userLocation} shouldFitBounds={shouldFitBounds} />
        
        {/* User location marker */}
        {userLocation && (
          <>
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={userLocationIcon}
            >
              <Popup>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    <MyLocationIcon sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                    Your Location
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
            
            {/* Radius circle */}
            {showRadius && (
              <Circle
                key={`radius-circle-${radiusKm}`}
                center={[userLocation.lat, userLocation.lon]}
                radius={radiusKm * 1000} // Convert km to meters
                pathOptions={{
                  color: '#667eea',
                  fillColor: '#667eea',
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              >
                <Popup>
                  <Typography variant="body2">
                    {radiusKm} km radius from your location
                  </Typography>
                </Popup>
              </Circle>
            )}
          </>
        )}
        
        {/* Restaurant markers */}
        {restaurants.map((restaurant, index) => {
          const coords = getRestaurantLocationCoordinates(restaurant);
          const distance = userLocation ? getDistanceToRestaurant(restaurant, userLocation) : null;
          const withinRadius = userLocation && showRadius ? isWithinRadius(restaurant, userLocation, radiusKm) : null;
          
          // Choose icon based on radius status
          let markerIcon = restaurantIcon;
          if (withinRadius === true) {
            markerIcon = restaurantInRadiusIcon;
          } else if (withinRadius === false) {
            markerIcon = restaurantOutOfRadiusIcon;
          }
          
          return (
            <Marker
              key={restaurant.restaurantId || index}
              position={[coords.lat, coords.lon]}
              icon={markerIcon}
            >
              <Popup>
                <Box sx={{ minWidth: '200px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    <RestaurantIcon 
                      sx={{ 
                        fontSize: '1rem', 
                        verticalAlign: 'middle', 
                        mr: 0.5, 
                        color: withinRadius === true ? 'success.main' : 'error.main' 
                      }} 
                    />
                    {restaurant.restaurantName || restaurant.name || 'Unknown Restaurant'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {restaurant.location || 'Unknown Location'}
                  </Typography>
                  {restaurant.cuisineType && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Cuisine: {restaurant.cuisineType}
                    </Typography>
                  )}
                  {distance !== null && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        fontWeight: 600,
                        color: withinRadius === true ? 'success.main' : 'error.main'
                      }}
                    >
                      Distance: {distance.toFixed(2)} km
                    </Typography>
                  )}
                  {withinRadius !== null && (
                    <Chip
                      label={withinRadius ? `✅ อยู่ในรัศมี ${radiusKm} km` : `❌ นอกรัศมี ${radiusKm} km`}
                      size="small"
                      color={withinRadius ? 'success' : 'error'}
                      sx={{ 
                        mt: 0.5,
                        fontSize: '0.7rem',
                        height: 22,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {restaurant.budget && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Budget: ฿{restaurant.budget.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Paper>
  );
};

export default RestaurantMap;

