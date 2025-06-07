package com.example.demo.integration;


import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.License;
import com.example.demo.asset.model.ProjectType;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Widget;
import com.example.demo.asset.repository.AssetReleaseRepository;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.demo.config.TestSecurityConfig;
import com.example.demo.dto.RatingRequest;
import com.example.demo.notification.NotificationRepository;
import com.example.review.model.ReviewComment;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.transaction.Transactional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Rollback
@Import(TestSecurityConfig.class)
public class RatingIntegTest {
	  @Autowired private MockMvc mockMvc;
	    @Autowired private ObjectMapper objectMapper;
	    @Autowired private AssetRepository assetRepository;
	    @Autowired private AuthRepository userRepository;

	    private Long userId;
	    private String assetId;
	    private String testEmail;
	  //  @BeforeEach
	   // void setup() {
	        // ✅ Insert unique test user
	     
	    //User user = new User();
	      //  testEmail = "testuser_" + System.currentTimeMillis(); // ✅ initialize it
	    // user.setEmail(testEmail);
	    // user.setFirstName("Test");
	    // user.setLastName("User");
	    // user.setRole(Role.USER);
	    //  userRepository.save(user);
	    //  userId = user.getId();

	    //   Widget asset = new Widget();
	    //   asset.setId("test_asset_" + System.currentTimeMillis());
	    //   asset.setName("Test Asset");
	    //   asset.setLabel("Label");
	    //   asset.setPublisher("admin");
	    //   asset.setPublisherMail("admin@gmail.com");
	    //    asset.setLicense(License.FREE);
	        //   asset.setStatus(Status.PUBLISHED);
	    //   asset.setProjectType(ProjectType.BACKEND);
	    //   assetRepository.save(asset);
	    //   assetId = asset.getId();
	    //  }

	    //  @Test
	    //  void testSubmitRating() throws Exception {
	    //    RatingRequest request = new RatingRequest();
	    //    request.setUserId(userId);
	    //    request.setAssetId(assetId);
	    //   request.setFunctionality(5);
	    //   request.setPerformance(4);
	    //   request.setIntegration(3);
	    //   request.setDocumentation(5);

	    //  String payload = objectMapper.writeValueAsString(request);

	    //  mockMvc.perform(post("/api/ratings/rate")
	    //         .contentType(MediaType.APPLICATION_JSON)
	    //         .content(payload)
	    //         .with(user("testuser").roles("USER"))) // This must match SecurityConfig
	    //     .andExpect(status().isOk())
	    //     .andExpect(jsonPath("$.message").value("Rating submitted successfully"));
	    //  }
	    
	    
	   

}
