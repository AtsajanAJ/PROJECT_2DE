# 🔍 Restaurant Search Feature - Complete Guide

## Overview
ระบบค้นหาร้านอาหารเป็นฟีเจอร์หลักของแอปพลิเคชันที่ช่วยให้ผู้ใช้ค้นหาร้านอาหารตามเกณฑ์ต่างๆ ได้อย่างยืดหยุ่นและแม่นยำ

---

## 🏗️ **Architecture Overview**

### **Frontend (React.js)**
- **Main Page**: `RestaurantSearch.js` - หน้าหลักสำหรับการค้นหา
- **Search Forms**: `AdvancedSearchForm.js`, `QuickSearchForm.js` - ฟอร์มสำหรับกรอกเกณฑ์การค้นหา
- **Results Display**: `SearchResults.js` - แสดงผลการค้นหา
- **API Service**: `RestaurantSearchAPI.js` - จัดการการเรียก API

### **Backend (Spring Boot)**
- **Controller**: `RestaurantController.java` - รับ request และส่ง response
- **Service**: `RestaurantService.java` - ตรรกะการค้นหาและประมวลผลข้อมูล
- **Data Source**: RDF Ontology (`RestaurantOntology_03_12_24.rdf`) - ฐานข้อมูลร้านอาหาร

---

## 🎯 **Search Types**

### **1. Advanced Search** 
**Endpoint**: `GET /api/restaurants/search/advanced`

**เกณฑ์การค้นหา**:
- **Restaurant Name**: ชื่อร้านอาหาร
- **Cuisine Type**: ประเภทอาหาร (25 ประเภท)
- **Restaurant Type**: ประเภทร้าน (13 ประเภท)
- **Location**: สถานที่
- **Nationality**: สัญชาติ
- **Budget Range**: ช่วงราคา (min-max)
- **Nutrition Levels**: ระดับสารอาหาร (Carb, Fat, Protein)
- **Runner Type**: ประเภทนักวิ่ง
- **Sorting**: เรียงลำดับตามเกณฑ์ต่างๆ

### **2. Quick Search**
**Endpoint**: `GET /api/restaurants/search`

**เกณฑ์การค้นหา**:
- **Cuisine Type**: ประเภทอาหาร
- **Location**: สถานที่
- **Max Budget**: ราคาสูงสุด

### **3. Nutrition Search**
**Endpoint**: `GET /api/restaurants/search/nutrition`

**เกณฑ์การค้นหา**:
- **Carb Level**: ระดับคาร์โบไฮเดรต
- **Fat Level**: ระดับไขมัน
- **Protein Level**: ระดับโปรตีน
- **Runner Type**: ประเภทนักวิ่ง

### **4. Budget Search**
**Endpoint**: `GET /api/restaurants/search/budget`

**เกณฑ์การค้นหา**:
- **Min Budget**: ราคาต่ำสุด
- **Max Budget**: ราคาสูงสุด
- **Sorting**: เรียงลำดับตามราคา

### **5. Browse All**
**Endpoint**: `GET /api/restaurants/all`

**ฟังก์ชัน**: แสดงร้านอาหารทั้งหมดในระบบ

---

## 🔄 **Search Process Flow**

### **1. User Input**
```
User fills search form → Frontend validates input → Sends API request
```

### **2. Backend Processing**
```
Controller receives request → Service processes criteria → Queries RDF ontology → Applies filters → Returns results
```

### **3. Results Display**
```
Backend returns JSON → Frontend displays cards → User can save/view details
```

---

## 🛠️ **Technical Implementation**

### **Frontend Architecture**

#### **1. RestaurantSearch.js (Main Page)**
```javascript
// State Management
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [activeTab, setActiveTab] = useState(0);

// Search Handlers
const handleAdvancedSearch = async (criteria) => {
  setLoading(true);
  const response = await RestaurantSearchAPI.searchRestaurantsAdvanced(criteria);
  setSearchResults(response.data);
  setLoading(false);
};

const handleBasicSearch = async (cuisineType, location, maxBudget) => {
  setLoading(true);
  const response = await RestaurantSearchAPI.searchRestaurants(cuisineType, location, maxBudget);
  setSearchResults(response.data);
  setLoading(false);
};
```

