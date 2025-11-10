// Service for managing saved restaurants and nutrition history
class UserDataService {
  constructor() {
    this.STORAGE_KEYS = {
      SAVED_RESTAURANTS: 'savedRestaurants',
      NUTRITION_HISTORY: 'nutritionHistory',
      USER_PROFILE: 'userProfile'
    };
  }

  // Helper method to get user-specific storage key
  getUserKey(baseKey, userId) {
    if (!userId) {
      console.warn('UserDataService: userId is required for user-specific data');
      return baseKey;
    }
    return `${baseKey}_${userId}`;
  }

  // Saved Restaurants Methods
  getSavedRestaurants(userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.SAVED_RESTAURANTS, userId);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved restaurants:', error);
      return [];
    }
  }

  saveRestaurant(restaurant, userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.SAVED_RESTAURANTS, userId);
      const savedRestaurants = this.getSavedRestaurants(userId);
      const existingIndex = savedRestaurants.findIndex(r => r.id === restaurant.id);
      
      if (existingIndex >= 0) {
        // Update existing restaurant
        savedRestaurants[existingIndex] = {
          ...restaurant,
          savedDate: new Date().toISOString().split('T')[0],
          notes: restaurant.notes || ''
        };
      } else {
        // Add new restaurant
        savedRestaurants.push({
          ...restaurant,
          savedDate: new Date().toISOString().split('T')[0],
          notes: restaurant.notes || ''
        });
      }
      
      localStorage.setItem(key, JSON.stringify(savedRestaurants));
      return true;
    } catch (error) {
      console.error('Error saving restaurant:', error);
      return false;
    }
  }

  removeRestaurant(restaurantId, userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.SAVED_RESTAURANTS, userId);
      const savedRestaurants = this.getSavedRestaurants(userId);
      const filtered = savedRestaurants.filter(r => r.id !== restaurantId);
      localStorage.setItem(key, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing restaurant:', error);
      return false;
    }
  }

  isRestaurantSaved(restaurantId, userId) {
    const savedRestaurants = this.getSavedRestaurants(userId);
    return savedRestaurants.some(r => r.id === restaurantId);
  }

  // Nutrition History Methods
  getNutritionHistory(userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.NUTRITION_HISTORY, userId);
      const history = localStorage.getItem(key);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading nutrition history:', error);
      return [];
    }
  }

  addNutritionEntry(entry, userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.NUTRITION_HISTORY, userId);
      const history = this.getNutritionHistory(userId);
      const newEntry = {
        id: Date.now(), // Simple ID generation
        date: entry.date || new Date().toISOString().split('T')[0],
        restaurant: entry.restaurant,
        meal: entry.meal,
        calories: entry.calories,
        carbs: entry.carbs,
        protein: entry.protein,
        fat: entry.fat,
        notes: entry.notes || ''
      };
      
      history.unshift(newEntry); // Add to beginning of array
      localStorage.setItem(key, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
      return false;
    }
  }

  removeNutritionEntry(entryId, userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.NUTRITION_HISTORY, userId);
      const history = this.getNutritionHistory(userId);
      const filtered = history.filter(e => e.id !== entryId);
      localStorage.setItem(key, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing nutrition entry:', error);
      return false;
    }
  }

  updateNutritionEntry(entryId, updates, userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.NUTRITION_HISTORY, userId);
      const history = this.getNutritionHistory(userId);
      const index = history.findIndex(e => e.id === entryId);
      
      if (index >= 0) {
        history[index] = { ...history[index], ...updates };
        localStorage.setItem(key, JSON.stringify(history));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating nutrition entry:', error);
      return false;
    }
  }

  // User Profile Methods
  getUserProfile(userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.USER_PROFILE, userId);
      const profile = localStorage.getItem(key);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  saveUserProfile(profile, userId) {
    try {
      const key = this.getUserKey(this.STORAGE_KEYS.USER_PROFILE, userId);
      localStorage.setItem(key, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  // Utility Methods
  clearAllData(userId) {
    try {
      if (userId) {
        // Clear user-specific data
        Object.values(this.STORAGE_KEYS).forEach(baseKey => {
          const key = this.getUserKey(baseKey, userId);
          localStorage.removeItem(key);
        });
      } else {
        // Clear all data (legacy support)
        Object.values(this.STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
      }
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  exportData(userId) {
    try {
      const data = {
        savedRestaurants: this.getSavedRestaurants(userId),
        nutritionHistory: this.getNutritionHistory(userId),
        userProfile: this.getUserProfile(userId),
        exportDate: new Date().toISOString(),
        userId: userId
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${userId || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  }

  importData(jsonData, userId) {
    try {
      const data = JSON.parse(jsonData);
      const targetUserId = userId || data.userId;
      
      if (!targetUserId) {
        console.error('UserDataService: userId is required for importing data');
        return false;
      }
      
      if (data.savedRestaurants) {
        const key = this.getUserKey(this.STORAGE_KEYS.SAVED_RESTAURANTS, targetUserId);
        localStorage.setItem(key, JSON.stringify(data.savedRestaurants));
      }
      
      if (data.nutritionHistory) {
        const key = this.getUserKey(this.STORAGE_KEYS.NUTRITION_HISTORY, targetUserId);
        localStorage.setItem(key, JSON.stringify(data.nutritionHistory));
      }
      
      if (data.userProfile) {
        const key = this.getUserKey(this.STORAGE_KEYS.USER_PROFILE, targetUserId);
        localStorage.setItem(key, JSON.stringify(data.userProfile));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create singleton instance
const userDataService = new UserDataService();

export default userDataService;
