package com.example.demo.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.auth.AuthService;
import com.example.demo.auth.User;
import com.example.demo.auth.UserDTO;
import com.example.demo.dto.UpdateUserRequest;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AuthService authService;

    public AdminUserController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User user) {
        return ResponseEntity.ok(authService.register(user));
    }


    @GetMapping
    public List<UserDTO> getAllUsers() {
        return authService.getAllUsers();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(authService.updateUserRole(id, request.getRole()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(authService.deleteUser(id));
    }

    @PutMapping("/{id}/activation")
    public ResponseEntity<String> toggleUserActivation(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(authService.toggleUserActivation(id, request.getEnabled()));
    }

}