package com.example.Project_1.service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.ArrayList;

import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.reasoner.*;
import org.apache.jena.reasoner.rulesys.GenericRuleReasoner;
import org.apache.jena.reasoner.rulesys.GenericRuleReasonerFactory;
import org.apache.jena.reasoner.rulesys.Rule;
import org.apache.jena.vocabulary.ReasonerVocabulary;
import org.apache.jena.rdf.model.ResourceFactory;
 
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;
import org.springframework.stereotype.Service;

import com.example.Project_1.model.Restaurant;
import com.example.Project_1.model.User;
import com.example.Project_1.dto.RestaurantRecommendationRequest;

@Service
public class RestaurantService {

    private static final String ONTOLOGY_FILE = "RestaurantOntology_03_12_24.rdf"; // classpath resource
    private static final String NS = "http://www.semanticweb.org/acer/ontologies/2567/8/restaurantontologyfinal#";  // Namespace of RDF data
    private static final String RULES_FILE = "rule.rules"; // classpath resource for rules

    // Method to load the RDF model from classpath
    public Model loadRestaurantOntology() {
        Model model = ModelFactory.createDefaultModel();
        try (InputStream in = getClass().getClassLoader().getResourceAsStream(ONTOLOGY_FILE)) {
            if (in == null) {
                throw new RuntimeException("Ontology file not found on classpath: " + ONTOLOGY_FILE);
            }
            model.read(in, null);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load ontology: " + e.getMessage(), e);
        }
        return model;
    }

    // Helper method to retrieve either a resource URI or a literal value
    private String getResourceOrLiteralValue(Statement stmt) {
        if (stmt != null) {
            RDFNode object = stmt.getObject();
            if (object.isLiteral()) {
                return object.asLiteral().getString();
            } else if (object.isResource()) {
                return object.asResource().getURI();
            }
        }
        return "N/A";
    }

    // Method to load rules and apply reasoning on the model (hybrid mode via factory)
    public InfModel applyRulesToModel(Model model) {
        Model cfgModel = ModelFactory.createDefaultModel();
        Resource cfg = cfgModel.createResource();
        cfg.addProperty(ReasonerVocabulary.PROPruleMode, "hybrid");
        cfg.addProperty(ReasonerVocabulary.PROPruleSet, RULES_FILE);
        cfg.addProperty(ReasonerVocabulary.PROPtraceOn, "true");
        Reasoner reasoner = GenericRuleReasonerFactory.theInstance().create(cfg);
        return ModelFactory.createInfModel(reasoner, model);
    }

    // Removed old file-based rules loading helper; rules are loaded via Reasoner config from classpath now.

    // NEW METHOD: Get restaurant recommendations as structured data for frontend
    public List<Restaurant> getRestaurantRecommendations(RestaurantRecommendationRequest request) {
        List<Restaurant> recommendations = new ArrayList<>();
        
        try {
            System.out.println("\n" + "=".repeat(80));
            System.out.println("🏃‍♂️ RESTAURANT RECOMMENDATION PROCESS STARTED");
            System.out.println("=".repeat(80));
            System.out.println("👤 User ID: " + request.getUserId());
            System.out.println("📋 User Preferences:");
            System.out.println("  ├─ Runner Type: " + request.getRunnerType());
            System.out.println("  ├─ Max Budget: $" + String.format("%.2f", request.getMaxBudget()));
            System.out.println("  ├─ Preferred Cuisines: " + (request.getPreferredCuisines() != null ? request.getPreferredCuisines() : "Any"));
            System.out.println("  ├─ Preferred Restaurant Types: " + (request.getPreferredRestaurantTypes() != null ? request.getPreferredRestaurantTypes() : "Any"));
            
            if (request.getPreRunNutrition() != null) {
                System.out.println("  ├─ Pre-run Nutrition:");
                System.out.println("    ├─ Carbohydrates: " + request.getPreRunNutrition().getCarbLevel());
                System.out.println("    ├─ Fat: " + request.getPreRunNutrition().getFatLevel());
                System.out.println("    └─ Protein: " + request.getPreRunNutrition().getProteinLevel());
            }
            
            if (request.getPostRunNutrition() != null) {
                System.out.println("  └─ Post-run Nutrition:");
                System.out.println("    ├─ Carbohydrates: " + request.getPostRunNutrition().getCarbLevel());
                System.out.println("    ├─ Fat: " + request.getPostRunNutrition().getFatLevel());
                System.out.println("    └─ Protein: " + request.getPostRunNutrition().getProteinLevel());
            }
            
            System.out.println("=".repeat(80));
            
            // Load the RDF model
            System.out.println("📚 Loading RDF ontology...");
            Model model = loadRestaurantOntology();
            System.out.println("✅ RDF ontology loaded successfully");

            // Create or update a user individual in the model from request (normalize terms to ontology local names)
            String userLocalName = (request.getUserId() != null && !request.getUserId().isEmpty()) ? request.getUserId() : "apiUser";
            String userURI = NS + userLocalName;
            Resource userInstance = model.createResource(userURI);
            userInstance.addProperty(RDF.type, model.createResource(NS + "User"));

            if (request.getRunnerType() != null) {
                String normalizedRunner = normalizeRunnerType(request.getRunnerType());
                userInstance.addProperty(model.createProperty(NS + "RunnerType"), normalizedRunner);
            }
            userInstance.addLiteral(model.createProperty(NS + "BudgetInterest"), request.getMaxBudget());

            if (request.getPreRunNutrition() != null) {
                userInstance.addProperty(model.createProperty(NS + "PreRunCarbConsumtion"), request.getPreRunNutrition().getCarbLevel());
                userInstance.addProperty(model.createProperty(NS + "PreRunFatConsumtion"), request.getPreRunNutrition().getFatLevel());
                userInstance.addProperty(model.createProperty(NS + "PreRunProteinConsumtion"), request.getPreRunNutrition().getProteinLevel());
            }
            if (request.getPostRunNutrition() != null) {
                userInstance.addProperty(model.createProperty(NS + "PostRunCarbConsumtion"), request.getPostRunNutrition().getCarbLevel());
                userInstance.addProperty(model.createProperty(NS + "PostRunFatConsumtion"), request.getPostRunNutrition().getFatLevel());
                userInstance.addProperty(model.createProperty(NS + "PostRunProteinConsumtion"), request.getPostRunNutrition().getProteinLevel());
            }

            if (request.getPreferredRestaurantTypes() != null) {
                for (String type : request.getPreferredRestaurantTypes()) {
                    if (type != null && !type.isEmpty()) {
                        String normalizedType = normalizeRestaurantType(type);
                        userInstance.addProperty(
                            model.createProperty(NS + "hasRestaurantTypeInterest"),
                            model.createResource(NS + normalizedType)
                        );
                    }
                }
            }
            if (request.getPreferredCuisines() != null) {
                for (String cuisine : request.getPreferredCuisines()) {
                    if (cuisine != null && !cuisine.isEmpty()) {
                        String normalizedCuisine = normalizeCuisineType(cuisine);
                        userInstance.addProperty(
                            model.createProperty(NS + "hasFoodTypeInterest"),
                            model.createResource(NS + normalizedCuisine)
                        );
                    }
                }
            }

            System.out.println("🧠 Applying reasoning rules (hybrid)...");
            InfModel infModel = applyRulesToModel(model);
            System.out.println("✅ Reasoning rules applied successfully");

            // SPARQL over inferred model to fetch recommendations + confidence
            String prefix = "PREFIX re: <" + NS + ">\n" +
                            "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n";
            String sparql = prefix +
                "SELECT ?restaurant (xsd:float(?c) AS ?confidence) WHERE {\n" +
                "  <" + userURI + "> re:hasRecommend ?restaurant .\n" +
                "  OPTIONAL { ?restaurant re:confidence ?c }\n" +
                "} ORDER BY DESC(?confidence)";

            org.apache.jena.query.Query query = org.apache.jena.query.QueryFactory.create(sparql);
            try (org.apache.jena.query.QueryExecution qexec = org.apache.jena.query.QueryExecutionFactory.create(query, infModel)) {
                org.apache.jena.query.ResultSet rs = qexec.execSelect();
                Property hasRecommend = infModel.getProperty(NS, "hasRecommend");
                while (rs.hasNext()) {
                    org.apache.jena.query.QuerySolution sol = rs.next();
                    RDFNode resNode = sol.get("restaurant");
                    if (resNode == null || !resNode.isResource()) continue;
                    Resource restaurantRes = resNode.asResource();
                    Restaurant restaurant = convertToRestaurantModel(restaurantRes, infModel);
                    if (restaurant == null) continue;

                    float conf = 0f;
                    RDFNode confNode = sol.get("confidence");
                    if (confNode != null && confNode.isLiteral()) {
                        try { conf = confNode.asLiteral().getFloat(); } catch (Exception ignore) {}
                    } else {
                        // fallback: try reading directly from graph
                        Statement confStmt = restaurantRes.getProperty(infModel.getProperty(NS, "confidence"));
                        if (confStmt != null && confStmt.getObject().isLiteral()) {
                            try { conf = Float.parseFloat(confStmt.getString()); } catch (Exception ignore) {}
                        }
                    }
                    if (conf <= 0f) conf = 100f; // default if rule omitted confidence
                    restaurant.setRuleConfidence(conf);
                    restaurant.setMatchScore(conf);

                    // collect matched rule names from derivations using the triple <user> re:hasRecommend <restaurant>
                    java.util.List<String> matchedRules = new java.util.ArrayList<>();
                    org.apache.jena.reasoner.InfGraph ig = (org.apache.jena.reasoner.InfGraph) infModel.getGraph();
                    Statement recommendStmt = infModel.createStatement(infModel.getResource(userURI), hasRecommend, restaurantRes);
                    java.util.Iterator<?> derivs = ig.getDerivation(recommendStmt.asTriple());
                    while (derivs != null && derivs.hasNext()) {
                        String s = String.valueOf(derivs.next());
                        int idx = s.indexOf("Rule ");
                        if (idx >= 0) {
                            int end = s.indexOf('\n', idx);
                            String ruleLine = end > idx ? s.substring(idx, end) : s.substring(idx);
                            matchedRules.add(ruleLine.trim());
                        }
                    }
                    restaurant.setMatchedRules(matchedRules);

                    recommendations.add(restaurant);
                }
            }

            // Sort by score desc
            recommendations.sort((r1, r2) -> Float.compare(r2.getMatchScore(), r1.getMatchScore()));
            
            System.out.println("=".repeat(80));
            System.out.println("🏁 RECOMMENDATION PROCESS COMPLETED");
            System.out.println("=".repeat(80));

        } catch (Exception e) {
            System.err.println("\n❌ ERROR in getRestaurantRecommendations: " + e.getMessage());
            System.err.println("📍 Stack trace:");
            e.printStackTrace();
            System.err.println("=".repeat(80));
        }

        return recommendations;
    }