#### **2. RestaurantSearchAPI.js (API Service)**
```javascript
class RestaurantSearchAPI {
  // Advanced Search
  static async searchRestaurantsAdvanced(searchCriteria) {
    const params = new URLSearchParams();
    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE_URL}/restaurants/search/advanced?${params.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return await response.json();
  }

  // Error Handling
  static handleHttpError(response, errorMessage) {
    if (response.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    } else if (response.status === 429) {
      throw new Error('Too many requests');
    }
    // ... other error handling
  }
}
```

### **Backend Architecture**

#### **1. RestaurantController.java**
```java
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    
    @Autowired
    private RestaurantService restaurantService;

    @GetMapping("/search/advanced")
    public ResponseEntity<ApiResponse<List<Restaurant>>> searchRestaurantsAdvanced(
            @RequestParam(required = false) String restaurantName,
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false) String restaurantType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String nationality,
            @RequestParam(required = false, defaultValue = "0") float minBudget,
            @RequestParam(required = false, defaultValue = "0") float maxBudget,
            @RequestParam(required = false) String carbLevel,
            @RequestParam(required = false) String fatLevel,
            @RequestParam(required = false) String proteinLevel,
            @RequestParam(required = false) String runnerType,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {
        
        List<Restaurant> results = restaurantService.searchRestaurantsAdvanced(
            restaurantName, cuisineType, restaurantType, location, nationality,
            minBudget, maxBudget, carbLevel, fatLevel, proteinLevel, runnerType,
            sortBy, sortOrder);
        
        return ResponseEntity.ok(ApiResponse.success("Search completed", results));
    }
}
```

#### **2. RestaurantService.java**
```java
@Service
public class RestaurantService {
    
    // Advanced Search Implementation
    public List<Restaurant> searchRestaurantsAdvanced(String restaurantName, String cuisineType, 
                                                     String restaurantType, String location, String nationality,
                                                     float minBudget, float maxBudget, String carbLevel, 
                                                     String fatLevel, String proteinLevel, String runnerType,
                                                     String sortBy, String sortOrder) {
        
        List<Restaurant> results = new ArrayList<>();
        
        // Load RDF Ontology
        Model model = loadRestaurantOntology();
        
        // Query all restaurants
        StmtIterator restaurantIterator = model.listStatements(null, RDF.type, 
            model.createResource(NS + "Restaurant"));
        
        while (restaurantIterator.hasNext()) {
            Statement restaurantStmt = restaurantIterator.nextStatement();
            Resource restaurantResource = restaurantStmt.getSubject();
            
            Restaurant restaurant = convertToRestaurantModel(restaurantResource, model);
            if (restaurant != null) {
                // Check if restaurant matches search criteria
                if (matchesAdvancedSearchCriteria(restaurant, restaurantName, cuisineType, 
                                                 restaurantType, location, nationality, minBudget, maxBudget,
                                                 carbLevel, fatLevel, proteinLevel, runnerType)) {
                    results.add(restaurant);
                }
            }
        }
        
        // Sort results
        sortRestaurantResults(results, sortBy, sortOrder);
        
        return results;
    }
    
    // Criteria Matching Logic
    private boolean matchesAdvancedSearchCriteria(Restaurant restaurant, String restaurantName, 
                                                 String cuisineType, String restaurantType, String location, 
                                                 String nationality, float minBudget, float maxBudget,
                                                 String carbLevel, String fatLevel, String proteinLevel, 
                                                 String runnerType) {
        
        // Restaurant Name Matching (flexible)
        if (restaurantName != null && !restaurantName.trim().isEmpty()) {
            if (!restaurant.getRestaurantName().toLowerCase()
                .contains(restaurantName.toLowerCase().trim())) {
                return false;
            }
        }
        
        // Cuisine Type Matching (flexible)
        if (cuisineType != null && !cuisineType.trim().isEmpty()) {
            String restaurantCuisine = cleanUpCuisineLabel(restaurant.getCuisineType());
            if (!restaurantCuisine.toLowerCase().contains(cuisineType.toLowerCase().trim())) {
                return false;
            }
        }
        
        // Budget Range Matching
        if (minBudget > 0 && restaurant.getBudget() < minBudget) {
            return false;
        }
        if (maxBudget > 0 && restaurant.getBudget() > maxBudget) {
            return false;
        }
        
        // Nutrition Matching (exact)
        if (restaurant.getNutritionProfile() != null) {
            Restaurant.NutritionProfile nutrition = restaurant.getNutritionProfile();
            
            if (carbLevel != null && !carbLevel.trim().isEmpty()) {
                if (!nutrition.getCarbLevel().equalsIgnoreCase(carbLevel.trim())) {
                    return false;
                }
            }
            // ... similar for fat and protein
        }
        
        return true;
    }
}
```

