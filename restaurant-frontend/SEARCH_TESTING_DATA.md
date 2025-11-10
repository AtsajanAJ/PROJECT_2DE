# 🧪 Search Testing Data Guide - Phuket Focus

## Overview
คู่มือข้อมูลสำหรับการเทส search feature แต่ละประเภท โฟกัสเฉพาะร้านอาหารในจังหวัดภูเก็ต พร้อมข้อมูลตัวอย่างและเกณฑ์การทดสอบ

---

## 📊 **Available Restaurant Data**

### **Restaurants in RDF Ontology (Phuket Only)**
จากข้อมูลใน `RestaurantOntology_03_12_24.rdf` มีร้านอาหารในภูเก็ตดังนี้:

1. **Royd** - Fine Dining (Mueang Phuket)
2. **LaGaetana** - Italian Restaurant (Mueang Phuket)
3. **OneChun** - Thai Restaurant (Mueang Phuket)
4. **DimsumHousePhuket** - Chinese Dimsum (Mueang Phuket)
5. **GEWBURGER** - Burger Restaurant (Mueang Phuket)
6. **MahaShabu** - Shabu Sukiyaki (Mueang Phuket)
7. **TaKhai** - Thai Restaurant (Mueang Phuket)
8. **WagyuSteakhouse** - Steak Restaurant (Mueang Phuket)
9. **KhruaOhm** - Thai Restaurant (Mueang Phuket)
10. **SuperDimsum** - Chinese Dimsum (Mueang Phuket)
11. **OishiEaterium** - Japanese Sushi (Wichit, Mueang Phuket)
12. **PhuketIzakaya&NoodleBar** - Japanese Izakaya (Wichit, Mueang Phuket)

### **Phuket Location Details**
- **Province**: Phuket
- **Main District**: Mueang Phuket
- **Subdistricts**: Wichit, และอื่นๆ
- **Focus Area**: ภูเก็ตเป็นเกาะที่มีร้านอาหารหลากหลายประเภท

### **Sample Data from DataLoader (Commented)**
```java
// Sample Users
User user1 = {
    userId: "user001",
    runnerType: "Marathon",
    budgetInterest: 500.0f,
    preRunNutrition: {carb: "Low", fat: "High", protein: "High"},
    postRunNutrition: {carb: "Low", fat: "High", protein: "High"},
    foodTypeInterests: ["Japanese", "Thai"],
    restaurantTypeInterests: ["Fast Dining", "Casual Dining"]
}

User user2 = {
    userId: "user002", 
    runnerType: "Sprint",
    budgetInterest: 300.0f,
    preRunNutrition: {carb: "High", fat: "Low", protein: "Medium"},
    postRunNutrition: {carb: "Medium", fat: "Low", protein: "High"},
    foodTypeInterests: ["Italian", "Mexican"],
    restaurantTypeInterests: ["Casual Dining"]
}

// Sample Restaurants (Phuket Focus)
Restaurant restaurant1 = {
    restaurantId: "rest001",
    restaurantName: "OishiEaterium",
    cuisineType: "Japanese",
    restaurantType: "Fine Dining",
    location: "Wichit, Mueang Phuket",
    nationality: "Japanese",
    budget: 800.0f,
    telephone: "076-609-038",
    nutritionProfile: {carbLevel: "Low", fatLevel: "High", proteinLevel: "High"}
}

Restaurant restaurant2 = {
    restaurantId: "rest002",
    restaurantName: "OneChun",
    cuisineType: "Thai",
    restaurantType: "Casual Dining", 
    location: "Mueang Phuket",
    nationality: "Thai",
    budget: 350.0f,
    telephone: "076-xxx-xxxx",
    nutritionProfile: {carbLevel: "Medium", fatLevel: "Medium", proteinLevel: "High"}
}

Restaurant restaurant3 = {
    restaurantId: "rest003",
    restaurantName: "LaGaetana",
    cuisineType: "Italian",
    restaurantType: "Fine Dining",
    location: "Mueang Phuket", 
    nationality: "Italian",
    budget: 1200.0f,
    telephone: "076-xxx-xxxx",
    nutritionProfile: {carbLevel: "High", fatLevel: "Medium", proteinLevel: "Medium"}
}
```

