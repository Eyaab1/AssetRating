package com.example.demo.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.asset.model.Asset;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByFirstNameAndLastName(String firstName, String lastName);
    Optional<User> findById(Long id); 


}