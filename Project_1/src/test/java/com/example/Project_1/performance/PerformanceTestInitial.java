package com.example.Project_1.performance;

import com.example.Project_1.dto.RestaurantRecommendationRequest;
import com.example.Project_1.service.RestaurantService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Performance Testing - Initial Version
 * Records results to CSV file
 */
@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class PerformanceTestInitial {

    @Autowired
    protected RestaurantService restaurantService;

    protected static final List<TestResultRecorder.PerformanceTestResult> testResults = new ArrayList<>();
    private static final ExecutorService executorService = Executors.newCachedThreadPool();

    // Test configurations
    private static final int[] TOTAL_REQUESTS = {500, 1000, 2000, 3000, 5000};
    private static final int[] CONCURRENT_REQUESTS_REMOVE = {5, 10, 20};
    private static final int[] CONCURRENT_REQUESTS_REPLACE = {10, 20, 30};
    private static final int[] CONCURRENT_REQUESTS_RELOAD = {20, 30, 50};
    
    // Additional test configurations
    private static final String[] RUNNER_TYPES = {"Sprint", "Half Marathon", "Marathon", "Ultra Marathon"};
    private static final float[] BUDGET_LEVELS = {200.0f, 500.0f, 1000.0f, 2000.0f};

    @BeforeAll
    static void setUp() {
        System.out.println("=".repeat(80));
        System.out.println("PERFORMANCE TESTING - INITIAL VERSION");
        System.out.println("=".repeat(80));
    }

    @Test
    @Order(1)
    @DisplayName("Performance Test: Remove Method")
    void testRemoveMethod_Performance() throws Exception {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("TESTING REMOVE METHOD");
        System.out.println("=".repeat(80));

        int testCaseNumber = 1;

        for (int totalReq : TOTAL_REQUESTS) {
            for (int concurrent : CONCURRENT_REQUESTS_REMOVE) {
                TestResultRecorder.PerformanceTestResult result = performLoadTest(
                    testCaseNumber++, "Remove", totalReq, concurrent,
                    () -> testRemoveMethod()
                );
                testResults.add(result);
                printResult(result);
            }
        }
    }

    @Test
    @Order(2)
    @DisplayName("Performance Test: Replace Method")
    void testReplaceMethod_Performance() throws Exception {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("TESTING REPLACE METHOD");
        System.out.println("=".repeat(80));

        int testCaseNumber = 16;

        for (int totalReq : TOTAL_REQUESTS) {
            for (int concurrent : CONCURRENT_REQUESTS_REPLACE) {
                TestResultRecorder.PerformanceTestResult result = performLoadTest(
                    testCaseNumber++, "Replace", totalReq, concurrent,
                    () -> testReplaceMethod()
                );
                testResults.add(result);
                printResult(result);
            }
        }
    }

    @Test
    @Order(3)
    @DisplayName("Performance Test: Reload Method")
    void testReloadMethod_Performance() throws Exception {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("TESTING RELOAD METHOD");
        System.out.println("=".repeat(80));

        int testCaseNumber = 31;

        for (int totalReq : TOTAL_REQUESTS) {
            for (int concurrent : CONCURRENT_REQUESTS_RELOAD) {
                TestResultRecorder.PerformanceTestResult result = performLoadTest(
                    testCaseNumber++, "Reload", totalReq, concurrent,
                    () -> testReloadMethod()
                );
                testResults.add(result);
                printResult(result);
            }
        }
    }

    @Test
    @Order(4)
    @DisplayName("Performance Test: Different Runner Types")
    void testDifferentRunnerTypes_Performance() throws Exception {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("TESTING DIFFERENT RUNNER TYPES");
        System.out.println("=".repeat(80));

        int testCaseNumber = 46;

        for (String runnerType : RUNNER_TYPES) {
            for (int totalReq : new int[]{1000, 2000}) { // Use smaller load for variety tests
                TestResultRecorder.PerformanceTestResult result = performLoadTest(
                    testCaseNumber++, "Remove_" + runnerType, totalReq, 10,
                    () -> testRemoveMethodWithRunnerType(runnerType)
                );
                testResults.add(result);
                printResult(result);
            }
        }
    }

    @Test
    @Order(5)
    @DisplayName("Performance Test: Different Budget Levels")
    void testDifferentBudgetLevels_Performance() throws Exception {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("TESTING DIFFERENT BUDGET LEVELS");
        System.out.println("=".repeat(80));

        int testCaseNumber = 54;

        for (float budget : BUDGET_LEVELS) {
            for (int totalReq : new int[]{1000, 2000}) {
                TestResultRecorder.PerformanceTestResult result = performLoadTest(
                    testCaseNumber++, "Remove_Budget_" + (int)budget, totalReq, 10,
                    () -> testRemoveMethodWithBudget(budget)
                );
                testResults.add(result);
                printResult(result);
            }
        }
    }

    @Test
    @Order(6)
    @DisplayName("Performance Test: Stress Test - Peak Load")
    void testStressTest_PeakLoad() throws Exception {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("STRESS TEST - PEAK LOAD");
        System.out.println("=".repeat(80));

        int testCaseNumber = 62;
        int[] stressLoads = {5000, 10000};
        int[] stressConcurrent = {50, 100};

        for (int totalReq : stressLoads) {
            for (int concurrent : stressConcurrent) {
                TestResultRecorder.PerformanceTestResult result = performLoadTest(
                    testCaseNumber++, "Remove_Stress", totalReq, concurrent,
                    () -> testRemoveMethod(),
                    15, TimeUnit.MINUTES // Extended timeout for stress tests
                );
                testResults.add(result);
                printResult(result);
            }
        }
    }

    private TestResultRecorder.PerformanceTestResult performLoadTest(
            int testCaseNumber, String method, 
            int totalRequests, int concurrentRequests,
            Runnable testAction) throws Exception {
        return performLoadTest(testCaseNumber, method, totalRequests, concurrentRequests, testAction, 10, TimeUnit.MINUTES);
    }

    private TestResultRecorder.PerformanceTestResult performLoadTest(
            int testCaseNumber, String method, 
            int totalRequests, int concurrentRequests,
            Runnable testAction, long timeout, TimeUnit timeUnit) throws Exception {
        
        long startTime = System.currentTimeMillis();
        List<Long> responseTimes = Collections.synchronizedList(new ArrayList<>());
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        int requestsPerThread = totalRequests / concurrentRequests;
        int remainingRequests = totalRequests % concurrentRequests;

        CountDownLatch latch = new CountDownLatch(concurrentRequests);
        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < concurrentRequests; i++) {
            int requestsForThisThread = requestsPerThread + (i < remainingRequests ? 1 : 0);
            
            Future<?> future = executorService.submit(() -> {
                try {
                    for (int j = 0; j < requestsForThisThread; j++) {
                        long requestStart = System.currentTimeMillis();
                        try {
                            testAction.run();
                            long requestEnd = System.currentTimeMillis();
                            responseTimes.add(requestEnd - requestStart);
                            successCount.incrementAndGet();
                        } catch (Exception e) {
                            failCount.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
            futures.add(future);
        }

        latch.await(timeout, timeUnit);

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Calculate metrics
        double throughput = duration > 0 ? (successCount.get() * 1000.0) / duration : 0.0;
        double errorRate = totalRequests > 0 ? (failCount.get() * 100.0) / totalRequests : 0.0;
        
        // Calculate response time statistics
        Collections.sort(responseTimes);
        double avgResponseTime = responseTimes.stream()
            .mapToLong(Long::longValue)
            .average()
            .orElse(0.0);
        double minResponseTime = responseTimes.isEmpty() ? 0.0 : responseTimes.get(0);
        double maxResponseTime = responseTimes.isEmpty() ? 0.0 : responseTimes.get(responseTimes.size() - 1);
        
        // Calculate percentiles
        double p95ResponseTime = calculatePercentile(responseTimes, 95.0);
        double p99ResponseTime = calculatePercentile(responseTimes, 99.0);

        TestResultRecorder.PerformanceTestResult result = 
            new TestResultRecorder.PerformanceTestResult();
        result.testCaseNumber = testCaseNumber;
        result.method = method;
        result.totalRequests = totalRequests;
        result.concurrentRequests = concurrentRequests;
        result.durationMs = duration;
        result.successfulRequests = successCount.get();
        result.failedRequests = failCount.get();
        result.throughput = throughput;
        result.avgResponseTime = avgResponseTime;
        result.minResponseTime = minResponseTime;
        result.maxResponseTime = maxResponseTime;
        result.p95ResponseTime = p95ResponseTime;
        result.p99ResponseTime = p99ResponseTime;
        result.errorRate = errorRate;

        return result;
    }

    protected void testRemoveMethod() {
        RestaurantRecommendationRequest request = createTestRequest();
        restaurantService.getRestaurantRecommendationsRemove(request);
    }

    protected void testReplaceMethod() {
        RestaurantRecommendationRequest request = createTestRequest();
        restaurantService.getRestaurantRecommendationsReplace(request);
    }

    protected void testReloadMethod() {
        RestaurantRecommendationRequest request = createTestRequest();
        restaurantService.getRestaurantRecommendationsReload(request);
    }

    protected RestaurantRecommendationRequest createTestRequest() {
        RestaurantRecommendationRequest request = new RestaurantRecommendationRequest();
        request.setUserId("perftest_" + Thread.currentThread().getId());
        request.setRunnerType("Marathon");
        request.setMaxBudget(500.0f);
        request.setPreferredCuisines(Arrays.asList("Japanese", "Thai"));
        request.setPreferredRestaurantTypes(Arrays.asList("Fast Dining"));
        return request;
    }

    protected void testRemoveMethodWithRunnerType(String runnerType) {
        RestaurantRecommendationRequest request = createTestRequest();
        request.setRunnerType(runnerType);
        restaurantService.getRestaurantRecommendationsRemove(request);
    }

    protected void testRemoveMethodWithBudget(float budget) {
        RestaurantRecommendationRequest request = createTestRequest();
        request.setMaxBudget(budget);
        restaurantService.getRestaurantRecommendationsRemove(request);
    }

    private double calculatePercentile(List<Long> sortedList, double percentile) {
        if (sortedList.isEmpty()) return 0.0;
        int index = (int) Math.ceil((percentile / 100.0) * sortedList.size()) - 1;
        index = Math.max(0, Math.min(index, sortedList.size() - 1));
        return sortedList.get(index);
    }

    private void printResult(TestResultRecorder.PerformanceTestResult result) {
        System.out.printf(
            "Test Case #%d | Method: %s | Total: %d | Concurrent: %d | " +
            "Duration: %d ms | Success: %d | Failed: %d | " +
            "Throughput: %.2f req/s | Avg RT: %.2f ms | Min: %.2f ms | Max: %.2f ms | " +
            "P95: %.2f ms | P99: %.2f ms | Error Rate: %.2f%%%n",
            result.testCaseNumber, result.method, result.totalRequests,
            result.concurrentRequests, result.durationMs,
            result.successfulRequests, result.failedRequests, 
            result.throughput, result.avgResponseTime, result.minResponseTime,
            result.maxResponseTime, result.p95ResponseTime, result.p99ResponseTime, result.errorRate
        );
    }

    @AfterAll
    static void generateReport() {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("RECORDING RESULTS...");
        System.out.println("=".repeat(80));
        
        // Record to CSV
        TestResultRecorder.recordPerformanceTest("initial", testResults);
        
        // Generate summary
        TestResultRecorder.generateSummaryReport("initial", testResults);
        
        executorService.shutdown();
        
        System.out.println("=".repeat(80));
        System.out.println("PERFORMANCE TESTING (INITIAL) COMPLETED");
        System.out.println("Results saved to: test-results/performance_test_initial_*.csv");
        System.out.println("=".repeat(80));
    }
}

