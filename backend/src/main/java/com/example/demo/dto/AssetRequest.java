package com.example.demo.dto;

import java.util.Date;
import java.util.List;

import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.License;
import com.example.demo.asset.model.ProjectType;

public class AssetRequest {
    public String type;
    public String name;
    public String label;
    public String publisher;
    public String publisherMail;
    public String filePath;
    public Date publishDate;
    public License license;
    public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public String getPublisher() {
		return publisher;
	}
	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}
	public String getPublisherMail() {
		return publisherMail;
	}
	public void setPublisherMail(String publisherMail) {
		this.publisherMail = publisherMail;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public Date getPublishDate() {
		return publishDate;
	}
	public void setPublishDate(Date publishDate) {
		this.publishDate = publishDate;
	}
	public License getLicense() {
		return license;
	}
	public void setLicense(License license) {
		this.license = license;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getDocumentation() {
		return documentation;
	}
	public void setDocumentation(String documentation) {
		this.documentation = documentation;
	}
	public List<Long> getTagIds() {
		return tagIds;
	}
	public void setTagIds(List<Long> tagIds) {
		this.tagIds = tagIds;
	}
	public List<Long> getCategoryIds() {
		return categoryIds;
	}
	public void setCategoryIds(List<Long> categoryIds) {
		this.categoryIds = categoryIds;
	}
	public ProjectType getProjectType() {
		return projectType;
	}
	public void setProjectType(ProjectType projectType) {
		this.projectType = projectType;
	}
	public Framework getFramework() {
		return framework;
	}
	public void setFramework(Framework framework) {
		this.framework = framework;
	}
	public String getTemplateCategory() {
		return templateCategory;
	}
	public void setTemplateCategory(String templateCategory) {
		this.templateCategory = templateCategory;
	}
	public String status;
    public String image;
    public String description;
    public String documentation;
    public List<Long> tagIds;
    public List<Long> categoryIds;
    public ProjectType projectType;
    public Framework framework;
    public String templateCategory;
}
