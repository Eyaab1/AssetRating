package com.example.demo.analytics;

public class TopRatedDTO {
	private String label;
    private Double value;
    // Constructors
    public TopRatedDTO(String label, Double averageRating) {
        this.label = label;
        this.value = averageRating;
    }


    public Double getAverageRating() {
        return value;
    }

    public void setAverageRating(Double averageRating) {
        this.value = averageRating;
    }

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
}
