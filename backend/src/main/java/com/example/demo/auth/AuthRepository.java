package com.example.demo.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.Optional;

public interface AuthRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByFirstNameAndLastName(String firstName, String lastName);
    Optional<User> findById(Long id); 
    @Query(value = "SELECT COUNT(*) FROM users WHERE last_login >= NOW() - INTERVAL '30 days'", nativeQuery = true)
    Long countActiveUsersLast30Days();


}