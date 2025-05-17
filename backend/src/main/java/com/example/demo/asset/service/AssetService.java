package com.example.demo.asset.service;

import com.example.demo.analytics.TopRatedDTO;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.AssetReleases;
import com.example.demo.asset.model.Connector;
import com.example.demo.asset.model.Format;
import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.ProjectType;
import com.example.demo.asset.model.Sheet;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Tag;
import com.example.demo.asset.model.Template;
import com.example.demo.asset.model.Themes;
import com.example.demo.asset.model.Utility;
import com.example.demo.asset.model.Widget;
import com.example.demo.asset.repository.AssetReleaseRepository;
import com.example.demo.asset.repository.AssetRepository;
import com.example.demo.auth.AuthService;
import com.example.demo.auth.User;
import com.example.demo.dto.AssetReleaseDto;
import com.example.demo.dto.AssetReleaseRequest;
import com.example.rating.service.RatingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import com.example.demo.asset.model.Category;
import com.example.demo.dto.AssetRequest;
import com.example.demo.notification.NotificationService;
import com.example.demo.notification.NotificationType;
@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final RatingService ratingService;
    private final TagService tagService;
    private final CategoryService categoryService;
    private final NotificationService notificationService;
    private final AuthService authservice;
    private final RecommendationUser recommendationUser;

    @Autowired
    public AssetService(AssetRepository assetRepository, RatingService ratingService,TagService tagService, CategoryService categoryService, NotificationService notificationService,AuthService authservice,RecommendationUser recommendationUser) {
        this.assetRepository = assetRepository;
        this.ratingService= ratingService;
        this.tagService=tagService;
        this.categoryService=categoryService;
        this.notificationService =notificationService;
        this.authservice=authservice;
        this.recommendationUser=recommendationUser;
    }
    @Autowired
    private AssetReleaseRepository assetReleaseRepository;
    
    public AssetReleases saveRelease(AssetReleases release) {
        return assetReleaseRepository.save(release);
    }
  
    public Optional<String> getLabelById(String id) {
        return assetRepository.findById(id).map(Asset::getLabel);
    }

    public Asset createAssetFromRequest(AssetRequest request) {
        Asset asset = switch (request.type.toUpperCase()) {
            case "TEMPLATE" -> new Template();
            case "WIDGET" -> new Widget();
            case "UTILITY" -> new Utility();
            case "SHEET" -> new Sheet();
            case "CONNECTOR" -> new Connector();
            case "THEME" -> new Themes();
            default -> throw new IllegalArgumentException("Unknown asset type: " + request.type);
        };

        asset.setId(UUID.randomUUID().toString());
        asset.setName(request.name);
        asset.setLabel(request.label);
        asset.setPublisher(request.publisher);
        asset.setPublisherMail(request.publisherMail);
        asset.setFilePath(request.filePath);
        asset.setPublishDate(request.publishDate);
        asset.setLicense(request.license);
        asset.setStatus(Status.valueOf(request.status));
        asset.setImage(request.image);
        asset.setDescription(request.description);
        asset.setDocumentation(request.documentation);
        asset.setProjectType(request.projectType);

        if (asset instanceof Template template) {
            template.setTemplateCategory(request.templateCategory);
            template.setFramework(request.framework);
        }

        if (asset instanceof Themes theme) {
            theme.setFramework(request.framework);
        }

        if (asset instanceof Widget widget) {
            widget.setFramework(request.framework);
        }

        List<Tag> tags = tagService.findAllById(request.tagIds);
        if (tags.size() != request.tagIds.size()) {
            throw new IllegalArgumentException("One or more tag IDs are invalid.");
        }

        List<Category> categories = categoryService.findAllById(request.categoryIds);

        if (categories == null || categories.isEmpty() || categories.stream().anyMatch(c -> c == null || c.getId() == null)) {
            throw new RuntimeException("❌ One or more categories are null or have a null ID.");
        }

        for (Category category : categories) {
            if (category == null || category.getId() == null) {
                throw new RuntimeException("❌ Category object is null or has null ID!");
            } else {
                System.out.println("✅ Category ID: " + category.getId() + " | Name: " + category.getName());
            }
        }

        asset.setCategories(categories);

        asset.setTags(tags);

        Asset saved = assetRepository.save(asset);
        User actor = authservice.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
        	    .orElseThrow(() -> new RuntimeException("User not found"));
        	notificationService.notifyAllUsersOfAsset(saved, actor, NotificationType.ASSET_PUBLISHED);
        return saved;

    }
    public Asset createAssetWithFile(AssetRequest request, MultipartFile documentationFile) {
        if (documentationFile != null && !documentationFile.isEmpty()) {
            String docFilename = UUID.randomUUID() + "_" + documentationFile.getOriginalFilename();
            Path path = Paths.get("uploads/docs/" + docFilename);
            try {
                Files.createDirectories(path.getParent());
                Files.copy(documentationFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                request.documentation = "/docs/" + docFilename;
            } catch (IOException e) {
                throw new RuntimeException("Failed to store documentation", e);
            }
        }

        return createAssetFromRequest(request); 
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
        releaseRecord.setReleasedAsset(savedRelease); 

        assetReleaseRepository.save(releaseRecord);
        User actor = this.authservice.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationService.notifyAllUsersOfAsset(original, actor, NotificationType.ASSET_UPDATED);
        return savedRelease;
    }


    public Asset saveAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public boolean assetExists(String assetId) {
        return assetRepository.existsById(assetId);
    }

    public List<Asset> getAllAssets() {
        List<Asset> assets = assetRepository.findAll();

        return assets.stream()
            .filter(asset -> asset.getParentAsset() == null) 
            .collect(Collectors.toList());
    }

    public Optional<Asset> getAssetById(String id) {
        return assetRepository.findById(id);
    }

    public void deleteAsset(String id) {
        assetRepository.findById(id).ifPresent(asset -> {
            asset.setStatus(Status.DELETED);
            assetRepository.save(asset);
        });
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
    //public List<AssetReleases> getReleasesByAsset(String assetId) {
      //  Asset asset = assetRepository.findById(assetId)
        //    .orElseThrow(() -> new RuntimeException("Asset not found"));
        //return asset.getReleases(); // assuming `releases` are fetched eagerly
    //}
    public List<AssetReleaseDto> getReleasesByAsset(String assetId) {
        Asset asset = assetRepository.findById(assetId)
            .orElseThrow(() -> new RuntimeException("Asset not found"));

        return asset.getReleases().stream()
            .map(release -> new AssetReleaseDto(
                release.getId(),
                release.getReleaseVersion(),
                release.getPublishedDate(),
                assetRepository.findById(release.getReleasedAsset().getId()).orElse(null)
            ))
            .collect(Collectors.toList());
    }


    //get assets eli andhom the same categ
    public List<Asset> getAssetsByCategory(Long categoryId) {
        return assetRepository.findAssetsByCategoryId(categoryId);
    }
    
    public String uploadReleaseDocumentation(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("No file provided for release documentation");
        }

        String docFilename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads/docs/" + docFilename);
        try {
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store release documentation", e);
        }

        return "/docs/" + docFilename;
    }
    
    public List<Asset> getRecommendedAssetsForUser(Long userId) {
        List<String> ids = recommendationUser.getRecommendedAssetIds(userId);
        return assetRepository.findAllById(ids);
    }
    public void incrementDownloadCount(String assetId) {
        Asset asset = assetRepository.findById(assetId)
            .orElseThrow(() -> new RuntimeException("Asset not found"));

        Integer currentCount = asset.getDownloadCount() != null ? asset.getDownloadCount() : 0;
        asset.setDownloadCount(currentCount + 1);

        assetRepository.save(asset);
    }


    
    public List<TopRatedDTO> findTopRatedAssets() {
        return getAllAssets().stream()
            .filter(a -> ratingService.countRatings(a.getId()) > 0)
            .map(asset -> new TopRatedDTO(asset.getLabel(), (double) ratingService.getOverallRating(asset.getId())))
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .limit(5)
            .collect(Collectors.toList());
    }
    public Map<Status, Long> countAssetsByStatus() {
        return getAllAssets().stream()
            .collect(Collectors.groupingBy(Asset::getStatus, Collectors.counting()));
    }

    public List<TopRatedDTO> findTopRatedCategory() {
        return getAllAssets().stream()
            .filter(a -> a.getCategories() != null && !a.getCategories().isEmpty())
            .flatMap(asset -> asset.getCategories().stream().map(cat -> Map.entry(cat.getName(), ratingService.getOverallRating(asset.getId()))))
            .collect(Collectors.groupingBy(Map.Entry::getKey,
                Collectors.averagingDouble(Map.Entry::getValue)))
            .entrySet().stream()
            .map(e -> new TopRatedDTO(e.getKey(), e.getValue()))
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .collect(Collectors.toList());
    }
    public List<TopRatedDTO> findTopRatedTag() {
        return getAllAssets().stream()
            .filter(asset -> asset.getTags() != null && !asset.getTags().isEmpty())
            .flatMap(asset -> asset.getTags().stream()
                .map(tag -> Map.entry(tag.getName(), ratingService.getOverallRating(asset.getId()))))
            .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.averagingDouble(Map.Entry::getValue)))
            .entrySet().stream()
            .map(e -> new TopRatedDTO(e.getKey(), e.getValue()))
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .collect(Collectors.toList());
    }

    public List<TopRatedDTO> findAllRatedCategories() {
        return getAllAssets().stream()
            .filter(asset -> asset.getCategories() != null && !asset.getCategories().isEmpty())
            .flatMap(asset -> asset.getCategories().stream()
                .map(cat -> Map.entry(cat.getName(), ratingService.getOverallRating(asset.getId()))))
            .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.averagingDouble(Map.Entry::getValue)))
            .entrySet().stream()
            .map(e -> new TopRatedDTO(e.getKey(), e.getValue()))
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .collect(Collectors.toList());
    }
    public List<TopRatedDTO> findAllRatedTags() {
        return getAllAssets().stream()
            .filter(asset -> asset.getTags() != null && !asset.getTags().isEmpty())
            .flatMap(asset -> asset.getTags().stream()
                .map(tag -> Map.entry(tag.getName(), ratingService.getOverallRating(asset.getId()))))
            .collect(Collectors.groupingBy(Map.Entry::getKey, Collectors.averagingDouble(Map.Entry::getValue)))
            .entrySet().stream()
            .map(e -> new TopRatedDTO(e.getKey(), e.getValue()))
            .sorted((a, b) -> Double.compare(b.getAverageRating(), a.getAverageRating()))
            .collect(Collectors.toList());
    }
    public List<Asset> getAssetsByType(String type) {
    	List<Asset> rawResults = assetRepository.findByType(type.toUpperCase());

        return rawResults.stream()
            .filter(asset -> asset != null && asset.getId() != null)
            .collect(Collectors.toList());
    }
    
    public List<Asset> filterAssets(String type, String name, String publisher, Status status,
            Framework framework, Format format, ProjectType projectType) {
			List<Asset> allAssets = assetRepository.findAll();
			
			return allAssets.stream()
			.filter(asset -> asset.getParentAsset() == null)
			.filter(asset -> type == null || asset.getClass().getSimpleName().equalsIgnoreCase(type))
			.filter(asset -> name == null || asset.getName().equalsIgnoreCase(name))
			.filter(asset -> publisher == null || asset.getPublisher().equalsIgnoreCase(publisher))
			.filter(asset -> status == null || asset.getStatus() == status)
			
			// Widget filters
			.filter(asset -> {
			if (framework == null || !(asset instanceof Widget)) return true;
			return ((Widget) asset).getFramework() == framework;
			})
			
			// Sheet filters
			.filter(asset -> {
			if (format == null || !(asset instanceof Sheet)) return true;
			return ((Sheet) asset).getFormat() == format;
			})
			
			// Template filters
			.filter(asset -> {
			if (projectType == null || !(asset instanceof Template)) return true;
			return ((Template) asset).getProjectType() == projectType;
			})
			
			.collect(Collectors.toList());
	}
	    public List<String> getDistinctNamesByType(String type) {
	        return assetRepository.findDistinctNamesByType(type).stream()
	            .filter(Objects::nonNull)
	            .distinct()
	            .toList();
	    }
	    public List<String> getDistinctPublishersByType(String type) {
	        return assetRepository.findDistinctPublishersByType(type).stream()
	            .filter(Objects::nonNull)
	            .distinct()
	            .toList();
	    }



}