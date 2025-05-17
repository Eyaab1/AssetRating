package com.example.demo.dto;
import java.util.Date;
import com.example.demo.asset.model.Asset;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssetReleaseDto {
    private Long id;

	private String releaseVersion;
    private Date publishedDate;
    private Asset releasedAsset;
    
    public AssetReleaseDto(Long id,String releaseVersion, Date publishedDate, Asset releasedAsset) {
		super();
		this.id=id;
		this.releaseVersion = releaseVersion;
		this.publishedDate = publishedDate;
		this.releasedAsset = releasedAsset;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getReleaseVersion() {
		return releaseVersion;
	}
	public void setReleaseVersion(String releaseVersion) {
		this.releaseVersion = releaseVersion;
	}
	public Date getPublishedDate() {
		return publishedDate;
	}
	public void setPublishedDate(Date publishedDate) {
		this.publishedDate = publishedDate;
	}
	public Asset getReleasedAsset() {
		return releasedAsset;
	}
	public void setReleasedAsset(Asset releasedAsset) {
		this.releasedAsset = releasedAsset;
	}
}
