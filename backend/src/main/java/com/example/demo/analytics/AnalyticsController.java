package com.example.demo.analytics;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
	private final analyticsService analyticsService;

    public AnalyticsController(analyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/top-category")
    public ResponseEntity<TopRatedDTO> getTopCategory() {
        return ResponseEntity.ok(analyticsService.getTopRatedCategory());
    }

    @GetMapping("/top-tag")
    public ResponseEntity<TopRatedDTO> getTopTag() {
        return ResponseEntity.ok(analyticsService.getTopRatedTag());
    }
    @GetMapping("/allToRatedCatg")
    public ResponseEntity<List<TopRatedDTO>> getAllRatedCatg() {
        return ResponseEntity.ok(analyticsService.getalltopRatedCatg());
    }
    @GetMapping("/allToRatedTags")
    public ResponseEntity<List<TopRatedDTO>> getAllRatedTags() {
        return ResponseEntity.ok(analyticsService.getalltopRatedTags());
    }
}
