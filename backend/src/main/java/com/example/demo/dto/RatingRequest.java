package com.example.demo.dto;

public class RatingRequest {
    private Long userId;
    private String assetId;
    private int functionality;
    private int performance;
    private int integration;
    private int documentation;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public int getFunctionality() { return functionality; }
    public void setFunctionality(int functionality) { this.functionality = functionality; }

    public int getPerformance() { return performance; }
    public void setPerformance(int performance) { this.performance = performance; }

    public int getIntegration() { return integration; }
    public void setIntegration(int integration) { this.integration = integration; }

    public int getDocumentation() { return documentation; }
    public void setDocumentation(int documentation) { this.documentation = documentation; }
}
