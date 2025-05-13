package com.example.demo.auth;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;}


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String Token = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (Token!=null) {
            return ResponseEntity.ok(new AuthResponse(Token));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials!");
        }
    }
   
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return authService.getUserById(id)
                          .map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String message = authService.logout(token);
        return ResponseEntity.ok(message);
    }



    

}