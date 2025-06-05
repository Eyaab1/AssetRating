package com.example.demo.auth;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.security.SecureRandom;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final emailService emailService;
    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder,JwtUtils jwtUtils,emailService emailService) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils=jwtUtils;
        this.emailService = emailService;
    }
    
    public String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    public String register(User user) {
        Optional<User> existingUser = authRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists!";
        }

        String rawPassword = (user.getPassword() == null || user.getPassword().isBlank())
            ? generateRandomPassword(10)
            : user.getPassword();

        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setEnabled(true);
        authRepository.save(user);

        // Send password by email (see next step)
        emailService.sendAccountCreationEmail(user.getEmail(), rawPassword,user.getRole().name());

        return "User registered successfully!";
    }

    public String login(String email, String rawPassword) {
        Optional<User> userOptional = authRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!user.isEnabled()) {
                throw new RuntimeException("Account is deactivated.");
            }

            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                user.setLastLogin(new Date());
                authRepository.save(user);
                return jwtUtils.generateToken(user);
            }
        }

        throw new RuntimeException("Invalid email or password.");
    }

    public Optional<UserDTO> getUserById(Long id) {
        return authRepository.findById(id).map(UserDTO::new);
    }
    public Optional<User> findById(Long id) {
        return authRepository.findById(id);
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

    public Optional<UserDTO> getUserByEmail(String email) {
        return authRepository.findByEmail(email).map(UserDTO::new);
    }

    public List<UserDTO> getAllUsers() {
        return authRepository.findAll().stream().map(UserDTO::new).toList();
    }

    public String updateUserRole(Long userId, Role newRole) {
        return authRepository.findById(userId).map(user -> {
            user.setRole(newRole);
            authRepository.save(user);
            return "User role updated successfully.";
        }).orElse("User not found.");
    }

    public String deleteUser(Long userId) {
        if (authRepository.existsById(userId)) {
            authRepository.deleteById(userId);
            return "User deleted.";
        }
        return "User not found.";
    }

    public String toggleUserActivation(Long userId, boolean enable) {
        return authRepository.findById(userId).map(user -> {
            user.setEnabled(enable);
            authRepository.save(user);
            return enable ? "User activated." : "User suspended.";
        }).orElse("User not found.");
    }
    
    public List<UserDTO> getUsersRegisteredThisMonth() {
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        return getAllUsers().stream()
            .filter(user -> {
                Date createdAt = user.getCreatedAt();
                return createdAt != null && createdAt.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                        .isAfter(startOfMonth.minusDays(1));
            })
            .collect(Collectors.toList());
    }
    public long countActiveUsersLast30Days() {
        return authRepository.countActiveUsersLast30Days();
    }

	public List<User> findAll() {
		// TODO Auto-generated method stub
		return authRepository.findAll();
	}
	public String updatePassword(Long userId, String oldPassword, String newPassword) {
	    Optional<User> userOpt = authRepository.findById(userId);

	    if (userOpt.isEmpty()) {
	        return "User not found.";
	    }

	    User user = userOpt.get();

	    if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
	        return "Old password is incorrect.";
	    }

	    user.setPassword(passwordEncoder.encode(newPassword));
	    authRepository.save(user);

	    return "Password updated successfully.";
	}


}