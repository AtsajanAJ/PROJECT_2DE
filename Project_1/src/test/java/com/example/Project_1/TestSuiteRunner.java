package com.example.Project_1;

import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;

/**
 * Test Suite Runner - Runs tests in order:
 * 1. Functional Test
 * 2. Performance Test Initial
 * 3. Performance Test Improved
 * 
 * Usage: mvn test -Dtest=TestSuiteRunner
 */
@Suite
@SuiteDisplayName("Complete Test Suite - Functional and Performance")
@SelectPackages({
    "com.example.Project_1.controller",
    "com.example.Project_1.performance"
})
public class TestSuiteRunner {
    // This class serves as a test suite container
    // Runs all tests in controller and performance packages
}

