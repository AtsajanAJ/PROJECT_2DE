# 🔐 Authentication Error Fix Guide

## Problem: HTTP 401 Error
**Error Message**: `Failed to search restaurants: HTTP error! status: 401`

## What This Means
The 401 error indicates that the API request is missing authentication credentials (JWT token). This happens when:
- User is not logged in
- JWT token has expired
- Token is invalid or corrupted

## ✅ Solution Steps

### 1. **Check Login Status**
- Make sure you are logged in to the application
- Check if you can see your username in the header
- If not logged in, go to `/login` page

### 2. **Login Process**
1. Navigate to the Login page
2. Enter your username and password
3. Click "Login" button
4. You should see a success message
5. You should be redirected to the main page

### 3. **If Already Logged In**
- Try refreshing the page (F5)
- Clear browser cache and cookies
- Logout and login again

### 4. **Backend Requirements**
Make sure the backend server is running:
```bash
# In Project_1 directory
mvn spring-boot:run
```

### 5. **API Endpoint Check**
Verify the API endpoints are accessible:
- `GET /api/restaurants/health` - Should return 200
- `GET /api/restaurants/all` - Should return 401 if not authenticated

## 🔧 Technical Details

### Frontend Changes Made
1. **JWT Token Integration**: All API calls now include JWT token in headers
2. **Authentication Error Handling**: Proper 401 error detection and handling
3. **Auto-redirect**: Automatic redirect to login page on authentication failure
4. **User Feedback**: Clear error messages and retry options

### API Service Updates
```javascript
// Before (causing 401 error)
headers: {
  'Content-Type': 'application/json',
}

// After (with JWT token)
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

### Error Handling Flow
1. API call fails with 401
2. Frontend detects authentication error
3. Clears stored tokens
4. Redirects to login page
5. Shows user-friendly error message

## 🚀 Testing the Fix

### 1. **Login Test**
```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### 2. **Search Test (with token)**
```bash
# Test search with JWT token
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Japanese" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. **Frontend Test**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try to search restaurants
4. Check if requests include `Authorization: Bearer` header

## 📱 User Experience Improvements

### Before Fix
- ❌ Cryptic 401 error messages
- ❌ No guidance on how to fix
- ❌ Users stuck on error page

### After Fix
- ✅ Clear authentication required message
- ✅ Direct link to login page
- ✅ Retry functionality
- ✅ Automatic token refresh handling

## 🔍 Debugging Tips

### Check Browser Console
Look for these messages:
- `Authentication required. Please login again.`
- `JWT token not found`
- `Token validation failed`

### Check Network Tab
- Look for 401 status codes
- Verify Authorization header is present
- Check if token is being sent correctly

### Check Local Storage
```javascript
// In browser console
console.log('JWT Token:', localStorage.getItem('jwt_token'));
console.log('User Data:', localStorage.getItem('user'));
```

## 🎯 Expected Behavior After Fix

1. **Logged In Users**: Can search restaurants normally
2. **Not Logged In Users**: See authentication alert with login button
3. **Expired Tokens**: Automatic redirect to login page
4. **Network Errors**: Clear error messages with retry options

## 📞 Support

If you continue to experience issues:
1. Check browser console for detailed error messages
2. Verify backend server is running on port 8080
3. Ensure JWT token is being generated correctly
4. Check network connectivity between frontend and backend

---

**Last Updated**: December 2024  
**Version**: 1.0.0
