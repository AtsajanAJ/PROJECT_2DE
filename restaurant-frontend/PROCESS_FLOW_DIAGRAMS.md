# 🔄 Restaurant Search System - Process Flow Diagram

## Complete System Architecture Flow

```mermaid
graph TB
    %% User Interface Layer
    subgraph "Frontend Layer (React.js)"
        A[User Opens Search Page] --> B{Choose Search Type}
        B -->|Advanced| C[Advanced Search Form]
        B -->|Quick| D[Quick Search Form]
        B -->|Browse All| E[Browse All Button]
        
        C --> F[Fill Search Criteria]
        D --> G[Fill Basic Criteria]
        E --> H[Load All Restaurants]
        
        F --> I[Submit Advanced Search]
        G --> J[Submit Quick Search]
        H --> K[Call GetAll API]
    end

    %% API Layer
    subgraph "API Service Layer"
        I --> L[RestaurantSearchAPI.searchRestaurantsAdvanced]
        J --> M[RestaurantSearchAPI.searchRestaurants]
        K --> N[RestaurantSearchAPI.getAllRestaurants]
        
        L --> O[Build Query Parameters]
        M --> P[Build Basic Parameters]
        N --> Q[Call Backend API]
        
        O --> R[Send HTTP Request with JWT Token]
        P --> R
        Q --> R
    end

    %% Backend Layer
    subgraph "Backend Layer (Spring Boot)"
        R --> S{Rate Limiting Check}
        S -->|Pass| T[RestaurantController]
        S -->|Fail| U[Return 429 Error]
        
        T --> V{Route Request}
        V -->|Advanced| W[searchRestaurantsAdvanced]
        V -->|Basic| X[searchRestaurants]
        V -->|All| Y[getAllRestaurants]
        
        W --> Z[RestaurantService.searchRestaurantsAdvanced]
        X --> AA[RestaurantService.searchRestaurants]
        Y --> BB[RestaurantService.getAllRestaurants]
    end

    %% Data Processing Layer
    subgraph "Data Processing Layer"
        Z --> CC[Load RDF Ontology]
        AA --> CC
        BB --> CC
        
        CC --> DD[Query Restaurant Resources]
        DD --> EE[Convert RDF to Restaurant Objects]
        EE --> FF[Apply Search Filters]
        
        FF --> GG{Matches Criteria?}
        GG -->|Yes| HH[Add to Results]
        GG -->|No| II[Skip Restaurant]
        
        HH --> JJ[Continue Processing]
        II --> JJ
        JJ --> KK{More Restaurants?}
        KK -->|Yes| DD
        KK -->|No| LL[Sort Results]
    end

    %% Response Layer
    subgraph "Response Processing"
        LL --> MM[Create ApiResponse]
        MM --> NN[Return JSON Response]
        NN --> OO[Frontend Receives Data]
        
        OO --> PP[Update Search Results State]
        PP --> QQ[Display Restaurant Cards]
        QQ --> RR[User Sees Results]
    end

    %% Error Handling
    subgraph "Error Handling"
        U --> SS[Show Rate Limit Alert]
        TT[Authentication Error] --> UU[Redirect to Login]
        VV[Network Error] --> WW[Show Error Message]
    end

    %% User Actions
    subgraph "User Actions on Results"
        RR --> XX{User Action}
        XX -->|Save| YY[Save Restaurant to LocalStorage]
        XX -->|View Details| ZZ[Navigate to Restaurant Detail]
        XX -->|Search Again| B
        
        YY --> AAA[Update Save Button State]
        ZZ --> BBB[Load Restaurant Detail Page]
    end

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef api fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backend fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef data fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef response fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef action fill:#f1f8e9,stroke:#33691e,stroke-width:2px

    class A,B,C,D,E,F,G,H,I,J,K frontend
    class L,M,N,O,P,Q,R api
    class S,T,U,V,W,X,Y,Z,AA,BB backend
    class CC,DD,EE,FF,GG,HH,II,JJ,KK,LL data
    class MM,NN,OO,PP,QQ,RR response
    class SS,TT,UU,VV,WW error
    class XX,YY,ZZ,AAA,BBB action
```

---

