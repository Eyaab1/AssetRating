package com.example.demo.analytics;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ContributorChatBotService {

    private final RestTemplate restTemplate;

    public ContributorChatBotService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String askQuestion(String assetId, String question) {
        String flaskUrl = "http://localhost:5000/api/assets/" + assetId + "/chat";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = Map.of("question", question);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, entity, Map.class);

            System.out.println("Flask response status: " + response.getStatusCode());
            System.out.println("Flask response body: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object rawAnswer = response.getBody().get("answer");

                if (rawAnswer == null) {
                    return "Error: 'answer' key not found in response.";
                }

                if (rawAnswer instanceof String) {
                    return (String) rawAnswer;
                } else {
                    return "Error: Unexpected 'answer' type: " + rawAnswer.getClass().getName();
                }
            } else {
                return "Error: Invalid response from AI service.";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

}
	
		

