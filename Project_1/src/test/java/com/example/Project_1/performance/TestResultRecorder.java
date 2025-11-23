package com.example.Project_1.performance;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Utility class for recording test results to files
 */
public class TestResultRecorder {
    
    private static final String RESULTS_DIR = "test-results";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
    
    // Static filename for functional tests - created once per test run
    private static String functionalTestFilename = null;
    private static final Object functionalTestLock = new Object();
    
    /**
     * Initialize functional test filename (call once at the start of test suite)
     */
    public static void initializeFunctionalTestFile() {
        synchronized (functionalTestLock) {
            if (functionalTestFilename == null) {
                try {
                    Path dir = Paths.get(RESULTS_DIR);
                    if (!Files.exists(dir)) {
                        Files.createDirectories(dir);
                    }
                    
                    functionalTestFilename = RESULTS_DIR + "/functional_test_results_" + 
                                            LocalDateTime.now().format(DATE_FORMAT) + ".csv";
                    
                    // Create file with header
                    try (FileWriter writer = new FileWriter(functionalTestFilename, false)) {
                        writer.append("Test Case#,Objective,Result\n");
                    }
                    
                    System.out.println("📝 Initialized functional test file: " + functionalTestFilename);
                } catch (IOException e) {
                    System.err.println("❌ Failed to initialize functional test file: " + e.getMessage());
                }
            }
        }
    }
    
    /**
     * Record functional test results
     */
    public static void recordFunctionalTest(String testCase, String objective, String result) {
        synchronized (functionalTestLock) {
            // Initialize filename if not already done
            if (functionalTestFilename == null) {
                initializeFunctionalTestFile();
            }
            
            try {
                // Append to the same file
                try (FileWriter writer = new FileWriter(functionalTestFilename, true)) {
                    writer.append(String.format("%s,%s,%s\n", testCase, escapeCsv(objective), result));
                }
                
                System.out.println("✅ Recorded: " + testCase + " -> " + result);
            } catch (IOException e) {
                System.err.println("❌ Failed to record functional test: " + e.getMessage());
            }
        }
    }
    
    /**
     * Record performance test results
     */
    public static void recordPerformanceTest(String version, List<PerformanceTestResult> results) {
        try {
            Path dir = Paths.get(RESULTS_DIR);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            
            String filename = RESULTS_DIR + "/performance_test_" + version + "_" + 
                              LocalDateTime.now().format(DATE_FORMAT) + ".csv";
            
            try (FileWriter writer = new FileWriter(filename)) {
                // Write header
                writer.append("Test Case#,Method,Total Requests,Concurrent Requests," +
                             "Duration (ms),Successful Requests,Throughput (req/s)," +
                             "Avg Response Time (ms),Min Response Time (ms),Max Response Time (ms)," +
                             "P95 Response Time (ms),P99 Response Time (ms),Failed Requests,Error Rate(%)\n");
                
                // Write data
                for (PerformanceTestResult result : results) {
                    writer.append(String.format("%d,%s,%d,%d,%d,%d,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%d,%.2f\n",
                        result.testCaseNumber,
                        result.method,
                        result.totalRequests,
                        result.concurrentRequests,
                        result.durationMs,
                        result.successfulRequests,
                        result.throughput,
                        result.avgResponseTime,
                        result.minResponseTime,
                        result.maxResponseTime,
                        result.p95ResponseTime,
                        result.p99ResponseTime,
                        result.failedRequests,
                        result.errorRate
                    ));
                }
            }
            
            System.out.println("✅ Recorded " + results.size() + " performance test results to: " + filename);
        } catch (IOException e) {
            System.err.println("❌ Failed to record performance test: " + e.getMessage());
        }
    }
    
    /**
     * Generate summary report
     */
    public static void generateSummaryReport(String version, List<PerformanceTestResult> results) {
        try {
            Path dir = Paths.get(RESULTS_DIR);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            
            String filename = RESULTS_DIR + "/performance_summary_" + version + "_" + 
                              LocalDateTime.now().format(DATE_FORMAT) + ".txt";
            
            try (FileWriter writer = new FileWriter(filename)) {
                writer.append("=".repeat(80) + "\n");
                writer.append("PERFORMANCE TEST SUMMARY - " + version.toUpperCase() + " VERSION\n");
                writer.append("=".repeat(80) + "\n");
                writer.append("Generated: " + LocalDateTime.now() + "\n\n");
                
                // Group by method
                java.util.Map<String, List<PerformanceTestResult>> byMethod = 
                    results.stream().collect(java.util.stream.Collectors.groupingBy(r -> r.method));
                
                for (java.util.Map.Entry<String, List<PerformanceTestResult>> entry : byMethod.entrySet()) {
                    String method = entry.getKey();
                    List<PerformanceTestResult> methodResults = entry.getValue();
                    
                    writer.append("\n" + method + " Method:\n");
                    writer.append("-".repeat(80) + "\n");
                    
                    double avgThroughput = methodResults.stream()
                        .mapToDouble(r -> r.throughput)
                        .average()
                        .orElse(0.0);
                    double avgResponseTime = methodResults.stream()
                        .mapToDouble(r -> r.avgResponseTime)
                        .average()
                        .orElse(0.0);
                    double avgP95ResponseTime = methodResults.stream()
                        .mapToDouble(r -> r.p95ResponseTime)
                        .average()
                        .orElse(0.0);
                    double avgP99ResponseTime = methodResults.stream()
                        .mapToDouble(r -> r.p99ResponseTime)
                        .average()
                        .orElse(0.0);
                    double avgErrorRate = methodResults.stream()
                        .mapToDouble(r -> r.errorRate)
                        .average()
                        .orElse(0.0);
                    
                    writer.append(String.format("Average Throughput: %.2f requests/second\n", avgThroughput));
                    writer.append(String.format("Average Response Time: %.2f ms\n", avgResponseTime));
                    writer.append(String.format("Average P95 Response Time: %.2f ms\n", avgP95ResponseTime));
                    writer.append(String.format("Average P99 Response Time: %.2f ms\n", avgP99ResponseTime));
                    writer.append(String.format("Average Error Rate: %.2f%%\n", avgErrorRate));
                    writer.append(String.format("Total Test Cases: %d\n", methodResults.size()));
                }
            }
            
            System.out.println("✅ Generated summary report: " + filename);
        } catch (IOException e) {
            System.err.println("❌ Failed to generate summary: " + e.getMessage());
        }
    }
    
    private static String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
    
    /**
     * Data class for performance test results
     */
    public static class PerformanceTestResult {
        public int testCaseNumber;
        public String method;
        public int totalRequests;
        public int concurrentRequests;
        public long durationMs;
        public int successfulRequests;
        public int failedRequests;
        public double throughput;
        public double avgResponseTime;
        public double minResponseTime;
        public double maxResponseTime;
        public double p95ResponseTime;
        public double p99ResponseTime;
        public double errorRate;
    }
}

