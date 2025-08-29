package com.powar.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class PythonApiClient {
    
    private static final Logger logger = LoggerFactory.getLogger(PythonApiClient.class);
    
    private final RestTemplate restTemplate;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    @Value("${python.api.base-url}")
    private String pythonApiBaseUrl;
    
    public PythonApiClient(RestTemplate restTemplate, WebClient webClient) {
        this.restTemplate = restTemplate;
        this.webClient = webClient;
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Fetch all members from Python API and format for frontend
     */
    public Map<String, Object> getAllMembers() {
        try {
            String url = pythonApiBaseUrl + "/api/python/members";
            logger.info("Fetching members from Python API: {}", url);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                
                // Format the response for frontend consumption
                Map<String, Object> formattedResponse = new HashMap<>();
                formattedResponse.put("success", true);
                formattedResponse.put("message", "Members data retrieved successfully");
                formattedResponse.put("data", jsonResponse.get("data"));
                formattedResponse.put("count", jsonResponse.get("count"));
                formattedResponse.put("source", "python-backend");
                
                logger.info("Successfully fetched {} members from Python API", jsonResponse.get("count"));
                return formattedResponse;
                
            } else {
                logger.error("Failed to fetch members from Python API. Status: {}", response.getStatusCode());
                return createErrorResponse("Failed to fetch members from Python API");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching members from Python API", e);
            return createErrorResponse("Error communicating with Python API: " + e.getMessage());
        }
    }
    
    /**
     * Fetch member details from Python API and format for frontend
     */
    public Map<String, Object> getMemberDetails(Long memberId) {
        try {
            String url = pythonApiBaseUrl + "/api/python/members/" + memberId;
            logger.info("Fetching member details from Python API: {}", url);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                
                // Format the response for frontend consumption
                Map<String, Object> formattedResponse = new HashMap<>();
                formattedResponse.put("success", true);
                formattedResponse.put("message", "Member details retrieved successfully");
                formattedResponse.put("data", jsonResponse.get("data"));
                formattedResponse.put("source", "python-backend");
                
                logger.info("Successfully fetched member details for ID: {}", memberId);
                return formattedResponse;
                
            } else {
                logger.error("Failed to fetch member details from Python API. Status: {}", response.getStatusCode());
                return createErrorResponse("Failed to fetch member details from Python API");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching member details from Python API", e);
            return createErrorResponse("Error communicating with Python API: " + e.getMessage());
        }
    }
    
    /**
     * Fetch all blogs from Python API and format for frontend
     */
    public Map<String, Object> getAllBlogs() {
        try {
            String url = pythonApiBaseUrl + "/api/python/blogs";
            logger.info("Fetching blogs from Python API: {}", url);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                
                // Format the response for frontend consumption
                Map<String, Object> formattedResponse = new HashMap<>();
                formattedResponse.put("success", true);
                formattedResponse.put("message", "Blogs data retrieved successfully");
                formattedResponse.put("data", jsonResponse.get("data"));
                formattedResponse.put("count", jsonResponse.get("count"));
                formattedResponse.put("source", "python-backend");
                
                logger.info("Successfully fetched {} blogs from Python API", jsonResponse.get("count"));
                return formattedResponse;
                
            } else {
                logger.error("Failed to fetch blogs from Python API. Status: {}", response.getStatusCode());
                return createErrorResponse("Failed to fetch blogs from Python API");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching blogs from Python API", e);
            return createErrorResponse("Error communicating with Python API: " + e.getMessage());
        }
    }
    
    /**
     * Fetch blog details from Python API and format for frontend
     */
    public Map<String, Object> getBlogDetails(Long blogId) {
        try {
            String url = pythonApiBaseUrl + "/api/python/blogs/" + blogId;
            logger.info("Fetching blog details from Python API: {}", url);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                
                // Format the response for frontend consumption
                Map<String, Object> formattedResponse = new HashMap<>();
                formattedResponse.put("success", true);
                formattedResponse.put("message", "Blog details retrieved successfully");
                formattedResponse.put("data", jsonResponse.get("data"));
                formattedResponse.put("source", "python-backend");
                
                logger.info("Successfully fetched blog details for ID: {}", blogId);
                return formattedResponse;
                
            } else {
                logger.error("Failed to fetch blog details from Python API. Status: {}", response.getStatusCode());
                return createErrorResponse("Failed to fetch blog details from Python API");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching blog details from Python API", e);
            return createErrorResponse("Error communicating with Python API: " + e.getMessage());
        }
    }
    
    /**
     * Fetch all communities from Python API and format for frontend
     */
    public Map<String, Object> getAllCommunities() {
        try {
            String url = pythonApiBaseUrl + "/api/python/communities";
            logger.info("Fetching communities from Python API: {}", url);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                
                // Format the response for frontend consumption
                Map<String, Object> formattedResponse = new HashMap<>();
                formattedResponse.put("success", true);
                formattedResponse.put("message", "Communities data retrieved successfully");
                formattedResponse.put("data", jsonResponse.get("data"));
                formattedResponse.put("count", jsonResponse.get("count"));
                formattedResponse.put("source", "python-backend");
                
                logger.info("Successfully fetched {} communities from Python API", jsonResponse.get("count"));
                return formattedResponse;
                
            } else {
                logger.error("Failed to fetch communities from Python API. Status: {}", response.getStatusCode());
                return createErrorResponse("Failed to fetch communities from Python API");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching communities from Python API", e);
            return createErrorResponse("Error communicating with Python API: " + e.getMessage());
        }
    }
    
    /**
     * Fetch analytics data from Python API and format for frontend
     */
    public Map<String, Object> getAnalytics() {
        try {
            String url = pythonApiBaseUrl + "/api/python/analytics";
            logger.info("Fetching analytics from Python API: {}", url);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                
                // Format the response for frontend consumption
                Map<String, Object> formattedResponse = new HashMap<>();
                formattedResponse.put("success", true);
                formattedResponse.put("message", "Analytics data retrieved successfully");
                formattedResponse.put("data", jsonResponse.get("data"));
                formattedResponse.put("source", "python-backend");
                
                logger.info("Successfully fetched analytics data from Python API");
                return formattedResponse;
                
            } else {
                logger.error("Failed to fetch analytics from Python API. Status: {}", response.getStatusCode());
                return createErrorResponse("Failed to fetch analytics from Python API");
            }
            
        } catch (Exception e) {
            logger.error("Error fetching analytics from Python API", e);
            return createErrorResponse("Error communicating with Python API: " + e.getMessage());
        }
    }
    
    /**
     * Health check for Python API
     */
    public Mono<Map<String, Object>> checkPythonApiHealth() {
        return webClient.get()
                .uri(pythonApiBaseUrl + "/api/python/health")
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> healthResponse = new HashMap<>();
                    healthResponse.put("success", true);
                    healthResponse.put("python_api_status", response.get("status"));
                    healthResponse.put("message", "Python API is healthy");
                    return healthResponse;
                })
                .onErrorResume(e -> {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("python_api_status", "unhealthy");
                    errorResponse.put("message", "Python API is not responding: " + e.getMessage());
                    return Mono.just(errorResponse);
                });
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("source", "python-backend");
        return errorResponse;
    }
}
