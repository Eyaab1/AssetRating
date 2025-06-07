package com.example.demo.integration;

import com.example.demo.auth.AuthRepository;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.demo.dto.UpdateUserRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(com.example.demo.config.TestSecurityConfig.class)
public class userManagementIntegTest {

	@Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AuthRepository authRepository;

    private Long testUserId;

    @BeforeEach
    void setup() {
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("admin_integ_user@example.com");
        user.setRole(Role.USER);
        user.setEnabled(true);
        authRepository.save(user);
        testUserId = user.getId();
    }

    @Test
    void testToggleUserActivation() throws Exception {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEnabled(false);

        mockMvc.perform(put("/admin/users/" + testUserId + "/activation")
                .with(user("admin@example.com").roles("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetUserById() throws Exception {
        mockMvc.perform(get("/admin/users/" + testUserId)
                .with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk());
    }
    
    @Test
    void testCreateUser_success() throws Exception {
        String email = "unique_" + UUID.randomUUID() + "@example.com";

        User user = new User();
        user.setEmail(email);
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(Role.USER);

        mockMvc.perform(post("/admin/users")
                .with(user("admin@.com").roles("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }


   
}
