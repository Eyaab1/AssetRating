package com.example.demo.analytics;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ContributorChatBotController {
	  private final ContributorChatBotService chatBotService;

	    public ContributorChatBotController(ContributorChatBotService chatBotService) {
	        this.chatBotService = chatBotService;
	    }

	    @PostMapping("/asset/{assetId}")
	    public ResponseEntity<Map<String, String>> askChatBot(
	            @PathVariable String assetId,
	            @RequestBody Map<String, String> body
	    ) {
	        String question = body.get("question");

	        if (question == null || question.trim().isEmpty()) {
	            return ResponseEntity.badRequest().body(Map.of("error", "Question is required."));
	        }

	        String answer = chatBotService.askQuestion(assetId, question);
	        return ResponseEntity.ok(Map.of("answer", answer));
	    }

}
