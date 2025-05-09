package com.example.demo.analytics;

public class TopRatedDTO {
	private String label;
    private Double averageRating;
    // Constructors
    public TopRatedDTO(String label, Double averageRating) {
        this.label = label;
        this.averageRating = averageRating;
    }


    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
}
