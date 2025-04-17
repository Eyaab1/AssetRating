package com.example.demo.dto;

public class AssetReleaseRequest {
    private String originalAssetId;
    private String version;
    private String documentation;
    private String fileUrl;
	public String getOriginalAssetId() {
		return originalAssetId;
	}
	public void setOriginalAssetId(String originalAssetId) {
		this.originalAssetId = originalAssetId;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getDocumentation() {
		return documentation;
	}
	public void setDocumentation(String documentation) {
		this.documentation = documentation;
	}
	public String getFileUrl() {
		return fileUrl;
	}
	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}
    
}