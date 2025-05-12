package com.example.demo.asset.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;


@Service
public class RecommendationUser {
	
	private final RestTemplate restTemplate = new RestTemplate();
    private final String RECOMMENDATION_URL = "http://localhost:5000/recommendations";

    public List<String> getRecommendedAssetIds(Long userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", userId);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(RECOMMENDATION_URL, request, Map.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return (List<String>) response.getBody().get("recommendedAssets");
        }
        return Collections.emptyList();
    }
}
