package com.example.demo.auth;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
		
		// Log for debugging
		System.out.println("Request URI = " + path);
		
		// SKIP JWT filter for auth paths
		if (path.startsWith("/auth")) { 
			filterChain.doFilter(request, response);
		return;
		}
		
		String authHeader = request.getHeader("Authorization");
		
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
		
			if (jwtUtils.validateJwtToken(token)) {
				String email = jwtUtils.getEmailFromToken(token);
		
				UserDetails userDetails = authRepository.findByEmail(email).orElse(null);
		
				if (userDetails != null) {
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
