package com.example.demo.asset.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

import com.example.demo.auth.User;
import com.example.rating.model.Rating;
import com.example.review.model.Review;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "asset_type")
public abstract class Asset {

    @Id
    private String id;

    private String name;
    private String label;
    private String publisher;
    private String publisherMail;

    private String filePath;
    @Temporal(TemporalType.DATE)
    private Date publishDate;

    @Enumerated(EnumType.STRING)
    private License license;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String image;

    @Column(length = 2000)
    private String description;

    private String documentation;

    @Enumerated(EnumType.STRING)
    private AssetType assetType;

    @ManyToMany
    private List<Tag> tags;

    @ManyToMany
    private List<Category> categories;


    public Asset() {
    }

    public Asset(String id, String name, String label, String publisher, String publisherMail, Date publishDate,
                 License license, Status status, String image, String description, String documentation,
                  AssetType assetType, List<Tag> tags, List<Category> categories) {
        this.id = id;
        this.name = name;
        this.setLabel(label);
        this.publisher = publisher;
        this.publisherMail = publisherMail;
        this.publishDate = publishDate;
        this.license = license;
        this.status = status;
        this.image = image;
        this.description = description;
        this.documentation = documentation;
        this.assetType = assetType;
        this.tags = tags;
        this.categories = categories;
    }
    public String getFilePath() {
		return filePath;
	}

	public String getId() {
		return id;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String user) {
		this.publisher = user;
	}


	public String getPublisherMail() {
	    return publisherMail;
	}

	public void setPublisherMail(String publisherMail) {
		this.publisherMail=publisherMail;
	}

	public Date getPublishDate() {
		return publishDate;
	}

	public void setPublishDate(Date publishDate) {
		this.publishDate = publishDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public License getLicense() {
		return license;
	}

	public void setLicense(License license) {
		this.license = license;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public AssetType getAssetType() {
		return assetType;
	}

	public void setAssetType(AssetType assetType) {
		this.assetType = assetType;
	}

	public String getDocumentation() {
		return documentation;
	}

	public void setDocumentation(String documentation) {
		this.documentation = documentation;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public List<Tag> getTags() {
		return tags;
	}

	public void setTags(List<Tag> tags) {
		this.tags = tags;
	}

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}
	

}