package com.example.demo.dto;

import java.util.List;

public class ModerationResult {
    private String sentiment;
    private double score;
    private boolean containsProfanity;
    private String spamLabel;
    private double spamScore;
    // Getters and Setters
    
    
    public String getSentiment() {
        return sentiment;
    }

    public String getSpamLabel() {
		return spamLabel;
	}

	public void setSpamLabel(String spamLabel) {
		this.spamLabel = spamLabel;
	}

	public double getSpamScore() {
		return spamScore;
	}

	public void setSpamScore(double spamScore) {
		this.spamScore = spamScore;
	}

	public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public boolean isContainsProfanity() {
        return containsProfanity;
    }

    public void setContainsProfanity(boolean containsProfanity) {
        this.containsProfanity = containsProfanity;
    }
}
