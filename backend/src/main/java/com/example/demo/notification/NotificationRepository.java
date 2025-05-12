package com.example.demo.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.auth.User;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
	List<Notification> findByRecipientOrderByCreatedAtDesc(User user);
}
