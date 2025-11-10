import React, { useEffect } from 'react';
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
function FitBounds({ restaurants, userLocation }) {
  const map = useMap();

  useEffect(() => {
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
      }
    } else {
      // Default to Phuket center if no restaurants
      map.setView([7.8804, 98.3923], 13);
    }
  }, [map, restaurants, userLocation]);

  return null;
}

const RestaurantMap = ({ restaurants = [], userLocation = null, showRadius = false }) => {
  // Default center to Phuket
  const defaultCenter = [7.8804, 98.3923];
  const defaultZoom = 13;
  const radiusKm = 5; // Radius in kilometers

  // Calculate restaurants within radius
  const restaurantsInRadius = React.useMemo(() => {
    if (!userLocation || !showRadius) return [];
    return restaurants.filter(restaurant => isWithinRadius(restaurant, userLocation, radiusKm));
  }, [restaurants, userLocation, showRadius]);

  // Debug: Log restaurants to verify data
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      console.log('🗺️ Map showing restaurants:', restaurants.length, restaurants.map(r => r.restaurantName || r.name));
      if (userLocation && showRadius) {
        console.log('📍 Restaurants within', radiusKm, 'km radius:', restaurantsInRadius.length);
      }
    }
  }, [restaurants, userLocation, showRadius, restaurantsInRadius.length]);

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
      {/* Map Header with Statistics */}
      {userLocation && showRadius && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            p: 1.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${restaurantsInRadius.length} ในรัศมี`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            <Chip
              label={`${restaurants.length - restaurantsInRadius.length} นอกรัศมี`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              ({radiusKm} km)
            </Typography>
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
        <FitBounds restaurants={restaurants} userLocation={userLocation} />
        
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
            
            {/* 5km radius circle */}
            {showRadius && (
              <Circle
                center={[userLocation.lat, userLocation.lon]}
                radius={5000} // 5km in meters
                pathOptions={{
                  color: '#667eea',
                  fillColor: '#667eea',
                  fillOpacity: 0.1,
                  weight: 2,
                }}
              >
                <Popup>
                  <Typography variant="body2">
                    5 km radius from your location
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

