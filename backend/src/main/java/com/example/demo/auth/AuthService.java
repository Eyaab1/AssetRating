package com.example.demo.auth;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder,JwtUtils jwtUtils) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils=jwtUtils;
    }

    public String register(User user) {
        Optional<User> existingUser = authRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists!";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        authRepository.save(user);
        return "User registered successfully!";
    }

    public String login(String email, String rawPassword) {
        Optional<User> userOptional = authRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return jwtUtils.generateToken(user);
            }
        }
        return null;
    }
    public Optional<UserDTO> getUserById(Long id) {
        return authRepository.findById(id).map(UserDTO::new);
    }
    //
    public String logout(String token) {
        if (token != null && !token.isBlank()) {
            return "User logged out successfully.";
        }
        return "Invalid or missing token.";
    }
    public Optional<User> findByEmail(String email) {
        return authRepository.findByEmail(email);
    }


}