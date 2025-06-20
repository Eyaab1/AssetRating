package com.example.demo.admin;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.analytics.TopRatedDTO;
import com.example.demo.asset.model.Asset;
import com.example.demo.asset.model.AssetReleases;
import com.example.demo.asset.model.Format;
import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.ProjectType;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.service.AssetService;
import com.example.demo.dto.AssetReleaseDto;
import com.example.demo.dto.AssetReleaseRequest;
import com.example.demo.dto.AssetRequest;
import com.example.demo.analytics.analyticsService;
@RestController
@RequestMapping("/admin/assets")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminAssetController {
    private final AssetService assetService;
    private final analyticsService analyticsService;

    public AdminAssetController(AssetService assetService, analyticsService analyticsService) {
        this.assetService = assetService;
        this.analyticsService=analyticsService;
    }

    @GetMapping("/type/{type}")
    public List<Asset> getAssetsByType(@PathVariable String type) {
    	return assetService.getAssetsByType(type);
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable("id") String id) {
        Optional<Asset> asset = assetService.getAssetById(id);
        return asset.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Asset> createAsset(
            @RequestPart("request") AssetRequest request,
            @RequestPart(value = "documentation", required = false) MultipartFile documentation,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        Asset createdAsset = assetService.createAssetWithFile(request, documentation,imageFile);
        return ResponseEntity.ok(createdAsset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable("id") String id, @RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.updateAsset(id, asset));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable("id") String id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/release/full")
    public ResponseEntity<Asset> uploadAssetRelease(@RequestBody AssetReleaseRequest request) {
        Asset release = assetService.uploadAssetRelease(request);
        return ResponseEntity.ok(release);
    }

    @PostMapping("/releases/docs/upload")
    public ResponseEntity<String> uploadReleaseDoc(@RequestParam("file") MultipartFile file) {
        String path = assetService.uploadReleaseDocumentation(file);
        return ResponseEntity.ok(path);
    }

    @GetMapping("/{assetId}/releases")
    public ResponseEntity<List<AssetReleaseDto>> getReleasesByAsset(@PathVariable String assetId) {
        List<AssetReleaseDto> releases = assetService.getReleasesByAsset(assetId);
        return ResponseEntity.ok(releases);
    }
    @GetMapping("/filter")
    public ResponseEntity<List<Asset>> filterAssets(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String publisher,
            @RequestParam(required = false) Status status,

            // Widget-specific
            @RequestParam(required = false) Framework framework,

            // Sheet-specific
            @RequestParam(required = false) Format format,

            // Template-specific
            @RequestParam(required = false) ProjectType projectType
    ) {
        List<Asset> result = assetService.filterAssets(type, name, publisher, status, framework, format, projectType);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/distinct/names")
    public ResponseEntity<List<String>> getDistinctAssetNames(@RequestParam String type) {
        return ResponseEntity.ok(assetService.getDistinctNamesByType(type));
    }

    @GetMapping("/distinct/publishers")
    public ResponseEntity<List<String>> getDistinctPublishers(@RequestParam String type) {
        return ResponseEntity.ok(assetService.getDistinctPublishersByType(type));
    }

    @GetMapping("/top-rated")
    public List<TopRatedDTO> getTopRatedAssets() {
        return analyticsService.getTopRatedAssets();
    }

    @GetMapping("/upload-trend")
    public Map<String, Long> getUploadTrend() {
        return analyticsService.getAssetUploadTrend();
    }

    @GetMapping("/status-breakdown")
    public Map<String, Long> getAssetStatusDistribution() {
        return analyticsService.getAssetStatusDistribution();
    }
    @GetMapping("/most-downloaded")
    public ResponseEntity<Asset> getMostDownloadedAsset() {
        return ResponseEntity.ok(analyticsService.getMostDownloadedAsset());
    }
    @GetMapping("/top-sentiment-assets")
    public ResponseEntity<Map<String, List<String>>> getTopAssetsBySentiment() {
        return ResponseEntity.ok(analyticsService.getTopAssetsBySentiment());
    }
    
    @GetMapping("/reviewactivity")
    public ResponseEntity<Map<String, Long>> getReviewActivityTrend() {
        return ResponseEntity.ok(analyticsService.getReviewActivityTrend());
    }

    @GetMapping("/ratingactivity")
    public ResponseEntity<Map<String, Long>> getRatingVolumeTrend() {
        return ResponseEntity.ok(analyticsService.getRatingVolumeTrend());
    }


}
