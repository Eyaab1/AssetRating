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