    // NEW METHOD: Convert RDF resource to Restaurant model
    private Restaurant convertToRestaurantModel(Resource restaurantResource, Model model) {
        try {
            String restaurantName = getLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "RestaurantName")));
            if (restaurantName.equals("N/A")) return null;

            Restaurant restaurant = new Restaurant();
            restaurant.setRestaurantId(restaurantResource.getURI());
            restaurant.setRestaurantName(restaurantName);
            
            String cuisineTypeURI = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasFoodType")));
            restaurant.setCuisineType(getCuisineLabel(model, cuisineTypeURI));
            
            String type = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasRestaurantType")));
            restaurant.setRestaurantType(resolveHumanReadableLabel(model, type));
            
            String location = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasRestaurantPlace")));
            restaurant.setLocation(resolveHumanReadableLabel(model, location));
            
            String nationality = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasRestaurantNationality")));
            restaurant.setNationality(resolveHumanReadableLabel(model, nationality));
            
            String budgetStr = getLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "Budget")));
            if (!budgetStr.equals("N/A")) {
                restaurant.setBudget(Float.parseFloat(budgetStr));
            }
            
            restaurant.setTelephone(getLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "Telephone"))));

            // Set nutrition profile
            Restaurant.NutritionProfile nutrition = getNutritionProfile(restaurantResource, model);
            restaurant.setNutritionProfile(nutrition);

            return restaurant;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // NEW METHOD: Get nutrition profile from restaurant
    private Restaurant.NutritionProfile getNutritionProfile(Resource restaurantResource, Model model) {
        String carbLevel = "N/A";
        String fatLevel = "N/A";
        String proteinLevel = "N/A";

        Statement foodTypeStmt = restaurantResource.getProperty(model.createProperty(NS + "hasFoodType"));
        if (foodTypeStmt != null && foodTypeStmt.getObject().isResource()) {
            Resource foodTypeResource = foodTypeStmt.getObject().asResource();
            
            Statement carbStmt = foodTypeResource.getProperty(model.createProperty(NS + "Carbohydrates"));
            Statement fatStmt = foodTypeResource.getProperty(model.createProperty(NS + "Fat"));
            Statement proteinStmt = foodTypeResource.getProperty(model.createProperty(NS + "Protein"));
            
            if (carbStmt != null) carbLevel = getLiteralValue(carbStmt);
            if (fatStmt != null) fatLevel = getLiteralValue(fatStmt);
            if (proteinStmt != null) proteinLevel = getLiteralValue(proteinStmt);
        }

        return new Restaurant.NutritionProfile(carbLevel, fatLevel, proteinLevel);
    }

    // NEW METHOD: Check if restaurant matches user preferences
    private boolean matchesUserPreferences(Restaurant restaurant, RestaurantRecommendationRequest request) {
        System.out.println("🔍 Checking if restaurant matches user preferences...");
        
        // Check budget
        if (restaurant.getBudget() > request.getMaxBudget()) {
            System.out.println("❌ Budget mismatch: Restaurant $" + restaurant.getBudget() + " > User $" + request.getMaxBudget());
            return false;
        }
        System.out.println("✅ Budget match: Restaurant $" + restaurant.getBudget() + " <= User $" + request.getMaxBudget());

        // Check cuisine type - more flexible matching
        if (request.getPreferredCuisines() != null && !request.getPreferredCuisines().isEmpty()) {
            boolean cuisineMatch = request.getPreferredCuisines().stream()
                .anyMatch(cuisine -> {
                    String userCuisine = cuisine.toLowerCase().trim();
                    String restaurantCuisine = restaurant.getCuisineType().toLowerCase().trim();
                    
                    System.out.println("  🔍 Comparing cuisine: User '" + userCuisine + "' vs Restaurant '" + restaurantCuisine + "'");
                    
                    // Direct match
                    if (restaurantCuisine.contains(userCuisine) || userCuisine.contains(restaurantCuisine)) {
                        System.out.println("  ✅ Direct cuisine match found!");
                        return true;
                    }
                    
                    // Special cases for common cuisine types
                    if ((userCuisine.equals("japanese") && restaurantCuisine.contains("ramen")) ||
                        (userCuisine.equals("japanese") && restaurantCuisine.contains("sushi")) ||
                        (userCuisine.equals("japanese") && restaurantCuisine.contains("japanese")) ||
                        (userCuisine.equals("thai") && restaurantCuisine.contains("thai"))) {
                        System.out.println("  ✅ Special cuisine match found!");
                        return true;
                    }
                    
                    System.out.println("  ❌ No cuisine match");
                    return false;
                });
            if (!cuisineMatch) {
                System.out.println("❌ No cuisine type matches found");
                return false;
            }
            System.out.println("✅ Cuisine type match found");
        }

        // Check restaurant type - more flexible matching
        if (request.getPreferredRestaurantTypes() != null && !request.getPreferredRestaurantTypes().isEmpty()) {
            boolean typeMatch = request.getPreferredRestaurantTypes().stream()
                .anyMatch(type -> {
                    String userType = type.toLowerCase().trim();
                    String restaurantType = restaurant.getRestaurantType().toLowerCase().trim();
                    
                    System.out.println("  🔍 Comparing restaurant type: User '" + userType + "' vs Restaurant '" + restaurantType + "'");
                    
                    // Direct match
                    if (restaurantType.contains(userType) || userType.contains(restaurantType)) {
                        System.out.println("  ✅ Direct restaurant type match found!");
                        return true;
                    }
                    
                    // Special cases for restaurant types
                    if ((userType.contains("fast dining") && restaurantType.contains("fast dining")) ||
                        (userType.contains("casual dining") && restaurantType.contains("casual dining")) ||
                        (userType.contains("casual") && restaurantType.contains("casual"))) {
                        System.out.println("  ✅ Special restaurant type match found!");
                        return true;
                    }
                    
                    System.out.println("  ❌ No restaurant type match");
                    return false;
                });
            if (!typeMatch) {
                System.out.println("❌ No restaurant type matches found");
                return false;
            }
            System.out.println("✅ Restaurant type match found");
        }

        System.out.println("✅ All criteria matched! Restaurant is recommended.");
        return true;
    }

    // NEW METHOD: Calculate match score for restaurant
    private float calculateMatchScore(Restaurant restaurant, RestaurantRecommendationRequest request) {
        float score = 0.0f;
        System.out.println("🎯 Calculating match score for " + restaurant.getRestaurantName());
        
        // Base score for budget match (closer to max budget = higher score)
        if (restaurant.getBudget() <= request.getMaxBudget()) {
            score += 50.0f;
            System.out.println("  💰 Budget score: +50 (Restaurant $" + restaurant.getBudget() + " <= User $" + request.getMaxBudget() + ")");
            
            // Bonus for being well under budget
            float budgetRatio = restaurant.getBudget() / request.getMaxBudget();
            if (budgetRatio < 0.7f) {
                score += 20.0f;
                System.out.println("  💰 Budget bonus: +20 (Well under budget: " + String.format("%.2f", budgetRatio * 100) + "%)");
            }
        }

        // Score for cuisine type match
        if (request.getPreferredCuisines() != null && !request.getPreferredCuisines().isEmpty()) {
            boolean cuisineMatch = request.getPreferredCuisines().stream()
                .anyMatch(cuisine -> {
                    String userCuisine = cuisine.toLowerCase().trim();
                    String restaurantCuisine = restaurant.getCuisineType().toLowerCase().trim();
                    
                    if (restaurantCuisine.contains(userCuisine) || userCuisine.contains(restaurantCuisine)) {
                        return true;
                    }
                    
                    // Special cases for common cuisine types
                    if ((userCuisine.equals("japanese") && restaurantCuisine.contains("ramen")) ||
                        (userCuisine.equals("japanese") && restaurantCuisine.contains("sushi")) ||
                        (userCuisine.equals("japanese") && restaurantCuisine.contains("japanese")) ||
                        (userCuisine.equals("thai") && restaurantCuisine.contains("thai"))) {
                        return true;
                    }
                    
                    return false;
                });
            if (cuisineMatch) {
                score += 30.0f;
                System.out.println("  🍜 Cuisine type score: +30");
            }
        }

        // Score for restaurant type match
        if (request.getPreferredRestaurantTypes() != null && !request.getPreferredRestaurantTypes().isEmpty()) {
            boolean typeMatch = request.getPreferredRestaurantTypes().stream()
                .anyMatch(type -> {
                    String userType = type.toLowerCase().trim();
                    String restaurantType = restaurant.getRestaurantType().toLowerCase().trim();
                    
                    if (restaurantType.contains(userType) || userType.contains(restaurantType)) {
                        return true;
                    }
                    
                    // Special cases for restaurant types
                    if ((userType.contains("fast dining") && restaurantType.contains("fast dining")) ||
                        (userType.contains("casual dining") && restaurantType.contains("casual dining")) ||
                        (userType.contains("casual") && restaurantType.contains("casual"))) {
                        return true;
                    }
                    
                    return false;
                });
            if (typeMatch) {
                score += 20.0f;
                System.out.println("  🏢 Restaurant type score: +20");
            }
        }

        // Score for nutrition match
        if (restaurant.getNutritionProfile() != null) {
            Restaurant.NutritionProfile nutrition = restaurant.getNutritionProfile();
            System.out.println("  🥗 Nutrition matching:");
            
            // Check pre-run nutrition
            if (request.getPreRunNutrition() != null) {
                System.out.println("    Pre-run nutrition:");
                if (nutrition.getCarbLevel().equalsIgnoreCase(request.getPreRunNutrition().getCarbLevel())) {
                    score += 15.0f;
                    System.out.println("      ✅ Carb match: +15 (Restaurant: " + nutrition.getCarbLevel() + " vs User: " + request.getPreRunNutrition().getCarbLevel() + ")");
                } else {
                    System.out.println("      ❌ Carb mismatch: Restaurant: " + nutrition.getCarbLevel() + " vs User: " + request.getPreRunNutrition().getCarbLevel());
                }
                
                if (nutrition.getFatLevel().equalsIgnoreCase(request.getPreRunNutrition().getFatLevel())) {
                    score += 15.0f;
                    System.out.println("      ✅ Fat match: +15 (Restaurant: " + nutrition.getFatLevel() + " vs User: " + request.getPreRunNutrition().getFatLevel() + ")");
                } else {
                    System.out.println("      ❌ Fat mismatch: Restaurant: " + nutrition.getFatLevel() + " vs User: " + request.getPreRunNutrition().getFatLevel());
                }
                
                if (nutrition.getProteinLevel().equalsIgnoreCase(request.getPreRunNutrition().getProteinLevel())) {
                    score += 15.0f;
                    System.out.println("      ✅ Protein match: +15 (Restaurant: " + nutrition.getProteinLevel() + " vs User: " + request.getPreRunNutrition().getProteinLevel() + ")");
                } else {
                    System.out.println("      ❌ Protein mismatch: Restaurant: " + nutrition.getProteinLevel() + " vs User: " + request.getPreRunNutrition().getProteinLevel());
                }
            }
            
            // Check post-run nutrition
            if (request.getPostRunNutrition() != null) {
                System.out.println("    Post-run nutrition:");
                if (nutrition.getCarbLevel().equalsIgnoreCase(request.getPostRunNutrition().getCarbLevel())) {
                    score += 15.0f;
                    System.out.println("      ✅ Carb match: +15 (Restaurant: " + nutrition.getCarbLevel() + " vs User: " + request.getPostRunNutrition().getCarbLevel() + ")");
                } else {
                    System.out.println("      ❌ Carb mismatch: Restaurant: " + nutrition.getCarbLevel() + " vs User: " + request.getPostRunNutrition().getCarbLevel());
                }
                
                if (nutrition.getFatLevel().equalsIgnoreCase(request.getPostRunNutrition().getFatLevel())) {
                    score += 15.0f;
                    System.out.println("      ✅ Fat match: +15 (Restaurant: " + nutrition.getFatLevel() + " vs User: " + request.getPostRunNutrition().getFatLevel() + ")");
                } else {
                    System.out.println("      ❌ Fat mismatch: Restaurant: " + nutrition.getFatLevel() + " vs User: " + request.getPostRunNutrition().getFatLevel());
                }
                
                if (nutrition.getProteinLevel().equalsIgnoreCase(request.getPostRunNutrition().getProteinLevel())) {
                    score += 15.0f;
                    System.out.println("      ✅ Protein match: +15 (Restaurant: " + nutrition.getProteinLevel() + " vs User: " + request.getPostRunNutrition().getProteinLevel() + ")");
                } else {
                    System.out.println("      ❌ Protein mismatch: Restaurant: " + nutrition.getProteinLevel() + " vs User: " + request.getPostRunNutrition().getProteinLevel());
                }
            }
        }

        System.out.println("  🎯 Total match score: " + score);
        return score;
    }

    // NEW METHOD: Get all restaurants (for browsing)
    public List<Restaurant> getAllRestaurants() {
        List<Restaurant> restaurants = new ArrayList<>();
        
        try {
            System.out.println("\n" + "=".repeat(60));
            System.out.println("🍽️ GETTING ALL RESTAURANTS");
            System.out.println("=".repeat(60));
            
            Model model = loadRestaurantOntology();
            System.out.println("✅ RDF ontology loaded");
            
            StmtIterator restaurantIterator = model.listStatements(null, RDF.type, model.createResource(NS + "Restaurant"));
            System.out.println("🔍 Querying restaurants...");

            int count = 0;
            while (restaurantIterator.hasNext()) {
                Statement restaurantStmt = restaurantIterator.nextStatement();
                Resource restaurantResource = restaurantStmt.getSubject();
                
                Restaurant restaurant = convertToRestaurantModel(restaurantResource, model);
                if (restaurant != null) {
                    count++;
                    restaurants.add(restaurant);
                    System.out.println("  " + count + ". " + restaurant.getRestaurantName() + 
                                     " (" + restaurant.getCuisineType() + ") - $" + 
                                     String.format("%.2f", restaurant.getBudget()));
                }
            }
            
            System.out.println("\n📊 SUMMARY:");
            System.out.println("  ├─ Total restaurants found: " + count);
            System.out.println("  └─ Successfully converted: " + restaurants.size());
            System.out.println("=".repeat(60));
            
        } catch (Exception e) {
            System.err.println("❌ ERROR getting all restaurants: " + e.getMessage());
            e.printStackTrace();
        }

        return restaurants;
    }

    // NEW METHOD: Search restaurants by criteria
    public List<Restaurant> searchRestaurants(String cuisineType, String location, float maxBudget) {
        List<Restaurant> results = new ArrayList<>();
        
        try {
            System.out.println("\n" + "=".repeat(60));
            System.out.println("🔍 SEARCHING RESTAURANTS");
            System.out.println("=".repeat(60));
            System.out.println("📋 Search Criteria:");
            System.out.println("  ├─ Cuisine Type: " + (cuisineType != null ? cuisineType : "Any"));
            System.out.println("  ├─ Location: " + (location != null ? location : "Any"));
            System.out.println("  └─ Max Budget: $" + String.format("%.2f", maxBudget));
            
            Model model = loadRestaurantOntology();
            System.out.println("✅ RDF ontology loaded");
            
            StmtIterator restaurantIterator = model.listStatements(null, RDF.type, model.createResource(NS + "Restaurant"));
            System.out.println("🔍 Querying restaurants...");

            int totalChecked = 0;
            int matched = 0;
            
            while (restaurantIterator.hasNext()) {
                Statement restaurantStmt = restaurantIterator.nextStatement();
                Resource restaurantResource = restaurantStmt.getSubject();
                
                Restaurant restaurant = convertToRestaurantModel(restaurantResource, model);
                if (restaurant != null) {
                    totalChecked++;
                    
                    if (matchesSearchCriteria(restaurant, cuisineType, location, maxBudget)) {
                        matched++;
                        results.add(restaurant);
                        System.out.println("  ✅ " + matched + ". " + restaurant.getRestaurantName() + 
                                         " (" + restaurant.getCuisineType() + ") - $" + 
                                         String.format("%.2f", restaurant.getBudget()) + " - " + restaurant.getLocation());
                    }
                }
            }
            
            System.out.println("\n📊 SEARCH SUMMARY:");
            System.out.println("  ├─ Total restaurants checked: " + totalChecked);
            System.out.println("  ├─ Matched criteria: " + matched);
            System.out.println("  └─ Results returned: " + results.size());
            System.out.println("=".repeat(60));
            
        } catch (Exception e) {
            System.err.println("❌ ERROR searching restaurants: " + e.getMessage());
            e.printStackTrace();
        }

        return results;
    }

    // NEW METHOD: Check if restaurant matches search criteria
    private boolean matchesSearchCriteria(Restaurant restaurant, String cuisineType, String location, float maxBudget) {
        if (cuisineType != null && !cuisineType.isEmpty()) {
            if (!restaurant.getCuisineType().toLowerCase().contains(cuisineType.toLowerCase())) {
                return false;
            }
        }
        
        if (location != null && !location.isEmpty()) {
            if (!restaurant.getLocation().toLowerCase().contains(location.toLowerCase())) {
                return false;
            }
        }
        
        if (maxBudget > 0 && restaurant.getBudget() > maxBudget) {
            return false;
        }
        
        return true;
    }

    // NEW METHOD: Get restaurant by ID with detailed debug logging
    public Restaurant getRestaurantById(String restaurantId) {
        try {
            System.out.println("\n" + "=".repeat(80));
            System.out.println("🔍 GETTING RESTAURANT BY ID");
            System.out.println("=".repeat(80));
            System.out.println("🎯 Restaurant ID: " + restaurantId);
            
            // Decode URL if it's encoded
            String decodedId = restaurantId;
            try {
                decodedId = java.net.URLDecoder.decode(restaurantId, "UTF-8");
                if (!decodedId.equals(restaurantId)) {
                    System.out.println("🔧 URL Decoded: " + decodedId);
                }
            } catch (Exception e) {
                System.out.println("⚠️ URL decoding failed, using original ID");
            }
            
            // Load the RDF model
            System.out.println("📚 Loading RDF ontology...");
            Model model = loadRestaurantOntology();
            System.out.println("✅ RDF ontology loaded successfully");
            
            // Try to find the restaurant by URI (both original and decoded)
            Resource restaurantResource = model.getResource(decodedId);
            if (restaurantResource == null && !decodedId.equals(restaurantId)) {
                System.out.println("💡 Trying with original ID...");
                restaurantResource = model.getResource(restaurantId);
            }
            
            if (restaurantResource == null) {
                System.out.println("❌ Restaurant resource not found for ID: " + restaurantId);
                System.out.println("💡 Checking if this might be a local name...");
                
                // Try to find by local name (part after #)
                String localName = restaurantId;
                if (restaurantId.contains("#")) {
                    localName = restaurantId.substring(restaurantId.lastIndexOf("#") + 1);
                }
                System.out.println("🔍 Searching for local name: " + localName);
                
                // Search all restaurants to find matching local name (including different namespaces)
                boolean found = false;
                
                // Search in main namespace
                StmtIterator mainRestaurants = model.listStatements(null, RDF.type, model.createResource(NS + "Restaurant"));
                while (mainRestaurants.hasNext()) {
                    Statement stmt = mainRestaurants.nextStatement();
                    Resource res = stmt.getSubject();
                    String resLocalName = res.getURI();
                    
                    if (resLocalName.contains("#")) {
                        resLocalName = resLocalName.substring(resLocalName.lastIndexOf("#") + 1);
                    }
                    
                    System.out.println("  🔍 Checking main namespace: " + resLocalName + " vs " + localName);
                    
                    if (resLocalName.equals(localName)) {
                        System.out.println("  ✅ Found matching local name in main namespace!");
                        restaurantResource = res;
                        found = true;
                        break;
                    }
                }
                
                // Search in other namespaces (j.0, j.1, j.2, j.3)
                if (!found) {
                    System.out.println("🔍 Searching in other namespaces...");
                    
                    // Search for any resource with the local name that has Restaurant type
                    StmtIterator allResources = model.listStatements();
                    while (allResources.hasNext() && !found) {
                        Statement stmt = allResources.nextStatement();
                        Resource res = stmt.getSubject();
                        String resURI = res.getURI();
                        
                        if (resURI.contains("#" + localName)) {
                            System.out.println("  🔍 Found resource with matching name: " + resURI);
                            
                            // Check if it has Restaurant type
                            StmtIterator types = res.listProperties(RDF.type);
                            while (types.hasNext()) {
                                Statement typeStmt = types.nextStatement();
                                String typeURI = typeStmt.getObject().toString();
                                
                                if (typeURI.contains("Restaurant")) {
                                    System.out.println("  ✅ Found restaurant in namespace: " + resURI);
                                    restaurantResource = res;
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (!found) {
                    System.out.println("❌ No restaurant found with local name: " + localName);
                    System.out.println("📋 Available restaurants in ontology:");
                    
                    // List all available restaurants
                    StmtIterator availableRestaurants = model.listStatements(null, RDF.type, model.createResource(NS + "Restaurant"));
                    int count = 0;
                    while (availableRestaurants.hasNext()) {
                        count++;
                        Statement stmt = availableRestaurants.nextStatement();
                        Resource res = stmt.getSubject();
                        String resLocalName = res.getURI();
                        
                        if (resLocalName.contains("#")) {
                            resLocalName = resLocalName.substring(resLocalName.lastIndexOf("#") + 1);
                        }
                        
                        System.out.println("  " + count + ". " + resLocalName + " (" + res.getURI() + ")");
                    }
                    
                    System.out.println("=".repeat(80));
                    return null;
                }
            }
            
            System.out.println("✅ Restaurant resource found: " + restaurantResource.getURI());
            
            // Convert to Restaurant model
            System.out.println("🔄 Converting RDF resource to Restaurant model...");
            Restaurant restaurant = convertToRestaurantModel(restaurantResource, model);
            
            if (restaurant == null) {
                System.out.println("❌ Failed to convert restaurant resource to model");
                System.out.println("🔍 Debugging resource properties:");
                
                StmtIterator properties = restaurantResource.listProperties();
                while (properties.hasNext()) {
                    Statement prop = properties.nextStatement();
                    String propName = prop.getPredicate().getURI();
                    String propValue = prop.getObject().isLiteral() ? 
                        prop.getObject().asLiteral().getString() : 
                        prop.getObject().toString();
                    
                    System.out.println("  ├─ " + propName + " = " + propValue);
                }
                
                System.out.println("=".repeat(80));
                return null;
            }
            
            System.out.println("✅ Restaurant model created successfully!");
            
            // Display detailed restaurant information
            System.out.println("\n🍽️ RESTAURANT DETAILS:");
            System.out.println("  ├─ ID: " + restaurant.getRestaurantId());
            System.out.println("  ├─ Name: " + restaurant.getRestaurantName());
            System.out.println("  ├─ Cuisine: " + restaurant.getCuisineType());
            System.out.println("  ├─ Type: " + restaurant.getRestaurantType());
            System.out.println("  ├─ Location: " + restaurant.getLocation());
            System.out.println("  ├─ Nationality: " + restaurant.getNationality());
            System.out.println("  ├─ Budget: $" + String.format("%.2f", restaurant.getBudget()));
            System.out.println("  └─ Telephone: " + restaurant.getTelephone());
            
            if (restaurant.getNutritionProfile() != null) {
                System.out.println("  🥗 Nutrition Profile:");
                System.out.println("    ├─ Carbohydrates: " + restaurant.getNutritionProfile().getCarbLevel());
                System.out.println("    ├─ Fat: " + restaurant.getNutritionProfile().getFatLevel());
                System.out.println("    └─ Protein: " + restaurant.getNutritionProfile().getProteinLevel());
            } else {
                System.out.println("  ❌ No nutrition profile available");
            }
            
            // Additional debug information from RDF
            System.out.println("\n🔍 RDF RESOURCE ANALYSIS:");
            System.out.println("  ├─ Resource URI: " + restaurantResource.getURI());
            System.out.println("  ├─ Resource Type: " + restaurantResource.getProperty(RDF.type));
            
            // Check for additional properties that might not be in our model
            StmtIterator allProps = restaurantResource.listProperties();
            System.out.println("  └─ All Properties:");
            while (allProps.hasNext()) {
                Statement prop = allProps.nextStatement();
                String propName = prop.getPredicate().getURI();
                String propValue = prop.getObject().isLiteral() ? 
                    prop.getObject().asLiteral().getString() : 
                    prop.getObject().toString();
                
                // Skip the type property as it's always present
                if (!propName.contains("type")) {
                    System.out.println("    ├─ " + propName + " = " + propValue);
                }
            }
            
            System.out.println("\n✅ RESTAURANT RETRIEVED SUCCESSFULLY!");
            System.out.println("=".repeat(80));
            
            return restaurant;
            
        } catch (Exception e) {
            System.err.println("\n❌ ERROR getting restaurant by ID: " + e.getMessage());
            System.err.println("📍 Stack trace:");
            e.printStackTrace();
            System.err.println("=".repeat(80));
            return null;
        }
    }

    public void createStaticUserForTest() {
        Model model = loadRestaurantOntology();

        // Create a static user instance
        String userURI = NS + "userTest21";
        Resource userInstance = model.createResource(userURI);

        // Add user properties
        userInstance.addProperty(RDF.type, model.createResource(NS + "User"));
        // Update the consumption values for accuracy
        userInstance.addProperty(model.createProperty(NS + "PostRunCarbConsumtion"), "Low");
        userInstance.addProperty(model.createProperty(NS + "PostRunFatConsumtion"), "High");
        userInstance.addProperty(model.createProperty(NS + "PostRunProteinConsumtion"), "High");
        userInstance.addProperty(model.createProperty(NS + "PreRunCarbConsumtion"), "Low");
        userInstance.addProperty(model.createProperty(NS + "PreRunFatConsumtion"), "High");
        userInstance.addProperty(model.createProperty(NS + "PreRunProteinConsumtion"), "High");
        userInstance.addProperty(model.createProperty(NS + "RunnerType"), "Marathon");
        userInstance.addProperty(model.createProperty(NS + "BudgetInterest"), model.createTypedLiteral(501f));
        userInstance.addProperty(model.createProperty(NS + "hasFoodTypeInterest"), model.createResource(NS + "GrilledPork_Type"));
        userInstance.addProperty(model.createProperty(NS + "hasRestaurantTypeInterest"), model.createResource(NS + "Fast_Dining_Type"));

        // Save the updated model to the file
        try {
            model.write(new FileOutputStream(ONTOLOGY_FILE), "RDF/XML");
            System.out.println("Static User has been saved to the RDF model.");
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Print the static user instance for debugging
        System.out.println("Static User Created for Testing: " + userInstance);
    }

    // Enhanced method to retrieve restaurant recommendations for a user with better debugging
    public void retrieveRestaurantRecommendationsForUser() {
        // Load the RDF model
        Model model = loadRestaurantOntology();

        // Apply rules to the model to infer recommendations
        InfModel infModel = applyRulesToModel(model);

        // Define user preferences based on the created user instance (get values from the model)
        String userURI = NS + "userTest18"; // User URI
        Resource userInstance = infModel.getResource(userURI);

        if (userInstance == null) {
            System.out.println("User instance not found: " + userURI);
            return;
        }

        // Get user preferences
        float maxBudget = getMaxBudget(userInstance);
        String preferredCuisine = getPreferredCuisine(userInstance);
        String preferredRestaurantType = getPreferredRestaurantType(userInstance);

        // ดึงค่าการบริโภค Pre/Post จากผู้ใช้
        String preRunCarb = getLiteralValue(userInstance.getProperty(model.createProperty(NS + "PreRunCarbConsumtion")));
        String preRunFat = getLiteralValue(userInstance.getProperty(model.createProperty(NS + "PreRunFatConsumtion")));
        String preRunProtein = getLiteralValue(userInstance.getProperty(model.createProperty(NS + "PreRunProteinConsumtion")));
        String postRunCarb = getLiteralValue(userInstance.getProperty(model.createProperty(NS + "PostRunCarbConsumtion")));
        String postRunFat = getLiteralValue(userInstance.getProperty(model.createProperty(NS + "PostRunFatConsumtion")));
        String postRunProtein = getLiteralValue(userInstance.getProperty(model.createProperty(NS + "PostRunProteinConsumtion")));

        // Display comprehensive user preferences
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🏃‍♂️ USER PREFERENCES SUMMARY");
        System.out.println("=".repeat(60));
        System.out.println("User URI: " + userURI);
        System.out.println("Budget Interest: $" + maxBudget);
        System.out.println("Food Type Interest: " + preferredCuisine);
        System.out.println("Restaurant Type Interest: " + preferredRestaurantType);
        System.out.println("Pre-Run Nutrition:");
        System.out.println("  ├─ Carb: " + preRunCarb);
        System.out.println("  ├─ Fat: " + preRunFat);
        System.out.println("  └─ Protein: " + preRunProtein);
        System.out.println("Post-Run Nutrition:");
        System.out.println("  ├─ Carb: " + postRunCarb);
        System.out.println("  ├─ Fat: " + postRunFat);
        System.out.println("  └─ Protein: " + postRunProtein);
        System.out.println("=".repeat(60));

        // Query for restaurants
        StmtIterator restaurantIterator = infModel.listStatements(null, RDF.type, model.createResource(NS + "Restaurant"));

        boolean foundRecommendation = false;
        int recommendationCount = 0;
        int totalRestaurantsChecked = 0;
        
        // Lists to store different categories of restaurants
        java.util.List<String> recommendedRestaurants = new java.util.ArrayList<>();
        java.util.List<String> partialMatchRestaurants = new java.util.ArrayList<>();
        java.util.List<String> noNutritionDataRestaurants = new java.util.ArrayList<>();

        // Loop through all restaurant statements
        while (restaurantIterator.hasNext()) {
            totalRestaurantsChecked++;
            Statement restaurantStmt = restaurantIterator.nextStatement();
            Resource restaurantResource = restaurantStmt.getSubject();

            // Extract restaurant details
            String restaurantName = getLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "RestaurantName")));
            String nationality = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasRestaurantNationality")));
            String type = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasRestaurantType")));
            String location = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasRestaurantPlace")));
            String cuisineTypeURI = getResourceOrLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "hasFoodType")));
            String budget = getLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "Budget")));
            String telephone = getLiteralValue(restaurantResource.getProperty(model.createProperty(NS + "Telephone")));

            // ดึงข้อมูลโภชนาการจาก FoodType ของร้านอาหาร
            System.out.println("🔍 Getting Nutrition from FoodType for: " + restaurantName);
            
            String restaurantCarb = "N/A";
            String restaurantFat = "N/A";
            String restaurantProtein = "N/A";
            boolean hasCompleteNutritionData = false;
            
            // ดึง FoodType ของร้านอาหาร
            Statement foodTypeStmt = restaurantResource.getProperty(model.createProperty(NS + "hasFoodType"));
            if (foodTypeStmt != null && foodTypeStmt.getObject().isResource()) {
                Resource foodTypeResource = foodTypeStmt.getObject().asResource();
                System.out.println("📋 Found FoodType: " + foodTypeResource.getURI());
                
                // ดึงข้อมูลโภชนาการจาก FoodType
                Statement carbStmt = foodTypeResource.getProperty(model.createProperty(NS + "Carbohydrates"));
                Statement fatStmt = foodTypeResource.getProperty(model.createProperty(NS + "Fat"));
                Statement proteinStmt = foodTypeResource.getProperty(model.createProperty(NS + "Protein"));
                
                if (carbStmt != null) {
                    restaurantCarb = getLiteralValue(carbStmt);
                    System.out.println("✅ Found Carb from FoodType: " + restaurantCarb);
                }
                
                if (fatStmt != null) {
                    restaurantFat = getLiteralValue(fatStmt);
                    System.out.println("✅ Found Fat from FoodType: " + restaurantFat);
                }
                
                if (proteinStmt != null) {
                    restaurantProtein = getLiteralValue(proteinStmt);
                    System.out.println("✅ Found Protein from FoodType: " + restaurantProtein);
                }
                
                // Check if we have complete nutrition data
                hasCompleteNutritionData = !restaurantCarb.equals("N/A") && 
                                           !restaurantFat.equals("N/A") && 
                                           !restaurantProtein.equals("N/A");
                
            } else {
                System.out.println("❌ No FoodType found for restaurant: " + restaurantName);
                // เพิ่มลงใน list โดยไม่ต้องรออีก
                if (!restaurantName.equals("N/A")) {
                    noNutritionDataRestaurants.add(restaurantName + " (No FoodType)");
                }
                
                // Debug: แสดง properties ทั้งหมดของร้านอาหาร
                StmtIterator allPropsIterator = restaurantResource.listProperties();
                System.out.println("📋 All properties for this restaurant:");
                while (allPropsIterator.hasNext()) {
                    Statement propStmt = allPropsIterator.nextStatement();
                    String propName = propStmt.getPredicate().getURI();
                    String propValue = propStmt.getObject().isLiteral() ? 
                        propStmt.getObject().asLiteral().getString() : 
                        propStmt.getObject().toString();
                    System.out.println("  ├─ " + propName + " = " + propValue);
                }
            }

            // Resolve the labels
            String cuisineType = getCuisineLabel(model, cuisineTypeURI);
            String humanReadableLocation = resolveHumanReadableLabel(model, location);
            String humanReadableType = resolveHumanReadableLabel(model, type);
            String humanReadableNationality = resolveHumanReadableLabel(model, nationality);

            System.out.println("\n" + "─".repeat(50));
            System.out.println("🍽️  RESTAURANT #" + totalRestaurantsChecked + ": " + restaurantName);
            System.out.println("─".repeat(50));
            System.out.println("Restaurant Details:");
            System.out.println("  ├─ Name: " + restaurantName);
            System.out.println("  ├─ Cuisine: " + cuisineType);
            System.out.println("  ├─ Budget: $" + budget);
            System.out.println("  ├─ Type: " + humanReadableType);
            System.out.println("  ├─ Location: " + humanReadableLocation);
            System.out.println("  ├─ Nationality: " + humanReadableNationality);
            System.out.println("  └─ Telephone: " + telephone);
            System.out.println("Restaurant Nutrition:");
            System.out.println("  ├─ Carb Level: " + restaurantCarb);
            System.out.println("  ├─ Fat Level: " + restaurantFat);
            System.out.println("  ├─ Protein Level: " + restaurantProtein);
            System.out.println("  └─ Complete Nutrition Data: " + (hasCompleteNutritionData ? "✅" : "❌"));

            // Skip restaurants with missing critical data - แต่ยังคงเพิ่มในรายการ debug
            if (restaurantName.equals("N/A") || cuisineType.equals("Unknown Cuisine") || budget.equals("N/A")) {
                System.out.println("❌ SKIPPED: Missing critical data");
                
                // เพิ่มใน list สำหรับ debug แทนการ skip ไปเลย
                String skipReason = "";
                if (restaurantName.equals("N/A")) skipReason += "No name";
                if (cuisineType.equals("Unknown Cuisine")) skipReason += (skipReason.isEmpty() ? "" : ", ") + "Unknown cuisine";
                if (budget.equals("N/A")) skipReason += (skipReason.isEmpty() ? "" : ", ") + "No budget";
                
                if (!restaurantName.equals("N/A")) { // ถ้ามีชื่อให้เพิ่มใน list
                    partialMatchRestaurants.add(restaurantName + " (Missing critical data: " + skipReason + ")");
                }
                continue;
            }

            try {
                // Check all criteria
                boolean matchesCuisine = cuisineType.equalsIgnoreCase(preferredCuisine);
                boolean matchesBudget = Float.parseFloat(budget) <= maxBudget;
                boolean matchesRestaurantType = humanReadableType.equalsIgnoreCase(preferredRestaurantType);

                // Enhanced nutrition matching - require complete nutrition data
                boolean matchesPreCarb = hasCompleteNutritionData && restaurantCarb.equalsIgnoreCase(preRunCarb);
                boolean matchesPreFat = hasCompleteNutritionData && restaurantFat.equalsIgnoreCase(preRunFat);
                boolean matchesPreProtein = hasCompleteNutritionData && restaurantProtein.equalsIgnoreCase(preRunProtein);
                
                boolean matchesPostCarb = hasCompleteNutritionData && restaurantCarb.equalsIgnoreCase(postRunCarb);
                boolean matchesPostFat = hasCompleteNutritionData && restaurantFat.equalsIgnoreCase(postRunFat);
                boolean matchesPostProtein = hasCompleteNutritionData && restaurantProtein.equalsIgnoreCase(postRunProtein);

                // A restaurant matches if it satisfies either pre-run OR post-run nutrition needs
                boolean matchesPreRunNutrition = matchesPreCarb && matchesPreFat && matchesPreProtein;
                boolean matchesPostRunNutrition = matchesPostCarb && matchesPostFat && matchesPostProtein;
                boolean matchesNutrition = matchesPreRunNutrition || matchesPostRunNutrition;

                // Display matching results
                System.out.println("\n🔍 MATCHING ANALYSIS:");
                System.out.println("Basic Criteria:");
                System.out.println("  ├─ Cuisine Match: " + (matchesCuisine ? "✅" : "❌") + " (Restaurant: '" + cuisineType + "' vs User: '" + preferredCuisine + "')");
                System.out.println("  ├─ Budget Match: " + (matchesBudget ? "✅" : "❌") + " (Restaurant: $" + budget + " <= User: $" + maxBudget + ")");
                System.out.println("  └─ Restaurant Type Match: " + (matchesRestaurantType ? "✅" : "❌") + " (Restaurant: '" + humanReadableType + "' vs User: '" + preferredRestaurantType + "')");
                
                System.out.println("Pre-Run Nutrition:");
                System.out.println("  ├─ Carb: " + (matchesPreCarb ? "✅" : "❌") + " (Restaurant: '" + restaurantCarb + "' vs User: '" + preRunCarb + "')");
                System.out.println("  ├─ Fat: " + (matchesPreFat ? "✅" : "❌") + " (Restaurant: '" + restaurantFat + "' vs User: '" + preRunFat + "')");
                System.out.println("  └─ Protein: " + (matchesPreProtein ? "✅" : "❌") + " (Restaurant: '" + restaurantProtein + "' vs User: '" + preRunProtein + "')");
                System.out.println("  → Pre-Run Complete Match: " + (matchesPreRunNutrition ? "✅" : "❌"));
                
                System.out.println("Post-Run Nutrition:");
                System.out.println("  ├─ Carb: " + (matchesPostCarb ? "✅" : "❌") + " (Restaurant: '" + restaurantCarb + "' vs User: '" + postRunCarb + "')");
                System.out.println("  ├─ Fat: " + (matchesPostFat ? "✅" : "❌") + " (Restaurant: '" + restaurantFat + "' vs User: '" + postRunFat + "')");
                System.out.println("  └─ Protein: " + (matchesPostProtein ? "✅" : "❌") + " (Restaurant: '" + restaurantProtein + "' vs User: '" + postRunProtein + "')");
                System.out.println("  → Post-Run Complete Match: " + (matchesPostRunNutrition ? "✅" : "❌"));
                
                System.out.println("Overall Nutrition Match: " + (matchesNutrition ? "✅" : "❌") + " (Pre-Run OR Post-Run complete match required)");
                System.out.println("Has Complete Nutrition Data: " + (hasCompleteNutritionData ? "✅" : "❌"));

                // Final recommendation decision - ALL criteria must match INCLUDING complete nutrition data
                boolean isRecommended = matchesCuisine && matchesBudget && matchesRestaurantType && matchesNutrition && hasCompleteNutritionData;
                
                // Track partial matches for debugging - แยกเป็นหมวดหมู่ชัดเจน
                boolean isPartialMatch = matchesCuisine && matchesBudget && matchesRestaurantType;
                if (isPartialMatch && !isRecommended) {
                    String reason = "";
                    if (!hasCompleteNutritionData) {
                        reason = "Missing complete nutrition data";
                    } else if (!matchesNutrition) {
                        reason = "Nutrition doesn't match requirements";
                    }
                    partialMatchRestaurants.add(restaurantName + " (" + reason + ")");
                } else if (!isPartialMatch) {
                    // ร้านที่ไม่ผ่านเกณฑ์พื้นฐาน
                    java.util.List<String> failedCriteria = new java.util.ArrayList<>();
                    if (!matchesCuisine) failedCriteria.add("cuisine");
                    if (!matchesBudget) failedCriteria.add("budget");
                    if (!matchesRestaurantType) failedCriteria.add("restaurant type");
                    
                    String failedReason = String.join(", ", failedCriteria);
                    partialMatchRestaurants.add(restaurantName + " (Failed: " + failedReason + ")");
                }
                
                System.out.println("\n🎯 FINAL DECISION: " + (isRecommended ? "✅ RECOMMENDED" : "❌ NOT RECOMMENDED"));

                if (isRecommended) {
                    System.out.println("\n" + "🎉".repeat(20));
                    System.out.println("🎉 RECOMMENDED RESTAURANT #" + (recommendationCount + 1) + " 🎉");
                    System.out.println("🎉".repeat(20));
                    System.out.println("📛 Name: " + restaurantName);
                    System.out.println("🍜 Cuisine: " + cuisineType);
                    System.out.println("💰 Budget: $" + budget);
                    System.out.println("🏢 Type: " + humanReadableType);
                    System.out.println("📍 Location: " + humanReadableLocation);
                    System.out.println("🌍 Nationality: " + humanReadableNationality);
                    System.out.println("📞 Telephone: " + telephone);
                    System.out.println("🥗 Nutrition Profile:");
                    System.out.println("  ├─ Carb Level: " + restaurantCarb);
                    System.out.println("  ├─ Fat Level: " + restaurantFat);
                    System.out.println("  └─ Protein Level: " + restaurantProtein);
                    
                    if (matchesPreRunNutrition) {
                        System.out.println("✅ Perfect for PRE-RUN nutrition needs!");
                    }
                    if (matchesPostRunNutrition) {
                        System.out.println("✅ Perfect for POST-RUN nutrition needs!");
                    }
                    System.out.println("🎉".repeat(20));
                    
                    // Add restaurant name to the list
                    recommendedRestaurants.add(restaurantName);
                    recommendationCount++;
                    foundRecommendation = true;
                }

            } catch (NumberFormatException e) {
                System.out.println("❌ SKIPPED: Invalid budget format - " + budget);
                if (!restaurantName.equals("N/A")) {
                    partialMatchRestaurants.add(restaurantName + " (Invalid budget format: " + budget + ")");
                }
            }
        }

        // Enhanced final summary with detailed breakdown - แสดงผลทุกหมวดหมู่
        System.out.println("\n" + "=".repeat(80));
        System.out.println("📊 DETAILED RECOMMENDATION SUMMARY");
        System.out.println("=".repeat(80));
        System.out.println("Total Restaurants Checked: " + totalRestaurantsChecked);
        System.out.println("Total Recommendations Found: " + recommendationCount);
        System.out.println("Total Partial Matches: " + partialMatchRestaurants.size());
        System.out.println("Total Restaurants Without Nutrition Data: " + noNutritionDataRestaurants.size());
        
        if (!foundRecommendation) {
            System.out.println("🚫 NO RESTAURANTS MATCH ALL CRITERIA");
            System.out.println("💡 Suggestion: Try adjusting your preferences or check if restaurants");
            System.out.println("   with your desired cuisine type exist in the database");
        } else {
            System.out.println("✅ SUCCESS: Found " + recommendationCount + " restaurant(s) that perfectly match");
            System.out.println("   all your criteria including cuisine, budget, restaurant type, and");
            System.out.println("   nutrition requirements!");
            
            System.out.println("\n🍽️ RECOMMENDED RESTAURANTS:");
            for (int i = 0; i < recommendedRestaurants.size(); i++) {
                System.out.println("  " + (i + 1) + ". " + recommendedRestaurants.get(i));
            }
        }
        
        // แสดง partial matches ทั้งหมด (ไม่จำกัดจำนวน)
        if (!partialMatchRestaurants.isEmpty()) {
            System.out.println("\n⚠️ RESTAURANTS WITH PARTIAL MATCHES OR ISSUES (" + partialMatchRestaurants.size() + " restaurants):");
            for (int i = 0; i < partialMatchRestaurants.size(); i++) {
                System.out.println("  " + (i + 1) + ". " + partialMatchRestaurants.get(i));
            }
        }
        
        // แสดงร้านที่ไม่มีข้อมูลโภชนาการทั้งหมด
        if (!noNutritionDataRestaurants.isEmpty()) {
            System.out.println("\n❌ RESTAURANTS WITHOUT NUTRITION DATA (" + noNutritionDataRestaurants.size() + " restaurants):");
            for (int i = 0; i < noNutritionDataRestaurants.size(); i++) {
                System.out.println("  " + (i + 1) + ". " + noNutritionDataRestaurants.get(i));
            }
        }
        
        System.out.println("=".repeat(80));
    }

    // Helper method to get preferred restaurant type
    private String getPreferredRestaurantType(Resource userInstance) {
        Statement stmt = userInstance.getProperty(ResourceFactory.createProperty(NS + "hasRestaurantTypeInterest"));
        if (stmt != null && stmt.getObject().isResource()) {
            Resource resource = stmt.getObject().asResource();
            return formatLocalName(resource.getURI());
        }
        return "Unknown Restaurant Type";
    }

    // Helper method to get the maximum budget from multiple BudgetInterest properties
    private float getMaxBudget(Resource userInstance) {
        float maxBudget = 0;
        StmtIterator budgetIterator = userInstance.listProperties(ResourceFactory.createProperty(NS + "BudgetInterest"));
        while (budgetIterator.hasNext()) {
            Statement budgetStmt = budgetIterator.nextStatement();
            float budgetValue = Float.parseFloat(budgetStmt.getObject().asLiteral().getString());
            if (budgetValue > maxBudget) {
                maxBudget = budgetValue;
            }
        }
        return maxBudget;
    }

    // Helper method to get the preferred cuisine from multiple food type interests
    private String getPreferredCuisine(Resource userInstance) {
        String preferredCuisine = "Unknown Cuisine";
        StmtIterator cuisineIterator = userInstance.listProperties(ResourceFactory.createProperty(NS + "hasFoodTypeInterest"));

        while (cuisineIterator.hasNext()) {
            Statement cuisineStmt = cuisineIterator.nextStatement();
            String cuisine = getCuisineLabel(cuisineStmt.getObject().asResource());

            if (cuisine != null && !cuisine.isEmpty() && !cuisine.equals("Unknown Cuisine")) {
                preferredCuisine = cuisine;
                break; // Take the first valid cuisine found
            }
        }

        return preferredCuisine;
    }

    // Helper method to get the cuisine label from the resource
    private String getCuisineLabel(Resource cuisineResource) {
        if (cuisineResource != null) {
            Statement labelStmt = cuisineResource.getProperty(RDFS.label);
            if (labelStmt != null) {
                return labelStmt.getObject().toString();
            } else {
                return formatLocalName(cuisineResource.getURI());
            }
        }
        return "Unknown Cuisine";
    }

    // Helper method to resolve a URI to a human-readable label
    private String resolveHumanReadableLabel(Model model, String uri) {
        if (uri != null && !uri.equals("N/A")) {
            Resource resource = model.getResource(uri);
            if (resource != null) {
                Statement labelStmt = resource.getProperty(RDFS.label);
                if (labelStmt != null) {
                    return labelStmt.getObject().toString();
                }
                return formatLocalName(uri);
            }
        }
        return "Unknown";
    }

    // Helper method to resolve the cuisine type URI to a human-readable label
    private String getCuisineLabel(Model model, String cuisineTypeURI) {
        if (cuisineTypeURI != null && !cuisineTypeURI.equals("N/A")) {
            Resource cuisineResource = model.getResource(cuisineTypeURI);
            if (cuisineResource != null) {
                Statement labelStmt = cuisineResource.getProperty(RDFS.label);
                if (labelStmt != null) {
                    return labelStmt.getObject().toString();
                } else {
                    return formatLocalName(cuisineTypeURI);
                }
            }
        }
        return "Unknown Cuisine";
    }

    // Helper method to format the local name of a URI
    private String formatLocalName(String uri) {
        String localName = uri.substring(uri.lastIndexOf('#') + 1);
        return localName.replace('_', ' ').trim();
    }

    // Normalization helpers to align UI inputs with ontology local names
    private String normalizeRunnerType(String input) {
        if (input == null) return null;
        // Ontology expects exact string like "Fun run" (lowercase r)
        if (input.equalsIgnoreCase("Fun Run")) return "Fun run";
        return input;
    }

    private String normalizeRestaurantType(String input) {
        if (input == null) return null;
        // Map user-friendly names to ontology local names
        String s = input.trim().toLowerCase();
        if (s.contains("fast") && s.contains("dining")) return "Fast_Dining_Type";
        if (s.contains("casual") && s.contains("dining")) return "Casual_Dining_Type";
        if (s.contains("fine") && s.contains("dining")) return "Fine_Dining_Type";
        if (s.contains("buffet")) return "Buffet_Type";
        if (s.contains("kiosk")) return "Kiosk_Type";
        if (s.contains("street") && s.contains("food")) return "Street_Food_Type";
        if (s.contains("cafe")) return "Cafe_Type";
        return input.replace(' ', '_');
    }

    private String normalizeCuisineType(String input) {
        if (input == null) return null;
        String s = input.trim().toLowerCase();
        if (s.equals("ramen")) return "Ramen_Type";
        if (s.equals("noodles")) return "Noodles_Type";
        if (s.equals("sushi")) return "Sushi_Type";
        if (s.equals("grilledpork") || s.equals("grilled pork")) return "GrilledPork_Type";
        if (s.equals("fastfood") || s.equals("fast food")) return "FastFood_Type";
        if (s.equals("cleanfood salad") || s.equals("clean food salad")) return "CleanFood_Salad_Type";
        if (s.equals("a la carte") || s.equals("alacarte") || s.equals("aLaCarte".toLowerCase())) return "ALaCarte_Type";
        return input.replace(' ', '_');
    }

    // Helper method to safely retrieve the literal value of a statement
    private String getLiteralValue(Statement stmt) {
        if (stmt != null && stmt.getObject().isLiteral()) {
            return stmt.getObject().asLiteral().getString();
        }
        return "N/A";
    }

    // Helper method to get value from either literal or resource
    private String getLiteralOrResourceValue(Statement stmt) {
        if (stmt != null) {
            RDFNode object = stmt.getObject();
            if (object.isLiteral()) {
                return object.asLiteral().getString();
            } else if (object.isResource()) {
                // Try to get label from resource
                Resource resource = object.asResource();
                Statement labelStmt = resource.getProperty(RDFS.label);
                if (labelStmt != null) {
                    return labelStmt.getObject().asLiteral().getString();
                } else {
                    // Return formatted local name
                    return formatLocalName(resource.getURI());
                }
            }
        }
        return "N/A";
    }
}