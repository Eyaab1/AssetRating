package com.example.demo.integration;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;

import com.example.demo.config.TestSecurityConfig;
import com.example.demo.dto.RatingRequest;

import jakarta.transaction.Transactional;
import com.example.demo.asset.model.*;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.review.model.ReviewComment;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;


import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Rollback
@Import(TestSecurityConfig.class)
public class ReviewInteractionTest {
	//@Autowired private MockMvc mockMvc;
	//  @Autowired private ObjectMapper objectMapper;
	// @Autowired private AuthRepository userRepository;
	// @Autowired private AssetRepository assetRepository;

	// private Long userId;
	// private String assetId;
	// private String testEmail;

	// @BeforeEach
	// void setup() {
        // Test user
	//     User user = new User();
	//     testEmail = "user_" + System.currentTimeMillis();
	//     user.setEmail(testEmail);
        //    user.setFirstName("Test");
	//    user.setLastName("User");
        //    user.setRole(Role.USER);
	//   userRepository.save(user);
	//    userId = user.getId();
        //
        //
	//    User publisher = new User();
	//     publisher.setEmail("publisher@mail.com");
	//   publisher.setFirstName("Publisher");
	//   publisher.setLastName("User");
	//   publisher.setRole(Role.USER); // Or CONTRIBUTOR
	//  userRepository.save(publisher);

	//   // Asset with publisher
	//   Widget asset = new Widget();
	//   asset.setId("asset_" + System.currentTimeMillis());
	//  asset.setName("Sample");
	//    asset.setLabel("Label");
	//   asset.setPublisher("admin");
	//    asset.setPublisherMail("admin@gmail.com");
	//    asset.setLicense(License.FREE);
	//    asset.setStatus(Status.PUBLISHED);
        //    asset.setProjectType(ProjectType.BACKEND);
	//    assetRepository.save(asset);
        //    assetId = asset.getId();
	//  }


    
	//   @Test
	// @DisplayName("likeed a comment successfully")
	//
	// void testLikeReview() throws Exception {
        
	// String reviewJson = """
	//     {
	//      "assetId": "%s",
              //       "comment": "Will be liked"
	//       }
	//   """.formatted(assetId);
	//
	//   String response = mockMvc.perform(post("/api/reviews/add")
	//           .with(user(testEmail).roles("USER"))
	//          .contentType(MediaType.APPLICATION_JSON)
	//          .content(reviewJson))
	//       .andExpect(status().isOk())
	//        .andReturn().getResponse().getContentAsString();
	//
	//    ReviewComment review = objectMapper.readValue(response, ReviewComment.class);
        //
        // ✅ Like the review
	//     mockMvc.perform(post("/api/reviews/" + review.getId() + "/like")
	//             .with(user(testEmail).roles("USER")))
	//           .andExpect(status().isOk());
            //          //
	//   }

	//  @Test
    // @DisplayName("reply to a comment successfully")
	//void testReplyToReview() throws Exception {
	//    String reviewJson = """
	//        {
	//           "assetId": "%s",
	//            "comment": "Original review"
	//           }
	//       """.formatted(assetId);

	//       String response = mockMvc.perform(post("/api/reviews/add")
	//           .with(user(testEmail).roles("USER"))
	//           .contentType(MediaType.APPLICATION_JSON)
	//           .content(reviewJson))
	//        .andExpect(status().isOk())
            //        .andReturn()
	//        .getResponse()
	//         .getContentAsString();

	//  ReviewComment parent = objectMapper.readValue(response, ReviewComment.class);

      
	//  String replyJson = """
	//    {
            	//      "assetId": "%s",
	//    "comment": "This is a reply"
	//     }
	//  """.formatted(assetId);

	//  mockMvc.perform(post("/api/reviews/" + parent.getId() + "/reply")
	//           .with(user(testEmail).roles("USER"))
	//            .contentType(MediaType.APPLICATION_JSON)
	//             .content(replyJson))
	//         .andExpect(status().isOk());
	//  }
    
	// @Test
	//  @DisplayName("report a comment successfully")
	// void testReportReview() throws Exception {
	//  
	//   String reviewJson = """
	//      {
	//         "assetId": "%s",
	//        "comment": "Inappropriate content"
	//      }
	//  """.formatted(assetId);

	//  String response = mockMvc.perform(post("/api/reviews/add")
	//          .with(user(testEmail).roles("USER"))
	//         .contentType(MediaType.APPLICATION_JSON)
	//          .content(reviewJson))
//     .andExpect(status().isOk())
	//    .andReturn()
	//    .getResponse()
	//    .getContentAsString();

	// ReviewComment review = objectMapper.readValue(response, ReviewComment.class);
	//
	//  
	// String reportPayload = """
	//    {
	//      "reason": "Contains offensive language"
	//     }
	//  """;
	//
	// mockMvc.perform(post("/api/reviews/" + review.getId() + "/report")
	//          .with(user(testEmail).roles("USER"))
	//           .contentType(MediaType.APPLICATION_JSON)
	//           .content(reportPayload))
	//       .andExpect(status().isOk())
	//        .andExpect(jsonPath("$.message").value("Review reported successfully."));
	//  }

    
    
   
}
