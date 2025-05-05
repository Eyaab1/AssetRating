package com.example.demo.analytics;

public class TopRatedDTO {
	private String category;
    private Double averageRating;

    // Constructors
    public TopRatedDTO(String category, Double averageRating) {
        this.category = category;
        this.averageRating = averageRating;
    }

    // Getters and setters
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