---

## 🎨 **User Interface Features**

### **1. Modern Design**
- **Glassmorphism**: ใช้ backdrop blur และ transparency
- **Gradient Backgrounds**: พื้นหลังไล่สีสวยงาม
- **Responsive Design**: รองรับทุกขนาดหน้าจอ
- **Interactive Elements**: hover effects และ animations

### **2. Search Forms**
- **Advanced Search**: ฟอร์มครบถ้วนพร้อม accordion sections
- **Quick Search**: ฟอร์มง่ายๆ สำหรับการค้นหาพื้นฐาน
- **Browse All**: แสดงร้านอาหารทั้งหมด

### **3. Results Display**
- **Card Layout**: แสดงผลในรูปแบบการ์ด
- **Consistent Sizing**: การ์ดขนาดเท่ากัน
- **Nutrition Chips**: แสดงระดับสารอาหารด้วยสี
- **Action Buttons**: ปุ่ม Save และ View Details

---

## 🔍 **Search Criteria Details**

### **Cuisine Types (25 types)**
```
GrilledPork, Noodles, Burger, Steak, BubbleMilkTea, Breakfast, 
Shabu Sukiyaki, Sushi, ALaCarte, FastFood, Vegetarian Jay, 
Buffet, Omakase, Pizza, Seafood, Grill, IceCream, Dessert, 
Coffee, Tea, Korean, Chinese, Japanese, Thai, Western
```

### **Restaurant Types (13 types)**
```
Fine Dining, Casual Dining, Fast Food, Fast Casual, 
Buffet, Cafe, Bar, Pub, Food Truck, Street Food, 
Takeout, Delivery, Catering
```

### **Nutrition Levels**
```
Low, Medium, High
```

### **Runner Types**
```
Sprint, Marathon, Fun Run, Trail Running, Ultra Marathon
```

### **Sorting Options**
```
name, budget, rating, location, cuisineType, restaurantType
```

---

## 🚀 **Performance Features**

### **1. Rate Limiting**
- **IP-based limiting**: ป้องกันการเรียก API มากเกินไป
- **Different buckets**: แยกตามประเภท API
- **Configurable intervals**: ปรับได้ตามความต้องการ

### **2. Caching**
- **Frontend caching**: เก็บผลการค้นหาล่าสุด
- **State management**: จัดการ state อย่างมีประสิทธิภาพ

### **3. Error Handling**
- **Authentication errors**: จัดการ token หมดอายุ
- **Rate limit errors**: แสดงข้อความและ retry option
- **Network errors**: จัดการข้อผิดพลาดเครือข่าย

---

## 🔧 **Advanced Features**

### **1. Flexible Matching**
- **Partial matching**: ค้นหาชื่อร้านอาหารแบบบางส่วน
- **Case insensitive**: ไม่สนใจตัวพิมพ์เล็ก-ใหญ่
- **Special mappings**: จัดการกรณีพิเศษ (เช่น Japanese → Sushi)

