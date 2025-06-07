package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.demo.admin.AdminUserController;
import com.example.demo.auth.AuthService;
import com.example.demo.auth.Role;
import com.example.demo.auth.User;
import com.example.demo.dto.UpdateUserRequest;

@ExtendWith(MockitoExtension.class)
public class UserManagementTests {
	@Mock private AuthService authService;

    @InjectMocks private AdminUserController adminUserController;

    @Test
    public void testAddUser() {
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        user.setEmail("test@example.com");
        user.setRole(Role.USER);

        when(authService.register(user)).thenReturn("User created");

        ResponseEntity<String> response = adminUserController.createUser(user);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("User created", response.getBody());
    }

    @Test
    public void testChangeUserRole() {
        Long userId = 1L;
        Role newRole = Role.CONTRIBUTOR;

        UpdateUserRequest request = new UpdateUserRequest();
        request.setRole(newRole);

        when(authService.updateUserRole(userId, newRole))
            .thenReturn("User role updated successfully.");

        ResponseEntity<String> response = adminUserController.updateUserRole(userId, request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("User role updated successfully.", response.getBody());
    }
    @Test
    public void testToggleUserActivation() {
        Long userId = 1L;
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEnabled(false);

        when(authService.toggleUserActivation(userId, request.getEnabled()))
            .thenReturn("User suspended.");

        ResponseEntity<String> response = adminUserController.toggleUserActivation(userId, request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("User suspended.", response.getBody());
    }


}
