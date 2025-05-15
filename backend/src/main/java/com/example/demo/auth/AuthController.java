package com.example.demo.auth;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;}
    
    //@PostMapping("/register")
    //public ResponseEntity<?> register(@RequestBody User user) {
      //  String result = authService.register(user);

//        if ("Email already exists!".equals(result)) {
  //          return ResponseEntity.status(HttpStatus.CONFLICT)
    //                             .body(Collections.singletonMap("message", result));
      //  }

        //return ResponseEntity.status(HttpStatus.CREATED)
          //                   .body(Collections.singletonMap("message", result));
    //}


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (RuntimeException ex) {
            if ("Account is deactivated.".equals(ex.getMessage())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Collections.singletonMap("message", ex.getMessage()));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("message", "Invalid credentials."));
            }
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