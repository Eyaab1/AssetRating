package com.example.demo.dto;

public class ProfanityCheckResponse {

    private boolean containsProfanity;

    
    public ProfanityCheckResponse(boolean containsProfanity) {
		super();
		this.containsProfanity = containsProfanity;
	}

	public boolean isContainsProfanity() {
        return containsProfanity;
    }

    public void setContainsProfanity(boolean containsProfanity) {
        this.containsProfanity = containsProfanity;
    }
}

