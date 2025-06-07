package com.example.demo.integration;


import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.demo.config.TestSecurityConfig;
import com.example.demo.notification.Notification;
import com.example.demo.notification.NotificationRepository;
import com.example.demo.notification.NotificationType;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)

public class NotificationIntegTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private AuthRepository authRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private final String TEST_EMAIL = "abdellaeya@gmail.com";
    private final String TEST_PASSWORD = "test123";
    private User testUser;
    private Notification testNotification;

    @BeforeEach
    public void setup() {
     

        testUser = new User();
        testUser.setEmail(TEST_EMAIL);
        testUser.setPassword(passwordEncoder.encode(TEST_PASSWORD));
        testUser.setFirstName("Eya");
        testUser.setLastName("Test");
        testUser.setRole(Role.USER);
        testUser = authRepository.save(testUser);

        testNotification = new Notification();
        testNotification.setId(UUID.randomUUID().toString());
        testNotification.setContent("This is a JWT test notification");
        testNotification.setCreatedAt(new Date());
        testNotification.setRecipient(testUser);
        testNotification.setRead(false);
        testNotification.setType(NotificationType.REVIEW_ADDED);
        testNotification.setRelatedAssetId("asset-abc");
        testNotification.setRelatedEntityId("review-xyz");
        notificationRepository.save(testNotification);
    }

    private String getToken() throws Exception {
        String loginPayload = """
            {
              "email": "%s",
              "password": "%s"
            }
        """.formatted(TEST_EMAIL, TEST_PASSWORD);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
            .andExpect(status().isOk())
            .andReturn();

        String json = result.getResponse().getContentAsString();
        return new ObjectMapper().readTree(json).get("token").asText();
    }

    @Test
    public void testGetMyNotifications_withJWT() throws Exception {
        String token = getToken();

        mockMvc.perform(get("/api/notifications")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].content").value("This is a JWT test notification"));
    }

    @Test
    public void testMarkNotificationAsRead_withJWT() throws Exception {
        String token = getToken();

        mockMvc.perform(post("/api/notifications/" + testNotification.getId() + "/read")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        Notification updated = notificationRepository.findById(testNotification.getId())
            .orElseThrow();
        assertTrue(updated.isRead(), "Notification should be marked as read");
    }
	 
}
