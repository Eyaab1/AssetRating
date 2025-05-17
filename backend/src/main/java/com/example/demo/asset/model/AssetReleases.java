package com.example.demo.asset.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
	    name = "asset_releases",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"asset_id", "release_version"})
	    }
	)
public class AssetReleases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String releaseVersion;

    @Temporal(TemporalType.TIMESTAMP)
    private Date publishedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "released_asset_id", nullable = false)
    private Asset releasedAsset;



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

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}

	public Asset getReleasedAsset() {
		return releasedAsset;
	}

	public void setReleasedAsset(Asset releasedAsset) {
		this.releasedAsset = releasedAsset;
	}
    

}
