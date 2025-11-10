/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get coordinates for specific restaurants by name
 * For known restaurants, use exact coordinates
 */
const getRestaurantCoordinates = (restaurantName) => {
  const restaurantCoords = {
    'Hana Cafe': { lat: 7.8842, lon: 98.3889 }, // Talat Yai, Mueang Phuket
    'Hana cafe': { lat: 7.8842, lon: 98.3889 },
    'HanaCafe': { lat: 7.8842, lon: 98.3889 },
    'Royd': { lat: 7.8804, lon: 98.3923 }, // Mueang Phuket
    'LaGaetana': { lat: 7.8804, lon: 98.3923 },
    'OneChun': { lat: 7.8804, lon: 98.3923 },
    'DimsumHousePhuket': { lat: 7.8804, lon: 98.3923 },
    'GEWBURGER': { lat: 7.8804, lon: 98.3923 },
    'MahaShabu': { lat: 7.8804, lon: 98.3923 },
    'TaKhai': { lat: 7.8804, lon: 98.3923 },
    'WagyuSteakhouse': { lat: 7.8804, lon: 98.3923 },
    'KhruaOhm': { lat: 7.8804, lon: 98.3923 },
    'SuperDimsum': { lat: 7.8804, lon: 98.3923 },
    'OishiEaterium': { lat: 7.8847, lon: 98.3800 }, // Wichit
    'PhuketIzakaya&NoodleBar': { lat: 7.8847, lon: 98.3800 }, // Wichit
  };

  if (!restaurantName) return null;

  // Try exact match first
  if (restaurantCoords[restaurantName]) {
    return restaurantCoords[restaurantName];
  }

  // Try case-insensitive partial match
  const restaurantKey = Object.keys(restaurantCoords).find(key => 
    key.toLowerCase() === restaurantName.toLowerCase() ||
    restaurantName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(restaurantName.toLowerCase())
  );

  return restaurantKey ? restaurantCoords[restaurantKey] : null;
};

/**
 * Get coordinates for Phuket locations
 * Since restaurants don't have coordinates in the data, we'll use approximate coordinates
 * for Phuket districts
 */
export const getPhuketLocationCoordinates = (locationName, restaurantName = null) => {
  // First, try to get coordinates from restaurant name
  if (restaurantName) {
    const restaurantCoords = getRestaurantCoordinates(restaurantName);
    if (restaurantCoords) {
      return restaurantCoords;
    }
  }

  const locations = {
    'Mueang Phuket': { lat: 7.8804, lon: 98.3923 },
    'Phuket': { lat: 7.8804, lon: 98.3923 },
    'Wichit': { lat: 7.8847, lon: 98.3800 },
    'Kathu': { lat: 7.9167, lon: 98.3500 },
    'Talang': { lat: 8.0333, lon: 98.3000 },
    'Patong': { lat: 7.8961, lon: 98.2961 },
    'Karon': { lat: 7.8472, lon: 98.2981 },
    'Kamala': { lat: 7.9389, lon: 98.2764 },
    'Talat Yai': { lat: 7.8842, lon: 98.3889 }, // Subdistrict for Hana Cafe
    'Talat Yai, Mueang Phuket': { lat: 7.8842, lon: 98.3889 },
    // Default to Phuket city center if location not found
    'default': { lat: 7.8804, lon: 98.3923 },
  };

  if (!locationName) return locations.default;

  // Try to match location name (case insensitive, partial match)
  const locationKey = Object.keys(locations).find(key => 
    key.toLowerCase().includes(locationName.toLowerCase()) ||
    locationName.toLowerCase().includes(key.toLowerCase())
  );

  return locations[locationKey] || locations.default;
};

/**
 * Get restaurant coordinates - tries restaurant name first, then location
 */
export const getRestaurantLocationCoordinates = (restaurant) => {
  if (!restaurant) return { lat: 7.8804, lon: 98.3923 }; // Default Phuket center

  // ใช้ coordinates จาก backend ก่อน (ถ้ามี)
  if (restaurant.latitude != null && restaurant.longitude != null) {
    return { 
      lat: parseFloat(restaurant.latitude), 
      lon: parseFloat(restaurant.longitude) 
    };
  }

  // Fallback: ใช้ hardcoded coordinates
  const restaurantName = restaurant.restaurantName || restaurant.name || null;
  const location = restaurant.location || null;

  // Try restaurant name first
  const restaurantCoords = getRestaurantCoordinates(restaurantName);
  if (restaurantCoords) {
    return restaurantCoords;
  }

  // Fall back to location-based coordinates
  return getPhuketLocationCoordinates(location, restaurantName);
};

/**
 * Check if restaurant is within radius of user location
 * @param {Object} restaurant - Restaurant object
 * @param {Object} userLocation - { lat, lon }
 * @param {number} radiusKm - Radius in kilometers (default 5km)
 * @returns {boolean} True if restaurant is within radius
 */
export const isWithinRadius = (restaurant, userLocation, radiusKm = 5) => {
  if (!userLocation || !userLocation.lat || !userLocation.lon) {
    return true; // If no user location, show all restaurants
  }

  const restaurantCoords = getRestaurantLocationCoordinates(restaurant);
  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    restaurantCoords.lat,
    restaurantCoords.lon
  );

  return distance <= radiusKm;
};

/**
 * Get distance from user location to restaurant
 * @param {Object} restaurant - Restaurant object
 * @param {Object} userLocation - { lat, lon }
 * @returns {number|null} Distance in kilometers, or null if no user location
 */
export const getDistanceToRestaurant = (restaurant, userLocation) => {
  if (!userLocation || !userLocation.lat || !userLocation.lon) {
    return null;
  }

  const restaurantCoords = getRestaurantLocationCoordinates(restaurant);
  return calculateDistance(
    userLocation.lat,
    userLocation.lon,
    restaurantCoords.lat,
    restaurantCoords.lon
  );
};