## Detailed Search Process Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Service
    participant C as Controller
    participant S as Service
    participant R as RDF Ontology
    participant D as Database

    %% Advanced Search Flow
    U->>F: Open Search Page
    F->>F: Load Search Forms
    U->>F: Fill Advanced Search Criteria
    F->>A: Call searchRestaurantsAdvanced(criteria)
    A->>A: Build Query Parameters
    A->>A: Add JWT Token to Headers
    A->>C: HTTP GET /api/restaurants/search/advanced
    
    C->>C: Check Rate Limiting
    C->>S: searchRestaurantsAdvanced(params)
    S->>R: Load Restaurant Ontology
    R-->>S: Return RDF Model
    S->>S: Query Restaurant Resources
    S->>S: Convert RDF to Restaurant Objects
    S->>S: Apply Search Filters
    
    loop For Each Restaurant
        S->>S: Check matchesAdvancedSearchCriteria()
        alt Restaurant Matches
            S->>S: Add to Results List
        else Restaurant Doesn't Match
            S->>S: Skip Restaurant
        end
    end
    
    S->>S: Sort Results
    S-->>C: Return Restaurant List
    C-->>A: Return ApiResponse JSON
    A-->>F: Return Search Results
    F->>F: Update State with Results
    F->>U: Display Restaurant Cards
    
    %% User Actions
    U->>F: Click Save Button
    F->>F: Save to LocalStorage
    F->>U: Show Success Message
    
    U->>F: Click View Details
    F->>A: Call getRestaurantById(id)
    A->>C: HTTP GET /api/restaurants/{id}
    C->>S: getRestaurantById(id)
    S->>R: Query Specific Restaurant
    R-->>S: Return Restaurant Data
    S-->>C: Return Restaurant Object
    C-->>A: Return Restaurant JSON
    A-->>F: Return Restaurant Details
    F->>F: Navigate to Detail Page
```

---

## Data Flow Architecture

```mermaid
graph LR
    subgraph "Data Sources"
        A[RDF Ontology File<br/>RestaurantOntology_03_12_24.rdf]
        B[Rules File<br/>rule.rules]
        C[H2 Database<br/>Sample Data]
    end

    subgraph "Backend Processing"
        D[RestaurantService<br/>Load & Process Data]
        E[Apache Jena<br/>RDF Processing]
        F[Rule Engine<br/>Apply Business Rules]
    end

    subgraph "API Layer"
        G[RestaurantController<br/>Handle Requests]
        H[Authentication<br/>JWT Token Validation]
        I[Rate Limiting<br/>Prevent Abuse]
    end

    subgraph "Frontend Processing"
        J[RestaurantSearchAPI<br/>API Calls]
        K[Search Forms<br/>User Input]
        L[SearchResults<br/>Display Cards]
        M[UserDataService<br/>Local Storage]
    end

    subgraph "User Interface"
        N[Search Page<br/>Modern UI]
        O[Restaurant Cards<br/>Interactive Display]
        P[Save Functionality<br/>Local Persistence]
    end

    A --> D
    B --> F
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    K --> L
    L --> M
    M --> N
    N --> O
    O --> P

    %% Styling
    classDef dataSource fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backend fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef frontend fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef ui fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class A,B,C dataSource
    class D,E,F backend
    class G,H,I api
    class J,K,L,M frontend
    class N,O,P ui
```

---

## Search Criteria Matching Flow

```mermaid
flowchart TD
    A[Restaurant Object] --> B{Check Restaurant Name}
    B -->|Match| C{Check Cuisine Type}
    B -->|No Match| Z[Skip Restaurant]
    
    C -->|Match| D{Check Restaurant Type}
    C -->|No Match| Z
    
    D -->|Match| E{Check Location}
    D -->|No Match| Z
    
    E -->|Match| F{Check Nationality}
    E -->|No Match| Z
    
    F -->|Match| G{Check Budget Range}
    F -->|No Match| Z
    
    G -->|Within Range| H{Check Nutrition Levels}
    G -->|Out of Range| Z
    
    H -->|Match| I{Check Runner Type}
    H -->|No Match| Z
    
    I -->|Match| J[Add to Results]
    I -->|No Match| Z
    
    J --> K[Continue to Next Restaurant]
    Z --> K
    K --> L{More Restaurants?}
    L -->|Yes| A
    L -->|No| M[Sort Results]
    M --> N[Return Final Results]

    %% Styling
    classDef check fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef match fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef skip fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef result fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class A,B,C,D,E,F,G,H,I check
    class J,K,L,M,N match
    class Z skip
    class M,N result
