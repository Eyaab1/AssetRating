package com.example.demo.auth;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired 
    private JwtUtils jwtUtils;

	@Autowired
	private AuthRepository authRepository;
	@Override
	protected void doFilterInternal(HttpServletRequest request,
	                                 HttpServletResponse response,
	                                 FilterChain filterChain) throws ServletException, IOException {

	    String path = request.getRequestURI();
	    System.out.println("Request URI = " + path);

	    // Skip /auth
	    if (path.startsWith("/auth")) {
	        filterChain.doFilter(request, response);
	        return;
	    }

	    String authHeader = request.getHeader("Authorization");

	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String token = authHeader.substring(7);

	        if (jwtUtils.validateJwtToken(token)) {
	            String email = jwtUtils.getEmailFromToken(token);

	            User user = authRepository.findByEmail(email).orElse(null);

	            if (user != null) {
	                UserDetails userDetails = org.springframework.security.core.userdetails.User
	                    .withUsername(user.getEmail())
	                    .password(user.getPassword())
	                    .authorities(Collections.emptyList()) // no roles now
	                    .build();
	                System.out.println("Auth Header: " + authHeader);
	                System.out.println("Email from token: " + email);
	                System.out.println("UserDetails found: " + (userDetails != null));
	                System.out.println("Token: " + token);
	                UsernamePasswordAuthenticationToken authenticationToken = 
	                    new UsernamePasswordAuthenticationToken(
	                        userDetails,
	                        null,
	                        userDetails.getAuthorities()
	                    );

	                authenticationToken.setDetails(
	                    new WebAuthenticationDetailsSource().buildDetails(request)
	                );

	                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
	            }
	        }
	    }

	    filterChain.doFilter(request, response);
	}

}