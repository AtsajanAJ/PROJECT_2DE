// Service for managing saved restaurants and nutrition history
class UserDataService {
  constructor() {
    this.STORAGE_KEYS = {
      SAVED_RESTAURANTS: 'savedRestaurants',
      NUTRITION_HISTORY: 'nutritionHistory',
      USER_PROFILE: 'userProfile'
    };
  }

  // Saved Restaurants Methods
  getSavedRestaurants() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.SAVED_RESTAURANTS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved restaurants:', error);
      return [];
    }
  }

  saveRestaurant(restaurant) {
    try {
      const savedRestaurants = this.getSavedRestaurants();
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
      
      localStorage.setItem(this.STORAGE_KEYS.SAVED_RESTAURANTS, JSON.stringify(savedRestaurants));
      return true;
    } catch (error) {
      console.error('Error saving restaurant:', error);
      return false;
    }
  }

  removeRestaurant(restaurantId) {
    try {
      const savedRestaurants = this.getSavedRestaurants();
      const filtered = savedRestaurants.filter(r => r.id !== restaurantId);
      localStorage.setItem(this.STORAGE_KEYS.SAVED_RESTAURANTS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing restaurant:', error);
      return false;
    }
  }

  isRestaurantSaved(restaurantId) {
    const savedRestaurants = this.getSavedRestaurants();
    return savedRestaurants.some(r => r.id === restaurantId);
  }

  // Nutrition History Methods
  getNutritionHistory() {
    try {
      const history = localStorage.getItem(this.STORAGE_KEYS.NUTRITION_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading nutrition history:', error);
      return [];
    }
  }

  addNutritionEntry(entry) {
    try {
      const history = this.getNutritionHistory();
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
      localStorage.setItem(this.STORAGE_KEYS.NUTRITION_HISTORY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
      return false;
    }
  }

  removeNutritionEntry(entryId) {
    try {
      const history = this.getNutritionHistory();
      const filtered = history.filter(e => e.id !== entryId);
      localStorage.setItem(this.STORAGE_KEYS.NUTRITION_HISTORY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing nutrition entry:', error);
      return false;
    }
  }

  updateNutritionEntry(entryId, updates) {
    try {
      const history = this.getNutritionHistory();
      const index = history.findIndex(e => e.id === entryId);
      
      if (index >= 0) {
        history[index] = { ...history[index], ...updates };
        localStorage.setItem(this.STORAGE_KEYS.NUTRITION_HISTORY, JSON.stringify(history));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating nutrition entry:', error);
      return false;
    }
  }

  // User Profile Methods
  getUserProfile() {
    try {
      const profile = localStorage.getItem(this.STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  saveUserProfile(profile) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  // Utility Methods
  clearAllData() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  exportData() {
    try {
      const data = {
        savedRestaurants: this.getSavedRestaurants(),
        nutritionHistory: this.getNutritionHistory(),
        userProfile: this.getUserProfile(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
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

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.savedRestaurants) {
        localStorage.setItem(this.STORAGE_KEYS.SAVED_RESTAURANTS, JSON.stringify(data.savedRestaurants));
      }
      
      if (data.nutritionHistory) {
        localStorage.setItem(this.STORAGE_KEYS.NUTRITION_HISTORY, JSON.stringify(data.nutritionHistory));
      }
      
      if (data.userProfile) {
        localStorage.setItem(this.STORAGE_KEYS.USER_PROFILE, JSON.stringify(data.userProfile));
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