---

## 🔍 **Test Cases for Each Search Type**

### **1. Advanced Search Tests**

#### **Test Case 1: Restaurant Name Search**
```javascript
// Input
{
  restaurantName: "Oishi",
  cuisineType: "",
  restaurantType: "",
  location: "",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants with "Oishi" in name
- Examples: "OishiEaterium" (Japanese Sushi in Wichit, Phuket)
```

#### **Test Case 2: Cuisine Type Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "Sushi",
  restaurantType: "",
  location: "",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find Sushi restaurants in Phuket
- Examples: "OishiEaterium", "PhuketIzakaya&NoodleBar"

// Alternative Test Cases:
// cuisineType: "Burger" → "GEWBURGER"
// cuisineType: "Steak" → "WagyuSteakhouse"
// cuisineType: "Shabu Sukiyaki" → "MahaShabu"
// cuisineType: "Dimsum" → "DimsumHousePhuket", "SuperDimsum"
// cuisineType: "Noodles" → "OneChun" (if serves noodles)
```

#### **Test Case 3: Restaurant Type Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "Fine Dining",
  location: "",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find Fine Dining restaurants
- Examples: "Royd", "WagyuSteakhouse"
```

#### **Test Case 4: Location Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "",
  location: "Phuket",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants in Phuket
- Examples: All 12 restaurants listed above (Royd, LaGaetana, OneChun, etc.)
```

#### **Test Case 4b: Specific District Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "",
  location: "Wichit",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants in Wichit subdistrict
- Examples: "OishiEaterium", "PhuketIzakaya&NoodleBar"
```

#### **Test Case 5: Budget Range Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "",
  location: "",
  nationality: "",
  minBudget: 300,
  maxBudget: 800,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "budget",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants with budget 300-800 baht in Phuket
- Examples: "OneChun" (350), "OishiEaterium" (800)
```

#### **Test Case 6: Nutrition Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "",
  location: "",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "High",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants with High carb level
- Examples: "Pizza Palace" (High carb)
```

#### **Test Case 7: Runner Type Search**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "",
  location: "",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "Marathon",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants suitable for Marathon runners
- Based on nutrition profile matching
```

#### **Test Case 8: Combined Criteria Search (Phuket Focus)**
```javascript
// Input
{
  restaurantName: "",
  cuisineType: "Noodles",
  restaurantType: "Casual Dining",
  location: "Phuket",
  nationality: "Thai",
  minBudget: 200,
  maxBudget: 500,
  carbLevel: "Medium",x
  fatLevel: "Medium",
  proteinLevel: "High",
  runnerType: "Marathon",
  sortBy: "budget",
  sortOrder: "asc"
}

// Expected Results
- Should find Noodle Casual Dining restaurants in Phuket
- Budget 200-500 baht, Medium carb/fat, High protein
- Suitable for Marathon runners
- Example: "OneChun" (if serves noodles and matches all criteria)

// Alternative Test Case: Burger + Budget Search
{
  restaurantName: "",
  cuisineType: "Burger",
  restaurantType: "Fast Food",
  location: "Phuket",
  nationality: "American",
  minBudget: 200,
  maxBudget: 500,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "budget",
  sortOrder: "asc"
}
// Expected: "GEWBURGER" (if under 500)
```

---

### **2. Quick Search Tests**

#### **Test Case 1: Cuisine Only**
```javascript
// Input
{
  cuisineType: "Sushi",
  location: "",
  maxBudget: 0
}

// Expected Results
- Should find all Sushi restaurants in Phuket
- Examples: "OishiEaterium", "PhuketIzakaya&NoodleBar"
```

#### **Test Case 1b: Other Cuisine Types**
```javascript
// Test Case: Thai Cuisine
{
  cuisineType: "Noodles",
  location: "",
  maxBudget: 0
}
// Expected: Thai noodle restaurants like "OneChun"

