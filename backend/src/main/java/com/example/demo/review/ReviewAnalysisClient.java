package com.example.demo.review;

import com.example.demo.dto.ModerationResult;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReviewAnalysisClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String ANALYZE_URL = "http://localhost:5000/analyze";

    public ModerationResult analyzeReview(String comment) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> payload = new HashMap<>();
        payload.put("text", comment);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<ModerationResult> response = restTemplate.postForEntity(
                ANALYZE_URL, request, ModerationResult.class
        );

        ModerationResult result = response.getBody();

        // 🔍 Debug logging
        if (result != null) {
            System.out.println("[ANALYSIS] Comment: " + comment);
            System.out.println("Spam Label = " + result.getSpamLabel());
            System.out.println("Spam Score = " + result.getSpamScore());
            System.out.println("Contains Profanity = " + result.isContainsProfanity());
            System.out.println("Sentiment = " + result.getSentiment());
        } else {
            System.out.println("[ERROR] No result returned for comment: " + comment);
        }

        return result;
    }

}
