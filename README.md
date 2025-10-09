# Restaurant Recommendation System for Runners

A comprehensive full-stack application that provides intelligent restaurant recommendations based on runner preferences, nutrition needs, and budget constraints. The system features a modern React frontend with advanced authentication, security, and semantic reasoning capabilities powered by Spring Boot backend.

## 🏃‍♂️ Features

- **🔐 Authentication & Security**: JWT-based authentication with role-based access control
- **👥 User Management**: Complete user registration, login, and profile management
- **🍽️ Restaurant Recommendations**: AI-powered suggestions based on nutrition requirements and preferences
- **🧠 Semantic Reasoning**: Uses Apache Jena for RDF-based ontology reasoning
- **🥗 Nutrition Matching**: Matches restaurants based on pre/post-run nutrition needs
- **💰 Budget Filtering**: Smart budget-based filtering
- **🍜 Cuisine Preferences**: Personalized cuisine type recommendations
- **🏪 Restaurant Types**: Filter by dining style (Fast Dining, Casual Dining, Fine Dining, Kiosk)
- **⚡ Rate Limiting**: Built-in rate limiting for API protection
- **📊 API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **🎨 Modern UI/UX**: Beautiful, responsive React frontend with Material-UI
- **📱 Mobile Responsive**: Optimized for all device sizes
- **🔄 Real-time Updates**: Dynamic form validation and real-time feedback
- **🎯 Interactive Recommendations**: Visual restaurant cards with detailed information

## 🏗️ Architecture

### Backend Stack
- **Spring Boot 3.4.4** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - In-memory database for development
- **Apache Jena** - Semantic web and RDF processing
- **JWT** - JSON Web Token for authentication
- **Swagger/OpenAPI** - API documentation
- **Rate Limiting** - API protection and throttling

### Frontend Stack
- **React 19.1.1** - Modern JavaScript library
- **Material-UI (MUI) 7.3.1** - Component library and theming
- **React Router DOM 7.8.2** - Client-side routing
- **React Hook Form 7.62.0** - Form handling and validation
- **Yup 1.7.0** - Schema validation
- **Axios 1.11.0** - HTTP client for API communication
- **Emotion** - CSS-in-JS styling

### Project Structure

#### Backend (Spring Boot)
```
Project_1/
├── src/main/java/com/example/Project_1/
│   ├── config/                 # Configuration classes
│   │   ├── DatabaseConfig.java
│   │   ├── DataLoader.java
│   │   ├── RateLimitingConfig.java
│   │   ├── SecurityConfig.java
│   │   ├── SecurityDataLoader.java
│   │   ├── SwaggerConfig.java
│   │   └── WebServiceConfig.java
│   ├── controller/             # REST API controllers
│   │   ├── AuthController.java
│   │   ├── RestaurantController.java
│   │   └── UserController.java
│   ├── dto/                   # Data Transfer Objects
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── RestaurantRecommendationRequest.java
│   ├── exception/             # Custom exception classes
│   │   ├── GlobalExceptionHandler.java
│   │   ├── RestaurantNotFoundException.java
│   │   ├── UserAlreadyExistsException.java
│   │   └── UserNotFoundException.java
│   ├── model/                 # Entity models
│   │   ├── ApiResponse.java
│   │   ├── Restaurant.java
│   │   └── User.java
│   ├── repository/            # Data access layer
│   │   ├── RestaurantRepository.java
│   │   └── UserRepository.java
│   ├── security/              # Security components
│   │   ├── CustomUserDetailsService.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── RateLimitingFilter.java
│   ├── service/              # Business logic
│   │   ├── RestaurantService.java
│   │   └── UserService.java
│   └── util/                 # Utility classes
│       ├── JwtUtil.java
│       └── ValidationUtil.java
└── src/main/resources/
    ├── application.properties
    └── RestaurantOntology_03_12_24.rdf
```