// Test Case: Burger Cuisine
{
  cuisineType: "Burger",
  location: "",
  maxBudget: 0
}
// Expected: "GEWBURGER"

// Test Case: Steak Cuisine
{
  cuisineType: "Steak",
  location: "",
  maxBudget: 0
}
// Expected: "WagyuSteakhouse"

// Test Case: Shabu Sukiyaki
{
  cuisineType: "Shabu Sukiyaki",
  location: "",
  maxBudget: 0
}
// Expected: "MahaShabu"

// Test Case: Dimsum
{
  cuisineType: "Dimsum",
  location: "",
  maxBudget: 0
}
// Expected: "DimsumHousePhuket", "SuperDimsum"
```

#### **Test Case 2: Location Only**
```javascript
// Input
{
  cuisineType: "",
  location: "Phuket", 
  maxBudget: 0
}

// Expected Results
- Should find all restaurants in Phuket
- Examples: All 12 restaurants (Royd, LaGaetana, OneChun, etc.)
```

#### **Test Case 3: Budget Only**
```javascript
// Input
{
  cuisineType: "",
  location: "",
  maxBudget: 500
}

// Expected Results
- Should find restaurants under 500 baht in Phuket
- Examples: "OneChun" (350), "GEWBURGER" (if under 500)
```

#### **Test Case 4: Combined Quick Search**
```javascript
// Input
{
  cuisineType: "Noodles",
  location: "Phuket",
  maxBudget: 500
}

// Expected Results
- Should find noodle restaurants in Phuket under 500 baht
- Example: "OneChun" (if serves noodles and under 500)

