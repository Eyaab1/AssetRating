package com.example.demo.auth;
import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
@Component
public class JwtUtils {
	  private final String jwtSecret = "ThisIsASecretKeyForJwtGenerationWhichIsLongEnoughForHS512Algorithm!!!1234567890";  // 64+ chars ✅
	    private final long jwtExpirationMs = 86400000L; // 1 day

	    private Key getSigningKey() {
	        byte[] keyBytes = jwtSecret.getBytes();
	        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
	    }

	    public String generateToken(User user) {
	        return Jwts.builder()
	                .setSubject(user.getEmail())
	                .claim("role", user.getRole().name())   // 🔥 Add role into the JWT!
	                .setIssuedAt(new Date())
	                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
	                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
	                .compact();
	    }


	    public String getRoleFromToken(String token) {
	        Claims claims = Jwts.parserBuilder()
	                .setSigningKey(getSigningKey())
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	        return (String) claims.get("role");
	    }

	    public String getEmailFromToken(String token) {
	        Claims claims = Jwts.parserBuilder()
	                .setSigningKey(getSigningKey()) // ✅ use strong signing key
	                .build()
	                .parseClaimsJws(token)
	                .getBody();

	        return claims.getSubject();
	    }

	    public boolean validateJwtToken(String token) {
	        try {
	            Jwts.parserBuilder()
	                    .setSigningKey(getSigningKey()) // ✅ use strong signing key
	                    .build()
	                    .parseClaimsJws(token);
	            return true;
	        } catch (JwtException e) {
	            return false;
	        }
	    }

}
