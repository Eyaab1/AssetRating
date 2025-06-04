package com.example.demo;
import com.example.demo.analytics.analyticsService;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtendWith;

import com.example.rating.model.Rating;
import com.example.rating.service.RatingService;
import com.example.review.model.ReviewComment;
import com.example.review.repository.ReviewCommentRepository;
import com.example.review.service.ReviewCommentService;

import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
public class AnalyticsServiceTest {
	   @Mock
	    private RatingService ratingService;

	    @Mock
	    private ReviewCommentService reviewService;

	    @InjectMocks
	    private analyticsService analyticsService;

	    @Test
	    public void testGetRatingDis() {
	        String assetId = "asset1";

	        Map<Integer, Long> expectedDistribution = Map.of(
	            4, 2L,
	            3, 1L
	        );

	        when(ratingService.getRatingDistribution(assetId)).thenReturn(expectedDistribution);

	        Map<Integer, Long> distribution = analyticsService.getRatingDistributionForAsset(assetId);

	        assertEquals(2L, distribution.get(4));
	        assertEquals(1L, distribution.get(3));
	    }
	    @Test
	    public void testGetReviewTrend() {
	        ReviewComment r1 = new ReviewComment(1L, "asset1", "comment1");
	        ReviewComment r2 = new ReviewComment(2L, "asset1", "comment2");
	        ReviewComment r3 = new ReviewComment(2L, "asset1", "comment3");

	        Calendar cal = Calendar.getInstance();
	        cal.set(2025, Calendar.MAY, 1); //all reviews in same week
	        r1.setCreated_at(cal.getTime());
	        cal.set(2025, Calendar.MAY, 2);
	        r2.setCreated_at(cal.getTime());
	        cal.set(2025, Calendar.MAY, 2);
	        r3.setCreated_at(cal.getTime());

	        when(reviewService.getAllReviews()).thenReturn(List.of(r1, r2, r3));

	        Map<String, Long> trend = analyticsService.getReviewActivityTrend();

	        assertEquals(3L, trend.values().stream().mapToLong(Long::longValue).sum());
	    }
}
