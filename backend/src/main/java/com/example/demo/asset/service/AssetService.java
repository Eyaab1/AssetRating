package com.example.demo.asset.service;

import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.AssetReleases;
import com.example.demo.asset.model.Connector;
import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.Sheet;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Tag;
import com.example.demo.asset.model.Template;
import com.example.demo.asset.model.Themes;
import com.example.demo.asset.model.Utility;
import com.example.demo.asset.model.Widget;
import com.example.demo.asset.repository.AssetReleaseRepository;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.dto.AssetReleaseRequest;
import com.example.rating.service.RatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final RatingService ratingService;


    @Autowired
    public AssetService(AssetRepository assetRepository, RatingService ratingService) {
        this.assetRepository = assetRepository;
        this.ratingService= ratingService;
    }
    @Autowired
    private AssetReleaseRepository assetReleaseRepository;
    
    public AssetReleases saveRelease(AssetReleases release) {
        return assetReleaseRepository.save(release);
    }
    
    
    public Asset uploadAssetRelease(AssetReleaseRequest request) {
        Asset original = assetRepository.findById(request.getOriginalAssetId())
                .orElseThrow(() -> new RuntimeException("Original asset not found"));

        Asset newRelease;
        try {
            newRelease = original.getClass().getDeclaredConstructor().newInstance();
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            throw new RuntimeException("Failed to instantiate new asset release of type: " + original.getClass().getSimpleName(), e);
        }

        newRelease.setId(UUID.randomUUID().toString());
        newRelease.setName(original.getName());
        newRelease.setLabel(original.getLabel());
        newRelease.setPublisher(original.getPublisher());
        newRelease.setPublisherMail(original.getPublisherMail());
        newRelease.setLicense(original.getLicense());
        newRelease.setStatus(original.getStatus());
        newRelease.setImage(original.getImage());
        newRelease.setDescription(original.getDescription());
        newRelease.setDocumentation(request.getDocumentation());
        newRelease.setFilePath(request.getFileUrl());
        newRelease.setPublishDate(new Date());
        newRelease.setProjectType(original.getProjectType());
        newRelease.setCategories(original.getCategories());
        newRelease.setTags(original.getTags());
        newRelease.setParentAsset(original); // 🔗 Link to original

        if (original instanceof Template templateOriginal && newRelease instanceof Template templateClone) {
            templateClone.setTemplateCategory(templateOriginal.getTemplateCategory());
            templateClone.setFramework(templateOriginal.getFramework());
        }

        if (original instanceof Themes themesOriginal && newRelease instanceof Themes themesClone) {
            themesClone.setPrimaryColor(themesOriginal.getPrimaryColor());
            themesClone.setThemeType(themesOriginal.getThemeType());
            themesClone.setFramework(themesOriginal.getFramework());
        }

        if (original instanceof Widget widgetOriginal && newRelease instanceof Widget widgetClone) {
            widgetClone.setIcon(widgetOriginal.getIcon());
            widgetClone.setFramework(widgetOriginal.getFramework());
        }

        if (original instanceof Sheet sheetOriginal && newRelease instanceof Sheet sheetClone) {
            sheetClone.setFormat(sheetOriginal.getFormat());
        }

        if (original instanceof Utility utilityOriginal && newRelease instanceof Utility utilityClone) {
            utilityClone.setDependencies(utilityOriginal.getDependencies());
        }

        if (original instanceof Connector connectorOriginal && newRelease instanceof Connector connectorClone) {
            connectorClone.setPreconfigured(connectorOriginal.isPreconfigured());
        }

        Asset savedRelease = assetRepository.save(newRelease);

        AssetReleases releaseRecord = new AssetReleases();
        releaseRecord.setAsset(original);
        releaseRecord.setReleaseVersion(request.getVersion());
        releaseRecord.setPublishedDate(new Date());
        releaseRecord.setReleasedAsset(savedRelease); // 👈 include full asset

        assetReleaseRepository.save(releaseRecord);

        return savedRelease;
    }


    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        List<Asset> assets = assetRepository.findAll();

        return assets.stream()
            .filter(asset -> asset.getParentAsset() == null) // ✅ only original assets, not released versions
            .collect(Collectors.toList());
    }

    public Optional<Asset> getAssetById(String id) {
        return assetRepository.findById(id);
    }

    public void deleteAsset(String id) {
        assetRepository.deleteById(id);
    }

    public Asset updateAsset(String id, Asset updatedAsset) {
        return assetRepository.findById(id)
                .map(asset -> {
                    asset.setName(updatedAsset.getName());
                    asset.setLabel(updatedAsset.getLabel());
                    asset.setPublisher(updatedAsset.getPublisher());
                    asset.setPublisherMail(updatedAsset.getPublisherMail());
                    asset.setPublishDate(updatedAsset.getPublishDate());
                    asset.setLicense(updatedAsset.getLicense());
                    asset.setStatus(updatedAsset.getStatus());
                    asset.setImage(updatedAsset.getImage());
                    asset.setDescription(updatedAsset.getDescription());
                    asset.setDocumentation(updatedAsset.getDocumentation());
                    //asset.setAssetType(updatedAsset.getAssetType());
                    asset.setTags(updatedAsset.getTags());
                    asset.setCategories(updatedAsset.getCategories());
                    asset.setProjectType(updatedAsset.getProjectType());
                    return assetRepository.save(asset);
                })
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
    }
    public List<Asset> filterAssets(Tag tag, Framework framework, Status status) {
        return assetRepository.filterAssets(tag, framework, status);
    }
    
    public List<Asset> getRecommendedAssets() {
        List<Asset> allAssets = assetRepository.findAll();

        return allAssets.stream()
            .filter(asset -> ratingService.getOverallRating(asset.getId()) >= 4)
            .sorted(Comparator.comparingInt(asset -> -ratingService.countRatings(asset.getId()))) // descending
            .limit(10)
            .collect(Collectors.toList());
    }


}
