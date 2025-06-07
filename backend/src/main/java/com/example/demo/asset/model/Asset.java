package com.example.demo.asset.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.example.rating.Impl.ToRate;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "asset_type")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({
  @JsonSubTypes.Type(value = Widget.class, name = "Widget"),
  @JsonSubTypes.Type(value = Sheet.class, name = "Sheet"),
  @JsonSubTypes.Type(value = Template.class, name = "Template"),
  @JsonSubTypes.Type(value = Themes.class, name = "Theme"),
  @JsonSubTypes.Type(value = UILibrary.class, name = "UILibrary"),
  @JsonSubTypes.Type(value = Connector.class, name = "Connector"),
  @JsonSubTypes.Type(value = Utility.class, name = "Utility"),


})
public abstract class Asset {

    @Id
    private String id;
    @Column(unique = true, nullable = false)
    private String name;
    private String label;
    private String publisher;
    private String publisherMail;

    private String filePath;
    @Temporal(TemporalType.TIMESTAMP)
    private Date publishDate;

    @Enumerated(EnumType.STRING)
    private License license;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String image;

    @Column(length = 3000)
    private String description;
    
    @Column(name = "download_count")
    private Integer  downloadCount=0;


    private String documentation;

   // @Enumerated(EnumType.STRING)
    //private AssetType assetType;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "asset_tags",
        joinColumns = @JoinColumn(name = "asset_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<Tag> tags = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "asset_categories",
        joinColumns = @JoinColumn(name = "asset_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();


    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL,orphanRemoval = true, fetch = FetchType.EAGER)
    private List<AssetReleases> releases;

    @Enumerated(EnumType.STRING)
    private ProjectType projectType;

    
	public Asset() {
		super();
    }

    public Asset(String id, String name, String label, String publisher, String publisherMail, Date publishDate,
                 License license, Status status, String image, String description,Integer  downloadCount, String documentation,
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
        this.downloadCount=downloadCount;
        this.documentation = documentation;
        //this.assetType = assetType;
        this.tags = tags;
        this.categories = categories;
        
    }
    
    @PrePersist
    @PreUpdate
    private void validateAssetType() {
        String type = this.getClass().getSimpleName(); // gets the actual subclass name
        Set<String> allowed = Set.of("Widget", "Sheet", "Template", "Theme", "UILibrary", "Connector", "Utility");

        if (!allowed.contains(type)) {
            throw new IllegalArgumentException("Invalid asset type: " + type);
        }
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

//	public AssetType getAssetType() {
	//	return assetType;
	//}

	//public void setAssetType(AssetType assetType) {
		//this.assetType = assetType;
	//}

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

	public List<AssetReleases> getReleases() {
		return releases;
	}

	public void setReleases(List<AssetReleases> releases) {
		this.releases = releases;
	}

	public ProjectType getProjectType() {
		return projectType;
	}

	public void setProjectType(ProjectType projectType) {
		this.projectType = projectType;
	}


	public void setId(String id) {
		this.id = id;
	}

	public Integer getDownloadCount() {
		return downloadCount;
	}

	public void setDownloadCount(Integer downloadCount) {
		this.downloadCount = downloadCount;
	}
	
	

}