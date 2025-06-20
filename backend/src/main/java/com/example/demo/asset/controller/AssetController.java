package com.example.demo.asset.controller;

import com.example.demo.asset.model.Asset;

import com.example.demo.asset.model.AssetReleases;
import com.example.demo.asset.model.Framework;
import com.example.demo.asset.model.Status;
import com.example.demo.asset.model.Tag;
import com.example.demo.asset.service.AssetService;
import com.example.demo.dto.AssetReleaseDto;
import com.example.demo.dto.AssetReleaseRequest;
import com.example.demo.dto.AssetRequest;

import jakarta.annotation.Resource;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
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
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<Asset> createAsset(
            @RequestPart("request") AssetRequest request,
            @RequestPart(value = "documentation", required = false) MultipartFile documentation,
            @RequestParam(value = "image", required = false) MultipartFile imageFile
    ) {
        Asset createdAsset = assetService.createAssetWithFile(request, documentation,imageFile);
        return ResponseEntity.ok(createdAsset);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<Asset> updateAsset(@PathVariable("id") String id, @RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.updateAsset(id, asset));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<Void> deleteAsset(@PathVariable("id") String id) {
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/release/full")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<Asset> uploadAssetRelease(@RequestBody AssetReleaseRequest request) {
        Asset release = assetService.uploadAssetRelease(request);
        return ResponseEntity.ok(release);
    }
    //@GetMapping("/{assetId}/releases")
    //public ResponseEntity<List<AssetReleases>> getReleasesByAsset(@PathVariable String assetId) {
      //  List<AssetReleases> releases = assetService.getReleasesByAsset(assetId);
        //return ResponseEntity.ok(releases);
    //}
    
    @GetMapping("/{assetId}/releases")
    public ResponseEntity<List<AssetReleaseDto>> getReleases(@PathVariable String assetId) {
        return ResponseEntity.ok(assetService.getReleasesByAsset(assetId));
    }


    /*@PostMapping("/{assetId}/releases")
    public ResponseEntity<AssetReleases> addRelease(
            @PathVariable("assetId") String assetId,
            @RequestBody AssetReleases release) {
        Asset asset = assetService.getAssetById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        release.setAsset(asset);
        return ResponseEntity.ok(assetService.saveRelease(release));
    }*/
    
    @PostMapping("/releases/docs/upload")
    @PreAuthorize("hasRole('CONTRIBUTOR')")
    public ResponseEntity<String> uploadReleaseDoc(@RequestParam("file") MultipartFile file) {
        String path = assetService.uploadReleaseDocumentation(file);
        return ResponseEntity.ok(path); // returns string like "/docs/filename.pdf"
    }


    @GetMapping("/filter")
    public List<Asset> filterAssets(
        @RequestParam(name = "tag", required = false) Tag tag,
        @RequestParam(name = "framework", required = false) Framework framework,
        @RequestParam(name = "status", required = false) Status status
    ) {
        return assetService.filterAssets(tag, framework, status);
    }
    @GetMapping("/recommendations")
    public ResponseEntity<List<Asset>> getRecommendedAssets() {
        return ResponseEntity.ok(assetService.getRecommendedAssets());
    }
    @GetMapping("/categories/{categoryId}/assets")
    public ResponseEntity<List<Asset>> getAssetsByCategory(@PathVariable Long categoryId) {
        List<Asset> assets = assetService.getAssetsByCategory(categoryId);
        return ResponseEntity.ok(assets);
    }
    @GetMapping("/recommended")
    public ResponseEntity<List<Asset>> getRecommendedAssets(@RequestParam Long userId) {
        List<Asset> recommended = assetService.getRecommendedAssetsForUser(userId);
        return ResponseEntity.ok(recommended);
    }
    @PutMapping("/{id}/download")
    public ResponseEntity<Void> incrementDownload(@PathVariable String id) {
        assetService.incrementDownloadCount(id);
        return ResponseEntity.ok().build();
    }



}