package com.example.demo.rating.controller;

import com.example.rating.service.RatingService;
import com.example.rating.model.Rating;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/{userId}/{assetId}")
    public int rateAsset(@PathVariable Long userId, @PathVariable Long assetId,
                         @RequestParam int functionality,
                         @RequestParam int performance,
                         @RequestParam int integration,
                         @RequestParam int documentation) {
        return ratingService.rateAsset(userId, assetId, functionality, performance, integration, documentation);
    }

    @GetMapping("/average/{assetId}")
    public int getOverallRating(@PathVariable Long assetId) {
        return ratingService.getOverallRating(assetId);
    }
}