### **2. Data Cleanup**
- **Label formatting**: แปลง URI เป็นชื่อที่อ่านได้
- **Consistent naming**: ทำให้ชื่อสอดคล้องกัน
- **Fallback values**: ค่าเริ่มต้นสำหรับข้อมูลที่หายไป

### **3. Debug Logging**
- **Search process**: แสดงขั้นตอนการค้นหา
- **Matching logic**: แสดงการเปรียบเทียบเกณฑ์
- **Performance metrics**: แสดงสถิติการค้นหา

---

## 📊 **Search Results Structure**

### **Restaurant Object**
```javascript
{
  restaurantId: "restaurant_123",
  restaurantName: "Sushi Master",
  cuisineType: "Japanese",
  restaurantType: "Fine Dining",
  location: "Sukhumvit, Bangkok",
  nationality: "Japanese",
  budget: 800.0,
  rating: 4.5,
  telephone: "+66 123 456 789",
  nutritionProfile: {
    carbLevel: "High",
    fatLevel: "Medium", 
    proteinLevel: "High"
  },
  matchedRules: ["Jena1", "Jena6"],
  matchScore: 0.85
}
```

---

## 🎯 **Use Cases**

### **1. Quick Search**
- ผู้ใช้ต้องการค้นหาอาหารญี่ปุ่นในราคาไม่เกิน 500 บาท
- ใช้ Quick Search: Cuisine = "Japanese", Max Budget = 500

### **2. Advanced Search**
- นักวิ่งมาราธอนต้องการอาหารโปรตีนสูงในย่านสุขุมวิท
- ใช้ Advanced Search: Runner Type = "Marathon", Protein Level = "High", Location = "Sukhumvit"

### **3. Budget Search**
- ผู้ใช้ต้องการหาร้านอาหารในงบ 300-800 บาท
- ใช้ Budget Search: Min Budget = 300, Max Budget = 800

### **4. Browse All**
- ผู้ใช้ต้องการดูร้านอาหารทั้งหมดในระบบ
- ใช้ Browse All: แสดงร้านอาหารทั้งหมด

---

## 🔮 **Future Enhancements**

### **1. AI-Powered Search**
- **Semantic search**: ค้นหาตามความหมาย
- **Recommendation engine**: แนะนำตามพฤติกรรม
- **Natural language**: ค้นหาด้วยประโยคธรรมชาติ

### **2. Advanced Filtering**
- **Distance-based**: ค้นหาตามระยะทาง
- **Time-based**: ค้นหาตามเวลาเปิด-ปิด
- **Availability**: ตรวจสอบที่นั่งว่าง

### **3. Personalization**
- **User preferences**: เก็บความชอบส่วนตัว
- **Search history**: ประวัติการค้นหา
- **Favorites**: ร้านอาหารที่ชอบ

---

## 📋 **API Endpoints Summary**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants/search/advanced` | Advanced search with multiple criteria |
| GET | `/api/restaurants/search` | Basic search (cuisine, location, budget) |
| GET | `/api/restaurants/search/nutrition` | Search by nutrition preferences |
| GET | `/api/restaurants/search/budget` | Search by budget range |
| GET | `/api/restaurants/all` | Get all restaurants |
| GET | `/api/restaurants/{id}` | Get restaurant by ID |
| POST | `/api/restaurants/recommendations` | Get personalized recommendations |
| GET | `/api/restaurants/health` | Health check |

---

## 🛠️ **Configuration**

### **Rate Limiting Settings**
```java
// RateLimitingFilter.java
private static final Map<String, Long> MIN_INTERVALS = Map.of(
    "auth", 1000L,        // 1 second for auth endpoints
    "recommendations", 2000L,  // 2 seconds for recommendations
    "general", 100L       // 100ms for general endpoints
);
```

### **Search Parameters**
```javascript
// Frontend configuration
const DEFAULT_SORT_OPTIONS = {
  sortBy: 'name',
  sortOrder: 'asc'
};

const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0 (Complete Search Feature Guide)
