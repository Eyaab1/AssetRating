package com.example.demo.rating.controller;

import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.dto.RatingRequest;
import com.example.rating.service.RatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {
	@Autowired
	private AssetRepository assetRepository;
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/rate")
    public ResponseEntity<String> rateAsset(@RequestBody RatingRequest request) {
        boolean assetExists = assetRepository.existsById(request.getAssetId());
        if (!assetExists) {
            return ResponseEntity.badRequest().body("Asset with ID " + request.getAssetId() + " does not exist.");
        }

        ratingService.rateAsset(
            request.getUserId(),
            request.getAssetId(),
            request.getFunctionality(),
            request.getPerformance(),
            request.getIntegration(),
            request.getDocumentation()
        );
        return ResponseEntity.ok("Rating submitted successfully");
    }

    @GetMapping("/average/{assetId}")
    public ResponseEntity<Integer> getOverallRating(@PathVariable("assetId") String assetId) {
        int average = ratingService.getOverallRating(assetId);
        return ResponseEntity.ok(average);
    }


}
