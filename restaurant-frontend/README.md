# 🏃‍♂️ Runner's Restaurant Guide - Frontend

A modern React.js frontend for the Restaurant Recommendation System designed specifically for runners.

## 🚀 **Features**

### **✅ Implemented:**
- **Responsive Design**: Mobile-first approach with Material-UI
- **Navigation**: Header with mobile drawer navigation
- **Home Page**: Hero section with feature cards
- **Recommendations**: Complete form for user preferences and results display
- **Routing**: React Router for navigation between pages
- **Form Handling**: React Hook Form with Yup validation
- **UI Components**: Material-UI components with custom theme

### **🔄 Coming Soon:**
- Restaurant Search functionality
- Restaurant Detail pages
- User Profile management
- Advanced filtering and sorting
- Favorites system
- User authentication

## 🛠️ **Tech Stack**

- **Framework**: React.js 18
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Yup validation
- **Styling**: Material-UI system + CSS-in-JS
- **HTTP Client**: Fetch API (native)
- **Build Tool**: Create React App

## 📁 **Project Structure**

```
src/
├── components/
│   └── common/
│       ├── Header.js          # Navigation header with mobile drawer
│       └── Footer.js          # Footer component
├── pages/
│   ├── Home.js               # Landing page with hero and features
│   ├── Recommendations.js    # Main recommendations form and results
│   ├── RestaurantSearch.js   # Search functionality (placeholder)
│   ├── RestaurantDetail.js   # Restaurant details (placeholder)
│   └── UserProfile.js        # User management (placeholder)
├── App.js                    # Main app with routing and theme
└── index.js                  # Entry point
```

## 🚀 **Getting Started**

### **Prerequisites:**
- Node.js 16+ and npm
- Backend running on `http://localhost:8080`

### **Installation:**
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### **Build for Production:**
```bash
npm run build
```

## 🔧 **Configuration**

### **Backend API:**
The frontend is configured to connect to your Spring Boot backend at:
- **Base URL**: `http://localhost:8080/api`
- **CORS**: Ensure your backend allows requests from `http://localhost:3000`

### **Environment Variables:**
Create `.env` file in the root directory:
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

## 🎨 **UI/UX Features**

### **Responsive Design:**
- **Mobile**: 320px - 768px (mobile-first)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Theme:**
- **Primary Color**: Blue (#1976d2)
- **Secondary Color**: Pink (#dc004e)
- **Typography**: Roboto font family
- **Spacing**: Consistent 8px grid system

### **Components:**
- **Cards**: Hover effects and shadows
- **Forms**: Validation with error messages
- **Navigation**: Active state indicators
- **Loading States**: Spinners and skeleton screens

## 📱 **Mobile Experience**

- **Touch-Friendly**: Large touch targets
- **Drawer Navigation**: Hamburger menu for mobile
- **Responsive Grid**: Adapts to screen size
- **Optimized Forms**: Mobile-friendly input fields

## 🔌 **API Integration**

### **Endpoints Used:**
- `POST /restaurants/recommendations` - Get personalized recommendations
- `GET /restaurants/all` - Get all restaurants
- `GET /restaurants/{id}` - Get restaurant by ID
- `GET /restaurants/search` - Search restaurants
- `GET /users` - User management

### **Data Flow:**
1. User fills out preferences form
2. Form data is validated with Yup
3. Data is sent to backend API
4. Results are displayed with match scores
5. Error handling for failed requests

## 🧪 **Testing**

### **Run Tests:**
```bash
npm test
```

### **Test Coverage:**
```bash
npm run test:coverage
```

## 🚀 **Deployment**

### **Build:**
```bash
npm run build
```

### **Deploy to:**
- **Netlify**: Drag and drop `build` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload `build` folder
- **Firebase**: Use Firebase CLI

## 🔮 **Future Enhancements**

### **Phase 2:**
- User authentication and profiles
- Restaurant search with filters
- Detailed restaurant pages
- User reviews and ratings

### **Phase 3:**
- Advanced analytics dashboard
- Nutrition tracking
- Social features
- Mobile app (React Native)

### **Phase 4:**
- AI-powered recommendations
- Integration with fitness apps
- Real-time updates
- Multi-language support

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **CORS Error**: Ensure backend allows `localhost:3000`
2. **API Connection**: Check if backend is running on port 8080
3. **Build Errors**: Clear `node_modules` and reinstall
4. **Port Conflicts**: Change port in package.json scripts

### **Debug Mode:**
```bash
# Enable debug logging
REACT_APP_DEBUG=true npm start
```

## 📚 **Resources**

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Happy Running! 🏃‍♂️🍽️**
