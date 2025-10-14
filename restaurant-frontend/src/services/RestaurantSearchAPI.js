import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api';

class RestaurantSearchAPI {
  // Handle rate limiting and other HTTP errors
  static handleHttpError(response, errorMessage) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Authentication required. Please login again.');
    } else if (response.status === 429) {
      // Rate limit exceeded
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else if (response.status === 404) {
      throw new Error('Resource not found.');
    } else if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(`${errorMessage}: ${response.status}`);
    }
  }

  // Get headers with JWT token
  static getHeaders() {
    const token = localStorage.getItem('jwt_token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Advanced search with multiple criteria
  static async searchRestaurantsAdvanced(searchCriteria) {
    try {
      const params = new URLSearchParams();
      
      // Add all non-null parameters to URL
      Object.entries(searchCriteria).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/restaurants/search/advanced?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw new Error(`Failed to search restaurants: ${error.message}`);
    }
  }

  // Basic search (backward compatibility)
  static async searchRestaurants(cuisineType, location, maxBudget) {
    try {
      const params = new URLSearchParams();
      
      if (cuisineType) params.append('cuisineType', cuisineType);
      if (location) params.append('location', location);
      if (maxBudget && maxBudget > 0) params.append('maxBudget', maxBudget);

      const response = await fetch(`${API_BASE_URL}/restaurants/search?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in basic search:', error);
      throw new Error(`Failed to search restaurants: ${error.message}`);
    }
  }

  // Search by nutrition preferences
  static async searchByNutrition(nutritionCriteria) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(nutritionCriteria).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/restaurants/search/nutrition?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in nutrition search:', error);
      throw new Error(`Failed to search by nutrition: ${error.message}`);
    }
  }

  // Search by budget range
  static async searchByBudget(minBudget, maxBudget, sortBy = 'budget', sortOrder = 'asc') {
    try {
      const params = new URLSearchParams();
      
      if (minBudget && minBudget > 0) params.append('minBudget', minBudget);
      if (maxBudget && maxBudget > 0) params.append('maxBudget', maxBudget);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);

      const response = await fetch(`${API_BASE_URL}/restaurants/search/budget?${params.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in budget search:', error);
      throw new Error(`Failed to search by budget: ${error.message}`);
    }
  }

  // Get all restaurants
  static async getAllRestaurants() {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/all`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting all restaurants:', error);
      throw new Error(`Failed to get restaurants: ${error.message}`);
    }
  }

  // Get restaurant by ID
  static async getRestaurantById(restaurantId) {
    try {
      const encodedId = encodeURIComponent(restaurantId);
      const response = await fetch(`${API_BASE_URL}/restaurants/${encodedId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Authentication required. Please login again.');
        }
        if (response.status === 404) {
          throw new Error('Restaurant not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting restaurant by ID:', error);
      throw new Error(`Failed to get restaurant: ${error.message}`);
    }
  }

  // Get restaurant recommendations
  static async getRecommendations(recommendationRequest) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/recommendations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(recommendationRequest),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        this.handleHttpError(response, 'Failed to search restaurants');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in health check:', error);
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

export default RestaurantSearchAPI;
