# Restaurant Search Frontend

## Overview
This frontend application provides comprehensive restaurant search functionality with multiple search modes and advanced filtering capabilities.

## Features

### 🔍 Advanced Search
- **Multiple Criteria**: Search by restaurant name, cuisine type, restaurant type, location, nationality
- **Budget Range**: Set minimum and maximum budget limits
- **Nutrition Profile**: Filter by carbohydrate, fat, and protein levels
- **Runner Type**: Search based on runner preferences (Marathon, Sprint, etc.)
- **Sorting Options**: Sort by name, budget, cuisine, location, or restaurant type
- **Sort Order**: Ascending or descending order

### ⚡ Quick Search
- **Simple Interface**: Quick search by cuisine type, location, and maximum budget
- **User-Friendly**: Streamlined form for common search needs
- **Fast Results**: Optimized for quick restaurant discovery

### 📋 Browse All
- **Complete List**: View all available restaurants
- **No Filters**: Browse without any search criteria
- **Full Database**: Access to entire restaurant collection

## Components

### 1. AdvancedSearchForm
**Location**: `src/components/search/AdvancedSearchForm.js`

**Features**:
- Collapsible sections for organized filtering
- Real-time filter count display
- Comprehensive form validation
- Clear all functionality

**Props**:
- `onSearch`: Function to handle search execution
- `loading`: Boolean to show loading state

### 2. QuickSearchForm
**Location**: `src/components/search/QuickSearchForm.js`

**Features**:
- Simplified search interface
- Three main criteria: cuisine, location, budget
- Quick tips for better search results
- Responsive design

**Props**:
- `onSearch`: Function to handle search execution
- `loading`: Boolean to show loading state

### 3. SearchResults
**Location**: `src/components/search/SearchResults.js`

**Features**:
- Grid layout for restaurant cards
- Detailed restaurant information display
- Nutrition profile visualization
- Match score indicators
- Responsive design
- Empty state handling
- Error state management

**Props**:
- `results`: Array of restaurant objects
- `loading`: Boolean for loading state
- `error`: Error message string
- `searchCriteria`: Object containing search parameters

## API Service

### RestaurantSearchAPI
**Location**: `src/services/RestaurantSearchAPI.js`

**Methods**:

#### `searchRestaurantsAdvanced(criteria)`
Advanced search with multiple criteria
- **Parameters**: Object with all search criteria
- **Returns**: Promise with search results

#### `searchRestaurants(cuisineType, location, maxBudget)`
Basic search functionality
- **Parameters**: Individual search parameters
- **Returns**: Promise with search results

#### `searchByNutrition(nutritionCriteria)`
Search by nutrition preferences
- **Parameters**: Object with nutrition criteria
- **Returns**: Promise with matching restaurants

#### `searchByBudget(minBudget, maxBudget, sortBy, sortOrder)`
Search by budget range
- **Parameters**: Budget limits and sorting options
- **Returns**: Promise with filtered results

#### `getAllRestaurants()`
Get all available restaurants
- **Returns**: Promise with complete restaurant list

#### `getRestaurantById(restaurantId)`
Get specific restaurant details
- **Parameters**: Restaurant ID
- **Returns**: Promise with restaurant details

## Usage Examples

### Advanced Search
```javascript
const searchCriteria = {
  restaurantName: 'Sushi',
  cuisineType: 'Japanese',
  restaurantType: 'Fine Dining',
  location: 'Bangkok',
  minBudget: 300,
  maxBudget: 800,
  carbLevel: 'Low',
  fatLevel: 'Medium',
  proteinLevel: 'High',
  runnerType: 'Marathon',
  sortBy: 'budget',
  sortOrder: 'asc'
};

const results = await RestaurantSearchAPI.searchRestaurantsAdvanced(searchCriteria);
```

### Quick Search
```javascript
const results = await RestaurantSearchAPI.searchRestaurants(
  'Japanese',  // cuisineType
  'Bangkok',   // location
  500          // maxBudget
);
```

### Nutrition Search
```javascript
const nutritionCriteria = {
  carbLevel: 'Low',
  fatLevel: 'Medium',
  proteinLevel: 'High',
  runnerType: 'Marathon'
};

const results = await RestaurantSearchAPI.searchByNutrition(nutritionCriteria);
```

## Search Criteria Options

### Cuisine Types
- Japanese, Thai, Italian, Chinese, Korean, Mexican
- Indian, French, American, Vietnamese, Mediterranean

### Restaurant Types
- Fast Dining, Casual Dining, Fine Dining, Buffet
- Kiosk, Street Food, Cafe, Fast Food

### Nutrition Levels
- Low, Medium, High

### Runner Types
- Fun run, Marathon, Sprint, 5K, 10K, Half Marathon

### Sort Options
- name: Restaurant Name
- budget: Budget Amount
- cuisine: Cuisine Type
- location: Location
- type: Restaurant Type

### Sort Orders
- asc: Ascending (A-Z, Low-High)
- desc: Descending (Z-A, High-Low)

## UI/UX Features

### Loading States
- Spinner animations during search
- Disabled buttons during loading
- Loading messages for user feedback

### Error Handling
- Comprehensive error messages
- Graceful error recovery
- User-friendly error displays

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Flexible grid layouts

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

### User Feedback
- Snackbar notifications
- Success/error messages
- Progress indicators
- Filter count displays

## Integration

### Backend API Endpoints
- `GET /api/restaurants/search/advanced` - Advanced search
- `GET /api/restaurants/search` - Basic search
- `GET /api/restaurants/search/nutrition` - Nutrition search
- `GET /api/restaurants/search/budget` - Budget search
- `GET /api/restaurants/all` - All restaurants
- `GET /api/restaurants/{id}` - Restaurant details

### State Management
- React hooks for local state
- Context API for global state
- Async state handling

### Routing
- React Router for navigation
- Protected routes for authenticated users
- Dynamic routing for restaurant details

## Development

### Prerequisites
- Node.js 16+
- React 18+
- Material-UI 5+
- React Router 6+

### Installation
```bash
npm install
```

### Development Server
```bash
npm start
```

### Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## Future Enhancements

### Planned Features
- [ ] Search history
- [ ] Favorite restaurants
- [ ] Search suggestions
- [ ] Map integration
- [ ] Advanced filters (ratings, reviews)
- [ ] Export search results
- [ ] Search analytics
- [ ] Personalized recommendations

### Performance Optimizations
- [ ] Virtual scrolling for large result sets
- [ ] Search result caching
- [ ] Lazy loading of images
- [ ] Debounced search input
- [ ] Progressive web app features