#### Frontend (React)
```
restaurant-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ProtectedRoute.js
│   │   └── common/            # Shared components
│   │       ├── Header.js
│   │       └── Footer.js
│   ├── contexts/              # React Context
│   │   └── AuthContext.js
│   ├── pages/                 # Page components
│   │   ├── Home.js
│   │   ├── Recommendations.js
│   │   ├── RestaurantSearch.js
│   │   ├── RestaurantDetail.js
│   │   └── UserProfile.js
│   ├── App.js                 # Main App component
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Java 17 or higher**
- **Maven 3.6 or higher**
- **Node.js 16 or higher**
- **npm 8 or higher**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Project_2
   ```

2. **Backend Setup**
   ```bash
   cd Project_1
   mvn clean install
   mvn spring-boot:run
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd restaurant-frontend
   npm install
   npm start
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   - **H2 Console**: http://localhost:8080/h2-console
   - **Swagger UI**: http://localhost:8080/swagger-ui.html

### Database Configuration
The application uses H2 in-memory database by default. Configuration can be found in `application.properties`:
- Database URL: `jdbc:h2:mem:testdb;DB_CLOSE_ON_EXIT=FALSE`
- Username: `sa`
- Password: `password`
- H2 Console: Available at `/h2-console`

## 📚 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### 👥 User Management
- `GET /api/users` - Get all users (Protected)
- `GET /api/users/{userId}` - Get user by ID (Protected)
- `POST /api/users` - Create new user (Protected)
- `PUT /api/users/{userId}` - Update user (Protected)
- `DELETE /api/users/{userId}` - Delete user (Protected)
- `GET /api/users/type/{runnerType}` - Get users by runner type (Protected)
- `GET /api/users/budget/{maxBudget}` - Get users by budget range (Protected)

### 🍽️ Restaurant Management
- `GET /api/restaurants/all` - Get all restaurants (Public)
- `GET /api/restaurants/{restaurantId}` - Get restaurant by ID (Public)
- `POST /api/restaurants/recommendations` - Get personalized recommendations (Protected)
- `GET /api/restaurants/search` - Search restaurants by criteria (Public)
- `GET /api/restaurants/retrieveRestaurants` - Legacy recommendation endpoint (Protected)
- `GET /api/restaurants/createStaticUser` - Create test user (Protected)

### 🏥 Health Checks
- `GET /api/users/health` - User service health check (Public)
- `GET /api/restaurants/health` - Restaurant service health check (Public)

## 🔧 Configuration

### Application Properties
Key configuration options in `application.properties`:
- Server port: 8080
- Database: H2 in-memory with `DB_CLOSE_ON_EXIT=FALSE`
- JWT Secret: Configurable secret key for token generation
- JWT Expiration: 24 hours (86400000 ms)
- Logging: DEBUG level for development
- CORS: Enabled for localhost:3000
- Rate Limiting: Configurable request limits

### Sample Data
The application automatically loads sample data on startup:
- Sample users with different running preferences
- Sample restaurants with nutrition profiles
- Test data for development and testing

## 🧪 Testing

### API Testing
Use the provided Postman collections:
- `Postman_Collection.json` - Main API collection
- `Security_Postman_Collection.json` - Authentication endpoints
- `Quick_Test_Collection.json` - Quick test scenarios

### Unit Testing
```bash
mvn test
```

### Integration Testing
The application includes integration tests for all major components.

## 🎨 Frontend Development

### Available Scripts

In the `restaurant-frontend` directory, you can run:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

### Frontend Development Features

#### 🎨 **Theming**
- Custom Material-UI theme with modern design
- Consistent color palette and typography
- Responsive breakpoints for all devices
- Custom component styling

#### 🔧 **State Management**
- React Context for authentication state
- Local state management with React hooks
- Form state with React Hook Form
- API state management with Axios

#### 📱 **Responsive Design**
- Mobile-first approach
- Breakpoints: xs, sm, md, lg, xl
- Touch-friendly interface
- Optimized for all screen sizes

#### ⚡ **Performance Optimizations**
- Code splitting with React.lazy()
- Memoization with React.memo()
- Optimized re-renders
- Efficient form handling

### Frontend Architecture

#### **Component Structure**
```
src/
├── components/          # Reusable components
│   ├── auth/           # Authentication components
│   └── common/         # Shared components
├── contexts/           # React Context providers
├── pages/              # Page components
├── App.js              # Main application component
└── index.js            # Application entry point
```

#### **Routing Structure**
- `/` - Home page (public)
- `/login` - Login page (public)
- `/register` - Register page (public)
- `/recommendations` - Recommendations (protected)
- `/search` - Restaurant search (protected)
- `/restaurant/:id` - Restaurant details (protected)
- `/profile` - User profile (protected)

## 📖 Usage Examples

### Authentication Flow
1. **Register a new user**:
   ```bash
   POST /api/auth/register
   {
     "username": "runner123",
     "email": "runner@example.com",
     "password": "securePassword123"
   }
   ```

2. **Login to get JWT token**:
   ```bash
   POST /api/auth/login
   {
     "username": "runner123",
     "password": "securePassword123"
   }
   ```

3. **Use token in subsequent requests**:
   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

### Get Restaurant Recommendations
```bash
POST /api/restaurants/recommendations
Authorization: Bearer <your-jwt-token>
{
  "userId": "runner123",
  "runnerType": "Marathon",
  "maxBudget": 50.0,
  "preferredCuisines": ["Sushi", "Grilled"],
  "preferredRestaurantTypes": ["Fine Dining", "Casual Dining"],
  "preRunNutrition": {
    "carbLevel": "High",
    "fatLevel": "Low",
    "proteinLevel": "Medium"
  },
  "postRunNutrition": {
    "carbLevel": "High",
    "fatLevel": "Medium",
    "proteinLevel": "High"
  }
}
```

## 🎨 Frontend Features

### Pages & Components

#### 🏠 **Home Page**
- Welcome screen with application overview
- Quick access to main features
- Beautiful landing page design

#### 🔐 **Authentication**
- **Login Page**: User authentication with form validation
- **Register Page**: New user registration with real-time validation
- **Protected Routes**: Automatic redirection based on auth status

#### 🍽️ **Recommendations Page**
- **Interactive Form**: Multi-step form for preference input
- **Real-time Validation**: Instant feedback on form inputs
- **Visual Results**: Beautiful restaurant cards with:
  - Restaurant information and ratings
  - Nutrition profile visualization
  - Match score indicators
  - Interactive action buttons

#### 🔍 **Restaurant Search**
- Advanced search functionality
- Filter by multiple criteria
- Real-time search results

#### 👤 **User Profile**
- User information management
- Preference settings
- Account management

#### 🏪 **Restaurant Details**
- Detailed restaurant information
- Nutrition profile breakdown
- Contact and location details

### UI/UX Features

#### 🎨 **Modern Design**
- **Material-UI Components**: Consistent, accessible design
- **Custom Theme**: Modern color palette and typography
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: Hover effects and transitions

#### 📱 **Mobile Responsive**
- Mobile-first design approach
- Touch-friendly interface
- Optimized for mobile devices

#### ⚡ **Performance**
- **Code Splitting**: Optimized bundle loading
- **Lazy Loading**: Efficient resource management
- **Form Optimization**: React Hook Form for better performance

#### 🔄 **Real-time Features**
- **Form Validation**: Instant feedback with Yup schema validation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages

## 🔒 Security & Validation

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different access levels for different endpoints
- **Password Security**: Secure password handling and validation
- **Token Management**: Automatic token refresh and expiration handling

### Input Validation
- Comprehensive validation for all user inputs
- Sanitization of user data
- Nutrition level validation (Low/Medium/High)
- Budget range validation
- Cuisine type validation
- Email format validation
- Username uniqueness validation

### Rate Limiting
- **API Protection**: Built-in rate limiting to prevent abuse
- **Configurable Limits**: Adjustable request limits per endpoint
- **IP-based Throttling**: Rate limiting based on client IP
- **Graceful Degradation**: Proper error responses when limits exceeded

### Error Handling
- Custom exception classes
- Global exception handler
- Proper HTTP status codes
- Detailed error messages
- Security-aware error responses

## 📊 Data Models

### User Model
- **Authentication**: Username, email, password (hashed)
- **Profile**: User ID, runner type, budget preferences
- **Nutrition**: Pre/post-run nutrition requirements
- **Preferences**: Food type and restaurant type interests
- **Security**: Role-based access control

### Restaurant Model
- **Basic Info**: Name, location, cuisine type, restaurant type
- **Budget**: Price range and contact information
- **Nutrition Profile**: Carbohydrate, fat, protein levels (Low/Medium/High)
- **Matching**: Match score for recommendations
- **Ontology**: RDF-based semantic data integration

### Nutrition Profile
- **Carbohydrate levels**: Low/Medium/High
- **Fat levels**: Low/Medium/High
- **Protein levels**: Low/Medium/High
- **Semantic Matching**: RDF ontology-based nutrition matching

### Available Types

#### Runner Types
- Fun Run
- Mini Marathon
- Half Marathon
- Marathon
- Ultra Marathon
- Trail Run

#### Cuisine Types
- GrilledPork, Noodles, Burger, Steak, BubbleMilkTea
- Breakfast, Shabu Sukiyaki, Sushi, ALaCarte, FastFood
- Vegatarian Jay, Buffet, Omakase, Pizza, Seafood
- Grill, IceCream, VegatarianFood, DrinksJuice, OneDishMeal
- Dimsum, Dessert, Ramen, CleanFood Salad, Bakery Cake

#### Restaurant Types
- Fast Dining
- Casual Dining
- Fine Dining
- Kiosk

## 🌐 CORS Configuration
Cross-Origin Resource Sharing is configured for frontend integration:
- Allowed origins: http://localhost:3000
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: All

## 📝 Logging
Comprehensive logging configuration:
- Application-level logging: DEBUG
- SQL queries: DEBUG
- Jena framework: DEBUG
- Console pattern with timestamps

## 🚧 Development Notes

### Current Status
- ✅ **Backend**: Core functionality implemented
- ✅ **Backend**: Database layer with JPA
- ✅ **Backend**: Complete user management system
- ✅ **Backend**: Restaurant recommendation engine
- ✅ **Backend**: Semantic reasoning with Apache Jena
- ✅ **Backend**: JWT-based authentication system
- ✅ **Backend**: Role-based access control
- ✅ **Backend**: Rate limiting implementation
- ✅ **Backend**: Input validation and error handling
- ✅ **Backend**: API documentation with Swagger
- ✅ **Backend**: Sample data loader
- ✅ **Backend**: Security configuration
- ✅ **Backend**: CORS configuration for frontend
- ✅ **Frontend**: Complete React application
- ✅ **Frontend**: Modern Material-UI design
- ✅ **Frontend**: Authentication system integration
- ✅ **Frontend**: Interactive recommendation form
- ✅ **Frontend**: Responsive design
- ✅ **Frontend**: Real-time form validation
- ✅ **Frontend**: Beautiful restaurant cards
- ✅ **Frontend**: Protected routing
- ✅ **Frontend**: Context-based state management

### Future Enhancements
- [ ] **Frontend**: Advanced search filters UI
- [ ] **Frontend**: User dashboard and analytics
- [ ] **Frontend**: Dark mode theme
- [ ] **Frontend**: Progressive Web App (PWA)
- [ ] **Backend**: Caching layer (Redis)
- [ ] **Backend**: User preferences learning (ML)
- [ ] **Backend**: Performance optimization
- [ ] **Backend**: Production database support (PostgreSQL/MySQL)
- [ ] **DevOps**: Docker containerization
- [ ] **DevOps**: CI/CD pipeline
- [ ] **DevOps**: Monitoring and logging (ELK Stack)
- [ ] **API**: API versioning
- [ ] **Testing**: E2E testing with Cypress
- [ ] **Performance**: Frontend optimization and lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: admin@restaurant-recommendation.com
- Documentation: http://localhost:8080/swagger-ui.html
- Issues: Please use the GitHub issues page
