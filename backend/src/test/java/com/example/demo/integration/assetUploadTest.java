package com.example.demo.integration;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

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
import com.example.demo.dto.AssetRequest;
import com.example.demo.notification.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Rollback
@Import(TestSecurityConfig.class)
public class assetUploadTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AssetRepository assetRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private AuthRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    @BeforeEach
    void setup() {
    	notificationRepository.deleteAll();
        userRepository.deleteAll(); // ✅ Wipe test users before inserting

        // 🧪 insert dummy user that matches `.with(user("testuser"))`
        User testUser = new User();
        testUser.setEmail("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(Role.CONTRIBUTOR);
        userRepository.save(testUser);
    }

    @Test
    public void testUploadWidgetAsset() throws Exception {
        // 🧪 insert dummy category
        Category category = new Category();
        category.setName("Test Category");
        category = categoryRepository.save(category);

        AssetRequest assetRequest = new AssetRequest();
        assetRequest.setType("Widget");
        assetRequest.setName("TestWidget");
        assetRequest.setLabel("Test Widget");
        assetRequest.setPublisher("admin");
        assetRequest.setPublisherMail("admin@gmail.com");
        assetRequest.setProjectType(ProjectType.BACKEND);
        assetRequest.setStatus("PUBLISHED");
        assetRequest.setLicense(License.FREE);
        assetRequest.setTagIds(List.of());
        assetRequest.setCategoryIds(List.of(category.getId()));

        String assetJson = objectMapper.writeValueAsString(assetRequest);

        mockMvc.perform(
                multipart("/api/assets")
                    .file(new MockMultipartFile(
                        "request",
                        "",
                        MediaType.APPLICATION_JSON_VALUE,
                        assetJson.getBytes()
                    ))
                    .with(user("testuser").roles("CONTRIBUTOR")) 
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .characterEncoding("UTF-8")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.label").value("Test Widget"))
            .andExpect(jsonPath("$.type").value("Widget"));
    }



}
