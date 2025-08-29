package com.powar.controller;

import com.powar.service.PythonApiClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataController {
    
    private static final Logger logger = LoggerFactory.getLogger(DataController.class);
    
    private final PythonApiClient pythonApiClient;
    
    @Autowired
    public DataController(PythonApiClient pythonApiClient) {
        this.pythonApiClient = pythonApiClient;
    }
    
    /**
     * Get all members (fetched from Python API and formatted by Java)
     */
    @GetMapping("/members")
    public ResponseEntity<Map<String, Object>> getAllMembers() {
        try {
            logger.info("Fetching all members through Java backend");
            
            Map<String, Object> membersData = pythonApiClient.getAllMembers();
            
            if ((Boolean) membersData.get("success")) {
                logger.info("Successfully retrieved and formatted members data");
                return ResponseEntity.ok(membersData);
            } else {
                logger.error("Failed to retrieve members data: {}", membersData.get("message"));
                return ResponseEntity.badRequest().body(membersData);
            }
            
        } catch (Exception e) {
            logger.error("Error in members endpoint", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Get member details by ID (fetched from Python API and formatted by Java)
     */
    @GetMapping("/members/{memberId}")
    public ResponseEntity<Map<String, Object>> getMemberDetails(@PathVariable Long memberId) {
        try {
            logger.info("Fetching member details for ID: {} through Java backend", memberId);
            
            Map<String, Object> memberData = pythonApiClient.getMemberDetails(memberId);
            
            if ((Boolean) memberData.get("success")) {
                logger.info("Successfully retrieved and formatted member details for ID: {}", memberId);
                return ResponseEntity.ok(memberData);
            } else {
                logger.error("Failed to retrieve member details: {}", memberData.get("message"));
                return ResponseEntity.badRequest().body(memberData);
            }
            
        } catch (Exception e) {
            logger.error("Error in member details endpoint", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Get all blogs (fetched from Python API and formatted by Java)
     */
    @GetMapping("/blogs")
    public ResponseEntity<Map<String, Object>> getAllBlogs() {
        try {
            logger.info("Fetching all blogs through Java backend");
            
            Map<String, Object> blogsData = pythonApiClient.getAllBlogs();
            
            if ((Boolean) blogsData.get("success")) {
                logger.info("Successfully retrieved and formatted blogs data");
                return ResponseEntity.ok(blogsData);
            } else {
                logger.error("Failed to retrieve blogs data: {}", blogsData.get("message"));
                return ResponseEntity.badRequest().body(blogsData);
            }
            
        } catch (Exception e) {
            logger.error("Error in blogs endpoint", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Get blog details by ID (fetched from Python API and formatted by Java)
     */
    @GetMapping("/blogs/{blogId}")
    public ResponseEntity<Map<String, Object>> getBlogDetails(@PathVariable Long blogId) {
        try {
            logger.info("Fetching blog details for ID: {} through Java backend", blogId);
            
            Map<String, Object> blogData = pythonApiClient.getBlogDetails(blogId);
            
            if ((Boolean) blogData.get("success")) {
                logger.info("Successfully retrieved and formatted blog details for ID: {}", blogId);
                return ResponseEntity.ok(blogData);
            } else {
                logger.error("Failed to retrieve blog details: {}", blogData.get("message"));
                return ResponseEntity.badRequest().body(blogData);
            }
            
        } catch (Exception e) {
            logger.error("Error in blog details endpoint", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Get all communities (fetched from Python API and formatted by Java)
     */
    @GetMapping("/communities")
    public ResponseEntity<Map<String, Object>> getAllCommunities() {
        try {
            logger.info("Fetching all communities through Java backend");
            
            Map<String, Object> communitiesData = pythonApiClient.getAllCommunities();
            
            if ((Boolean) communitiesData.get("success")) {
                logger.info("Successfully retrieved and formatted communities data");
                return ResponseEntity.ok(communitiesData);
            } else {
                logger.error("Failed to retrieve communities data: {}", communitiesData.get("message"));
                return ResponseEntity.badRequest().body(communitiesData);
            }
            
        } catch (Exception e) {
            logger.error("Error in communities endpoint", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Get analytics data (fetched from Python API and formatted by Java)
     */
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        try {
            logger.info("Fetching analytics data through Java backend");
            
            Map<String, Object> analyticsData = pythonApiClient.getAnalytics();
            
            if ((Boolean) analyticsData.get("success")) {
                logger.info("Successfully retrieved and formatted analytics data");
                return ResponseEntity.ok(analyticsData);
            } else {
                logger.error("Failed to retrieve analytics data: {}", analyticsData.get("message"));
                return ResponseEntity.badRequest().body(analyticsData);
            }
            
        } catch (Exception e) {
            logger.error("Error in analytics endpoint", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Health check for Python API through Java backend
     */
    @GetMapping("/health/python")
    public ResponseEntity<Map<String, Object>> checkPythonApiHealth() {
        try {
            logger.info("Checking Python API health through Java backend");
            
            return pythonApiClient.checkPythonApiHealth()
                    .map(healthData -> {
                        logger.info("Python API health check completed");
                        return ResponseEntity.ok(healthData);
                    })
                    .block();
                    
        } catch (Exception e) {
            logger.error("Error in Python API health check", e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error checking Python API health: " + e.getMessage(),
                "source", "java-backend"
            );
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