```

---

## Error Handling Flow

```mermaid
graph TD
    A[API Request] --> B{Authentication Check}
    B -->|Valid Token| C{Rate Limiting Check}
    B -->|Invalid/Expired| D[Return 401 Error]
    
    C -->|Within Limit| E[Process Request]
    C -->|Exceeded Limit| F[Return 429 Error]
    
    E --> G{Data Processing}
    G -->|Success| H[Return Results]
    G -->|Error| I[Return 500 Error]
    
    D --> J[Frontend: Show Auth Alert]
    F --> K[Frontend: Show Rate Limit Alert]
    I --> L[Frontend: Show Error Message]
    H --> M[Frontend: Display Results]
    
    J --> N[Redirect to Login Page]
    K --> O[Show Retry Button]
    L --> P[Show Error Details]
    M --> Q[User Can Interact]

    %% Styling
    classDef error fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef success fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef warning fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef info fill:#e1f5fe,stroke:#01579b,stroke-width:2px

    class D,F,I,J,K,L error
    class H,M,Q success
    class C,F,K,O warning
    class A,B,E,G info
```

---

## User Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> SearchPage
    
    SearchPage --> AdvancedSearch : Click Advanced Tab
    SearchPage --> QuickSearch : Click Quick Tab
    SearchPage --> BrowseAll : Click Browse Tab
    
    AdvancedSearch --> FillingForm : User Types Criteria
    QuickSearch --> FillingForm : User Types Criteria
    BrowseAll --> LoadingAll : Auto Load All Restaurants
    
    FillingForm --> SubmittingSearch : Click Search Button
    LoadingAll --> ShowingResults : Data Loaded
    
    SubmittingSearch --> LoadingResults : API Call
    LoadingResults --> ShowingResults : Results Received
    LoadingResults --> ErrorState : API Error
    
    ShowingResults --> ViewingCard : User Scrolls Results
    ViewingCard --> SavingRestaurant : Click Save Button
    ViewingCard --> ViewingDetails : Click View Details
    
    SavingRestaurant --> SavedState : Save Success
    SavedState --> ViewingCard : Continue Browsing
    
    ViewingDetails --> DetailPage : Navigate to Details
    DetailPage --> SearchPage : Back to Search
    
    ErrorState --> RetryingSearch : Click Retry
    RetryingSearch --> LoadingResults : Retry API Call
    
    ErrorState --> SearchPage : Go Back
    ShowingResults --> SearchPage : New Search
```

---

## Performance Optimization Flow

```mermaid
graph TB
    subgraph "Frontend Optimizations"
        A[Debounced Search Input] --> B[State Management]
        B --> C[Component Memoization]
        C --> D[Lazy Loading]
    end

    subgraph "API Optimizations"
        E[Request Caching] --> F[Parameter Validation]
        F --> G[Response Compression]
        G --> H[Error Retry Logic]
    end

    subgraph "Backend Optimizations"
        I[Rate Limiting] --> J[Connection Pooling]
        J --> K[Query Optimization]
        K --> L[Result Caching]
    end

    subgraph "Data Optimizations"
        M[RDF Model Caching] --> N[Indexed Queries]
        N --> O[Batch Processing]
        O --> P[Memory Management]
    end

    A --> E
    E --> I
    I --> M

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef api fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backend fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef data fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class A,B,C,D frontend
    class E,F,G,H api
    class I,J,K,L backend
    class M,N,O,P data
```

---

## Technology Stack Flow

```mermaid
graph TB
    subgraph "Frontend Technologies"
        A[React.js] --> B[Material-UI]
        B --> C[React Router]
        C --> D[Axios/Fetch]
        D --> E[LocalStorage]
    end

    subgraph "Backend Technologies"
        F[Spring Boot] --> G[Spring Security]
        G --> H[Spring Data JPA]
        H --> I[Apache Jena]
        I --> J[H2 Database]
    end

    subgraph "Data Technologies"
        K[RDF Ontology] --> L[SPARQL Queries]
        L --> M[Rule Engine]
        M --> N[Semantic Reasoning]
    end

    subgraph "Infrastructure"
        O[Maven Build] --> P[Tomcat Server]
        P --> Q[Cross-Origin Support]
        Q --> R[Rate Limiting]
    end

    A --> F
    F --> K
    K --> O

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef data fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef infra fill:#f3e5f5,stroke:#4a148c,stroke-width:2px

    class A,B,C,D,E frontend
    class F,G,H,I,J backend
    class K,L,M,N data
    class O,P,Q,R infra
```

---

**Last Updated**: December 2024  
**Version**: 1.0.0 (Complete Process Flow Diagrams)
