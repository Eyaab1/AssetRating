package com.example.demo.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import java.util.Optional;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.example.demo.auth.AuthService;
import com.example.demo.auth.User;
import com.example.demo.notification.NotificationService;

@TestConfiguration
@Profile("test")
public class TestSecurityConfig {
	 @Bean
	    public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
	        http
	            .securityMatcher("/**")
	            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
	            .csrf(csrf -> csrf.disable());
	        return http.build();
	    }

	    // ✅ Mocked AuthService to return a fake user for tests
	 @Primary
	 @Bean
	 public AuthService mockAuthService() {
	     AuthService mock = Mockito.mock(AuthService.class);
	     User fakeUser = new User();
	     fakeUser.setId(99L);
	     fakeUser.setEmail("testuser@mail.com");
	     fakeUser.setFirstName("Mock");
	     fakeUser.setLastName("User");

	     // Mock both lookup methods
	     Mockito.when(mock.findByEmail(any())).thenReturn(Optional.of(fakeUser));
	     Mockito.when(mock.findById(eq(99L))).thenReturn(Optional.of(fakeUser)); // ADD THIS

	     return mock;
	 }
	    @Bean
	    @Primary
	    public NotificationService mockNotificationService() {
	        return Mockito.mock(NotificationService.class);
	    }
}