// Alternative Test Case: Burger + Phuket + Budget
{
  cuisineType: "Burger",
  location: "Phuket",
  maxBudget: 500
}
// Expected: "GEWBURGER" (if under 500)
```

---

### **3. Nutrition Search Tests**

#### **Test Case 1: High Protein Search**
```javascript
// Input
{
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "High",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants with High protein
- Examples: "Sushi Master", "Thai Spice"
```

#### **Test Case 2: Low Carb Search**
```javascript
// Input
{
  carbLevel: "Low",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants with Low carb
- Examples: "Sushi Master"
```

#### **Test Case 3: Medium Fat Search**
```javascript
// Input
{
  carbLevel: "",
  fatLevel: "Medium",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants with Medium fat
- Examples: "Thai Spice", "Pizza Palace"
```

#### **Test Case 4: Marathon Runner Nutrition**
```javascript
// Input
{
  carbLevel: "Low",
  fatLevel: "High", 
  proteinLevel: "High",
  runnerType: "Marathon",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants suitable for Marathon runners
- Low carb, High fat, High protein
- Example: "Sushi Master"
```

---

### **4. Budget Search Tests**

#### **Test Case 1: Low Budget Range**
```javascript
// Input
{
  minBudget: 0,
  maxBudget: 400,
  sortBy: "budget",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants under 400 baht in Phuket
- Example: "OneChun" (350)
```

#### **Test Case 2: Medium Budget Range**
```javascript
// Input
{
  minBudget: 400,
  maxBudget: 800,
  sortBy: "budget",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants 400-800 baht in Phuket
- Example: "OishiEaterium" (800)
```

#### **Test Case 3: High Budget Range**
```javascript
// Input
{
  minBudget: 800,
  maxBudget: 1500,
  sortBy: "budget",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants 800-1500 baht in Phuket
- Examples: "LaGaetana" (1200), "Royd", "WagyuSteakhouse"
```

#### **Test Case 4: Specific Budget Range**
```javascript
// Input
{
  minBudget: 300,
  maxBudget: 800,
  sortBy: "budget",
  sortOrder: "asc"
}

// Expected Results
- Should find restaurants 300-800 baht in Phuket
- Examples: "OneChun" (350), "OishiEaterium" (800)
```

---

### **5. Browse All Tests**

#### **Test Case 1: Load All Restaurants**
```javascript
// Input
// No parameters - just call getAllRestaurants()

// Expected Results
- Should return all restaurants in the system
- Should be sorted by name (default)
- Should include all restaurant types and cuisines
```

#### **Test Case 2: Verify Data Completeness**
```javascript
// Check each restaurant has:
- restaurantId
- restaurantName
- cuisineType
- restaurantType
- location
- nationality
- budget
- nutritionProfile (carbLevel, fatLevel, proteinLevel)
- telephone
```

---

## 🎯 **Test Scenarios for Edge Cases**

### **1. Empty Search Tests**
```javascript
// Test Case: Empty Advanced Search
{
  restaurantName: "",
  cuisineType: "",
  restaurantType: "",
  location: "",
  nationality: "",
  minBudget: 0,
  maxBudget: 0,
  carbLevel: "",
  fatLevel: "",
  proteinLevel: "",
  runnerType: "",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected: Should return all restaurants (same as Browse All)
```

### **2. No Results Tests**
```javascript
// Test Case: Impossible Criteria
{
  restaurantName: "NonExistentRestaurant",
  cuisineType: "NonExistentCuisine",
  restaurantType: "NonExistentType",
  location: "NonExistentLocation",
  nationality: "NonExistentNationality",
  minBudget: 10000,
  maxBudget: 20000,
  carbLevel: "NonExistent",
  fatLevel: "NonExistent",
  proteinLevel: "NonExistent",
  runnerType: "NonExistentRunner",
  sortBy: "name",
  sortOrder: "asc"
}

// Expected: Should return empty array with success message
```

### **3. Partial Match Tests**
```javascript
// Test Case: Partial Name Match
{
  restaurantName: "Sushi", // Should match "Sushi Master"
  // Other fields empty
}

// Test Case: Partial Cuisine Match
{
  cuisineType: "Japan", // Should match "Japanese"
  // Other fields empty
}

// Test Case: Partial Location Match
{
  location: "Bangk", // Should match "Bangkok"
  // Other fields empty
}
```

### **4. Sorting Tests**
```javascript
// Test Case: Sort by Name Ascending
{
  sortBy: "name",
  sortOrder: "asc"
}

// Test Case: Sort by Name Descending
{
  sortBy: "name", 
  sortOrder: "desc"
}

// Test Case: Sort by Budget Ascending
{
  sortBy: "budget",
  sortOrder: "asc"
}

// Test Case: Sort by Budget Descending
{
  sortBy: "budget",
  sortOrder: "desc"
}
```

---

## 🔧 **API Testing Commands**

### **1. Advanced Search API Tests (Phuket Focus)**
```bash
# Test 1: Restaurant Name Search
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?restaurantName=Oishi" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 2: Cuisine Type Search
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Sushi" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 2b: Other Cuisine Types
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Burger" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Steak" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Shabu Sukiyaki" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Dimsum" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 3: Budget Range Search
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?minBudget=300&maxBudget=800" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 4: Location Search (Phuket)
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?location=Phuket" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 5: Specific District Search
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?location=Wichit" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 6: Combined Search
curl -X GET "http://localhost:8080/api/restaurants/search/advanced?cuisineType=Thai&location=Phuket&maxBudget=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **2. Quick Search API Tests**
```bash
# Test 1: Cuisine Only
curl -X GET "http://localhost:8080/api/restaurants/search?cuisineType=Sushi" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 1b: Other Cuisine Types
curl -X GET "http://localhost:8080/api/restaurants/search?cuisineType=Burger" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:8080/api/restaurants/search?cuisineType=Noodles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:8080/api/restaurants/search?cuisineType=Steak" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 2: Location Only (Phuket)
curl -X GET "http://localhost:8080/api/restaurants/search?location=Phuket" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 3: Budget Only
curl -X GET "http://localhost:8080/api/restaurants/search?maxBudget=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 4: Combined Quick Search
curl -X GET "http://localhost:8080/api/restaurants/search?cuisineType=Noodles&location=Phuket&maxBudget=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 4b: Alternative Combined Search
curl -X GET "http://localhost:8080/api/restaurants/search?cuisineType=Burger&location=Phuket&maxBudget=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **3. Nutrition Search API Tests**
```bash
# Test 1: High Protein
curl -X GET "http://localhost:8080/api/restaurants/search/nutrition?proteinLevel=High" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 2: Low Carb
curl -X GET "http://localhost:8080/api/restaurants/search/nutrition?carbLevel=Low" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 3: Marathon Runner
curl -X GET "http://localhost:8080/api/restaurants/search/nutrition?carbLevel=Low&fatLevel=High&proteinLevel=High&runnerType=Marathon" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **4. Budget Search API Tests**
```bash
# Test 1: Low Budget
curl -X GET "http://localhost:8080/api/restaurants/search/budget?maxBudget=300" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 2: Medium Budget
curl -X GET "http://localhost:8080/api/restaurants/search/budget?minBudget=300&maxBudget=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test 3: High Budget
curl -X GET "http://localhost:8080/api/restaurants/search/budget?minBudget=500" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **5. Browse All API Test**
```bash
# Test: Get All Restaurants
curl -X GET "http://localhost:8080/api/restaurants/all" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📋 **Frontend Testing Steps**

### **1. Advanced Search Form Testing**
1. Open Search Page
2. Click "Advanced Search" tab
3. Fill in search criteria:
   - Restaurant Name: "Oishi"
   - Cuisine Type: "Sushi"
   - Restaurant Type: "Fine Dining"
   - Location: "Phuket"
   - Min Budget: 300
   - Max Budget: 800
   - Carb Level: "Low"
   - Fat Level: "High"
   - Protein Level: "High"
   - Runner Type: "Marathon"
4. Click "Search" button
5. Verify results match criteria
6. Test sorting options
7. Test clear form functionality

### **2. Quick Search Form Testing**
1. Click "Quick Search" tab
2. Fill in basic criteria:
   - Cuisine Type: "Noodles"
   - Location: "Phuket"
   - Max Budget: 500
3. Click "Search" button
4. Verify results match criteria
5. Test individual field searches
6. Test empty search (should return all)

### **3. Browse All Testing**
1. Click "Browse All" tab
2. Verify all restaurants are loaded
3. Check restaurant cards display correctly
4. Test save functionality
5. Test view details functionality
6. Verify consistent card sizes

### **4. Error Handling Testing**
1. Test with invalid JWT token (should redirect to login)
2. Test with expired token (should show auth error)
3. Test rate limiting (should show rate limit alert)
4. Test network errors (should show error message)
5. Test empty results (should show "no results" message)

---

## 🎯 **Expected Results Summary**

### **Search Results Should Include:**
- Restaurant ID
- Restaurant Name
- Cuisine Type
- Restaurant Type
- Location
- Nationality
- Budget
- Rating
- Telephone
- Nutrition Profile (Carb, Fat, Protein levels)
- Matched Rules (if applicable)
- Match Score (if applicable)

### **Response Format:**
```json
{
  "success": true,
  "message": "Found X restaurant(s) matching your criteria",
  "data": [
    {
      "restaurantId": "rest001",
      "restaurantName": "Sushi Master",
      "cuisineType": "Japanese",
      "restaurantType": "Fast Dining",
      "location": "Bangkok",
      "nationality": "Japanese",
      "budget": 450.0,
      "rating": 4.5,
      "telephone": "02-123-4567",
      "nutritionProfile": {
        "carbLevel": "Low",
        "fatLevel": "High",
        "proteinLevel": "High"
      },
      "matchedRules": ["Jena1", "Jena6"],
      "matchScore": 0.85
    }
  ]
}
```

---

## 🚀 **Performance Testing**

### **1. Response Time Tests**
- Advanced Search: Should complete within 2 seconds
- Quick Search: Should complete within 1 second
- Browse All: Should complete within 3 seconds
- Nutrition Search: Should complete within 2 seconds
- Budget Search: Should complete within 1 second

### **2. Load Testing**
- Test with multiple concurrent requests
- Test rate limiting behavior
- Test memory usage with large result sets
- Test pagination (if implemented)

### **3. Data Consistency Tests**
- Verify all restaurants have required fields
- Check nutrition profile completeness
- Validate budget ranges
- Ensure location data accuracy

---

---

## 🍽️ **Additional Cuisine Type Test Cases**

### **Test Cases for All Available Cuisine Types**
```javascript
// Test Case: GrilledPork
{
  cuisineType: "GrilledPork",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: BubbleMilkTea
{
  cuisineType: "BubbleMilkTea",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Breakfast
{
  cuisineType: "Breakfast",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: ALaCarte
{
  cuisineType: "ALaCarte",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Vegetarian Jay
{
  cuisineType: "Vegetarian Jay",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Buffet
{
  cuisineType: "Buffet",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Omakase
{
  cuisineType: "Omakase",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Pizza
{
  cuisineType: "Pizza",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Seafood
{
  cuisineType: "Seafood",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Grill
{
  cuisineType: "Grill",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: IceCream
{
  cuisineType: "IceCream",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: VegetarianFood
{
  cuisineType: "VegetarianFood",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: DrinksJuice
{
  cuisineType: "DrinksJuice",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: OneDishMeal
{
  cuisineType: "OneDishMeal",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Dessert
{
  cuisineType: "Dessert",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Ramen
{
  cuisineType: "Ramen",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: CleanFood Salad
{
  cuisineType: "CleanFood Salad",
  location: "Phuket",
  maxBudget: 0
}

// Test Case: Bakery Cake
{
  cuisineType: "Bakery Cake",
  location: "Phuket",
  maxBudget: 0
}
```

---

## 🏝️ **Phuket-Specific Testing Notes**

### **Location Hierarchy**
- **Province**: Phuket
- **Main District**: Mueang Phuket
- **Subdistricts**: Wichit, และอื่นๆ
- **Search Terms**: "Phuket", "Mueang Phuket", "Wichit"

### **Restaurant Distribution by Area**
- **Wichit Subdistrict**: OishiEaterium, PhuketIzakaya&NoodleBar
- **Mueang Phuket**: Royd, LaGaetana, OneChun, DimsumHousePhuket, GEWBURGER, MahaShabu, TaKhai, WagyuSteakhouse, KhruaOhm, SuperDimsum

### **Budget Ranges in Phuket**
- **Budget-Friendly (0-400)**: OneChun (350)
- **Mid-Range (400-800)**: OishiEaterium (800)
- **High-End (800+)**: LaGaetana (1200), Royd, WagyuSteakhouse

### **Cuisine Types Available (Based on Quick Search Menu)**
- **Any Cuisine**: All restaurants
- **GrilledPork**: Available in Phuket
- **Noodles**: OneChun (Thai noodles)
- **Burger**: GEWBURGER
- **Steak**: WagyuSteakhouse
- **BubbleMilkTea**: Available in Phuket
- **Breakfast**: Available in Phuket
- **Shabu Sukiyaki**: MahaShabu
- **Sushi**: OishiEaterium, PhuketIzakaya&NoodleBar
- **ALaCarte**: Available in Phuket
- **FastFood**: GEWBURGER
- **Vegetarian Jay**: Available in Phuket
- **Buffet**: Available in Phuket
- **Omakase**: Available in Phuket
- **Pizza**: Available in Phuket
- **Seafood**: Available in Phuket
- **Grill**: Available in Phuket
- **IceCream**: Available in Phuket
- **VegetarianFood**: Available in Phuket
- **DrinksJuice**: Available in Phuket
- **OneDishMeal**: Available in Phuket
- **Dimsum**: DimsumHousePhuket, SuperDimsum
- **Dessert**: Available in Phuket
- **Ramen**: Available in Phuket
- **CleanFood Salad**: Available in Phuket
- **Bakery Cake**: Available in Phuket

---

**Last Updated**: December 2024  
**Version**: 1.2.0 (Phuket-Focused Search Testing Data Guide with Complete Cuisine Types)
