package com.example.demo.integration;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import com.example.demo.asset.model.Category;
import com.example.demo.asset.model.License;
import com.example.demo.asset.model.ProjectType;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Widget;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.asset.repository.CategoryRepository;
import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.demo.config.TestSecurityConfig;
import com.example.review.repository.ReviewCommentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Rollback
@Import(TestSecurityConfig.class)
public class ReviewIntegTest {
	//@Autowired private MockMvc mockMvc;
	//  @Autowired private ObjectMapper objectMapper;
	//  @Autowired private AuthRepository userRepository;
	//  @Autowired private AssetRepository assetRepository;
	//  @Autowired private ReviewCommentRepository reviewRepo;
	//  @Autowired private CategoryRepository categoryRepo;

	//  private String assetId;
	//  private Long userId;
	// private String testEmail;
    // @BeforeEach
	// void setup() {
	//    User user = new User();
	//     testEmail = "testuser_" + System.currentTimeMillis();
	//     user.setEmail(testEmail);
	//     user.setFirstName("Test");
	//     user.setLastName("User");
	//   user.setRole(Role.USER);
        //  userRepository.save(user);
	//   userId = user.getId();
	//    User publisher = new User();
	//    publisher.setEmail("publisher@mail.com");
	//   publisher.setFirstName("Publisher");
	//   publisher.setLastName("User");
	//   publisher.setRole(Role.USER); 
	//   userRepository.save(publisher);
	//  Widget asset = new Widget();
	//   asset.setId("test_asset_" + System.currentTimeMillis());
	//   asset.setName("Test Asset");
	//    asset.setLabel("Label");
	//    asset.setPublisher("admin");
	//    asset.setPublisherMail("admin@gmail.com");
	//    asset.setLicense(License.FREE);
	//   asset.setStatus(Status.PUBLISHED);
	//   asset.setProjectType(ProjectType.BACKEND);
	//   assetRepository.save(asset);
	//   assetId = asset.getId();
	// }
	//  @Test
	// void testAddReview() throws Exception {
	//   String reviewJson = """
	//    {
	//           "assetId": "%s",
	//           "comment": "This is a great asset!"
	//       }
	//   """.formatted(assetId);

	//  mockMvc.perform(post("/api/reviews/add")
	//   		.with(user(testEmail).roles("USER"))
	//          .contentType(MediaType.APPLICATION_JSON)
	//          .content(reviewJson))
	//           .andExpect(status().isOk())
	//           .andExpect(jsonPath("$.comment").value("This is a great asset!"))
	//           .andExpect(jsonPath("$.assetId").value(assetId));
	//   }
	//}
}